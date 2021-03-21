export class SearchByAdv {
  IsSuccess: string;
  Msg: string;
  response: SearchWarrantListGetByConAdv[];
}

export class SearchWarrantListGetByConAdv {
  ACCOUNT_OFFICE_CODE: string;
  CONSIDER_DATE_FROM: string;
  CONSIDER_DATE_TO: string;
  CONSIDER_DECIDE_NO: number;
  CONSIDER_DECIDE_NO_YEAR: string;
  CONSIDER_UNDECIDE_NO: number;
  CONSIDER_UNDECIDE_NO_YEAR: string;
  IS_APPROVE: number;
  IS_ARREST: number;
  PERSON_HEAD_NAME: string;
  PERSON_HOST_NAME: string;
  PERSON_PETITIONER_NAME: string;
  PERSON_REQUEST_NAME: string;
  PRESENT_COURT_NAME: string;
  REQUEST_CODE: string;
  REQUEST_DATE_FROM: string;
  REQUEST_DATE_TO: string;
  REQUEST_NO: string;
  REQUEST_NO_YEAR: string;
  SEARCH_WARRANT_DATE_FROM: string;
  SEARCH_WARRANT_DATE_TO: string;
  SEARCH_WARRANT_NO: number;
  SEARCH_WARRANT_NO_YEAR: string;
}
