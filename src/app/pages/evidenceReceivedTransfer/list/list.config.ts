import { BehaviorSubject } from "rxjs";
import { pagination } from '../../../config/pagination';
import { ReceivedTransferHelper } from '../receivedTransfer.helper';

export class ListConfig extends ReceivedTransferHelper {

    evidenceInList = new Array<any>();
    evidenceIn = new Array<any>();

    public advSearch: BehaviorSubject<Boolean>;

    public paginage = pagination;
    public dateFromOption = Object.assign({}, this.myDatePickerOptions);

    public IS_RECEIPE: any[] = [
        { value: 1, name: 'ตรวจรับแล้ว' },
        { value: 2, name: 'ยังไม่ตรวจรับ' }
    ]

}