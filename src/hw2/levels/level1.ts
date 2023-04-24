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
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.stalagmite,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 100,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 225,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 350,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 475,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 600,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 725,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 6.0,
	spriteKey: "ELECTRICITY",
	spawnY: 850,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 12.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.moveLeft,
	},
	{
	spawnTime: 16.5,
	spriteKey: "MINE",
	spawnY: 300,
	movementPattern: movementPatterns.moveLeft,
	},
	{
	spawnTime: 17.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.moveLeft,
	},
	{
	spawnTime: 21.5,
	spriteKey: "ELECTRICITY",
	spawnY: 450,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 32.5,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	movementPattern: movementPatterns.trackPlayer,
	},
	{
	spawnTime: 36.5,
	spriteKey: "ELECTRICITY",
	spawnY: 700,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 38.0,
	spriteKey: "MINE",
	spawnY: 200,
	movementPattern: movementPatterns.moveLeft,
	stoppingX: 800,

	projectiles: [{behavior: projectileBehaviors.atCurrentPos,
	speed: 200,
	waitTime: 2.5,}]
	},
	{
	spawnTime: 40.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.trackPlayer,
	},
	{
	spawnTime: 42.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.trackPlayer,
	},
	
]