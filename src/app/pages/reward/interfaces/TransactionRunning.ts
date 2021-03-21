export interface ITransactionRunning {
  RunningID: number;
  RunningYear: string;
  RunningMonth: string;
  RunningOfficeCode: string;
  RunningTable: string;
  RunningPrefix: string;
  RunningNo: number;
}

export interface ITransactionRunninggetByCon {
  RunningTable: string;
  RunningOfficeCode: string;
}

export interface ITransactionRunningupdByCon {
  RunningID: number;
}

export interface ITransactionRunninginsAll {
  RunningOfficeCode?: string;
  RunningTable: string;
  RunningPrefix: string;
}
