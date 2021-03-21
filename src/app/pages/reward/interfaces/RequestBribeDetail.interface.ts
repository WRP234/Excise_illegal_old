import { IResponseCommon } from './ResponseCommon.interface';

export interface IRequestBribeDetail {
  RequestBribeDetailID: number;
  PaymentFineDetailID: number;

  LawbreakerTitleName: string;
  LawbreakerFirstName: string;
  LawbreakerMiddleName: string;
  LawbreakerLastName: string;
  LawbreakerOtherName: string;
  FineType: number;
  PaymentDueDate: string;
  PaymentActualDate: string;
  ReceiptBookNo: string;
  ReceiptNo: string;
  JudgementNo: string;
  PaymentPeriodNo: number;
  PaymentFine: number;

  RequestBribeID: number;
  IsActive: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeDetailinsAll extends IRequestBribeDetail {

}
// export interface IRequestBribeDetail {
//   RequestBribeDetailID: number;
//   PaymentFineDetailID: number;
//   RequestBribeID: number;
//   IsActive: number;
// }

export interface IRequestBribeDetailResponse extends IResponseCommon {
  RequestBribeDetailID?: number;
}

export interface IRequestBribeDetailupdDelete {
  RequestBribeDetailID: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IRequestBribeDetailupdDeleteResponse extends IResponseCommon {}
