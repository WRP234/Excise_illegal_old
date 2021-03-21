import { ArrestHelper } from "../../arrest.helper";
import { Output, EventEmitter, Input } from "@angular/core";
import { ArrestProduct, ArrestProductMapping, IMasProductGroup } from "../../models";
import { FormGroup, FormArray } from "@angular/forms";
import { pagination } from "../../../../config/pagination";
import { GetIsDomestic } from "../../entities/is-domestic";


export class Ilg60O02000205Config extends ArrestHelper {

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestProduct[]>();

    @Input() public OCCURRENCE_DATE: any;

    public formGroup: FormGroup;
    public formGroupProductAdded: FormGroup;
    public paginage = pagination;
    public GetIsDomestic = GetIsDomestic;
    public dataList = new Array<any>();

    selectedEntry: boolean;

    get ArrestProduct(): FormArray {
        return this.formGroupProductAdded.get('ArrestProduct') as FormArray;
    }

    get ProductMapping(): FormArray {
        return this.formGroup.get('ProductMapping') as FormArray;
    }

    get ProductMappingList(): ArrestProductMapping[] {
        return this.ProductMapping.value.filter(x => x.IS_CHECKED == true);
    }

    public dismiss = (e: any) => this.d.emit(e);

    public PRODUCT_GROUP_SUBID_7000: any[] = [{
        'PRODUCT_GROUP_ID': "7001",
        'PRODUCT_GROUP_CODE': "",
        'PRODUCT_GROUP_NAME': "สุราแช่",
        'IS_ACTIVE': 1,
        'CREATE_DATE': "",
        'CREATE_USER_ACCOUNT_ID': "",
        'UPDATE_DATE': "",
        'UPDATE_USER_ACCOUNT_ID': "",
        'GROUP_STATUS': ""
    }, {
        'PRODUCT_GROUP_ID': "7002",
        'PRODUCT_GROUP_CODE': "",
        'PRODUCT_GROUP_NAME': "สุรากลั่น",
        'IS_ACTIVE': 1,
        'CREATE_DATE': "",
        'CREATE_USER_ACCOUNT_ID': "",
        'UPDATE_DATE': "",
        'UPDATE_USER_ACCOUNT_ID': "",
        'GROUP_STATUS': ""
    }]

    public PRODUCT_GROUP_OTHER: any[] = [{
        'PRODUCT_GROUP_ID': "88",
        'PRODUCT_GROUP_CODE': "88",
        'PRODUCT_GROUP_NAME': "ของอื่น ๆ จากระบบคดี",
        'IS_ACTIVE': 1,
        'CREATE_DATE': "",
        'CREATE_USER_ACCOUNT_ID': "",
        'UPDATE_DATE': "",
        'UPDATE_USER_ACCOUNT_ID': "",
        'GROUP_STATUS': ""
    }]

    public IS_SYSTEM: any[] = [
        { SYSTEM: 'ระบบ ILG', VALUE: 0 },
        { SYSTEM: 'ระบบ SRP', VALUE: 1 }
    ]


    //TEMP_DEFAULTs
    public TEMP_TEXT_SEARCH: any = '';
    public TEMP_PRODUCT_GROUP_ID: any = '';
    public TEMP_PRODUCT_NAME_DESC: any = '';


}