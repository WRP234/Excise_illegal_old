import { GetIsLawsuitComplate } from "app/pages/puritycerts/entities/is_lawsuit_complate";

export class DropDown {
    public value: string;
    public text: string;
}

export const VISATypes: DropDown[] = [
    {
        value: '1',
        text: 'ประเภทคนเดินทางผ่านราชอาณาจักร (Transit Visa)'
    }, {
        value: '2',
        text: 'ประเภทนักท่องเที่ยว (Tourist Visa)'
    }, {
        value: '3',
        text: 'ประเภทคนอยู่ชั่วคราว (Non-Immigrant Visa)'
    }, {
        value: '4',
        text: 'ประเภททูต (Diplomatic Visa)'
    }, {
        value: '5',
        text: 'ประเภทราชการ (Official Visa)'
    }, {
        value: '6',
        text: 'ประเภทอัธยาศัยไมตรี (Courtesy Visa)'
    }
];

export const BloodTypes: DropDown[] = [
    {
        value: 'O',
        text: 'O'
    }, {
        value: 'A',
        text: 'A'
    }, {
        value: 'B',
        text: 'B'
    }, {
        value: 'AB',
        text: 'AB'
    }
]
export const EntityTypes_NEW: DropDown[] = [

    {
        value: '2',
        text: 'คนไทย'
    }, {
        value: '1',
        text: 'คนต่างชาติ'
    }, {
        value: '0',
        text: 'ผู้ประกอบการ'
    },
]

export const EntityTypes: DropDown[] = [
    {
        value: '1',
        text: 'บุคคลธรรมดา'
    }, {
        value: '2',
        text: 'นิติบุคคล'
    }
]

export const LawbreakerTypes: DropDown[] = [
    {
        value: '0',
        text: 'คนต่างชาติ'
    }, {
        value: '1',
        text: 'คนไทย'
    }
]

export const LawbreakerTypes_New: any[] = [
    {
        value: '0',
        text: 'คนต่างชาติ',
        selected: false
    }, {
        value: '1',
        text: 'คนไทย',
        selected: false
    }, {
        value: '2',
        text: 'ผู้ประกอบการ',
        selected: false
    }
]

export const GenderTypes: DropDown[] = [
    {
        value: 'M',
        text: 'ชาย'
    }, {
        value: 'F',
        text: 'หญิง'
    }
]
export const GenderTypes_ph2 = [
    {
        value: 0,
        text: 'ไม่ระบุ'
    },
    {
        value: 1,
        text: 'ชาย'
    }, {
        value: 2,
        text: 'หญิง'
    }
]

export const ContributorType: DropDown[] = [
    { value: '6', text: 'ผู้กล่าวหา' },
    { value: '7', text: 'ผู้ร่วมจับกุม' }
]

export const ContributorInvestType: DropDown[] = [
    { value: '1', text: 'ผู้สั่งการ' },
    { value: '2', text: 'ผู้ดูแลการสืบสวน' },
    { value: '3', text: 'ผู้ร่วมทำการสืบสวน' },
    { value: '4', text: 'ผู้บังคับบัญชา' }
]

export const MaritalStatuType: DropDown[] = [
    {
        value: '1',
        text: 'โสด'
    }, {
        value: '2',
        text: 'สมรส'
    }, {
        value: '3',
        text: 'หย่าร้าง'
    }, {
        value: '4',
        text: 'หม้าย'
    },
]

export const ValueofNews: DropDown[] = [
    {
        value: '1',
        text: 'ที่ผ่านมาเชื่อมั่นได้อย่างสมบูรณ์'
    }, {
        value: '2',
        text: 'ที่อ่านมาเชื่อถือได้เป็นส่วนใหญ่'
    }, {
        value: '3',
        text: 'ที่ผ่านมาเชื่อถือไม่ได้เป็นส่วนใหญ่'
    }, {
        value: '4',
        text: 'ไม่สามารถตัดสินได้'
    }
]

export const CostofNews: DropDown[] = [
    {
        value: '1',
        text: 'รู้ว่าเป็นความจริงโดยปราศจากข้อสงสัย'
    }, {
        value: '2',
        text: 'ข่าวเป็นที่รู้จากแหล่งแต่ยังไม่ได้รายงานให้เจ้าหน้าที่'
    }, {
        value: '3',
        text: 'ข่าวไม่ได้เป็นที่รู้จักจากแหล่งแต่รู้มาจากผู้อื่นและได้มีการบันทึกไว้แล้ว'
    }, {
        value: '4',
        text: 'ไม่สามารถตัดสินได้'
    }
]

export const MaritalStatus: DropDown[] = [
    {
        value: '1',
        text: 'โสด'
    }, {
        value: '2',
        text: 'สมรส'
    }, {
        value: '3',
        text: 'หย่าร้าง'
    }, {
        value: '4',
        text: 'หม้าย'
    }, {
        value: '5',
        text: 'แยกกันอยู่'
    }
]

export const MaritalStatus_ph2 = [
    {
        value: 0,
        text: 'โสด'
    }, {
        value: 1,
        text: 'สมรส'
    }, {
        value: 2,
        text: 'หย่าร้าง'
    }, {
        value: 3,
        text: 'หม้าย'
    }
]