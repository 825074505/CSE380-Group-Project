import {level0Objs} from "./level0";
import {level1Objs} from "./level1";
import {level2Objs} from "./level2";
import {level3Objs} from "./level3";
import {level4Objs} from "./level4";
import {level5Objs} from "./level5";
import {level6Objs} from "./level6";
import {level7Objs} from "./level7";
import {level8Objs} from "./level8";
import {level9Objs} from "./level9";
import {level10Objs} from "./level10";
import {level11Objs} from "./level11";
import {level12Objs} from "./level12";
import {level13Objs} from "./level13";
import {level14Objs} from "./level14";
import {level15Objs} from "./level15";
import {monsterInfo} from "./monsterInfo";
export type level = {
	objs: Array<monsterInfo>;
	BACKGROUND_PATH: string;
	SONG_PATH: string;
	speedMod?: number;
	boss?: boolean;
}

export const levels: level[] = [
	//Tutorial level
	{
		objs: level0Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg1/",
		SONG_PATH: "hw2_assets/sounds/songs/wind.mp3",
	},
	//level 1
	{
		objs: level1Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg1/",
		SONG_PATH: "hw2_assets/sounds/songs/eost1.mp3",
	},
	//level 2
	{
		objs: level2Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg2/",
		SONG_PATH: "hw2_assets/sounds/songs/eost2.mp3",
	},
	//level 3
	{
		objs: level3Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg3/",
		SONG_PATH: "hw2_assets/sounds/songs/eost3.mp3",
	},
	//level 4
	{
		objs: level4Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg6/",
		SONG_PATH: "hw2_assets/sounds/songs/eost4bossmusic.mp3",
	},
	//level 5
	{
		objs: level5Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg4/",
		SONG_PATH: "hw2_assets/sounds/songs/eost1.mp3",
	},
	//level 6
	{
		objs: level6Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg5/",
		SONG_PATH: "hw2_assets/sounds/songs/eost2.mp3",
	},
	{
		objs: level7Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg2/",
		SONG_PATH: "hw2_assets/sounds/songs/eost3.mp3",
	},
	{
		objs: level8Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg6/",
		SONG_PATH: "hw2_assets/sounds/songs/eost4bossmusic.mp3",
		boss: true,
	},
	{
		objs: level9Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg3/",
		SONG_PATH: "hw2_assets/sounds/songs/eost1.mp3",
	},
	{
		objs: level10Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg4/",
		SONG_PATH: "hw2_assets/sounds/songs/eost2.mp3",
		speedMod: 1.25,
	},
	{
		objs: level11Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg1/",
		speedMod: 2,
		SONG_PATH: "hw2_assets/sounds/songs/wind.mp3",
	},
	{
		objs: level12Objs,
		BACKGROUND_PATH: "hw2_assets/sprites/bg6/",
		SONG_PATH: "hw2_assets/sounds/songs/eost4bossmusic.mp3",
		boss: true,
	},
]