
export interface ListSearchWarrant {
  IsSuccess: string;
  Msg: string;
  response: SearchWarrantList[];
}

export interface SearchWarrantList {
  REQUEST_ID: number;
  PRESENT_COURT_ID: number;
  PAST_COURT_ID: number;
  JUDGE_TITLE_ID: number;
  SUB_DISTRICT_ID: number;
  PERSON_TITLE_ID: number;
  REQUEST_CODE: string;
  REQUEST_NO: string;
  REQUEST_NO_YEAR: string;
  PRESENT_COURT_NAME: string;
  REQUEST_DATE: string;
  JUDGE_TITLE_NAME_TH: string;
  JUDGE_TITLE_NAME_EN: string;
  JUDGE_TITLE_SHORT_NAME_TH: string;
  JUDGE_TITLE_SHORT_NAME_EN: string;
  JUDGE_FIRST_NAME: string;
  JUDGE_LAST_NAME: string;
  LATITUDE: string;
  LONGITUDE: string;
  ADDRESS_NO: string;
  VILLAGE_NO: string;
  BUILDING_NAME: string;
  ROOM_NO: string;
  FLOOR: string;
  VILLAGE_NAME: string;
  ALLEY: string;
  LANE: string;
  ROAD: string;
  PERSON_TITLE_NAME_TH: string;
  PERSON_TITLE_NAME_EN: string;
  PERSON_TITLE_SHORT_NAME_TH: string;
  PERSON_TITLE_SHORT_NAME_EN: string;
  PERSON_FIRST_NAME: string;
  PERSON_MIDDLE_NAME: string;
  PERSON_LAST_NAME: string;
  PERSON_OTHER_NAME: number;
  PERSON_ID_CARD: string;
  PERSON_AGE: number;
  PERSON_CAREER: string;
  PERSON_POSITION: string;
  PERSON_DESC: string;
  PERSON_EMAIL: string;
  PERSON_TEL_NO: string;
  REQUEST_REASON: string;
  REQUEST_CHECK_1: number;
  REQUEST_CHECK_2: number;
  REQUEST_CHECK_3: number;
  REQUEST_CHECK_4: number;
  REQUEST_CHECK_5: number;
  REQUEST_DATE_FROM: string;
  REQUEST_DATE_TO: string;
  REQUEST_CHECK_TO_FINISH: number;
  REQUEST_CHECK_EVER: number;
  PAST_COURT_NAME: string;
  PAST_REQUEST_REASON: string;
  PAST_COMMAND: string;
  IS_CONSIDER: number;
  IS_ACTIVE: number;
  CREATE_DATE: string;
  CREATE_USER_ACCOUNT_ID: number;
  UPDATE_DATE: string;
  UPDATE_USER_ACCOUNT_ID: number;
  searchWarrantConsider: {
    CONSIDER_ID: number;
    REQUEST_ID: number;
    CONSIDER_UNDECIDE_NO: number;
    CONSIDER_UNDECIDE_NO_YEAR: string;
    CONSIDER_DECIDE_NO: number;
    CONSIDER_DECIDE_NO_YEAR: string;
    CONSIDER_DATE: string;
    CONSIDER_WITNESS_QTY: number;
    CONSIDER_COMMAND: string;
    IS_APPROVE: number;
    REMARK_NOT_APPROVE: string;
    IS_ACTIVE: number;
    IS_CONSIDER: number;
    searchWarrant: {
      SEARCH_WARRANT_ID: number;
      CONSIDER_ID: number;
      ARREST_WARRANT_COURT_ID: number;
      ARREST_ID: number;
      SEARCH_WARRANT_NO: number;
      SEARCH_WARRANT_NO_YEAR: string;
      SEARCH_WARRANT_DATE: string;
      SEARCH_WARRANT_CHECK_1: number;
      SEARCH_WARRANT_CHECK_1_DESC: string;
      SEARCH_WARRANT_CHECK_1_1: number;
      SEARCH_WARRANT_CHECK_1_2: number;
      SEARCH_WARRANT_CHECK_1_3: number;
      SEARCH_WARRANT_CHECK_2: number;
      SEARCH_WARRANT_CHECK_2_DESC: string;
      SEARCH_WARRANT_CHECK_2_1: number;
      SEARCH_WARRANT_CHECK_2_2: number;
      ARREST_WARRANT_NO: number;
      ARREST_WARRANT_NO_YEAR: string;
      ARREST_WARRANT_DATE: string;
      ARREST_WARRANT_COURT_NAME: string;
      SEARCH_WARRANT_DATE_FROM: string;
      SEARCH_WARRANT_DATE_TO: string;
      SEARCH_WARRANT_CHECK_TO_FINISH: number;
      SEARCH_WARRANT_SEND_TO: string;
      SEARCH_WARRANT_SEND_DESC_TO: string;
      SEARCH_WARRANT_RESULT: string;
      IS_ARREST: number;
      IS_ACTIVE: number;
    }
  },
  searchWarrantStaff: [{
    STAFF_ID: number;
    REQUEST_ID: number;
    STAFF_REF_ID: number;
    TITLE_ID: number;
    STAFF_CODE: string;
    ID_CARD: string;
    STAFF_TYPE: number;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    AGE: number;
    OPERATION_POS_CODE: string;
    OPREATION_POS_NAME: string;
    OPREATION_POS_LEVEL: string;
    OPERATION_POS_LEVEL_NAME: string;
    OPERATION_DEPT_CODE: string;
    OPERATION_DEPT_NAME: string;
    OPERATION_DEPT_LEVEL: number;
    OPERATION_UNDER_DEPT_CODE: string;
    OPERATION_UNDER_DEPT_NAME: string;
    OPERATION_UNDER_DEPT_LEVEL: number;
    OPERATION_WORK_DEPT_CODE: string;
    OPERATION_WORK_DEPT_NAME: string;
    OPERATION_WORK_DEPT_LEVEL: number;
    OPERATION_OFFICE_CODE: number;
    OPERATION_OFFICE_NAME: string;
    OPERATION_OFFICE_SHORT_NAME: string;
    MANAGEMENT_POS_CODE: string;
    MANAGEMENT_POS_NAME: string;
    MANAGEMENT_POS_LEVEL: string;
    MANAGEMENT_POS_LEVEL_NAME: string;
    MANAGEMENT_DEPT_CODE: string;
    MANAGEMENT_DEPT_NAME: string;
    MANAGEMENT_DEPT_LEVEL: number;
    MANAGEMENT_UNDER_DEPT_CODE: string;
    MANAGEMENT_UNDER_DEPT_NAME: string;
    MANAGEMENT_UNDER_DEPT_LEVEL: number;
    MANAGEMENT_WORK_DEPT_CODE: string;
    MANAGEMENT_WORK_DEPT_NAME: string;
    MANAGEMENT_WORK_DEPT_LEVEL: number;
    MANAGEMENT_OFFICE_CODE: string;
    MANAGEMENT_OFFICE_NAME: string;
    MANAGEMENT_OFFICE_SHORT_NAME: string;
    REPRESENT_POS_CODE: string;
    REPRESENT_POS_NAME: string;
    REPRESENT_POS_LEVEL: string;
    REPRESENT_POS_LEVEL_NAME: string;
    REPRESENT_DEPT_CODE: string;
    REPRESENT_DEPT_NAME: string;
    REPRESENT_DEPT_LEVEL: number;
    REPRESENT_UNDER_DEPT_CODE: string;
    REPRESENT_UNDER_DEPT_NAME: string;
    REPRESENT_UNDER_DEPT_LEVEL: number;
    REPRESENT_WORK_DEPT_CODE: string;
    REPRESENT_WORK_DEPT_NAME: string;
    REPRESENT_WORK_DEPT_LEVEL: number;
    REPRESENT_OFFICE_CODE: string;
    REPRESENT_OFFICE_NAME: string;
    REPRESENT_OFFICE_SHORT_NAME: string;
    STATUS: number;
    REMARK: string;
    CONTRIBUTOR_ID: number;
    IS_ACTIVE: number;
  }]
}