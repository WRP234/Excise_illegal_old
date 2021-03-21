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
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    TITLE_ID: string;
    TITLE_NAME_TH: string;
    TITLE_NAME_EN: string;
    TITLE_SHORT_NAME_TH: string;
    TITLE_SHORT_NAME_EN: string;
    TITLE_TYPE: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_titleNameTH = new BehaviorSubject<boolean>(false);
    isReq_titleShortNameTH = new BehaviorSubject<boolean>(false);
    isReq_titleNameEN = new BehaviorSubject<boolean>(false);
    isReq_titleShortNameEN = new BehaviorSubject<boolean>(false);

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
        
        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.TITLE_ID = "Auto Generate";
            this.chk1 = true;
            this.TITLE_TYPE = "1";
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
                        this.TITLE_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData(){
        var paramsOther = {
            TEXT_SEARCH: "",
            TITLE_ID: this.TITLE_ID
        }

        this.MasService.getByKeyword("MasTitlegetByCon", paramsOther).then(list => {
            if(list.RESPONSE_DATA.length > 0){
                this.TITLE_NAME_TH = list.RESPONSE_DATA[0].TITLE_NAME_TH;
                this.TITLE_SHORT_NAME_TH = list.RESPONSE_DATA[0].TITLE_SHORT_NAME_TH;
                this.TITLE_NAME_EN = list.RESPONSE_DATA[0].TITLE_NAME_EN;
                this.TITLE_SHORT_NAME_EN = list.RESPONSE_DATA[0].TITLE_SHORT_NAME_EN;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;
                this.TITLE_TYPE = list.RESPONSE_DATA[0].TITLE_TYPE;

                this.preloader.setShowPreloader(false);
            } else {
                swal('', "พบปัญหาที่ API MasTitlegetByCon", 'error');
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msTitle/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasTitlegetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.TITLE_NAME_TH == null || this.TITLE_NAME_TH == undefined || this.TITLE_NAME_TH == "") {
            this.isReq_titleNameTH.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อภาษาไทย'", 'warning');

            return false;
        }

        if (this.TITLE_SHORT_NAME_TH == null || this.TITLE_SHORT_NAME_TH == undefined || this.TITLE_SHORT_NAME_TH == "") {
            this.isReq_titleShortNameTH.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อย่อภาษาไทย'", 'warning');

            return false;
        }

        if (this.TITLE_NAME_EN == null || this.TITLE_NAME_EN == undefined || this.TITLE_NAME_EN == "") {
            this.isReq_titleNameEN.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อภาษาอังกฤษ'", 'warning');

            return false;
        }

        if (this.TITLE_SHORT_NAME_EN == null || this.TITLE_SHORT_NAME_EN == undefined || this.TITLE_SHORT_NAME_EN == "") {
            this.isReq_titleShortNameEN.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อย่อภาษาอังกฤษ'", 'warning');

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
                    this.router.navigate(['/msTitle/list']);
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

    setData(){
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.TITLE_ID = `${this.TITLE_ID == "Auto Generate" ? "" : this.TITLE_ID}`;

        this.oParam = {
            TITLE_ID: this.TITLE_ID,
            TITLE_NAME_TH: this.TITLE_NAME_TH,
            TITLE_NAME_EN: this.TITLE_NAME_EN,
            TITLE_SHORT_NAME_TH: this.TITLE_SHORT_NAME_TH,
            TITLE_SHORT_NAME_EN: this.TITLE_SHORT_NAME_EN,
            TITLE_TYPE: this.TITLE_TYPE,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasTitleinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.TITLE_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msTitle/manage/R/${this.TITLE_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasTitleupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');
                
                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msTitle/list']);
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
}
