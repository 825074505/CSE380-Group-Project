import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
export const level1Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "STALAGMITE",

	hitboxScaleX: 0.03,
	hitboxScaleY: 1.0,

	spawnY: 675,
	monsterType: monsterTypes.stalagmite,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 475,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 12.0,
	spriteKey: "MINE",
	spawnY: 450,
	},
	{
	spawnTime: 16.5,
	spriteKey: "MINE",
	spawnY: 300,
	},
	{
	spawnTime: 17.0,
	spriteKey: "MINE",
	spawnY: 600,
	},
	{
	spawnTime: 21.5,
	spriteKey: "ELECTRICITY",
	spawnY: 450,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 32.5,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	movementPatterns: [
		{
			speed:65,
		}
	]
	},
	{
	spawnTime: 36.5,
	spriteKey: "ELECTRICITY",
	spawnY: 700,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 38.0,
	spriteKey: "MINE",
	spawnY: 200,
	movementPatterns: [{
		moveDistance: 100,
	}],

	projectiles: [{behavior: projectileBehaviors.atCurrentPos,
	speed: 200,
	waitTime: 2.5,}]
	},
	{
	spawnTime: 40.0,
	spriteKey: "MINE",
	spawnY: 600,
	},
	{
	spawnTime: 42.0,
	spriteKey: "MINE",
	spawnY: 600,
	},
	
]