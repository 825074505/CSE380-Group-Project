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

// Layers in the main menu
const MainMenuLayer = {
    MAIN_MENU: "MAIN_MENU", 
    CONTROLS: "CONTROLS",
    ABOUT: "ABOUT",
    LEVEL_SELECT: "LEVEL_SELECT",
    BEST_SCORES: "BEST_SCORES"
} as const

// Events triggered in the main menu
const MainMenuEvent = {
    PLAY_GAME: "PLAY_GAME",
	CONTROLS: "CONTROLS",
	ABOUT: "ABOUT",
	MENU: "MENU",
    PLAY_RECORDING: "PLAY_RECORDING",
    LEVEL_SELECT: "LEVEL_SELECT",
    BEST_SCORES: "BEST_SCORES",
    EXIT: "EXIT"

} as const;

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private levelSelect: Layer;
    private bestScores : Layer;
    private seed: string;

    public override startScene(){
        const center = this.viewport.getCenter();

        // Main menu screen
        this.mainMenu = this.addUILayer(MainMenuLayer.MAIN_MENU);

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
        const about = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 100), text: "Back Story"});
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

        // Add exit button
        const exit = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(center.x, center.y + 400), text: "Exit"});
        exit.size.set(200, 50);
        exit.borderWidth = 2;
        exit.borderColor = Color.WHITE;
        exit.backgroundColor = Color.TRANSPARENT;
        exit.onClickEventId = MainMenuEvent.EXIT;

        const header = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 50), text: "-Press W to pitch up"});
        ws.textColor = Color.WHITE;
        const ss = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y), text: "-Press S to pitch down"});
        ss.textColor = Color.WHITE;
        const ls = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: "-Press L to shoot bullets"});
        ls.textColor = Color.WHITE;
        const js = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 100), text: "-Press J to Toggle Headlights"});
        js.textColor = Color.WHITE
        const ks = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 150), text: "-Held K to Narrow Headlights"});
        ks.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 250), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = MainMenuEvent.MENU;

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.ABOUT, {position: new Vec2(center.x, center.y - 350), text: "BackStory"});
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

        // Subscribe to the button events
        this.receiver.subscribe(MainMenuEvent.PLAY_GAME);
        this.receiver.subscribe(MainMenuEvent.CONTROLS);
        this.receiver.subscribe(MainMenuEvent.ABOUT);
        this.receiver.subscribe(MainMenuEvent.MENU);
        this.receiver.subscribe(MainMenuEvent.PLAY_RECORDING);
        this.receiver.subscribe(MainMenuEvent.LEVEL_SELECT);
        this.receiver.subscribe(MainMenuEvent.BEST_SCORES);
        this.receiver.subscribe(MainMenuEvent.EXIT);
    }

    public override updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case MainMenuEvent.PLAY_GAME: {
                this.seed = RandUtils.randomSeed();
                this.sceneManager.changeToScene(Homework1_Scene, {seed: this.seed, recording: true});
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
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
            }
        }
    }
}