import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";

/** A basic rectangle to be drawn on the screen. */
export default class Light extends Graphic {


    /** The width of the border */
    angle: number;
    angleRange: Vec2;
    intensity: number;
    distance: number;
    opacity: number;
    lightScale: number;
    tintColor: Color;
    lineEndPosition: Vec2;

    constructor(position: Vec2, angle: number, intensity: number, distance: number, opacity: number, tintColor: Color, angleRange: Vec2, lightScale: number = 1.0, lineEndPosition: Vec2 = new Vec2(-1.0, -1.0)){
        super();
        this.position = position;
        this.angle = angle;
        this.intensity = intensity;
        this.distance = distance;
        this.tintColor = tintColor;
        this.angleRange = angleRange;
        this.opacity = opacity;
        this.lightScale = lightScale;
        this.lineEndPosition = lineEndPosition;
    }
}