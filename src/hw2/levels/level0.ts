import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
export const level0Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "STALAGMITE",
	spriteScale: new Vec2(1.0, 1.0),
	hitboxScale: new Vec2(0.1, 1.0),
	spawnY: 644,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.stalagmite,
	},
	{
	spawnTime: 4.0,
	spriteKey: "ELECTRICITY",
	spawnY: 100,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 12.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.moveLeft,
	},	
]