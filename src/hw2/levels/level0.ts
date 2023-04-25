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
		movementPattern: movementPatterns.moveLeft,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALACTITE",
	
		hitboxScaleX: 0.03,
		hitboxScaleY: 1.0,
	
		spawnY: 150,
		movementPattern: movementPatterns.moveLeft,
		monsterType: monsterTypes.stalagmite,
		},
	{
	spawnTime: 4.0,
	spriteKey: "ELECTRICITY",
	spawnY: 500,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.default,
	},	
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.weakToLight
	},
]