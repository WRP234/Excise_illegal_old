import { IMyOptions } from "mydatepicker-th";
import swal from 'sweetalert2';
import * as moment from 'moment-timezone';
import { getDateMyDatepicker, setZero } from '../../config/dateFormat';
import { Subject, BehaviorSubject } from "rxjs";

export class RevenueHelper {

    public localUserAccountID = localStorage.getItem('UserAccountID');
    public localOfficeId = localStorage.getItem("officeId") || '1';
    public localOfficeCode = localStorage.getItem("officeCode");
    public localStaffCode = localStorage.getItem('staffCode');
    public localOfficeShortName = localStorage.getItem('officeShortName');
    public localStaffInfo = JSON.parse(localStorage.getItem("staffInfo"));

    public getDateMyDatepicker = getDateMyDatepicker;
    public today = new Date();

    public destroy$: Subject<boolean> = new Subject<boolean>();

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

    public RevenueDateOptions: IMyOptions = {
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

    public StaffFormatter = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    public formatter_Office = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;

    public canOfficeSearch(): boolean {
        const OFFICE_CODE_SLICE = this.localOfficeCode.slice(0, 2);
        return OFFICE_CODE_SLICE == '00' ? false : true;
    }

    // searchStaff = (text$: Observable<string>) =>
    //     text$.debounceTime(200)
    //         .map(term => term == '' ? []
    //             : this.STAFF_LIST
    //                 .filter(v => v.NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
    //                 .slice(0, 10)
    //         );

    // formatter = (x: { NAME: string }) => x.NAME;




    // *******************************************
    // --------- Format DateTime & string --------
    // *******************************************
    //#region 
    public getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    public getCurrentTime() {
        // let date = new Date();
        // return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
        return `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`
    }

    public MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`
    }

    public MappingNulNumber(str: string) {
        return `${str == 'null' || str == null ? 0 : str}`
    }
    //#endregion




    // **********************************
    // -------------- Alert -------------
    // **********************************
    //#region 
    public ShowAlertWarning(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    public ShowAlertSuccess(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'success',
            confirmButtonText: 'ตกลง'
        });
    }

    public ShowAlertError(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'error',
            confirmButtonText: 'ตกลง'
        });
    }

    public ShowAlertInfo(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'info',
            confirmButtonText: 'ตกลง'
        });
    }

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
    //#endregion

    public getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    public toDateTZ(date: any) {
        return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms')}`;
    }

    public getRevenueStatusText(REVENUE_STATUS: any) {
        let o = this.REVENUE_STATUS_SELECT.find(f => f.VALUE == REVENUE_STATUS);
        return o ? o.NAME : '';
    }

    public REVENUE_STATUS_SELECT: any[] = [
        { NAME: 'ยังไม่นำส่งเงินรายได้', VALUE: 0 },
        { NAME: 'นำส่งเงินรายได้', VALUE: 1 },
        { NAME: 'ระบบรายได้รับแล้ว', VALUE: 2 },
    ]

    public filterDuplicate(array: any[], prop: string) {
        return array.filter((v, i, a) => a.map(x => x[prop])
            .indexOf(v[prop]) === i);
    }

    public toggleCollapse(event: BehaviorSubject<Boolean>): void {
        if (event.getValue())
            event.next(false);
        else
            event.next(true);
    }

    public isNumberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

}