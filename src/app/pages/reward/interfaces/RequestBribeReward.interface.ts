import { IResponseCommon } from './ResponseCommon.interface';

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeReward {
  RequestBribeRewardID: number;
  IndictmentID: number;
  HaveNotice: number;
  IsActive: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeRewardgetByIndictmentID {
  IndictmentID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeRewardinsAll {
  RequestBribeRewardID?: number;
  IndictmentID?: number;
  HaveNotice?: number;
  IsActive?: number;
}
export interface IRequestBribeRewardinsAllNew {
  BRIBE_REWARD_ID: number;
  INDICTMENT_ID: number;
  HAVE_NOTICE: number;
  IS_ACTIVE: number;
}
// tslint:disable-next-line:class-name
export interface IRequestBribeRewardinsAllResponse extends IResponseCommon {
  RequestBribeRewardID?: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeRewardupdDelete {
  RequestBribeRewardID: number;
}


// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeRewardupdDeleteResponse
  extends IResponseCommon {}
