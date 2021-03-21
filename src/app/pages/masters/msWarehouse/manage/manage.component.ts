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
import { async } from 'q';
import { MastersConfig } from '../../masters.config';
//import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
// , OnInit, OnDestroy
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    SUB_DISTRICT_LIST = [];
    SUB_DISTRICT_MODEL: any;
    LOCATION: string;
    SUB_DISTRICT_ID: string;

    OFFICE_LIST = [];
    OFFICE_MODEL: any;
    OFFICE_NAME: string;
    OFFICE_CODE: string;

    WAREHOUSE_ID: string;
    WAREHOUSE_CODE: string;
    WAREHOUSE_TYPE: string;
    WAREHOUSE_NAME: string;
    ADDRESS_NO: string;
    VILLAGE_NO: string;
    BUILDING_NAME: string;
    ROOM_NO: string;
    FLOOR: string;
    ALLEY: string;
    LANE: string
    ROAD: string;
    EFFECTIVE_DATE: any;
    EXPIRE_DATE: any;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_warehouseType = new BehaviorSubject<boolean>(false);
    isReq_warehouseName = new BehaviorSubject<boolean>(false);
    isReq_effectiveDate = new BehaviorSubject<boolean>(false);
    isReq_expDate = new BehaviorSubject<boolean>(false);
    isReq_office = new BehaviorSubject<boolean>(false);

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
        await this.getSubDistrict();
        await this.getOffice();

        this.WAREHOUSE_TYPE = "";
        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.WAREHOUSE_ID = "Auto Generate";
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
                        this.WAREHOUSE_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            WAREHOUSE_ID: this.WAREHOUSE_ID
        }

        this.MasService.getByKeyword("MasWarehousegetByCon", paramsOther).then(list => {
            if (list.SUCCESS) {
                this.WAREHOUSE_CODE = list.RESPONSE_DATA.WAREHOUSE_CODE;
                this.WAREHOUSE_TYPE = list.RESPONSE_DATA.WAREHOUSE_TYPE;
                this.WAREHOUSE_NAME = list.RESPONSE_DATA.WAREHOUSE_NAME;
                this.ADDRESS_NO = list.RESPONSE_DATA.ADDRESS_NO;
                this.VILLAGE_NO = list.RESPONSE_DATA.VILLAGE_NO;
                this.BUILDING_NAME = list.RESPONSE_DATA.BUILDING_NAME;
                this.ROOM_NO = list.RESPONSE_DATA.ROOM_NO;
                this.FLOOR = list.RESPONSE_DATA.FLOOR;
                this.ALLEY = list.RESPONSE_DATA.ALLEY;
                this.LANE = list.RESPONSE_DATA.LANE;
                this.ROAD = list.RESPONSE_DATA.ROAD;

                this.LOCATION = list.RESPONSE_DATA.LOCATION;
                this.SUB_DISTRICT_ID = list.RESPONSE_DATA.SUB_DISTRICT_ID;

                this.OFFICE_NAME = list.RESPONSE_DATA.OFFICE_NAME;
                this.OFFICE_CODE = list.RESPONSE_DATA.OFFICE_CODE;

                if (list.RESPONSE_DATA.EFFECTIVE_DATE) {
                    var EffDate = list.RESPONSE_DATA.EFFECTIVE_DATE.toString().split(" ");
                    this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));
                } else {
                    this.EFFECTIVE_DATE = "";
                }

                if (list.RESPONSE_DATA.EFEXPIRE_DATE) {
                    var ExpDate = list.RESPONSE_DATA.EFEXPIRE_DATE.toString().split(" ");
                    this.EXPIRE_DATE = setDateMyDatepicker(new Date(ExpDate[0]));
                } else {
                    this.EXPIRE_DATE = "";
                }

                this.IS_ACTIVE = list.RESPONSE_DATA.IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                swal('', "พบปัญหาที่ API MasWarehousegetByCon", 'error');
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msWarehouse/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasWarehousegetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        // console.log(this.SUB_DISTRICT_MODEL.SUB_DISTRICT_ID);
        if (this.OFFICE_CODE == "") {
            this.OFFICE_NAME = "";
            this.OFFICE_MODEL = null;
        }

        if (this.WAREHOUSE_TYPE == null || this.WAREHOUSE_TYPE == undefined || this.WAREHOUSE_TYPE == "") {
            this.isReq_warehouseType.next(true);
            swal('', "กรุณาระบุข้อมูล 'ประเภทคลังสินค้า'", 'warning');

            return false;
        }

        if (this.WAREHOUSE_NAME == null || this.WAREHOUSE_NAME == undefined || this.WAREHOUSE_NAME == "") {
            this.isReq_warehouseName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อคลังสินค้า'", 'warning');

            return false;
        }

        if (this.OFFICE_CODE == null || this.OFFICE_CODE == undefined || this.OFFICE_CODE == "") {
            this.isReq_office.next(true);
            swal('', "กรุณาระบุข้อมูล 'หน่วยงานที่รับผิดชอบ'", 'warning');

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
                    this.router.navigate(['/msWarehouse/list']);
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

    /*
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
                    WAREHOUSE_ID: this.WAREHOUSE_ID
                }
                
                this.MasService.MasDelAll("MasCourtupdDelete", this.oParam).then(async IsSuccess => {
                    if (IsSuccess) {
                        //this.ShowAlertSuccess(Message.saveComplete);
                        this.router.navigate(['/msCourt/list']);
                    } else {
                        this.ShowAlertError(Message.saveFail);
                    }
                }, (error) => { console.error(error); });
            }
        })
    }
*/

    setData() {
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.WAREHOUSE_ID = `${this.WAREHOUSE_ID == "Auto Generate" ? "" : this.WAREHOUSE_ID}`;
        this.SUB_DISTRICT_ID = `${this.SUB_DISTRICT_MODEL ? this.SUB_DISTRICT_MODEL.SUB_DISTRICT_ID : ""}`;
        this.OFFICE_CODE = `${this.OFFICE_MODEL ? this.OFFICE_MODEL.OFFICE_CODE : ""}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EXPIRE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day;
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day;
        }

        this.oParam = {
            WAREHOUSE_ID: this.WAREHOUSE_ID,
            SUB_DISTRICT_ID: this.SUB_DISTRICT_ID,
            OFFICE_CODE: this.OFFICE_CODE,
            WAREHOUSE_CODE: this.WAREHOUSE_CODE,
            WAREHOUSE_TYPE: this.WAREHOUSE_TYPE,
            WAREHOUSE_NAME: this.WAREHOUSE_NAME,
            ADDRESS_NO: this.ADDRESS_NO,
            VILLAGE_NO: this.VILLAGE_NO,
            BUILDING_NAME: this.BUILDING_NAME,
            ROOM_NO: this.ROOM_NO,
            FLOOR: this.FLOOR,
            ALLEY: this.ALLEY,
            LANE: this.LANE,
            ROAD: this.ROAD,
            IS_ACTIVE: this.IS_ACTIVE,
            EFFECTIVE_DATE: setZeroHours(cvEffDate),
            EFEXPIRE_DATE: setZeroHours(cvExpDate),
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasWarehouseinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.WAREHOUSE_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msWarehouse/manage/R/${this.WAREHOUSE_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasWarehouseupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');

                if (this.oParam.IS_ACTIVE == "1") {
                    this.onComplete();
                    await this.ShowMasterData();
                } else {
                    this.router.navigate(['/msWarehouse/list']);
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


    // ******************************************
    // -------------- Sub District -------------
    // ******************************************
    getSubDistrict() {
        this.MasService.getByKeyword("MasSubDistrictgetByCon", { "TEXT_SEARCH": "" }).then(list => {
            if (list.SUCCESS) {
                this.SUB_DISTRICT_LIST = list.RESPONSE_DATA;

                this.SUB_DISTRICT_LIST.map(m => {
                    //m.NAME = "ตำบล" + m.SUB_DISTRICT_NAME_TH + " อำเภอ" + m.DISTRICT_NAME_TH + " จังหวัด" + m.PROVINCE_NAME_TH;
                    m.NAME = m.SUB_DISTRICT_NAME_TH + "/" + m.DISTRICT_NAME_TH + "/" + m.PROVINCE_NAME_TH;
                });

                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchSubDistrict = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.SUB_DISTRICT_LIST
                    .filter(v => v.NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter = (x: { NAME: string }) => x.NAME;


    // ******************************************
    // -------------- Sub District -------------
    // ******************************************
    getOffice() {
        this.MasService.getByKeyword("MasOfficegetByCon", { "TEXT_SEARCH": "" }).then(list => {
            if (list.SUCCESS) {
                this.OFFICE_LIST = list.RESPONSE_DATA;

                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchOffice = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.OFFICE_LIST
                    .filter(v => v.OFFICE_NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_Office = (x: { OFFICE_NAME: string }) => x.OFFICE_NAME;

    OfficeselectItem(event) {
        this.OFFICE_CODE = event.item.OFFICE_CODE;
        this.OFFICE_NAME = event.item.OFFICE_NAME;
    }

    OfficeClear() {
        if (typeof this.OFFICE_MODEL == "object") {
            this.OFFICE_CODE = "";
            this.OFFICE_NAME = "";
        }
    }

    // *************************************
    // -------------- Datetime -------------
    // *************************************
    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }


}
