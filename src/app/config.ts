

export class Config{
    public static SAVE_KEY = "robotwars_game_save";
    public config: gameConfig;

    public saveSettings(): void {
       // Utils.StorageUtils.save(this.SAVE_KEY, )
    }
    public loadSettings() {
       // StorageUtils.
    }
}

export class gameConfig {
    soundOn: boolean = false;
    musicOn: boolean = false;
}