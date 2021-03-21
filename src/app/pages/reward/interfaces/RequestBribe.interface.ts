import { IResponseCommon } from './ResponseCommon.interface';
import { IRequestBribeDetail } from './RequestBribeDetail.interface';
import { IRequestBribeStaff } from './RequestBribeStaff.interface';

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribe {
  RequestBribeID: number;
  RequestBribeRewardID: number;
  RequestBribeCode: string;
  CommandDetailID: number;

  NoticeCode: string;
  PartMoney: number;
  TitleName: string;
  FirstName: string;
  LastName: string;
  TotalPart: number;

  RequestDate: string;
  RequestTime: string;
  StationCode: string;
  Station: string;
  BribeTotal: number;
  BribeRemainder: number;
  Informeracknowledge: string;
  StationOfPOA: string;
  POADate: string;
  POATime: string;
  POANo: string;
  StationCodeOfPOA: string;
  IsActive: number;

  RequestBribeDetail: Array<IRequestBribeDetail>;
  RequestBribeStaff: Array<IRequestBribeStaff>;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribegetByRequestBribeRewardID {
  RequestBribeRewardID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribegetByCommandID {
  CommandID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribegetByCon {
  RequestBribeID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeinsAll extends IRequestBribe {}

// tslint:disable-next-line:class-name
export interface IRequestBribeinsAllResponse extends IResponseCommon {
  RequestBribeID?: number;
}

export interface IRequestBribeupdByCon {
  RequestBribeID?: number;
  RequestBribeRewardID?: number;
  RequestBribeCode?: string;
  CommandDetailID?: number;
  RequestDate?: string;
  RequestTime?: string;
  StationCode?: string;
  Station?: string;
  BribeTotal?: number;
  BribeRemainder?: number;
  Informeracknowledge?: string;
  StationOfPOA?: string;
  POADate?: string;
  POATime?: string;
  POANo?: string;
  StationCodeOfPOA?: string;
  IsActive?: number;

  RequestBribeStaff?: Array<IRequestBribeStaff>;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeupdByConResponse extends IResponseCommon {}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeupdDelete {
  RequestBribeID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeupdDeleteResponse extends IResponseCommon {}
