import { LawsuitJudgement } from "./lawsuit_judgement";
import { LawsuiteStaff } from "./lawsuit_staff";
import { LawsuitArrestStaff } from "./lawsuit_arreststaff";
import { Type } from "@angular/compiler/src/output/output_ast";
import { FormControl } from "@angular/forms";
export class Lawsuit {

  public RowsId: number;

  public LAWSUIT_ID: number;
  public INDICTMENT_ID: number;
  public OFFICE_ID: number;
  public OFFICE_CODE: number;
  public OFFICE_NAME: string;
  public IS_LAWSUIT: number;
  public REMARK_NOT_LAWSUIT: string;
  public LAWSUIT_NO: number;
  public LAWSUIT_NO_YEAR: string;
  public LAWSUIT_DATE: string;
  public TESTIMONY: string;
  public DELIVERY_DOC_NO_1: string;
  public DELIVERY_DOC_NO_2: string;
  public DELIVERY_DOC_DATE: string;
  public IS_OUTSIDE: number;
  public IS_SEIZE: number;
  public IS_ACTIVE: number;
  public CREATE_DATE: string;
  public CREATE_USER_ACCOUNT_ID: number;
  public UPDATE_DATE: string;
  public UPDATE_USER_ACCOUNT_ID: number;
  public ARREST_CODE: string;
  public OCCURRENCE_DATE: string;
  public LAWSUIT_TYPE: any;
  public LawsuitStaff: Array<LawsuiteStaff>;
  public LawsuitDetail: Array<any>;
  // public RowsId: number;
  // public LawsuitID: number;
  // public ArrestCode: string;
  // public IndictmentID: number;
  // public IsLawsuit: number;
  // public IsLawsuitStatus: string;
  // public ReasonDontLawsuit: string;
  // public LawsuitNo: string;
  // public LawsuitDate: string;
  // public LawsuitTime: string;
  // public LawsuitStationCode: string;
  // public LawsuitStation: string;
  // public IsOutside: number;
  // public AccuserTestimony: string;
  // public LawsuitResult: string;
  // public DeliveryDocNo: string;
  // public DeliveryDate: Date;
  // public IsActive: number;
  // public LawsuitType: number;
  // public LawsuitEnd: number;
  // public LawsuiteStaff: Array<LawsuiteStaff>;
  // public LawsuitArrestStaff: Array<LawsuitArrestStaff>;
  // public LawsuitJudgement: Array<LawsuitJudgement>;
  OccurrenceDate: string;
  OccurrenceTime: string;
  SubSectionType: string;
  GuiltBaseName: string;
  SectionNo: string;
  PenaltyDesc: string;
}

class Types {
  public value: number;
  public text: string;
}

class Dropdow {
  public id: number;
  public name: string;
}

export class Year {
  public value: number;
  public year: string;
  public selected: boolean;
}

export const LawsuitType: Dropdow[] = [
  { id: 1, name: 'เปรียบเทียบปรับ', },
  { id: 0, name: 'ส่งฟ้องศาล' },
  { id: 2, name: 'ส่งพนักงานสอบสวน' }
]

export const LawsuitEnd: any[] = [
  { id: 0, name: 'ศาล', disable: true },
  { id: 1, name: 'กรมสรรพสามิต', disable: false },
  { id: 2, name: 'พนักงานสอบสวน/พนักงานอัยการ', disable: true }
]

export const ContibutorName: any[] = [
  { name: '', position: '', office: '', as: 'ผู้รับคดี' },
  { name: '', position: '', office: '', as: 'พยานคนที่ 1 (คด.1)' },
  { name: '', position: '', office: '', as: 'พยานคนที่ 2 (คด.1)' },
  { name: '', position: '', office: '', as: 'พยาน ส.ส.2/54' },
  { name: '', position: '', office: '', as: 'ผู้บันทึก-อ่าน ส.ส.2/54' }
]

export const PaymentBank: Dropdow[] = [
  { id: 0, name: 'ธนาคารกรุงศรี' },
  { id: 1, name: 'ธนาคารกรุงไทย' },
  { id: 2, name: 'ธนาคารกสิกรไทย' }
]

export const PaymentChannel: Dropdow[] = [
  { id: 1, name: 'เงินสด' },
  { id: 2, name: 'เช็คพาณิชย์' },
  { id: 5, name: 'บัตรเดบิท' },
  { id: 6, name: 'บัตรเครดิต' },
  { id: 8, name: 'โอนเงินอิเล็กทรอนิกส์' }
]

export const PaymentDueUnit: Dropdow[] = [
  { id: 0, name: 'วัน' },
  { id: 1, name: 'สัปดาห์' },
  { id: 2, name: 'เดือน' },
  { id: 3, name: 'ปี' }
]