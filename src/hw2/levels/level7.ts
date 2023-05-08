import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

const stBottom: Array<monsterInfo> = [
	{
		spawnTime: 0,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	},
	{
		spawnTime: 2,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	},
	{
		spawnTime: 4,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	},
	{
		spawnTime: 6,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	},
	{
		spawnTime: 8,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	},
	{
		spawnTime: 10,
		spriteKey: "STALAGMITE",
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		spawnY: 0
	}
]

const pincer: Array<monsterInfo> = [
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

const pincerWithEnemy: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: pincer,
	},
	{
		spawnTime: 1.25,
		spawnY: 0,
	}
]


export const level7Objs: Array<monsterInfo> = [
	
	
	];