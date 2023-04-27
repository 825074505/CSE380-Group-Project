import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";
export const level4Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	movementPatterns: [{
		movementPattern: movementPatterns.triangleWave,
		period: 6,
		amplitude: -300,
		moveDistance: 250,
	}],
	spriteScale: 2,
	timeToWeak: 10,
	projectiles: [
			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 3.0,
			splitX: 500,
			splitAngles: [-1, -0.5, 0.5, 1],
			},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 1,
			waitTime: 0.5},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.5,
			waitTime: 0.5},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI,
			waitTime: 0.5},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.5,
			waitTime: 0.5},
			
			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 1,
			waitTime: 2},


	
			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 1,
			waitTime: 0},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.5,
			waitTime: 0},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI,
			waitTime: 0},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.5,
			waitTime: 0},
			
			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 1,
			waitTime: 0.0},
			
			{behavior: projectileBehaviors.justWait,
			waitTime: 3.0},]
	},

	{
	spawnTime: 3.5,
	spriteKey: "ELECTRICITY",
	spawnY: 450,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 15.0,
	spriteKey: "ELECTRICITY",
	spawnY: 450,
	monsterType: monsterTypes.electricField,
	},
]