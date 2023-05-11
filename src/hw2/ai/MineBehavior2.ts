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
import {AudioKeys} from "../scenes/HW2Scene";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import {projectileInfo, movementInfo} from "../levels/monsterInfo";

export const MineAnimations = {
    IDLE: "IDLE",
    EXPLODING: "EXPLODING",
    INVINCIBLE: "INVINCIBLE",
    WEAKENING: "WEAKENING",
    HALFWEAK: "HALFWEAK",
    TOPWEAK: "TOPWEAK",
    WEAKTODARK: "WEAKTODARK",
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
    private speed: number = 100;
    private direction: Vec2;
    private receiver: Receiver;
    private emitter: Emitter;

    private wideLight: Light;
	private narrowLight: Light;
    private player: AnimatedSprite;
    private monsterState: number = 0;
    private monsterType: number = 0;

 
    private projectiles: Array<projectileInfo>;
    private projectileIndex = 0;
    private projectileTimer: number = 0;

    private movementPatterns: Array<movementInfo>;
    private movementIndex = 0;
    private timeSinceSpawn: number = 0;
    private endMovePattern: boolean = false;

    private movementPattern: number = 0;
    private amplitude: number = 150;
    private period: number = 6.3;
    private offset: number = 0;
    private stoppingX: number = -500;
    private moveTime: number;

    private chargeSoundTimer:number = 0;
    private chargeSoundLength:number = 0.484;

    private closeToPlayer: boolean = false;

    private speedMod: number = 1;


    private splitOnDeath: boolean;


    private weakToLight: boolean = false;
    private timeToWeak: number = 1;

    private timeSincePhased: number;

    private spawnLoc: Vec2;

    private timeSinceLight: number = 0;
    private lightState: number = 0;

    private fallingSpeed: number = 0;
    private gravity: number = 10;
    

    private electricLight: Light;
    private targetBrightness: number;

    public alive:boolean = true;
    private appeared: boolean = false; //Only for electric appear

    private charging: boolean = false;


    private notEnemyList: Array<number>;
    private peakElecBrightness: number;

    private weakAnim: string;
    private invinAnim: string;


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
        this.receiver.subscribe(HW2Events.NODE_DESPAWN);
        this.monsterType = monsterTypes.default;
        this.activate(options);
    }
    /**
     * @see {AI.activate}
     */
    activate(options: Record<string, any>): void {
        this.timeSincePhased = 0;
        this.owner.animation.play(MineAnimations.IDLE, true);
        this.spawnLoc = new Vec2(this.owner.position.x, this.owner.position.y);
        this.notEnemyList = [monsterTypes.stalactite, monsterTypes.stalactiteTop, monsterTypes.stalagmite, monsterTypes.electricField];
        const info = options.monInfo;

        if(options.speedMod != null)
            this.speedMod = options.speedMod;
        console.log(this.speedMod);
        this.alive = true;
        if(info != null)
        {
            this.player = options.player;
            this.narrowLight = options.narrowLight;
            this.wideLight = options.wideLight;
            this.electricLight = options.electricLight;
            this.splitOnDeath = info.splitOnDeath;

            if(this.electricLight != null)
            {
                this.electricLight.visible = true;
                this.monsterState = monsterStates.invincible;
                this.targetBrightness = this.electricLight.intensity;
            }

            if (info.monsterType != null)
                this.monsterType = info.monsterType;

            if (info.weakToLight != null)
                this.weakToLight = info.weakToLight;

            if(info.timeToWeak != null)
                this.timeToWeak = info.timeToWeak;

            this.projectiles = info.projectiles;
            if(this.projectiles != null)
            {
                //start with first
                this.projectileIndex = this.projectiles.length - 1;
                //start time
                this.projectileTimer = this.projectiles[this.projectileIndex].waitTime - 1;
            }

            if(info.movementPatterns != null)
            {
                this.movementPatterns = info.movementPatterns;
                this.setMovementInfo(this.movementPatterns[0]);
            }else
            {
                this.speed = 100 * this.speedMod;
            }
        }
        
        

        this.weakAnim = MineAnimations.IDLE;
        this.invinAnim = MineAnimations.INVINCIBLE;

        if(this.monsterType == monsterTypes.weakFromTop)
        {
            this.monsterState = monsterStates.invincible;
            this.weakAnim = MineAnimations.TOPWEAK;
            this.owner.animation.playIfNotAlready(MineAnimations.TOPWEAK, true);
        }

        if(this.monsterType == monsterTypes.spinning)
        {
            this.weakAnim = MineAnimations.HALFWEAK;
            this.owner.animation.playIfNotAlready(MineAnimations.HALFWEAK, true);
        }

        if(this.weakToLight)
        {
            this.monsterState = monsterStates.invincible;
            this.owner.animation.playIfNotAlready(MineAnimations.INVINCIBLE, true);
        }


        if(this.monsterType == monsterTypes.stalagmite)
        {
            this.monsterState = monsterStates.invincible;
            if(this.owner.position.y < 450)
                this.owner.rotation = Math.PI;
        }
            

        if(this.monsterType == monsterTypes.weakToDark)
        {
            this.monsterState = monsterStates.invincible;
            this.invinAnim = MineAnimations.WEAKTODARK;
            this.owner.animation.playIfNotAlready(this.invinAnim, true);
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
            case HW2Events.NODE_DESPAWN: {
                this.handleNodeDespawn(event);
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
            //prob a bug here when 
            if(this.owner.position.x < 300 && !this.closeToPlayer && !this.notEnemyList.includes(this.monsterType))
            {
                this.movementPattern = movementPatterns.trackPlayer;
                this.moveTime = null;
                this.closeToPlayer = true;
                this.speed = 100;
            }

            if(this.moveTime != null && this.timeSinceSpawn >= this.moveTime)
            {
                if(this.movementPatterns[this.movementIndex].jumpTo != null)
                    this.movementIndex = this.movementPatterns[this.movementIndex].jumpTo;
                else
                    this.movementIndex = (this.movementIndex + 1) % this.movementPatterns.length;
                this.setMovementInfo(this.movementPatterns[this.movementIndex]);
            }


            
            //hacky wait for electric time
            /*
            if(this.monsterType == monsterTypes.electricField && this.owner.position.x < 900 && !this.appeared)
            {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ELECTRICAPPEAR_AUDIO_KEY, loop: false, holdReference: true});
                this.appeared = true;
            }
            */
            this.owner.alpha = 1;
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
                    this.owner.position = new Vec2(this.owner.position.x, this.spawnLoc.y - Math.sin(((this.timeSinceSpawn + this.offset) * 2 * Math.PI) / this.period) * this.amplitude);
                    break;

                case movementPatterns.triangleWave:
                    this.owner.position.add(this.direction.scaled(this.speed * deltaT));
                    //add this to parameters at some point
                    //TODO add offset
                    this.owner.position = new Vec2(this.owner.position.x, this.spawnLoc.y - MathUtils.tri(this.timeSinceSpawn + this.offset, this.period) * this.amplitude);
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
            if(this.monsterType != monsterTypes.stalagmite)
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
                        this.owner.animation.playIfNotAlready(MineAnimations.WEAKENING, true);
                        if(this.timeToWeak > 5)
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYWEAKENINGLOOP_AUDIO_KEY, loop: true, holdReference: true});
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY, loop: false, holdReference: true});

                        this.lightState = lightStates.narrow;
                    }
                    this.timeSinceLight += deltaT;
                }
                else if(this.wideLight.visible && this.checkLightCollision(this.wideLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.wide){
                        this.owner.animation.playIfNotAlready(this.invinAnim, true);
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENINGLOOP_AUDIO_KEY});
                        this.lightState = lightStates.wide;
                        this.monsterState = monsterStates.invincible;
                    }
                    this.timeSinceLight = MathUtils.clamp(this.timeSinceLight - deltaT/4, 0, 1000);
                }
                else
                {
                    if(this.lightState != lightStates.dark){
                        this.owner.animation.playIfNotAlready(this.invinAnim, true);
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENINGLOOP_AUDIO_KEY});
                        this.lightState = lightStates.dark;
                        this.monsterState = monsterStates.invincible;
                    }
                    this.timeSinceLight = MathUtils.clamp(this.timeSinceLight - deltaT/4, 0, 1000);
                }

                //Been in the light long enough
                if(this.timeSinceLight > this.timeToWeak && this.monsterState != monsterStates.weak)
                {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYWEAK_AUDIO_KEY, loop: false, holdReference: false});
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENINGLOOP_AUDIO_KEY});
                    this.emitter.fireEvent(HW2Events.ENEMY_WEAKENED);
                    this.monsterState = monsterStates.weak;
                    this.owner.animation.playIfNotAlready(this.weakAnim, true);
                }
            }


            if(this.monsterType == monsterTypes.weakToDark)
            {
                
                if(this.narrowLight.visible && this.checkLightCollision(this.narrowLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.narrow){
                        this.owner.animation.playIfNotAlready(this.invinAnim, true);
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
                        if(this.monsterState = monsterStates.weak)
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYUNWEAK_AUDIO_KEY, loop: false, holdReference: false});
                        this.monsterState = monsterStates.invincible;
                    }
                    this.lightState = lightStates.narrow;
                }
                else if(this.wideLight.visible && !this.narrowLight.visible && this.checkLightCollision(this.wideLight, this.owner.collisionShape))
                {
                    if(this.lightState != lightStates.wide){
                        this.lightState = lightStates.wide;
                        this.owner.animation.playIfNotAlready(this.invinAnim, true);
                        if(this.monsterState = monsterStates.weak)
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYUNWEAK_AUDIO_KEY, loop: false, holdReference: false});
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
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
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY, loop: false, holdReference: true});

                        this.lightState = lightStates.dark;
                    }

                    this.timeSinceLight += deltaT;

                    if(this.timeSinceLight > 0.35 && this.monsterState != monsterStates.weak)
                    {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYWEAK_AUDIO_KEY, loop: false, holdReference: false});
                        this.monsterState = monsterStates.weak;
                        this.owner.animation.playIfNotAlready(this.weakAnim, true);
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.ENEMYWEAKENING_AUDIO_KEY});
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

                this.electricLight.intensity = MathUtils.clamp(Math.min((100 - (this.owner.position.x - 850))/100, (this.owner.position.x+50)/50), 0, 1) * this.targetBrightness;
                
            }

            //projectiles
            if(this.projectiles != null)
            {
                this.projectileTimer += deltaT;
                if(this.projectileTimer >= this.projectiles[this.projectileIndex].waitTime)
                {
                    this.projectileTimer = 0;
                    this.projectileIndex = (this.projectileIndex + 1) % this.projectiles.length;
                    this.spawnProjectile();
                }
            }

            //electric sound
            if(this.chargeSoundTimer < this.chargeSoundLength)
            {
                this.chargeSoundTimer += deltaT;
                if(this.chargeSoundTimer >= this.chargeSoundLength)
                    this.charging = false;
            }

            this.timeSinceSpawn += deltaT;
        }
    }

    protected spawnProjectile(): void {
        //console.log("mon",this.projectileSplitX);

        if(this.projectiles[this.projectileIndex].behavior != projectileBehaviors.justWait)
        {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYSHOOT_AUDIO_KEY, loop: false, holdReference: false});
            this.emitter.fireEvent(HW2Events.SPAWN_PROJECTILE, {src: this.owner, projectileInfo: this.projectiles[this.projectileIndex]});
        }

    }

    protected setMovementInfo(info: movementInfo): void {
        
        if(info.movementPattern != null)
            this.movementPattern = info.movementPattern;
        else
            this.movementPattern = movementPatterns.moveLeft;

        if(info.moveDistance != null)
            this.stoppingX = Math.min(900, this.owner.position.x) - info.moveDistance;
        else
            this.stoppingX = -500;

        if(info.amplitude != null)
        {
            this.amplitude = info.amplitude;
        }else
            this.amplitude = 150;

        if(info.period != null)
            this.period = info.period;
        else
            this.period = 6.3;

        if(info.offset != null)
            this.offset = info.offset;
        else
            this.offset = 0;

        if(info.speed != null)
            this.speed = info.speed * this.speedMod;
        else{
            this.speed = 100 * this.speedMod;
        }

        if(info.setY != null)
        {
            console.log("setY");
            this.owner.position = new Vec2(this.owner.position.x, info.setY);
        }

        this.timeSinceSpawn = 0;
        this.spawnLoc = new Vec2(this.owner.position.x, this.owner.position.y);
            

        this.moveTime = info.length;
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
                    //create falling stalactite
                    this.movementPattern = movementPatterns.falling;
                    break;
                case monsterTypes.spinning:
                    if(this.monsterState == monsterStates.weak)
                    {
                        //Assuming only hit from leftside which is ok I think
                        let angle = Math.atan2((this.owner.position.y - hit.pos.y), (this.owner.position.x - hit.pos.x))*-1 + Math.PI;
                        console.log("current Angles: (" + ((Math.PI/2 + this.owner.rotation) % (2 * Math.PI)).toString(), ", " + (((3 * Math.PI)/2 + this.owner.rotation) % (2 * Math.PI)).toString() + ")");
                        console.log("shotangle", angle);
                        if(angle > (Math.PI/2 + this.owner.rotation) % (2 * Math.PI)   &&    angle < ((3 * Math.PI)/2 + this.owner.rotation) % (2 * Math.PI))
                        {
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HITENEMY_AUDIO_KEY, loop: false, holdReference: false});
                            this.monsterDeath();
                        }else
                        {
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYDEFLECTED_AUDIO_KEY, loop: false, holdReference: false});
                        }
                    }
                    break;
                default:
                    if(this.monsterState == monsterStates.weak){
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HITENEMY_AUDIO_KEY, loop: false, holdReference: false});
                        this.monsterDeath();
                    }else
                    {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYDEFLECTED_AUDIO_KEY, loop: false, holdReference: false});
                    }
                    break;
                
            }
        }
    }

    protected handleMineExploded(event: GameEvent): void {
        let id = event.data.get("owner");
        if (id === this.owner.id) {
            this.owner.position.copy(Vec2.ZERO);
            this.owner.visible = false;
        }
    }

    protected handlePlayerMineCollision(event: GameEvent): void {
        let id = event.data.get("id");
        if (id === this.owner.id) {
            if(this.monsterType == monsterTypes.electricField)
            {
                if(!this.charging)
				{
					this.charging = true;
                    this.chargeSoundTimer = 0;
					this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.RECHARGING_AUDIO_KEY, loop: false, holdReference: false});
				}
            }
            else if(this.alive)
            {
                //maybe change this?
                this.monsterDeath();
            }
        }
    }

    protected handleMonsterStalactitleCollision(event: GameEvent): void {
        let stalactiteID = event.data.get("stalactiteID");
        let monsterID = event.data.get("monsterID");
        if (stalactiteID === this.owner.id) {
            //this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
            this.owner.visible = false;
        }else if (monsterID === this.owner.id)
        {
            if(this.monsterState == monsterStates.weak || this.monsterType == monsterTypes.weakFromTop)
            {
                this.monsterDeath();
            }
        }
    }


    protected monsterDeath(): void {
        console.log("death");
        this.alive = false;
        this.movementPattern = movementPatterns.moveLeft;
        this.owner.animation.playIfNotAlready(MineAnimations.EXPLODING, false, HW2Events.MINE_EXPLODED);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.ENEMYDEAD_AUDIO_KEY, loop: false, holdReference: false});
    }

    protected handleNodeDespawn(event: GameEvent): void {
        let id = event.data.get("id");
        if (id === this.owner.id) {
            if(this.monsterType == monsterTypes.electricField)
            {
                this.electricLight.visible = false;
            }
            this.owner.visible = false;
        }
    }
}





