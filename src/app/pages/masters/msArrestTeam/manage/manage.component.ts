import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../masters.service';
import { MatAutocomplete } from '@angular/material';
import * as formatDate from '../../../../config/dateFormat';
import { Message } from '../../../../config/message';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { toLocalShort, compareDate, setZeroHours, setDateMyDatepicker, getDateMyDatepicker } from '../../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import swal from 'sweetalert2';
import { pagination } from '../../../../config/pagination';
import { async } from '../../../../../../node_modules/@types/q';
import { MastersConfig } from '../../masters.config';
import { Observable, BehaviorSubject } from 'rxjs/';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html'
})
// , OnInit, OnDestroy
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    showDataList = [];
    dataList = [];
    STAFF_LIST = [];
    STAFF_MODEL: any;
    STAFF_NAME: string;
    STAFF_ID: string;
    isRequired: boolean | false;

    TEAM_ID: string;
    TEAM_CODE: string;
    TEAM_NAME: string;
    COMMAND_NO: string;
    COMMAND_NO_YEAR: any;
    COMMAND_DATE: any;
    COMMAND_CANCEL_DATE: any;
    PATROL_ID: string;
    EFFECTIVE_DATE: any;
    EXPIRE_DATE: any;
    STAFF_CODE: string;
    STAFF_POS_NAME: string;
    STAFF_OFFICE_NAME: string;
    MasArrestTeamDetail = [];

    isReq_teamName = new BehaviorSubject<boolean>(false);
    isReq_patrolId = new BehaviorSubject<boolean>(false);
    isReq_staffName = new BehaviorSubject<boolean>(false);
    isReq_commandNo = new BehaviorSubject<boolean>(false);
    isReq_commandNoYear = new BehaviorSubject<boolean>(false);
    isReq_commandDate = new BehaviorSubject<boolean>(false);
    isReq_commandCancelDate = new BehaviorSubject<boolean>(false);
    isReq_effectiveDate = new BehaviorSubject<boolean>(false);
    isReq_expDate = new BehaviorSubject<boolean>(false);


    oParam: any;

    // ----- Model ------ //
    @ViewChild('staffModal') staffModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private router: Router
    ) {
        super();
    }

    async ngOnInit() {
        this.preloader.setShowPreloader(true);
        this.active_Route();

        this.COMMAND_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.COMMAND_CANCEL_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        await this.getStaff();

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.TEAM_ID = "Auto Generate";
            this.preloader.setShowPreloader(false);
        }
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];

            switch (this.mode) {
                case 'C':
                    // set false
                    this.PrintButton.next(false);
                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                    this.showEditField = false;
                    // set true
                    this.SaveButton.next(true);
                    this.CancelButton.next(true);
                    break;

                case 'R':
                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);
                    this.PrintButton.next(false);

                    // set true  
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;

                    if (p['code']) {
                        this.TEAM_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            ARREST_TERM_ID: this.TEAM_ID
        }

        this.MasService.getByKeyword("MasArrestTeamgetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                // this.COURT_CODE = list.RESPONSE_DATA[0].COURT_CODE;
                // this.COURT_NAME = list.RESPONSE_DATA[0].COURT_NAME;
                // this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;

                this.preloader.setShowPreloader(false);
            } else {
                swal('', "พบปัญหาที่ API MasArrestTeamgetByCon", 'error');
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msArrestTeam/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('',"API MasArrestTeamgetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.STAFF_CODE == "") {
            this.STAFF_CODE = "";
            this.STAFF_CODE = null;
        }

        if (this.TEAM_NAME == null || this.TEAM_NAME == undefined || this.TEAM_NAME == "") {
            this.isReq_teamName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อทีม'", 'warning');

            return false;
        }

        if (this.COMMAND_NO == null || this.COMMAND_NO == undefined || this.COMMAND_NO == "") {
            this.isReq_commandNo.next(true);
            swal('', "กรุณาระบุข้อมูล 'หนังสือแต่งตั้งเลขที่'", 'warning');

            return false;
        }

        if (this.COMMAND_NO_YEAR == null || this.COMMAND_NO_YEAR == undefined || this.COMMAND_NO_YEAR == "") {
            this.isReq_commandNoYear.next(true);
            swal('', "กรุณาระบุข้อมูล 'ปี'", 'warning');

            return false;
        }

        if (this.COMMAND_DATE == null || this.COMMAND_DATE == undefined || this.COMMAND_DATE == "") {
            this.isReq_commandDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่ปฏิบัติหน้าที่เริ่มต้น'", 'warning');

            return false;
        }

        if (this.COMMAND_CANCEL_DATE == null || this.COMMAND_CANCEL_DATE == undefined || this.COMMAND_CANCEL_DATE == "") {
            this.isReq_commandCancelDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'ถึง'", 'warning');

            return false;
        }

        if (this.PATROL_ID == null || this.PATROL_ID == undefined || this.PATROL_ID == "") {
            this.isReq_patrolId.next(true);
            swal('', "กรุณาระบุข้อมูล 'รหัสสายตรวจ'", 'warning');

            return false;
        }

        if (this.STAFF_CODE == null || this.STAFF_CODE == undefined || this.STAFF_CODE == "") {
            this.isReq_staffName.next(true);
            swal('', "กรุณาระบุข้อมูล 'หัวหน้าฝ่าย'", 'warning');

            return false;
        }

        if (this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined || this.EFFECTIVE_DATE == "") {
            this.isReq_effectiveDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่เริ่มคำสั่ง'", 'warning');

            return false;
        }

        if (this.EXPIRE_DATE == null || this.EXPIRE_DATE == undefined || this.EXPIRE_DATE == "") {
            this.isReq_expDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่ยกเลิกคำสั่ง'", 'warning');

            return false;
        }

        if (this.dataList.length == 0) {
            swal('', "กรุณาระบุข้อมูล ผู้จับกุม", 'warning');

            return false;
        }

        if (this.mode === 'C') {
            await this.onIns();
        } else if (this.mode === 'R') {
            await this.onUdp();
        }
    }

    OnEdit() {
        this.showEditField = false;
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.EditButton.next(false);
        this.DeleteButton.next(false);
    }

    OnCancel() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                if (this.mode === 'C') {
                    this.router.navigate(['/msArrestTeam/list']);
                } else if (this.mode === 'R') {
                    this.ShowMasterData();

                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);
                    this.PrintButton.next(false);

                    // set true  
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;
                }
            }
        });
    }

    OnDelete() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.oParam = {
                    TEAM_ID: this.TEAM_ID
                }
                
                this.MasService.MasDelAll("MasArrestTeamupdDelete", this.oParam).then(async IsSuccess => {
                    if (IsSuccess) {
                        //this.ShowAlertSuccess(Message.saveComplete);
                        this.router.navigate(['/msArrestTeam/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }

    setData() {
        this.TEAM_ID = `${this.TEAM_ID == "Auto Generate" ? "" : this.TEAM_ID}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate, CommandDate, cvCommandDate, commandCancelDate, cvcommandCancelDate;

        EffDate = this.EFFECTIVE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day;
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day;
        }

        CommandDate = this.COMMAND_DATE.date;
        if (CommandDate != undefined) {
            cvCommandDate = CommandDate.year + '-' + CommandDate.month + '-' + CommandDate.day;
        }

        commandCancelDate = this.COMMAND_CANCEL_DATE.date;
        if (commandCancelDate != undefined) {
            cvcommandCancelDate = commandCancelDate.year + '-' + commandCancelDate.month + '-' + commandCancelDate.day;
        }

        this.oParam = {
            TEAM_ID: this.TEAM_ID,
            TEAM_CODE: this.TEAM_CODE,
            TEAM_NAME: this.TEAM_NAME,
            COMMAND_NO: this.COMMAND_NO,
            COMMAND_NO_YEAR: this.COMMAND_NO_YEAR,
            COMMAND_DATE: setZeroHours(cvCommandDate),
            COMMAND_CANCEL_DATE: setZeroHours(cvcommandCancelDate),
            EFFECTIVE_DATE: setZeroHours(cvEffDate),
            EXPIRE_DATE: setZeroHours(cvExpDate),
            PATROL_ID: this.PATROL_ID,
            IS_ACTIVE: 1,
            MasArrestTeamDetail: []
        }

        this.MasArrestTeamDetail.push(this.STAFF_MODEL);

        this.dataList.map(m => {
            this.MasArrestTeamDetail.push(m);
        });

        this.oParam.MasArrestTeamDetail = this.MasArrestTeamDetail;
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasArrestTeaminsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.TEAM_ID = item.RESPONSE_DATA.TEAM_ID;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msArrestTeam/manage/R/${this.TEAM_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasCourtupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');

                if (this.oParam.IS_ACTIVE == "1") {
                    this.onComplete();
                    await this.ShowMasterData();
                } else {
                    this.router.navigate(['/msArrestTeam/list']);
                }

                this.preloader.setShowPreloader(false);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    onComplete() {
        this.showEditField = true;
        this.EditButton.next(true);
        this.DeleteButton.next(true);

        this.CancelButton.next(false);
        this.SaveButton.next(false);
    }

    AddStaff() {
        this.modal = this.ngbModel.open(this.staffModel, { size: 'lg', centered: true });
    }

    GetDataModal(event) {
        console.log(event);

        this.showDataList = [];

        event.map(m => {
            let isStaff = this.dataList.filter(x => x.STAFF_ID === m.STAFF_ID)

            m.TeamSeq = this.dataList.length + 1;
            m.TEAM_ID = "";
            m.CONTRIBUTOR_ID = "55";

            if (isStaff.length == 0) {
                this.dataList.push(m);
            }
        });

        // set total record
        this.paginage.TotalItems = this.dataList.length;
        this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
        this.modal.dismiss();
    }

    DelArrestTeam(i: number){
        swal({
            title: '',
            text: 'ยืนยันการลบข้อมูลผู้จับกุม ใช่หรือไม่ ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                var aIndex;
                aIndex = this.getIndexOf(this.dataList, i, "TeamSeq");

                if (aIndex != -1) {
                    this.dataList.splice(aIndex, 1);

                    this.paginage.TotalItems = this.dataList.length;
                    this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
                }
            }
        })
    }
    
    getIndexOf(arr, val, prop) {
        var l = arr.length,
            k = 0;
        for (k = 0; k < l; k = k + 1) {
            if (arr[k][prop] == val) {
                return k;
            }
        }
        return -1;
    }

    async pageChanges(event) {
        this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    }

    // **********************************
    // -------------- Staff -------------
    // **********************************
    searchSubDistrict = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.STAFF_LIST
                    .filter(v => v.NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter = (x: { NAME: string }) => x.NAME;

    selectItemStaff(event) {
        this.STAFF_CODE = event.item.STAFF_ID;
        this.STAFF_POS_NAME = event.item.OPREATION_POS_NAME;
        this.STAFF_OFFICE_NAME = event.item.OPERATION_OFFICE_SHORT_NAME;
    }

    inputStaff() {
        if (this.STAFF_MODEL == undefined || this.STAFF_MODEL == "") {
            this.STAFF_CODE = "";
            this.STAFF_POS_NAME = "";
            this.STAFF_OFFICE_NAME = "";
        }
    }

    async getStaff() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "",
            STAFF_ID: ""
        }

        this.MasService.getByKeyword("MasStaffgetByCon", paramsOther).then(list => {
            if (list.SUCCESS) {
                this.STAFF_LIST = list.RESPONSE_DATA;

                this.STAFF_LIST.map(m => {
                    m.NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                    m.CONTRIBUTOR_ID = "54";
                });

                this.preloader.setShowPreloader(false);
            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        });
    }

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }
}
