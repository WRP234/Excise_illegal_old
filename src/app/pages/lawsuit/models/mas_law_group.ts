import { MasLawGroupSection } from "./mas_law_group_section";
import { MasLawGroupSubSection } from "./mas_law_group_subsection";
import { MawLawGroupSubSectionRule } from "./mas_law_group_subsection_rule";
import { MasLawGuitBase } from "./mas_law_guitbase";
import { MasLawPenalty } from "./mas_law_penalty";

export class MasLawGroup {
  public LawGroupID: number;
  public LawGroupNo: string;
  public PartNo: string;
  public PartName: string;
  public IsActive: number;
  public LawGroupName: string;
  public CompareMasLawSection: Array<MasLawGroupSection>;
  public CompareMasLawSubSection: Array<MasLawGroupSubSection>;
  public CompareMasLawSubSectionRule: Array<MawLawGroupSubSectionRule>;
  public CompareMasLawGuiltBase: Array<MasLawGuitBase>;
  public CompareMasLawPenalty: Array<MasLawPenalty>;
}
