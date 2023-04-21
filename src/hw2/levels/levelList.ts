import {level1Objs} from "./level1";
import {level2Objs} from "./level2";
import {level3Objs} from "./level3";
import {level4Objs} from "./level4";
import {level5Objs} from "./level5";
import {level6Objs} from "./level6";
import {monsterInfo} from "./monsterInfo";
export type level = {
	objs: Array<monsterInfo>;
	BACKGROUND_PATH: string;
}

export const levels: level[] = [
	//level 1
	{
		objs: level1Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
	//level 2
	{
		objs: level2Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
	//level 3
	{
		objs: level3Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
	//level 4
	{
		objs: level4Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
	//level 5
	{
		objs: level5Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
	//level 6
	{
		objs: level6Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/blacknoise.png",
	},
]