import { Mode } from './entities/mode';
import {
    setZero,
    setDateMyDatepicker,
    MyDatePickerOptions,
    toLocalShort,
    getDateMyDatepicker,
    compareDate,
    convertDateForSave,
    toLocalLong
} from '../../config/dateFormat';
import { Message } from '../../config/message';
import swal from 'sweetalert2';
import { IMyOptions } from 'mydatepicker-th';
import { FormGroup } from '@angular/forms';

export class ReceivedTransferHelper {

    // public myDatePickerOptions = MyDatePickerOptions;

    public ModeAction = Mode;

    public today = new Date();

    Message = Message;

    /** local storage */
    public localUserAccountID = localStorage.getItem('UserAccountID');
    public localOfficeCode = localStorage.getItem('officeCode');
    public localOfficeId = localStorage.getItem("officeId") || '1';


    public myDatePickerOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px',
        disableDateRanges: [{
            begin: {
                year: this.today.getFullYear(),
                month: this.today.getMonth() + 1,
                day: this.today.getDate() + 1
            },
            end: {
                year: this.today.getFullYear() + 100,
                month: this.today.getMonth() + 1,
                day: this.today.getDate()
            },
        }]
    };

    public optionsClearDateBtnFalse: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        disableDateRanges: [{
            begin: {
                year: this.today.getFullYear(),
                month: this.today.getMonth() + 1,
                day: this.today.getDate() + 1
            },
            end: {
                year: this.today.getFullYear() + 100,
                month: this.today.getMonth() + 1,
                day: this.today.getDate()
            },
        }]
    };

    getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }


    public setFormatTimeControl(event: any, formControl: string, formGroup: FormGroup) {
        let str = event.target.value;
        let str_unSub = event.target.value;
        let substr: any[] = []
        let mm: string = '';
        let ss: string = '';
        substr = str.split(':');
        mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
        ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);
        const K = event.keyCode;

        if (!/([0-9])$/.test(event.target.value))
            formGroup.controls[formControl].setValue(str_unSub.slice(0, str_unSub.length - 1));

        switch (true) {
            // NumPad 96-105
            case K >= 96 && K <= 105:
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
                break;
            // KeyPad 96-105
            case (K >= 48 && K <= 57):
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
                break;
            // backspace 8
            case K == 8:
                break;
            //delete 46
            case K == 46:
                break;
            default:
                break;
        }
    }

    public filterDuplicate(array: any[], prop: string) {
        return array.filter((v, i, a) => a.map(x => x[prop])
            .indexOf(v[prop]) === i);
    }

    public filterAction = (form: any[], action: string) =>
        form.filter(x => x['ACTION'] === action);

    public DateSorter(Arr: any[] = []) {
        return Arr.sort((a, b) => {
            return <any>new Date(b.EVIDENCE_OUT_DATE).getTime() - <any>new Date(a.EVIDENCE_OUT_DATE).getTime();
        });
    }

    public comma = (i) => i != 0 ? ', ' : '';

    // **********************************
    // -------------- Alert -------------
    // **********************************

    public swalFn(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
        })
    }

    public swalFnMulti(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        })
    }
}