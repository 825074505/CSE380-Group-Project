import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

/**
 * The scene after the main HW3Scene. The scene ends when the user clicks anywhere on
 * the screen.
 */
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

    public initScene(options: Record<string, any>){
        this.curLevel = options.current_Level;
        this.energyUsed = options.energyUsed;
        this.hitsTaken = options.hitsTaken;
        this.arcadeMode = options.arcadeMode;
        this.dead = options.dead;
    }

    public startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");
        if(this.dead)
        {
            const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 200), text: `You Died! Level: ${(this.curLevel)}`});
            gameOver.textColor = Color.WHITE;
        }
        else if(this.arcadeMode)
        {
            const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 200), text: "Game Complete! Thanks for Playing!"});
            gameOver.textColor = Color.WHITE;
        }else
        {
            const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 200), text: `Level ${(this.curLevel)} Complete!`});
            gameOver.textColor = Color.WHITE;
        }

        const time = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: `Hits Taken: ${(this.hitsTaken)}`});
        time.textColor = Color.GREEN;

        const mines = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 100), text: `Power Used: ${this.energyUsed.toFixed(1)}`});
        mines.textColor = Color.GREEN;

        const text = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 300), text: "Click to return to main menu"});
        text.textColor = Color.WHITE;
    }

    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu, {screen: "mainMenu"}, {});
        }
    }
}