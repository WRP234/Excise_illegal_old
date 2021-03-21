import { IRequestPaymentFine } from './RequestPaymentFine';

export interface IRequestLawsuitJudgement {
  JudgementID: number;
  IndictmentDetailID: number;
  IndictmentID: number;
  JudgementNo: string;
  IsActive: number;

  RequestPaymentFine: Array<IRequestPaymentFine>;
}

export interface IRequestLawsuitJudgementgetByIndictmentID {
  IndictmentID: number;
}
