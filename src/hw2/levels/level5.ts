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

const shootDownGuy: Array<monsterInfo> = [
	{
		spawnTime:0,
		spawnY: 0,
		weakToLight: true,
		movementPatterns:
		[{
			moveDistance: 100,
			length: 3,
		},
		{}
		],
		projectiles:[
			{behavior: projectileBehaviors.justWait,
			waitTime: 0.5},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI,
				waitTime:0.25,
			},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI+0.5,
				waitTime:0.25,
			},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI+1,
				waitTime:0.25,
			},
			{behavior: projectileBehaviors.justWait,
			waitTime: 100},
		]
	}
]

const shootUpGuy: Array<monsterInfo> = [
{
		spawnTime:0,
		spawnY: 0,
		weakToLight: true,
		movementPatterns:
		[{
			moveDistance: 100,
			length: 3,
		},
		{}
		],
		projectiles:[
			{behavior: projectileBehaviors.justWait,
			waitTime: 0.5},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI,
				waitTime:0.25,
			},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI-0.5,
				waitTime:0.25,
			},
			{
				behavior: projectileBehaviors.atAngle,
				speed: 200,
				angle: Math.PI-1,
				waitTime:0.25,
			},
			{behavior: projectileBehaviors.justWait,
			waitTime: 100},
		]
	}
]


export const level5Objs: Array<monsterInfo> = [
	{
	spawnTime: 0,
	spawnY: 350,
	monsterType: monsterTypes.weakToDark,
	movementPatterns:[{
		speed: 50,
	}]
	},
	{
	spawnTime: 1,
	spawnY: 550,
	weakToLight: true,
	},
	{
	spawnTime: 2.5,
	spawnY: 500,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 4.5,
	spawnY: 850,
	objs: stBottom,
	},
	{
		spawnTime: 6,
		spawnY: 250,
	},
	{
		spawnTime:10,
		spawnY: 250,
		movementPatterns:[{
			movementPattern: movementPatterns.sineWave,
			amplitude: 100,
		}]
	},
	{
		spawnTime:12,
		spawnY: 250,
		movementPatterns:[{
			movementPattern: movementPatterns.sineWave,
			amplitude: -100,
		}]
	},
	{
		spawnTime:14,
		spawnY: 250,
		movementPatterns:[{
			movementPattern: movementPatterns.sineWave,
			amplitude: 100,
		}]
	},
	{
		spawnTime: 17,
		spawnY: 250,
		monsterType: monsterTypes.weakToDark,
	},
	{
		spawnTime: 19,
		spawnY: 650,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 20.5,
		spawnY: 650,
		objs:pincerWithEnemy,
	},
	{
		spawnTime: 24.5,
		spawnY: 250,
		objs:pincer,
	},
	{
		spawnTime: 28.5,
		spawnY: 650,
		objs:pincerWithEnemy,
	},
	{
		spawnTime: 35.5,
		spawnY: 200,
		objs: shootDownGuy,
	},
	{
		spawnTime: 37.5,
		spawnY: 700,
		objs: shootUpGuy,
	},
	{
		spawnTime: 41,
		spawnY: 50,
		objs: stBottom,
	},
	{
		spawnTime: 43,
		spawnY: 700,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 48,
		spawnY: 700,
		weakToLight: true,
		movementPatterns:[
			{
				movementPattern: movementPatterns.sineWave,
				amplitude: -100,
			}
		]
	},
	{
		spawnTime: 52,
		spawnY: 700,
		weakToLight: true,
		movementPatterns:[
			{
				movementPattern: movementPatterns.sineWave,
				amplitude: 100,
			}
		]
	},


	{
		spawnTime:55,
		spawnY: 450,
		monsterType: monsterTypes.electricField,
		movementPatterns:
		[{
			movementPattern: movementPatterns.sineWave,
			amplitude: 100,
		}]
	},
	{
		spawnTime:58,
		spawnY: 450,
		monsterType: monsterTypes.weakToDark,
		movementPatterns:
		[{
			movementPattern: movementPatterns.sineWave,
			amplitude: -200,
		}]
	}
	
	];