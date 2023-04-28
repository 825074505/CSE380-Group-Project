import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import UIElement from "../UIElement";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";

export default class NewButton extends UIElement{
	defaultAnimation: string;
	hoverAnimation: string;
	sprite: AnimatedSprite;
	constructor(position: Vec2, onClickEventId: string, sprite: AnimatedSprite, defaultAnimation: string, hoverAnimation: string){
		super(position);
		this.sprite = sprite;
		this.sprite.position = this.position.clone();
		this.sprite.scale.scale(6);
		this.defaultAnimation = defaultAnimation;
		this.hoverAnimation = hoverAnimation;
		this.size.set(sprite.sizeWithZoom.x * 2.5, sprite.sizeWithZoom.y * 1.6);
		console.log(this.size);
		console.log(sprite.sizeWithZoom)
		this.onClickEventId = onClickEventId;
		//this.onclick make play sound
		this.onEnter = this.nowHovering;
		this.onLeave = this.stopHovering;

		this.sprite.animation.playIfNotAlready(this.defaultAnimation, true);
	}

	nowHovering(): void {
		this.sprite.animation.playIfNotAlready(this.hoverAnimation, true);
	}

	stopHovering(): void {
		this.sprite.animation.playIfNotAlready(this.defaultAnimation, true);
	}

}