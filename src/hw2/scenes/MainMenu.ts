import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import NewButton from "../../Wolfie2D/Nodes/UIElements/NewButton";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Homework1_Scene from "./HW2Scene";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";

import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameOver from "./GameOver";

const firebaseConfig = {
  apiKey: "AIzaSyCp83am53cwUG435Nq84Hil7UWnKB6ABLc",
  authDomain: "cse380-group-project-10cc5.firebaseapp.com",
  projectId: "cse380-group-project-10cc5",
  storageBucket: "cse380-group-project-10cc5.appspot.com",
  messagingSenderId: "988123209796",
  appId: "1:988123209796:web:517632feca77c55be99c11",
  measurementId: "G-BYJCR3VV0X"
};

// Initialize Firebase
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
console.log("TESTSETSETSETSETSET");
import {
   getFirestore
} from 'firebase/firestore/lite';
const db = getFirestore(app);

import {
   getDocs,
   collection,
   query,
   orderBy,
   addDoc,
   serverTimestamp
} from 'firebase/firestore/lite';

// Layers in the main menu
const MainMenuLayer = {
    BACKGROUND: "BACKGROUND",
    MAIN_MENU: "MAIN_MENU", 
    CONTROLS: "CONTROLS",
    ABOUT: "ABOUT",
    LEVEL_SELECT: "LEVEL_SELECT",
    BEST_SCORES: "BEST_SCORES",
    SPLASH_SCREEN:"SPLASH_SCREEN"
};

// Events triggered in the main menu
const MainMenuEvent = {
    START_GAME:"START_GAME",
    PLAY_GAME: "PLAY_GAME",
	CONTROLS: "CONTROLS",
	ABOUT: "ABOUT",
	MENU: "MENU",
    PLAY_RECORDING: "PLAY_RECORDING",
    LEVEL_SELECT: "LEVEL_SELECT",
    LEVEL_PRESSED: "LEVEL_PRESSED",
    BEST_SCORES: "BEST_SCORES",
    EXIT: "EXIT",
    TUTORIAL_PRESSED: "TUTORIAL_PRESSED",
    BACKSTORY_PREV: "BACKSTORY_PREV",
    BACKSTORY_NEXT: "BACKSTORY_NEXT",
    LEADERBOARD_NEXT: "LEADERBOARD_NEXT",
    LEADERBOARD_PREV: "LEADERBOARD_PREV",
    GOTOBESTSCORE: "GOTOBESTSCORE",
};

const SpriteKeys = {
	TITLETEXT_KEY: "TITLETEXT",
    TITLETEXT_PATH: "hw2_assets/sprites/titletext.png",

    CONTROLS_KEY: "CONTROLS",
    CONTROLS_PATH: "hw2_assets/sprites/controlstext.png",

    SCOREINFO_KEY: "SCOREINFO",
    SCOREINFO_PATH: "hw2_assets/sprites/scoreinfo.png",
};

export const SpritesheetKeys = {
    GAMETEXT_KEY: "GAMETEXT",
    GAMETEXT_PATH: "hw2_assets/spritesheets/gameText.json",

    BACKSTORY_KEY: "BACKSTORY",
    BACKSTORY_PATH: "hw2_assets/spritesheets/backstoryText.json",

    LEVELNUMS_KEY: "LEVELNUMS",
    LEVELNUMS_PATH: "hw2_assets/spritesheets/levelNumbers.json",

    ALPHANUM_KEY: "ALPHANUM",
    ALPHANUM_PATH: "hw2_assets/spritesheets/alphanum.json",

    SCORENUMS_KEY: "SCORENUMS",
    SCORENUMS_PATH: "hw2_assets/spritesheets/scorenumbers.json",
};

export const AudioKeys = {
	SELECT_AUDIO_KEY: "SELECT",
    SELECT_AUDIO_PATH: "hw2_assets/sounds/select.wav",

	HOVER_AUDIO_KEY: "HOVER",
    HOVER_AUDIO_PATH: "hw2_assets/sounds/hover.wav",

    MUSIC_AUDIO_KEY: "TITLEMUSIC",
    MUSIC_AUDIO_PATH: "hw2_assets/sounds/songs/eosttitle.mp3",
}

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private splashScreen: Layer;
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private levelSelect: Layer;
    private bestScores : Layer;
    private seed: string;

    private levels_Unlocked : number;
    private current_Level : number;

    private retScreen : string;

    private buttonSprites: Map<string, AnimatedSprite>;
    private backgroundKeyPaths = {};
    private bgs: Array<Sprite>;

    private backstorySprite: AnimatedSprite;
    private backstoryPage: number;
    private backstoryNext: NewButton;
    private backstoryPrev: NewButton;

    private leaderboardNext: NewButton;
    private leaderboardPrev: NewButton;

    private levelButtons: Array<NewButton>;

    private scores: Array<Object>;
    private bestScoreId: string;
    private bestScoreIndex: number = -1;
    private leaderboardUpdated: boolean = false;

    private currentBestScore: Object;
    private leaderBoardPage: number = 0;
    private maxLeaderBoardPage: number = 0;

    private scoreSprites: Array<Object>;

    private newScore: Object;

    public initScene(options: Record<string, any>): void {
        this.levels_Unlocked = options.levels_Unlocked ? options.levels_Unlocked : 1
        this.current_Level = 1
        this.retScreen = options.screen;
        this.newScore = options.newScore;
        this.bestScoreId = options.bestScoreId;
        console.log(this.bestScoreId);
    }

    public override loadScene(){
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

        //sounds
		let akeys = Object.keys(AudioKeys);

		for(let i = 0; i < akeys.length; i+=2)
		{
			this.load.audio(AudioKeys[akeys[i]], AudioKeys[akeys[i+1]])
		}

        const path = "hw2_assets/sprites/bg1nonoise/";
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
    }
    public override startScene(){
        this.sceneManager.renderingManager.lightingEnabled = false;
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "TITLEMUSIC", loop: true, holdReference: true});
        //this.sceneManager.renderingManager.downsamplingEnabled = false;
        const center = this.viewport.getCenter();
        this.addLayer(MainMenuLayer.BACKGROUND, 0);
        this.initBackground();
        //Splash Screen
        this.splashScreen = this.addUILayer(MainMenuLayer.SPLASH_SCREEN);
        //let bg = this.addLayer("background");
        //bg.setDepth(-100);
        //this.add.graphic("","background");
        // Main menu screen
        this.mainMenu = this.addUILayer(MainMenuLayer.MAIN_MENU);
        this.mainMenu.setHidden(true);
        // Controls screen
        this.controls = this.addUILayer(MainMenuLayer.CONTROLS);
        this.controls.setHidden(true);
        // About screen

        this.about = this.addUILayer(MainMenuLayer.ABOUT);
        this.about.setHidden(true);

        this.levelSelect = this.addUILayer(MainMenuLayer.LEVEL_SELECT);
        this.levelSelect.setHidden(true);

        this.bestScores = this.addUILayer(MainMenuLayer.BEST_SCORES);
        this.bestScores.setHidden(true);

        const playSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.SPLASH_SCREEN);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.SPLASH_SCREEN, {position: new Vec2(447, 744), onClickEventId: MainMenuEvent.START_GAME, sprite: playSprite,
        defaultAnimation: "PLAY", hoverAnimation: "PLAYSELECT", sizeModX: 2, start: true});

        const titleText = this.add.sprite(SpriteKeys.TITLETEXT_KEY, MainMenuLayer.SPLASH_SCREEN);
        titleText.scale.scale(6.0);
        titleText.position = new Vec2(447, 453);


        const tutorialSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 96), onClickEventId: MainMenuEvent.TUTORIAL_PRESSED, sprite: tutorialSprite,
        defaultAnimation: "TUTORIAL", hoverAnimation: "TUTORIALSELECT"});

        const arcadeSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 210), onClickEventId: MainMenuEvent.PLAY_GAME, sprite: arcadeSprite,
        defaultAnimation: "ARCADE", hoverAnimation: "ARCADESELECT"}); 

        const levelSelectSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 324), onClickEventId: MainMenuEvent.LEVEL_SELECT, sprite: levelSelectSprite,
        defaultAnimation: "LEVEL", hoverAnimation: "LEVELSELECT"});

        const controlsSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 438), onClickEventId: MainMenuEvent.CONTROLS, sprite: controlsSprite,
        defaultAnimation: "CONTROLS", hoverAnimation: "CONTROLSSELECT"});

        const backstorySprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 552), onClickEventId: MainMenuEvent.ABOUT, sprite: backstorySprite,
        defaultAnimation: "BACKSTORY", hoverAnimation: "BACKSTORYSELECT"});

        const highscoresSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 666), onClickEventId: MainMenuEvent.BEST_SCORES, sprite: highscoresSprite,
        defaultAnimation: "HIGHSCORES", hoverAnimation: "HIGHSCORESSELECT"});

        const returnSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.MAIN_MENU);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(447, 810), onClickEventId: MainMenuEvent.EXIT, sprite: returnSprite,
        defaultAnimation: "RETURNTITLE", hoverAnimation: "RETURNTITLESELECT"});


        const controlsText = this.add.sprite(SpriteKeys.CONTROLS_KEY, MainMenuLayer.CONTROLS);
        controlsText.scale.scale(6.0);
        controlsText.position = new Vec2(447, 453);

        const returnMenuSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.CONTROLS);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.CONTROLS, {position: new Vec2(447, 810), onClickEventId: MainMenuEvent.MENU, sprite: returnMenuSprite,
        defaultAnimation: "RETURN", hoverAnimation: "RETURNSELECT"});
       
        this.backstorySprite = this.add.animatedSprite(SpritesheetKeys.BACKSTORY_KEY, MainMenuLayer.ABOUT);
        this.backstorySprite.scale.scale(6.0);
        this.backstorySprite.position = new Vec2(447, 453);
        const reducedSize = 1;
        const returnMenu2Sprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.ABOUT);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.ABOUT, {position: new Vec2(447, 822), onClickEventId: MainMenuEvent.MENU, sprite: returnMenu2Sprite,
        defaultAnimation: "RETURN", hoverAnimation: "RETURNSELECT", sizeModX: reducedSize});

        const prevSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.ABOUT);
        this.backstoryPrev = this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.ABOUT, {position: new Vec2(171, 822), onClickEventId: MainMenuEvent.BACKSTORY_PREV, sprite: prevSprite,
        defaultAnimation: "PREV", hoverAnimation: "PREVSELECT", sizeModX: reducedSize}) as NewButton;

        const nextSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.ABOUT);
        this.backstoryNext = this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.ABOUT, {position: new Vec2(717, 822), onClickEventId: MainMenuEvent.BACKSTORY_NEXT, sprite: nextSprite,
        defaultAnimation: "NEXT", hoverAnimation: "NEXTSELECT", sizeModX: reducedSize}) as NewButton;


        // add Level Select screen Buttons
        this.levelButtons = new Array(12);
        for(let i = 0; i < this.levelButtons.length; i++)
        {
            const lsnumSprite = this.add.animatedSprite(SpritesheetKeys.LEVELNUMS_KEY, MainMenuLayer.LEVEL_SELECT);
            const pos = new Vec2(210 + ((i % 5)*114), 372+(Math.floor(i/5)*102));
            const but = this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.LEVEL_SELECT, {position: pos, onClickEventId: null, sprite: lsnumSprite,
            defaultAnimation: i.toString(), hoverAnimation: i.toString() + "s"}) as NewButton;
            but.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":i+1})}
            this.levelButtons[i] = but;
        }

        this.updateLevelSprites();

        const returnMenuSprite3 = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.LEVEL_SELECT);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(447, 810), onClickEventId: MainMenuEvent.MENU, sprite: returnMenuSprite3,
        defaultAnimation: "RETURN", hoverAnimation: "RETURNSELECT"});
        
        

        const returnMenu3Sprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.BEST_SCORES);
        this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.BEST_SCORES, {position: new Vec2(447, 822), onClickEventId: MainMenuEvent.MENU, sprite: returnMenu3Sprite,
        defaultAnimation: "RETURN", hoverAnimation: "RETURNSELECT", sizeModX: reducedSize});

        const prev2Sprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.BEST_SCORES);
        this.leaderboardPrev = this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.BEST_SCORES, {position: new Vec2(171, 822), onClickEventId: MainMenuEvent.LEADERBOARD_PREV, sprite: prev2Sprite,
        defaultAnimation: "PREV", hoverAnimation: "PREVSELECT", sizeModX: reducedSize}) as NewButton;

        const next2Sprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, MainMenuLayer.BEST_SCORES);
        this.leaderboardNext = this.add.uiElement(UIElementType.NEWBUTTON, MainMenuLayer.BEST_SCORES, {position: new Vec2(717, 822), onClickEventId: MainMenuEvent.LEADERBOARD_NEXT, sprite: next2Sprite,
        defaultAnimation: "NEXT", hoverAnimation: "NEXTSELECT", sizeModX: reducedSize}) as NewButton;
        //go to highscorebutton
        const hsb = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.BEST_SCORES, {position: new Vec2(450, 110), text:""}) as Button;
        hsb.size = new Vec2(900, 220);
        hsb.backgroundColor = new Color(150, 150, 150, 0);
		hsb.borderColor = new Color(0, 0, 0, 0);
		hsb.textColor = new Color(0, 0, 0, 0);
        hsb.onClickEventId = MainMenuEvent.GOTOBESTSCORE;
        
        const line = this.add.graphic(GraphicType.RECT, MainMenuLayer.BEST_SCORES, {position: new Vec2(447, 37*6), size: new Vec2(1300, 6)});
        line.color = new Color(206, 223, 225, 1);

        this.scoreSprites = new Array();

        for(let i = 0; i < 4; i++)
        {
            const position = new Array(3);
            const name = new Array(3);
            const level = new Array(2);
            const damage = new Array(2);
            const power = new Array(3);
            for(let j = 0; j < 3; j++)
            {
                position[j] = this.add.animatedSprite(SpritesheetKeys.ALPHANUM_KEY, MainMenuLayer.BEST_SCORES);
                position[j].position = new Vec2(6 * 6 + 8 * 6 * j, 17 * 6 + 29 * 6 * i);
                position[j].scale.scale(6);
                position[j].animation.play("0", true);

                name[j] = this.add.animatedSprite(SpritesheetKeys.ALPHANUM_KEY, MainMenuLayer.BEST_SCORES);
                name[j].position = position[j].position.clone().add(new Vec2(28*6, 0));
                name[j].animation.play("0", true);
                name[j].scale.scale(6);


                power[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, MainMenuLayer.BEST_SCORES);
                power[j].animation.play("0", true);
                power[j].scale.scale(6);
                power[j].position = new Vec2(900 - 16 * 6 - 3 + 5 * 6 * j, 30*6 + 29 * 6 * i)
            }
            for(let j = 0; j < 2; j++)
            {
                level[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, MainMenuLayer.BEST_SCORES);
                level[j].scale.scale(6);
                level[j].animation.play("0", true);
                level[j].position = new Vec2(52*6 + 5*6*j, 30*6 + 29 * 6 * i)
                damage[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, MainMenuLayer.BEST_SCORES);
                damage[j].scale.scale(6);
                damage[j].animation.play("0", true);
                damage[j].position = level[j].position.clone().add(new Vec2(42*6,0));
            }
            const label = this.add.sprite(SpriteKeys.SCOREINFO_KEY, MainMenuLayer.BEST_SCORES);
            label.scale.scale(6);
            label.position = new Vec2(88*6 + 3, 30*6 + 29 * 6 * i);
            this.scoreSprites.push(
                {
                    position: position,
                    name: name,
                    level: level,
                    damage: damage,
                    power: power,
                    label: label,
                }
            )
        }



        // Subscribe to the button events
        this.receiver.subscribe(MainMenuEvent.START_GAME);
        this.receiver.subscribe(MainMenuEvent.PLAY_GAME);
        this.receiver.subscribe(MainMenuEvent.CONTROLS);
        this.receiver.subscribe(MainMenuEvent.ABOUT);
        this.receiver.subscribe(MainMenuEvent.MENU);
        this.receiver.subscribe(MainMenuEvent.PLAY_RECORDING);
        this.receiver.subscribe(MainMenuEvent.LEVEL_SELECT);
        this.receiver.subscribe(MainMenuEvent.BEST_SCORES);
        this.receiver.subscribe(MainMenuEvent.EXIT);

        this.receiver.subscribe(MainMenuEvent.LEVEL_PRESSED);
        this.receiver.subscribe(MainMenuEvent.TUTORIAL_PRESSED);
        this.receiver.subscribe(MainMenuEvent.BACKSTORY_PREV);
        this.receiver.subscribe(MainMenuEvent.BACKSTORY_NEXT);
        this.receiver.subscribe(MainMenuEvent.LEADERBOARD_NEXT);
        this.receiver.subscribe(MainMenuEvent.LEADERBOARD_PREV);
        this.receiver.subscribe(MainMenuEvent.GOTOBESTSCORE);
        //show the correct screen if returned
        if(this.retScreen == "levelSelect")
        {
            this.hidePages();
            this.levelSelect.setHidden(false);

        }else if(this.retScreen == "mainMenu")
        {
            this.hidePages();
            this.mainMenu.setHidden(false);
        }else if(this.newScore != null)
        {
            this.hidePages();
        }

        //Get highscores/update high scores
        if(this.newScore != null)
        {
            this.hidePages();
            this.newScore["timestamp"] = serverTimestamp();
            addDoc(collection(db, "eostLeaderboard"), this.newScore).then((res) => {
                const q = query(collection(db, "eostLeaderboard"), orderBy("level", "desc"), orderBy("damage"), orderBy("power"), orderBy("timestamp"));
                getDocs(q).then((getres) => {
                    const index = getres.docs.findIndex(doc => doc.id === res.id);
                    this.scores = getres.docs.map((doc) => doc.data());
                    this.maxLeaderBoardPage = Math.floor((this.scores.length - 1)/3);
                    if(this.bestScoreId != null)
                    {
                        const curBestIndex = getres.docs.findIndex(doc => doc.id === this.bestScoreId);
                        if(index < curBestIndex)
                        {
                            this.bestScoreId = res.id;
                            this.bestScoreIndex = index;
                        }
                    }else
                    {
                        this.bestScoreId = res.id;
                        this.bestScoreIndex = index;
                    }
                    this.setLeaderBoardPage(Math.floor(index/3));
                    this.bestScores.setHidden(false);
                    //if(this.best)
                    console.log("newindex", index);
                    console.log("scores", this.scores);
                });
            })
        }

        
    }

    protected initBackground(): void {
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
		let index = this.bgs.push(this.add.sprite(key, MainMenuLayer.BACKGROUND)) - 1;
		//this.bg1.scale.set(1.5, 1.5);
		this.bgs[index].scale.set(scale, scale);
		this.bgs[index].position.copy(position);
		this.bgs[index].rotation = rotation;

		index = this.bgs.push(this.add.sprite(key, MainMenuLayer.BACKGROUND)) - 1;
		//this.bg1.scale.set(1.5, 1.5);
		this.bgs[index].scale.set(scale, scale);
		this.bgs[index].position = this.bgs[index-1].position.clone();
		//1.875 because 2 * 15/16 since there are extra 10 px padding for the bgs
		this.bgs[index].position.add(this.bgs[index-1].sizeWithZoom.scale(1.875, 0));
		this.bgs[index].rotation = rotation;
	}

    public override updateScene(){
        if(Input.isKeyPressed("q"))
        {
            let keys = Input.getKeysJustPressed();
            keys = keys.filter(key => "0123456789".includes(key));
            if(keys.length > 0)
                this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":Number(keys[0])});
            /*
            else if (Input.isKeyJustPressed("m"))
                this.sceneManager.changeToScene(GameOver, {current_Level: 4, arcadeMode: true, energyUsed: 2, hitsTaken: 3, dead:false, continues:1, bestScoreId: this.bestScoreId}, {});
                */
            if(Input.isKeyJustPressed("u"))
            {
                this.levels_Unlocked = 15;
                this.updateLevelSprites();
            }
        }
        if(Input.isKeyPressed("w"))
        {
            let keys = Input.getKeysJustPressed();
            keys = keys.filter(key => "0123456789".includes(key));
            if(keys.length > 0)
                this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":Number(keys[0]) + 10});
        }
        
        this.moveBackgrounds(1/60);
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected moveBackgrounds(deltaT: number): void {
        
		let move = new Vec2(40, 0);
		this.moveBackground(0, move, deltaT);
		this.moveBackground(2, new Vec2(25, 0), deltaT);
		this.moveBackground(4, new Vec2(50, 0), deltaT);
		this.moveBackground(6, new Vec2(75, 0), deltaT);
		this.moveBackground(8, new Vec2(100, 0), deltaT);

		this.moveBackground(10, new Vec2(25, 0), deltaT);
		this.moveBackground(12, new Vec2(50, 0), deltaT);
		this.moveBackground(14, new Vec2(75, 0), deltaT);
		this.moveBackground(16, new Vec2(100, 0), deltaT);
        
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

    protected setLeaderBoardPage(p: number)
    {
        this.leaderBoardPage = p;
        if(this.leaderBoardPage == 0)
        {
            this.leaderboardPrev.visible = false;
            this.leaderboardPrev.sprite.visible = false;
        }
        if(this.leaderBoardPage <= this.maxLeaderBoardPage - 1)
        {
            this.leaderboardNext.visible = true;
            this.leaderboardNext.sprite.visible = true;
        }

        if(this.leaderBoardPage >= 1)
        {
            this.leaderboardPrev.visible = true;
            this.leaderboardPrev.sprite.visible = true;
        }
        if(this.leaderBoardPage == this.maxLeaderBoardPage)
        {
            this.leaderboardNext.visible = false;
            this.leaderboardNext.sprite.visible = false;
        }

        if(this.bestScoreIndex == -1)
        {
            for(let j = 0; j < 3; j++)
            {
                this.scoreSprites[0]["name"][j].animation.play("-", true);
                this.scoreSprites[0]["position"][j].animation.play("-", true);    
            }
        }else
        {
            this.updateScoreSprites(this.bestScoreIndex, 0);
        }

        for(let i = 0; i < 3; i++)
        {
            const index = 3 * p + i;
            if(index < this.scores.length)
            {
                this.updateScoreSprites(index, i+1);
            }else
            {
                for(const list of Object.values(this.scoreSprites[i + 1]))
                {
                    if(list instanceof Sprite)
                        list.visible = false;
                    else
                    {
                        for(const x of list as Array<AnimatedSprite>)
                        {
                            x.visible = false;
                        }
                    }
                }
            }
        }
    }

    protected updateScoreSprites(index: number, i:number) :void {
        let lpos = (index + 1).toString();
        while(lpos.length < 3)
        {
            lpos = "0" + lpos;
        } 
        for(let j = 0; j < 3; j++)
        {
            this.scoreSprites[i]["name"][j].visible = true;
            this.scoreSprites[i]["name"][j].animation.play(this.scores[index]["player"][j].toUpperCase(), true);

            this.scoreSprites[i]["position"][j].visible = true;
            this.scoreSprites[i]["position"][j].animation.play(lpos[j], true);

            this.scoreSprites[i]["power"][j].visible = true;
            this.scoreSprites[i]["power"][j].animation.play(this.scores[index]["power"][j], true);

                    
        }
        for(let j = 0; j < 2; j++)
        {
            this.scoreSprites[i]["level"][j].visible = true;
            this.scoreSprites[i]["level"][j].animation.play(this.scores[index]["level"][j], true);

            this.scoreSprites[i]["damage"][j].visible = true;
            this.scoreSprites[i]["damage"][j].animation.play(this.scores[index]["damage"][j], true);
        }
        this.scoreSprites[i]["label"].visible = true;
    }
    /*
    const position = new Array(3);
            const name = new Array(3);
            const level = new Array(2);
            const damage = new Array(2);
            const power = new Array(3);*/
    protected padString(s: string, len: number, c: string = "0")
    {
        while(s.length < len)
            s = c + s;

        if(s.length > len)
            s = s.substring(0, len);
    }

    protected updateLevelSprites()
    {
        for(let i = 0; i < this.levelButtons.length; i++)
        {
            const but = this.levelButtons[i];
            if(i+1 > this.levels_Unlocked)
            {
                but.visible = false;
                but.sprite.alpha = 0.5;
            }else
            {
                but.visible = true;
                but.sprite.alpha = 1.0;
            }
        }
        
    }

    protected hidePages(): void {
        this.splashScreen.setHidden(true);
        this.controls.setHidden(true);
        this.mainMenu.setHidden(true);
        this.about.setHidden(true);
        this.levelSelect.setHidden(true);
        this.bestScores.setHidden(true);
    }
    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case MainMenuEvent.START_GAME: {
                this.hidePages();
                this.mainMenu.setHidden(false);
                break;
            }
            case MainMenuEvent.PLAY_GAME: {
                this.sceneManager.changeToScene(Homework1_Scene, {level: 1, arcadeMode: true, levels_Unlocked: this.levels_Unlocked, bestScoreId: this.bestScoreId});
                break;
            }
            case MainMenuEvent.CONTROLS: {
                this.hidePages();
                this.controls.setHidden(false);
                break;
            }
            case MainMenuEvent.ABOUT: {
                this.backstoryPage = 0;
                this.backstoryPrev.visible = false;
                this.backstoryPrev.sprite.visible = false;
                this.backstorySprite.animation.play("0", true);
                this.backstoryNext.visible = true;
                this.backstoryNext.sprite.visible = true;

                this.hidePages();
                this.about.setHidden(false);
                break;
            }
            case MainMenuEvent.MENU: {
                this.hidePages();
                this.mainMenu.setHidden(false);
                break;
            }
            case MainMenuEvent.LEVEL_SELECT: {
                this.hidePages();
                this.levelSelect.setHidden(false);

                break;
            }

            case MainMenuEvent.LEVEL_PRESSED: {
                this.current_Level = event.data.get("level");
                this.sceneManager.changeToScene(Homework1_Scene, {level: this.current_Level, levels_Unlocked: this.levels_Unlocked, bestScoreId: this.bestScoreId});
                break;

            }
            case MainMenuEvent.TUTORIAL_PRESSED: {
                this.sceneManager.changeToScene(Homework1_Scene, {level: 0, levels_Unlocked: this.levels_Unlocked, bestScoreId: this.bestScoreId});
                break;

            }
            case MainMenuEvent.BEST_SCORES:{
                // Best Scores NOT IMPLEMENTED YET
                this.hidePages();
                const q = query(collection(db, "eostLeaderboard"), orderBy("level", "desc"), orderBy("damage"), orderBy("power"), orderBy("timestamp"));
                getDocs(q).then((res) => {
                    console.log(res.docs);
                    if(this.bestScoreId != null)
                        this.bestScoreIndex = res.docs.findIndex(doc => doc.id === this.bestScoreId);
                    this.scores = res.docs.map((doc) => doc.data());
                    this.maxLeaderBoardPage = Math.floor((this.scores.length - 1)/3);
                    console.log("scores", this.scores);
                    this.bestScores.setHidden(false);    
                    this.setLeaderBoardPage(0);
                });
                
                break;
                
            }
            case MainMenuEvent.EXIT:{
                // Implement the exit functionality
                this.hidePages();
                this.splashScreen.setHidden(false);
                break;
            }

            case MainMenuEvent.BACKSTORY_NEXT:{
                this.backstoryPage++;
                this.backstorySprite.animation.play(this.backstoryPage.toString(), true);
                if(this.backstoryPage == 3)
                {
                    this.backstoryNext.visible = false;
                    this.backstoryNext.sprite.visible = false;
                }else if (this.backstoryPage == 1)
                {
                    this.backstoryPrev.visible = true;
                    this.backstoryPrev.sprite.visible = true;
                }
                break;
            }
            case MainMenuEvent.BACKSTORY_PREV:{
                this.backstoryPage--;
                this.backstorySprite.animation.play(this.backstoryPage.toString(), true);
                if(this.backstoryPage == 2)
                {
                    this.backstoryNext.visible = true;
                    this.backstoryNext.sprite.visible = true;
                }else if (this.backstoryPage == 0)
                {
                    this.backstoryPrev.visible = false;
                    this.backstoryPrev.sprite.visible = false;
                }
                break;
            }

            case MainMenuEvent.LEADERBOARD_NEXT: {
                this.leaderBoardPage++;           
                this.setLeaderBoardPage(this.leaderBoardPage);
                break;
            }

            case MainMenuEvent.LEADERBOARD_PREV: {
                this.leaderBoardPage--;
                

                this.setLeaderBoardPage(this.leaderBoardPage);
                break;
            }
            case MainMenuEvent.GOTOBESTSCORE: {
                if(this.bestScoreIndex != -1)
                {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "SELECT", loop: false, holdReference: false});
                    this.setLeaderBoardPage(Math.floor(this.bestScoreIndex/3));
                }
                break;
            }

            default: {
                throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
            }
        }
    }
}