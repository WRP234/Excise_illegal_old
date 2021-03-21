import { FormControl, Validators } from '@angular/forms';

export class NoticeProduct {

    public PRODUCT_ID = '';
    public NOTICE_ID = '';
    public PRODUCT_MAPPING_ID = '';
    public PRODUCT_CODE = '';
    public PRODUCT_REF_CODE = '';
    public PRODUCT_GROUP_ID = '';
    public PRODUCT_CATEGORY_ID = '';
    public PRODUCT_TYPE_ID = '';
    public PRODUCT_SUBTYPE_ID = '';
    public PRODUCT_SUBSETTYPE_ID = '';
    public PRODUCT_BRAND_ID = '';
    public PRODUCT_SUBBRAND_ID = '';
    public PRODUCT_MODEL_ID = '';
    public PRODUCT_TAXDETAIL_ID = '';
    public SIZES_UNIT_ID = '';
    public QUATITY_UNIT_ID = '';
    public VOLUMN_UNIT_ID = '';
    public PRODUCT_GROUP_CODE = '';
    public PRODUCT_GROUP_NAME = '';
    public PRODUCT_CATEGORY_CODE = '';
    public PRODUCT_CATEGORY_NAME = '';
    public PRODUCT_TYPE_CODE = '';
    public PRODUCT_TYPE_NAME = '';
    public PRODUCT_SUBTYPE_CODE = '';
    public PRODUCT_SUBTYPE_NAME = '';
    public PRODUCT_SUBSETTYPE_CODE = '';
    public PRODUCT_SUBSETTYPE_NAME = '';
    public PRODUCT_BRAND_CODE = '';
    public PRODUCT_BRAND_NAME_TH = '';
    public PRODUCT_BRAND_NAME_EN = '';
    public PRODUCT_SUBBRAND_CODE = '';
    public PRODUCT_SUBBRAND_NAME_TH = '';
    public PRODUCT_SUBBRAND_NAME_EN = '';
    public PRODUCT_MODEL_CODE = '';
    public PRODUCT_MODEL_NAME_TH = '';
    public PRODUCT_MODEL_NAME_EN = '';
    public IS_TAX_VALUE = '';
    public TAX_VALUE = '';
    public IS_TAX_VOLUMN = '';
    public TAX_VOLUMN = '';
    public TAX_VOLUMN_UNIT = '';
    public LICENSE_PLATE = '';
    public ENGINE_NO = '';
    public CHASSIS_NO = '';
    public PRODUCT_DESC = '';
    public SUGAR = '';
    public CO2 = '';
    public DEGREE = '';
    public PRICE = '';
    public SIZES = '';
    public SIZES_UNIT = '';
    public QUANTITY = '';
    public QUANTITY_UNIT = '';
    public VOLUMN = '';
    public VOLUMN_UNIT = '';
    public REMARK = '';
    public IS_DOMESTIC = '';
    public IS_ILLEGAL = '';
    public IS_ACTIVE;

    // public ProductID = '';
    // public NoticeCode = '';
    // public GroupCode = '';
    // public IsDomestic = '';
    // public ProductCode = '';
    // public BrandCode = '';
    // public BrandNameTH = '';
    // public BrandNameEN = '';
    // public SubBrandCode = '';
    // public SubBrandNameTH = '';
    // public SubBrandNameEN = '';
    // public ModelCode = '';
    // public ModelName = '';
    // public FixNo1 = '';
    // public DegreeCode = '';
    // public Degree = '';
    // public SizeCode = '';
    // public Size = '';
    // public SizeUnitCode = '';
    // public SizeUnitName = '';
    // public FixNo2 = '';
    // public SequenceNo = '';
    // public ProductDesc = '';
    // public CarNo = '';
    // public Qty = '';
    // public QtyUnit = '';
    // public NetWeight = '';
    // public NetWeightUnit = '';
    // public Remarks = '';
    // public IsActive = 1;

    ProductFullName: string;
    public BrandFullName = '';
    public IsNewItem: boolean;
    public DutyCode = "";
    public DEEG_SUG_CO2;
}

export const NoticeProductFormControl = {

    PRODUCT_ID: new FormControl(''),
    NOTICE_ID: new FormControl(''),
    PRODUCT_MAPPING_ID: new FormControl(''),
    PRODUCT_CODE: new FormControl(''),
    PRODUCT_REF_CODE: new FormControl(''),
    PRODUCT_GROUP_ID: new FormControl(''),
    PRODUCT_CATEGORY_ID: new FormControl(''),
    PRODUCT_TYPE_ID: new FormControl(''),
    PRODUCT_SUBTYPE_ID: new FormControl(''),
    PRODUCT_SUBSETTYPE_ID: new FormControl(''),
    PRODUCT_BRAND_ID: new FormControl(''),
    PRODUCT_SUBBRAND_ID: new FormControl(''),
    PRODUCT_MODEL_ID: new FormControl(''),
    PRODUCT_TAXDETAIL_ID: new FormControl(''),
    SIZES_UNIT_ID: new FormControl(''),
    QUATITY_UNIT_ID: new FormControl(''),
    VOLUMN_UNIT_ID: new FormControl(''),
    PRODUCT_GROUP_CODE: new FormControl(''),
    PRODUCT_GROUP_NAME: new FormControl(''),
    PRODUCT_CATEGORY_CODE: new FormControl(''),
    PRODUCT_CATEGORY_NAME: new FormControl(''),
    PRODUCT_TYPE_CODE: new FormControl(''),
    PRODUCT_TYPE_NAME: new FormControl(''),
    PRODUCT_SUBTYPE_CODE: new FormControl(''),
    PRODUCT_SUBTYPE_NAME: new FormControl(''),
    PRODUCT_SUBSETTYPE_CODE: new FormControl(''),
    PRODUCT_SUBSETTYPE_NAME: new FormControl(''),
    PRODUCT_BRAND_CODE: new FormControl(''),
    PRODUCT_BRAND_NAME_TH: new FormControl(''),
    PRODUCT_BRAND_NAME_EN: new FormControl(''),
    PRODUCT_SUBBRAND_CODE: new FormControl(''),
    PRODUCT_SUBBRAND_NAME_TH: new FormControl(''),
    PRODUCT_SUBBRAND_NAME_EN: new FormControl(''),
    PRODUCT_MODEL_CODE: new FormControl(''),
    PRODUCT_MODEL_NAME_TH: new FormControl(''),
    PRODUCT_MODEL_NAME_EN: new FormControl(''),
    IS_TAX_VALUE: new FormControl(''),
    TAX_VALUE: new FormControl(''),
    IS_TAX_VOLUMN: new FormControl(''),
    TAX_VOLUMN: new FormControl(''),
    TAX_VOLUMN_UNIT: new FormControl(''),
    LICENSE_PLATE: new FormControl(''),
    ENGINE_NO: new FormControl(''),
    CHASSIS_NO: new FormControl(''),
    PRODUCT_DESC: new FormControl(''),
    SUGAR: new FormControl(''),
    CO2: new FormControl(''),
    DEGREE: new FormControl(''),
    PRICE: new FormControl(''),
    SIZES: new FormControl(''),
    SIZES_UNIT: new FormControl(''),
    QUANTITY: new FormControl(''),
    QUANTITY_UNIT: new FormControl(''),
    VOLUMN: new FormControl(''),
    VOLUMN_UNIT: new FormControl(''),
    REMARK: new FormControl(''),
    IS_DOMESTIC: new FormControl(''),
    IS_ILLEGAL: new FormControl(''),
    IS_ACTIVE: new FormControl(),
    
    BrandFullName: new FormControl(null, Validators.required),
    IsNewItem: new FormControl(false),
    DutyCode: new FormControl(null, Validators.required),
    DEEG_SUG_CO2:  new FormControl(null)
}

export class ProductGroup {
    CREATE_DATE: string;
    CREATE_USER_ACCOUNT_ID: number;
    IS_ACTIVE: number;
    PRODUCT_GROUP_CODE: string;
    PRODUCT_GROUP_ID: string;
    PRODUCT_GROUP_NAME: string;
    UPDATE_DATE: string;
    UPDATE_USER_ACCOUNT_ID: number;
}