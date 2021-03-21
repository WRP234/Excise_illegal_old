import { IRequestPaymentFine } from './RequestPaymentFine';

export interface IRequestCompare {
  CompareID: number;
  CompareCode: string;
  IsOutside: 0 | 1;
  LawsuitID: number;
  IndictmentID: number;
  IsActive: number;

  RequestPaymentFine: Array<IRequestPaymentFine>;
}
export interface IRequestComparegetByIndictmentID {
  IndictmentID: number;
}
