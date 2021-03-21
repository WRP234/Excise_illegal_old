import { MastersConfig } from '../../masters.config';
import { ElementRef, ViewChild } from '@angular/core';
import { pagination } from '../../../../config/pagination';
import swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

export class ManageConfig extends MastersConfig {

    localUserAccountID = localStorage.getItem('UserAccountID');

    /** MsProduct form */
    PRODUCT_CODE: string = "";
    PRODUCT_MAPPING_ID: number = 0;
    PRODUCT_REF_CODE: string = "";
    PRODUCT_GROUP_ID: number;
    PRODUCT_CATEGORY_ID: number;
    PRODUCT_TYPE_ID: number;
    PRODUCT_SUBTYPE_ID: number;
    PRODUCT_SUBSETTYPE_ID: number;
    PRODUCT_BRAND_ID: any;
    PRODUCT_SUBBRAND_ID: number;
    PRODUCT_MODEL_ID: number;
    PRODUCT_TAXDETAIL_ID: number;
    UNIT_ID: number;
    SUGAR: string;
    CO2: string;
    DEGREE: string;
    PRICE: any;
    SIZES: any;
    SIZES_UNIT: string
    IS_DOMESTIC: string;
    IS_ACTIVE: number;
    CREATE_DATE: any;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: any;
    UPDATE_USER_ACCOUNT_ID: number;
    CATEGORY_GROUP_CODE: string;
    CATEGORY_CODE: string;
    QUANTITY_UNIT: string;
    EXPIRE_DATE: any;
    LAW_DUTY_CODE: string;
    PRODUCT_NAME_DESC: string;
    /** End MsProduct form */

    public REQ_PRODUCT_GROUP_ID = new BehaviorSubject<Boolean>(false);
    // public REQ_BRAND_MODEL = new BehaviorSubject<Boolean>(false);
    public REQ_SIZES = new BehaviorSubject<Boolean>(false);
    public REQ_SIZES_UNIT = new BehaviorSubject<Boolean>(false);
    public REQ_PRODUCTUNIT_MODEL = new BehaviorSubject<Boolean>(false);

    /** Customs */
    PRODUCT_GROUP_LIST = [];

    BRAND_LIST = [];
    BRAND_MODEL: any;
    PRODUCT_BRAND_NAME_TH: string;

    SUBBRAND_LIST = [];
    SUBBRAND_MODEL: any;
    PRODUCT_SUBBRAND_NAME_TH: string;

    MODEL_LIST = [];
    MODEL_MODEL: any;
    PRODUCT_MODEL_NAME_TH: string;

    PRODUCTSIZE_LIST = [];
    PRODUCTSIZE_MODEL: any;
    // SIZE_DESC: string;

    PRODUCTUNIT_LIST = [];
    PRODUCTUNIT_MODEL: any;
    UNIT_NAME_TH: string;

    EFEXPIRE_DATE: any;

    chk1: boolean;

    PRODUCT_GROUP_CODE_TEMP: string = "00";
    PRODUCT_CATEGORY_CODE_TEMP: string = "00";
    PRODUCT_TYPE_CODE_TEMP: string = "00";
    PRODUCT_SUBSETTYPE_CODE_TEMP: string = "00";

    PRODUCT_GROUP_NAME_TEMP: string = "";
    PRODUCT_CATEGORY_NAME_TEMP: string = "";
    PRODUCT_TYPE_NAME_TEMP: string = "";

    PopupType: string;
    PopupMode: string;
    PopupModel: any;

    InquiryDutyTable: any[] = [];
    InquiryProductType: any[] = [];
    InquiryProductSubType: any[] = [];

    InquiryDutyTable_list: any[] = [];
    InquiryProductType_list: any[] = [];
    InquiryProductSubType_list: any[] = [];

    public sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    oParam: any;

    // ----- Model ------ //
    @ViewChild('brandModal') brandModal: ElementRef;


    public swalFn(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
        })
    }

    public swalFnMulti(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        })
    }
}