import { IRequestRewardDetail } from './RequestRewardDetail';
import { IRequestRewardStaff } from './RequestRewardStaff';
import { IResponseCommon } from './ResponseCommon.interface';

export interface IRequestReward {
  RequestRewardID: number;
  RequestBribeRewardID: number;
  RequestRewardCode: string;
  FineType: number;
  RequestDate: string;
  RequestTime: string;
  StationCode: string;
  Station: string;
  FirstPartTotal: number;
  FirstMoneyTotal: number;
  FirstMoneyPerPart: number;
  FirstRemainder: number;
  SecondPartTotal: number;
  SecondMoneyTotal: number;
  SecondMoneyPerPart: number;
  SecondRemainder: number;
  RewardTotal: number;
  BribeTotal: number;
  IsActive: number;
  ReferenceNo: number;
  RequestRewardDetail: Array<IRequestRewardDetail>;
  RequestRewardStaff: Array<IRequestRewardStaff>;
}

export interface IRequestRewardgetByRequestBribeRewardID {
  RequestBribeRewardID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestRewardupdByCon extends IRequestReward {}
export interface IRequestRewardgetByCon {
  RequestRewardID: number;
}
// tslint:disable-next-line:no-empty-interface
export interface IRequestRewardinsAll extends IRequestReward {}

export interface IRequestRewardinsAllRespone extends IResponseCommon {
  RequestRewardID?: number;
}
