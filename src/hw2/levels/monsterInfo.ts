import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
export type projectileInfo = {
	behavior: number;
    speed?: number;

	angle?:number; //for atAngle behavior

	laserLength?: number; //seconds TODO change to length in pixels
	invincible?: boolean; //default false
	splitX?: number;  //at what x should the projectile split into other projectiles (if it does)
	splitAngles?: Array<number>;

	waitTime:number; //time to wait before firing the next projectile
}

export type monsterInfo = {
	spawnTime: number;  //Amount of seconds after level has started that the enemy should spawn
	objs?: Array<monsterInfo>; //If this is set then this will be turned into a list of monsters (whose spawnTime is relative to the spawntime in this object) rather than spawn a single monster
							   //Useful for making preset patterns to reuse.
	speed?: number; //default 100 px/sec (canvas is 900x900)
	spriteKey?: string; //REQUIRED IF NOT OBJECT LIST

	spriteScale?: number;
	hitboxScaleX?: number;
	hitboxScaleY?: number;
	spawnY: number;
	
	stoppingX?: number; //x position to stop moving left at

	movementPattern?: number; //Info about movement, conisdered making this its own type but it makes it more verbose
	period?: number;
	amplitude?: number;
	offset?: number;


	phaseTime?: number; //if monsterType is phasing

	monsterType?: number;

	weakToLight?: boolean;
	//speed
	//projectile
	projectiles?: Array<projectileInfo>;

	splitOnDeath?: boolean; //Should the enemy split into projectiles on death?

	testList?: Array<number>;
}