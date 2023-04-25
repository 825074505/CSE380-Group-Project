import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

const pincer: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALACTITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		movementPattern: movementPatterns.moveLeft,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		movementPattern: movementPatterns.moveLeft,
		monsterType: monsterTypes.stalagmite,
	}
]

const pincerWithEnemy: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: pincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		spawnY: 0,
	}
]

const pincerWithEnemyWTL: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: pincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		weakToLight: true,
		spawnY: 0,
	}
]


const upPath : Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 800,
		objs: pincer,
	},
	{
		spawnTime: 2.0,
		spawnY: 700,
		objs: pincer,
	},
	{
		spawnTime: 4.0,
		spawnY: 600,
		objs: pincer,
	},
	{
		spawnTime: 6.0,
		spawnY: 500,
		objs: pincer,
	},
]

const downPath : Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 100,
		objs: pincer,
	},
	{
		spawnTime: 2.0,
		spawnY: 250,
		objs: pincer,
	},
	{
		spawnTime: 4.0,
		spawnY: 400,
		objs: pincer,
	},
	{
		spawnTime: 6.0,
		spawnY: 550,
		objs: pincer,
	},
	{
		spawnTime: 8.0,
		spawnY: 700,
		objs: pincerWithEnemy,
	},
]

export const level3Objs: Array<monsterInfo> = [
	
	{
		spawnTime: 0.0,
		spawnY: 200,
		objs: pincer,
	},

	{
		spawnTime: 6.0,
		spawnY: 700,
		objs: pincer,
	},

	{
		spawnTime: 10.0,
		spawnY: 450,
		objs: pincerWithEnemy,
	},

	{
		spawnTime: 14.0,
		spriteKey: "ELECTRICITY",
		spawnY: 450,
		monsterType: monsterTypes.electricField,
	},

	{
		spawnTime: 17.0,
		spriteKey: "MINE",
		spawnY: 200,
	},

	{
		spawnTime: 20.0,
		spriteKey: "MINE",
		spawnY: 450,
	},

	{
		spawnTime: 23.0,
		spriteKey: "MINE",
		spawnY: 700,
	},

	{
		spawnTime: 24.0,
		spawnY: 0,
		objs: upPath,
	},

	{
		spawnTime: 34.0,
		spawnY: 0,
		objs: downPath,
	},

	{
		spawnTime: 46,
		spriteKey: "ELECTRICITY",
		spawnY: 550,
		monsterType: monsterTypes.electricField,
	},

	{
		spawnTime: 50,
		spawnY: 250,
		objs: pincerWithEnemyWTL,
	},

	{
		spawnTime: 56,
		spawnY: 750,
		objs: pincerWithEnemyWTL,
	},

	{
		spawnTime: 60,
		spriteKey: "ELECTRICITY",
		spawnY: 450,
		monsterType: monsterTypes.electricField,
	},

	{
		spawnTime: 64,
		spawnY: 450,
		objs: pincerWithEnemyWTL,
	},

	{
		spawnTime: 66,
		spawnY: 250,
		objs: pincer,
	},

	{
		spawnTime: 68,
		spawnY: 50,
		objs: pincer,
	},

	{
		spawnTime: 70,
		spawnY: 250,
		objs: pincer,
	},

	{
		spawnTime: 72,
		spawnY: 450,
		objs: pincer,
	},

	{
		spawnTime: 74,
		spawnY: 650,
		objs: pincer,
	},

	{
		spawnTime: 76,
		spawnY: 850,
		objs: pincer,
	},

	{
		spawnTime: 78,
		spawnY: 650,
		objs: pincer,
	},

	{
		spawnTime: 80,
		spawnY: 450,
		objs: pincer,
	},

	{
		spawnTime: 82,
		spawnY: 450,
		objs: pincer,
	},

	{
		spawnTime: 84,
		spawnY: 450,
		objs: pincer,
	},

	{
		spawnTime: 86,
		spawnY: 450,
		objs: pincer,
	},

	{
		spawnTime: 88,
		spawnY: 450,
		objs: pincerWithEnemyWTL,
	},

]