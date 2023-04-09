import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Light from "../../Wolfie2D/Nodes/Graphics/Light";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";

import { HW2Events } from "../HW2Events";
import { MineAnimations } from "./MineBehavior";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW2Layers } from "../scenes/HW2Scene";
import Color from "../../Wolfie2D/Utils/Color";

export enum projectileBehaviors {
    none,
    left,
    atCurrentPos,
    atFuturePos,
    upAndDown,
    random,
    laser,
}

export enum projectileSplits {
    none,

}

/**
 * A class that represents the behavior of the bubbles in the HW2Scene
 * @author PeteyLumpkins
 */
export default class ProjectileBehavior implements AI {
    // The GameNode that owns this behavior
    private owner: AnimatedSprite;

    private receiver: Receiver;
    private emitter: Emitter;

    private behavior: number;
    private src: AnimatedSprite;
    private srcpos : Vec2;
    private dst: Vec2;
    private player: AnimatedSprite;
    private projectileSpeed: number;
    private projectileLaserLength: number;
    private laserTimer: number = 0;
    private invincible: boolean;
    private light: Light;
    private splitX: number;

    public initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;

        this.receiver = new Receiver();
        //this.receiver.subscribe(HW2Events.PLAYER_BUBBLE_COLLISION);
        this.receiver.subscribe(HW2Events.LASER_PROJECTILE_COLLISION);

        this.emitter = new Emitter();

        this.activate(options);
    }

    public destroy(): void {
    }

    public activate(options: Record<string, any>): void {
        this.behavior = options.behavior;
        this.src = options.src;
        if(options.dst != null)
            this.dst = options.dst.clone();
        else if(options.player != null)
            this.dst = options.player.position.clone();
        this.projectileSpeed = options.projectileSpeed;
        this.projectileLaserLength = options.projectileLaserLength;
        this.player = options.player;
        this.splitX = options.splitX;
        this.invincible = options.invincible;
        //console.log(options);

        if(this.src != null)
        {
            this.owner.position = this.src.position.clone();
            this.srcpos = this.src.position.clone();
        }

        if(this.behavior != null)
        {
            if(options.light != null)
            {
                this.light = options.light;
            }else
            {
                this.light = this.owner.getScene().add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: this.owner.position.clone(), 
																					angle : 0,
																					intensity : 0.3,
																					distance : 1000,
																					tintColor : Color.RED,
																					angleRange : new Vec2(360, 360),
																					opacity : 0.5,
																					lightScale : 0.1}) as Light;
            }
        }

        //TODO HARDCODED SPEED
        if(this.behavior == projectileBehaviors.atFuturePos)
        {
            let delta = this.dst.clone().sub(this.srcpos);
            let vr = -1 * Math.sin(this.player.rotation) * 300;

            // Calculate the time a bullet will collide
            // if it's possible to hit the target.
            let deltaTime = this.AimAhead(delta, new Vec2(0, vr), this.projectileSpeed);

            // If the time is negative, then we didn't get a solution.
            if(deltaTime > 0){
                // Aim at the point where the target will be at the time of the collision.
                this.dst.add(new Vec2(0, vr*deltaTime));
            }
        }
        if(this.behavior == projectileBehaviors.random)
        {
            //HARDCODED WORLDSIZE
            this.dst = new Vec2(this.player.position.x, RandUtils.randInt(0, 900));
        }
        if(this.behavior == projectileBehaviors.left)
        {
            this.dst = new Vec2(this.owner.position.x - 100, this.owner.position.y);
        }


        this.owner.animation.playIfNotAlready(MineAnimations.IDLE, true);


        this.receiver.ignoreEvents();
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case HW2Events.PLAYER_BUBBLE_COLLISION: {
                let id = event.data.get("id");
                if (id === this.owner.id) {
                    this.owner.visible = false;
                    this.owner.position.copy(Vec2.ZERO);
                }
                break;
            }
            case HW2Events.LASER_PROJECTILE_COLLISION: {
                let id = event.data.get("projectileId");
                if (id === this.owner.id && !this.invincible) {
                    this.owner.visible = false;
                    if(this.light != null)
                        this.light.visible = false;
                }
                break;
            }
            default: {
                throw new Error("Unhandled event caught in BubbleBehavior! Event type: " + event.type);
            }
        }
    }

    public update(deltaT: number): void {   
        // Only update the bubble if it's visible
        if (this.owner.visible) {

            while (this.receiver.hasNextEvent()) {
                this.handleEvent(this.receiver.getNextEvent());
            }

            switch(this.behavior)
            {
                case projectileBehaviors.left:
                    //this.owner.position.add(Vec2.LEFT.scale(this.projectileSpeed * deltaT));
                    //this.owner.position.add(Vec2.LEFT.scale(this.projectileSpeed * deltaT));
                    //break;

                case projectileBehaviors.atCurrentPos:
                case projectileBehaviors.atFuturePos:
                case projectileBehaviors.random:
                case projectileBehaviors.upAndDown:
                    this.owner.position.add(this.srcpos.clone().sub(this.dst).normalize().scale(-1 * this.projectileSpeed * deltaT)); //this could be done at init
                    break;

                case projectileBehaviors.laser:
                    if(this.laserTimer < this.projectileLaserLength)
                    {
                        this.laserTimer += deltaT;
                        this.owner.position.add(Vec2.LEFT.scale(this.projectileSpeed * deltaT / 2));
                        this.owner.position.set(this.owner.position.x, this.src.position.y);
                        this.owner.size.add(new Vec2(this.projectileSpeed * deltaT / this.owner.scale.x, 0));
                        let test = this.owner.collisionShape as AABB;
                        test.sweep(Vec2.ZERO, this.owner.position, this.owner.sizeWithZoom);
                    }else
                    {
                        this.owner.position.add(Vec2.LEFT.scale(this.projectileSpeed * deltaT));
                    }
                    break;
                
            }


            if(this.light != null)
                this.light.position = this.owner.position;

            if(this.player.collisionShape.overlaps(this.owner.collisionShape))
            {
                this.owner.visible = false;
                this.owner.position.copy(Vec2.ZERO);
                this.emitter.fireEvent(HW2Events.PLAYER_PROJECTILE_COLLISION, {});
                if(this.light != null)
                    this.light.visible = false;
            }

            //WEIRD BUG FIX, hitbox not being updated for some reason
            this.owner.position = this.owner.position;

            if(this.owner.position.x < -50 || this.owner.position.x < this.splitX)
            {
                //delay this one update
                this.owner.visible = false;
                if(this.light != null)
                    this.light.visible = false;

                if(this.owner.position.x < this.splitX)
                {
                    let curAngle = Vec2.LEFT.angleToCCW(this.srcpos.clone().sub(this.dst));
                    for(let x of [-1, -0.5, 0.5, 1])
                    {
                        let newdst = Vec2.ZERO.setToAngle(curAngle+x, 1).add(this.owner.position);
                        this.emitter.fireEvent(HW2Events.SPAWN_PROJECTILE, {projectileInfo: {behavior: projectileBehaviors.atCurrentPos, src: this.owner, dst: newdst, player: this.player,
                                        projectileSpeed: this.projectileSpeed}});

                    }
                }
            }

            // Update position of the bubble - I'm scaling the Vec2.UP and Vec2.LEFT vectors to move the bubble up and to the left
            //this.owner.position.add(Vec2.UP.scale(this.currentYSpeed * deltaT)).add(Vec2.LEFT.scale(this.currentXSpeed* deltaT));
        }
    }

    //Adapted from https://www.gamedeveloper.com/programming/shooting-a-moving-target
    // delta: relative position
    // vr: relative velocity
    // muzzleV: Speed of the bullet (muzzle velocity)
    // returns: Delta time when the projectile will hit, or -1 if impossible
    protected AimAhead(delta : Vec2, vr : Vec2, muzzleV : number) : number{
      // Quadratic equation coefficients a*t^2 + b*t + c = 0
      //float a = Vector3.Dot(vr, vr) - muzzleV*muzzleV;
      let a = vr.dot(vr) - muzzleV*muzzleV;
      //float b = 2f*Vector3.Dot(vr, delta);
      let b = 2 * vr.dot(delta);
      //float c = Vector3.Dot(delta, delta);
      let c = delta.dot(delta);

      let det = b*b - 4*a*c;

      // If the discriminant is negative, then there is no solution
      if(det > 0){
        return 2*c/(Math.sqrt(det) - b);
      } else {
        return -1;
      }
    }
    
}


