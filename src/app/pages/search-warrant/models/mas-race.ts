export interface IMasRace {
    RACE_ID: number;
    RACE_NAME_TH: string;
    RACE_NAME_EN: string;
    IS_ACTIVE: number;
}

export interface IMasRacegetByCon {
    TEXT_SEARCH: string;
    RACE_ID?: number;
}