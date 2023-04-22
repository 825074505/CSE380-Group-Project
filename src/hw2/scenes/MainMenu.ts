import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Homework1_Scene from "./HW2Scene";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";

// Layers in the main menu
const MainMenuLayer = {
    MAIN_MENU: "MAIN_MENU", 
    CONTROLS: "CONTROLS",
    ABOUT: "ABOUT",
    LEVEL_SELECT: "LEVEL_SELECT",
    BEST_SCORES: "BEST_SCORES",
    SPLASH_SCREEN:"SPLASH_SCREEN"
} as const

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
    EXIT: "EXIT"

} as const;

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



    public initScene(options: Record<string, any>): void {
        //this.levels_Unlocked = options.levels ? options.levels : 1
        this.levels_Unlocked = 6;
        this.current_Level = 1
        
    }

    public override startScene(){

        const center = this.viewport.getCenter();
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


        const start = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.SPLASH_SCREEN, {position: new Vec2(center.x, center.y), text: "Enter Game"});
        start.size.set(200, 50);
        start.borderWidth = 2;
        start.borderColor = Color.MAGENTA;
        start.backgroundColor = Color.TRANSPARENT;
        start.onClickEventId = MainMenuEvent.START_GAME;

        
        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y - 100), text: "Arcade Mode"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = MainMenuEvent.PLAY_GAME;

        // Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = MainMenuEvent.CONTROLS;

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 100), text: "Backstory"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = MainMenuEvent.ABOUT;

        // Add play recording button
        const levelSelect = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 200), text: "Level Select"});
        levelSelect.size.set(200, 50);
        levelSelect.borderWidth = 2;
        levelSelect.borderColor = Color.WHITE;
        levelSelect.backgroundColor = Color.TRANSPARENT;
        levelSelect.onClickEventId = MainMenuEvent.LEVEL_SELECT;


        // Add best score button
        const bestScores = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 300), text: "Best Scores"});
        bestScores.size.set(200, 50);
        bestScores.borderWidth = 2;
        bestScores.borderColor = Color.WHITE;
        bestScores.backgroundColor = Color.TRANSPARENT;
        bestScores.onClickEventId = MainMenuEvent.BEST_SCORES;

        const exit = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 400), text: "Exit"});
        exit.size.set(200, 50);
        exit.borderWidth = 2;
        exit.borderColor = Color.WHITE;
        exit.backgroundColor = Color.TRANSPARENT;
        exit.onClickEventId = MainMenuEvent.EXIT;

        // Add exit button
        /*
        const exit = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 400), text: "Exit"});
        exit.size.set(200, 50);
        exit.borderWidth = 2;
        exit.borderColor = Color.WHITE;
        exit.backgroundColor = Color.TRANSPARENT;
        exit.onClickEventId = MainMenuEvent.EXIT;
        */

        const splashHeader = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.SPLASH_SCREEN, {position: new Vec2(center.x, center.y - 200), text: "Welcome To Echoes of the Subterra"});
        splashHeader.textColor = Color.GREEN;

        const header = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 50), text: "-Press A to pitch up"});
        ws.textColor = Color.WHITE;
        const ss = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y), text: "-Press D to pitch down"});
        ss.textColor = Color.WHITE;
        const js = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 100), text: "-Press J to Toggle Headlights"});
        js.textColor = Color.WHITE
        const ks = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 150), text: "-Hold K to Narrow Headlights"});
        ks.textColor = Color.WHITE;
        const ls = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: "-Press L to shoot"});
        ls.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 250), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = MainMenuEvent.MENU;

        

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 350), text: "Backstory"});
        aboutHeader.textColor = Color.WHITE;

        const text1 = "In the midst of a fierce dogfight, pilot John Summers narrowly ";
        const text2 = "evades destruction as his plane suffers critical damage. Gasping ";
        const text3 = "for breath and with his vision blurring, he steers his crippled aircraft";
        const text4 = "towards the earth below. Desperate to evade his relentless";
        const text5 = "pursuers, John veers into the shadowy embrace of a nearby cave,";
        const text6 = "his plane disappearing into the darkness just as his consciousness";
        const text7 = "slips away. Awakening to the unnerving hum of his plane's engine,";
        const text8 = "John is disoriented and alarmed. The air whistles past his aircraft.";
        const text9 = "He peers through the windshield, but sees nothing but a deep";
        const text10 = "darkness. With a hesitant flick, he switches on the plane's ";
        const text11 = "headlights, revealing the vast expanse of an enigmatic";
        const text12 = "subterranean cave network. Sinister echoes reverberate through";
        const text13 = "the cavern, sending a shiver down John's spine. Gripping the";
        const text14 = "controls, he braces himself for the harrowing journey ahead.";
        

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 300), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 250), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 200), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 150), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 100), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 50 ), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 50), text: text8});
        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 100), text: text9});
        const line10 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 150), text: text10});
        const line11 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 200), text: text11});
        const line12 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 250), text: text12});
        const line13 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 300), text: text13});
        const line14 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 350), text: text14});

        

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;
        line4.textColor = Color.WHITE;
        line5.textColor = Color.WHITE;
        line6.textColor = Color.WHITE;
        line7.textColor = Color.WHITE;
        line8.textColor = Color.WHITE;
        line9.textColor = Color.WHITE;
        line10.textColor = Color.WHITE;
        line11.textColor = Color.WHITE;
        line12.textColor = Color.WHITE;
        line13.textColor = Color.WHITE;
        line14.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y + 400), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = MainMenuEvent.MENU;


        // add Level Select screen Buttons
        
        

        const level1 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y - 100), text: "Level 1"});
        level1.size.set(200, 50);
        level1.borderWidth = 2;
        level1.borderColor = Color.WHITE;
        level1.backgroundColor = Color.GREEN;
        level1.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":1})}

        
        const level2 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y), text: "Level 2"});
        level2.size.set(200, 50);
        level2.borderWidth = 2;
        level2.borderColor = Color.WHITE;
        level2.backgroundColor = this.levels_Unlocked >= 2 ? Color.GREEN : Color.TRANSPARENT
        level2.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":2})}

        const level3 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y + 100), text: "Level 3"});
        level3.size.set(200, 50);
        level3.borderWidth = 2;
        level3.borderColor = Color.WHITE;
        level3.backgroundColor = this.levels_Unlocked >= 3 ? Color.GREEN : Color.TRANSPARENT
        level3.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":3})}

        const level4 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y + 200), text: "Level 4"});
        level4.size.set(200, 50);
        level4.borderWidth = 2;
        level4.borderColor = Color.WHITE;
        level4.backgroundColor = this.levels_Unlocked >= 4 ? Color.GREEN : Color.TRANSPARENT
        level4.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":4})}


        const level5 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y + 300), text: "Level 5"});
        level5.size.set(200, 50);
        level5.borderWidth = 2;
        level5.borderColor = Color.WHITE;
        level5.backgroundColor = this.levels_Unlocked >= 5 ? Color.GREEN : Color.TRANSPARENT
        level5.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":5})}

        const level6 = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y + 400), text: "Level 6"});
        level6.size.set(200, 50);
        level6.borderWidth = 2;
        level6.borderColor = Color.WHITE;
        level6.backgroundColor = this.levels_Unlocked >= 6 ? Color.GREEN : Color.RED
        level6.onClick = () => {this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":6})}

        const LevelBack = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVEL_SELECT, {position: new Vec2(center.x, center.y -200), text: "Back"});
        LevelBack.size.set(200, 50);
        LevelBack.borderWidth = 2;
        LevelBack.borderColor = Color.WHITE;
        LevelBack.backgroundColor = Color.TRANSPARENT;
        LevelBack.onClickEventId = MainMenuEvent.MENU;

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
    }

    public override updateScene(){
        if(Input.isKeyJustPressed("1"))
            this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":1});
        else if (Input.isKeyJustPressed("2"))
            this.emitter.fireEvent(MainMenuEvent.LEVEL_PRESSED, {"level":2});

        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case MainMenuEvent.START_GAME: {
                this.splashScreen.setHidden(true);
                this.controls.setHidden(true);
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(true);
                break;
            }
            case MainMenuEvent.PLAY_GAME: {
                this.seed = RandUtils.randomSeed();
                this.sceneManager.changeToScene(Homework1_Scene, {level: 1, seed: this.seed, recording: true});
                break;
            }
            case MainMenuEvent.CONTROLS: {
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
                this.about.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(true);
                break;
            }
            case MainMenuEvent.ABOUT: {
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
                this.controls.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(true);
                break;
            }
            case MainMenuEvent.MENU: {
                this.mainMenu.setHidden(false);
                this.controls.setHidden(true);
                this.about.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(true);
                break;
            }
            case MainMenuEvent.LEVEL_SELECT: {
                // LEVEL SELECT SCREEN NOT IMPLEMENTED YET
                this.mainMenu.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
                this.levelSelect.setHidden(false);
                this.bestScores.setHidden(true);

                break;
            }

            case MainMenuEvent.LEVEL_PRESSED: {
                if(this.levels_Unlocked >= event.data.get("level")){
                    // Switch To Game Level Scene correspond to level selected
                    this.current_Level = event.data.get("level");
                    //this.mainMenu.setHidden(false);
                    //this.controls.setHidden(true);
                    //this.about.setHidden(true);
                    //this.levelSelect.setHidden(true);
                    //this.bestScores.setHidden(true);
                    this.seed = RandUtils.randomSeed();
                    this.sceneManager.changeToScene(Homework1_Scene, {level: this.current_Level, seed: this.seed, recording: true});
                }
                break;

            }
            case MainMenuEvent.BEST_SCORES:{
                // Best Scores NOT IMPLEMENTED YET
                this.mainMenu.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(false);
                break;
                
            }
            case MainMenuEvent.EXIT:{
                // Implement the exit functionality
                this.splashScreen.setHidden(false);
                this.mainMenu.setHidden(true);
                this.controls.setHidden(true);
                this.about.setHidden(true);
                this.levelSelect.setHidden(true);
                this.bestScores.setHidden(true);
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
            }
        }
    }
}