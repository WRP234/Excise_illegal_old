// tslint:disable-next-line:no-empty-interface
export interface IRequestList {
  REQUEST_STATUS: string;
  NOTICE: string;
  ARREST_CODE: string;
  ARREST_DATE: string;
  ARREST_STAFF: string;
  LAWSUIT_NOYEAR: string;
  LAWSUIT_TYPE: string;
  LAWSUIT_DATE: string;
  LAWSUIT_STAFF: string;
  COMPARE_NOYEAR: string;
  COMPARE_DATE: string;
  COMPARE_STAFF: string;
  REVENUE_STATUS: string;
  INDICTMENT_ID: string;
}
export interface IRequestListgetByKeyword {
  TEXT_SEARCH: string;
  ACCOUNT_OFFICE_CODE: string;
}
export interface IRequestListgetByConAdv {
  ACCOUNT_OFFICE_CODE: string;
  STATUS_REQUEST_REWARD: string;
  NOTICE_CODE: string;
  ARREST_CODE: string;
  OCCURRENCE_DATE_FROM: string;
  OCCURRENCE_DATE_TO: string;
  ARREST_STAFF: string;
  LAWSUIT_NO: string;
  LAWSUIT_NO_YEAR: string;
  LAWSUIT_TYPE: string;
  LAWSUIT_DATE_FROM: string;
  LAWSUIT_DATE_TO: string;
  LAWSUIT_STAFF: string;
  COMPARE_NO: string;
  COMPARE_NO_YEAR: string;
  COMPARE_DATE_FROM: string;
  COMPARE_DATE_TO: string;
  COMPARE_STAFF: string;  
}
