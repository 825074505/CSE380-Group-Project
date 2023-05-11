import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Light from "../../Wolfie2D/Nodes/Graphics/Light";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import {AudioKeys} from "../scenes/HW2Scene"

import {monsterTypes} from "./MineBehavior2";

import { HW2Events } from "../HW2Events";
import { HW2Controls } from "../HW2Controls";

export const PlayerAnimations = {
    IDLE: "IDLE",
    HIT: "HIT",
    DEATH: "DEATH"
} as const;

/**
 * A class for controlling the player in the HW2Scene.
 * @author PeteyLumpkins
 */
export default class PlayerController implements AI {
	/** The GameNode that owns this PlayerController AI */
	private owner: AnimatedSprite;

    private currentHealth: number;
    private maxHealth: number;
    private minHealth: number;

    private currentAir: number;
    private maxAir: number;
    private minAir: number;

    private currentSpeed: number;

	private currentAngle: number;

    private currentCharge: number;
    private maxCharge: number;
    private minCharge: number;

	private invincible: boolean;

	/** A timer for charging the player's laser cannon thing */
	private laserTimer: Timer;
	private invinTimer: Timer;
	private airTimer: Timer;

	// A receiver and emitter to hook into the event queue
	private receiver: Receiver;
	private emitter: Emitter;

	private deadSent: boolean;

	private shootTimeOut: boolean = false;
	private laserEnergyCost: number = 3.0;

	private p1: Graphic;
	private p2: Graphic;
	private wideLight: Light;
	private narrowLight: Light;
	private blinkingLight: Light;
	private wideLightTargetIntensity: number;
	private narrowLightTargetIntensity: number;
	private shootLight: Light;
	private maxShootLightIntensity: number = 0.6;
	private planeWings: Sprite;
	private planeWingsMaxSize: number;
	private renderingManager: RenderingManager;

	private wideHeadlightOn: boolean;

	private blinkingLightMaxBrightness: number;
	private blinkingLightMinBrightness: number;
	private blinkingLightBrightnessIncreasing: boolean;
	private blinkingLightSpeed: number = 0.01;

	private hitboxes: Array<Graphic>;

	private lightPressBuffered: boolean = false;

	private charging: boolean = false;

	private infiniteHealth: boolean = false;
	private infiniteBattery: boolean = false;

	private propSound:string = "";

	private flashTimer:number = 0;
	private hitAlpha = 0.25;

	/**
	 * This method initializes all variables inside of this AI class.
     * 
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	public initializeAI(owner: AnimatedSprite, options: Record<string,any>): void {
		this.owner = owner;
		
		this.receiver = new Receiver();
		this.emitter = new Emitter();

		this.laserTimer = new Timer(2500, this.handleLaserTimerEnd, false);
		this.invinTimer = new Timer(750, this.handleInvinTimerEnd, false);
		this.airTimer = new Timer(1000, this.handleAirTimer, true);
		this.airTimer.start();
		
		this.receiver.subscribe(HW2Events.SHOOT_LASER);
		this.receiver.subscribe(HW2Events.PLAYER_MINE_COLLISION);
		this.receiver.subscribe(HW2Events.DEAD);
		this.receiver.subscribe(HW2Events.PLAYER_BUBBLE_COLLISION);
		this.receiver.subscribe(HW2Events.PLAYER_PROJECTILE_COLLISION);
		this.receiver.subscribe("levelcomplete");

		this.activate(options);
	}
	public activate(options: Record<string,any>): void {

        // Set upper and lower bounds on the player's health
        this.minHealth = 0;
        this.maxHealth = 3;

		// Set the player's current health
        this.currentHealth = this.maxHealth;

        // Set the player's current air
        this.currentAir = 20;

        // Set upper and lower bounds on the player's air
        this.minAir = 0;
        this.maxAir = 20;

        this.currentCharge = 4;
        this.minCharge = 0;
        this.maxCharge = 4;

        // Set the player's movement speed
        this.currentSpeed = 300;
		this.currentAngle = 0;

		this.invincible = false;
		this.deadSent = false;

		this.p1 = options.p1;
		this.p2 = options.p2;
		this.p1.visible = false;
		this.p2.visible = false;
		this.wideLight = options.wideLight;
		this.narrowLight = options.narrowLight;
		this.wideLightTargetIntensity = this.wideLight.intensity;
		this.narrowLightTargetIntensity = this.narrowLight.intensity;
		this.planeWings = options.planeWings;
		this.planeWingsMaxSize = this.planeWings.size.y;

		this.hitboxes = options.hitboxes;

		this.blinkingLight = options.blinkingLight;
		this.shootLight = options.shootLight;

		this.blinkingLightBrightnessIncreasing = true;
		this.blinkingLightMaxBrightness = 0.3;
		this.blinkingLightMinBrightness = 0;
		this.renderingManager = options.rm;

        // Play the idle animation by default
		this.owner.animation.play(PlayerAnimations.IDLE);
	};
	/**
	 * Handles updates to the player 
	 * 
	 * @remarks
	 * 
	 * The PlayerController updates the player at every frame (each time the main
	 * GameLoop iterates). 
	 * 
	 * This method should handle all incoming user input events. Things like key-presses, 
	 * mouse-clicks, mouse-downs etc. In addition, this method should handle all events
	 * that the PlayerController's receiver is subscribed to.
	 * 
	 * This method is also responsible for updating the state of the player, and altering
	 * the rest of the game to changes in the state of the player. If the player's stats
	 * change, the UI needs to be notified so that it can reflect those changes. If the 
	 * player is dead, the scene needs to be notified so that it can change to GameOver scene.
	 * 
	 * @param deltaT - the amount of time that has passed since the last update
	 */
	public update(deltaT: number): void {
        // First, handle all events 
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

        // If the player is out of hp - play the death animation
		if(this.owner.visible)
		{

		if (this.currentHealth <= this.minHealth) {
			if(this.deadSent == false)
			{
				this.emitter.fireEvent(HW2Events.DEAD);
				this.deadSent = true;
			}
            return;
        }
		//cheats
		if(Input.isKeyPressed("q"))
		{
			if(Input.isJustPressed(HW2Controls.DISABLE_LIGHTING))
			{
				this.renderingManager.lightingEnabled = !this.renderingManager.lightingEnabled;
				this.emitter.fireEvent("cheat");
			}

			if(Input.isJustPressed(HW2Controls.DISABLE_DOWNSAMPLING))
			{
				this.renderingManager.downsamplingEnabled = !this.renderingManager.downsamplingEnabled;
				this.emitter.fireEvent("cheat");
			}

			if(Input.isKeyJustPressed("i"))
			{
				this.infiniteHealth = !this.infiniteHealth;
				this.currentHealth = this.maxHealth;
				this.emitter.fireEvent(HW2Events.PLAYER_HEALTH_CHANGE, {curhealth: this.currentHealth, maxhealth: this.maxHealth});
				this.emitter.fireEvent("cheat");
			}

			if(Input.isKeyJustPressed("o"))
			{
				this.infiniteBattery = !this.infiniteBattery;
				this.currentAir = this.maxAir;
				this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir});
				this.emitter.fireEvent("cheat");
			}
		}
		//propellerSounds
		if(Input.isKeyJustPressed("a") || Input.isKeyJustPressed("d")  && this.propSound != AudioKeys.PROPELLERUP_AUDIO_KEY)
		{
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.propSound});
			this.propSound = AudioKeys.PROPELLERUP_AUDIO_KEY;
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.propSound, loop: true, holdReference: true});
		}else if(!Input.isKeyPressed("a") && !Input.isKeyPressed("d") && this.propSound != AudioKeys.PROPELLER_AUDIO_KEY)
		{
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.propSound});
			this.propSound = AudioKeys.PROPELLER_AUDIO_KEY;
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.propSound, loop: true, holdReference: true});
		}

		
		// Get the player's input direction 
		let forwardAxis = (Input.isPressed(HW2Controls.MOVE_UP) ? 1 : 0) + (Input.isPressed(HW2Controls.MOVE_DOWN) ? -1 : 0);
		let horizontalAxis = (Input.isPressed(HW2Controls.MOVE_LEFT) ? 1 : 0) + (Input.isPressed(HW2Controls.MOVE_RIGHT) ? -1 : 0);
		let aimingMod = (Input.isPressed(HW2Controls.NARROW_HEADLIGHT) ? 0.4 : 1);
		this.currentAngle = MathUtils.clamp(this.currentAngle + horizontalAxis * 0.05 * aimingMod, -1.5, 1.5);



		// Move the player
		//old
		//let movement = Vec2.UP.scaled(forwardAxis * this.currentSpeed).add(new Vec2(horizontalAxis * this.currentSpeed, 0));
		//new
		let movement = Vec2.UP.scaled(Math.sin(this.currentAngle) * this.currentSpeed) //.add(new Vec2(horizontalAxis * this.currentSpeed, 0));
		this.owner.position.add(movement.scaled(deltaT));

		this.p1.position = this.owner.position.clone();
		this.p2.position = new Vec2(this.owner.position.x + Math.cos(this.currentAngle) * 30, this.owner.position.y - Math.sin(this.currentAngle) * 30);

		this.planeWings.position = this.owner.position.clone();
		this.planeWings.rotation = this.currentAngle;
		this.planeWings.size = new Vec2(this.planeWings.size.x, this.planeWingsMaxSize * Math.abs(Math.sin(this.currentAngle)));

		this.shootLight.position = new Vec2(this.owner.position.x + Math.cos(this.currentAngle) * 50, this.owner.position.y - Math.sin(this.currentAngle) * 50);


		this.wideLight.position = this.p2.position.clone();
		this.wideLight.angle = this.currentAngle;

		this.narrowLight.position = this.p2.position.clone();
		this.narrowLight.angle = this.currentAngle;

		this.owner.rotation = this.currentAngle;

		this.blinkingLight.position = new Vec2(this.owner.position.x-20, this.owner.position.y);


		// Handle trying to shoot a laser from the submarine
		/*
		if (Input.isJustPressed(HW2Controls.SHOOT) && this.currentCharge > 0) {
			this.currentCharge -= 1;
			this.emitter.fireEvent(HW2Events.SHOOT_LASER, {src: this.p2.position, angle: this.currentAngle});
			this.emitter.fireEvent(HW2Events.CHARGE_CHANGE, {curchrg: this.currentCharge, maxchrg: this.maxCharge});
		}
		*/
		if (Input.isJustPressed(HW2Controls.SHOOT) && this.shootTimeOut == false && this.currentAir > this.laserEnergyCost) {
			//this.currentCharge -= 1;
			this.shootTimeOut = true;
			this.wideHeadlightOn = false;
			this.emitter.fireEvent(HW2Events.SHOOT_LASER, {src: this.shootLight.position, angle: this.currentAngle});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.SHOOT_AUDIO_KEY, loop: false, holdReference: false});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.SHOOT2_AUDIO_KEY, loop: false, holdReference: false});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.SHOOT3_AUDIO_KEY, loop: false, holdReference: false});
			if(this.wideLight.visible)
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HEADLIGHTOFF_AUDIO_KEY, loop: false, holdReference: false});
			//this.emitter.fireEvent(HW2Events.CHARGE_CHANGE, {curchrg: this.currentCharge, maxchrg: this.maxCharge});
		}


		//hitbox positions

		//hitbox positions
		for(let i = 2; i < this.hitboxes.length + 2; i++)
		{
			let nx = this.owner.position.x - ((this.owner.size.x/3) - i*(this.owner.size.x/6)) * this.owner.scale.x * Math.cos(this.currentAngle);
			let ny = this.owner.position.y + ((this.owner.size.x/3) - i*(this.owner.size.x/6)) * this.owner.scale.x * Math.sin(this.currentAngle);
			
			this.hitboxes[i-2].position = new Vec2(nx, ny);
		}




		if(Input.isJustPressed(HW2Controls.WIDE_HEADLIGHT) && !this.narrowLight.visible)
		{
			if(this.shootTimeOut == false)
			{
				this.wideLight.visible = !this.wideLight.visible;
				this.wideLightTargetIntensity = 0.3;
				this.narrowLight.visible = false;
				if(this.wideLight.visible)
				{
					this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HEADLIGHTON_AUDIO_KEY, loop: false, holdReference: false});
				}
				else
					this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HEADLIGHTOFF_AUDIO_KEY, loop: false, holdReference: false});
			}else
			{
				this.lightPressBuffered = !this.lightPressBuffered;
			}
		}

		if(this.lightPressBuffered && this.shootTimeOut == false)
		{
			this.wideLight.visible = true;
			this.wideLightTargetIntensity = 0.3;
			this.narrowLight.visible = false;
			this.lightPressBuffered = false;
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HEADLIGHTON_AUDIO_KEY, loop: false, holdReference: false});
		}

		if(Input.isJustPressed(HW2Controls.NARROW_HEADLIGHT) && this.shootTimeOut == false)
		{
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.NARROWLIGHT_AUDIO_KEY, loop: false, holdReference: true});
			this.wideLightTargetIntensity = 0.1;
			this.wideLight.visible = true;
			this.narrowLight.visible = true;
		}

		//check if narrow headlight key was released
		if(!Input.isPressed(HW2Controls.NARROW_HEADLIGHT) && this.narrowLight.visible)
		{
			this.narrowLight.visible = false;
			this.wideLightTargetIntensity = 0.3;
			//this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.NARROWLIGHT_AUDIO_KEY});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.HEADLIGHTON_AUDIO_KEY, loop: false, holdReference: false});
		}

		//scale light intensity when air is low
		this.wideLight.intensity = this.wideLightTargetIntensity * MathUtils.clamp((this.currentAir/this.maxAir)*3, 0, 1);
		this.narrowLight.intensity = this.narrowLightTargetIntensity * MathUtils.clamp((this.currentAir/this.maxAir)*3, 0, 1);

		//this whole thing is kinda gross fix later
		if(this.shootLight.intensity > 0)
		{
			//TODO make it so that the player cant shoot or turn on lights until shootLight intensity hits 0;
			//make this a timer probably this is kinda hacky
			const newIntensity = this.shootLight.intensity - deltaT * (this.maxShootLightIntensity/0.8);
			if(newIntensity <= 0.2 * (this.maxShootLightIntensity/0.8) && this.shootLight.intensity > 0.2 * (this.maxShootLightIntensity/0.8))
			{
				this.shootTimeOut = false;
				/*
				if(Input.isPressed(HW2Controls.WIDE_HEADLIGHT))
				{
					this.wideLight.visible = true;
					this.wideLight.intensity = 0.3;
				}
				*/
			}
			this.shootLight.intensity = MathUtils.clamp(newIntensity, 0, 1);
		}

		// Player looses a little bit of air each frame
		//this.currentAir = MathUtils.clamp(this.currentAir - deltaT, this.minAir, this.maxAir);

		//this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir});

		if(!this.infiniteBattery)
		{
			const oldAir = this.currentAir;
			if(this.narrowLight.visible)
			{
				this.currentAir = MathUtils.clamp(this.currentAir - 0.02 * (deltaT * 60), this.minAir, this.maxAir);
				this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir, oldair: oldAir});
			}else if(this.wideLight.visible)
			{
				this.currentAir = MathUtils.clamp(this.currentAir - 0.005, this.minAir, this.maxAir);
				this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir, oldair: oldAir});
			}else
			{
				this.currentAir = MathUtils.clamp(this.currentAir + 0.02, this.minAir, this.maxAir);
				this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir, oldair: oldAir});
			}
		}

		// If the player is out of air - start subtracting from the player's health
		//this.currentHealth = this.currentAir <= this.minAir ? MathUtils.clamp(this.currentHealth - deltaT*2, this.minHealth, this.maxHealth) : this.currentHealth;

		if(this.currentAir <= this.minAir)
		{
			//this.currentHealth = MathUtils.clamp(this.currentHealth - deltaT*2, this.minHealth, this.maxHealth);
			//this.emitter.fireEvent(HW2Events.PLAYER_HEALTH_CHANGE, {curhealth: this.currentHealth, maxhealth: this.maxHealth});
			this.narrowLight.visible = false;
			this.wideLight.visible = false;
		}

		//Blinking Light
		if(this.blinkingLightBrightnessIncreasing)
		{
			//this.blinkingLight.intensity += 0.005;
			this.blinkingLight.intensity = MathUtils.lerp(this.blinkingLight.intensity, this.blinkingLightMaxBrightness, this.blinkingLightSpeed);
		}else
		{
			//this.blinkingLight.intensity -= 0.005;
			this.blinkingLight.intensity = MathUtils.lerp(this.blinkingLight.intensity, this.blinkingLightMinBrightness, this.blinkingLightSpeed);
		}

		if(this.blinkingLight.intensity > this.blinkingLightMaxBrightness - 0.05 || this.blinkingLight.intensity < this.blinkingLightMinBrightness + 0.15)
		{
			this.blinkingLightBrightnessIncreasing = !this.blinkingLightBrightnessIncreasing;
		}

		//blinking if invincible
		if(!this.invinTimer.isStopped())
		{
			this.flashTimer += deltaT;
			if(this.flashTimer > 0.1)
			{
				this.flashTimer = 0;
				if(this.owner.alpha == 1){
					this.owner.alpha = this.hitAlpha;
					this.planeWings.alpha = this.hitAlpha;
				}
				else
				{
					this.owner.alpha = 1;
					this.planeWings.alpha = 1;
				}
			}
		}
		}
	}
	/**
	 * This method handles all events that the reciever for the PlayerController is
	 * subscribed to.
	 * 
	 * @see {AI.handleEvent}
	 * 
	 * @param event a GameEvent that the PlayerController is subscribed to
	 */
	public handleEvent(event: GameEvent): void {
		switch(event.type) {
			case HW2Events.SHOOT_LASER: {
				this.handleShootLaserEvent(event);
				break;
			}
			case HW2Events.PLAYER_MINE_COLLISION: {
				this.handlePlayerMineCollisionEvent(event);
				break;
			}
			case HW2Events.DEAD: {
				this.handlePlayerDead(event);
				this.airTimer.pause();
				break;
			}
			case HW2Events.PLAYER_BUBBLE_COLLISION: {
				this.currentAir++;
				if(this.currentAir > this.maxAir)
					this.currentAir = this.maxAir;
				this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir});
				break;
			}
			case HW2Events.PLAYER_PROJECTILE_COLLISION: {
				this.handlePlayerProjectileCollision(event);
				break;
			}
			case "levelcomplete": {
                this.invincible = true;
                break;
            }
			default: {
				throw new Error(`Unhandled event of type: ${event.type} caught in PlayerController`);
			}
		}
	}
	/**
	 * @see {AI.destroy}
	 */
	public destroy(): void {
		this.receiver.destroy()
	}

	/**
	 * This function handles when the player successfully shoots a laser.
	 * @param event 
	 */
	protected handleShootLaserEvent(event: GameEvent): void {
		if(!this.infiniteBattery)
			this.currentAir -= this.laserEnergyCost;
		this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir, oldair:this.currentAir + this.laserEnergyCost});
		this.shootLight.intensity = this.maxShootLightIntensity;
		this.wideLight.visible = false;
		this.narrowLight.visible = false;
		this.laserTimer.reset();
		this.laserTimer.start();
	}

	protected handlePlayerMineCollisionEvent(event: GameEvent): void {
		//this.currentHealth -= 2;
		let monsterType = event.data.get("monsterType");
		if(!this.invincible && this.owner.visible)
		{
			switch(monsterType)
			{
				case monsterTypes.electricField:
					this.currentAir = MathUtils.clamp(this.currentAir + 0.1, this.minAir, this.maxAir);
					this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir});
					break;
				default:
					this.gotHit();
					break;
			}
		}
	}

	protected handlePlayerProjectileCollision(event: GameEvent): void {
		//this.currentHealth -= 2;
		if(!this.invincible && this.owner.visible)
		{
			this.gotHit();
		}
	}

	protected gotHit()
	{
		if(!this.infiniteHealth)
			this.currentHealth -= 1;
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.PLAYERHIT_AUDIO_KEY, loop: false, holdReference: false});
		this.emitter.fireEvent(HW2Events.PLAYER_HEALTH_CHANGE, {curhealth: this.currentHealth, maxhealth: this.maxHealth});
		//this.owner.animation.playIfNotAlready(PlayerAnimations.HIT, false);
		//this.owner.animation.queue(PlayerAnimations.IDLE, true);
		this.invincible = true;
		this.invinTimer.reset();
		this.invinTimer.start();
		this.flashTimer = 0;
		this.owner.alpha = this.hitAlpha;
		this.planeWings.alpha = this.hitAlpha;
		this.blinkingLightSpeed = 0.15;
	}

	protected handlePlayerDead(event: GameEvent): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.EXPLOSION_AUDIO_KEY, loop: false, holdReference: false});
		this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.propSound});
		//this.owner.animation.playIfNotAlready(PlayerAnimations.DEATH, true);
		this.planeWings.visible = false;
		this.owner.visible = false;
		//this.destroy();
	}

	/** 
	 * A callback function that increments the number of charges the player's laser cannon has.
	 * 
	 * @remarks 
	 * 
	 * This function 
	 * updates the total number of charges the player's laser cannon has
	 */
	protected handleLaserTimerEnd = () => {
		this.currentCharge = MathUtils.clamp(this.currentCharge + 1, this.minCharge, this.maxCharge);
		this.emitter.fireEvent(HW2Events.CHARGE_CHANGE, {curchrg: this.currentCharge, maxchrg: this.maxCharge});
		if (this.currentCharge < this.maxCharge) {
			this.laserTimer.start();
		}
	}

	protected handleInvinTimerEnd = () => {
		this.invincible = false;
		this.owner.alpha = 1.0;
		this.planeWings.alpha = 1.0;
		this.blinkingLightSpeed = 0.01;
	}

	protected handleAirTimer = () => {
		//this.emitter.fireEvent(HW2Events.AIR_CHANGE, {curair: this.currentAir, maxair: this.maxAir});
		console.log(this.owner.position.y);
	}

} 



