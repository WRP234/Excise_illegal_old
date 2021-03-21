export interface IRequestPaymentFine {
  PaymentFineID: number;
  FineType: 0 | 1;
  ReferenceID: number;
  PaymentPeriodNo: number;
  PaymentFine: number;
  PaymentDueDate: string;
  PaymentActualDate: string;
  ReceiveFinRate: string;
  LawbreakerTitleName: string;
  LawbreakerFirstName: string;
  LawbreakerMiddleName: string;
  LawbreakerLastName: string;
  LawbreakerOtherName: string;
  ReceiptBookNo: string;
  ReceiptNo: string;
  JudgementNo: string;
  IsActive: number;
  IsRequestReward: 0 | 1;
}

export interface IRequestPaymentFineupdByCon {
  PaymentFineID: number;
}

export interface IRequestPaymentFineupdDelete {
  PaymentFineID: number;
}
