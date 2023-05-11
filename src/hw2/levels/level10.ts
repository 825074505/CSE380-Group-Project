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
		timeToWeak: 0.5,
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
		timeToWeak: 0.5,
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
		spawnTime: 19,
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
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 26,
		spawnY: 450,
	},
	{
		spawnTime: 27.5,
		spawnY: 350,
		weakToLight: true,
		timeToWeak: 0.5,
	},
	{
		spawnTime: 28.5,
		spawnY: 350,
	},
	{
		spawnTime: 30,
		spawnY: 500,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 36,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 37,
		spawnY: 500,
		weakToLight:true,
		timeToWeak: 0.5,
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 38,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 39,
		spawnY: 500,
		weakToLight:true,
		timeToWeak: 0.5,
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 41,
		spawnY: 550,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 43,
		spawnY: 550,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 47,
		spawnY: 400,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 48,
		spawnY: 600,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 49,
		spawnY: 400,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 50,
		spawnY: 600,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 51,
		spawnY: 400,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
	{
		spawnTime: 52,
		spawnY: 600,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
	},
];