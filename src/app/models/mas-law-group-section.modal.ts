
interface MasLawGroupSubsectionCollection {
    SubSectionID: number;
    SubSectionNo: number;
    SubSectionType: string;
    SubSectionDesc: string;
    IsActive: number;
    SectionNo: number;
}

export interface MasLawGroupSectionModel {
    SectionNo: number;
    SectionName: string;
    SectionDesc1: string;
    IsActive: number;
    MasLawGroupSubsectionCollection: MasLawGroupSubsectionCollection[],
    MasLawGroupSubsectionRuleCollection: any[],
    LawGroupID: number;
    SectionDesc2: string;
    SectionDesc3: string;
    GuiltBaseID: number;

    IsChecked: boolean;
    RowId: number;
}

