export interface IRequestRewardDetail {
  RequestRewardDetailID: number;
  RequestRewardID: number;
  PaymentFineID: number;
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
  IsActive: number;
}

export interface IRequestRewardDetailupdDelete {
  RequestRewardDetailID: number;
}
