import { IRequestCommandDetail } from './RequestCommandDetail';

export interface IRequestCommand {
  CommandID: number;
  CommandDate: string;
  CommandTime: string;
  CommandNo: string;
  IsActive: number;
  TotalPart: number;
  ArrestCode: string;

  RequestCommandDetail?: Array<IRequestCommandDetail>;
}

export interface IRequestCommandgetByArrestCode {
  ArrestCode: string;
}
// tslint:disable-next-line:no-empty-interface
export interface IRequestCommandinsAll extends IRequestCommand {}

// tslint:disable-next-line:no-empty-interface
export interface IRequestCommandupdByCon extends IRequestCommand {}

export interface IRequestCommandupdDelete {
  CommandID: number;
}
