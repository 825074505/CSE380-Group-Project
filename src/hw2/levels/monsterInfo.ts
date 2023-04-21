import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
export type monsterInfo = {
	spawnTime: number;  //Amount of seconds after level has started that the enemy should spawn
	objs?: Array<monsterInfo>; //If this is set then this will be turned into a list of monsters (whose spawnTime is relative to the spawntime in this object) rather than spawn a single monster
							   //Useful for making preset patterns to reuse.

	spriteKey?: string; //REQUIRED IF NOT OBJECT LIST
	spriteScale?: Vec2;
	hitboxScale?: Vec2;
	spawnY: number;
	stoppingX?: number; //x position to stop moving left at

	movementPattern?: number; //Info about movement, conisdered making this its own type but it makes it more verbose
	period?: number;
	amplitude?: number;
	offset?: number;


	splitOnDeath?: boolean; //Should the enemy split into projectiles on death?

	phaseTime?: number; //if monsterType is phasing

	monsterType?: number;

	weakToLight?: boolean;
	//speed
	//projectile
	projectileBehavior?: number;
    projectileSpeed?: number;
    projectileFrequency?: number; //seconds between firing (after firing is complete for case of laser behavior)
	projectileLaserLength?: number; //seconds TODO change to length in pixels
	projectileInvincible?: boolean; //default false
	projectileSplitX?: number;  //at what x should the projectile split into other projectiles (if it does)
}