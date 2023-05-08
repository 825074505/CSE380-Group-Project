import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

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

const halfDownPath: Array<monsterInfo> = [
	{
		spawnTime: 0,
		spawnY: 0,
		objs: fastpincer,
	},
	{
		spawnTime: 1,
		spawnY: 180,
		objs: fastpincer,
	},
	{
		spawnTime: 2,
		spawnY: 360,
		objs: fastpincer,
	},
	{
		spawnTime: 3,
		spawnY: 480,
		objs: fastpincer,
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

export const level7Objs: Array<monsterInfo> = [
	{
		spawnTime:1,
		spawnY: 450,
		monsterType: monsterTypes.spinning,
		projectiles: [
			{behavior: projectileBehaviors.atCurrentPos,
			speed: 200,
			angle: Math.PI,
			waitTime: 1.0,
			splitX: 500,
			splitAngles: [-1, -0.5, 0.5, 1],
			},
			{behavior: projectileBehaviors.atCurrentPos,
			speed: 200,
			angle: Math.PI,
			waitTime: 1.0,
			splitX: 500,
			splitAngles: [-1, -0.5, 0.5, 1],
			},
			{behavior: projectileBehaviors.justWait,
			waitTime: 10}
		]
	},
	{
		spawnTime: 2,
		spawnY: 675,
		monsterType: monsterTypes.electricField,
		movementPatterns:[{
			movementPattern: movementPatterns.sineWave,
			amplitude: 100,
		}]
	},
	{
		spawnTime: 3,
		spawnY: 200,
		projectiles: [
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 0.3,
		},
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 0.3,
		},
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 10,
		}
		]
	},
	{
		spawnTime: 6,
		spawnY: 700,
		projectiles: [
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 0.3,
		},
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 0.3,
		},
		{
			behavior: projectileBehaviors.atFuturePos,
			speed:200,
			waitTime: 10,
		}
		]
	},
	{
		spawnTime: 8,
		spawnY: 450,
		weakToLight: true,
		movementPatterns:[{
			movementPattern: movementPatterns.sineWave,
			amplitude: 200,
			moveDistance: 150,
		}
		],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.5,
		}],
	},
	{
		spawnTime: 11,
		spawnY: 400,
		weakToLight: true,
		movementPatterns: [{
			movementPattern:movementPatterns.triangleWave,
			amplitude: -300,
		}],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
		}]
	},
	{
		spawnTime: 13,
		spawnY: 500,
		weakToLight: true,
		movementPatterns: [{
			movementPattern:movementPatterns.triangleWave,
			amplitude: 300,
		}],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
		}]
	},
	{
		spawnTime: 17,
		spawnY: 460,
		objs:halfDownPath,
	},
	{
		spawnTime: 21,
		spawnY: 0,
		objs:upPath,
	},
	{
		spawnTime:27.5,
		spawnY: 100,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 27,
		spawnY: 100,
		objs:halfDownPath,
	},
	{
		spawnTime: 36,
		spawnY: 750,
		monsterType: monsterTypes.spinning,
		projectiles: [
			{
				behavior: projectileBehaviors.atCurrentPos,
				speed:300,
				waitTime: 0.6,
			}
		]

	},
	{
		spawnTime: 40,
		spawnY: 150,
		monsterType: monsterTypes.spinning,
		projectiles: [
			{
				behavior: projectileBehaviors.atCurrentPos,
				speed:300,
				waitTime: 0.6,
			}
		]
	},
	{
		spawnTime: 42,
		spawnY:300,
		monsterType: monsterTypes.stalagmite,
		hitboxScaleX: 0.01,
		hitboxScaleY: 0.98,
	},
	{
		spawnTime:43,
		spawnY: 850,
		monsterType: monsterTypes.electricField,
	},
	{
		spawnTime: 49,
		spawnY: 500,
		weakToLight: true,
		movementPatterns: [{
			movementPattern:movementPatterns.triangleWave,
			amplitude: 300,
		}],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
		}]
	},
	{
		spawnTime: 52,
		spawnY: 400,
		weakToLight: true,
		movementPatterns: [{
			movementPattern:movementPatterns.triangleWave,
			amplitude: -300,
		}],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
		}]
	},
	{
		spawnTime:56,
		spawnY: 450,
		weakToLight:true,
		movementPatterns:[{
			moveDistance:150,
		}],
		projectiles: [
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
			splitX: 700,
			splitAngles: [-1, -0.5, 0.5, 1],
		},
		{
			behavior: projectileBehaviors.left,
			speed:200,
			waitTime: 0.8,
			splitX: 700,
			splitAngles: [-0.75, 0, 0.75],
		}]

	}


	
	];