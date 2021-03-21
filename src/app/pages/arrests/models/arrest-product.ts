import { Types } from "./arrest";

export interface ArrestProduct {
    PRODUCT_ID?: number;
    ARREST_ID?: number;
    PRODUCT_MAPPING_ID?: number;
    PRODUCT_CODE: string;
    PRODUCT_REF_CODE: string;
    PRODUCT_GROUP_ID?: number;
    PRODUCT_CATEGORY_ID?: number;
    PRODUCT_TYPE_ID?: number;
    PRODUCT_SUBTYPE_ID?: number;
    PRODUCT_SUBSETTYPE_ID?: number;
    PRODUCT_BRAND_ID?: number;
    PRODUCT_SUBBRAND_ID?: number;
    PRODUCT_MODEL_ID?: number;
    PRODUCT_TAXDETAIL_ID?: number;
    SIZES_UNIT_ID?: number;
    QUATITY_UNIT_ID?: number;
    VOLUMN_UNIT_ID?: number;
    PRODUCT_GROUP_CODE: string;
    PRODUCT_GROUP_NAME: string;
    PRODUCT_CATEGORY_CODE: string;
    PRODUCT_CATEGORY_NAME: string;
    PRODUCT_TYPE_CODE: string;
    PRODUCT_TYPE_NAME: string;
    PRODUCT_SUBTYPE_CODE: string;
    PRODUCT_SUBTYPE_NAME: string;
    PRODUCT_SUBSETTYPE_CODE: string;
    PRODUCT_SUBSETTYPE_NAME: string;
    PRODUCT_BRAND_CODE: string;
    PRODUCT_BRAND_NAME_TH: string;
    PRODUCT_BRAND_NAME_EN: string;
    PRODUCT_SUBBRAND_CODE: string;
    PRODUCT_SUBBRAND_NAME_TH: string;
    PRODUCT_SUBBRAND_NAME_EN: string;
    PRODUCT_MODEL_CODE: string;
    PRODUCT_MODEL_NAME_TH: string;
    PRODUCT_MODEL_NAME_EN: string;
    PRODUCT_NAME_DESC: string;
    IS_TAX_VALUE?: number;
    TAX_VALUE?: number;
    IS_TAX_VOLUMN?: number;
    TAX_VOLUMN?: number;
    TAX_VOLUMN_UNIT: string;
    LICENSE_PLATE: string;
    ENGINE_NO: string;
    CHASSIS_NO: string;
    PRODUCT_DESC: string;
    SUGAR?: string;
    CO2?: string;
    DEGREE?: string;
    PRICE?: number;
    SIZES?: number;
    SIZES_UNIT: string;
    QUANTITY?: string;
    QUANTITY_UNIT: string;
    VOLUMN?: any;
    VOLUMN_UNIT: string;
    REMARK: string;
    IS_DOMESTIC?: number;
    IS_ILLEGAL?: number;
    IS_ACTIVE?: number;
    ArrestProductMapping: ArrestProductMapping[]

    CATEGORY_CODE: string;
    PRODUCT_NAME: string;
    COMPANY?: string,
    EFFECTIVE_DATE?: string,
    IS_SYSTEM?: number,
    IS_USING?: number
}

export interface ArrestProductMapping {
    PRODUCT_MAPPING_ID?: number;
    PRODUCT_ID?: number;
    PRODUCT_MAPPING_REF_ID?: number;
    PRODUCT_CODE: string;
    PRODUCT_REF_CODE: string;
    PRODUCT_GROUP_ID?: number;
    PRODUCT_CATEGORY_ID?: number;
    PRODUCT_TYPE_ID?: number;
    PRODUCT_SUBTYPE_ID?: number;
    PRODUCT_SUBSETTYPE_ID?: number;
    PRODUCT_BRAND_ID?: number;
    PRODUCT_SUBBRAND_ID?: number;
    PRODUCT_MODEL_ID?: number;
    PRODUCT_TAXDETAIL_ID?: number;
    SIZES_UNIT_ID?: number;
    QUATITY_UNIT_ID?: number;
    VOLUMN_UNIT_ID?: number;
    PRODUCT_GROUP_CODE: string;
    PRODUCT_GROUP_NAME: string;
    PRODUCT_CATEGORY_CODE: string;
    PRODUCT_CATEGORY_NAME: string;
    PRODUCT_TYPE_CODE: string;
    PRODUCT_TYPE_NAME: string;
    PRODUCT_SUBTYPE_CODE: string;
    PRODUCT_SUBTYPE_NAME: string;
    PRODUCT_SUBSETTYPE_CODE: string;
    PRODUCT_SUBSETTYPE_NAME: string;
    PRODUCT_BRAND_CODE: string;
    PRODUCT_BRAND_NAME_TH: string;
    PRODUCT_BRAND_NAME_EN: string;
    PRODUCT_SUBBRAND_CODE: string;
    PRODUCT_SUBBRAND_NAME_TH: string;
    PRODUCT_SUBBRAND_NAME_EN: string;
    PRODUCT_MODEL_CODE: string;
    PRODUCT_MODEL_NAME_TH: string;
    PRODUCT_MODEL_NAME_EN: string;
    IS_TAX_VALUE?: number;
    TAX_VALUE?: number;
    IS_TAX_VOLUMN?: number;
    TAX_VOLUMN?: number;
    TAX_VOLUMN_UNIT: string;
    LICENSE_PLATE: string;
    ENGINE_NO: string;
    CHASSIS_NO: string;
    PRODUCT_DESC: string;
    SUGAR?: number;
    CO2?: number;
    DEGREE?: number;
    PRICE?: number;
    SIZES?: number;
    SIZES_UNIT: string;
    QUANTITY?: number;
    QUANTITY_UNIT: string;
    VOLUMN?: number;
    VOLUMN_UNIT: string;
    REMARK: string;
    PRODUCT_RESULT: string;
    SCIENCE_RESULT_DESC: string;
    VAT?: number;
    IS_DOMESTIC?: number;
    IS_ILLEGAL?: number;
    IS_SCIENCE?: number;
    IS_ACTIVE?: number;
}

export interface ArrestProductupdDelete {
    PRODUCT_ID: number;
}

export interface ArrestProductId {
    PRODUCT_ID: number;
}

export const IS_TAX_VOLUMN: Types[] = [
    { value: 0, text: 'ใช้' },
    { value: 1, text: 'ไม่ใช้' }
]

export const IS_TAX_VALUE: Types[] = IS_TAX_VOLUMN;

export const IS_SCIENCE: Types[] = IS_TAX_VOLUMN;

export const IS_DOMESTIC: Types[] = [
    { value: 0, text: 'ไม่ระบุ' },
    { value: 1, text: 'ในประเทศ' },
    { value: 2, text: 'ต่างประเทศ' },
]

export const IS_ILLEGAL: Types[] = [
    { value: 0, text: 'ชอบด้วยกฎหมาย' },
    { value: 1, text: 'มิชอบด้วยกฎหมาย' },
]