
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ViewChild, ElementRef } from '@angular/core';
import { pagination } from '../../../config/pagination';
import { RevenueHelper } from '../revenue.helper'
import { Observable } from 'rxjs';
import { Mode, Action } from '../../model/mode';
import { PaymentMode } from '../../model/payment-mode';

export class ManageConfig extends RevenueHelper {

    public sub: any;
    public Action = Action;
    AutoGenerate: string = "Auto Generate";
    cannotEditMgs: string = "ไม่สามารถแก้ไขได้เนื่องจาก รับรายได้แล้ว";

    PaymentMode = PaymentMode;
    ModeAction = Mode;
    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    courtpaginage = pagination;
    selectAllChb: any;
    courtSelectAllChb: any;
    isRequired: boolean | false;
    isSortPaymentDateAsc: boolean;
    isSortCompareAsc: boolean;
    isSortReceiptAsc: boolean;

    ProductGroup_illg_sys: any[];

    STAFF_LIST = [];
    STAFF_SEND_MODEL: any;
    STAFF_SEND_POS_NAME: string
    STAFF_SEND_OFFICE_NAME: string;
    STAFF_SEND_CODE: string;
    STAFF_SEND_NAME: string;

    STAFF_SIGN_MODEL: any;
    STAFF_SIGN_POS_NAME: string
    STAFF_SIGN_OFFICE_NAME: string;
    STAFF_SIGN_CODE: string;
    STAFF_SIGN_NAME: string;

    STAFF_INFORM_MODEL: any;
    STAFF_INFORM_NAME: string;

    OFFICE_LIST = [];
    STATION_FROM_MODEL: any;
    FROM_OFFICE_NAME: string;
    DELIVERY_OFFICE_ID: string;
    DELIVERY_OFFICE_CODE: string;
    DELIVERY_OFFICE_NAME: string;

    STATION_TO_MODEL: any;
    TO_OFFICE_NAME: string;
    RECEIVE_OFFICE_ID: string;
    RECEIVE_OFFICE_CODE: string;
    RECEIVE_OFFICE_NAME: string;

    REVENUE_ID: string;
    REVENUE_CODE: string;
    REVENUE_DATE: any;
    REVENUE_TIME: any;
    REVENUE_STATUS: string;
    REVENUE_STATUS_TEXT: string;
    REVENUE_NO: string;

    RECEIVE_REF_NO: string;
    RECEIVE_DATE: any;

    REVENUE_COUNT: number;
    PAYMENT_FINE_TOTAL: number;
    BRIBE_MONEY_TOTAL: number;
    REWARD_MONEY_TOTAL: number;
    TREASURY_MONEY_TOTAL: number;

    COURT_CHECK_MONEY_TOTAL: number;
    COURT_BRIBE_MONEY_TOTAL: number;
    COURT_REWARD_MONEY_TOTAL: number;

    ListRevenueCompare = [];
    ListRevenueCompareDetailPaging = [];

    ListRevenueCourt = [];
    ListRevenueCourtPaging = [];

    getRevenueDetailChange: boolean = false;

    IncCourtGroupId: string = '9999';

    oParam: any;

    //toggleCollapse
    revenueInfo_collapes = new BehaviorSubject<Boolean>(true);
    revenueCompare_collapes = new BehaviorSubject<Boolean>(true);
    revenueLawsuit_collapes = new BehaviorSubject<Boolean>(true);

    isReq_revDate = new BehaviorSubject<boolean>(false);
    isReq_revTime = new BehaviorSubject<boolean>(false);
    isReq_revNo = new BehaviorSubject<boolean>(false);
    isReq_deliveryOfficeCode = new BehaviorSubject<boolean>(false);
    isReq_receiveOfficeCode = new BehaviorSubject<boolean>(false);
    isReq_staffSend = new BehaviorSubject<boolean>(false);
    isReq_staffSign = new BehaviorSubject<boolean>(false);

    isReq_pGroupId_noProve = new BehaviorSubject<boolean>(false);

    revenueTimeInvalidCheck: boolean = false;

    //Step wizard
    INPUT_WIZARD = new BehaviorSubject<object>(null);

    //Messenge alert
    msgTransectionFailed: string = 'TransactionRunningins Failed';

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;

    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);

    public revenueDetailUpdResponse: any;
    public IncUpdResponse: any;

    BANK: any[] = [];

    PAYMENT_CHANNEL: any[] = [
        { NAME: 'เงินสด', VALUE: 1 },
        { NAME: 'เช็คพาณิชย์', VALUE: 2 },
        { NAME: 'บัตรเดบิท', VALUE: 5 },
        { NAME: 'บัตรเครดิต', VALUE: 6 },
        { NAME: 'โอนเงินอิเล็กทรอนิกส์', VALUE: 8 },
    ]

    searchOffice = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.OFFICE_LIST
                    .filter(v => `${v.OFFICE_NAME || ''} ${v.OFFICE_SHORT_NAME || ''}`
                        .toLowerCase()
                        .indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    public convertProductGroupID(GROUPID: any) {
        let temp = this.ProductGroup_illg_sys.find(f => f.PRODUCT_GROUP_ID == GROUPID);
        return temp ? (temp.PRODUCT_GROUP_CODE) : '';
    }

    RevenueCompareDetailFineMock: any[] = [
        {
            FINE_ID: 499,
            COMPARE_DETAIL_ID: 598,
            PRODUCT_ID: 626,
            PRODUCT_GROUP_ID: 13,
            PRODUCT_GROUP_CODE: "",
            FINE_RATE: 100,
            VAT: 100,
            FINE: 100,
            NET_FINE: 100,
            OLD_PAYMENT_FINE: 0,
            PAYMENT_FINE: 100,
            DIFFERENCE_PAYMENT_FINE: 0,
            TREASURY_MONEY: 100,
            BRIBE_MONEY: 100,
            REWARD_MONEY: 100,
            IS_ACTIVE: 1
        },
        {
            FINE_ID: 499,
            COMPARE_DETAIL_ID: 598,
            PRODUCT_ID: 626,
            PRODUCT_GROUP_ID: 13,
            PRODUCT_GROUP_CODE: "",
            FINE_RATE: 200,
            VAT: 200,
            FINE: 200,
            NET_FINE: 200,
            OLD_PAYMENT_FINE: 0,
            PAYMENT_FINE: 200,
            DIFFERENCE_PAYMENT_FINE: 0,
            TREASURY_MONEY: 200,
            BRIBE_MONEY: 200,
            REWARD_MONEY: 200,
            IS_ACTIVE: 1
        },
        // {
        //     FINE_ID: 499,
        //     COMPARE_DETAIL_ID: 598,
        //     PRODUCT_ID: 626,
        //     PRODUCT_GROUP_ID: 8,
        //     PRODUCT_GROUP_CODE: "",
        //     FINE_RATE: 300,
        //     VAT: 300,
        //     FINE: 300,
        //     NET_FINE: 300,
        //     OLD_PAYMENT_FINE: 0,
        //     PAYMENT_FINE: 300,
        //     DIFFERENCE_PAYMENT_FINE: 0,
        //     TREASURY_MONEY: 300,
        //     BRIBE_MONEY: 300,
        //     REWARD_MONEY: 300,
        //     IS_ACTIVE: 1
        // },
    ]

    RevenuePaymentMock: any[] = [
        {
            PAYMENT_ID: 881,
            LAWSUIT_DETAIL_ID: 0,
            COMPARE_DETAIL_ID: 742,
            FINE_TYPE: 1,
            FINE: 1650,
            PAYMENT_PERIOD_NO: 0,
            PAYMENT_DATE: "03-04-2563 05:04:00",
            IS_REQUEST_REWARD: 0,
            IS_ACTIVE: 1,
            PAYMENT_CHANNEL: 1,
            PAYMENT_BANK: null,
            PAYMENT_REF_NO: null,
            IS_REVENUE: 1
        }
    ]


}