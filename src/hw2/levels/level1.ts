import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
export const level1Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.moveLeft,
	},
	{
	spawnTime: 0.0,
	spriteKey: "ELECTRICITY",
	spawnY: 800,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.moveLeft,
	},
	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 250,
	movementPattern: movementPatterns.moveLeft,
	monsterType: monsterTypes.spinning,
	stoppingX: 800,

	projectileBehavior: projectileBehaviors.atCurrentPos,
	projectileSpeed: 200,
	projectileFrequency: 3,
	projectileLaserLength: 1,
	projectileSplitX: 450,
	},
	{
	spawnTime: 2.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPattern: movementPatterns.moveLeft,
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
	spriteKey: "MINE",
	spawnY: 100,
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