import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import UIElement from "../UIElement";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";
import { GameEventType } from "../../Events/GameEventType";

export default class NewButton extends UIElement{
	defaultAnimation: string;
	hoverAnimation: string;
	sprite: AnimatedSprite;
	entered: boolean = false;
	start: boolean = false;
	constructor(position: Vec2, onClickEventId: string, sprite: AnimatedSprite, defaultAnimation: string, hoverAnimation: string, sizeModX: number = 2.0, start: boolean = false){
		super(position);
		this.sprite = sprite;
		this.sprite.position = this.position.clone();
		this.sprite.scale.scale(6);
		this.defaultAnimation = defaultAnimation;
		this.hoverAnimation = hoverAnimation;
		this.size.set(sprite.sizeWithZoom.x * sizeModX, sprite.sizeWithZoom.y * 2.0);
		this.onClickEventId = onClickEventId;
		//this.onclick make play sound
		this.onEnter = this.nowHovering;
		this.onLeave = this.stopHovering;
		this.onClick = this.clicked;
		this.visible = true;
		this.start = start;

		this.sprite.animation.playIfNotAlready(this.defaultAnimation, true);
	}

	nowHovering(): void {
		if(!this.entered && this.visible && !this.layer.isHidden())
		{
			this.sprite.animation.playIfNotAlready(this.hoverAnimation, true);
			if(this.start) 
				this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "HOVER"});
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "HOVER", loop: false, holdReference: true});
			this.entered = true;
		}else
		{
			//console.log(this.entered, this.visible, !this.layer.isHidden());
		}
	}

	stopHovering(): void {
		this.sprite.animation.playIfNotAlready(this.defaultAnimation, true);
		this.entered = false;
	}

	clicked(): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "SELECT", loop: false, holdReference: false});
	}

}