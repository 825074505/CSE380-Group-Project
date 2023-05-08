import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";


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
		weakToLight: true,
	},

	{
		spawnTime: 14,
		spawnY: 350,
		weakToLight: true,
	}

	];