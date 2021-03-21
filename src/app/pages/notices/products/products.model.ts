import { FormControl, Validators } from '@angular/forms';

export interface Product_dtl {
  CO2: string;
  CREATE_DATE: string;
  CREATE_USER_ACCOUNT_ID: string;
  CREATE_USER_NAME: string;
  DEGREE: string;
  IS_ACTIVE: string;
  IS_DOMESTIC: number;
  PRICE: string;
  PRODUCT_BRAND_ID: string;
  PRODUCT_BRAND_NAME_EN: string;
  PRODUCT_BRAND_NAME_TH: string;
  PRODUCT_CATEGORY_ID: string;
  PRODUCT_CATEGORY_NAME: string;
  PRODUCT_CODE: string;
  PRODUCT_GROUP_ID: number;
  PRODUCT_GROUP_NAME: string;
  PRODUCT_MAPPING_ID: string;
  PRODUCT_MODEL_ID: string;
  PRODUCT_MODEL_NAME_EN: string;
  PRODUCT_MODEL_NAME_TH: string;
  PRODUCT_REF_CODE: string;
  PRODUCT_SUBBRAND_ID: string;
  PRODUCT_SUBBRAND_NAME_EN: string;
  PRODUCT_SUBBRAND_NAME_TH: string;
  PRODUCT_SUBSETTYPE_ID: string;
  PRODUCT_SUBSETTYPE_NAME: string;
  PRODUCT_SUBTYPE_ID: string;
  PRODUCT_SUBTYPE_NAME: string;
  PRODUCT_TAXDETAIL_ID: string;
  PRODUCT_TYPE_ID: string;
  PRODUCT_TYPE_NAME: string;
  SIZES: string;
  SIZES_UNIT: string;
  SUGAR: number;
  UNIT_ID: string;
  UPDATE_DATE: string;
  UPDATE_USER_ACCOUNT_ID: string;
  UPDATE_USER_NAME: string;

  QUANTITY_UNIT: string;
  QUANTITY: string;
  PRODUCT_DESC: string;
  REMARK: string;
  SIZES_TEMP: string;//CTs
  IS_DOMESTIC_NAME: string;//CTs
}

export const Product_dtlFormControl = {
  CO2: new FormControl(null),
  CREATE_DATE: new FormControl(null),
  CREATE_USER_ACCOUNT_ID: new FormControl(null),
  CREATE_USER_NAME: new FormControl(null),
  DEGREE: new FormControl(null),
  IS_ACTIVE: new FormControl(null),
  IS_DOMESTIC: new FormControl(null),
  PRICE: new FormControl(null),
  PRODUCT_BRAND_ID: new FormControl(null),
  PRODUCT_BRAND_NAME_EN: new FormControl(null),
  PRODUCT_BRAND_NAME_TH: new FormControl(null),
  PRODUCT_CATEGORY_ID: new FormControl(null),
  PRODUCT_CATEGORY_NAME: new FormControl(null),
  PRODUCT_CODE: new FormControl(null),
  PRODUCT_GROUP_ID: new FormControl(null),
  PRODUCT_GROUP_NAME: new FormControl(null),
  PRODUCT_MAPPING_ID: new FormControl(null),
  PRODUCT_MODEL_ID: new FormControl(null),
  PRODUCT_MODEL_NAME_EN: new FormControl(null),
  PRODUCT_MODEL_NAME_TH: new FormControl(null),
  PRODUCT_REF_CODE: new FormControl(null),
  PRODUCT_SUBBRAND_ID: new FormControl(null),
  PRODUCT_SUBBRAND_NAME_EN: new FormControl(null),
  PRODUCT_SUBBRAND_NAME_TH: new FormControl(null),
  PRODUCT_SUBSETTYPE_ID: new FormControl(null),
  PRODUCT_SUBSETTYPE_NAME: new FormControl(null),
  PRODUCT_SUBTYPE_ID: new FormControl(null),
  PRODUCT_SUBTYPE_NAME: new FormControl(null),
  PRODUCT_TAXDETAIL_ID: new FormControl(null),
  PRODUCT_TYPE_ID: new FormControl(null),
  PRODUCT_TYPE_NAME: new FormControl(null),
  SIZES: new FormControl(null),
  SIZES_UNIT: new FormControl(null),
  SUGAR: new FormControl(null),
  UNIT_ID: new FormControl(null),
  UPDATE_DATE: new FormControl(null),
  UPDATE_USER_ACCOUNT_ID: new FormControl(null),
  UPDATE_USER_NAME: new FormControl(null),

  QUANTITY_UNIT: new FormControl(null),
  REMARK: new FormControl(null),
  QUANTITY: new FormControl(null),
  PRODUCT_DESC: new FormControl(null),
  SIZES_TEMP: new FormControl(null),//CTs
  IS_DOMESTIC_NAME: new FormControl(null)//CTs
}
