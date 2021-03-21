import { pagination } from '../../../config/pagination';
import { BehaviorSubject } from "rxjs";
import { RevenueHelper } from '../revenue.helper'

export class ListConfig extends RevenueHelper {

    public searching: boolean;
    public searchFailed: boolean;

    public advSearch: any;
    public dataList = [];
    public showDataList = [];
    public paginage = pagination;

    public dateStartFrom: any;
    public dateStartTo: any;
    public REVENUE_DATE_FROM: any;
    public REVENUE_DATE_TO: any;

    public modal: any;

    public dateFromOption = Object.assign({}, this.myDatePickerOptions);
    public dateToOption = Object.assign({}, this.myDatePickerOptions);

    //Msg
    noRecordMsg: string = 'ไม่พบข้อมูล';
    revenueStatus0Msg: string = 'นำส่งเงินรายได้';
    revenueStatus1Msg: string = 'ระบบรายได้รับแล้ว';

    //SEARCH_SORTING
    public REVENUE_CODE_SORTING = new BehaviorSubject<Boolean>(true);
    public REVENUE_DATE_SORTING = new BehaviorSubject<Boolean>(true);

    // ----- Model ------ //
    //@ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_REVENUE_CODE: any = '';
    public TEMP_DELIVERY_OFFICE_NAME: any = '';
    public TEMP_STAFF_NAME_SEND: any = '';
    public TEMP_STAFF_NAME_SIGN: any = '';
    public TEMP_LAWSUIT_NO: any = '';
    public TEMP_LAWSUIT_NO_YEAR: any = '';
    public TEMP_LAWSUIT_IS_OUTSIDE: any = '';
    public TEMP_COMPARE_NO: any = '';
    public TEMP_COMPARE_NO_YEAR: any = '';
    public TEMP_REVENUE_STATUS: any = '';

    mockDateList: any[] = [
        {
            REVENUE_ID: 1,
            DELIVERY_OFFICE_ID: 259,
            RECEIVE_OFFICE_ID: 259,
            REVENUE_CODE: "LC0504016200001",
            DELIVERY_OFFICE_CODE: "050401",
            DELIVERY_OFFICE_NAME: "สสพ.พะเยา สาขาเมือง",
            RECEIVE_OFFICE_CODE: "050401",
            RECEIVE_OFFICE_NAME: "สสพ.พะเยา สาขาเมือง",
            REVENUE_NO: "กค.050401.01/1",
            REVENUE_DATE: "2020-02-17 16:34:24",
            REVENUE_STATUS: 1,
            REVENUE_COUNT: "2",
            FINE: 42000,
            TREASURY_MONEY: 19200,
            BRIBE_MONEY: 8900,
            REWARD_MONEY: 13900,
            RECEIVE_REF_NO: null,
            RECEIVE_DATE: null,
            IS_ACTIVE: 1,
            RevenueDetail: [],
            RevenueStaff: []
        },
        {
            REVENUE_ID: 1,
            DELIVERY_OFFICE_ID: 259,
            RECEIVE_OFFICE_ID: 259,
            REVENUE_CODE: "LC0504016200002",
            DELIVERY_OFFICE_CODE: "050401",
            DELIVERY_OFFICE_NAME: "สสพ.พะเยา สาขาเมือง",
            RECEIVE_OFFICE_CODE: "050401",
            RECEIVE_OFFICE_NAME: "สสพ.พะเยา สาขาเมือง",
            REVENUE_NO: "กค.050401.01/1",
            REVENUE_DATE: "2020-02-18 16:34:24",
            REVENUE_STATUS: 1,
            REVENUE_COUNT: "5",
            FINE: 42000,
            TREASURY_MONEY: 19200,
            BRIBE_MONEY: 8900,
            REWARD_MONEY: 13900,
            RECEIVE_REF_NO: null,
            RECEIVE_DATE: null,
            IS_ACTIVE: 1,
            RevenueDetail: [],
            RevenueStaff: []
        }
    ]

}