import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Nav_target_Service } from '../../../../shared/header-navigation/nav_target.service'
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
import { THIS_EXPR } from '../../../../../../node_modules/@angular/compiler/src/output/output_ast';

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

    RACE_ID: string;
    RACE_NAME_TH: string;
    RACE_NAME_EN: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    // ----- Model ------ //
    //@ViewChild('printDocModal') printDocModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private navService: Nav_target_Service,
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
            this.RACE_ID = "Auto Generate";
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
                        this.RACE_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData(){
        var paramsOther = {
            TEXT_SEARCH: "",
            RACE_ID: this.RACE_ID
        }

        this.MasService.getByKeyword("MasRacegetByCon", paramsOther).then(list => {
            if(list.RESPONSE_DATA.length > 0){
                this.RACE_NAME_TH = list.RESPONSE_DATA[0].RACE_NAME_TH;
                this.RACE_NAME_EN = list.RESPONSE_DATA[0].RACE_NAME_EN;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasRacegetByCon");
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msRace/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API MasRacegetByCon :: " + err.message);
        });
    }

    async OnSave() {
        if (this.RACE_NAME_TH == null || this.RACE_NAME_TH == undefined
            || this.RACE_NAME_EN == null || this.RACE_NAME_EN == undefined) {
            this.isRequired = true;
            this.ShowAlertWarning(Message.checkData);

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
                    this.router.navigate(['/msRace/list']);
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
        this.RACE_ID = `${this.RACE_ID == "Auto Generate" ? "" : this.RACE_ID}`;

        this.oParam = {
            RACE_ID: this.RACE_ID,
            RACE_NAME_TH: this.RACE_NAME_TH,
            RACE_NAME_EN: this.RACE_NAME_EN,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasRaceinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.RACE_ID = item.RESPONSE_DATA;
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msRace/manage/R/${this.RACE_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasRaceupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.ShowAlertSuccess(Message.saveComplete);
                
                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msRace/list']);
                }
                
                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError(Message.saveFail);
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


    // **********************************
    // -------------- Alert -------------
    // **********************************
    ShowAlertWarning(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    ShowAlertSuccess(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'success',
            confirmButtonText: 'ตกลง'
        });
    }

    ShowAlertError(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'error',
            confirmButtonText: 'ตกลง'
        });
    }
}
