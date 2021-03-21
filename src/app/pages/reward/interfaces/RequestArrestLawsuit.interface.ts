// tslint:disable-next-line:no-empty-interface
export interface IRequestArrestLawsuit {
  ArrestCode: string;
  IndictmentID: number;
  OccurrenceDate: string;
  OccurrenceTime: string;
  TitleName: string;
  FirstName: string;
  LastName: string;
  PositionName: string;
  OfficeName: string;
  SubDistrict: string;
  District: number;
  Province: number;
  LawsuitNo: string;
  LawsuitDate: string;
  LawsuitTime: string;
  SubSectionType: string;
  GuiltBaseName: string;
  SectionNo: string;
  PenaltyDesc: string;
}
export interface IRequestArrestLawsuitGetByIndictmentId {
  IndictmentID: number;
}
