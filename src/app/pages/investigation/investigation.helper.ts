import swal from "sweetalert2"
import { FormGroup } from "@angular/forms";

export class InvestigationHelper {

    public staffCode = localStorage.getItem('staffCode');
    public officeCode = localStorage.getItem("officeCode");

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

    numericOnly(event): boolean {
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
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

    public getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    public getDisLessthanCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear() - 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
            end: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }
}