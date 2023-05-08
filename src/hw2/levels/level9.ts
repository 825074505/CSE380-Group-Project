import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

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

export const level9Objs: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		hitboxScaleX: 0.03,
		hitboxScaleY: 1.0,
		spawnY: 700,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 1,
		spawnY: 100,
		weakToLight: true,
	},
	{
		spawnTime: 3,
		spawnY: 100,
		weakToLight: true,
	},
	{
		spawnTime: 4.5,
		spawnY: 500,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 6,
		spawnY: 450,
		weakToLight: true,
	},
	
	{
		spawnTime: 7,
		spriteKey: "STALAGMITE",
		hitboxScaleX: 0.03,
		hitboxScaleY: 1.0,
		spawnY: 700,
		monsterType: monsterTypes.stalagmite,
	},

	{
		spawnTime: 12,
		spawnY: 150,
		weakToLight: true,
	},

	{
		spawnTime: 13,
		spawnY: 250,
		monsterType:monsterTypes.weakToDark
	},

	{
		spawnTime: 14,
		spawnY: 350,
		weakToLight: true,
	},
	{
		spawnTime: 17,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 20,
		spawnY: 450,
		objs: fastpincer,
	},
	{
		spawnTime: 23,
		spawnY: 350,
		weakToLight: true
	},
	{
		spawnTime: 24,
		spawnY: 450,
		weakToLight: true
	},
	{
		spawnTime: 26,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 30,
		spawnY: 450,
		objs: fastPincerWithEnemyWTL,
	},
	{
		spawnTime: 33,
		spawnY: 300,
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 35,
		spawnY: 700,
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 37,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 41,
		spawnY: 450,
		objs: fastPincerWithSpinning,
	},

	{
		spawnTime: 44,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.spinning,
	},

	{
		spawnTime: 47,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.spinning,
	},
	];