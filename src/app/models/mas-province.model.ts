import { MasDistrictModel } from './mas-district.model';

export interface MasProvinceModel {
    ProvinceCode: string;
    ProvinceNameTH: string;
    ProvinceNameEN: string;
    IsActive: number;
    EventDatetime: Date,
    MasDistrict: MasDistrictModel[]
}