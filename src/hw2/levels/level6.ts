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

const fastpincer: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -650,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 650,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
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

const pincerWithEnemySpin: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: pincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		spawnY: 0,
		monsterType: monsterTypes.spinning,
		},
]

const pincerWithEnemyWTD: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: pincer,
	},
	{
		spawnTime: 1.25,
		spriteKey: "MINE",
		spawnY: 0,
		monsterType: monsterTypes.weakToDark,
	},
	
]


const upPath : Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 800,
		objs: fastpincer,
	},
	{
		spawnTime: 1.0,
		spawnY: 620,
		objs: fastpincer,
	},
	{
		spawnTime: 2.0,
		spawnY: 440,
		objs: fastpincer,
	},
	{
		spawnTime: 3.0,
		spawnY: 260,
		objs: fastpincer,
	},
	{
		spawnTime: 4.0,
		spawnY: 80,
		objs: fastpincer,
	},
	{
		spawnTime: 5.0,
		spawnY: -50,
		objs: fastpincer,
	},
]

const downPath : Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 100,
		objs: fastpincer,
	},
	{
		spawnTime: 1.0,
		spawnY: 280,
		objs: fastpincer,
	},
	{
		spawnTime: 2.0,
		spawnY: 460,
		objs: fastpincer,
	},
	{
		spawnTime: 3.0,
		spawnY: 640,
		objs: fastpincer,
	},
	{
		spawnTime: 4.0,
		spawnY: 800,
		objs: fastpincer,
	},
]
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

export const level6Objs: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 200,
		objs: pincer,
	},

	{
		spawnTime: 5.0,
		spawnY: 450,
		objs: pincerWithEnemySpin,
	},
	{
		spawnTime: 10.0,
		spawnY: 500,
		objs: threeGuysInARow,
	},
	{
		spawnTime: 15.0,
		spriteKey: "ELECTRICITY",
		spawnY: 600,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 18.0,
		spriteKey: "MINE",
		spawnY: 650,
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 22.0,
		spawnY: 700,
		objs: fastpincer,
	},
	{
		spawnTime: 23.0,
		spriteKey: "MINE",
		spawnY: 650,
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 25.0,
		spawnY: 0,
		objs: upPath,
	},
	{
		spawnTime: 26.5,
		spriteKey: "MINE",
		spawnY: 725,
	},
	{
		spawnTime: 31.0,
		spawnY: 0,
		objs: downPath,
	},
	{
		spawnTime: 35.0,
		spriteKey: "ELECTRICITY",
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 37.0,
		spriteKey: "MINE",
		spawnY: 750,
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 42.0,
		spawnY: 0,
		objs: upPath,
	},
	{
		spawnTime: 44.0,
		spriteKey: "ELECTRICITY",
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 48.5,
		spriteKey: "MINE",
		spawnY: 50,
		monsterType: monsterTypes.spinning,
	},
	{
		spawnTime: 50.0,
		spawnY: 0,
		objs: downPath,
	},
	{
		spawnTime: 55.0,
		spriteKey: "MINE",
		spawnY: 725,
		weakToLight: true,
		timeToWeak: 0.5,
	},
	{
		spawnTime: 60.0,
		spawnY: 450,
		objs: pincerWithEnemySpin,
	},



]