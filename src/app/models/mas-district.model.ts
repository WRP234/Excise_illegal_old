import { MasSubdistrictModel } from './mas-subdistrict.model';

export interface MasDistrictModel {
    DistrictCode: string;
    DistrictNameTH: string;
    DistrictNameEN: string;
    ProvinceCode: string;
    OfficeCode: string;
    RdbCode: string;
    IsActive: number;
    EventDateTime: Date,
    MasSubDistrict: MasSubdistrictModel[]
}