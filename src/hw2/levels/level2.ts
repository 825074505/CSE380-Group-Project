import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";



const pincer: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -525,
		hitboxScaleX: 0.03,
		hitboxScaleY: 1.0,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 525,
		hitboxScaleX: 0.03,
		hitboxScaleY: 1.0,
		monsterType: monsterTypes.stalagmite,
	}
]

export const level2Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	
	movementPatterns: [{
		movementPattern: movementPatterns.sineWave,
	}],
	},

	{
	spawnTime: 2.5,
	spriteKey: "MINE",
	spawnY: 300,
	movementPatterns: [{
		movementPattern: movementPatterns.sineWave,
		amplitude: -150,
	}],
	},

	{
	spawnTime: 5.0,
	spriteKey: "MINE",
	spawnY: 600,
	movementPatterns: [{
		movementPattern: movementPatterns.sineWave,
	}],
	weakToLight: true,
	},

	{
	spawnTime: 5.0,
	spriteKey: "ELECTRICITY",
	spawnY: 300,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 7.0,
	spawnY: 300,
	objs: pincer,
	},

	{
	spawnTime: 9.0,
	spriteKey: "MINE",
	spawnY: 300,
	},

	{
	spawnTime: 10.0,
	spriteKey: "MINE",
	spawnY: 300,
	},

	{
	spawnTime: 11.0,
	spriteKey: "MINE",
	spawnY: 300,
	},

	{
	spawnTime: 14.0,
	spriteKey: "MINE",
	spawnY: 700,
	weakToLight: true,
	},

	{
	spawnTime: 18.0,
	spriteKey: "MINE",
	spawnY: 450,
	monsterType: monsterTypes.spinning,
	movementPatterns: [{
		moveDistance: 300,
	}],
	},

	{
	spawnTime: 22,
	spriteKey: "ELECTRICITY",
	spawnY: 600,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 26,
	spriteKey: "MINE",
	spawnY: 200,
	projectiles: [{behavior: projectileBehaviors.atCurrentPos,
			speed: 200,
			waitTime: 3.0,}],
	},

	{
	spawnTime: 27,
	spriteKey: "MINE",
	spawnY: 700,
	projectiles: [{behavior: projectileBehaviors.atCurrentPos,
			speed: 200,
			waitTime: 3.0,}],
	},

	{
	spawnTime: 29,
	spriteKey: "MINE",
	spawnY: 700,
	monsterType: monsterTypes.spinning,
	movementPatterns: [{
		movementPattern: movementPatterns.trackPlayer,
	}],
	},

]

