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

    RELIGION_ID: string;
    RELIGION_NAME_TH: string;
    RELIGION_NAME_EN: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_religionNameTH = new BehaviorSubject<boolean>(false);
    isReq_religionNameEN = new BehaviorSubject<boolean>(false);

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
            this.RELIGION_ID = "Auto Generate";
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
                        this.RELIGION_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData(){
        var paramsOther = {
            TEXT_SEARCH: "",
            RELIGION_ID: this.RELIGION_ID
        }

        this.MasService.getByKeyword("MasReligiongetByCon", paramsOther).then(list => {
            if(list.RESPONSE_DATA.length > 0){
                this.RELIGION_NAME_TH = list.RESPONSE_DATA[0].RELIGION_NAME_TH;
                this.RELIGION_NAME_EN = list.RESPONSE_DATA[0].RELIGION_NAME_EN;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                swal('', "พบปัญหาที่ API MasReligiongetByCon", 'error');
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msReligion/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasReligiongetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.RELIGION_NAME_TH == null || this.RELIGION_NAME_TH == undefined || this.RELIGION_NAME_TH == "") {
            this.isReq_religionNameTH.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อศาสนาภาษาไทย'", 'warning');

            return false;
        }

        if (this.RELIGION_NAME_EN == null || this.RELIGION_NAME_EN == undefined || this.RELIGION_NAME_EN == "") {
            this.isReq_religionNameEN.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อศาสนาภาษาอังกฤษ'", 'warning');

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
                    this.router.navigate(['/msReligion/list']);
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
        this.RELIGION_ID = `${this.RELIGION_ID == "Auto Generate" ? "" : this.RELIGION_ID}`;

        this.oParam = {
            RELIGION_ID: this.RELIGION_ID,
            RELIGION_NAME_TH: this.RELIGION_NAME_TH,
            RELIGION_NAME_EN: this.RELIGION_NAME_EN,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasReligioninsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.RELIGION_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msReligion/manage/R/${this.RELIGION_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasReligionupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');
                
                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msReligion/list']);
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
