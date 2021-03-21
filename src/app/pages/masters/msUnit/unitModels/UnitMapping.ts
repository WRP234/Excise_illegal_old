import { FormControl } from "@angular/forms";

export const UnitMappingControl = {
    PRODUCT_CATEGORY_CODE: new FormControl(""),
    PRODUCT_GROUP_CODE: new FormControl(""),
    UNIT_CODE: new FormControl(""),
    UNIT_ID: new FormControl(""),
    UNIT_MAPPING_ID: new FormControl(""),
    UNIT_NAME_EN: new FormControl(""),
    UNIT_NAME_TH: new FormControl(""),
    UNIT_SHORT_NAME: new FormControl(""),
    USED_FOR: new FormControl(""),
    IS_ACTIVE: new FormControl(1),

    //customs
    IsNewItem: new FormControl(false),
}