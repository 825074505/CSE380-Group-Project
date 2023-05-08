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

const threeGuysInARowWTD: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 0,
	monsterType: monsterTypes.weakToDark
	},
	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 0,
	monsterType: monsterTypes.weakToDark
	},
	{
	spawnTime: 2.0,
	spriteKey: "MINE",
	spawnY: 0,
	monsterType: monsterTypes.weakToDark
	}]
const threeGuysInARowWTL: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 0,
	weakToLight: true
	},
	{
	spawnTime: 1.0,
	spriteKey: "MINE",
	spawnY: 0,
	weakToLight: true
	},
	{
	spawnTime: 2.0,
	spriteKey: "MINE",
	spawnY: 0,
	weakToLight: true
	}]
const fastpincer: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 550, 
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
	}
]

const fastPincerWithEnemyWTL: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: fastpincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		weakToLight: true,
		spawnY: 0,
	}
	
]
const fastPincerWithSpinning: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: fastpincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		spawnY: 0,
		monsterType: monsterTypes.spinning,
	}
	
]
export const level10Objs: Array<monsterInfo> = [
	{
		spawnTime: 0,
		spawnY: 450,
		objs: threeGuysInARow,
	},
	{
		spawnTime: 3,
		spawnY: 350,
		objs: threeGuysInARow
	},
	{
		spawnTime: 6,
		spawnY: 500,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 10,
		spawnY: 450,
		objs: fastPincerWithEnemyWTL,
	},
	{
		spawnTime: 14,
		spawnY: 450,
		weakToLight: true,
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 17,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 17,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 20,
		spawnY: 500,
		monsterType: monsterTypes.electricField,
	},

	{
		spawnTime: 22,
		spawnY: 450,
		objs: fastPincerWithSpinning,
	},

	{
		spawnTime: 25,
		spawnY: 450,
		objs: threeGuysInARowWTD,
	},
	{
		spawnTime: 28,
		spawnY: 350,
		objs: threeGuysInARowWTL,
	},
	{
		spawnTime: 30,
		spawnY: 500,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 34,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.weakFromTop,
	},
	{
		spawnTime: 34,
		spawnY: 96,
		monsterType: monsterTypes.stalactite,
	},
	{
		spawnTime: 35,
		spawnY: 500,
		weakToLight:true
	},
	{
		spawnTime: 36,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.weakFromTop,
	},
	{
		spawnTime: 36,
		spawnY: 96,
		monsterType: monsterTypes.stalactite,
		},
	{
		spawnTime: 37,
		spawnY: 500,
		weakToLight:true
	},
	
];