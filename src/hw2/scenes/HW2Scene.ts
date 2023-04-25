import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";

import PlayerController from "../ai/PlayerController";

import MineBehavior, { MineAnimations } from "../ai/MineBehavior";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import BubbleAI from "../ai/BubbleBehavior";
import LaserBehavior from "../ai/LaserBehavior";

import GameOver from "./GameOver";

import BubbleShaderType from "../shaders/BubbleShaderType";
import LaserShaderType from "../shaders/LaserShaderType";

import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import { HW2Events } from "../HW2Events";
import Layer from "../../Wolfie2D/Scene/Layer";

import MainMenu from "./MainMenu";
import Light from "../../Wolfie2D/Nodes/Graphics/Light";
import Input from "../../Wolfie2D/Input/Input";
import GameLoop from "../../Wolfie2D/Loop/GameLoop";

import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

import {level, levels} from "../levels/levelList";
import {monsterInfo, projectileInfo} from "../levels/monsterInfo";

import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";

/**
 * A type for layers in the HW3Scene. It seems natural to want to use some kind of enum type to
 * represent the different layers in the HW3Scene, however, it is generally bad practice to use
 * Typescripts enums. As an alternative, I'm using a const object.
 * 
 * @author PeteyLumpkins
 * 
 * {@link https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums}
 */
export const HW2Layers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI",
	PAUSE: "PAUSE"
} as const;

export const SpritesheetKeys = {
	// The key and path to the player's spritesheet json data
    PLAYER_KEY: "PLAYER",
    PLAYER_PATH: "hw2_assets/spritesheets/AYellowBarrelWithWindows.json",
    // The key and path to the mine sprite
    MINE_KEY: "MINE",
    MINE_PATH: "hw2_assets/spritesheets/SpikyMineThing.json",

	ELECTRICITY_KEY: "ELECTRICITY",
	ELECTRICITY_PATH: "hw2_assets/spritesheets/Electricity.json",

	STALAGMITE_KEY: "STALAGMITE",
	STALAGMITE_PATH: "hw2_assets/spritesheets/testStalagmite.json",

	STALACTITE_KEY: "STALACTITE",
	STALACTITE_PATH: "hw2_assets/spritesheets/stalactite.json",

	STALACTITETOP_KEY: "STALACTITETOP",
	STALACTITETOP_PATH: "hw2_assets/spritesheets/stalactiteTop.json",


}

export const SpriteKeys = {
	PLANEWINGS_KEY: "PLANEWINGS",
	PLANEWINGS_PATH: "hw2_assets/sprites/testplanewings.png",


	TBUF_KEY: "TBUF",
	TBUF_PATH: "hw2_assets/sprites/TBUF.png",
}

export const AudioKeys = {
	SHOOT_AUDIO_KEY: "SHOOT",
    SHOOT_AUDIO_PATH: "hw2_assets/sounds/shoot2.wav",

	SHOOT2_AUDIO_KEY: "SHOOT2",
    SHOOT2_AUDIO_PATH: "hw2_assets/sounds/shoot5.wav",

	SHOOT3_AUDIO_KEY: "SHOOT3",
    SHOOT3_AUDIO_PATH: "hw2_assets/sounds/shoot4.wav",

	ENEMYSHOOT_AUDIO_KEY: "ENEMYSHOOT",
	ENEMYSHOOT_AUDIO_PATH: "hw2_assets/sounds/shoot3.wav",

	EXPLOSION_AUDIO_KEY: "EXPLOSION",
    EXPLOSION_AUDIO_PATH: "hw2_assets/sounds/explosion1.wav",

	HEADLIGHTON_AUDIO_KEY: "HEADLIGHTON",
    HEADLIGHTON_AUDIO_PATH: "hw2_assets/sounds/headlightOn.wav",

	HEADLIGHTOFF_AUDIO_KEY: "HEADLIGHTOFF",
    HEADLIGHTOFF_AUDIO_PATH: "hw2_assets/sounds/headlightOff.wav",

	HITENEMY_AUDIO_KEY: "HITENEMY",
    HITENEMY_AUDIO_PATH: "hw2_assets/sounds/hitenemysound.wav",

	ENEMYDEFLECTED_AUDIO_KEY: "ENEMYDEFLECTED",
	ENEMYDEFLECTED_AUDIO_PATH: "hw2_assets/sounds/enemyDeflected.wav",

	PROJECTILESPLIT_AUDIO_KEY: "PROJECTILESPLIT",
    PROJECTILESPLIT_AUDIO_PATH: "hw2_assets/sounds/projectileSplit.wav",

	ENEMYWEAK_AUDIO_KEY: "ENEMYWEAK",
    ENEMYWEAK_AUDIO_PATH: "hw2_assets/sounds/enemyWeak1.wav",

	ENEMYWEAKENING_AUDIO_KEY: "ENEMYWEAKENING",
    ENEMYWEAKENING_AUDIO_PATH: "hw2_assets/sounds/enemyWeakening1.wav",

	SPAWNENEMY_AUDIO_KEY: "SPAWNENEMY",
    SPAWNENEMY_AUDIO_PATH: "hw2_assets/sounds/spawn2.wav",

	PLAYERHIT_AUDIO_KEY: "PLAYERHIT",
    PLAYERHIT_AUDIO_PATH: "hw2_assets/sounds/playerHit.wav",

	ENEMYDEAD_AUDIO_KEY: "ENEMYDEAD",
    ENEMYDEAD_AUDIO_PATH: "hw2_assets/sounds/enemyDead.wav",

	NARROWLIGHT_AUDIO_KEY: "NARROWLIGHT",
    NARROWLIGHT_AUDIO_PATH: "hw2_assets/sounds/narrowLight4.wav",

	ELECTRICAPPEAR_AUDIO_KEY: "ELECTRICAPPEAR",
    ELECTRICAPPEAR_AUDIO_PATH: "hw2_assets/sounds/electricSound.wav",

	RECHARGING_AUDIO_KEY: "RECHARGING",
    RECHARGING_AUDIO_PATH: "hw2_assets/sounds/recharging.wav",

	PROPELLER_AUDIO_KEY: "PROPELLER",
    PROPELLER_AUDIO_PATH: "hw2_assets/sounds/propeller2.wav",

	PROPELLERUP_AUDIO_KEY: "PROPELLERUP",
    PROPELLERUP_AUDIO_PATH: "hw2_assets/sounds/propellerup3.wav",

	PROPELLERDOWN_AUDIO_KEY: "PROPELLERDOWN",
    PROPELLERDOWN_AUDIO_PATH: "hw2_assets/sounds/propellerdown2.wav",
}


/**
 * This is the main scene for our game. 
 * @see Scene for more information about the Scene class and Scenes in Wolfie2D
 */
export default class HW2Scene extends Scene {

	//PAUSE Screen Pop Up Layer
	private pause : Layer;
	private paused: boolean;

	private currentLevel: number;

	//Tutorial level stuff
	private tutorial : boolean;
	private current_tutorialSection : number = 0;
	private openedLight : boolean = false;
	private closedLight : boolean = false;
	private completedSteer : boolean = false;
	private usedElectricField : boolean = false;
	private shotEnemy : boolean = false;
	private weakToLightDead : boolean = false;
	private narrowedLight : boolean = false;
	
	private tutorialText : Label;
	private tutorialText2 : Label;
	private tutorialOverTimer : Timer;
	private overTimerHasRun: boolean = false;
	private tutorialSectionTimer : Timer;
	
    // A flag to indicate whether or not this scene is being recorded
    private recording: boolean;
    // The seed that should be set before the game starts
    private seed: string;

	// The key and path to the background sprite
	public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw2_assets/sprites/blacknoise.png"

	public static SONG_KEY = "SONG"

	// Sprites for the background images
	private bg1: Sprite;
	private bg2: Sprite;

	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private planewings: Sprite;
	private playerP1: Graphic;
	private playerP2: Graphic;
	private wideLight: Graphic;
	private narrowLight: Graphic;
	private blinkingLight: Graphic;
	private shootLight: Graphic;

	private playerHitboxes: Array<Graphic>;


	private levelObjs: Array<monsterInfo>;

	// Object pool for lasers
	private lasers: Array<Graphic>;
	// Object pool for rocks
	private mines: Array<AnimatedSprite>;
	// Object pool for bubbles
	private bubbles: Array<Graphic>;

	private projectiles: Array<AnimatedSprite>;

	// Laser/Charge labels
	private chrgLabel: Label;
	private chrgBarLabels: Array<Label>;

	// Air labels
	private airLabel: Label;
	private airBar: Label;
	private airBarBg: Label;

	// Health labels
	private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

	// Timers for spawning rocks and bubbles
	private mineSpawnTimer: Timer;
	private bubbleSpawnTimer: Timer;
	private gameOverTimer: Timer;

	// Keeps track of mines destroyed, bubbles popped, amount of time passed
	private bubblesPopped: number = 0;
	private minesDestroyed: number = 0;
	private timePassed: number = 0;

	private curMonsterIndex: number = 0;

	private currentSong: string;

	// The padding of the world
	private worldPadding: Vec2;

	private halfViewSize: Vec2; 

	/** Scene lifecycle methods */

	/**
	 * @see Scene.initScene()
	 */
	public override initScene(options: Record<string, any>): void {
		this.paused = false;
		this.currentLevel = options.level;
		this.tutorial = this.currentLevel === 0;
		console.log("init, ", this.currentLevel);


	}
	/**
	 * @see Scene.loadScene()
	 */
	public override loadScene(){
		// Load in the background image
		this.load.image(HW2Scene.BACKGROUND_KEY, levels[this.currentLevel].BACKGROUND_PATH);

		this.load.audio(HW2Scene.SONG_KEY, levels[this.currentLevel].SONG_PATH);

		let sskeys = Object.keys(SpritesheetKeys);

		for(let i = 0; i < sskeys.length; i+=2)
		{
			this.load.spritesheet(SpritesheetKeys[sskeys[i]], SpritesheetKeys[sskeys[i+1]]);
		}

		let skeys = Object.keys(SpriteKeys);

		for(let i = 0; i < skeys.length; i+=2)
		{
			this.load.image(SpriteKeys[skeys[i]], SpriteKeys[skeys[i+1]]);
		}


		// Load in the shader for bubble.
		this.load.shader(
			BubbleShaderType.KEY,
			BubbleShaderType.VSHADER,
			BubbleShaderType.FSHADER
		);
		// Load in the shader for laser.
    	this.load.shader(
			LaserShaderType.KEY,
			LaserShaderType.VSHADER, 
			LaserShaderType.FSHADER
    	);


		//sounds
		let akeys = Object.keys(AudioKeys);

		for(let i = 0; i < akeys.length; i+=2)
		{
			this.load.audio(AudioKeys[akeys[i]], AudioKeys[akeys[i+1]])
		}
	}
	/**
	 * @see Scene.startScene()
	 */
	public override startScene(){

		this.worldPadding = new Vec2(64, 64);

		// Create a background layer
		this.addLayer(HW2Layers.BACKGROUND, 0);
		this.initBackground();

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer(HW2Layers.PRIMARY, 5);
		// Initialize the player
		this.initPlayer();
		// Initialize the Timers
		this.initTimers();
		// Initialize the UI
		this.initUI();
		this.projectiles = new Array();

		this.levelObjs = levels[this.currentLevel].objs;
		if(!this.tutorial){
			this.tutorialText.setText('')
			this.tutorialText2.setText('')
		}

		// Initialize object pools
		this.initObjectPools();

		// Subscribe to player events
		this.receiver.subscribe(HW2Events.CHARGE_CHANGE);
		this.receiver.subscribe(HW2Events.SHOOT_LASER);
		this.receiver.subscribe(HW2Events.DEAD);
		this.receiver.subscribe(HW2Events.PLAYER_HEALTH_CHANGE);
		this.receiver.subscribe(HW2Events.AIR_CHANGE);
		this.receiver.subscribe(HW2Events.SPAWN_PROJECTILE);

		//Game events
		this.receiver.subscribe(HW2Events.RESUME_GAME);
		this.receiver.subscribe(HW2Events.BACK_TO_MAIN);
		this.receiver.subscribe(HW2Events.SHOT_ENEMY);
		this.receiver.subscribe(HW2Events.SHOT_WEAKTOLIGHT);
		// Subscribe to laser events
		this.receiver.subscribe(HW2Events.FIRING_LASER);

		this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: HW2Scene.SONG_KEY, loop: true, holdReference: true});


		//TODO sort levelObjs by spawn time just in case
	}
	/**
	 * @see Scene.updateScene 
	 */
	public override updateScene(deltaT: number){

		if(Input.isKeyJustPressed("escape")){
			this.handlePause();
		}

		if(!this.paused)
			this.timePassed += deltaT;

		if(this.tutorial){
			this.handleTutorialText();
			if(Input.isKeyJustPressed("j")){
				if(this.current_tutorialSection === 0){
					this.current_tutorialSection += 1;
					this.closedLight = true;
				}
				else if(this.current_tutorialSection ===1){
					this.current_tutorialSection += 1;
					this.openedLight = true;
				}
			}
			else if(this.current_tutorialSection ===2 && this.openedLight){
				//spawn obsatacles and check if player steered through them successfully
				if(this.tutorialSectionTimer.isStopped()){
					if(this.completedSteer){
						this.current_tutorialSection +=1;
						
					}
					else{
						this.progressTutorial(this.current_tutorialSection-2)
						this.progressTutorial(this.current_tutorialSection-1)
						this.tutorialSectionTimer.start()
						this.completedSteer = true;
					}
				}
			}
			else if(this.current_tutorialSection===3 && this.completedSteer){
				//spawn an electric field and check if a player has used it
				if(this.tutorialSectionTimer.isStopped()){
					if(this.usedElectricField){
						this.current_tutorialSection += 1;
					}
					else{
						this.progressTutorial(this.current_tutorialSection-1)
						this.tutorialSectionTimer.start()
					}

				}
			}
			else if(this.current_tutorialSection===4 && this.usedElectricField){
				//spawn a normal enemy and check if a player has shot it
				if(this.tutorialSectionTimer.isStopped()){
					if(this.shotEnemy){
						this.current_tutorialSection += 1;
					}
					else{
						this.progressTutorial(this.current_tutorialSection-1);
						this.tutorialSectionTimer.start();
					}
				}

			} 
			else if(this.current_tutorialSection===5 && this.shotEnemy){
				console.log(this.current_tutorialSection);
				//spawn a special enemy that is weak to light and check if a player has killed it
				if(this.tutorialSectionTimer.isStopped()){
					if(this.weakToLightDead){
						this.current_tutorialSection += 1;
					}
					else{
						
						this.progressTutorial(this.current_tutorialSection-1);
						this.tutorialSectionTimer.start();
					}
				}
				

			}
			else if(this.current_tutorialSection===6 && this.weakToLightDead){
				console.log(this.current_tutorialSection);
				//initiate a timer that makes player go back to main menu after 3 second
				if(this.overTimerHasRun == false){
					this.tutorialOverTimer.start()
					this.overTimerHasRun = true;
					console.log("rerun timer")
				}
				else{
					this.handleTimers();
				}
				
			}
		}
		
		// Move the backgrounds
		this.moveBackgrounds(deltaT);

		// Handles mine and bubble collisions
		this.handleMinePlayerCollisions();
		//this.bubblesPopped += this.handleBubblePlayerCollisions();

		this.handleStalactiteMonsterCollisions();
		this.handlePlayerProjectileCollisions();

		// Handle timers
		this.handleTimers();
			
		//spawns enemies if enough time has passed
		if(!this.tutorial) {this.progressEnemies();}


		this.handleTimeSkip();


        // TODO Remove despawning of mines and bubbles here

		// Handle screen despawning of mines and bubbles
		for (let mine of this.mines) if (mine.visible) this.handleScreenDespawn(mine);
		//for (let bubble of this.bubbles) if (bubble.visible) this.handleScreenDespawn(bubble);
		//this.wrapPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
		this.lockPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());

		//hacky level end for level 1
		this.checkLevelEnd();

		// Handle events
		while (this.receiver.hasNextEvent()) {
			this.handleEvent(this.receiver.getNextEvent());
		}
	}
    /**
     * @see Scene.unloadScene()
     */
    public override unloadScene(): void {
		// keep all resources.
		//this.load.keepSpritesheet(HW2Scene.PLAYER_KEY);
        //this.load.keepImage(HW2Scene.BACKGROUND_KEY);
        // this.load.keepSpritesheet(HW2Scene.MINE_KEY);
		// this.load.keepShader(BubbleShaderType.KEY);
		// this.load.keepShader(LaserShaderType.KEY);
	}



	/**
	 * This method helps with handling events. 
	 * 
	 * @param event the event to be handled
	 * @see GameEvent
	 */
	protected handleEvent(event: GameEvent){
		switch(event.type) {
			case HW2Events.SHOOT_LASER: {
				let laser = this.spawnLaser(event.data.get("src"), event.data.get("angle"));
				this.minesDestroyed += this.handleShootCollisions(laser,  event.data.get("src"), event.data.get("angle"), this.mines);
				break;
			}
			case HW2Events.DEAD: {
				console.log("DEAD EVENT REACHED");
				this.gameOverTimer.start();
				break;
			}
			case HW2Events.CHARGE_CHANGE: {
				//this.handleChargeChange(event.data.get("curchrg"), event.data.get("maxchrg"));
				break;
			}
			case HW2Events.FIRING_LASER: {
				//this.minesDestroyed += this.handleMineLaserCollisions(event.data.get("laser"), this.mines);
				
				break;
			}
			case HW2Events.PLAYER_HEALTH_CHANGE: {
				this.handleHealthChange(event.data.get("curhealth"), event.data.get("maxhealth"));
				break;
			}
			case HW2Events.AIR_CHANGE: {
				this.handleAirChange(event.data.get("curair"), event.data.get("maxair"));
				break;
			}
			case HW2Events.RESUME_GAME:{
				this.handlePause();
				break;
			}
			case HW2Events.BACK_TO_MAIN:{
				this.sceneManager.changeToScene(MainMenu,{level:1})
				break;
				
			}
			case HW2Events.SPAWN_PROJECTILE: {
				//this.projectiles.push(event.data.get("projectile"));
				this.spawnProjectile(event);
				break;
			}
			case HW2Events.SHOT_ENEMY:{
				this.shotEnemy = true;
				break;
			}
			case HW2Events.SHOT_WEAKTOLIGHT:{
				if(this.current_tutorialSection === 5){
					this.weakToLightDead = true;
				}
				break;
			}
			default: {
				throw new Error(`Unhandled event with type ${event.type} caught in ${this.constructor.name}`);
			}
		}

	}

	/** Initialization methods */

	/** 
	 * This method initializes the player.
	 * 
	 * @remarks 
	 * 
	 * This method should add the player to the scene as an animated sprite. The player
	 * should be added to the primary layer of the scene. The player's position should 
	 * initially be set to the center of the viewport. The player should also be given
	 * a collision shape and PlayerController AI.
	 */ 
	protected initPlayer(): void {
		// Add in the player as an animated sprite
		// We give it the key specified in our load function and the name of the layer
		let planeWings = this.add.sprite(SpriteKeys.PLANEWINGS_KEY, HW2Layers.PRIMARY);
		this.player = this.add.animatedSprite(SpritesheetKeys.PLAYER_KEY, HW2Layers.PRIMARY);
		planeWings.scale.set(0.4, 0.4);
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x/3, this.viewport.getCenter().y);
		this.player.scale.set(0.4, 0.4);

		this.playerP1 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});
		this.playerP2 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});
		this.playerHitboxes = new Array(5);
		for(let i = 0; i < 5; i++)
		{
			let hb = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(86, 32)});
			hb.scale.set(0.4, 0.4);
			hb.visible = false;
			this.playerHitboxes[i] = hb;
		}




		this.wideLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: this.player.position.clone(), 
																					angle : 0,
																					intensity : 0.3,
																					distance : this.viewport.getHalfSize().x * 2,
																					tintColor : Color.WHITE,
																					angleRange : new Vec2(60, 0),
																					opacity : 1.0});

		this.narrowLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: this.player.position.clone(), 
																					angle : 0,
																					intensity : 3.0,
																					distance : this.viewport.getHalfSize().x * 2 * 1.33,
																					tintColor : Color.WHITE,
																					angleRange : new Vec2(12, 0),
																					opacity : 1.0
																					});
		this.narrowLight.visible = false;
		let blinkingLightPos = new Vec2(this.player.position.x - 20, this.player.position.y);
		this.blinkingLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: blinkingLightPos, 
																					angle : 0,
																					intensity : 0.3,
																					distance : 1000,
																					tintColor : Color.RED,
																					angleRange : new Vec2(360, 360),
																					opacity : 1.0,
																					lightScale : 0.1});

		this.shootLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: this.player.position.clone(), 
																					angle : 0,
																					intensity : 0.0,
																					distance : this.viewport.getHalfSize().x * 4,
																					tintColor : Color.WHITE,
																					angleRange : new Vec2(270, 0),
																					opacity : 1.0});
		/*
		this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: new Vec2(450, 450), 
																					angle : 0,
																					intensity : 0.6,
																					distance : 0,
																					tintColor : Color.BLUE,
																					angleRange : new Vec2(360, 360),
																					opacity : 0.5,
																					});
		*/
		


		
		//console.log("test", this.playerHitboxes);


		// Add a playerController to the player
		this.player.addAI(PlayerController, {p1: this.playerP1, p2: this.playerP2, wideLight: this.wideLight, narrowLight: this.narrowLight, blinkingLight: this.blinkingLight, shootLight: this.shootLight, planeWings: planeWings, hitboxes: this.playerHitboxes, rm: this.sceneManager.renderingManager});
	}
	/**
	 * Initializes the UI for the HW3-Scene.
	 * 
	 * @remarks
	 * 
	 * The UI should probably be extracted out of the Scene class and put into
	 * it's own UI class, but I don't have time for that.
	 */
	protected initUI(): void {
		// UILayer stuff
		this.addUILayer(HW2Layers.UI);

		// HP Label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(50, 50), text: "HP "});
		this.healthLabel.size.set(300, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";
		this.healthLabel.textColor = Color.WHITE;


		// Air Label
		this.airLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(50, 100), text: "PWR"});
		this.airLabel.size.set(300, 30);
		this.airLabel.fontSize = 24;
		this.airLabel.font = "Courier";
		this.airLabel.textColor = Color.WHITE;
		/*
		// Charge Label
		this.chrgLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(475, 50), text: "Lasers"});
		this.chrgLabel.size.set(300, 30);
		this.chrgLabel.fontSize = 24;
		this.chrgLabel.font = "Courier";

		// Charge airBars
		this.chrgBarLabels = new Array(4);
		for (let i = 0; i < this.chrgBarLabels.length; i++) {
			let pos = new Vec2(500 + (i + 1)*(300 / this.chrgBarLabels.length), 50)
			this.chrgBarLabels[i] = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: pos, text: ""});
			this.chrgBarLabels[i].size = new Vec2(300 / this.chrgBarLabels.length, 25);
			this.chrgBarLabels[i].backgroundColor = Color.GREEN;
			this.chrgBarLabels[i].borderColor = Color.BLACK;
		}
		*/

		// HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 50), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

		// AirBar
		this.airBar = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 100), text: ""});
		this.airBar.size = new Vec2(300, 25);
		this.airBar.backgroundColor = Color.WHITE;

		// HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 50), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;

		// AirBar Border
		this.airBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 100), text: ""});
		this.airBarBg.size = new Vec2(300, 25);
		this.airBarBg.borderColor = Color.BLACK;

		//Tutorial Level Texts

		this.tutorialText = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(450, 150), text: "Press j to turn on and off headlight"});
		this.tutorialText.textColor = Color.WHITE;
		this.tutorialText2 = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(450, 200), text: ""});
		this.tutorialText2.textColor = Color.WHITE;
		/*

		const narrowText = "Hold K to narrow the headlights, it can be used to aim more accurately and weaken certain enemies."
		this.narrow = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(450, 150), text: narrowText});

		const completeTutorialText = "Congratulation, you have completed the tutorial!"
		this.completeTutorial = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(450, 150), text: completeTutorialText});

		this.light.textColor = Color.WHITE;
		this.light2.textColor = Color.WHITE;
		this.steer.textColor = Color.WHITE;
		this.electric.textColor = Color.WHITE;
		this.shoot.textColor = Color.WHITE;
		this.narrow.textColor = Color.WHITE;
		this.completeTutorial.textColor = Color.WHITE;

		this.light.visible = false;
		this.light2.visible = false;
		this.steer.visible = false;
		this.electric.visible = false;
		this.shoot.visible = false;
		this.narrow.visible = false
		this.completeTutorial.visible = false;
		*/

		// Add Pause Screen
		const center = this.viewport.getCenter();

		this.pause = this.addUILayer(HW2Layers.PAUSE);
		this.pause.setHidden(true);
		const pauseScreen = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.PAUSE, {position: new Vec2(center.x, center.y - 100), text: "Game Paused"});
        pauseScreen.fontSize = 20
		pauseScreen.textColor = Color.BLACK

		const resume = this.add.uiElement(UIElementType.BUTTON, HW2Layers.PAUSE, {position: new Vec2(center.x - 100, center.y - 200), text: "Resume"});
        resume.size.set(200, 50);
        resume.borderWidth = 2;
        resume.borderColor = Color.WHITE;
        resume.backgroundColor = Color.TRANSPARENT;
        resume.onClickEventId = HW2Events.RESUME_GAME;

		const back = this.add.uiElement(UIElementType.BUTTON, HW2Layers.PAUSE, {position: new Vec2(center.x + 100, center.y - 200), text: "Back to Main"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = HW2Events.BACK_TO_MAIN;

	}
	/**
	 * Initializes the timer objects for the game.
	 */
	protected initTimers(): void {
		this.mineSpawnTimer = new Timer(500);
		this.mineSpawnTimer.start();

		this.bubbleSpawnTimer = new Timer(2500);
		this.bubbleSpawnTimer.start();

		this.gameOverTimer = new Timer(3000);
		this.tutorialOverTimer = new Timer(3000);
		this.tutorialSectionTimer = new Timer(10000);

	}
	/**
	 * Initializes the background image sprites for the game.
	 */
	protected initBackground(): void {
		this.bg1 = this.add.sprite(HW2Scene.BACKGROUND_KEY, HW2Layers.BACKGROUND);
		this.bg1.scale.set(1.5, 1.5);
		this.bg1.position.copy(this.viewport.getCenter());

		this.bg2 = this.add.sprite(HW2Scene.BACKGROUND_KEY, HW2Layers.BACKGROUND);
		this.bg2.scale.set(1.5, 1.5);
		this.bg2.position = this.bg1.position.clone();
		this.bg2.position.add(this.bg1.sizeWithZoom.scale(2, 0));
	}
	/**
	 * This method initializes each of the object pools for this scene.
	 * 
	 * @remarks
	 * 
	 * There are three object pools that need to be initialized before the scene 
	 * can start running. They are as follows:
	 * 
	 * 1. The bubble object-pool
	 * 2. The mine object-pool
	 * 3. The laseer object-pool
	 * 
	 * For each object-pool, if an object is not currently in use, it's visible
	 * flag will be set to false. If an object is in use, then it's visible flag
	 * will be set to true. This makes returning objects to their respective pools
	 * as simple as just setting a flag.
	 * 
	 * @see {@link https://gameprogrammingpatterns.com/object-pool.html Object-Pools} 
	 */
	protected initObjectPools(): void {
		
		// Init bubble object pool
		/*
		this.bubbles = new Array(10);
		for (let i = 0; i < this.bubbles.length; i++) {
			this.bubbles[i] = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: new Vec2(0, 0), size: new Vec2(50, 50)});
            
            // Give the bubbles a custom shader
			this.bubbles[i].useCustomShader(BubbleShaderType.KEY);
			this.bubbles[i].visible = false;
			this.bubbles[i].color = Color.BLUE;

            // Give the bubbles AI
			this.bubbles[i].addAI(BubbleAI);

            // Give the bubbles a collider
			let collider = new Circle(Vec2.ZERO, 25);
			this.bubbles[i].setCollisionShape(collider);
		}
		*/
		// Init the object pool of mines
		/*
		for (let i = 0; i < this.mines.length; i++){
			this.mines[i] = this.add.animatedSprite(HW2Scene.MINE_KEY, HW2Layers.PRIMARY);

			// Make our mine inactive by default
			this.mines[i].visible = false;

			// Assign them mine ai
			this.mines[i].addAI(MineBehavior2, {movementPattern: 0});

			this.mines[i].scale.set(0.3, 0.3);

			// Give them a collision shape
			let collider = new AABB(Vec2.ZERO, this.mines[i].sizeWithZoom);
			this.mines[i].setCollisionShape(collider);
		}
		*/

		console.log(this.levelObjs[0]);
		let x = JSON.parse(JSON.stringify(this.levelObjs[0]));
		console.log(x);
		this.expandLevelObjs();
		this.mines = new Array(this.levelObjs.length);
		for (let i = 0; i < this.mines.length; i++){
			this.mines[i] = this.add.animatedSprite(this.levelObjs[i].spriteKey, HW2Layers.PRIMARY);
			
			// Make our mine inactive by default
			this.mines[i].visible = false;

			// Assign them mine ai
			this.mines[i].addAI(MineBehavior2, {movementPattern: 0});

			if(this.levelObjs[i].spriteScale != null)
				this.mines[i].scale.set(this.levelObjs[i].spriteScale, this.levelObjs[i].spriteScale);
			else
				this.mines[i].scale.set(6.0, 6.0);

			// Give them a collision shape
			let collider = this.levelObjs[i].hitboxScaleX == null ? new AABB(Vec2.ZERO, this.mines[i].sizeWithZoom) : new AABB(Vec2.ZERO, this.mines[i].sizeWithZoom.scale(this.levelObjs[i].hitboxScaleX, this.levelObjs[i].hitboxScaleY));
			this.mines[i].setCollisionShape(collider);
		}

		

		// Init the object pool of lasers
		this.lasers = new Array(4);
		for (let i = 0; i < this.lasers.length; i++) {
			this.lasers[i] = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: Vec2.ZERO, size: Vec2.ZERO})
			this.lasers[i].useCustomShader(LaserShaderType.KEY);
			this.lasers[i].color = Color.WHITE;
			this.lasers[i].visible = false;
			this.lasers[i].addAI(LaserBehavior, {src: Vec2.ZERO, dst: Vec2.ZERO});
		}
	}

	//Recurisvely expands the level object list
	protected expandLevelObjs(): void
	{
		let newObjList = new Array(this.getRecLevelObjLength(this.levelObjs));
		//this.logArray(newObjList);
		this.recAddObjs(newObjList, this.levelObjs);
		for(const mon of newObjList) if (mon.monsterType == monsterTypes.electricField) mon.spawnTime -= 5;
		this.levelObjs = newObjList.sort((a, b) => a.spawnTime - b.spawnTime);
		console.log(this.levelObjs);
	}

	protected getRecLevelObjLength(monsterList : Array<monsterInfo>): number
	{
		let length = 0;
		//console.log(monsterList);
		for(const mon of monsterList)
		{
			length += mon.objs == null ? 1 : this.getRecLevelObjLength(mon.objs);
		}
		return length;
	}

	protected recAddObjs(newMonsterList : Array<monsterInfo>, currentMonsterList : Array<monsterInfo>, index: number = 0, spawnTimeStart: number = 0, spawnYOffset: number = 0): number
	{
		
		for(const mon of currentMonsterList)
		{
			if(mon.objs == null)
			{
				let newmon = JSON.parse(JSON.stringify(mon));
				newmon.spawnTime += spawnTimeStart;
				newmon.spawnY += spawnYOffset;
				newMonsterList[index] = newmon;
				index++;
			}else
			{
				//console.log(newMonsterList);
				//this.logArray(newMonsterList);
				index = this.recAddObjs(newMonsterList, mon.objs, index, mon.spawnTime, mon.spawnY);
				//this.logArray(newMonsterList);
			}
		}
		return index;
	}


	protected logArray(monsterList : Array<monsterInfo>)
	{
		console.log("Array Start");
		for(const x of monsterList)
		{
			console.log(x);
		}
	}

	/** Methods for spawing/despawning objects */

	/**
	 * This method attempts spawns a laser starting at the specified position
	 * 
	 * @param src - the specified starting position of the laser
	 * 
	 * @remarks
	 * 
	 * This method should attempt to retrieve a laser object from the object-pool
	 * of lasers and spawn it, starting at the specified position. 
	 * 
	 * If there are no lasers in the object pool, then a laser should not be spawned. 
	 * Otherwise the laser should be spawned starting at the specified position and 
	 * go all the way to the edge of the padded viewport.
	 */
	protected spawnLaser(src: Vec2, angle: number): Graphic {
		let laser: Graphic = this.lasers.find((laser: Graphic) => { return !laser.visible; });
		if (laser) {
			//this.handleShootCollisions(laser, src, angle, this.mines);
			laser.visible = true;
			laser.setAIActive(true, {src: src, dst: this.viewport.getHalfSize().scaled(2).add(this.worldPadding.scaled(2)), angle: angle});
			return laser;
		}
		return null;
	}
	/**
	 * This method handles spawning a mine from the object-pool of mines
	 * 
	 * @remark
	 * 
	 * If there are no mines in the object-pool, then a mine shouldn't be spawned and 
	 * the mine-spawn timer should not be reset. Otherwise a mine should be spawned
	 * and the mine-spawn timer should be reset.
	 * 
	 * Mines should randomly spawn inside of the padded area of the viewport on the 
	 * right side of the screen. In addition, mines should not spawn within a
	 * a certain distance of the player (ie. we don't want mines spawning on top
	 * of the player).
	 * 
	 * A visualization of the padded viewport is shown below. o's represent valid mine
	 * spawnn locations. X's represent invalid locations.
	 * 
	 * 
	 * 					 X	 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|						X					X	|
	 * 			|		 _______________________________		|
	 * 			|		|								|		|
	 * 			|		|								|	o	|
	 *	 		|		|	  THIS IS THE VISIBLE		|		|
	 * 		X	|	X	|			 REGION				|	o	|   X 
	 * 			|		|								|		|
	 * 			|		|		X						|	o	|
	 * 			|		|_______________________________|		|
	 * 			|							X				X	|
	 * 			|_______________________________________________|
	 * 
	 * 							X THIS IS OUT OF BOUNDS
	 */
	 /*
	protected spawnMine(): void {
		// Find the first visible mine
		let mine: Sprite = this.mines.find((mine: Sprite) => { return !mine.visible });

		if (mine){
			// Bring this mine to life
			mine.visible = true;

			// Extract the size of the viewport
			let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
			let viewportSize = this.viewport.getHalfSize().scaled(2);

			// Loop on position until we're clear of the player
			mine.position.copy(RandUtils.randVec(viewportSize.x, paddedViewportSize.x, paddedViewportSize.y - viewportSize.y, viewportSize.y));
			while(mine.position.distanceTo(this.player.position) < 100){
				mine.position.copy(RandUtils.randVec(paddedViewportSize.x, paddedViewportSize.x, paddedViewportSize.y - viewportSize.y, viewportSize.y));
			}

			mine.setAIActive(true, {movementPattern: 3, player: this.player});
			// Start the mine spawn timer - spawn a mine every half a second I think
			//this.mineSpawnTimer.start(100);

		}
	}
	*/
	protected progressEnemies(): void {
		while(this.curMonsterIndex < this.levelObjs.length && this.timePassed > this.levelObjs[this.curMonsterIndex].spawnTime)
		{
			let mine: Sprite = this.mines[this.curMonsterIndex];

			mine.visible = true;
			// Extract the size of the viewport
			let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
			let viewportSize = this.viewport.getHalfSize().scaled(2);

			//mine.position.copy(RandUtils.randVec(viewportSize.x, paddedViewportSize.x, paddedViewportSize.y - viewportSize.y, viewportSize.y));
			mine.position = new Vec2((viewportSize.x + mine.sizeWithZoom.x/2), this.levelObjs[this.curMonsterIndex].spawnY);
			//mine.position = new Vec2(450, 450);
			const mineInfo = this.levelObjs[this.curMonsterIndex];

			let electricLight = null;
			if(mineInfo.monsterType == monsterTypes.electricField)
			{
				mine.position = new Vec2((viewportSize.x + mine.sizeWithZoom.x/2) + 500, this.levelObjs[this.curMonsterIndex].spawnY);
				electricLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: new Vec2(0, 0), 
																					angle : 0,
																					intensity : 0.5,
																					distance : 10,
																					tintColor : Color.BLUE,
																					angleRange : new Vec2(360, 360),
																					opacity : 0.5,
																					lightScale : 1.0});
			}
			mine.setAIActive(true, {monInfo: mineInfo, electricLight: electricLight, player: this.player, narrowLight: this.narrowLight, wideLight: this.wideLight});

			this.curMonsterIndex++; 

			//sounds
			this.spawnMonsterSound(mineInfo.monsterType)
		}
	}

	protected progressTutorial(sectionNum): void {
		let mine: Sprite = this.mines[sectionNum];

		mine.visible = true;
		// Extract the size of the viewport
		let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
		let viewportSize = this.viewport.getHalfSize().scaled(2);

		//mine.position.copy(RandUtils.randVec(viewportSize.x, paddedViewportSize.x, paddedViewportSize.y - viewportSize.y, viewportSize.y));
		mine.position = new Vec2((viewportSize.x + paddedViewportSize.x)/2, this.levelObjs[sectionNum].spawnY);
		//mine.position = new Vec2(450, 450);
		const mineInfo = this.levelObjs[sectionNum];

		let electricLight = null;
		if(mineInfo.monsterType == monsterTypes.electricField)
		{
			mine.position = new Vec2((viewportSize.x + mine.sizeWithZoom.x/2) + 500, this.levelObjs[this.curMonsterIndex].spawnY);
			electricLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: new Vec2(0, 0), 
																				angle : 0,
																				intensity : 0.5,
																				distance : 10,
																				tintColor : Color.BLUE,
																				angleRange : new Vec2(360, 360),
																				opacity : 0.5,
																				lightScale : 1.0});
		}
		mine.setAIActive(true, {monInfo: mineInfo, electricLight: electricLight, player: this.player, narrowLight: this.narrowLight, wideLight: this.wideLight});

		this.curMonsterIndex++; 

		//sounds
		this.spawnMonsterSound(mineInfo.monsterType);


	}
	protected spawnMonsterSound(monsterType: number)
	{
		switch(monsterType)
			{
				case monsterTypes.electricField:
					break;
				case monsterTypes.stalactite:
					break;
				case monsterTypes.stalagmite:
					break;
				default:
					this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.SPAWNENEMY_AUDIO_KEY, loop: false, holdReference: false});
					
			}
	}
    /**
	 * This method handles spawning a bubble from the object-pool of bubbles
	 * 
	 * @remark
	 * 
	 * If there are no bubbles in the object-pool, then a bubble shouldn't be spawned and 
	 * the bubble-spawn timer should not be reset. Otherwise a bubble should be spawned
	 * and the bubble-spawn timer should be reset.
	 * 
	 * Bubbles should randomly spawn inside of the padded area of the viewport just below
	 * the visible region of the viewport. A visualization of the padded viewport is shown 
     * below. o's represent valid bubble spawn locations. X's represent invalid locations.
	 * 
	 * 
	 * 					 X	 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|						X					X	|
	 * 			|		 _______________________________		|
	 * 			|		|								|		|
	 * 			|		|								|		|
	 *	 		|		|	  THIS IS THE VISIBLE		|		|
	 * 		X	|	X	|			 REGION				|	X	|   X 
	 * 			|		|								|		|
	 * 			|		|		X						|		|
	 * 			|		|_______________________________|		|
	 * 			|			o			o			o		X	|
	 * 			|_______________________________________________|
	 * 
	 * 							X THIS IS OUT OF BOUNDS
	 */
	protected spawnBubble(): void {
		// TODO spawn bubbles!
		let bubble: Graphic = this.bubbles.find((bubble: Graphic) => { return !bubble.visible });

		if (bubble){
			// Bring this bubble to life
			bubble.visible = true;

			// Extract the size of the viewport
			let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
			let viewportSize = this.viewport.getHalfSize().scaled(2);

			// Loop on position until we're clear of the player
			bubble.position.copy(RandUtils.randVec(0, viewportSize.x, viewportSize.y, paddedViewportSize.y));
			while(bubble.position.distanceTo(this.player.position) < 100){
				bubble.position.copy(RandUtils.randVec(0, viewportSize.x, viewportSize.y, paddedViewportSize.y));
			}

			bubble.setAIActive(true, {});
			// Start the bubble spawn timer - spawn a bubble every half a second I think
			this.bubbleSpawnTimer.start(100);

		}
	}


	protected spawnProjectile(event: GameEvent): void {
		//console.log("hello");
		let p = event.data.get("projectileInfo");
		let src = event.data.get("src");
		//console.log(p);
        //TODO give this access to sprites and set sprite to weak or invincible depending
        let projectile = this.add.animatedSprite("MINE", HW2Layers.PRIMARY);
			
		// Make our mine inactive by default
		projectile.visible = true;

		// Assign them mine ai
		projectile.addAI(ProjectileBehavior, {});

		projectile.scale.set(3.0, 3.0);

		// Give them a collision shape
		let collider = new AABB(Vec2.ZERO, projectile.sizeWithZoom);
		projectile.setCollisionShape(collider);

		this.projectiles.push(projectile);
		/*
        projectile.setAIActive(true, {behavior: p.behavior, src: p.src, player: p.player, dst: p.dst,
                                        projectileSpeed: p.projectileSpeed, projectileFrequency: p.projectileFrequency, projectileLaserLength: p.projectileLaserLength,
                                        light: p.light, splitX: p.splitX, invincible: p.invincible,});
		*/

		projectile.setAIActive(true, {src: src, player: this.player, info: p});


    }
	/**
	 * This function takes in a GameNode that may be out of bounds of the viewport and
	 * "kills" it as if it was destroyed through usual collision. This is done so that
	 * the object pools are refreshed. Once an object is off the screen, it's no longer 
	 * in use.
	 * 
	 * @param node The node to wrap around the screen
	 * @param viewportCenter The center of the viewport
	 * @param paddedViewportSize The size of the viewport with padding
	 * 
	 * @remarks
	 * 
	 * You'll notice that if you play the game without changing any of the code, miness will 
	 * suddenly stop coming. This is because all of those objects are still active in the scene,
     * just out of sight, so to our object pools we've used up all valid objects.
	 * 
	 * Keep in mind that the despawn area in this case is padded, meaning that a GameNode can 
	 * go off the side of the viewport by the padding amount in any direction before it will be 
	 * despawned. 
	 * 
	 * A visualization of the padded viewport is shown below. o's represent valid locations for 
	 * GameNodes, X's represent invalid locations.
	 * 
	 * 
	 * 					 X	 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|						o						|
	 * 			|		 _______________________________		|
	 * 			|		|								|		|
	 * 			|		|								|		|
	 *	 		|		|	  THIS IS THE VISIBLE		|		|
	 * 		X	|	o	|			 REGION				|	o	|   X 
	 * 			|		|								|		|
	 * 			|		|		o						|		|
	 * 			|		|_______________________________|		|
	 * 			|							o					|
	 * 			|_______________________________________________|
	 * 
	 * 							X THIS IS OUT OF BOUNDS
	 * 
	 * It may be helpful to make your own drawings while figuring out the math for this part.
	 */
	public handleScreenDespawn(node: CanvasNode): void {

		//this kinda sucks
		if(node.visible)
		{
			if(node.position.x + node.sizeWithZoom.x < -700)
				node.visible = false;
			else if(node.constructor.name === "Light" && node.position.x < 500)
				node.visible = false;
				//Todo set light for node to false if it has one by sending out an event

		}
	}

	/** Methods for updating the UI */

	/**
	 * This method handles updating the player's healthbar in the UI.
	 * 
	 * @param currentHealth the current health of the player
	 * @param maxHealth the maximum amount of health the player can have
	 * 
	 * @remarks
	 * 
	 * The player's healthbar in the UI is updated to reflect the current health
	 * of the player. The method should be called in response to a player health
	 * change event.
	 * 
	 * The player's healthbar has two components:
	 * 
	 * 1.) The actual healthbar (the colored portion)
	 * 2.) The healthbar background
	 * 
	 * The size of the healthbar background should reflect the maximum amount of
	 * health the player can have. The size of the colored healthbar should reflect
	 * the current health of the player.
	 * 
	 * If the players health is less then 1/4 of the player's maximum health, the
	 * healthbar should be colored red. If the players health is less then 3/4 of
	 * the player's maximum health but no less than 1/4e the player's maximum health, 
	 * then the healthbar should appear yellow. If the player's health is greater 
	 * than 3/4 of the player's maximum health, then the healthbar should appear green.
	 * 
	 * @see Color for more information about colors
	 * @see Label for more information about labels 
	 */
	protected handleHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.healthBarBg.size.x / maxHealth;

		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}
	/**
	 * This method handles updating the player's air-bar in the UI.
	 * 
	 * @param currentAir the current amount of air the player has
	 * @param maxAir the maximum amount of air the player can have
	 * 
	 * @remarks
	 * 
	 * This method functions very similarly to how handleHealthChange function. The
	 * method should update the UI in response to a player-air-change event to 
	 * reflect the current amount of air the player has left.
	 * 
	 * The air-bar has two components:
	 * 
	 * 1.) The actual air-bar (the colored portion)
	 * 2.) The air-bar background
	 * 
	 * The size of the air-bar background should reflect the maximum amount of
	 * air the player can have. The size of the colored air-bar should reflect
	 * the current amount of air the player has.
	 * 
	 * Unlike the healthbar, the color of the air-bar should be a constant cyan.
	 * 
	 * @see Label for more information about labels
	 */
	protected handleAirChange(currentAir: number, maxAir: number): void {
		let unit = this.airBarBg.size.x / maxAir;
		this.airBar.size.set(this.airBarBg.size.x - unit * (maxAir - currentAir), this.airBarBg.size.y);
		this.airBar.position.set(this.airBarBg.position.x - (unit / 2) * (maxAir - currentAir), this.airBarBg.position.y);
		//TODO FIX HARDCODED COST FOR SHOT
		this.airBar.backgroundColor = currentAir < 2.5 ? Color.RED : Color.WHITE;
	}
	/**
	 * This method handles updating the charge of player's laser in the UI.
	 * 
	 * @param currentCharge the current number of charges the player's laser has
	 * @param maxCharge the maximum amount of charges the player's laser can have
	 * 
	 * @remarks
	 * 
	 * This method updates the UI to reflect the latest state of the charge
	 * of the player's laser-beam. 
	 * 
	 * Unlike the the health and air bars, the charge bar is broken up into multiple 
	 * "bars". If the player can have a maximum of N-lasers (or charges) at a time, 
	 * then the charge-bar will have N seperate components. Each component representing 
	 * a single charge of the player's laser.
	 * 
	 * Each of the N components will be colored green or red. The green components will 
	 * reflect how many charges the player's laser has available. The red components will
	 * reflect the number of bars that need to be charged.
	 * 
	 * When a player fires a laser, the rightmost green component should become red. When 
	 * the player's laser recharges, the leftmost red component should become green.
	 * 
	 * @example
	 * 
	 * Maxcharges = 4
	 * 
	 * Before firing a laser:
	 *  _______ _______ _______ _______
	 * | GREEN | GREEN | GREEN | GREEN |
	 * |_______|_______|_______|_______|
	 * 
	 * After firing a laser:
	 *  _______ _______ _______ _______
	 * | GREEN | GREEN | GREEN |  RED  |
	 * |_______|_______|_______|_______|
	 * 
	 * After firing a second laser:
	 *  _______ _______ _______ _______
	 * | GREEN | GREEN |  RED  |  RED  |
	 * |_______|_______|_______|_______|
	 * 
	 * After waiting for a recharge
	 *  _______ _______ _______ _______
	 * | GREEN | GREEN | GREEN |  RED  |
	 * |_______|_______|_______|_______|
	 * 
	 * @see Color for more information about color
	 * @see Label for more information about labels
	 */
	protected handleChargeChange(currentCharge: number, maxCharge: number): void {
		for (let i = 0; i < currentCharge && i < this.chrgBarLabels.length; i++) {
			this.chrgBarLabels[i].backgroundColor = Color.GREEN;
		}
		for (let i = currentCharge; i < this.chrgBarLabels.length; i++) {
			this.chrgBarLabels[i].backgroundColor = Color.RED;
		}
	}

	/** Methods for collision Detection */

	/**
	 * Handles collisions between the bubbles and the player.
	 *  
	 * @return the number of collisions between the player and the bubbles in a given frame.
	 * 
	 * @remarks
	 * 
	 * The collision type is AABB to Circle. Detecting these collisions should be done using the 
	 * checkAABBtoCircleCollision() method in the HW3Scene.
	 * 
	 * Collisions between the player and bubbles should be checked during each frame. If a collision 
	 * is detected between the player and a bubble, the player should get back some air (+1) and the
     * bubble should be made invisible and returned to it's object pool.
	 * 
	 * @see HW2Scene.checkAABBtoCircleCollision the method to be used to check for a collision between
	 * an AABB and a Circle
	 */
	public handleBubblePlayerCollisions(): number {
		let collisions = 0;
		for (let bubble of this.bubbles) {
			for(let collider of this.playerHitboxes){
				if (bubble.visible && HW2Scene.checkAABBtoCircleCollision(collider.boundary, bubble.collisionShape as Circle)) {
					this.emitter.fireEvent(HW2Events.PLAYER_BUBBLE_COLLISION, {id: bubble.id});
					collisions += 1;
					break;
				}
			}
		}	
		return collisions;
	}

	/**
	 * Handles collisions between the mines and the player. 
	 * 
	 * @return the number of collisions between mines and the players
	 * 
	 * @remarks 
	 * 
	 * The collision type is an AABB to AABB collision. Collisions between the player and the mines 
	 * need to be checked each frame.
	 * 
	 * If a collision is detected between the player and a mine, the player should be notified
	 * of the collision, and the mine should be made invisible. This returns the mine to it's
	 * respective object-pool.
	 * 
	 * @see HW2Events.PLAYER_MINE_COLLISION the event to be fired when a collision is detected
	 * between a mine and the player
	 */
	public handleMinePlayerCollisions(): number {
		let collisions = 0;
		for (const mineInd in this.mines) {
			let mine = this.mines[mineInd];
			for(let collider of this.playerHitboxes){
				if (mine.visible && collider.boundary.overlaps(mine.collisionShape)) {
					if(this.tutorial && this.levelObjs[mineInd].monsterType === monsterTypes.stalagmite){
						this.completedSteer = false;
					}
					else if(this.tutorial && this.levelObjs[mineInd].monsterType === monsterTypes.electricField){
						this.usedElectricField = true;
					}
					this.emitter.fireEvent(HW2Events.PLAYER_MINE_COLLISION, {id: mine.id, monsterType: this.levelObjs[mineInd].monsterType});
					collisions += 1;
					break;
				}
			}
		}	
		return collisions;
	}

	/**
	 * Handles collisions between a laser and the mines. 
	 * 
	 * @param laser the laser Graphic
	 * @param mines the object-pool of mines
	 * @return the number of collisions between the laser and the mines
	 * 
	 * @remarks
	 * 
	 * The collision type is an AABB to AABB, collision. Collisions between a laser and the mines only 
	 * need to be checked immediatly after the laser has been fired. 
	 * 
	 * A single laser will collide with all mines in it's path. 
	 * 
	 * If a collision is detected between a laser and a mine, the mine should
	 * be returned to it's respective object-pool. The laser should be unaffected. 
	 */
	 /*
	public handleMineLaserCollisions(laser: Graphic, mines: Array<Sprite>): number {
		let collisions = 0;
		if (laser.visible) {
			for (let mine of mines) {
				if (mine.collisionShape.overlaps(laser.collisionShape)) {
					this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: mine.id, laserId: laser.id });
					collisions += 1;
				}
			}
		}
		return collisions;
	}
	*/

	public handleShootCollisions(laser: Graphic, firePosition : Vec2, angle: number, mines: Array<Sprite>){
		//TODO switch to circles and implement circle segment intersection?
		//TODO Use two lines for the edges of the laser instead of center (will need some trig)
		//TODO Stop the laser from going through invincible enemies
		let collisions = 0;
		//console.log(this.projectiles);
		if (laser.visible) {
			let hitMineList = new Array();
			for (const index in mines) {
				let mine = mines[index];
				if(mine.visible && this.levelObjs[index].monsterType != monsterTypes.electricField)
				{
					//let hitInfo = mine.collisionShape.getBoundingRect().intersectSegment(firePosition, new Vec2(1200, Math.tan(angle)*laser.size.x * -1));
					let hitInfo = mine.collisionShape.getBoundingRect().intersectSegment(firePosition, Vec2.ZERO.setToAngle(angle, 1300));
					if (hitInfo != null) {
						//this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: mine.id, laserId: laser.id, hit: hitInfo});
						hitMineList.push({mine: mine, hitInfo: hitInfo});
						collisions += 1;
						if(this.tutorial && this.levelObjs[index].monsterType == monsterTypes.default && this.shotEnemy == false){
							this.shotEnemy = true;
						}
					}
				}
			}
			if(hitMineList.length > 0)
			{
				hitMineList.sort((a, b) => {
					return firePosition.distanceTo(a.hitInfo.pos) - firePosition.distanceTo(b.hitInfo.pos);
				});
				let hitpos = hitMineList[0].hitInfo.pos;
				//console.log(firePosition.distanceTo(hitpos));
				//laser.size = new Vec2(firePosition.distanceTo(hitpos), laser.size.y);
				laser.size.x = (hitpos.x - firePosition.x);
				laser.position.x = (firePosition.x + hitpos.x)/2;
				//console.log(laser.size);

				this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: hitMineList[0].mine.id, laserId: laser.id, hit: hitMineList[0].hitInfo});
			}

			for(let projectile of this.projectiles)
			{
				if(projectile.visible)
				{
					let hitInfo = projectile.collisionShape.getBoundingRect().intersectSegment(firePosition, Vec2.ZERO.setToAngle(angle, laser.size.x));
					if (hitInfo != null) {
						this.emitter.fireEvent(HW2Events.LASER_PROJECTILE_COLLISION, { projectileId: projectile.id, laserId: laser.id, hit: hitInfo});
						//collisions += 1;
					}
				}
			}
		}
		return collisions;
	}

	//Could seperate out the stactites from the mines list to speed this up but its probably fine
	public handleStalactiteMonsterCollisions(): number {
		let collisions = 0;
		for (let mineInd in this.mines) {
			let mine = this.mines[mineInd];
			if (mine.visible && this.levelObjs[mineInd].monsterType == monsterTypes.stalactite) {
				
				for (let mon of this.mines)
				{
					if(mon.visible && mon.id !== mine.id && mine.collisionShape.overlaps(mon.collisionShape))
					{
						this.emitter.fireEvent(HW2Events.ENEMY_STALACTITE_COLLISION, {stalactiteID: mine.id, monsterID: mon.id});
						collisions += 1;
					}
				}
			}
		}	
		return collisions;
	}

	public handlePlayerProjectileCollisions(): void {
		for(let proj of this.projectiles)
		{
			if(proj.visible)
			{
				for(let collider of this.playerHitboxes){
					if(collider.boundary.overlaps(proj.collisionShape))
					{
						proj.visible = false;
						proj.position.copy(Vec2.ZERO);
						this.emitter.fireEvent(HW2Events.PLAYER_PROJECTILE_COLLISION, {id: proj.id});
					}
				}
			}
		}
	}

	/**
	 * This method checks for a collision between an AABB and a circle.
	 * 
	 * @param aabb the AABB
	 * @param circle the Circle
	 * @return true if the AABB is colliding with the circle; false otherwise. 
	 * 
	 * @see AABB for more information about AABBs
	 * @see Circle for more information about Circles
	 * @see MathUtils for more information about MathUtil functions
	 */
	public static checkAABBtoCircleCollision(aabb: AABB, circle: Circle): boolean {
        // TODO implement collision detection for AABBs and Circles
		if(aabb.containsPoint(circle.center))
			return true;
		/*
		let ret = false;
		if(circle.center.x < aabb.left && aabb.left - circle.center.x < circle.radius)
			ret = true;

		if(circle.center.x > aabb.right && circle.center.x - aabb.right < circle.radius)
			ret = true;

		if(circle.center.y < aabb.top)
			return aabb.top - circle.center.y < circle.radius && ret;

		if(circle.center.y > aabb.bottom)
			return circle.center.y - aabb.bottom < circle.radius && ret;

        return false;
		*/

		let nearestx = circle.center.x;
		let nearesty = circle.center.y;

		if(circle.center.x < aabb.left)
			nearestx = aabb.left;
		else if(circle.center.x > aabb.right)
			nearestx = aabb.right;

		if(circle.center.y < aabb.top)
			nearesty = aabb.top;
		else if(circle.center.y > aabb.bottom)
			nearesty = aabb.bottom;

		let distx = circle.center.x - nearestx;
		let disty = circle.center.y - nearesty;

		return Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2)) <= circle.radius;


		//return aabb.overlaps(circle.getBoundingRect());
	}

    /** Methods for locking and wrapping nodes */

    /**
	 * This function wraps the player around the top/bottom of the viewport.
	 * 
	 * @param player - the GameNode associated with the player
	 * @param viewportCenter - the coordinates of the center of the viewport
	 * @param viewportHalfSize - the halfsize of the viewport
	 * 
	 * @remarks
	 * 
	 * Wrapping the player around the screen involves moving the player over from one side of the screen 
	 * to the other side of the screen once the player has ventured too far into the padded region. To do
	 * this, you will have to:
	 * 
	 * 1.) Check if the player has moved halfway off the top or bottom of the viewport
	 * 2.) Update the player's position to the opposite side of the visible region
	 * 
	 * @see {Viewport} for more information about the viewport
	 * 
	 * For reference, a visualization of the padded viewport is shown below. The o's represent locations 
	 * where the player should be wrapped. The O's represent locations where the player should be wrapped to. 
	 * The X's represent locations where the player shouldn't be wrapped
	 * 
	 * Ex. the player should be wrapped from o1 -> O1, from o2 -> O2, etc. 
	 * 
	 * 
	 * 					 X	 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|												|
	 * 			|											    |
	 * 			|		 ___o1_______________O2_________		|
	 * 			|		|								|		|
	 * 			|		|								|		|
	 *	 		|		|	  THIS IS THE VISIBLE		|		|
	 * 		X	|	X	|			 REGION				|	X	|   X 
	 * 			|		|								|		|
	 * 			|		|		X						|		|
	 * 			|		|___O1_______________o2_________|		|
	 * 			|		   										|
	 * 			|		   						   				|
	 * 			|_______________________________________________|
	 *
	 * 							X THIS IS OUT OF BOUNDS													
	 */
	protected wrapPlayer(player: CanvasNode, viewportCenter: Vec2, viewportHalfSize: Vec2): void {
		// TODO wrap the player around the top/bottom of the screen
		if(player.position.y < viewportCenter.y - viewportHalfSize.y)
			player.position.y += viewportHalfSize.y * 2;
		else if (player.position.y > viewportCenter.y + viewportHalfSize.y)
		{
			player.position.y -= viewportHalfSize.y * 2;
		}

	}

    /**
	 * A function for locking the player's coordinates. The player should not be able to move off the 
	 * left or right side of the screen.
     * 
     * @param player - the CanvasNode associated with the player
	 * @param viewportCenter - the coordinates of the center of the viewport
	 * @param viewportHalfSize - the halfsize of the viewport 
	 * 
	 * @see {Viewport} for more information about the viewport
     * 
     * @remarks
     * 
     * More specifically, the left edge of the player's sprite should not move beyond the left edge 
     * of the viewport and the right side of the player's sprite should not move outside the right 
     * edge of the viewport.
     * 
     * For reference, a visualization of the padded viewport is shown below. The o's represent valid
     * locations for the player and the X's represent invalid locations for the player.
     * 	  
	 * 					 X	 THIS IS OUT OF BOUNDS
	 * 			 _______________________________________________
	 * 			|	 THIS IS THE PADDED REGION (OFF SCREEN)		|
	 * 			|												|
	 * 			|						X					    |
	 * 			|		 ______o______________o_________		|
	 * 			|		|								|		|
	 * 			|		X								|	X	|
	 *	 	X	|		|	  THIS IS THE VISIBLE		|		|
	 * 			|		|o			 REGION			   o|		|   X
	 * 			|		|								|		|
	 * 			|	X   |		o						X		|
	 * 			|		|_____o_______________o_________|		|
	 * 			|		   										|
	 * 			|		   				X		   				|
	 * 			|_______________________________________________|
	 *
	 * 							X THIS IS OUT OF BOUNDS	
	 * 
	 */
	protected lockPlayer(player: CanvasNode, viewportCenter: Vec2, viewportHalfSize: Vec2): void {
		// TODO prevent the player from moving off the left/right side of the screen
		if(player.position.y < viewportCenter.y - viewportHalfSize.y)
		{
			player.position.y = viewportCenter.y - viewportHalfSize.y;
		}else if (player.position.y > viewportCenter.x + viewportHalfSize.y)
		{
			player.position.y = viewportCenter.y + viewportHalfSize.y;
		}
	}

	public handleTimers(): void {
		// If the mine timer is stopped, try to spawn a mine
		/*
		if (this.mineSpawnTimer.isStopped()) {
			this.spawnMine();
		}
		*/
		// If the bubble timer is stopped, try to spawn a bubble
		/*
		if (this.bubbleSpawnTimer.isStopped()) {
			this.spawnBubble();
		}
		*/
		// If the game-over timer has run, change to the game-over scene
		if (this.gameOverTimer.hasRun() && this.gameOverTimer.isStopped()) {
			console.log("gameOverTimerEnd");
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: HW2Scene.SONG_KEY});
			this.player.ai.destroy();
			this.sceneManager.changeToScene(GameOver, {
				bubblesPopped: this.bubblesPopped, 
				minesDestroyed: this.minesDestroyed,
				timePassed: this.timePassed
			}, {});
		}
		if(this.tutorialOverTimer.hasRun() && this.tutorialOverTimer.isStopped()){
			this.player.ai.destroy();
			this.sceneManager.changeToScene(MainMenu)
		}
	}

	/**
	 * To create the illusion of an endless background, we maintain two identical background sprites and move them as the game 
     * progresses. When one background is moved completely offscreen at the bottom, it will get moved back to the top to 
     * continue the cycle.
	 */
	protected moveBackgrounds(deltaT: number): void {
		if(!this.paused)
		{
			let move = new Vec2(40, 0);
			this.bg1.position.sub(move.clone().scaled(deltaT));
			this.bg2.position.sub(move.clone().scaled(deltaT));

			let edgePos = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(-2, 0));

			if (this.bg1.position.x <= edgePos.x){
				this.bg1.position = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(2, 0))
			}
			if (this.bg2.position.x <= edgePos.x){
				this.bg2.position = this.viewport.getCenter().clone().add(this.bg2.sizeWithZoom.clone().scale(2, 0))
			}
		}
	}

	protected handlePause(): void {
		this.paused = !this.paused;
		this.pause.setHidden(!this.paused);

		this.player.aiActive = !this.paused;
		for(let x of this.lasers)
		{
			x.aiActive = !this.paused;
		}
				
		for(let x of this.mines)
		{
			x.aiActive = !this.paused;
		}

		for(let x of this.projectiles)
		{
			x.aiActive = !this.paused;
		}
	}

	protected checkLevelEnd(): void {
		if(this.curMonsterIndex != this.mines.length)
			return;


		for(let i = this.mines.length - 1; i >= 0 && i >= this.mines.length - 5; i--)
		{
			if(this.mines[i].position.x > 0 && this.mines[i].visible)
				return;
		}

		//The level is over
		if(this.gameOverTimer.isStopped())
			this.gameOverTimer.start();
	}

	protected handleTimeSkip(): void {
		let time = -1;
		if(Input.isKeyPressed("q"))
		{
			if(Input.isKeyJustPressed("1"))
				time = 10;
			if(Input.isKeyJustPressed("2"))
				time = 20;
			if(Input.isKeyJustPressed("3"))
				time = 30;
			if(Input.isKeyJustPressed("4"))
				time = 40;
			if(Input.isKeyJustPressed("5"))
				time = 50;
			if(Input.isKeyJustPressed("6"))
				time = 60;
			if(Input.isKeyJustPressed("7"))
				time = 70;
			if(Input.isKeyJustPressed("8"))
				time = 80;
			if(Input.isKeyJustPressed("9"))
				time = 90;
			if(Input.isKeyJustPressed("0"))
				time = 0;
		}
		
		if(time != -1)
		{
			for(let x of this.mines) x.visible = false;
			for(let x of this.projectiles) x.visible = false;
			this.timePassed = time;
			this.curMonsterIndex = 0;
			for(;this.levelObjs[this.curMonsterIndex].spawnTime < time; this.curMonsterIndex++);
		}
	}

	protected handleTutorialText(): void {
		if(this.closedLight && this.current_tutorialSection===1){
			this.tutorialText.setText("↑↑↑ Using the light needs energy(restores when closed)")
			return
		}
		if(this.openedLight && this.current_tutorialSection===2){
			this.tutorialText.setText("Press A and D to Steer the plane, try to steer through the obstacles.")
			return
		}
		if(this.completedSteer && this.current_tutorialSection===3){
			this.tutorialText.setText("Electric fields restore your battery quickly.")
			return
		}
		if(this.usedElectricField && this.current_tutorialSection===4){
			this.tutorialText.setText("Aim at the enemy, press L to shoot!")	
			return
		}
		if(this.shotEnemy && this.current_tutorialSection===5){
			this.tutorialText.setText("Hold K to narrow the headlights.")
			this.tutorialText2.setText("it can be used to aim more accurately and weaken certain enemies.")
			return
		}
		if(this.weakToLightDead && this.current_tutorialSection===6){
			this.tutorialText.setText("Congratulation, you have completed the tutorial!")
			this.tutorialText2.setText("")
			return
		}
	}

}

