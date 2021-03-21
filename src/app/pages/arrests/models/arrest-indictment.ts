import { Types } from './arrest';
import { ArrestLawbreaker } from './arrest-lawbreaker';

export interface ArrestIndictment {
    INDICTMENT_ID?: number;
    ARREST_ID?: number;
    GUILTBASE_ID?: number;
    FINE_ESTIMATE?: number;
    IS_LAWSUIT_COMPLETE?: number;
    IS_ACTIVE?: number;
    GUILTBASE_NAME: string;
    FINE: string;
    IS_PROVE?: number;
    IS_COMPARE?: number;
    SUBSECTION_NAME: string;
    SUBSECTION_DESC: string;
    SECTION_NAME: string;
    PENALTY_DESC: string;
    // ArrestIndictmentProduct?: ArrestIndictmentProduct[]
    ArrestIndictmentDetail?: ArrestIndictmentDetail[]
}

export interface ArrestIndictmentupdByCon {
    INDICTMENT_ID: number;
    ARREST_ID: number;
    GUILTBASE_ID: number;
    FINE_ESTIMATE: number;
    IS_LAWSUIT_COMPLETE: number;
    IS_ACTIVE: number;
}

export interface ArrestIndictmentDetail {
    INDICTMENT_DETAIL_ID?: number;
    INDICTMENT_ID?: number;
    LAWBREAKER_ID?: number;
    FINE_ESTIMATE: number;
    ArrestLawbreaker?: ArrestLawbreaker;
    ArrestIndictmentProduct?: ArrestIndictmentProduct[];
    // PERSON_ID?: number;
    IS_ACTIVE?: number;

    // TITLE_NAME_TH: string;
    // TITLE_NAME_EN: string;
    // TITLE_SHORT_NAME_TH: string;
    // TITLE_SHORT_NAME_EN: string;
    // FIRST_NAME: string;
    // MIDDLE_NAME: string;
    // LAST_NAME: string;
    // OTHER_NAME: string;
}

export interface ArrestIndictmentProduct {
    PRODUCT_INDICTMENT_ID?: number;
    PRODUCT_ID?: number;
    INDICTMENT_ID?: number;
    SIZES_UNIT_ID?: number;
    QUATITY_UNIT_ID?: number;
    VOLUMN_UNIT_ID?: number;
    SIZES?: number;
    SIZES_UNIT: string;
    QUANTITY?: number;
    QUANTITY_UNIT: string;
    VOLUMN?: any;
    VOLUMN_UNIT: string;
    FINE_ESTIMATE?: number;
    IS_ILLEGAL?: number;
    IS_ACTIVE?: number;
    PRODUCT_DESC: string;
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
    PRODUCT_NAME_DESC?: string;
    PRODUCT_MAPPING_ID?: string;
    PRODUCT_REF_CODE?: string;
}

export interface ArrestIndictmentupdDelete {
    INDICTMENT_ID: number;
}

export interface ArrestIndictmentProductupdDelete {
    PRODUCT_INDICTMENT_ID: number;
}

export interface ArrestIndictmentDetailupdDelete {
    INDICTMENT_DETAIL_ID: number;
}

export const IS_LAWSUIT_COMPLETE: Types[] = [
    { value: 0, text: 'ยังไม่พิจารณา' },
    { value: 1, text: 'พิจารณาแล้ว' },
]

