import { CompareDetail } from "./compareDetail";
import { CompareStaff } from "./compareStaff";

export class Compare {
    public CompareID?: string;
    public CompareCode?: string;
    public CompareDate?: Date;
    public CompareStationCode?: string;
    public CompareStation?: string;
    public CompareSubdistrictCode?: string;
    public CompareSubdistrict?: string;
    public CompareDistrictCode?: string;
    public CompareDistrict?: string;
    public CompareProvinceCode?: string;
    public CompareProvince?: string;
    public AccuserSubdistrictCode?: string;
    public AccuserSubdistrict?: string;
    public AccuserDistrictCode?: string;
    public AccuserDistrict?: string;
    public AccuserProvinceCode?: string;
    public AccuserProvince?: string;
    public IsOutside?: number;
    public LawsuitID?: string;
    public CompareDetail?: CompareDetail[] ;
    public CompareStaff?: CompareStaff[];
    public ArrestCode?: string;
    public LawsuitNo?: number;
    public ProveReportNo?: number;
    public TitleName?: string;
    public FirstName?: string;
    public LastName?: string;
    public DepartmentName?: string;
    public DepartmentNameTH?: string;
    public DepartmentCode?: string;
}

export class YEAR {
    public value: number;
    public year: string;
    public selected: boolean;
}