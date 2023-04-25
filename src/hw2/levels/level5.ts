import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

const threeGuysInARow: Array<monsterInfo> = [
		{
		spawnTime: 0.0,
		spriteKey: "MINE",
		spawnY: 0,
		movementPattern: movementPatterns.moveLeft,
		},
		{
		spawnTime: 1.0,
		spriteKey: "MINE",
		spawnY: 0,
		movementPattern: movementPatterns.moveLeft,
		},
		{
		spawnTime: 2.0,
		spriteKey: "MINE",
		spawnY: 0,
		movementPattern: movementPatterns.moveLeft,
		}]
//test level, not for play
export const level5Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "ELECTRICITY",
	spawnY: 800,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 0.0,
	spawnY: 300,
	objs: threeGuysInARow,
	},
	{
	spawnTime: 4.0,
	spawnY: 600,
	objs: threeGuysInARow,
	},

	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 250,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.spinning,
	stoppingX: 800,

	projectiles: [{behavior: projectileBehaviors.atCurrentPos,
			speed: 200,
			splitX: 450,
			splitAngles: [-1, -0.5, 0.5, 1],
			waitTime: 3.0,}],
	},
	{
	spawnTime: 2.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.trackPlayer,
	monsterType: monsterTypes.weakToDark,
	},
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.sineWave,
	monsterType: monsterTypes.weakFromTop,
	},
	{
	spawnTime: 4.0,
	spriteKey: "STALACTITETOP",
	spawnY: 96,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.stalactite,
	},
	{
	spawnTime: 6.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.triangleWave,
	},
	{
	spawnTime: 8.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.runAway,
	},
	{
	spawnTime: 10.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPattern: movementPatterns.phasing,
	},
]