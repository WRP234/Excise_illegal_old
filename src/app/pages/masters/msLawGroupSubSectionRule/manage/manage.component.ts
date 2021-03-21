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
import { BehaviorSubject, Observable } from '../../../../../../node_modules/rxjs';

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
    chk1: any;
    chk2: any;
    chk3: any;

    EFFECTIVE_DATE: any;
    EXPIRE_DATE: any;
    IS_ACTIVE: any;
    IS_PROVE: any;
    IS_COMPARE: any;

    SUBSECTION_RULE_ID: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SUBSECTION_ID: string;
    SUBSECTION_NAME: string;
    FINE_TYPE: string;
    PENALTY_DESC: string;
    FINE: string;
    FINE_AMOUNT_0: string;

    LAW_GROUP_SECTION_MODEL: any;
    LAW_GROUP_SUBSECTION_MODEL: any;
    ListLawGuiltbase = [];
    ListLawGuiltbaseFine = [];
    ListLawGroupSection = [];
    ListLawGroupSubSection = [];
    ListProductGroup = [];
    ListProductUnit = [];

    oParam: any;
    oLawPenalty: any;

    isReq_sectionName = new BehaviorSubject<boolean>(false);
    isReq_partNo = new BehaviorSubject<boolean>(false);
    isReq_subSectionName = new BehaviorSubject<boolean>(false);
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
        this.getProductGroup();
        this.getProductUnit();

        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        this.FINE_TYPE = "0";

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.SUBSECTION_RULE_ID = "Auto Generate";
            this.preloader.setShowPreloader(false);

            this.chk1 = true;
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
                        this.SUBSECTION_RULE_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            SUBSECTION_RULE_ID: this.SUBSECTION_RULE_ID
        }

        this.MasService.getAPI1111("MasLawGroupSubSectionRulegetByCon", paramsOther).then(list => {
            if (list) {
                if (list.masLawGroupSection) {
                    this.SECTION_ID = list.masLawGroupSection.SECTION_ID;
                    this.SECTION_NAME = list.masLawGroupSection.SECTION_NAME;
                }

                if (list.masLawGroupSubSection) {
                    this.SUBSECTION_ID = list.masLawGroupSubSection.SUBSECTION_ID;
                    this.SUBSECTION_NAME = list.masLawGroupSubSection.SUBSECTION_NAME;
                }

                if (list.EFFECTIVE_DATE) {
                    var EffDate = list.EFFECTIVE_DATE.toString().split(" ");
                    this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));
                }

                if (list.EFFECTIVE_DATE) {
                    var ExpDate = list.EFEXPIRE_DATE.toString().split(" ");
                    this.EXPIRE_DATE = setDateMyDatepicker(new Date(ExpDate[0]));
                }

                this.IS_ACTIVE = list.IS_ACTIVE;
                this.FINE_TYPE = list.FINE_TYPE;

                if (list.masLawGuiltbase.length > 0) {
                    this.IS_PROVE = list.masLawGuiltbase[0].IS_PROVE;
                    this.IS_COMPARE = list.masLawGuiltbase[0].IS_COMPARE;
                    this.FINE = list.masLawGuiltbase[0].FINE;
                    this.ListLawGuiltbase = list.masLawGuiltbase;

                    for (var i = 0; i < this.ListLawGuiltbase.length; i += 1) {
                        this.ListLawGuiltbase[i].GUILTBASE_SEQ = i;
                        this.ListLawGuiltbase[i].IsNewItem = false;
                        this.ListLawGuiltbase[i].IsDelItem = false;
                    }
                }

                if (list.masLawGroupSection) {
                    if (list.masLawGroupSection.masLawPenalties) {
                        this.PENALTY_DESC = list.masLawGroupSection.masLawPenalties.PENALTY_DESC;
                    }
                }

                this.preloader.setShowPreloader(false);
            } else {
                if (list.SUCCESS == false)
                    swal('', "ไม่พบข้อมูล", 'warning');

                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msLawGroupSubSectionRule/list']);
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
        // if (this.SECTION_ID == null || this.SECTION_ID == undefined || this.SECTION_ID == "") {
        //     this.isReq_sectionName.next(true);
        //     swal('', "กรุณาระบุข้อมูล 'มาตรา'", 'warning');

        //     return false;
        // }

        // if (this.SUBSECTION_ID == null || this.SUBSECTION_ID == undefined || this.SUBSECTION_ID == "") {
        //     this.isReq_subSectionName.next(true);
        //     swal('', "กรุณาระบุข้อมูล 'ชื่อข้อย่อย/วรรค'", 'warning');

        //     return false;
        // }



        // if (this.SECTION_DESC_1 == null || this.SECTION_DESC_1 == undefined || this.SECTION_DESC_1 == "") {
        //     this.isReq_sectionDesc1.next(true);
        //     swal('', "กรุณาระบุข้อมูล 'รายละเอียดมาตรา'", 'warning');

        //     return false;
        // }


        // const lsListLawGuiltbase = this.ListLawGuiltbase.filter(f => f.IsDelItem == false && f.GUILTBASE_NAME == "" );
        // if (this.ListLawGuiltbase.filter(f => f.IsDelItem == false).length == 0 || lsListLawGuiltbase.length > 0) {
        //     swal('', "กรุณาระบุข้อมูล 'ฐานความผิด (บัญชีรายละเอียดฐานความผิดและอัตราโทษ)' ให้ครบทุกช่อง", 'warning');

        //     return false;
        // }


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
            await this.setData();
            //await this.onUdp();
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
                    this.router.navigate(['/msLawGroupSubSectionRule/list']);
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
                    SUBSECTION_RULE_ID: this.SUBSECTION_RULE_ID
                }

                this.MasService.getAPI1111("MasLawGroupSubSectionRuleupdDelete", oParam).then(async item => {
                    if (item.IsSuccess) {
                        this.preloader.setShowPreloader(false);
                        swal('', Message.saveComplete, 'success');
                        this.router.navigate(['/msLawGroupSubSectionRule/list']);
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
        this.SUBSECTION_RULE_ID = `${this.SUBSECTION_RULE_ID == "Auto Generate" ? "" : this.SUBSECTION_RULE_ID}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EFFECTIVE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day;
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day;
        }

        this.oParam = {
            SUBSECTION_RULE_ID: this.SUBSECTION_RULE_ID,
            SUBSECTION_ID: this.SUBSECTION_ID,
            SECTION_ID: this.SECTION_ID,
            FINE_TYPE: this.FINE_TYPE,
            EFFECTIVE_DATE: setZeroHours(cvEffDate),
            EFEXPIRE_DATE: setZeroHours(cvExpDate),
            IS_ACTIVE: 1,
            masLawGuiltbase: [],
            masLawGuiltbaseFines: []
        }

        this.ListLawGuiltbase.map(m => {
            m.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
            m.IS_PROVE = `${this.chk2 ? "1" : "0"}`;
            m.IS_COMPARE = `${this.chk3 ? "1" : "0"}`;
            m.FINE = this.FINE;
        });

        if (this.FINE_TYPE == "0") {
            let c = this.ListLawGuiltbaseFine.filter(f => f.IsDelItem == false && f.FINE_TYPE == 0);

            if (c.length == 0) {
                let oItem = {
                    FINE_ID: "",
                    SUBSECTION_RULE_ID: this.SUBSECTION_RULE_ID,
                    FINE_AMOUNT: this.FINE_AMOUNT_0.replace(/,/g, ""),
                    IS_ACTIVE: 1,
                    IsNewItem: true,
                    IsDelItem: false,
                };

                this.ListLawGuiltbaseFine.push(oItem);
            }
        }
        else {
            this.ListLawGuiltbaseFine.map(m => {
                m.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
                m.FINE_AMOUNT = m.FINE_AMOUNT.replace(/,/g, "");

                if (m.IsCheck == true) {
                    m.MISTREAT_TO_NO = m.MISTREAT_START_NO;
                } else {
                    m.MISTREAT_TO_NO = "";
                }
            });
        }

        console.log(this.ListLawGuiltbase);
        console.log(this.ListLawGuiltbaseFine);
    }

    async onIns() {
        //this.preloader.setShowPreloader(true);
        await this.setData();

        // let isSuccess: boolean = true;

        // isSuccess = await this.MasService.getAPI1111("MasLawGroupSubSectionRuleinsAll", this.oParam).then(item => {
        //     if (item.IsSuccess != "True")
        //         return false;
        //     else {
        //         this.SUBSECTION_RULE_ID = item.SUBSECTION_RULE_ID;
        //         return true;
        //     }
        // }, (error) => { console.error(error); return false; });

        // if (isSuccess) {
        //     let lsResult = [];
        //     lsResult = await Promise.all(this.ListLawGuiltbase.filter(f => f.IsDelItem == false).map(async m => {
        //         m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;

        //         let response = await this.MasService.getAPI1111("MasLawGuiltbaseinsAll", m).then(item => {
        //             if (item.IsSuccess != "True")
        //                 return false;
        //             else
        //                 return true;
        //         }, (error) => { console.error(error); return false; });

        //         return response;
        //     }));

        //     isSuccess = lsResult.filter(f => false).length == 0;
        // }

        // if (isSuccess) {
        //     let lsResult = [];
        //     lsResult = await Promise.all(this.ListLawGuiltbaseFine.filter(f => f.IsDelItem == false).map(async m => {
        //         m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;

        //         let response = await this.MasService.getAPI1111("MasLawGuiltbaseFineinsAll", m).then(item => {
        //             if (item.IsSuccess != "True")
        //                 return false;
        //             else
        //                 return true;
        //         }, (error) => { console.error(error); return false; });

        //         return response;
        //     }));

        //     isSuccess = lsResult.filter(f => false).length == 0;
        // }


        // if (isSuccess) {
        //     swal('', Message.saveComplete, 'success');
        //     this.onComplete();
        //     this.ShowMasterData();
        //     this.preloader.setShowPreloader(false);

        //     this.router.navigate([`/msLawGroupSubSectionRule/manage/R/${this.SUBSECTION_RULE_ID}`]);
        // }
        // else {
        //     swal('', Message.saveFail, 'error');
        //     this.preloader.setShowPreloader(false);
        // }
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        let isSuccess: boolean = true;

        isSuccess = await this.MasService.getAPI1111("MasLawGroupSubSectionRuleupdAll", this.oParam).then(item => {
            if (item.IsSuccess != "True")
                return false;
            else
                return true;
        }, (error) => { console.error(error); return false; });



        // *********************************************
        // -------------- ListLawGuiltbase -------------
        // *********************************************
        //#region 
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListLawGuiltbase.filter(f => f.IsNewItem == true).map(async m => {
                m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;

                let response = await this.MasService.getAPI1111("MasLawGuiltbaseinsAll", m).then(item => {
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
            lsResult = await Promise.all(this.ListLawGuiltbase.filter(f => f.IsNewItem == false && f.IsDelItem == false).map(async m => {
                m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;

                let response = await this.MasService.getAPI1111("MasLawGuiltbaseupdAll", m).then(item => {
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
            lsResult = await Promise.all(this.ListLawGuiltbase.filter(f => f.IsDelItem == true).map(async m => {
                m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;
                m.IS_ACTIVE = 0;

                let response = await this.MasService.getAPI1111("MasLawGuiltbaseupdAll", m).then(item => {
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



        // ***************************************
        // -------------- ListLawGuiltbaseFine -------------
        // ***************************************
        //#region 
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListLawGuiltbaseFine.filter(f => f.IsDelItem == true).map(async m => {
                m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;
                m.IS_ACTIVE = 0;

                let response = await this.MasService.getAPI1111("MasLawGuiltbaseFineupdAll", m).then(item => {
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

        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.ListLawGuiltbaseFine.filter(f => f.IsDelItem == false).map(async m => {
                m.SUBSECTION_RULE_ID = this.SUBSECTION_RULE_ID;

                let response = await this.MasService.getAPI1111("MasLawGuiltbaseFineinsAll", m).then(item => {
                    if (item.IsSuccess != "True")
                        return false;
                    else
                        return true;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }
        //#endregion


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

    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`
    }
    //#endregion


    // **********************************
    // ------------ LawGuiltbase ----------
    // **********************************
    //#region 
    AddLawGuiltbase() {
        let oItem = {
            GUILTBASE_SEQ: this.ListLawGuiltbase.length,
            GUILTBASE_ID: "",
            SUBSECTION_RULE_ID: "",
            GUILTBASE_NAME: "",
            FINE: "",
            IS_PROVE: "",
            IS_COMPARE: "",
            REMARK: "",
            IS_ACTIVE: 1,
            IsNewItem: true,
            IsDelItem: false,
        };

        this.ListLawGuiltbase.push(oItem);
    }

    DelLawGuiltbase(i: number) {
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
                this.ListLawGuiltbase.filter(f => f.GUILTBASE_SEQ == i).map(m => {
                    m.IsNewItem == false;
                    m.IsDelItem = true;
                })
            }
        })
    }
    //#endregion


    // **********************************
    // ------------ LawGuiltbase ----------
    // **********************************
    //#region 
    AddLawGuiltbaseFine() {
        let oItem = {
            FINE_SEQ: this.ListLawGuiltbaseFine.length,
            FINE_ID: "",
            SUBSECTION_RULE_ID: "",
            PRODUCT_GROUP_ID: "",
            MISTREAT_START_NO: "",
            MISTREAT_TO_NO: "",
            IS_FINE: "",
            FINE_RATE: "",
            MISTREAT_DESC: "",
            MISTREAT_START_VOLUMN: "",
            MISTREAT_TO_VOLUMN: "",
            MISTREAT_START_UNIT: "",
            MISTREAT_TO_UNIT: "",
            FINE_AMOUNT: "",
            FINE_TAX: "",
            STATUS_VOLUMN: "0",
            IS_ACTIVE: 1,
            IsNewItem: true,
            IsDelItem: false
        };

        this.ListLawGuiltbaseFine.push(oItem);
    }

    DelLawGuiltbaseFine(i: number) {
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
                this.ListLawGuiltbaseFine.filter(f => f.FINE_SEQ == i).map(m => {
                    m.IsNewItem == false;
                    m.IsDelItem = true;
                })
            }
        })
    }
    //#endregion



    // ********************************************
    // ------------ MasLawGroupSection ------------
    // ********************************************
    //#region 
    async getLawGroupSection() {
        this.preloader.setShowPreloader(true);
        await this.MasService.getAPI1111("MasLawGroupSectiongetByKeyword", { "TEXT_SEARCH": "" }).then(list => {
            if (list.length > 0) {
                this.ListLawGroupSection = list;
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchLawGroupSection = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.ListLawGroupSection
                    .filter(v => this.MappingNullData(v.SECTION_NAME).toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_LawGroupSection = (x: { SECTION_NAME: string }) => x.SECTION_NAME;

    async LawGroupSectionSelectItem(event) {
        this.SECTION_ID = event.item.SECTION_ID;
        this.SUBSECTION_ID = "";
        this.SUBSECTION_NAME = "";

        await this.getLawGroupSubSection();
    }

    LawGroupSectionClear() {
        if (typeof this.LAW_GROUP_SECTION_MODEL == "object") {
            this.SECTION_ID = "";
            this.LAW_GROUP_SUBSECTION_MODEL = null;
            this.SUBSECTION_ID = "";
            this.SUBSECTION_NAME = "";
        }
    }
    //#endregion



    // ***********************************************
    // ------------ MasLawGroupSubSection ------------
    // ***********************************************
    //#region 
    async getLawGroupSubSection() {
        this.preloader.setShowPreloader(true);
        await this.MasService.getAPI1111("MasLawGroupSectiongetByCon", { "SECTION_ID": this.SECTION_ID }).then(list => {
            if (list) {
                if (list.masLawGroupSubSections.length > 0) {
                    this.ListLawGroupSubSection = list.masLawGroupSubSections;
                }
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchLawGroupSubSection = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.ListLawGroupSubSection
                    .filter(v => this.MappingNullData(v.SUBSECTION_NAME).toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_LawGroupSubSection = (x: { SUBSECTION_NAME: string }) => x.SUBSECTION_NAME;

    LawGroupSubSectionSelectItem(event) {
        this.SUBSECTION_ID = event.item.SUBSECTION_ID;
    }

    LawGroupSubSectionClear() {
        if (typeof this.LAW_GROUP_SUBSECTION_MODEL == "object") {
            this.SUBSECTION_ID = "";
        }
    }
    //#endregion



    // ***********************************************
    // ------------ MasLawGroupSubSection ------------
    // ***********************************************
    //#region 

    //#endregion


    // ***********************************************
    // ----------------- ProductGroup ----------------
    // ***********************************************
    //#region 
    async getProductGroup() {
        this.preloader.setShowPreloader(true);
        await this.MasService.getAPI1111("MasProductGroupgetByCon", { "PRODUCT_GROUP_ID": "" }).then(list => {
            if (list) {
                if (list.length > 0) {
                    this.ListProductGroup = list;
                }
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchProductGroup = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.ListProductGroup
                    .filter(v => this.MappingNullData(v.PRODUCT_GROUP_NAME).toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_ProductGroup = (x: { PRODUCT_GROUP_NAME: string }) => x.PRODUCT_GROUP_NAME;

    ProductGroupSelectItem(event, item) {
        item.PRODUCT_GROUP_ID = event.item.PRODUCT_GROUP_ID;
    }

    ProductGroupClear(item) {
        if (typeof item.PRODUCT_GROUP_MODEL == "object") {
            item.PRODUCT_GROUP_ID = "";
        }
    }

    //#endregion  



    // ***********************************************
    // ------------------ ProductUnit ----------------
    // ***********************************************
    //#region 
    async getProductUnit() {
        this.preloader.setShowPreloader(true);
        await this.MasService.getAPI2222("MasProductUnitgetByKeyword", { "TEXT_SEARCH": "" }).then(list => {
            if (list) {
                if (list.RESPONSE_DATA.length > 0) {
                    this.ListProductUnit = list.RESPONSE_DATA;
                }
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchProductUnit = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.ListProductUnit
                    .filter(v => this.MappingNullData(v.UNIT_NAME_TH).toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_ProductUnit = (x: { UNIT_NAME_TH: string }) => x.UNIT_NAME_TH;

    ProductUnitSelectItem(event, item) {
        item.MISTREAT_START_UNIT = event.item.UNIT_ID;
    }

    ProductUnitClear(item) {
        if (typeof item.MISTREAT_START_UNIT_MODEL == "object") {
            item.MISTREAT_START_UNIT = "";
        }
    }

    ProductUnitToSelectItem(event, item) {
        item.MISTREAT_TO_UNIT = event.item.UNIT_ID;
    }

    ProductUnitToClear(item) {
        if (typeof item.MISTREAT_TO_UNIT_MODEL == "object") {
            item.MISTREAT_TO_UNIT = "";
        }
    }

    //#endregion  


    VaridateNumber(event) {
        let e = <KeyboardEvent>event;
        if (e.keyCode > 31 && ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 44 && e.keyCode != 46)) {
            return false;
        }
        return true;
    }

    FineAmountFormat(element) {
        element.target.value = (+element.target.value.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    changeFineType() {
        if (this.FINE_TYPE != "0") {
            this.FINE_AMOUNT_0 = "";
        }

        if (this.mode == 'C')
            this.ListLawGuiltbaseFine = [];
        else {
            this.ListLawGuiltbaseFine.map(m => {
                m.IsDelItem = true;
            })
        }
    }
}
