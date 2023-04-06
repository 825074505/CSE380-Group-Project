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
import BasicRecording from "../../Wolfie2D/Playback/BasicRecording";

import { HW2Events } from "../HW2Events";
import Layer from "../../Wolfie2D/Scene/Layer";

import MainMenu from "./MainMenu";
import Light from "../../Wolfie2D/Nodes/Graphics/Light";

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
	UI: "UI"
} as const;

type movementPatternInfo = {
	movmentPattern: number;
	period?: number;
	amplitude?: number;
	offset?: number;
}

type monsterInfo = {
	spawnTime: number;  //Amount of seconds after level has started that the enemy should spawn
	spriteKey: string;
	spawnY: number;

	movementPattern: number; //Info about movement, conisdered making this its own type but it makes it more verbose
	period?: number;
	amplitude?: number;
	offset?: number;

	phaseTime?: number;

	monsterType?: number;

	weakToLight?: boolean;
	//speed
	//projectile
}

type level = {
	monsters: Array<monsterInfo>;
	Objs: Array<monsterInfo>;
}
const level1: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.moveLeft,
	weakToLight: true,
	},
	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 250,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.spinning,
	},
	{
	spawnTime: 2.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.trackPlayer,
	monsterType: monsterTypes.weakToDark,
	},
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.sineWave,
	monsterType: monsterTypes.weakFromTop,
	},
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 100,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.stalactite,
	},
	{
	spawnTime: 6.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.triangleWave,
	},
	{
	spawnTime: 8.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.runAway,
	},
	{
	spawnTime: 10.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.phasing,
	},
]

/**
 * This is the main scene for our game. 
 * @see Scene for more information about the Scene class and Scenes in Wolfie2D
 */
export default class HW2Scene extends Scene {
    // The key and path to the player's spritesheet json data
    public static PLAYER_KEY: string = "PLAYER";
    public static PLAYER_PATH = "hw2_assets/spritesheets/AYellowBarrelWithWindows.json"
    // The key and path to the mine sprite
    public static MINE_KEY = "MINE"
    public static MINE_PATH = "hw2_assets/spritesheets/SpikyMineThing.json"
    // The key and path to the background sprite
	public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw2_assets/sprites/WavyBlueLines.png"

    // A flag to indicate whether or not this scene is being recorded
    private recording: boolean;
    // The seed that should be set before the game starts
    private seed: string;

	// Sprites for the background images
	private bg1: Sprite;
	private bg2: Sprite;

	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private playerP1: Graphic;
	private playerP2: Graphic;
	private wideLight: Graphic;
	private narrowLight: Graphic;
	private blinkingLight: Graphic;
	private shootLight: Graphic;


	private levelObjs: Array<monsterInfo>;

	// Object pool for lasers
	private lasers: Array<Graphic>;
	// Object pool for rocks
	private mines: Array<AnimatedSprite>;
	// Object pool for bubbles
	private bubbles: Array<Graphic>;

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

	// The padding of the world
	private worldPadding: Vec2;

	private halfViewSize: Vec2; 

	/** Scene lifecycle methods */

	/**
	 * @see Scene.initScene()
	 */
	public override initScene(options: Record<string, any>): void {
		console.log("SEED:" + options.seed);
		this.seed = options.seed === undefined ? RandUtils.randomSeed() : options.seed;
		RandUtils.seed = this.seed;
        this.recording = options.recording === undefined ? false : options.recording; 
	}
	/**
	 * @see Scene.loadScene()
	 */
	public override loadScene(){
		// Load in the submarine
		this.load.spritesheet(HW2Scene.PLAYER_KEY, HW2Scene.PLAYER_PATH);
		// Load in the background image
		this.load.image(HW2Scene.BACKGROUND_KEY, HW2Scene.BACKGROUND_PATH);
		// Load in the naval mine
		this.load.spritesheet(HW2Scene.MINE_KEY, HW2Scene.MINE_PATH);
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
	}
	/**
	 * @see Scene.startScene()
	 */
	public override startScene(){
		this.worldPadding = new Vec2(64, 64);

		// Create a background layer
		this.addLayer(HW2Layers.BACKGROUND, 0);
		this.initBackground();

		this.levelObjs = level1;

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer(HW2Layers.PRIMARY, 5);
		// Initialize the player
		this.initPlayer();
		// Initialize the Timers
		this.initTimers();
		// Initialize the UI
		this.initUI();
		// Initialize object pools
		this.initObjectPools();

		// Subscribe to player events
		this.receiver.subscribe(HW2Events.CHARGE_CHANGE);
		this.receiver.subscribe(HW2Events.SHOOT_LASER);
		this.receiver.subscribe(HW2Events.DEAD);
		this.receiver.subscribe(HW2Events.PLAYER_HEALTH_CHANGE);
		this.receiver.subscribe(HW2Events.AIR_CHANGE);

		// Subscribe to laser events
		this.receiver.subscribe(HW2Events.FIRING_LASER);
		if(this.recording)
		{
			this.emitter.fireEvent(GameEventType.START_RECORDING, {recording: new BasicRecording(HW2Scene, {seed: this.seed, recording: false})});
		}
	}
	/**
	 * @see Scene.updateScene 
	 */
	public override updateScene(deltaT: number){
		this.timePassed += deltaT;
		// Handle events
		while (this.receiver.hasNextEvent()) {
			this.handleEvent(this.receiver.getNextEvent());
		}
		
		// Move the backgrounds
		this.moveBackgrounds(deltaT);

		// Handles mine and bubble collisions
		this.handleMinePlayerCollisions();
		this.bubblesPopped += this.handleBubblePlayerCollisions();

		// Handle timers
		this.handleTimers();
		
		//spawns enemies if enough time has passed
		this.progressEnemies();

		this.handleStalactiteMonsterCollisions();

        // TODO Remove despawning of mines and bubbles here

		// Handle screen despawning of mines and bubbles
		for (let mine of this.mines) if (mine.visible) this.handleScreenDespawn(mine);
		for (let bubble of this.bubbles) if (bubble.visible) this.handleScreenDespawn(bubble);
		this.wrapPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
		this.lockPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
	}
    /**
     * @see Scene.unloadScene()
     */
    public override unloadScene(): void {
		// keep all resources.
		// this.load.keepSpritesheet(HW2Scene.PLAYER_KEY);
        // this.load.keepImage(HW2Scene.BACKGROUND_KEY);
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
				this.spawnLaser(event.data.get("src"), event.data.get("angle"));
				break;
			}
			case HW2Events.DEAD: {
				console.log("DEAD EVENT REACHED");
				if(this.recording)
				{
					this.emitter.fireEvent(GameEventType.STOP_RECORDING);
				}
				this.gameOverTimer.start();
				break;
			}
			case HW2Events.CHARGE_CHANGE: {
				this.handleChargeChange(event.data.get("curchrg"), event.data.get("maxchrg"));
				break;
			}
			case HW2Events.FIRING_LASER: {
				//this.minesDestroyed += this.handleMineLaserCollisions(event.data.get("laser"), this.mines);
				this.minesDestroyed += this.handleShootCollisions(event.data.get("laser"),  this.player.position, event.data.get("angle"), this.mines);
				if(this.minesDestroyed === this.levelObjs.length)
				{
					this.gameOverTimer.start();
				}
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
		this.player = this.add.animatedSprite(HW2Scene.PLAYER_KEY, HW2Layers.PRIMARY);
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x/3, this.viewport.getCenter().y);
		this.player.scale.set(0.4, 0.4);

		// Give the player a smaller hitbox
		let playerCollider = new AABB(Vec2.ZERO, this.player.sizeWithZoom);
		this.player.setCollisionShape(playerCollider);

		this.playerP1 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});
		this.playerP2 = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: this.player.position.clone(), size: new Vec2(10, 10)});

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
																					opacity : 1.0});
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


		



		// Add a playerController to the player
		this.player.addAI(PlayerController, {p1: this.playerP1, p2: this.playerP2, wideLight: this.wideLight, narrowLight: this.narrowLight, blinkingLight: this.blinkingLight, shootLight: this.shootLight, rm: this.sceneManager.renderingManager});
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

		// Air Label
		this.airLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(50, 100), text: "Air"});
		this.airLabel.size.set(300, 30);
		this.airLabel.fontSize = 24;
		this.airLabel.font = "Courier";

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

		// HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 50), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

		// AirBar
		this.airBar = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 100), text: ""});
		this.airBar.size = new Vec2(300, 25);
		this.airBar.backgroundColor = Color.CYAN;

		// HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 50), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;

		// AirBar Border
		this.airBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW2Layers.UI, {position: new Vec2(225, 100), text: ""});
		this.airBarBg.size = new Vec2(300, 25);
		this.airBarBg.borderColor = Color.BLACK;

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

		// Init the object pool of mines
		this.mines = new Array(this.levelObjs.length);
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
		for (let i = 0; i < this.mines.length; i++){
			this.mines[i] = this.add.animatedSprite(this.levelObjs[i].spriteKey, HW2Layers.PRIMARY);

			// Make our mine inactive by default
			this.mines[i].visible = false;

			// Assign them mine ai
			this.mines[i].addAI(MineBehavior2, {movementPattern: 0});

			this.mines[i].scale.set(0.3, 0.3);

			// Give them a collision shape
			let collider = new AABB(Vec2.ZERO, this.mines[i].sizeWithZoom);
			this.mines[i].setCollisionShape(collider);
		}

		

		// Init the object pool of lasers
		this.lasers = new Array(4);
		for (let i = 0; i < this.lasers.length; i++) {
			this.lasers[i] = this.add.graphic(GraphicType.RECT, HW2Layers.PRIMARY, {position: Vec2.ZERO, size: Vec2.ZERO})
			this.lasers[i].useCustomShader(LaserShaderType.KEY);
			this.lasers[i].color = Color.RED;
			this.lasers[i].visible = false;
			this.lasers[i].addAI(LaserBehavior, {src: Vec2.ZERO, dst: Vec2.ZERO});
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
	protected spawnLaser(src: Vec2, angle: number): void {
		let laser: Graphic = this.lasers.find((laser: Graphic) => { return !laser.visible; });
		if (laser) {
			laser.visible = true;
			laser.setAIActive(true, {src: src, dst: this.viewport.getHalfSize().scaled(2).add(this.worldPadding.scaled(2)), angle: angle});
		}
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
			mine.position = new Vec2((viewportSize.x + paddedViewportSize.x)/2, this.levelObjs[this.curMonsterIndex].spawnY);
			//mine.position = new Vec2(450, 450);
			const mineInfo = this.levelObjs[this.curMonsterIndex];
			mine.setAIActive(true, {movementPattern: mineInfo.movementPattern, monsterType: mineInfo.monsterType, weakToLight: mineInfo.weakToLight,
									player: this.player, narrowLight: this.narrowLight, wideLight: this.wideLight});
			this.curMonsterIndex++; 
			// Start the mine spawn timer - spawn a mine every half a second I think
			//this.mineSpawnTimer.start(100);
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

        // TODO - despawn the game nodes when they move out of the padded viewport
		if(node.visible)
		{
			let paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.worldPadding);
			let viewportSize = this.viewport.getHalfSize().scaled(2);
			if(node.collisionShape.x < viewportSize.x - paddedViewportSize.x || node.collisionShape.y < viewportSize.y - paddedViewportSize.y)
				node.visible = false;

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
			if (bubble.visible && HW2Scene.checkAABBtoCircleCollision(this.player.collisionShape as AABB, bubble.collisionShape as Circle)) {
				this.emitter.fireEvent(HW2Events.PLAYER_BUBBLE_COLLISION, {id: bubble.id});
				collisions += 1;
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
		for (let mine of this.mines) {
			if (mine.visible && this.player.collisionShape.overlaps(mine.collisionShape)) {
				this.emitter.fireEvent(HW2Events.PLAYER_MINE_COLLISION, {id: mine.id});
				collisions += 1;
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
		if (laser.visible) {
			for (let mine of mines) {
				let hitInfo = mine.collisionShape.getBoundingRect().intersectSegment(firePosition, new Vec2(1200, Math.tan(angle)*1200 * -1));
				if (hitInfo != null) {
					this.emitter.fireEvent(HW2Events.LASER_MINE_COLLISION, { mineId: mine.id, laserId: laser.id, hit: hitInfo});
					collisions += 1;
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
		if(player.position.x < viewportCenter.x - viewportHalfSize.x)
		{
			player.position.x = viewportCenter.x - viewportHalfSize.x;
		}else if (player.position.x > viewportCenter.x + viewportHalfSize.x)
		{
			player.position.x = viewportCenter.x + viewportHalfSize.x;
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
		if (this.bubbleSpawnTimer.isStopped()) {
			this.spawnBubble();
		}
		// If the game-over timer has run, change to the game-over scene
		if (this.gameOverTimer.hasRun() && this.gameOverTimer.isStopped()) {
			console.log("gameOverTimerEnd");
			if(this.recording)
			{
				this.sceneManager.changeToScene(GameOver, {
					bubblesPopped: this.bubblesPopped, 
					minesDestroyed: this.minesDestroyed,
					timePassed: this.timePassed
				}, {});
			}
		}
	}

	/**
	 * To create the illusion of an endless background, we maintain two identical background sprites and move them as the game 
     * progresses. When one background is moved completely offscreen at the bottom, it will get moved back to the top to 
     * continue the cycle.
	 */
	protected moveBackgrounds(deltaT: number): void {
		let move = new Vec2(150, 0);
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