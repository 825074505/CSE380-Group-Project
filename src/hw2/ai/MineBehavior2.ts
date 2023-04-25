import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import { HW2Events } from "../HW2Events";
import { HW2Layers } from "../scenes/HW2Scene";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Light from "../../Wolfie2D/Nodes/Graphics/Light";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import ProjectileBehavior, {projectileBehaviors} from "./ProjectileBehavior";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Color from "../../Wolfie2D/Utils/Color";

export const MineAnimations = {
    IDLE: "IDLE",
    EXPLODING: "EXPLODING",
    INVINCIBLE: "INVINCIBLE",
    WEAKENING: "WEAKENING",
    HALFWEAK: "HALFWEAK",
    TOPWEAK: "TOPWEAK",
} as const;

export enum movementPatterns {
    moveLeft,
    trackPlayer,
    sineWave,
    triangleWave,
    runAway,
    phasing,
    falling,
}

export enum monsterStates {
    weak,
    invincible
}

export enum monsterTypes {
    default,
    weakToLight,
    weakToDark,
    spinning,
    weakFromTop,
    stalactite,
    stalactiteTop,
    stalagmite,
    electricField
}

enum lightStates {
    dark,
    wide,
    narrow
}

/**
 * A class that represents a set of behavior for the mines.
 * @author PeteyLumpkins
 */
export default class MineBehavior2 implements AI {
    private owner: AnimatedSprite;
    private speed: number;
    private direction: Vec2;
    private receiver: Receiver;
    private emitter: Emitter;

    private wideLight: Light;
	private narrowLight: Light;
    private player: AnimatedSprite;
    private movementPattern: number = 0;
    private monsterState: number = 0;
    private monsterType: number = 0;

    private projectileBehavior: number = 0;
    private projectileSpeed: number = 0;
    private projectileFrequency: number = 3; //seconds
    private projectileLaserLength: number = 1;
    private projectileTimer: number = 0;
    private projectileSplitX: number;
    private projectileInvincible: boolean;

    private splitOnDeath: boolean;


    private weakToLight: boolean = false;
    private stoppingX: number = -500;

    private timeSincePhased: number;

    private spawnLoc: Vec2;

    private timeSinceLight: number = 0;
    private lightState: number = 0;

    private fallingSpeed: number = 0;
    private gravity: number = 10;

    private electricLight: Light;

    /**
     * @see {AI.initializeAI}
     */
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.LEFT;

        this.emitter = new Emitter();
        this.receiver = new Receiver();
        this.receiver.subscribe(HW2Events.LASER_MINE_COLLISION);
        this.receiver.subscribe(HW2Events.MINE_EXPLODED);
        this.receiver.subscribe(HW2Events.PLAYER_MINE_COLLISION);
        this.receiver.subscribe(HW2Events.ENEMY_STALACTITE_COLLISION);
        this.monsterType = monsterTypes.default;
        this.activate(options);
    }
    /**
     * @see {AI.activate}
     */
    activate(options: Record<string, any>): void {
        this.speed = 100;
        this.timeSincePhased = 0;
        this.owner.animation.play(MineAnimations.IDLE, true);
        this.spawnLoc = new Vec2(this.owner.position.x, this.owner.position.y);
        this.movementPattern = options.movementPattern;
        this.player = options.player;
        this.narrowLight = options.narrowLight;
        this.wideLight = options.wideLight;
        this.electricLight = options.electricLight;
        this.projectileInvincible = options.projectileInvincible;
        this.splitOnDeath = options.splitOnDeath;

        if(this.electricLight != null)
        {
            this.electricLight.visible = true;
            this.monsterState = monsterStates.invincible;
        }

        if (options.monsterType != null)
            this.monsterType = options.monsterType;

        if (options.weakToLight != null)
            this.weakToLight = options.weakToLight;

        if(options.stoppingX != null)
            this.stoppingX = options.stoppingX;

        if(options.projectileBehavior != null)
            this.projectileBehavior = options.projectileBehavior;

        if(options.projectileSpeed != null)
            this.projectileSpeed = options.projectileSpeed;

        if(options.projectileFrequency != null)
            this.projectileFrequency = options.projectileFrequency;

        if(options.projectileLaserLength != null)
            this.projectileLaserLength = options.projectileLaserLength;
        //TODO rest of projectile vars also maybe reconsider this
        if(this.projectileBehavior == projectileBehaviors.laser)
            this.projectileFrequency += this.projectileLaserLength;
            
        this.projectileSplitX = options.projectileSplitX;
            



        if(this.weakToLight || this.monsterType == monsterTypes.weakToDark)
        {
            this.monsterState = monsterStates.invincible;
            this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
        }

        if(this.monsterType == monsterTypes.spinning)
        {
            this.owner.animation.playIfNotAlready(MineAnimations.HALFWEAK, true);
        }

        if(this.monsterType == monsterTypes.weakFromTop)
        {
            this.monsterState = monsterStates.invincible;
            this.owner.animation.playIfNotAlready(MineAnimations.TOPWEAK, true);
        }


        this.timeSinceLight = 0;
        //this.owner.position = new Vec2(800, 450);
        //console.log("activated");
        this.receiver.ignoreEvents();
    }
    /**
     * @see {AI.handleEvent}
     */
    handleEvent(event: GameEvent): void { 
        switch(event.type) {
            case HW2Events.LASER_MINE_COLLISION: {
                this.handleLaserMineCollision(event);
                break;
            }
            case HW2Events.MINE_EXPLODED: {
                this.handleMineExploded(event);
                break;
            }
            case HW2Events.PLAYER_MINE_COLLISION: {
                this.handlePlayerMineCollision(event);
                break;
            }
            case HW2Events.ENEMY_STALACTITE_COLLISION: {
                this.handleMonsterStalactitleCollision(event);
                break;
            }
            default: {
                throw new Error("Unhandled event in MineBehavior! Event type: " + event.type);
            }
        }
    }

    /**
     * @see {Updatable.update}
     */
    update(deltaT: number): void {
        //console.log(this.movementPattern);
        //console.log(this.timeSincePhased);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // If the mine is visible - update the position
        if (this.owner.visible) {
            //this.owner.position.add(this.direction.scaled(this.speed * deltaT));
            
            //Movement

            //Make the enemies chase the player if they get close, commented out for testing reasons but this works
            /*
            if(this.owner.position.x < 200 && this.movementPattern != movementPatterns.trackPlayer)
            {
                this.movementPattern = movementPatterns.trackPlayer;
            }
            */

            switch(this.movementPattern)
            {
                case movementPatterns.moveLeft:
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    break;

                case movementPatterns.trackPlayer:
                    this.direction = new Vec2(this.player.position.x - this.owner.position.x, this.player.position.y - this.owner.position.y);
                    this.owner.position.add(this.direction.normalize().scaled(this.speed * deltaT));
                    break;

                case movementPatterns.sineWave:
                    //should be set to left
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    //add this to parameters at some point
                    //TODO add offset for sin so its random
                    const sineRange = 150;
                    this.owner.position = new Vec2(this.owner.position.x, this.spawnLoc.y + Math.sin(this.owner.position.x/71) * sineRange);
                    break;

                case movementPatterns.triangleWave:
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    //add this to parameters at some point
                    //TODO add offset
                    const triRange = 400;
                    this.owner.position = new Vec2(this.owner.position.x, this.spawnLoc.y + MathUtils.tri(this.owner.position.x + 450/4, 450) * triRange);
                    break;

                case movementPatterns.runAway:
                    this.direction = new Vec2(-1, -1 * Math.sign(this.player.position.y - this.owner.position.y));
                    this.owner.position.add(this.direction.normalize().scaled(this.speed * deltaT));
                    break;

                case movementPatterns.phasing:
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    this.timeSincePhased += deltaT;
                    this.owner.alpha = (MathUtils.tri(this.timeSincePhased, 2) + 1)/2;
                    if(this.timeSincePhased > 2)
                    {
                        this.owner.position = new Vec2(this.owner.position.x, RandUtils.randInt(0, 900)); //HARDCODED WORLDSIZE
                        this.timeSincePhased = 0;
                    }
                    break;

                case movementPatterns.falling:
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    this.fallingSpeed += this.gravity; //clamp this
                    this.owner.position.add(Vec2.DOWN.scaled(this.fallingSpeed * deltaT));
                    break;

            }
            //clamp Positions TODO unhardcode canvas size
            //
            this.owner.position = new Vec2(MathUtils.clamp(this.owner.position.x, this.stoppingX, 3000), MathUtils.clamp(this.owner.position.y, 20, 880));


            //gonna refactor this eventually with some functions that handle state changes and reduce repeated code
            //Detect if in Light  -  Only check for appropriate types of enemy
            //console.log("hi");
            //ABSTRACT OUT ANIMATIONS SO THAT EACH ENEMY TYPE HAS EACH APPROPRIATE SPRITE
            if(this.weakToLight && this.monsterState != monsterStates.weak)
            {
                if(this.narrowLight.visible && this.checkLightCollision(this.narrowLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.narrow){
                        this.timeSinceLight = 0;
                        this.owner.animation.playIfNotAlready(MineAnimations.WEAKENING, true);
                        this.lightState = lightStates.narrow;
                    }
                    this.timeSinceLight += deltaT;
                }
                else if(this.wideLight.visible && this.checkLightCollision(this.wideLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.wide){
                        this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
                        this.lightState = lightStates.wide;
                        this.monsterState = monsterStates.invincible;
                    }
                }
                else
                {
                    if(this.lightState != lightStates.dark){
                        this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
                        this.lightState = lightStates.dark;
                        this.monsterState = monsterStates.invincible;
                    }
                }

                if(this.timeSinceLight > 1 && this.monsterState != monsterStates.weak)
                {
                    this.monsterState = monsterStates.weak;
                    this.owner.animation.playIfNotAlready(MineAnimations.IDLE, true);
                }
            }


            if(this.monsterType == monsterTypes.weakToDark)
            {
                
                if(this.narrowLight.visible && this.checkLightCollision(this.narrowLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.narrow){
                        this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
                        this.monsterState = monsterStates.invincible;
                    }
                    this.lightState = lightStates.narrow;
                }
                else if(this.wideLight.visible && !this.narrowLight.visible && this.checkLightCollision(this.wideLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.wide){
                        this.lightState = lightStates.wide;
                        this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
                        this.monsterState = monsterStates.invincible;
                    }
                }
                else
                {
                    //Has to has a transition or else the shot shutting off the light will make him vulnerable
                    if(this.lightState != lightStates.dark)
                    {
                        this.timeSinceLight = 0.0;
                        this.owner.animation.playIfNotAlready(MineAnimations.WEAKENING, true);
                        this.lightState = lightStates.dark;
                    }

                    this.timeSinceLight += deltaT;

                    if(this.timeSinceLight > 0.1 && this.monsterState != monsterStates.weak)
                    {
                        this.monsterState = monsterStates.weak;
                        this.owner.animation.playIfNotAlready(MineAnimations.IDLE, true);
                    }
                }
                
            }

            if(this.monsterType == monsterTypes.spinning)
            {
                this.owner.rotation += 0.04; //Make a parameter
            }

            if(this.monsterType == monsterTypes.electricField)
            {
                this.electricLight.position = this.owner.position.clone();
            }

            //projectiles
            if(this.projectileBehavior != projectileBehaviors.none)
            {
                this.projectileTimer += deltaT;
                if(this.projectileTimer >= this.projectileFrequency)
                {
                    this.projectileTimer = 0;
                    this.spawnProjectile();
                }
            }

        }
    }

    protected spawnProjectile(): void {
        //console.log("mon",this.projectileSplitX);
        this.emitter.fireEvent(HW2Events.SPAWN_PROJECTILE, {projectileInfo: {behavior: this.projectileBehavior, src: this.owner, player: this.player,
                                        projectileSpeed: this.projectileSpeed, projectileFrequency: this.projectileFrequency, projectileLaserLength: this.projectileLaserLength,
                                        splitX: this.projectileSplitX, invincible: this.projectileInvincible}});


    }

    /**
     * @see {AI.destroy}
     */
    destroy(): void { 
        this.receiver.destroy();
    }  

    protected checkLightCollision(light : Light, collisionShape : Shape): boolean{
        let hitbox = collisionShape.getBoundingRect();
        //May be an overkill amount of ray casts
        //Could probably do a triangle AABB test instead but whatever
        for(let angle = MathUtils.toRadians(light.angleRange.x/2) + light.angle; angle > MathUtils.toRadians(light.angleRange.x/2) * -1 + light.angle; angle -= 0.05)
        {
            if(hitbox.intersectSegment(light.position, new Vec2(1200, Math.tan(angle)*1200 * -1)))
                return true;
        }
        return hitbox.intersectSegment(light.position, new Vec2(1200, Math.tan(MathUtils.toRadians(light.angleRange.x/2) * -1 + light.angle)*1200 * -1)) != null;
    }

    protected handleLaserMineCollision(event: GameEvent): void {
        let id = event.data.get("mineId");
        let hit = event.data.get("hit");
        if (id === this.owner.id) {
            switch(this.monsterType)
            {
                case monsterTypes.stalactite:
                    this.movementPattern = movementPatterns.falling;
                    break;
                case monsterTypes.spinning:
                    if(this.monsterState == monsterStates.weak)
                    {
                        //Assuming only hit from leftside which is ok I think
                        let angle = Math.atan((this.owner.position.y - hit.pos.y)/(this.owner.position.x - hit.pos.x)) + Math.PI;

                        if(angle > (Math.PI/2 + this.owner.rotation) % (2 * Math.PI)   &&    angle < ((3 * Math.PI)/2 + this.owner.rotation) % (2 * Math.PI))
                        {
                            this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
                        }
                    }
                    break;
                default:
                    if(this.monsterState == monsterStates.weak)
                        this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
                    break;
                
            }
        }
    }

    protected handleMineExploded(event: GameEvent): void {
        let id = event.data.get("owner");
        if (id === this.owner.id) {
            this.owner.position.copy(Vec2.ZERO);
            this.owner.visible = false;
            this.emitter.fireEvent(HW2Events.SHOT_WEAKTOLIGHT);
        }
    }

    protected handlePlayerMineCollision(event: GameEvent): void {
        let id = event.data.get("id");
        if (id === this.owner.id) {
            if(this.monsterType != monsterTypes.electricField)
            {
                this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
            }
        }
    }

    protected handleMonsterStalactitleCollision(event: GameEvent): void {
        let stalactiteID = event.data.get("stalactiteID");
        let monsterID = event.data.get("monsterID");
        if (stalactiteID === this.owner.id) {
            this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
        }else if (monsterID === this.owner.id)
        {
            if(this.monsterState == monsterStates.weak || this.monsterType == monsterTypes.weakFromTop)
            {
                this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
            }
        }
    }
}





