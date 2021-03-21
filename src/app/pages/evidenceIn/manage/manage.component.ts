import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EvidenceService } from '../evidenceIn.service';
import { MasterService } from '../../masters/masters.service';
import { Evidence_In, Document, EvidenceInStaff, EvidenceInItem, EvidenceStockBalance } from '../evidenceIn';
import { MatAutocomplete } from '@angular/material';
import * as formatDate from '../../../config/dateFormat';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { toLocalShort, compareDate, setZeroHours, setDateMyDatepicker, getDateMyDatepicker } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import swal from 'sweetalert2';
import { pagination } from '../../../config/pagination';
import { async } from '../../../../../node_modules/@types/q';
import { EvidenceOutService } from '../../evidenceOut/evidenceOut.service';
import { MastersConfig } from '../../masters/masters.config';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    PROVE_ID: any;
    evitype: any;
    showEditField: any;
    selectAllChb: any;
    paginage = pagination;
    isRequired: boolean | false;

    oEvidenceInItem: any;
    ListEvidenceInItem = [];

    STAFF_LIST = [];                // List ของพนักงาน
    STAFF_SEND_MODEL: any;          // Model ของผู้นำส่ง
    STAFF_SEND_POS_NAME: string;    // ชื่อตำแหน่งของผู้นำส่ง
    STAFF_SEND_OFFICE_NAME: string; // ชื่อหน่วยงานของผู้นำส่ง
    STAFF_SEND_CODE: string;        // Code ของผู้นำส่ง

    STAFF_RECEIVE_MODEL: any;        // Model ของผู้จัดเก็บ
    STAFF_RECEIVE_POS_NAME: string;  // ชื่อตำแหน่งของผู้จัดเก็บ
    STAFF_RECEIVE_OFFICE_NAME: string;   // ชื่อหน่วยงานของผู้จัดเก็บ
    STAFF_RECEIVE_CODE: string;      // Code ของผู้จัดเก็บ

    WAREHOUSE_LIST = [];            // คลังจัดเก็บ
    WAREHOUSE_MODEL: any;           // Model คลังจัดเก็บ


    EVIDENCE_IN_TYPE: string;       // ประเภทการตรวจรับของกลาง
    EVIDENCE_IN_ID: string;         // Running No รายการตรวจรับของกลางเพื่อจัดเก็บ
    DELIVERY_DATE: any;             // วันที่นำส่ง
    DELIVERY_TIME: string;          // เวลาที่นำส่ง
    EVIDENCE_IN_DATE: any;          // วันที่จัดเก็บ
    EVIDENCE_IN_TIME: string;       // เวลาที่จัดเก็บ
    RETURN_DATE: any;               // วันที่รับคืน
    EVIDENCE_IN_CODE: string;       // เลขที่ตรวจรับของกลางเพื่อจัดเก็บ

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private navService: NavigationService,
        private EviService: EvidenceService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private EvidenceOutService: EvidenceOutService,
        private router: Router
    ) {
        super();
    }

    async ngOnInit() {
        //this.preloader.setShowPreloader(true);

        // this.oEvidenceIn = {
        //     IS_EDIT: 1
        // }

        this.active_Route();
        //await this.getStaff();
        //this.getWarehouse();



        // // this.getUnit(); -- waiting API
        // // await this.getEvidenceInStaff();  -- waiting API

        this.DELIVERY_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.RETURN_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EVIDENCE_IN_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        this.DELIVERY_TIME = this.getCurrentTime();
        this.EVIDENCE_IN_TIME = this.getCurrentTime();
        this.EVIDENCE_IN_CODE = "Auto Generate";

        // //this.DestinationCode = "030700";
        // this.DestinationCode = localStorage.getItem("officeCode");


        if (this.evitype == "I") {
            //await this.getProve();
        }
        else if (this.evitype == "E") {
            //await this.getMasProduct();
        } else if (this.evitype == "G") {
            //await this.getEvidenceInOutgetByWarehouseID();
        }

        // if (this.mode == "R") {
        //     await this.ShowEvidenceIn();
        // } else {
        //     this.preloader.setShowPreloader(false);
        // }
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];
            this.evitype = p['type'];
            this.PROVE_ID = p['proveid'];

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

                    // set true
                    this.PrintButton.next(true);
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;

                    if (p['code']) {
                        this.EVIDENCE_IN_ID = p['code'];
                    }
                    break;
            }

            this.activeRoute.data.subscribe(
                (data) => {
                    switch (this.evitype) {
                        case 'I':
                            data.urls[2].title = "จัดการข้อมูลรายการตรวจรับของกลางจากหน่วยงานภายใน";
                            data.codePage = "ILG60-10-02-00-00";
                            this.EVIDENCE_IN_TYPE = "0";
                            break;
                        case 'E':
                            data.urls[2].title = "จัดการข้อมูลรายการตรวจรับของกลางจากหน่วยงานภายนอก";
                            data.codePage = "ILG60-10-03-00-00";
                            this.EVIDENCE_IN_TYPE = "1";
                            break;
                        case 'G':
                            data.urls[2].title = "จัดการข้อมูลรายการตรวจรับของกลางที่นำออกจากคลังไปใช้ในราชการ";
                            data.codePage = "ILG60-10-04-00-00";
                            this.EVIDENCE_IN_TYPE = "2";
                            break;
                    }

                }
            );
        });
    }

    // **********************************
    // -------------- Alert -------------
    // **********************************
    //#region 
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
    //#endregion




    // **********************************
    // ------------- DateTime -----------
    // **********************************
    //#region 
    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }
    //#endregion




    // **********************************
    // --------------- Staff ------------
    // **********************************
    //#region 
    async getStaff() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "132611",
            STAFF_ID: ""
        }

        await this.MasService.getByKeyword("MasStaffgetByCon", paramsOther).then(list => {
            if (list.SUCCESS) {
                this.STAFF_LIST = list.RESPONSE_DATA;

                this.STAFF_LIST.map(m => {
                    m.NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                    m.CONTRIBUTOR_ID = "";
                });

                this.preloader.setShowPreloader(false);
            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        });
    }

    searchStaff = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.STAFF_LIST
                    .filter(v => v.NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter = (x: { NAME: string }) => x.NAME;

    StaffReceiveselectItem(event) {
        this.STAFF_RECEIVE_POS_NAME = event.item.OPREATION_POS_NAME;
        this.STAFF_RECEIVE_OFFICE_NAME = event.item.OPERATION_OFFICE_SHORT_NAME;
        this.STAFF_RECEIVE_CODE = event.item.OPERATION_OFFICE_CODE;
    }

    StaffReceiveClear() {
        if (typeof this.STAFF_RECEIVE_MODEL == "object") {
            this.STAFF_RECEIVE_POS_NAME = "";
            this.STAFF_RECEIVE_OFFICE_NAME = "";
            this.STAFF_RECEIVE_CODE = "";
        }
    }

    StaffSendselectItem(event) {
        this.STAFF_SEND_POS_NAME = event.item.OPREATION_POS_NAME;
        this.STAFF_SEND_OFFICE_NAME = event.item.OPERATION_OFFICE_SHORT_NAME;
        this.STAFF_SEND_CODE = event.item.OPERATION_OFFICE_CODE;
    }

    StaffSendClear() {
        if (typeof this.STAFF_SEND_MODEL == "object") {
            this.STAFF_SEND_POS_NAME = "";
            this.STAFF_SEND_OFFICE_NAME = "";
            this.STAFF_SEND_CODE = "";
        }
    }
    //#endregion




    // **********************************
    // ------------ Product -----------
    // **********************************
    //#region 
    AddProduct() {
        this.oEvidenceInItem = {
            EVIDENCE_IN_ITEM_CODE: "Auto Generate",
            PRODUCT_SEQ: this.ListEvidenceInItem.length,
            EVIDENCE_IN_ID: "",
            PRODUCT_DESC: "",
            DELIVERY_QTY: "",
            DELIVERY_QTY_UNIT: "",
            DELIVERY_NET_VOLUMN: "",
            DAMAGE_QTY: "",
            DAMAGE_QTY_UNIT: "",
            DAMAGE_NET_VOLUMN: "",
            RECEIVE_QTY: "",
            RECEIVE_NET_VOLUMN: "",
            //Remark: "",
            IsNewItem: true,
            IsDelItem: false,
            EvidenceStockBalance: []
        };
        this.ListEvidenceInItem.push(this.oEvidenceInItem);

        if (this.evitype == 'G') {
            this.ListEvidenceInItem.map(f => {
                f.EVIDENCE_IN_ITEM_CODE = "";
            })
        }
    }
    //#endregion




    // **********************************
    // ------------- Warehouse ----------
    // **********************************
    //#region 
    async getWarehouse() {
        await this.MasService.getByKeyword("MasWarehousegetByKeyword", { "TEXT_SEARCH": "" }).then(list => {
            if (list.SUCCESS) {
                this.WAREHOUSE_LIST = list.RESPONSE_DATA;
            }
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchWarehouse = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.WAREHOUSE_LIST
                    .filter(v => v.WAREHOUSE_NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_warehouse = (x: { WAREHOUSE_NAME: string }) => x.WAREHOUSE_NAME;
    //#endregion




    // **********************************
    // ------------- Cal จำนวน ----------
    // **********************************
    //#region 
    CalReceive(i: number) {
        let m = this.ListEvidenceInItem.find(f => f.PRODUCT_SEQ == i);

        if (m != undefined) {
            m.RECEIVE_QTY = +`${m.DELIVERY_QTY == "" || m.DELIVERY_QTY == undefined ? "0" : m.DELIVERY_QTY}` - +`${m.DAMAGE_QTY == "" || m.DAMAGE_QTY == undefined ? "0" : m.DAMAGE_QTY}`;

            if (m.RECEIVE_QTY < 0) {
                this.ShowAlertWarning("จำนวนชำรุดต้องไม่มากกว่าจำนวนส่ง !!!");
                m.DAMAGE_QTY = m.DELIVERY_QTY;
                m.RECEIVE_QTY = 0;
            }
        }
    }

    CalReceiveNetVolumn(i: number) {
        let m = this.ListEvidenceInItem.find(f => f.PRODUCT_SEQ == i);

        if (m != undefined) {
            m.RECEIVE_NET_VOLUMN = +`${m.DELIVERY_NET_VOLUMN == "" || m.DELIVERY_NET_VOLUMN == undefined ? "0" : m.DELIVERY_NET_VOLUMN}` - +`${m.DAMAGE_NET_VOLUMN == "" || m.DAMAGE_NET_VOLUMN == undefined ? "0" : m.DAMAGE_NET_VOLUMN}`;

            if (m.RECEIVE_NET_VOLUMN < 0) {
                this.ShowAlertWarning("ปริมาณชำรุดต้องไม่มากกว่าปริมาณส่ง !!!");
                m.DAMAGE_NET_VOLUMN = m.DELIVERY_NET_VOLUMN;
                m.RECEIVE_NET_VOLUMN = 0;
            }
        }
    }
    //#endregion
}
