import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Layer from "../../Wolfie2D/Scene/Layer";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import NewButton from "../../Wolfie2D/Nodes/UIElements/NewButton";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Homework1_Scene from "./HW2Scene";
/**
 * The scene after the main HW3Scene. The scene ends when the user clicks anywhere on
 * the screen.
 */
 export const SpritesheetKeys = {
	GAMETEXT_KEY: "GAMETEXT",
	GAMETEXT_PATH: "hw2_assets/spritesheets/gameText.json",

	LEVELNUMS_KEY: "LEVELNUMS",
	LEVELNUMS_PATH: "hw2_assets/spritesheets/levelNumbers.json",

    CONTINUE_KEY: "CONTINUE",
    CONTINUE_PATH: "hw2_assets/spritesheets/gameoverbg.json",

    GAMEOVER_KEY: "GAMEOVER",
    GAMEOVER_PATH: "hw2_assets/spritesheets/scorepagesheet.json",

    ALPHANUM_KEY: "ALPHANUM",
    ALPHANUM_PATH: "hw2_assets/spritesheets/alphanum.json",

    SCORENUMS_KEY: "SCORENUMS",
    SCORENUMS_PATH: "hw2_assets/spritesheets/scorenumbers.json",
}

export const SpriteKeys = {

    SCOREINFO_KEY: "SCOREINFO",
    SCOREINFO_PATH: "hw2_assets/sprites/scoreinfo.png",

    LEVELCOMPLETE_KEY: "LEVELCOMPLETE",
    LEVELCOMPLETE_PATH: "hw2_assets/sprites/levelcomplete.png",

    GAMECOMPLETE_KEY: "GAMECOMPLETE",
    GAMECOMPLETE_PATH: "hw2_assets/sprites/gamecomplete.png",

    GAMEOVER_KEY: "GAMEOVER",
    GAMEOVER_PATH: "hw2_assets/sprites/gameover.png",
}

export const AudioKeys = {
	CONTINUE_AUDIO_KEY: "CONTINUE",
	CONTINUE_AUDIO_PATH: "hw2_assets/sounds/songs/eostcontinue.mp3",

    GAMEOVER_AUDIO_KEY: "GAMEOVER",
    GAMEOVER_AUDIO_PATH: "hw2_assets/sounds/songs/eostgameover.mp3",


	SELECT_AUDIO_KEY: "SELECT",
    SELECT_AUDIO_PATH: "hw2_assets/sounds/select.wav",

	HOVER_AUDIO_KEY: "HOVER",
    HOVER_AUDIO_PATH: "hw2_assets/sounds/hover.wav",

    TYPE_AUDIO_KEY: "TYPE",
    TYPE_AUDIO_PATH: "hw2_assets/sounds/select1.wav",

    BACKSPACE_AUDIO_KEY: "BACKSPACE",
    BACKSPACE_AUDIO_PATH: "hw2_assets/sounds/select4.wav",
}

export default class GameOver extends Scene {
    private bubblesPopped: number;
    private minesDestroyed: number;
    private timePassed: number;
    private curLevel : number;

    private bubbleTier: number;
    private mineTier: number;
    private timeTier: number;

    private energyUsed: number;
    private hitsTaken: number;
    private arcadeMode: boolean;
    private dead: boolean;
    private continues: number;
    private gameoversprite: AnimatedSprite;
    private continuesprite: AnimatedSprite;
    private scoreSprites: Object;
    private nameIndex: number = 0;
    private flashingTimer:number = 0;
    private name: string = "---";
    private powerStr: string;
    private damageStr: string;
    private levelStr: string;
    private continueScreen: boolean = false;
    private levelCompleteSprite: Sprite;
    private gameOverSprite: Sprite;
    private gameCompleteSprite: Sprite;
    private enterNameSprite: AnimatedSprite;
    private quitSprite: AnimatedSprite;
    private continueSprite: AnimatedSprite;
    private returnSprite: AnimatedSprite;
    private returnButton: NewButton;
    private levels_Unlocked: number;

    private bestScoreId: string;
    private enteredName: boolean = false;
    private cheated: boolean;

    private continueLayer: Layer;
    private gameoverLayer: Layer;


    public initScene(options: Record<string, any>){
        this.curLevel = options.current_Level;
        this.energyUsed = options.energyUsed;
        this.hitsTaken = options.hitsTaken;
        this.arcadeMode = options.arcadeMode;
        this.dead = options.dead;
        this.continues = options.continues;
        this.cheated = options.cheated;
        if(options.name != null)
            this.name = options.name.toUpperCase();

        if(this.arcadeMode && !this.dead){
            console.log("beat game");
            this.curLevel+=1;
        }
        this.powerStr = this.padString(Math.trunc(this.energyUsed).toString(), 3);
        this.levelStr = this.padString(this.curLevel.toString(), 2);
        this.damageStr = this.padString(this.hitsTaken.toString(), 2);
        if(this.arcadeMode && this.continues > 0 && this.dead)
            this.continueScreen = true;
        this.renderingManager.lightingEnabled = false;
        this.levels_Unlocked = options.levels_Unlocked;
        if(this.dead == false)
            this.levels_Unlocked += 1;
        
            
        this.bestScoreId = options.bestScoreId;

    }

    public override loadScene(){
		//this.load.audio(HW2Scene.SONG_KEY, levels[this.currentLevel].SONG_PATH);

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

		//this.load.image(HW2Scene.BACKGROUND_KEY, levels[this.currentLevel].BACKGROUND_PATH);

		
	}

    public startScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "TITLEMUSIC"});
        const center = this.viewport.getCenter();
        this.addLayer("bg", 0);
        this.addLayer("score", 5);
        this.addLayer("continue", 6);
        this.addLayer("main", 7);

        this.continueLayer = this.addUILayer("continueUI");
        this.gameoverLayer = this.addUILayer("gameoverUI");
        //backgrounds
        this.continuesprite = this.add.animatedSprite(SpritesheetKeys.CONTINUE_KEY, "bg");
        this.continuesprite.scale.scale(6);
        this.continuesprite.position = new Vec2(450, 450);
        this.continuesprite.animation.play("0", true);

        
        this.gameoversprite = this.add.animatedSprite(SpritesheetKeys.GAMEOVER_KEY, "bg");
        this.gameoversprite.scale.scale(6);
        this.gameoversprite.position = new Vec2(450, 450);
        this.gameoversprite.animation.play("0", true);
        
        


        this.levelCompleteSprite = this.add.sprite(SpriteKeys.LEVELCOMPLETE_KEY, "score");
        this.levelCompleteSprite.scale.scale(6);
        this.levelCompleteSprite.position = new Vec2(450, 450-50*6);

        this.gameCompleteSprite = this.add.sprite(SpriteKeys.GAMECOMPLETE_KEY, "score");
        this.gameCompleteSprite.scale.scale(6);
        this.gameCompleteSprite.position = new Vec2(450, 450-50*6);

        this.gameOverSprite = this.add.sprite(SpriteKeys.GAMEOVER_KEY, "score");
        this.gameOverSprite.scale.scale(6);
        this.gameOverSprite.position = new Vec2(450, 450-50*6);

        this.continueSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, "continueUI")
        this.add.uiElement(UIElementType.NEWBUTTON, "continueUI", {position: new Vec2(447, 450+25*6), onClickEventId: "continue", sprite: this.continueSprite,
        defaultAnimation: "CONTINUE", hoverAnimation: "CONTINUESELECT"});


        this.quitSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, "continueUI");
        this.add.uiElement(UIElementType.NEWBUTTON, "continueUI", {position: new Vec2(447, 450+45*6), onClickEventId: "quit", sprite: this.quitSprite,
        defaultAnimation: "QUIT", hoverAnimation: "QUITSELECT"});

        this.returnSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, "gameoverUI");
        this.returnButton = this.add.uiElement(UIElementType.NEWBUTTON, "gameoverUI", {position: new Vec2(447, 450+45*6), onClickEventId: "return", sprite: this.returnSprite,
        defaultAnimation: "RETURNMENU", hoverAnimation: "RETURNMENUSELECT"}) as NewButton;

        const credits = this.add.animatedSprite(SpritesheetKeys.ALPHANUM_KEY, "continueUI")
        credits.scale.scale(6);
        credits.position = new Vec2(450 + 30 * 6, 31*6)
        credits.animation.play(this.continues.toString(), true);





        this.enterNameSprite = this.add.animatedSprite(SpritesheetKeys.GAMETEXT_KEY, "gameoverUI");
        this.enterNameSprite.scale.scale(6);
        this.enterNameSprite.position = new Vec2(450 - 12*6, 450-28*6);
        this.enterNameSprite.animation.play("ENTERNAME", true);

        this.setUpScore();
        this.changeScreen();

        this.receiver.subscribe("continue");
        this.receiver.subscribe("quit");
        this.receiver.subscribe("submit");
        this.receiver.subscribe("return");


        
    }

    protected changeScreen()
    {
        this.gameCompleteSprite.visible = false;
        this.gameOverSprite.visible = false;
        this.levelCompleteSprite.visible = false;
        this.enterNameSprite.visible = false;
        this.continuesprite.visible = false;
        this.gameoversprite.visible = false;
        this.continueLayer.setHidden(true);
        this.gameoverLayer.setHidden(true);
        //this.returnSprite.visible = false;
        //this.quitSprite.visible = false;
        if(this.arcadeMode)
        {
            //console.log(this.dead);
            if(!this.dead)
            {
                this.gameCompleteSprite.visible = true;
                this.gameoverLayer.setHidden(false);
                this.enterNameSprite.visible = true;
                this.gameOverSprite.visible = false;
                this.gameoversprite.visible = true;
            }
            else if(this.continues > 0 && this.continueScreen)
            {
                this.continueLayer.setHidden(false);
                this.continuesprite.visible = true;
            }
            else
            {
                this.gameOverSprite.visible = true;
                this.enterNameSprite.visible = true;
                this.gameoversprite.visible = true;
                this.gameoverLayer.setHidden(false);
            }
            this.returnButton.visible = false;
            this.returnSprite.alpha = 0.3;
            this.returnButton.defaultAnimation = "SUBMIT";
            this.returnSprite.animation.play(this.returnButton.defaultAnimation);
            this.returnButton.hoverAnimation = "SUBMITSELECT";
        }
        else
        {
            this.gameoverLayer.setHidden(false);
            this.gameoversprite.visible = true;
            this.levelCompleteSprite.visible = false;
            this.returnButton.defaultAnimation = "RETURNMENU";
            this.returnButton.hoverAnimation = "RETURNMENUSELECT";
            if(this.dead)
                this.gameOverSprite.visible = true;
            else
                this.levelCompleteSprite.visible = true;
        }
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.GAMEOVER_AUDIO_KEY});
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.CONTINUE_AUDIO_KEY});
        if(this.continueScreen)
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: AudioKeys.CONTINUE_AUDIO_KEY, loop: true, holdReference: true});
        else
            this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: AudioKeys.GAMEOVER_AUDIO_KEY, loop: true, holdReference: true});
    }
    protected setUpScore(){
        {
            let i = 1.5;
            const position = new Array(3);
            const name = new Array(3);
            const level = new Array(2);
            const damage = new Array(2);
            const power = new Array(3);
            for(let j = 0; j < 3; j++)
            {
                
                position[j] = this.add.animatedSprite(SpritesheetKeys.ALPHANUM_KEY, "main");
                position[j].position = new Vec2(6 * 6 + 8 * 6 * j, 17 * 6 + 29 * 6 * i);
                position[j].visible = false;
                position[j].scale.scale(6);
                position[j].animation.play("0", true);
                
                name[j] = this.add.animatedSprite(SpritesheetKeys.ALPHANUM_KEY, "score");
                name[j].position = position[j].position.clone().add(new Vec2(28*6, 0));
                name[j].animation.play("0", true);
                name[j].scale.scale(6);


                power[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, "score");
                power[j].animation.play("0", true);
                power[j].scale.scale(6);
                power[j].position = new Vec2(900 - 16 * 6 - 3 + 5 * 6 * j, 30*6 + 29 * 6 * i)
            }
            for(let j = 0; j < 2; j++)
            {
                level[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, "score");
                level[j].scale.scale(6);
                level[j].animation.play("0", true);
                level[j].position = new Vec2(52*6 + 5*6*j, 30*6 + 29 * 6 * i)
                damage[j] = this.add.animatedSprite(SpritesheetKeys.SCORENUMS_KEY, "score");
                damage[j].scale.scale(6);
                damage[j].animation.play("0", true);
                damage[j].position = level[j].position.clone().add(new Vec2(42*6,0));
            }
            const label = this.add.sprite(SpriteKeys.SCOREINFO_KEY, "score");
            label.scale.scale(6);
            label.position = new Vec2(88*6 + 3, 30*6 + 29 * 6 * i);
            this.scoreSprites = 
                {
                    position: position,
                    name: name,
                    level: level,
                    damage: damage,
                    power: power,
                    label: label,
                }
            }
        /*
        let lpos = (index + 1).toString();
        while(lpos.length < 3)
        {
            lpos = "0" + lpos;
        }*/
        
        

        for(let j = 0; j < 3; j++)
        {
            this.scoreSprites["name"][j].visible = true;
            this.scoreSprites["name"][j].animation.play(this.name[j].toUpperCase(), true);
            /*
            this.scoreSprites[i+1]["position"][j].visible = true;
            this.scoreSprites[i+1]["position"][j].animation.play(lpos[j], true);
            */
            this.scoreSprites["power"][j].visible = true;
            this.scoreSprites["power"][j].animation.play(this.powerStr[j], true);

                    
        }
        for(let j = 0; j < 2; j++)
        {
            this.scoreSprites["level"][j].visible = true;
            this.scoreSprites["level"][j].animation.play(this.levelStr[j], true);

            this.scoreSprites["damage"][j].visible = true;
            this.scoreSprites["damage"][j].animation.play(this.damageStr[j], true);
        }
        this.scoreSprites["label"].visible = true;
    }

    protected padString(s: string, len: number, c: string = "0"): string
    {
        while(s.length < len)
            s = c + s;

        if(s.length > len)
            s = s.substring(0, len);

        return s;
    }

    protected replaceChar(s: string, c: string, i: number)
    {
        return s.substring(0, i) + c + s.substring(i+c.length);
    }

    public override updateScene(deltaT: number){
        if(this.arcadeMode  && !this.continueScreen)
        {
            let keys = Input.getKeysJustPressed();
            let nums = "1234567890";
            let letters = "qwertyuiopasdfghjklzxcvbnm";
            let mask = nums + letters;
            keys = keys.filter(key => mask.includes(key));
            let backspacePressed = Input.isKeyJustPressed("backspace");
            
            if(backspacePressed){
                //this.name[this.nameIndex] = "-";
                this.name = this.replaceChar(this.name, "-", this.nameIndex);
                this.scoreSprites["name"][this.nameIndex].animation.play(this.name[this.nameIndex], true);
                this.flashingTimer = 0;
                this.scoreSprites["name"][this.nameIndex].visible = true;
                this.nameIndex--;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.BACKSPACE_AUDIO_KEY, loop: false, holdReference: false});
                this.returnButton.visible = false;
                this.returnSprite.alpha = 0.3;
            }
            else if(keys.length > 0)
            {
                //this.name[this.nameIndex] = keys[0].toUpperCase();
                this.name = this.replaceChar(this.name, keys[0].toUpperCase(), this.nameIndex);
                this.scoreSprites["name"][this.nameIndex].animation.play(this.name[this.nameIndex], true);
                this.flashingTimer = 0;
                this.scoreSprites["name"][this.nameIndex].visible = true;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: AudioKeys.TYPE_AUDIO_KEY, loop: false, holdReference: false});
                this.nameIndex++;
                if(this.nameIndex == 3)
                {
                    this.returnButton.visible = true;
                    this.returnSprite.alpha = 1.0;
                }
            }
            this.nameIndex = MathUtils.clamp(this.nameIndex, 0, 2);

            if(Input.isKeyJustPressed("enter") && this.returnButton.visible)
                this.returnToMenu();

            if(this.flashingTimer > 0.5)
            {
                this.flashingTimer = 0;
                //console.log("here");
                this.scoreSprites["name"][this.nameIndex].visible = !this.scoreSprites["name"][this.nameIndex].visible;
            }
            this.flashingTimer += deltaT;
        }

        //console.log(this.gameOverSprite.visible);
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
        

        
        /*
        if(Input.isMouseJustPressed()){
            if(this.arcadeMode)
                this.sceneManager.changeToScene(MainMenu, {screen: "mainMenu"}, {});
            else
                this.sceneManager.changeToScene(MainMenu, {screen: "levelSelect"}, {});
        }
        */
    }
    protected returnToMenu() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.GAMEOVER_AUDIO_KEY});
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: AudioKeys.CONTINUE_AUDIO_KEY});
        if(this.arcadeMode)
        {
            if(!this.cheated)
            {
                this.sceneManager.changeToScene(MainMenu, {newScore: {
                    player: this.name.toLowerCase(),
                    power: this.powerStr,
                    damage: this.damageStr,
                    level: this.levelStr,
                }, levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId,
                }, {});
            }else
            {
                this.sceneManager.changeToScene(MainMenu, {screen: "mainMenu"}, {});
            }
            
        }else{
            this.sceneManager.changeToScene(MainMenu, {screen: "levelSelect", levels_Unlocked: this.levels_Unlocked, bestScoreId:this.bestScoreId,}, {});
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "continue": {
                this.sceneManager.changeToScene(Homework1_Scene, {level: this.curLevel, arcadeMode: true, energyUsed: this.energyUsed, hitsTaken: this.hitsTaken, continues: this.continues - 1, bestScoreId:this.bestScoreId, cheated:this.cheated});
            }
            case "quit": {
                this.continueScreen = false;
                this.changeScreen();
                break;
            }

            case "return": {
                this.returnToMenu();
                break;
            }

            default: {
                throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
            }
        }
    }
}