import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

const threeGuysInARow: Array<monsterInfo> = [
		{
		spawnTime: 0.0,
		spriteKey: "MINE",
		spawnY: 0,
		},
		{
		spawnTime: 1.0,
		spriteKey: "MINE",
		spawnY: 0,
		},
		{
		spawnTime: 2.0,
		spriteKey: "MINE",
		spawnY: 0,
		}]
//test level, not for play
export const level5Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "ELECTRICITY",
	spawnY: 800,
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
	spawnTime: 4.0,
	spriteKey: "ELECTRICITY",
	spawnY: 800,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 250,
	monsterType: monsterTypes.spinning,
	movementPatterns: [{
		moveDistance: 100,
		length: 5.0,
	}, 
	{}
	],

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
	monsterType: monsterTypes.weakToDark,
	},
	{
	spawnTime: 4.0,
	spriteKey: "MINE",
	spawnY: 450,
	
	movementPatterns: [{
		movementPattern: movementPatterns.sineWave,
	}],
	monsterType: monsterTypes.weakFromTop,
	},
	{
	spawnTime: 4.0,
	spriteKey: "STALACTITETOP",
	spawnY: 96,
	monsterType: monsterTypes.stalactite,
	},
	{
	spawnTime: 6.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPatterns: [{
		movementPattern: movementPatterns.triangleWave,
	}],
	},
	{
	spawnTime: 8.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPatterns: [{
		movementPattern: movementPatterns.runAway,
	}],
	},
	{
	spawnTime: 10.0,
	spriteKey: "MINE",
	spawnY: 450,
	movementPatterns: [{
		movementPattern: movementPatterns.phasing,
	}],
	},
]