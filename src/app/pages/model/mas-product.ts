export interface IMasProductMapping {
    PRODUCT_MAPPING_ID: number;
    PRODUCT_CODE: string;
    PRODUCT_REF_CODE: string;
    PRODUCT_GROUP_ID: number;
    PRODUCT_CATEGORY_ID: number;
    PRODUCT_TYPE_ID: number;
    PRODUCT_SUBTYPE_ID: number;
    PRODUCT_SUBSETTYPE_ID: number;
    PRODUCT_BRAND_ID: number;
    PRODUCT_SUBBRAND_ID: number;
    PRODUCT_MODEL_ID: number;
    PRODUCT_TAXDETAIL_ID: number;
    UNIT_ID: number;
    SIZES: number;
    SIZES_UNIT: string;
    DEGREE: number;
    SUGAR: number;
    CO2: number;
    PRICE: number;
    IS_DOMESTIC: number;
    IS_ACTIVE: number;
    CREATE_USER_ACCOUNT_ID: number;
    CREATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    PRODUCT_GROUP_NAME: string;
    PRODUCT_CATEGORY_NAME: string;
    PRODUCT_TYPE_NAME: string;
    PRODUCT_SUBTYPE_NAME: string;
    PRODUCT_SUBSETTYPE_NAME: string;
    PRODUCT_BRAND_NAME_TH: string;
    PRODUCT_BRAND_NAME_EN: string;
    PRODUCT_SUBBRAND_NAME_TH: string;
    PRODUCT_SUBBRAND_NAME_EN: string;
    PRODUCT_MODEL_NAME_TH: string;
    PRODUCT_MODEL_NAME_EN: string;
    CREATE_USER_NAME: string;
    UPDATE_USER_NAME: string;
}

export interface IMasProductMappinggetByConAdv {
    PRODUCT_GROUP_NAME: string;
    PRODUCT_CATEGORY_NAME: string;
    PRODUCT_TYPE_NAME: string;
    PRODUCT_SUBTYPE_NAME: string;
    PRODUCT_SUBSETTYPE_NAME: string;
    PRODUCT_BRAND_NAME: string;
    PRODUCT_SUBBRAND_NAME: string;
    PRODUCT_MODEL_NAME_TH: string
    SIZES: number;
    SIZES_UNIT: string;
}

export interface IMasProductGroup {
    PRODUCT_GROUP_ID: number;
    PRODUCT_GROUP_CODE: string
    PRODUCT_GROUP_NAME: string
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductGroupgetByCon {
    TEXT_SEARCH: string;
    PRODUCT_GROUP_ID?: number;
}

export interface IMasProductCategory {
    PRODUCT_CATEGORY_ID: number;
    PRODUCT_GROUP_ID: number;
    PRODUCT_CATEGORY_CODE: string;
    PRODUCT_CATEGORY_NAME: string;
    IS_TAX: number;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductCategorygetByCon {
    TEXT_SEARCH: string;
    PRODUCT_GROUP_ID?: number;
    PRODUCT_CATEGORY_ID?: number;
}

export interface IMasProductTypegetByCon {
    TEXT_SEARCH: string;
    PRODUCT_CATEGORY_ID?: number;
    PRODUCT_TYPE_ID?: number;
}

export interface IMasProductType {
    PRODUCT_TYPE_ID: number;
    PRODUCT_CATEGORY_ID: number;
    PRODUCT_TYPE_CODE: string;
    PRODUCT_TYPE_NAME: string;
    IS_TAX: number;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductSubType {
    PRODUCT_SUBTYPE_ID: number;
    PRODUCT_TYPE_ID: number;
    PRODUCT_SUBTYPE_CODE: string;
    PRODUCT_SUBTYPE_NAME: string;
    IS_TAX: number;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductSubTypegetByCon {
    TEXT_SEARCH: string;
    PRODUCT_TYPE_ID?: number;
    PRODUCT_SUBTYPE_ID?: number;
}

export interface IMasProductSubSetType {
    PRODUCT_SUBSETTYPE_ID: number;
    PRODUCT_SUBTYPE_ID: number;
    PRODUCT_SUBSETTYPE_CODE: string;
    PRODUCT_SUBSETTYPE_NAME: string;
    IS_TAX: number;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductSubSetTypegetByCon {
    TEXT_SEARCH: string;
    PRODUCT_SUBTYPE_ID?: number;
    PRODUCT_SUBSETTYPE_ID?: number;
}

export interface IMasProductBrand {
    PRODUCT_BRAND_ID: number;
    PRODUCT_BRAND_CODE: string;
    PRODUCT_BRAND_NAME_TH: string;
    PRODUCT_BRAND_NAME_EN: string;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductBrandgetByCon {
    TEXT_SEARCH: string;
    PRODUCT_GROUP_ID?: number;
    PRODUCT_CATEGORY_ID?: number;
    PRODUCT_TYPE_ID?: number;
    PRODUCT_SUBTYPE_ID?: number;
    PRODUCT_SUBSETTYPE_ID?: number;
    PRODUCT_BRAND_ID?: number;
}

export interface IMasProductSubBrand {
    PRODUCT_SUBBRAND_ID: number;
    PRODUCT_SUBBRAND_CODE: string;
    PRODUCT_SUBBRAND_NAME_TH: string;
    PRODUCT_SUBBRAND_NAME_EN: string;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductSubBrandgetByCon {
    TEXT_SEARCH: string;
    PRODUCT_BRAND_ID?: number;
    PRODUCT_SUBBRAND_ID?: number;
}

export interface IMasProductModel {
    PRODUCT_MODEL_ID: number;
    PRODUCT_MODEL_CODE: string;
    PRODUCT_MODEL_NAME_TH: string;
    PRODUCT_MODEL_NAME_EN: string;
    IS_ACTIVE: number;
    CREATE_DATE: Date;
    CREATE_USER_ACCOUNT_ID: number;
    UPDATE_DATE: Date;
    UPDATE_USER_ACCOUNT_ID: number;
}

export interface IMasProductModelgetByCon {
    TEXT_SEARCH: string;
    PRODUCT_BRAND_ID?: number;
    PRODUCT_SUBBRAND_ID?: number;
    PRODUCT_MODEL_ID?: number;
}


export const IMasProductMappingMock: any[] = [
    {
        PRODUCT_MAPPING_ID: 1,
        PRODUCT_CODE: '1234 aa',
        PRODUCT_REF_CODE: '1234 aa',
        PRODUCT_GROUP_ID: 1,
        PRODUCT_CATEGORY_ID: 1,
        PRODUCT_TYPE_ID: 1,
        PRODUCT_SUBTYPE_ID: 1,
        PRODUCT_SUBSETTYPE_ID: 1,
        PRODUCT_BRAND_ID: 1,
        PRODUCT_SUBBRAND_ID: 1,
        PRODUCT_MODEL_ID: 1,
        PRODUCT_TAXDETAIL_ID: 1,
        UNIT_ID: 1,
        SIZES: 1,
        SIZES_UNIT: '1234 aa',
        DEGREE: 1,
        SUGAR: 1,
        CO2: 1,
        PRICE: 1,
        IS_DOMESTIC: 1,
        IS_ACTIVE: 1,
        CREATE_USER_ACCOUNT_ID: 1,
        CREATE_DATE: '2019-05-11',
        UPDATE_USER_ACCOUNT_ID: 1,
        UPDATE_DATE: '2019-05-11',
        PRODUCT_GROUP_NAME: '1234 aa',
        PRODUCT_CATEGORY_NAME: '1234 aa',
        PRODUCT_TYPE_NAME: '1234 aa',
        PRODUCT_SUBTYPE_NAME: '1234 aa',
        PRODUCT_SUBSETTYPE_NAME: '1234 aa',
        PRODUCT_BRAND_NAME_TH: '1234 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        PRODUCT_BRAND_NAME_EN: '1234 aa',
        PRODUCT_SUBBRAND_NAME_TH: '1234 aa',
        PRODUCT_SUBBRAND_NAME_EN: '1234 aa',
        PRODUCT_MODEL_NAME_TH: '1234 aa',
        PRODUCT_MODEL_NAME_EN: '1234 aa',
        CREATE_USER_NAME: '1234 aa',
        UPDATE_USER_NAME: '1234 aa',
    },
    {
        PRODUCT_MAPPING_ID: 2,
        PRODUCT_CODE: '1234 bb',
        PRODUCT_REF_CODE: '1234 bb',
        PRODUCT_GROUP_ID: 2,
        PRODUCT_CATEGORY_ID: 2,
        PRODUCT_TYPE_ID: 2,
        PRODUCT_SUBTYPE_ID: 2,
        PRODUCT_SUBSETTYPE_ID: 2,
        PRODUCT_BRAND_ID: 2,
        PRODUCT_SUBBRAND_ID: 2,
        PRODUCT_MODEL_ID: 2,
        PRODUCT_TAXDETAIL_ID: 2,
        UNIT_ID: 2,
        SIZES: 2,
        SIZES_UNIT: '1234 bb',
        DEGREE: 2,
        SUGAR: 2,
        CO2: 2,
        PRICE: 2,
        IS_DOMESTIC: 2,
        IS_ACTIVE: 1,
        CREATE_USER_ACCOUNT_ID: 2,
        CREATE_DATE: '2019-05-11',
        UPDATE_USER_ACCOUNT_ID: 2,
        UPDATE_DATE: '2019-05-11',
        PRODUCT_GROUP_NAME: '1234 bb',
        PRODUCT_CATEGORY_NAME: '1234 bb',
        PRODUCT_TYPE_NAME: '1234 bb',
        PRODUCT_SUBTYPE_NAME: '1234 bb',
        PRODUCT_SUBSETTYPE_NAME: '1234 bb',
        PRODUCT_BRAND_NAME_TH: '1234 bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        PRODUCT_BRAND_NAME_EN: '1234 bb',
        PRODUCT_SUBBRAND_NAME_TH: '1234 bb',
        PRODUCT_SUBBRAND_NAME_EN: '1234 bb',
        PRODUCT_MODEL_NAME_TH: '1234 bb',
        PRODUCT_MODEL_NAME_EN: '1234 bb',
        CREATE_USER_NAME: '1234 bb',
        UPDATE_USER_NAME: '1234 bb',
    }
]