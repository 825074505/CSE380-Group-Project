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
{
	
}
export const level10Objs: Array<monsterInfo> = [
	{
		spawnTime: 0,
		spawnY: 450,
		objs: fastpincer,
	},
	{
		spawnTime: 3,
		spawnY: 350,
		weakToLight: true
	},
	{
		spawnTime: 4,
		spawnY: 450,
		weakToLight: true
	},
	{
		spawnTime: 6,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 10,
		spawnY: 450,
		objs: fastPincerWithEnemyWTL,
	},
	{
		spawnTime: 13,
		spawnY: 300,
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 15,
		spawnY: 700,
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 17,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 21,
		spawnY: 450,
		objs: fastPincerWithSpinning,
	},

	{
		spawnTime: 24,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.spinning,
	},

	{
		spawnTime: 27,
		spawnY: 450,
		
		movementPatterns: [{
			movementPattern: movementPatterns.sineWave,
		}],
		monsterType: monsterTypes.spinning,
	},
];