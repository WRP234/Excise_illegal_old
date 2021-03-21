export interface TransactionRunning {
    RUNNING_ID: number;
    RUNNING_MONTH: string;
    RUNNING_NO: number;
    RUNNING_OFFICE_CODE: string;
    RUNNING_OFFICE_ID: number;
    RUNNING_PREFIX: string;
    RUNNING_TABLE: string;
    RUNNING_YEAR: string;
}

export interface TransactionRunninggetByCon {
    RUNNING_OFFICE_CODE: string;
    RUNNING_TABLE: string;
}

export interface TransactionRunningupdByCon {
    RUNNING_ID: number;
}