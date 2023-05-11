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

	STALACTITETOP_KEY: "STALACTITETOP",
	STALACTITETOP_PATH: "hw2_assets/spritesheets/stalactiteTop.json",
	
	TUTORIALTEXT_KEY: "TUTORIALTEXT",
	TUTORIALTEXT_PATH: "hw2_assets/spritesheets/tutorialText.json",

	HEALTHBAR_KEY: "HEALTHBAR",
	HEALTHBAR_PATH: "hw2_assets/spritesheets/healthbar.json",

	ENERGYBAR_KEY: "ENERGYBAR",
	ENERGYBAR_PATH: "hw2_assets/spritesheets/energybar.json",

	GAMETEXT_KEY: "GAMETEXT",
	GAMETEXT_PATH: "hw2_assets/spritesheets/gameText.json",

	LEVELNUMS_KEY: "LEVELNUMS",
	LEVELNUMS_PATH: "hw2_assets/spritesheets/levelNumbers.json",

	EXPLOSION_KEY: "EXPLOSION",
	EXPLOSION_PATH: "hw2_assets/spritesheets/explosion.json",
}

export const SpriteKeys = {
	PLANEWINGS_KEY: "PLANEWINGS",
	PLANEWINGS_PATH: "hw2_assets/sprites/testplanewings.png",

	NOISE_KEY: "NOISE",
	NOISE_PATH: "hw2_assets/sprites/graynoise.png",

	BARFRAME_KEY: "BARFRAME",
	BARFRAME_PATH: "hw2_assets/sprites/barframe.png",

	ENERGYBARTIP_KEY: "ENERGYBARTIP",
	ENERGYBARTIP_PATH: "hw2_assets/sprites/energybartip.png",

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

	ENEMYWEAKENINGLOOP_AUDIO_KEY: "ENEMYWEAKENINGLOOP",
    ENEMYWEAKENINGLOOP_AUDIO_PATH: "hw2_assets/sounds/enemyWeakeningLoop.wav",

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
    RECHARGING_AUDIO_PATH: "hw2_assets/sounds/charge2.wav",

	PROPELLER_AUDIO_KEY: "PROPELLER",
    PROPELLER_AUDIO_PATH: "hw2_assets/sounds/propeller2.wav",

	PROPELLERUP_AUDIO_KEY: "PROPELLERUP",
    PROPELLERUP_AUDIO_PATH: "hw2_assets/sounds/propellerup3.wav",

	PROPELLERDOWN_AUDIO_KEY: "PROPELLERDOWN",
    PROPELLERDOWN_AUDIO_PATH: "hw2_assets/sounds/propellerdown2.wav",

	SELECT_AUDIO_KEY: "SELECT",
    SELECT_AUDIO_PATH: "hw2_assets/sounds/select.wav",

	HOVER_AUDIO_KEY: "HOVER",
    HOVER_AUDIO_PATH: "hw2_assets/sounds/hover.wav",

	ENEMYUNWEAK_AUDIO_KEY: "ENEMYUNWEAK",
	ENEMYUNWEAK_AUDIO_PATH: "hw2_assets/sounds/enemyUnweak.wav",

	LEVELCOMPLETE_AUDIO_KEY: "LEVELCOMPLETE",
	LEVELCOMPLETE_AUDIO_PATH: "hw2_assets/sounds/levelcomplete.mp3",
}


/**
 * This is the main scene for our game. 
 * @see Scene for more information about the Scene class and Scenes in Wolfie2D
 */
export default class HW2Scene extends Scene {

	//PAUSE Screen Pop Up Layer
	private pause : Layer;
	private paused: boolean;

	//Tutorial level stuff
	private tutorial : boolean;
	private current_tutorialSection : number = 0;
	private completedCurrentSection: boolean;
	
	private tutorialOverTimer : Timer;
	
    // A flag to indicate whether or not this scene is being recorded
    private recording: boolean;
    // The seed that should be set before the game starts
    private seed: string;

	private levels_Unlocked: number = 0;

	private backgroundKeyPaths = {};

	public static SONG_KEY = "SONG"

	// Sprites for the background images
	private bg1: Sprite;
	private bg2: Sprite;

	private bgs: Array<Sprite>;

	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private planewings: Sprite;
	private playerP1: Graphic;
	private playerP2: Graphic;
	private wideLight: Graphic;
	private narrowLight: Graphic;
	private blinkingLight: Graphic;
	private shootLight: Graphic;
	private explosion: AnimatedSprite;
	private explosionLight: Graphic;

	private playerHitboxes: Array<Graphic>;
	
	private currentLevel: number;
	private levelObjs: Array<monsterInfo>;

	// Object pool for lasers
	private lasers: Array<Graphic>;
	// Object pool for rocks
	private mines: Array<AnimatedSprite>;
	// Object pool for bubbles
	private bubbles: Array<Graphic>;

	private projectiles: Array<AnimatedSprite>;
	private lights: Array<Light>;

	// Laser/Charge labels
	private chrgLabel: Label;
	private chrgBarLabels: Array<Label>;

	// Air labels
	private airLabel: Label;
	private airBar: Label;
	private airBarBg: Label;

	// Health labels
	//private healthLabel: Label;
	private healthBar: AnimatedSprite;
	private energyBar: AnimatedSprite;
	private energyBarTip: Sprite;
	//private healthBarBg: Label;

	private levelNumber: AnimatedSprite;

	// Timers for spawning rocks and bubbles
	private mineSpawnTimer: Timer;
	private bubbleSpawnTimer: Timer;
	private gameOverTimer: Timer;
	private levelIntroTimer: Timer;

	// Keeps track of mines destroyed, bubbles popped, amount of time passed
	private bubblesPopped: number = 0;
	private minesDestroyed: number = 0;
	private timePassed: number = 0;

	private curMonsterIndex: number = 0;

	private currentSong: string;

	// The padding of the world
	private worldPadding: Vec2;

	private halfViewSize: Vec2; 

	private arcadeMode: boolean = false;

	private energyUsed: number = 0;
	private hitsTaken: number = 0;
	private dead: boolean = false;

	private tutorialTextSprite: AnimatedSprite;
	private stageClearSprite: AnimatedSprite;
	private pauseResumeSprite: AnimatedSprite;
	private pauseMenuSprite: AnimatedSprite;
	private levelSpeed: number = 1;

	private continues: number = 0;
	private cheated: boolean = false;

	private bestScoreId: string;
	/** Scene lifecycle methods */

	/**
	 * @see Scene.initScene()
	 */
	public override initScene(options: Record<string, any>): void {
		this.paused = false;
		this.currentLevel = options.level;
		this.tutorial = this.currentLevel === 0;
		if(options.arcadeMode != null) 
			this.arcadeMode = options.arcadeMode;
		if(options.energyUsed != null)
			this.energyUsed = options.energyUsed;
		if(options.hitsTaken != null)
			this.hitsTaken = options.hitsTaken;
		console.log("init, ", this.currentLevel);
		if(options.continues != null)
			this.continues = options.continues;
		else if(this.arcadeMode)
			this.continues = 2;
		if(options.levels_Unlocked != null)
			this.levels_Unlocked = options.levels_Unlocked;

		if(options.cheated != null)
			this.cheated = options.cheated;

		this.bestScoreId = options.bestScoreId;
		console.log(this.bestScoreId);
		this.levels_Unlocked = Math.max(this.levels_Unlocked, this.currentLevel - 1);

		if(levels[this.currentLevel].speedMod != null)
			this.levelSpeed = levels[this.currentLevel].speedMod;


	}
	/**
	 * @see Scene.loadScene()
	 */
	public override loadScene(){
		// Load in the background image

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

		//this.load.image(HW2Scene.BACKGROUND_KEY, levels[this.currentLevel].BACKGROUND_PATH);
		const path = levels[this.currentLevel].BACKGROUND_PATH;

		this.backgroundKeyPaths = {
				// The key and path to the background sprite
			BACKGROUND_KEY: "BACKGROUND",
			BACKGROUND_PATH: path + "bg1.png",

			BGF1_KEY: "BGF1",
			BGF1_PATH: path + "bgf1.png",

			BGF2_KEY: "BGF2",
			BGF2_PATH: path + "bgf2.png",

			BGF3_KEY: "BGF3",
			BGF3_PATH: path + "bgf3.png",

			BGF4_KEY: "BGF4",
			BGF4_PATH: path + "bgf4.png",
		}

		skeys = Object.keys(this.backgroundKeyPaths);

		for(let i = 0; i < skeys.length; i+=2)
		{
			this.load.image(this.backgroundKeyPaths[skeys[i]], this.backgroundKeyPaths[skeys[i+1]]);
		}

		this.load.spritesheet("STALAGMITE", path + "stalagmite.json");
	}
	/**
	 * @see Scene.startScene()
	 */
	public override startScene(){
		this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "TITLEMUSIC"});
		this.worldPadding = new Vec2(64, 64);
		this.sceneManager.renderingManager.lightingEnabled = true;
		this.sceneManager.renderingManager.downsamplingEnabled = true;

		// Create a background layer
		this.addLayer(HW2Layers.BACKGROUND, 0);
		this.initBackground();

		//if(this.tutorial)

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer(HW2Layers.PRIMARY, 5);
		this.addLayer("FRONT", 10);
		// Initialize the player
		this.initPlayer();
		// Initialize the Timers
		this.initTimers();
		// Initialize the UI
		this.initUI();
		this.projectiles = new Array();
		this.lights = new Array();

		this.levelObjs = levels[this.currentLevel].objs;

		// Initialize object pools
		this.initObjectPools();

		// Subscribe to player events
		this.receiver.subscribe(HW2Events.CHARGE_CHANGE);
		this.receiver.subscribe(HW2Events.SHOOT_LASER);
		this.receiver.subscribe(HW2Events.DEAD);
		this.receiver.subscribe(HW2Events.PLAYER_HEALTH_CHANGE);
		this.receiver.subscribe(HW2Events.AIR_CHANGE);
		this.receiver.subscribe(HW2Events.SPAWN_PROJECTILE);
		this.receiver.subscribe(HW2Events.MINE_EXPLODED);

		//Game events
		this.receiver.subscribe(HW2Events.RESUME_GAME);
		this.receiver.subscribe(HW2Events.BACK_TO_MAIN);
		// Subscribe to laser events
		this.receiver.subscribe(HW2Events.FIRING_LASER);
		this.receiver.subscribe(HW2Events.ENEMY_WEAKENED);
		this.receiver.subscribe("explosionend");
		this.receiver.subscribe("cheat");

		this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: HW2Scene.SONG_KEY, loop: true, holdReference: true});


		if(this.tutorial)
			this.startTutorialSection(0);
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

		
		if(this.tutorial && this.current_tutorialSection <= 1 && Input.isKeyJustPressed("j"))
			this.startTutorialSection(Math.min(this.current_tutorialSection+1, 1.5));

		if(this.tutorial && this.current_tutorialSection == 1.5 && (Input.isKeyJustPressed("a") || Input.isKeyJustPressed("d")))
			this.startTutorialSection(2);
		
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
		for (let projectile of this.projectiles) if (projectile.visible) this.handleScreenDespawn(projectile);
		//for (let bubble of this.bubbles) if (bubble.visible) this.handleScreenDespawn(bubble);
		//this.wrapPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
		this.lockPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());

		//hacky level end for level 1
		if(!this.tutorial){this.checkLevelEnd();}
		if(!this.tutorial){this.checkLevelEnd();}

		if(this.explosionLight.visible)
		{
			const el = this.explosionLight as Light;
			el.intensity = Math.max(0, el.intensity - 0.01);
		}

		//console.log(this.gameOverTimer.toString());
		/*
		if(Input.isKeyPressed("q") && Input.isKeyJustPressed("m"))
		{
			this.stopsounds();
			this.sceneManager.changeToScene(GameOver, {current_Level: 4, arcadeMode: true, energyUsed: 2, hitsTaken: 3, dead:true, continues:1, bestScoreId:this.bestScoreId}, {});
		}
		*/
		// Handle events
		while (this.receiver.hasNextEvent()) {
			this.handleEvent(this.receiver.getNextEvent());
		}
	}
    /**
     * @see Scene.unloadScene()
     */

	protected stopsounds(opt: number = 0)
	{
		this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: HW2Scene.SONG_KEY});
		if(opt == 0)
		{
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.PROPELLER_AUDIO_KEY});
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.PROPELLERUP_AUDIO_KEY});
			this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.PROPELLERDOWN_AUDIO_KEY});
		}
	}

	/*
    public override unloadScene(): void {
		// keep all resources.
		//this.load.keepSpritesheet(HW2Scene.PLAYER_KEY);
        //this.load.keepImage(HW2Scene.BACKGROUND_KEY);
        // this.load.keepSpritesheet(HW2Scene.MINE_KEY);
		// this.load.keepShader(BubbleShaderType.KEY);
		// this.load.keepShader(LaserShaderType.KEY);
	}
	*/


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
				this.wideLight.visible = false;
				this.narrowLight.visible = false;
				this.blinkingLight.visible = false;
				this.explosionLight.visible = true;
				this.dead = true;
				this.explosion.position = this.player.position.clone();
				this.explosionLight.visible = true;
				this.explosionLight.position = this.player.position.clone();
				this.explosion.visible = true;
				this.explosion.animation.play("EXPLOSION", false, "explosionend");
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
				this.handleAirChange(event.data.get("curair"), event.data.get("maxair"), event.data.get("oldair"));
				break;
			}
			case HW2Events.RESUME_GAME:{
				this.handlePause();
				break;
			}
			case HW2Events.BACK_TO_MAIN:{
				this.stopsounds();
				if(this.arcadeMode || this.tutorial){
					this.sceneManager.changeToScene(MainMenu,{screen: "mainMenu", levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId});
				}
					
				else
					this.sceneManager.changeToScene(MainMenu,{screen: "levelSelect", levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId});
				break;
				
			}
			case HW2Events.SPAWN_PROJECTILE: {
				//this.projectiles.push(event.data.get("projectile"));
				this.spawnProjectile(event);
				break;
			}
			case HW2Events.MINE_EXPLODED:
			{
				if(this.tutorial)
					this.startTutorialSection(this.current_tutorialSection + 1);
				break;
			}
			case HW2Events.ENEMY_WEAKENED:{
				if(this.tutorial){
					if(this.current_tutorialSection == 5)
						this.startTutorialSection(this.current_tutorialSection + 2);
					else
						this.startTutorialSection(this.current_tutorialSection + 1);
				}
				break;
			}
			case "explosionend": {
				this.explosion.visible = false;
				break;
			}
			case "cheat": {
				this.cheated = true;
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
		this.explosion = this.add.animatedSprite(SpritesheetKeys.EXPLOSION_KEY, HW2Layers.PRIMARY);
		this.explosion.scale.scale(6);
		this.explosion.visible = false;
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x/3, this.viewport.getCenter().y);
		this.player.scale.set(0.4, 0.4);

		this.playerP1 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});
		this.playerP2 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});
		this.playerHitboxes = new Array(3);
		for(let i = 0; i < 3; i++)
		{
			let hb = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(50, 16)});
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
																					intensity : 2.5,
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
																					tintColor : new Color(255, 40, 46, 1),
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

		this.explosionLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: this.player.position.clone(), 
																					angle : 0,
																					intensity : 0.7,
																					distance : 0,
																					tintColor : new Color(255, 143, 86),
																					angleRange : new Vec2(360, 360),
																					opacity : 0.5});
		this.explosionLight.visible = false;
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
		if(this.tutorial)
		{
			this.tutorialTextSprite = this.add.animatedSprite(SpritesheetKeys.TUTORIALTEXT_KEY, HW2Layers.UI);
			this.tutorialTextSprite.scale.set(6, 6);
			this.tutorialTextSprite.position = new Vec2(447, 741);
		}

		// HP Label
		/*
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(50, 50), text: "HP "});
		this.healthLabel.size.set(300, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";
		this.healthLabel.textColor = Color.WHITE;
		*/

		this.healthBar = this.add.animatedSprite(SpritesheetKeys.HEALTHBAR_KEY, HW2Layers.UI);
		this.healthBar.scale.set(6, 6);
		this.healthBar.position = new Vec2(192, 39);
		this.healthBar.animation.play("3", true);

		this.energyBar = this.add.animatedSprite(SpritesheetKeys.ENERGYBAR_KEY, HW2Layers.UI);
		this.energyBar.scale.set(6, 6);
		this.energyBar.position = new Vec2(192, 69);
		this.energyBar.animation.play("0", true);

		this.energyBarTip = this.add.sprite(SpriteKeys.ENERGYBARTIP_KEY, HW2Layers.UI);
		this.energyBarTip.scale.set(6, 6);
		this.energyBarTip.position = new Vec2(192 + 159, 69);

		const barFrame = this.add.sprite(SpriteKeys.BARFRAME_KEY, HW2Layers.UI);
		barFrame.scale.set(6, 6);
		barFrame.position = new Vec2(192, 69);

		this.stageClearSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, HW2Layers.UI);
		this.stageClearSprite.scale.scale(6);
		this.stageClearSprite.position = new Vec2(447, 315);
		this.stageClearSprite.animation.play("STAGECLEAR", true);
		this.stageClearSprite.visible = false;
		

		// Add Pause Screen

		this.pause = this.addUILayer(HW2Layers.PAUSE);
		this.pause.setHidden(true);
		


		const resume2 = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, HW2Layers.PAUSE);
		this.add.uiElement(UIElementType.NEWBUTTON, HW2Layers.PAUSE, {position: new Vec2(447, 315), onClickEventId: HW2Events.RESUME_GAME, sprite: resume2,
        defaultAnimation: "RESUME", hoverAnimation: "RESUMESELECT"});

		const back2 = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, HW2Layers.PAUSE);
		this.add.uiElement(UIElementType.NEWBUTTON, HW2Layers.PAUSE, {position: new Vec2(447, 435), onClickEventId: HW2Events.BACK_TO_MAIN, sprite: back2,
        defaultAnimation: "RETURNMENU", hoverAnimation: "RETURNMENUSELECT"});

		if(!this.tutorial)
		{
			this.levelNumber = this.add.animatedSprite(SpritesheetKeys.LEVELNUMS_KEY, HW2Layers.UI);
			this.levelNumber.position = new Vec2(447, 315);
			this.levelNumber.scale.scale(6);
			this.levelNumber.animation.play((this.currentLevel - 1).toString(), true);
		}
		

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

		this.levelIntroTimer = new Timer(3000);
		this.levelIntroTimer.start();

	}
	/**
	 * Initializes the background image sprites for the game.
	 */
	protected initBackground(): void {
		
		this.noiseSprite = this.add.sprite(SpriteKeys.NOISE_KEY, HW2Layers.BACKGROUND);
		this.noiseSprite.scale.set(1.5, 1.5);
		this.noiseSprite.position.copy(this.viewport.getCenter());

		this.bgs = new Array();
		this.initBackgroundHelper(this.backgroundKeyPaths["BACKGROUND_KEY"], this.viewport.getCenter(), 0, 1.5);
		let bottomMid = this.viewport.getCenter().clone().add(new Vec2(0, 225));
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF1_KEY"], bottomMid);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF2_KEY"], bottomMid);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF3_KEY"], bottomMid);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF4_KEY"], bottomMid);
		let topMid = this.viewport.getCenter().clone().sub(new Vec2(0, 225));
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF1_KEY"], topMid, Math.PI);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF2_KEY"], topMid, Math.PI);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF3_KEY"], topMid, Math.PI);
		this.initBackgroundHelper(this.backgroundKeyPaths["BGF4_KEY"], topMid, Math.PI);
	}
	//TODO
	//hardcoded size
	protected initBackgroundHelper(key: string, position: Vec2, rotation: number = 0, scale: number = 6): void {
		let index = this.bgs.push(this.add.sprite(key, HW2Layers.BACKGROUND)) - 1;
		//this.bg1.scale.set(1.5, 1.5);
		this.bgs[index].scale.set(scale, scale);
		this.bgs[index].position.copy(position);
		this.bgs[index].rotation = rotation;

		index = this.bgs.push(this.add.sprite(key, HW2Layers.BACKGROUND)) - 1;
		//this.bg1.scale.set(1.5, 1.5);
		this.bgs[index].scale.set(scale, scale);
		this.bgs[index].position = this.bgs[index-1].position.clone();
		//1.875 because 2 * 15/16 since there are extra 10 px padding for the bgs
		this.bgs[index].position.add(this.bgs[index-1].sizeWithZoom.scale(1.875, 0));
		this.bgs[index].rotation = rotation;
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
		//let x = JSON.parse(JSON.stringify(this.levelObjs[0]));
		//console.log(x);
		this.expandLevelObjs();
		this.mines = new Array(this.levelObjs.length);
		for (let i = 0; i < this.mines.length; i++){
			let skey;
			if(this.levelObjs[i].spriteKey)
				skey = this.levelObjs[i].spriteKey;
			else
			{
				switch(this.levelObjs[i].monsterType)
				{
					case monsterTypes.stalagmite:
						skey = "STALAGMITE";
						break;
					case monsterTypes.electricField:
						skey = "ELECTRICITY";
						break;
					default:
						skey = "MINE";	
				}
			}
			
			this.mines[i] = this.add.animatedSprite(skey, HW2Layers.PRIMARY);
			
			// Make our mine inactive by default
			this.mines[i].visible = false;

			// Assign them mine ai
			this.mines[i].addAI(MineBehavior2, {movementPattern: 0});

			if(this.levelObjs[i].spriteScale != null)
				this.mines[i].scale.set(this.levelObjs[i].spriteScale * 6.0, this.levelObjs[i].spriteScale * 6.0);
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
		//for(const mon of newObjList) if (mon.monsterType == monsterTypes.electricField) mon.spawnTime -= 5;
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
				index = this.recAddObjs(newMonsterList, mon.objs, index, mon.spawnTime + spawnTimeStart, mon.spawnY + spawnYOffset);
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
			laser.setAIActive(true, {src: src, dst: this.viewport.getHalfSize().scaled(4), angle: angle, levelSpeed: this.levelSpeed});
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
			this.spawnEnemy(this.curMonsterIndex);
			this.curMonsterIndex++; 
		}
	}

	protected spawnEnemy(monsterIndex: number): void {
		let mine: Sprite = this.mines[monsterIndex];

		mine.visible = true;
		// Extract the size of the viewport
		let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
		let viewportSize = this.viewport.getHalfSize().scaled(2);

		//mine.position.copy(RandUtils.randVec(viewportSize.x, paddedViewportSize.x, paddedViewportSize.y - viewportSize.y, viewportSize.y));
		mine.position = new Vec2((viewportSize.x + mine.sizeWithZoom.x/2), this.levelObjs[monsterIndex].spawnY);
		//mine.position = new Vec2(450, 450);
		const mineInfo = this.levelObjs[monsterIndex];

		let electricLight = null;
		if(mineInfo.monsterType == monsterTypes.electricField)
		{
			//mine.position = new Vec2((viewportSize.x + mine.sizeWithZoom.x/2) + 500, this.levelObjs[this.curMonsterIndex].spawnY);
			electricLight = this.add.graphic(GraphicType.LIGHT, HW2Layers.PRIMARY, {position: new Vec2(0, 0), 
																				angle : 0,
																				intensity : 0.4,
																				distance : 0,
																				tintColor : new Color(115, 195, 220, 1),
																				angleRange : new Vec2(360, 360),
																				opacity : 0.5,
																				lightScale : 1.0});
			this.lights.push(electricLight);
		}
		mine.setAIActive(true, {monInfo: mineInfo, electricLight: electricLight, player: this.player, narrowLight: this.narrowLight, wideLight: this.wideLight, speedMod: levels[this.currentLevel].speedMod});

		//sounds
		this.spawnMonsterSound(mineInfo.monsterType)
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
		let collider = new AABB(Vec2.ZERO, projectile.sizeWithZoom.clone().scale(0.75));
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
		if(node.visible && (node.position.x + node.sizeWithZoom.x < 0 || node.position.y + node.sizeWithZoom.y > 1800))
		{
			
			node.visible = false;
			console.log("node despawn");
			if(!this.tutorial)
				this.emitter.fireEvent(HW2Events.NODE_DESPAWN, {id: node.id});
			if(this.tutorial)
			{
				if(this.completedCurrentSection)
					this.startTutorialSection(this.current_tutorialSection + 1);
				else{
					this.startTutorialSection(this.current_tutorialSection);
					console.log("Correct!");
				}
			}
				
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
		/*
		let unit = this.healthBarBg.size.x / maxHealth;

		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
		*/
		this.healthBar.animation.play(currentHealth.toString(), true);
		this.hitsTaken++;
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
	protected handleAirChange(currentAir: number, maxAir: number, oldair: number): void {
		/*
		let unit = this.airBarBg.size.x / maxAir;
		this.airBar.size.set(this.airBarBg.size.x - unit * (maxAir - currentAir), this.airBarBg.size.y);
		this.airBar.position.set(this.airBarBg.position.x - (unit / 2) * (maxAir - currentAir), this.airBarBg.position.y);
		this.airBar.backgroundColor = currentAir < 2.5 ? Color.RED : Color.WHITE;*/
		//TODO think about this
		const pxlen = 51;
		const origin = this.healthBar.position.x - (57 * 6/2)  + 5*6 + 3;;
		//this.energyBar.position.set(this.healthBar.position.x + 6 * 2 - (unit * 6 / 2) * (maxAir - currentAir), this.energyBar.position.y);
		//this.airBar.backgroundColor = currentAir < 2.5 ? Color.RED : Color.WHITE;
		
		const newpxlen = pxlen;
		//console.log(origin);
		const truepos = origin + newpxlen * 6 - ((maxAir - currentAir)/maxAir) * newpxlen * 6 - 6;
		this.energyBarTip.position.set(Math.floor((truepos + 3)/6)*6 - 3, this.energyBar.position.y);
		//console.log((origin + this.energyBarTip.position.x)/2);
		this.energyBar.size.set((this.energyBarTip.position.x - origin)/(6) + 1, this.energyBar.size.y);
		this.energyBar.position.set((origin + this.energyBarTip.position.x) / 2 - 6, this.energyBar.position.y);
		
		if(oldair != null && this.gameOverTimer.isStopped() && this.timePassed > 2)
			this.energyUsed += oldair - currentAir;
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
		if(!this.dead)
		{
			for (const mineInd in this.mines) {
				let mine = this.mines[mineInd];
				for(let collider of this.playerHitboxes){
					if (mine.visible && collider.boundary.overlaps(mine.collisionShape)) {
						if(this.tutorial && this.levelObjs[mineInd].monsterType === monsterTypes.stalagmite){
							this.completedCurrentSection = false;
						}
						else if(this.tutorial && this.levelObjs[mineInd].monsterType === monsterTypes.electricField){
							//this.startTutorialSection(this.current_tutorialSection + 1);
							this.completedCurrentSection = true;
						}
						const test = mine.ai as MineBehavior2;
						if(test.alive)
						{
							this.emitter.fireEvent(HW2Events.PLAYER_MINE_COLLISION, {id: mine.id, monsterType: this.levelObjs[mineInd].monsterType});
							collisions += 1;
						}
						break;
					}
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
		let collisions = 0;
		//console.log(this.projectiles);
		if (laser.visible) {
			let hitMineList = new Array();
			for (const index in mines) {
				let mine = mines[index];
				const mineAI = mine.ai as MineBehavior2;
				if(mine.visible && this.levelObjs[index].monsterType != monsterTypes.electricField && mineAI.alive)
				{
					//let hitInfo = mine.collisionShape.getBoundingRect().intersectSegment(firePosition, new Vec2(1200, Math.tan(angle)*laser.size.x * -1));
					let hitInfo = mine.collisionShape.getBoundingRect().intersectSegment(firePosition, Vec2.ZERO.setToAngle(angle, 1300));
					if (hitInfo != null) {
						//this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: mine.id, laserId: laser.id, hit: hitInfo});
						hitMineList.push({mine: mine, hitInfo: hitInfo});
						collisions += 1;

						if(this.tutorial && this.current_tutorialSection==5){
							this.startTutorialSection(6);
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
				console.log(hitpos);
				console.log(firePosition);
				//console.log(firePosition.distanceTo(hitpos));
				laser.size = new Vec2(Math.abs(firePosition.distanceTo(hitpos))+32, laser.size.y);
				//laser.size.x = Math.abs(hitpos.distanceTo(firePosition));
				//laser.size.x = 100;
				
				//laser.size.x = hitpos.x-firePosition.x;
				//laser.position.x = (firePosition.x + hitpos.x)/2;// + Math.abs(angle/Math.PI) * laser.size.x;//+ Math.abs(angle * 10);
				//laser.position.y = (firePosition.y + hitpos.y)/2;
				//laser.position = new Vec2((firePosition.x + hitpos.x)/2, laser.position.y);
				laser.position.x = (firePosition.x + laser.size.x * 0.5);
				//console.log(laser.size);

				this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: hitMineList[0].mine.id, laserId: laser.id, hit: hitMineList[0].hitInfo});
			}

			/*	
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
			*/
		}
		return collisions;
	}

	//Could seperate out the stactites from the mines list to speed this up but its probably fine
	public handleStalactiteMonsterCollisions(): number {
		let collisions = 0;
		for (let mineInd in this.mines) {
			let mine = this.mines[mineInd];
			if (mine.visible && this.levelObjs[mineInd].monsterType == monsterTypes.stalactite) {
				let mineAI = mine.ai as MineBehavior2;
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
		const padding = 50;
		if(player.position.y < viewportCenter.y - viewportHalfSize.y + padding)
		{
			player.position.y = viewportCenter.y - viewportHalfSize.y + padding;
		}else if (player.position.y > viewportCenter.x + viewportHalfSize.y - padding)
		{
			player.position.y = viewportCenter.y + viewportHalfSize.y - padding;
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
		if(this.levelIntroTimer.hasRun() && this.levelIntroTimer.isStopped() && !this.tutorial && this.levelNumber.alpha > 0)
			this.levelNumber.alpha -= 0.01;
		// If the game-over timer has run, change to the game-over scene
		if (this.gameOverTimer.hasRun() && this.gameOverTimer.isStopped()) {
			console.log("gameOverTimerEnd");
			this.stopsounds();

			this.player.visible = false;
			if(this.arcadeMode)
			{
				//TODO track player stats and send them to a screen at the end, + add to leaderboard
				if(this.dead || this.currentLevel == levels.length - 1)
				{
					this.sceneManager.changeToScene(GameOver, {current_Level: this.currentLevel, arcadeMode: this.arcadeMode, energyUsed: this.energyUsed, hitsTaken: this.hitsTaken, dead:this.dead, continues:this.continues, levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId, cheated: this.cheated}, {});
				}
				else
				{
					this.sceneManager.changeToScene(HW2Scene, {level: this.currentLevel + 1, arcadeMode: true, energyUsed: this.energyUsed, hitsTaken: this.hitsTaken, continues: this.continues, levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId, cheated: this.cheated});
				}
			}else
			{
				this.sceneManager.changeToScene(GameOver, {current_Level: this.currentLevel, arcadeMode: this.arcadeMode, energyUsed: this.energyUsed, hitsTaken: this.hitsTaken, dead:this.dead, continues:this.continues, levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId, cheated: this.cheated}, {});
				
			}
		}
		if(this.tutorialOverTimer.hasRun() && this.tutorialOverTimer.isStopped()){
			//this.player.ai.destroy();
			this.stopsounds();
			this.sceneManager.changeToScene(MainMenu, {screen: "mainMenu", levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId}, {});
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
			
			//console.log(levels[this.currentLevel]);
			let move = new Vec2(40, 0);
			this.moveBackground(0, move, deltaT);
			this.moveBackground(2, new Vec2(25, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(4, new Vec2(50, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(6, new Vec2(75, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(8, new Vec2(100, 0).scale(this.levelSpeed), deltaT);

			this.moveBackground(10, new Vec2(25, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(12, new Vec2(50, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(14, new Vec2(75, 0).scale(this.levelSpeed), deltaT);
			this.moveBackground(16, new Vec2(100, 0).scale(this.levelSpeed), deltaT);


			this.noiseSprite.position.sub(move.clone().scaled(deltaT));
			if(this.noiseSprite.position.x <= 0)
				this.noiseSprite.position = new Vec2(900, 450)

		}
	}

	protected moveBackground(index: number, move: Vec2, deltaT: number): void {
		this.bgs[index].position.sub(move.clone().scaled(deltaT));
		this.bgs[index+1].position.sub(move.clone().scaled(deltaT));

		let edgePos = this.viewport.getCenter().clone().add(this.bgs[index].sizeWithZoom.clone().scale(-1.875, 0));

		if (this.bgs[index].position.x <= edgePos.x){
			this.bgs[index].position = new Vec2(this.viewport.getCenter().x, this.bgs[index].position.y).add(this.bgs[index].sizeWithZoom.clone().scale(1.875, 0))
		}
		if (this.bgs[index+1].position.x <= edgePos.x){
			this.bgs[index+1].position = new Vec2(this.viewport.getCenter().x, this.bgs[index].position.y).add(this.bgs[index+1].sizeWithZoom.clone().scale(1.875, 0))
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
		if(levels[this.currentLevel].boss && this.mines[0].visible)
		{
			return;
		}
		else if (!levels[this.currentLevel].boss)
		{
			if(this.curMonsterIndex != this.mines.length)
				return;


			for(let i = this.mines.length - 1; i >= 0 && i >= this.mines.length - 5; i--)
			{
				if(this.mines[i].position.x > 0 && this.mines[i].visible && this.levelObjs[i].monsterType != monsterTypes.electricField)
					return;
			}
		}
		//The level is over
		if(this.gameOverTimer.isStopped())
		{
			console.log('game over');
			this.gameOverTimer.start();
			this.stageClearSprite.visible = true;
			this.stopsounds(1);
			this.emitter.fireEvent("levelcomplete");
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.LEVELCOMPLETE_AUDIO_KEY, loop: false, holdReference: false});
		}
	}

	protected handleTimeSkip(): void {
		let time = -1;
		if(Input.isKeyPressed("q"))
		{
			if(Input.isKeyJustPressed("1")){
				time = 10;
			}
			if(Input.isKeyJustPressed("2")){
				time = 20;
			}
			if(Input.isKeyJustPressed("3")){
				time = 30;
			}
			if(Input.isKeyJustPressed("4")){
				time = 40;
			}
			if(Input.isKeyJustPressed("5")){
				time = 50;
			}
			if(Input.isKeyJustPressed("6")){
				time = 60;
			}
			if(Input.isKeyJustPressed("7")){
				time = 70;
			}
			if(Input.isKeyJustPressed("8")){
				time = 80;
			}
			if(Input.isKeyJustPressed("9")){
				time = 90;
			}
			if(Input.isKeyJustPressed("0")){
				time = 0;
			}
		}
		
		if(time != -1)
		{
			this.cheated = true;
			this.setTime(time);
		}
	}

	protected setTime(time: number): void {
		for(let x of this.mines) x.visible = false;
		//for(let x of this.projectiles) x.visible = false;
		for(let x of this.lights) x.visible = false;
		this.timePassed = time;
		this.curMonsterIndex = 0;
		for(;this.curMonsterIndex < this.levelObjs.length && this.levelObjs[this.curMonsterIndex].spawnTime < time; this.curMonsterIndex++);
	}

	protected startTutorialSection(section: number): void {
		this.current_tutorialSection = section;
		console.log("current section", section);
		this.tutorialTextSprite.animation.play(Math.ceil(section).toString(), true);
		if(section===2){
			this.spawnEnemy(0);
			this.completedCurrentSection = true;
		}
		else if(section===3){
			this.completedCurrentSection = false;
			this.spawnEnemy(1);
		}
		else if(section===4){
			this.spawnEnemy(2);
		}
		else if(section===5)
		{
			this.spawnEnemy(3);
		}
		else if(section===8){
			this.tutorialOverTimer.start();
		}

		
	}

}

