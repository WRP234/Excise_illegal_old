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
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';

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
    isRequired: boolean | false;

    LAW_GROUP_ID: string;
    LAW_GROUP_NAME: string;
    LAW_GROUP_NO: string;
    PART_NO: string;
    PART_NAME: string;
    EFFECTIVE_DATE: any;
    EXPIRE_DATE: any;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_lawGroupName = new BehaviorSubject<boolean>(false);
    isReq_lawGroupNo = new BehaviorSubject<boolean>(false);
    isReq_partNo = new BehaviorSubject<boolean>(false);
    isReq_partName = new BehaviorSubject<boolean>(false);
    isReq_effectiveDate = new BehaviorSubject<boolean>(false);
    isReq_expDate = new BehaviorSubject<boolean>(false);

    // ----- Model ------ //
    //@ViewChild('printDocModal') printDocModel: ElementRef;

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

        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.LAW_GROUP_ID = "Auto Generate";
            this.chk1 = true;
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
                        this.LAW_GROUP_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            LAW_GROUP_ID: this.LAW_GROUP_ID
        }

        this.MasService.getAPI1111("MasLawGroupgetByCon", paramsOther).then(list => {
            if (list) {
                this.LAW_GROUP_NAME = list.LAW_GROUP_NAME;
                this.LAW_GROUP_NO = list.LAW_GROUP_NO;
                this.PART_NO = list.PART_NO;
                this.PART_NAME = list.PART_NAME;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                if (list.EFFECTIVE_DATE) {
                    var EffDate = list.EFFECTIVE_DATE.toString().split(" ");
                    this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));
                }

                if (list.EXPIRE_DATE) {
                    var ExpDate = list.EXPIRE_DATE.toString().split(" ");
                    this.EXPIRE_DATE = setDateMyDatepicker(new Date(ExpDate[0]));
                }

                this.preloader.setShowPreloader(false);
            } else {
                if (list.SUCCESS == false)
                    swal('', "พบปัญหาที่ API MasLawGroupgetByCon", 'error');

                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msLawGroup/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasLawGroupgetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.LAW_GROUP_NO == null || this.LAW_GROUP_NO == undefined || this.LAW_GROUP_NO == "") {
            this.isReq_lawGroupNo.next(true);
            swal('', "กรุณาระบุข้อมูล 'เลขหมวด'", 'warning');

            return false;
        }

        if (this.LAW_GROUP_NAME == null || this.LAW_GROUP_NAME == undefined || this.LAW_GROUP_NAME == "") {
            this.isReq_lawGroupName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อหมวด'", 'warning');

            return false;
        }

        if (this.PART_NO == null || this.PART_NO == undefined || this.PART_NO == "") {
            this.isReq_partNo.next(true);
            swal('', "กรุณาระบุข้อมูล 'เลขส่วน'", 'warning');

            return false;
        }

        if (this.PART_NAME == null || this.PART_NAME == undefined || this.PART_NAME == "") {
            this.isReq_partName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อส่วน'", 'warning');

            return false;
        }

        if (this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined || this.EFFECTIVE_DATE == "") {
            this.isReq_effectiveDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่เริ่มใช้งาน'", 'warning');

            return false;
        }

        if (this.EXPIRE_DATE == null || this.EXPIRE_DATE == undefined || this.EXPIRE_DATE == "") {
            this.isReq_expDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่สิ้นสุดใช้งาน'", 'warning');

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
                    this.router.navigate(['/msLawGroup/list']);
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
                    LAW_GROUP_ID: this.LAW_GROUP_ID
                }
                
                this.MasService.getAPI1111("MasLawGroupupdDelete", this.oParam).then(async IsSuccess => {
                    if (IsSuccess) {
                        //this.ShowAlertSuccess(Message.saveComplete);
                        this.router.navigate(['/msLawGroup/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }


    setData() {
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.LAW_GROUP_ID = `${this.LAW_GROUP_ID == "Auto Generate" ? "" : this.LAW_GROUP_ID}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EFFECTIVE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day + ' 00:00:00.000';
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day + ' 00:00:00.000';
        }

        this.oParam = {
            LAW_GROUP_ID: this.LAW_GROUP_ID,
            LAW_GROUP_NAME: this.LAW_GROUP_NAME,
            LAW_GROUP_NO: this.LAW_GROUP_NO,
            PART_NO: this.PART_NO,
            PART_NAME: this.PART_NAME,
            EFFECTIVE_DATE: cvEffDate,
            EXPIRE_DATE: cvExpDate,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.getAPI1111("MasLawGroupinsAll", this.oParam).then(async item => {
            if (item.IsSuccess) {
                this.LAW_GROUP_ID = item.LAW_GROUP_ID;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msLawGroup/manage/R/${this.LAW_GROUP_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.getAPI1111("MasMasLawGroupupdAll", this.oParam).then(async item => {
            if (item.IsSuccess) {
                swal('', Message.saveComplete, 'success');

                if (this.oParam.IS_ACTIVE == "1") {
                    this.onComplete();
                    await this.ShowMasterData();
                } else {
                    this.router.navigate(['/msLawGroup/list']);
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

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }
}
