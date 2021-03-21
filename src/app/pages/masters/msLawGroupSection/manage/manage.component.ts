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
    chk1: any;

    EFFECTIVE_DATE: any;
    EXPIRE_DATE: any;
    IS_ACTIVE: any;

    SECTION_ID: string;
    LAW_GROUP_ID: number;
    LAW_GROUP_NO: string;
    SECTION_NAME: string;
    SECTION_DESC_1: string;
    PART_NO: string;

    PENALTY_DESC: string;
    CHK_IS_FINE: any;
    CHK_IS_IMPRISON: any;
    CHK_IS_TAX_PAID: any;
    FINE_RATE_MIN: string;
    FINE_RATE_MAX: string;
    FINE_START: string;
    FINE_TO: string;
    FINE_MIN: string;
    FINE_MAX: string;
    PRISON_RATE_LIMIT: string;
    PRISON_RATE_MIN: string;
    PRISON_RATE_MAX: string;
    SUBSECTION_ID: string;
    PENALTY_ID: string;
    FINE_TYPE: string;
    FINE_TYPE_START: string;
    FINE_TYPE_END: string;

    rd_fine: string;
    rd_prison: string;

    LAW_GROUP_SECTION_LIST = [];
    LAW_GROUP_LIST = [];
    PART_LIST = [];
    ListSubSection = [];

    oParam: any;
    oLawPenalty: any;

    isReq_lawGroupNo = new BehaviorSubject<boolean>(false);
    isReq_partNo = new BehaviorSubject<boolean>(false);
    isReq_sectionName = new BehaviorSubject<boolean>(false);
    isReq_sectionDesc1 = new BehaviorSubject<boolean>(false);
    isReq_penaltyDesc = new BehaviorSubject<boolean>(false);
    isReq_effective = new BehaviorSubject<boolean>(false);
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
        this.getLawGroupSection();

        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        this.LAW_GROUP_NO = "";
        this.PART_NO = "";

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.SECTION_ID = "Auto Generate";
            this.preloader.setShowPreloader(false);

            this.chk1 = true;
            this.CHK_IS_FINE = false;
            this.CHK_IS_IMPRISON = false;
            this.CHK_IS_TAX_PAID = false;
            this.FINE_TYPE = "1";
            this.FINE_TYPE_START = "1";
            this.FINE_TYPE_END = "1";
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
                        this.SECTION_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            SECTION_ID: this.SECTION_ID
        }

        this.MasService.getAPI1111("MasLawGroupSectiongetByCon", paramsOther).then(list => {
            if (list) {
                this.LAW_GROUP_NO = list.masLawGroup.LAW_GROUP_NO;
                this.LAW_GROUP_ID = list.masLawGroup.LAW_GROUP_ID;

                this.getPart();
                this.PART_NO = list.masLawGroup.PART_NO;

                this.SECTION_NAME = list.SECTION_NAME;
                this.SECTION_DESC_1 = list.SECTION_DESC_1;

                // ข้อย่อย/วรรค
                if (list.masLawGroupSubSections) {
                    this.ListSubSection = list.masLawGroupSubSections;

                    for (var i = 0; i < this.ListSubSection.length; i += 1) {
                        this.ListSubSection[i].SUBSECTION_SEQ = i;
                        this.ListSubSection[i].IsNewItem = false;
                        this.ListSubSection[i].IsDelItem = false;
                    }
                }

                // อัตราโทษ
                if (list.masLawPenalties) {
                    this.CHK_IS_TAX_PAID = list.masLawPenalties[0].IS_TAX_PAID == "1" ? true : false;
                    this.CHK_IS_FINE = list.masLawPenalties[0].IS_FINE == "1" ? true : false;
                    this.CHK_IS_IMPRISON = list.masLawPenalties[0].IS_IMPRISON == "1" ? true : false;

                    if (list.masLawPenalties[0].IS_FINE == "1") {
                        this.FINE_RATE_MIN = list.masLawPenalties[0].FINE_RATE_MIN;
                        this.FINE_RATE_MAX = list.masLawPenalties[0].FINE_RATE_MAX;

                        if (list.masLawPenalties[0].FINE_MIN > 0 && list.masLawPenalties[0].FINE_MAX > 0) {
                            this.rd_fine = "2";
                            this.FINE_MIN = list.masLawPenalties[0].FINE_MIN;
                            this.FINE_MAX = list.masLawPenalties[0].FINE_MAX;
                        } else if (list.masLawPenalties[0].FINE_MIN > 0) {
                            this.rd_fine = "1";
                            this.FINE_MIN = list.masLawPenalties[0].FINE_MIN;
                        } else if (list.masLawPenalties[0].FINE_MAX > 0) {
                            this.rd_fine = "3";
                            this.FINE_MAX = list.masLawPenalties[0].FINE_MAX;
                        }
                    }

                    if (list.masLawPenalties[0].IS_IMPRISON == "1") {
                        if (list.masLawPenalties[0].PRISON_RATE_MIN > 0 && list.masLawPenalties[0].PRISON_RATE_MAX > 0) {
                            this.rd_prison = "2";

                            if (list.masLawPenalties[0].PRISON_RATE_MIN < 1) {
                                this.PRISON_RATE_MIN = list.masLawPenalties[0].PRISON_RATE_MIN.Replace("0.", "");
                                this.FINE_TYPE_START = "1";
                            } else {
                                this.PRISON_RATE_MIN = list.masLawPenalties[0].PRISON_RATE_MIN;
                                this.FINE_TYPE_START = "2";
                            }

                            if (list.masLawPenalties[0].PRISON_RATE_MAX < 1) {
                                this.PRISON_RATE_MAX = list.masLawPenalties[0].PRISON_RATE_MAX.Replace("0.", "");
                                this.FINE_TYPE_END = "1";
                            } else {
                                this.PRISON_RATE_MAX = list.masLawPenalties[0].PRISON_RATE_MAX;
                                this.FINE_TYPE_END = "2";
                            }
                        } else {
                            this.rd_prison = "1";
                        }
                    }
                }

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
                    swal('', "ไม่พบข้อมูล", 'warning');

                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msLawGroupSection/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasLawGroupSectiongetByCon :: " + err.message, 'error');
        });
    }


    // **********************************
    // -------------- Action -----------
    // **********************************
    //#region
    async OnSave() {
        if (this.LAW_GROUP_NO == null || this.LAW_GROUP_NO == undefined || this.LAW_GROUP_NO == "") {
            this.isReq_lawGroupNo.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อหมวด'", 'warning');

            return false;
        }

        if (this.PART_NO == null || this.PART_NO == undefined || this.PART_NO == "") {
            this.isReq_partNo.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อส่วน'", 'warning');

            return false;
        }

        if (this.SECTION_NAME == null || this.SECTION_NAME == undefined || this.SECTION_NAME == "") {
            this.isReq_sectionName.next(true);
            swal('', "กรุณาระบุข้อมูล 'มาตรา'", 'warning');

            return false;
        }

        if (this.SECTION_DESC_1 == null || this.SECTION_DESC_1 == undefined || this.SECTION_DESC_1 == "") {
            this.isReq_sectionDesc1.next(true);
            swal('', "กรุณาระบุข้อมูล 'รายละเอียดมาตรา'", 'warning');

            return false;
        }


        const lsSubSection = this.ListSubSection.filter(f => f.IsDelItem == false && (f.SUBSECTION_NAME == "" || f.SUBSECTION_DESC == ""));
        if (this.ListSubSection.filter(f => f.IsDelItem == false).length == 0 || lsSubSection.length > 0) {
            swal('', "กรุณาระบุข้อมูล 'ข้อย่อย/วรรค' ให้ครบทุกช่อง", 'warning');

            return false;
        }


        if (this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined || this.EFFECTIVE_DATE == "") {
            this.isReq_effective.next(true);
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
                    this.router.navigate(['/msLawGroupSection/list']);
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
        }).then(async result => {
            if (result.value) {
                this.preloader.setShowPreloader(true);

                let oParam = {
                    SECTION_ID: this.SECTION_ID
                }

                this.MasService.getAPI1111("MasLawGroupSectionupdDelete", oParam).then(async item => {
                    if (item.IsSuccess) {
                        this.preloader.setShowPreloader(false);
                        swal('', Message.saveComplete, 'success');
                        this.router.navigate(['/msLawGroupSection/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }


    //#endregion



    // **********************************
    // ------- Function For Action ------
    // **********************************
    //#region 
    setData() {
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.SECTION_ID = `${this.SECTION_ID == "Auto Generate" ? "" : this.SECTION_ID}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EFFECTIVE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day + " 00:00:00.000";
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day + " 00:00:00.000";
        }

        this.oParam = {
            SECTION_ID: this.SECTION_ID,
            LAW_GROUP_ID: this.PART_LIST.find(s => s.PART_NO === this.PART_NO).LAW_GROUP_ID,
            SECTION_NAME: this.SECTION_NAME,
            SECTION_DESC_1: this.SECTION_DESC_1,
            EFFECTIVE_DATE: cvEffDate,
            EXPIRE_DATE: cvExpDate,
            IS_ACTIVE: 1,
            masLawGroupSubSections: [],
            masLawPenalties: []
        }


        const IS_FINE = `${this.CHK_IS_FINE ? "1" : "0"}`;
        const IS_TAX_PAID = `${this.CHK_IS_TAX_PAID ? "1" : "0"}`;
        const IS_IMPRISON = `${this.CHK_IS_IMPRISON ? "1" : "0"}`;

        let fineMin = "0", fineMax = "0";

        if (this.rd_fine == "1") {
            fineMin = this.FINE_START;
            fineMax = "0";
        } else if (this.rd_fine == "2") {
            fineMin = this.FINE_MIN;
            fineMax = this.FINE_MAX;
        } else if (this.rd_fine == "3") {
            fineMin = "0";
            fineMax = this.FINE_TO;
        }

        let prisonRateMin, prisonRateMax;
        if (this.rd_prison == "1") {
            prisonRateMin = "0.0";

            if (this.FINE_TYPE == "1") {
                prisonRateMax = "0." + this.PRISON_RATE_LIMIT;
            } else {
                prisonRateMax = this.PRISON_RATE_LIMIT;
            }
        } else if (this.rd_prison == "2") {
            if (this.FINE_TYPE_START == "1") {
                prisonRateMin = "0." + this.PRISON_RATE_MIN;
            } else {

            }

            if (this.FINE_TYPE_END == "1") {
                prisonRateMax = "0." + this.PRISON_RATE_MAX;
            } else {
                prisonRateMax = this.PRISON_RATE_MAX;
            }
        }

        this.oLawPenalty = {
            // PENALTY_ID: this.PENALTY_ID,
            PENALTY_ID: 108,
            SECTION_ID: this.SECTION_ID,
            PENALTY_DESC: this.PENALTY_DESC,
            IS_FINE_PRISON: "",
            IS_FINE: IS_FINE,
            FINE_RATE_MIN: this.FINE_RATE_MIN,
            FINE_RATE_MAX: this.FINE_RATE_MAX,
            FINE_MIN: fineMin,
            FINE_MAX: fineMax,
            IS_IMPRISON: IS_IMPRISON,
            PRISON_RATE_MIN: prisonRateMin,
            PRISON_RATE_MAX: prisonRateMax,
            IS_TAX_PAID: IS_TAX_PAID,

            IS_ACTIVE: this.IS_ACTIVE
        }

        if (this.mode === 'C') {
            let LawPenaltyList = [];
            LawPenaltyList.push(this.oLawPenalty);

            this.oParam.masLawGroupSubSections = this.ListSubSection;
            this.oParam.masLawPenalties = LawPenaltyList;
        }

        //console.log(this.oParam);
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        let isSuccess: boolean = true;

        isSuccess = await this.MasService.getAPI1111("MasLawGroupSectioninsAll", this.oParam).then(item => {
            if (item.IsSuccess != "True")
                return false;
            else {
                this.SECTION_ID = item.SECTION_ID;
                return true;
            }
        }, (error) => { console.error(error); return false; });


        if (isSuccess) {
            swal('', Message.saveComplete, 'success');
            this.onComplete();
            this.ShowMasterData();
            this.preloader.setShowPreloader(false);

            this.router.navigate([`/msLawGroupSection/manage/R/${this.SECTION_ID}`]);
        }
        else {
            swal('', Message.saveFail, 'error');
            this.preloader.setShowPreloader(false);
        }
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        let isSuccess: boolean = true;

        isSuccess = await this.MasService.getAPI1111("MasLawGroupSectionpupdAll", this.oParam).then(item => {
            if (item.IsSuccess != "True")
                return false;
            else
                return true;
        }, (error) => { console.error(error); return false; });



        // ***************************************
        // -------------- SubSection -------------
        // ***************************************
        //#region 
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListSubSection.filter(f => f.IsNewItem == true).map(async m => {
                m.SECTION_ID = this.SECTION_ID;

                let response = await this.MasService.getAPI1111("MasLawGroupSubSectioninsAll", m).then(item => {
                    if (item.IsSuccess != "True")
                        return false;
                    else
                        return true;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListSubSection.filter(f => f.IsNewItem == false && f.IsDelItem == false).map(async m => {
                m.SECTION_ID = this.SECTION_ID;

                let response = await this.MasService.getAPI1111("MasLawGroupSubSectionupdAll", m).then(item => {
                    if (item.IsSuccess != "True")
                        return false;
                    else
                        return true;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListSubSection.filter(f => f.IsDelItem == true).map(async m => {
                m.SECTION_ID = this.SECTION_ID;
                m.IS_ACTIVE = 0;

                let response = await this.MasService.getAPI1111("MasLawGroupSubSectionupdAll", m).then(item => {
                    if (item.IsSuccess != "True")
                        return false;
                    else {
                        m.IsDelItem = false;
                        return true;
                    }
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }
        //#endregion


        if (isSuccess) {
            isSuccess = await this.MasService.getAPI1111("MasLawPenaltyupdAll", this.oLawPenalty).then(item => {
                if (item.IsSuccess != "True")
                    return false;
                else
                    return true;
            }, (error) => { console.error(error); return false; });
        }


        if (isSuccess) {
            swal('', Message.saveComplete, 'success');

            this.onComplete();
            this.ShowMasterData();
            this.preloader.setShowPreloader(false);
        }
        else {
            swal('', Message.saveFail, 'error');
            this.preloader.setShowPreloader(false);
        }
    }

    onComplete() {
        this.showEditField = true;
        this.EditButton.next(true);
        this.DeleteButton.next(true);

        this.CancelButton.next(false);
        this.SaveButton.next(false);
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


    // ***************************************
    // ------------- Dropdownlist -----------
    // ***************************************
    //#region 
    getLawGroupSection() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {}

        this.MasService.getAPI1111("MasLawGroupSectiongetByConAdv", paramsOther).then(async list => {
            this.LAW_GROUP_SECTION_LIST = list;

            this.getLawGroup();

            this.preloader.setShowPreloader(false);
        }, (error) => { console.error(error); return false; });
    }

    getLawGroup() {
        let lawGroup = [];
        this.getPart();

        lawGroup.push({ LAW_GROUP_NO: "", LAW_GROUP_NAME: "กรุณาเลือกชื่อหมวด" });

        this.LAW_GROUP_SECTION_LIST.forEach(element => {
            lawGroup.push({ LAW_GROUP_NO: element.LAW_GROUP_NO, LAW_GROUP_NAME: element.LAW_GROUP_NAME });
        });

        this.LAW_GROUP_LIST = Array.from(new Set(lawGroup.map(x => x.LAW_GROUP_NO)))
            .map(id => {
                return {
                    LAW_GROUP_NO: id,
                    LAW_GROUP_NAME: lawGroup.find(s => s.LAW_GROUP_NO === id).LAW_GROUP_NAME
                };
            });
    }

    getPart() {
        let partList = [];
        this.PART_LIST = [];

        this.isReq_lawGroupNo.next(false);
        this.PART_NO = "";

        partList.push({ PART_NO: "", PART_NAME: "กรุณาเลือกชื่อส่วน", LAW_GROUP_ID: "", });

        this.LAW_GROUP_SECTION_LIST.filter(f => f.LAW_GROUP_NO === this.LAW_GROUP_NO).forEach(element => {
            partList.push({ PART_NO: element.PART_NO, PART_NAME: element.PART_NAME, LAW_GROUP_ID: element.LAW_GROUP_ID });
        });

        this.PART_LIST = Array.from(new Set(partList.map(x => x.PART_NO)))
            .map(id => {
                return {
                    PART_NO: id,
                    PART_NAME: partList.find(s => s.PART_NO === id).PART_NAME,
                    LAW_GROUP_ID: partList.find(s => s.PART_NO === id).LAW_GROUP_ID
                };
            });
    }
    //#endregion



    // **********************************
    // ------------ SubSection ----------
    // **********************************
    //#region 
    AddSubSection() {
        let oItem = {
            SUBSECTION_SEQ: this.ListSubSection.length,
            SECTION_ID: "",
            SUBSECTION_ID: "",
            SUBSECTION_NO: "",
            SUBSECTION_NAME: "",
            SUBSECTION_DESC: "",
            IS_ACTIVE: 1,
            IsNewItem: true,
            IsDelItem: false,
        };

        this.ListSubSection.push(oItem);
    }

    DelSubSection(i: number) {
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
                this.ListSubSection.filter(f => f.SUBSECTION_SEQ == i).map(m => {
                    m.IsNewItem == false;
                    m.IsDelItem = true;
                })
            }
        })
    }
    //#endregion



    // **********************************
    // ------------ Validate ------------
    // **********************************
    //#region 
    MappingNullNumberData(str: string) {
        return str == 'null' || str == null || str == undefined ? 0 : +str;
    }

    validateFineRate() {
        const fineRateMin = this.MappingNullNumberData(this.FINE_RATE_MIN);
        const fineRateMax = this.MappingNullNumberData(this.FINE_RATE_MAX);

        if (fineRateMin != 0 && fineRateMax != 0 && fineRateMin > fineRateMax) {
            swal('', "ข้อมูลปรับเป็นจำนวนเท่าเริ่มต้นต้องน้อยกว่าหรือเท่ากับข้อมูลปรับเป็นจำนวนเท่าสิ้นสุด !!!", 'warning');
            this.FINE_RATE_MIN = this.FINE_RATE_MAX;
        }
    }

    validateFine() {
        const fineMin = this.MappingNullNumberData(this.FINE_MIN);
        const fineMax = this.MappingNullNumberData(this.FINE_MAX);

        if (fineMin != 0 && fineMax != 0 && fineMin > fineMax) {
            swal('', "ข้อมูลปรับเป็นจำนวนเงินเริ่มต้นต้องน้อยกว่าหรือเท่ากับข้อมูลปรับเป็นจำนวนเงินสิ้นสุด !!!", 'warning');
            this.FINE_MIN = this.FINE_MAX;
        }
    }

    ValidatePrisonRate() {
        let prisonRateMin = this.MappingNullNumberData(this.PRISON_RATE_MIN);
        let prisonRateMax = this.MappingNullNumberData(this.PRISON_RATE_MAX);

        if (this.FINE_TYPE_START == "2")
            prisonRateMin = prisonRateMin * 12;

        if (this.FINE_TYPE_END == "2")
            prisonRateMax = prisonRateMax * 12;

        if (prisonRateMin != 0 && prisonRateMax != 0 && prisonRateMin > prisonRateMax) {
            swal('', "ข้อมูลจำคุกเริ่มต้นต้องน้อยกว่าหรือเท่ากับข้อมูลจำคุกสิ้นสุด !!!", 'warning');
            this.PRISON_RATE_MIN = this.PRISON_RATE_MAX;
            this.FINE_TYPE_START = this.FINE_TYPE_END;
        }
    }

    clearRDFine() {
        if (this.rd_fine == "1") {
            this.FINE_MIN = "";
            this.FINE_MAX = "";
            this.FINE_TO = "";
        } else if (this.rd_fine == "2") {
            this.FINE_START = "";
            this.FINE_TO = "";
        } else if (this.rd_fine == "3") {
            this.FINE_START = "";
            this.FINE_MIN = "";
            this.FINE_MAX = "";
        } else {
            this.FINE_START = "";
            this.FINE_MIN = "";
            this.FINE_MAX = "";
            this.FINE_TO = "";
        }
    }

    clearRDPrison() {
        if (this.rd_prison == "1") {
            this.PRISON_RATE_MIN = "";
            this.FINE_TYPE_START = "1";
            this.PRISON_RATE_MAX = "";
            this.FINE_TYPE_END = "1";
        } else if (this.rd_prison == "2") {
            this.PRISON_RATE_LIMIT = "";
            this.FINE_TYPE = "1";
        } else {
            this.PRISON_RATE_MIN = "";
            this.FINE_TYPE_START = "1";
            this.PRISON_RATE_MAX = "";
            this.FINE_TYPE_END = "1";
            this.PRISON_RATE_LIMIT = "";
            this.FINE_TYPE = "1";
        }
    }

    checkValidate() {
        if (this.CHK_IS_FINE == false) {
            this.rd_fine = "";
            this.FINE_RATE_MIN = "";
            this.FINE_RATE_MAX = "";
            this.clearRDFine();
        }
    }

    checkValidatePrison() {
        if (this.CHK_IS_IMPRISON == false) {
            this.rd_prison = "";
            this.clearRDPrison();
        }
    }
    //#endregion
}
