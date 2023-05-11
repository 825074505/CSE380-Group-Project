import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
export const level0Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "STALAGMITE",
	
	hitboxScaleX: 0.03,
	hitboxScaleY: 1.0,
	
	spawnY: 750,
	monsterType: monsterTypes.stalagmite,
	},
	{
	spawnTime: 0.0,
	spawnY: 500,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	monsterType: monsterTypes.default,
	movementPatterns: [{
		moveDistance: 300,
	}],
	},	
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	monsterType: monsterTypes.weakToLight,
	movementPatterns: [{
		moveDistance: 300,
	}],
	},
]