import {monsterInfo} from "./monsterInfo";
import MineBehavior2, {movementPatterns, monsterTypes} from "../ai/MineBehavior2";
import ProjectileBehavior, {projectileBehaviors} from "../ai/ProjectileBehavior";

export const level12Objs: Array<monsterInfo> = [
	{
	spawnTime: 0.0,
	spriteKey: "MINE",
	spawnY: 450,
	weakToLight: true,
	movementPatterns: [
	{
		moveDistance: 150,
		length: 2,
	},
	{
		movementPattern: movementPatterns.triangleWave,
		period: 6,
		amplitude: 300,
		moveDistance: 0,
		offset:	1.5,
		length: 6,
		setY: 450,
	},
	{
		moveDistance: 0,
		length: 6,
		jumpTo: 1,
	}
	],
	spriteScale: 2,
	timeToWeak: 17,
	projectiles: [
			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 2.0,
			splitX: 700,
			splitAngles: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
			},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 1,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.75,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.5,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.25,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.25,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.5,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.75,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 1,
			waitTime: 0.125},



			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 1,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.75,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.5,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI + 0.25,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.25,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.5,
			waitTime: 0.125},

			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 0.75,
			waitTime: 0.125},
			
			{behavior: projectileBehaviors.atAngle,
			speed: 200,
			angle: Math.PI - 1,
			waitTime: 0.25},
			
			{behavior: projectileBehaviors.justWait,
			waitTime: 3.0},

			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 1,
			splitX: 600,
			splitAngles: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
			},

			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 1,
			splitX: 600,
			splitAngles: [-1.125,-0.875, -0.625, -0.375, -0.125, 0.125, 0.375, 0.625, 0.875, 1.125],
			},

			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 1,
			splitX: 600,
			splitAngles: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
			},

			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 1,
			splitX: 600,
			splitAngles: [-1.125,-0.875, -0.625, -0.375, -0.125, 0.125, 0.375, 0.625, 0.875, 1.125],
			},

			{behavior: projectileBehaviors.left,
			speed: 200,
			angle: Math.PI,
			waitTime: 1,
			splitX: 600,
			splitAngles: [-1.125,-0.875, -0.625, -0.375, -0.125, 0.125, 0.375, 0.625, 0.875, 1.125],
			},
		]
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
	spawnY: 200,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 26.5,
	spriteKey: "ELECTRICITY",
	spawnY: 700,
	monsterType: monsterTypes.electricField,
	},
	{
	spawnTime: 38,
	spriteKey: "ELECTRICITY",
	spawnY: 450,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 49.5,
	spriteKey: "ELECTRICITY",
	spawnY: 200,
	monsterType: monsterTypes.electricField,
	},

	{
	spawnTime: 61,
	spriteKey: "ELECTRICITY",
	spawnY: 700,
	monsterType: monsterTypes.electricField,
	},
];