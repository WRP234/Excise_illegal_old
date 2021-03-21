import { FormGroup, FormControl } from "@angular/forms";
import { BehaviorSubject } from 'rxjs';
import { Input, EventEmitter } from "@angular/core";

export class StepWizardConfig {

    @Input() sectionId: number //: EventEmitter<number>;
    @Input() disabledLine: EventEmitter<boolean>;
    @Input() input = new BehaviorSubject<object>(null);

    stepForm: FormGroup;

    createReqForm() {
        return new FormGroup({
            NOTICE_CODE: new FormControl(""),
            ARREST_CODE: new FormControl(""),
            LAWSUIT_ID: new FormControl(""),
            PROVE_ID: new FormControl(""),
            REVENUE_ID: new FormControl(""),
            COMPARE_ID: new FormControl(""),
            BRIBE_REWARD_ID: new FormControl(""),
        })
    }

    section = [
        { id: 1, name: 'ใบแจ้งความนำจับ', processed: false, proceed_to: false },
        { id: 2, name: 'บันทึกจับกุม (สส 2/39)', processed: false, proceed_to: false },
        { id: 3, name: 'รับคดีคำกล่าวโทษ', processed: false, proceed_to: false },
        { id: 4, name: 'พิสูจน์ของกลาง', processed: false, proceed_to: false },
        { id: 5, name: 'เปรียบเทียบและชำระค่าปรับ', processed: false, proceed_to: false },
        { id: 6, name: 'นำส่งเงินรายได้', processed: false, proceed_to: false },
        { id: 7, name: 'คำร้องขอรับเงินสินบนรางวัล', processed: false, proceed_to: false }
    ]
}