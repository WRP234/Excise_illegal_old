export interface IRequestPaymentFineDetail {
  PaymentFineDetailID: number;
  PaymentFineID: number;
  NoticeCode: string;
  LawbreakerTitleName: string;
  LawbreakerFirstName: string;
  LawbreakerMiddleName: string;
  LawbreakerLastName: string;
  LawbreakerOtherName: string;
  FineType: 0 | 1;
  PaymentDueDate: string;
  PaymentActualDate: string;
  ReceiptBookNo: string;
  ReceiptNo: string;
  JudgementNo: string;
  PaymentPeriodNo: number;
  PaymentFine: number;

  IsRequestBribe: 0 | 1;
  IsActive: number;
}

export interface IRequestPaymentFineDetailgetByNoticeCode {
  NoticeCode: string;
}

export interface IRequestPaymentFineDetailupdByCon {
  PaymentFineDetailID: number;
}

export interface IRequestPaymentFineDetailupdDelete {
  PaymentFineDetailID: number;
}
