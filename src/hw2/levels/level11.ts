import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
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

const sinepincer: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
			}
		]
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
			}]
	}
]

const sinepincerdown: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:6,
			}
		]
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:6,
			}]
	}
]

const sinepincerWithEnemy: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: sinepincerdown,
	},
	{
		spawnTime: 0.5,
		spawnY: 50,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:6.5,
			}]
	}
]

const sinepincerUpWithEnemy: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: sinepincer,
	},
	{
		spawnTime: 0.65,
		spawnY: 0,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:0.65,
			}]
	}
]

const sinepincerUpWithEnemyWTL: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: sinepincer,
	},
	{
		spawnTime: 0.65,
		spawnY: 0,
		weakToLight: true,
		timeToWeak: 0.5,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:0.65,
			}]
	}
]

const sinepincerUpWithEnemyWTD: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spawnY: 0,
		objs: sinepincer,
	},
	{
		spawnTime: 0.65,
		spawnY: 0,
		monsterType: monsterTypes.weakToDark,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:0.65,
			}]
	}
]

const sinepincerpath: Array<monsterInfo> = [
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
			}
		]
	},
	{
		spawnTime: 0.0,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
			}]
	},
	{
		spawnTime: 1.0,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 1,
			}
		]
	},
	{
		spawnTime: 1.0,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 1,
			}]
	},
	{
		spawnTime: 2,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 2,
			}
		]
	},
	{
		spawnTime: 2,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 2,
			}]
	},
	{
		spawnTime: 3,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 3,
			}
		]
	},
	{
		spawnTime: 3,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 3,
			}]
	},
	{
		spawnTime: 4,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 4,
			}
		]
	},
	{
		spawnTime: 4,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 4,
			}]
	},
	{
		spawnTime: 5,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 5,
			}
		]
	},
	{
		spawnTime: 5,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 5,
			}]
	},
	{
		spawnTime: 6,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 6,
			}
		]
	},
	{
		spawnTime: 6,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 6,
			}]
	},
	{
		spawnTime: 7,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 7,
			}]
	},
	{
		spawnTime: 7,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 7,
			}]
	},
	{
		spawnTime: 8,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 8,
			}]
	},
	{
		spawnTime: 8,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 8,
			}]
	},
	{
		spawnTime: 9,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 9,
			}]
	},
	{
		spawnTime: 9,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 9,
			}]
	},
	{
		spawnTime: 10,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 10,
			}]
	},
	{
		spawnTime: 10,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 10,
			}]
	},
	{
		spawnTime: 11,
		spriteKey: "STALAGMITE",
		spawnY: 550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 11,
			}]
	},
	{
		spawnTime: 11,
		spriteKey: "STALAGMITE",
		spawnY: -550,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
		monsterType: monsterTypes.stalagmite,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: 11,
			}]
	}
]


export const level11Objs: Array<monsterInfo> = [
	{
	spawnTime: 1,
	spawnY: 450,
	objs:pincer,
	},

	{
	spawnTime: 3,
	spawnY: 200,
	objs:pincer,
	},

	{
	spawnTime: 6,
	spawnY: 750,
	objs:pincer,
	},
	
	{
		spawnTime: 10,
		spawnY: 450,
		objs: sinepincer,
	},

	{
		spawnTime: 13,
		spawnY: 100,
		objs: sinepincerdown,
	},
	{
		spawnTime: 16,
		spawnY: 450,
		objs: sinepincerWithEnemy,
	},

	{
		spawnTime: 19,
		spawnY: 450,
		objs: sinepincerUpWithEnemy,
	},

	{
		spawnTime: 22,
		spawnY: 800,
		objs: sinepincerUpWithEnemyWTL,
	},

	{
		spawnTime: 26,
		spawnY: 450,
		objs: sinepincer,
	},

	{
		spawnTime: 28.5,
		spawnY: 450,
		objs: sinepincerdown,
	},

	{
		spawnTime: 31,
		spawnY: 450,
		objs: sinepincer,
	},

	{
		spawnTime: 36,
		spawnY: 800,
		objs: sinepincerUpWithEnemyWTD,
	},

	{
		spawnTime: 40,
		spawnY: 450,
		monsterType: monsterTypes.electricField,

		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: -2,
			}],
	},

	{
		spawnTime: 41,
		spawnY: 450,
		monsterType: monsterTypes.electricField,

		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset: -1,
			}],
	},

	{
		spawnTime: 42,
		spawnY: 450,
		objs: sinepincerpath,
	},
	{
		spawnTime: 54,
		spawnY: 450,
		objs: sinepincerpath,
	},

	{
		spawnTime: 54.65,
		spawnY: 450,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:0.65
			}
		]
	},

	{
		spawnTime: 60.65,
		spawnY: 450,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:6.65
			}
		]
	},

	{
		spawnTime: 66.65,
		spawnY: 450,
		weakToLight: true,
		movementPatterns: [
			{
				movementPattern: movementPatterns.sineWave,
				amplitude:300,
				period: 12,
				offset:12.65
			}
		]
	},

	];