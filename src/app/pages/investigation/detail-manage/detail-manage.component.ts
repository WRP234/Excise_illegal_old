import { LawbreakerTypes, EntityTypes } from '../../../models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { setDateMyDatepicker, compareDate, getDateMyDatepicker, setZeroHours } from 'app/config/dateFormat';
import { IMyDateModel } from 'mydatepicker-th';
import { Message } from 'app/config/message';
import * as fromModels from '../models';
import * as fromServices from '../services';
import { LoaderService } from 'app/core/loader/loader.service';
import { replaceFakePath } from 'app/config/dataString';
import { TransactionRunningService } from 'app/services/transaction-running.service';
import { TransactionRunning } from 'app/models/transaction-running.model';
import { MasDocumentMainService } from 'app/services/mas-document-main.service';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import swal from 'sweetalert2';
import { clearFormArray, sortingArray, IntialLastRowID } from 'app/pages/arrests/arrest.helper';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/Rx';
import { MasStaffService } from '../services';
import { MasterService } from '../services/master.service';
import { Document, FileType, ImageDocument } from '../investigation-document';
import { detailManageConfig } from './detail-manage.config';
import { InvestProductFormControl } from '../models/investigate-product'

@Component({
    selector: 'app-investigate-detail-manage',
    templateUrl: './detail-manage.component.html',
    styleUrls: ['./detail-manage.component.scss']
})
export class DetailManageComponent extends detailManageConfig implements OnInit, OnDestroy {

    constructor(
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private navService: NavigationService,
        private loaderService: LoaderService,
        private s_transactionRunning: TransactionRunningService,
        private s_invest: fromServices.InvestgateService,
        private s_investDetail: fromServices.InvestgateDetailService,
        private s_document: MasDocumentMainService,
        private router: Router,
        private sidebarService: SidebarService,
        private s_masStaff: MasStaffService,
        private s_MasMaster: MasterService,
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.setVersion(this.s_invest.version);
        this.MasProductGroup();
        this.stateInvest = {
            INVESTIGATE_CODE: '',
            INVESTIGATE_NO: '',
            INVESTIGATE_NO_YEAR: '',
            DATE_START: '',
            DATE_END: '',
            SUBJECT: '',
            IS_ACTIVE: 0,
            INVESTIGATE_DETAIL: [],
        }
        this.createForm();
        this.setDefaultStaff();

        combineLatest(this.activeRoute.params, this.activeRoute.queryParams)
            .map(results => ({ params: results[0], queryParams: results[1] }))
            .takeUntil(this.destroy$)
            .subscribe(p => {
                this.mode = p.params.mode;
                this.investMode = p.queryParams.investMode;
                this.investCode = p.queryParams.investCode;
                this.invesDetailId = p.queryParams.invesDetailId;
                this.investigateSeq = p.queryParams.investigateSeq;
                this.investNo = p.queryParams.investNo;
                this.investYear = p.queryParams.investYear;
                this.investSubject = p.queryParams.investSubject;
                this.SysdateStrat = setDateMyDatepicker(new Date(p.queryParams.investDStart));
                this.SysdateEnd = setDateMyDatepicker(new Date(p.queryParams.investDEnd));

                this.dateTimeStart = p.queryParams.investDStart;
                this.dateTimeEnd = p.queryParams.investDEnd;

                this.dateFromOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

                this.dateToOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

                switch (this.mode) {
                    case 'C':
                        this.showEditField = true;
                        this.investigateFG.patchValue({
                            InvestigateSeq: this.investigateSeq
                        })
                        this.setButton();
                        this.loadMasterData();
                        break;
                    case 'R':
                        this.showEditField = false;
                        // this.resetConfig();
                        this.onPageLoad();
                        break;
                }
            });

        // this.navService.onEdit
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnEdit(false);
        //             this.onEdit();
        //         }
        //     })

        // this.navService.onCancel
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnCancel(false);
        //             swal({
        //                 title: '',
        //                 text: Message.confirmAction,
        //                 type: 'warning',
        //                 showCancelButton: true,
        //                 confirmButtonColor: '#3085d6',
        //                 cancelButtonColor: '#d33',
        //                 confirmButtonText: 'Confirm!'
        //             }).then((result) => {
        //                 if (result.value) {
        //                     this.onCancel();
        //                 }
        //             })
        //         }
        //     })

        // this.navService.onSave
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnSave(false);
        //             this.onSave();
        //         }
        //     });

        // this.navService.onDelete
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnDelete(false);
        //             this.onDelete();
        //         }
        //     });

        // this.navService.onPrint
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnPrint(false);
        //             this.modal = this.ngbModel.open(this.printDocModal, { size: 'lg', centered: true });
        //         }
        //     })

        // this.navService.onNextPage
        //     .takeUntil(this.destroy$)
        //     .subscribe(async status => {
        //         if (status) {
        //             await this.navService.setOnNextPage(false);
        //             this.navigateToManage();
        //         }
        //     })
    }
    ngAfterViewInit(): void {
        // this.addStaff();    
    }

    private resetConfig() {
        // let routerConfig = this.router['config'];
        // console.log(routerConfig);
        // routerConfig
        //     .find(x => x.path == 'investigation')['_loadedConfig'].routes // core investigation path
        //     .filter(x => x.path.indexOf('detail-manage') >= 0) // curent path
        //     .map(x => {
        //         x.data.urls
        //             .find(y => y.url.indexOf('investigation/manage') >= 0)
        //             .url = `/investigation/manage/R/${this.investCode}/${this.invesDetailId}`; // previous path
        //         return x;
        //     })
        // this.router.resetConfig(routerConfig);
        // this.router.navigateByUrl('/investigation/manage/R/' + this.investCode + '/' + this.invesDetailId);
        this.navigateToManage();
    }

    setButton() {
        if (this.mode === 'C') {
            this.enableBtnCreate();
        } else if (this.mode === 'R') {
            this.enableBtnEdit();
        }
    }

    enableBtnCreate() {
        // set false
        this.printButton.next(false);
        this.editButton.next(false);
        this.deleteButton.next(false);
        this.cancelButton.next(true);
        this.saveButton.next(true);
        this.isEdit = false;
    }

    enableBtnEdit() {
        // set false
        this.printButton.next(true);
        this.editButton.next(true);
        this.deleteButton.next(true);
        this.cancelButton.next(false);
        this.saveButton.next(false);
        this.isEdit = true;
    }

    onClickEditField() {
        /** set false */
        this.editButton.next(false)
        this.deleteButton.next(false);
        this.printButton.next(false);
        this.showEditField = true;
        /** set true */
        this.saveButton.next(true);
        this.cancelButton.next(true);
    }

    onClickDelete() {
        this.onDelete();
    }

    private async loadMasterData() {
        this.loaderService.show();
        this.loaderService.hide();
    }

    async onPageLoad() {
        this.loaderService.show();
        this.setButton();

        console.log(this.invesDetailId);
        this.card2.next(true);
        this.card3.next(true);
        this.card4.next(true);
        this.card5.next(true);
        this.card6.next(true);
        this.card7.next(true);
        let invest = await this.s_investDetail.InvestigateDetailgetByCon(this.invesDetailId)
            .then(async (x: any) => {
                console.log(x)
                if (!this.checkResponse(x)) return;
                x.DATE_START = setDateMyDatepicker(x.DATE_START);
                x.DATE_END = setDateMyDatepicker(x.DATE_END);
                // x.INVESTIGATE_SEQUENCE = this.investigateSeq
                this.investId = x.INVESTIGATE_ID;

                this.investigateFG.patchValue({
                    InvestigateDetailID: x.INVESTIGATE_DETAIL_ID,
                    InvestigateCode: '',
                    InvestigateSeq: x.INVESTIGATE_SEQUENCE,
                    StationCode: x.OFFICE_CODE,
                    StationName: x.OFFICE_NAME,
                    InvestigateDateStart: x.DATE_START,
                    InvestigateDateEnd: x.DATE_END,
                    ConfidenceOfNews: x.CONFIDENCE_OF_NEWS,
                    ValueOfNews: x.VALUE_OF_NEWS,
                    InvestigateDetail: x.INVESTIGATE_DETAIL_DESCRIPTION,
                    IsActive: x.IS_ACTIVE,
                    InvestigateDetailStaff: x.InvestigateDetailStaff || [],
                    InvestigateDetailProduct: x.InvestigateDetailProduct || [],
                    InvestigateDetailLocal: x.InvestigateDetailLocale || [],
                    InvestigateDetailSuspect: x.InvestigateDetailSuspect || []
                });

                /** NoticeProducts */
                const product = x.InvestigateDetailProduct.filter(item => item.IS_ACTIVE == 1);
                product.map(item => {
                    for (var key in item) {
                        if (item[key] === 'null')
                            item[key] = '';
                    }
                    item.IsNewItem = false;
                })

                this.DuplicatePorductGroup(product);

                await this.pageRefreshStaff(x.InvestigateDetailStaff);
                await this.pageRefreshSuspect(x.InvestigateDetailSuspect);
                await this.pageRefreshProduct(x.InvestigateDetailProduct);
                await this.pageRefreshLocale(x.InvestigateDetailLocale);

                await this.s_invest.GetDocumentByCon(2, this.invesDetailId).subscribe(async res => {
                    this.fileList = [];
                    let temp: any;
                    temp = res;
                    temp.map(m => {
                        if (m.IS_ACTIVE === "1") {
                            let f = m;
                            let idx = f.FILE_PATH.lastIndexOf('.');
                            let FILE_TYPE = (idx < 1) ? "" : f.FILE_PATH.substr(idx + 1);
                            switch (FILE_TYPE) {
                                case FileType.xlsx:
                                case FileType.xls:
                                    m.IMAGE_SHOW = ImageDocument.xlsx;
                                    break;

                                case FileType.doc:
                                case FileType.docx:
                                    m.IMAGE_SHOW = ImageDocument.docx;
                                    break;

                                case FileType.pdf:
                                    m.IMAGE_SHOW = ImageDocument.pdf;
                                    break;
                                case FileType.jpg:
                                case FileType.jpeg:
                                case FileType.png:
                                case FileType.gif:
                                    m.IMAGE_SHOW = this.s_invest.getImage(f.DOCUMENT_ID);
                                    break;
                            }
                            this.fileList.push(m);
                        }
                    })
                })

            })
        Promise.all([invest]);
        this.loaderService.hide();
    }

    private async pageRefreshStaff(staff: fromModels.InvestigateDetailStaffUppercase[]) {
        await staff.map((y, index) => {
            y.RowId = index + 1;
            y.IsModify = 'r';
            y.IsNewItem = false;
            y.FULL_NAME = `${y.TITLE_NAME_TH} ${y.FIRST_NAME} ${y.LAST_NAME}`;
        });
        this.setItemFormArray(staff, 'InvestigateDetailStaff');
    }

    private async pageRefreshSuspect(suspect: fromModels.InvestigateDetailSuspectUppercase[]) {
        await suspect.map((y, index) => {
            y = this.setViewSuspect(y);
            y.RowId = index + 1;
            y.IsModify = 'r';
            y.IsNewItem = false;
            y.FULL_NAME = `${y.TITLE_NAME_TH} ${y.FIRST_NAME} ${y.LAST_NAME}`;
            return y;
        });
        this.setItemFormArray(suspect, 'InvestigateDetailSuspect');
    }

    private async pageRefreshProduct(product: fromModels.InvestigateDetailProductUppercase[]) {
        await product.map((y, index) => {
            y.RowId = index + 1;
            y.IsModify = 'r';
            y.IsNewItem = false;
        });
        this.setItemFormArray(product, 'InvestigateDetailProduct');
    }

    private async pageRefreshLocale(locale: fromModels.InvestigateDetailLocalUppercase[]) {
        const locale$ = await locale.reduce((accu, curr, index) => {
            const la = curr.GPS ? curr.GPS.split(',')[0] : null;
            const lo = curr.GPS ? curr.GPS.split(',')[1] : null;
            for (var key in curr) {
                if (curr[key] === 'null') curr[key] = null;
            }
            const o = [
                ...accu,
                {

                    ...curr,
                    LATITUDE: (la && la != 'null') ? la : null,
                    LONGITUDE: (lo && lo != 'null') ? lo : null,
                    LOCATION: '', //api ไม่ return
                    RowId: index + 1,
                    IsModify: 'r',
                    IsNewItem: false,
                    Region: `${curr.SUB_DISTRICT_NAME_TH} ${curr.DISTRICT_NAME_TH} ${curr.PROVINCE_NAME_TH}`
                }
            ];

            return o;
        }, []);
        this.setItemFormArray(locale$, 'InvestigateDetailLocal');
    }

    private setViewSuspect(item: fromModels.InvestigateDetailSuspectUppercase) {
        if (LawbreakerTypes.find(key => parseInt(key.value) == item.PERSON_TYPE)) {
            item.TYPE_NAME = LawbreakerTypes.find(key => parseInt(key.value) == item.PERSON_TYPE).text;
        } else {
            item.TYPE_NAME = 'ไม่ระบุ';
        }
        if (EntityTypes.find(key => parseInt(key.value) == item.ENTITY_TYPE)) {
            item.ENTITY_TYPE_NAME = EntityTypes.find(key => parseInt(key.value) == item.ENTITY_TYPE).text;
        } else {
            item.ENTITY_TYPE_NAME = 'ไม่ระบุ';
        }
        item.PERSON_TYPE_NAME = this.getPersonTypeName(item.PERSON_TYPE)

        // item.EntityType = item.EntityType;
        // item.SuspectReferenceID = item.SuspectID;
        item.FULL_NAME = `${item.TITLE_NAME_TH || ''}`;
        item.FULL_NAME += ` ${item.FIRST_NAME || ''}`;
        item.FULL_NAME += ` ${item.LAST_NAME || ''}`;
        switch (item.ENTITY_TYPE) {
            case 0: // ไม่ระบุ
                item.REFERENCE_ID = item.ID_CARD;
                break;
            case 1: // บุคคลธรรมดา
                switch (item.PERSON_TYPE) {
                    case 0: // ต่างชาติ
                        item.REFERENCE_ID = item.PASSPORT_NO;
                        break;
                    case 1: // ชาวไทย
                        item.REFERENCE_ID = item.ID_CARD;
                        break;
                }
                break;
            case 2: // นิติบุคคล
                item.REFERENCE_ID = item.COMPANY_REGISTRATION_NO;
                break;
        }
        return item;
    }

    public onSDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            d.setDate(d.getDate() - 1);
            this.dateToOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else {
            this.dateToOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    public onEDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            this.dateFromOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
                    end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
                }]
            }
        } else {
            this.dateFromOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    // private checkDate() {
    //     if (this.investigateFG.value.InvestigateDateStart && this.investigateFG.value.InvestigateDateEnd) {

    //         let sdate = getDateMyDatepicker(this.investigateFG.value.InvestigateDateStart);
    //         let edate = getDateMyDatepicker(this.investigateFG.value.InvestigateDateEnd);

    //         if (!compareDate(sdate, edate)) {
    //             swal('', Message.checkDate, 'warning')
    //             setTimeout(() => {
    //                 this.SysdateEnd = setDateMyDatepicker(this.investigateFG.value.InvestigateDateStart);
    //                 // this.investigateFG.patchValue({
    //                 //     InvestigateDateEnd: setDateMyDatepicker(this._dateStartFrom)
    //                 // })
    //             }, 0);
    //         }
    //     }
    // }

    private sortFormArray(o: FormArray) {
        let sort = sortingArray(o.value, 'RowId');
        sort.forEach(($, i1) => o.at(i1).patchValue($));
    }

    private deleteFormArray(o: FormArray, i: number) {
        const arr = o.value.filter($ => $.IsModify == 'd');
        const RowId = arr.length
            ? arr.reduce((max, p) => p.RowId > max ? p.RowId : max, arr[0].RowId) + 1
            : IntialLastRowID;
        o.at(i).patchValue({ IsModify: 'd', RowId: RowId });
        sortingArray(o.value, 'RowId').forEach(($, i1) => o.at(i1).patchValue($));
    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.investigateFG.setControl(formControl, itemFormArray);
        }
    }

    endLoader = () => this.loaderService.hide();

    getPersonTypeName(item: any) {
        // item = item.value;
        if (item == 0) {
            return this._LawbreakerTypes_New[1].text
        } else if (item == 1) {
            return this._LawbreakerTypes_New[0].text
        } else return "";
    }
    getEntityTypeName(item: any) {
        // item = item.value;
        if (item == 0) {
            return this.entityTypes[0].text
        } else if (item == 1) {
            return this.entityTypes[1].text
        } else return "";
    }

    getRefer(item: any) {
        item = item.value;
        if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 0) {
            return item.ID_CARD || '';
        } else if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 1) {
            return item.PASSPORT_NO || '';
        } else if (item.ENTITY_TYPE == 1) {
            return item.COMPANY_REGISTRATION_NO || '';
        } else {
            return "";
        }
    }

    addSuspect(suspect: any[]) {
        if (suspect.length) {
            suspect.map(item => {
                let investSuspect = {
                    SUSPECT_ID: '',
                    PERSON_ID: item.PERSON_ID || "",
                    TITLE_ID: item.TITLE_ID || "",
                    PERSON_TYPE: item.PERSON_TYPE || "",
                    PERSON_TYPE_NAME: this.getPersonTypeName(item.PERSON_TYPE),
                    ENTITY_TYPE: item.ENTITY_TYPE || "",
                    ENTITY_TYPE_NAME: this.getEntityTypeName(item.ENTITY_TYPE),
                    TITLE_NAME_TH: item.TITLE_NAME_TH || "",
                    TITLE_NAME_EN: item.TITLE_NAME_EN || "",
                    TITLE_SHORT_NAME_TH: item.TITLE_SHORT_NAME_TH || "",
                    TITLE_SHORT_NAME_EN: item.TITLE_SHORT_NAME_EN || "",
                    FIRST_NAME: item.FIRST_NAME || "",
                    MIDDLE_NAME: item.MIDDLE_NAME || "",
                    LAST_NAME: item.LAST_NAME || "",
                    OTHER_NAME: item.OTHER_NAME || "",
                    FULL_NAME: item.FULL_NAME || "",
                    COMPANY_NAME: item.COMPANY_NAME || "",
                    COMPANY_REGISTRATION_NO: item.COMPANY_REGISTRATION_NO || "",
                    EXCISE_REGISTRATION_NO: item.EXCISE_REGISTRATION_NO || "",
                    ID_CARD: item.ID_CARD || "",
                    AGE: item.AGE || "",
                    PASSPORT_NO: item.PASSPORT_NO || "",
                    CAREER: item.CAREER || "",
                    PERSON_DESC: item.PERSON_DESC || "",
                    EMAIL: item.EMAIL || "",
                    TEL_NO: item.TEL_NO || "",
                    MISTREAT_NO: item.MISTREAT_NO || 0,
                    IS_ACTIVE: 1,
                    IsNewItem: true
                }

                this.InvestigateDetailSuspect.push(this.fb.group(investSuspect))
                this.sortFormArray(this.InvestigateDetailSuspect);
            })
        }
    }

    addStaff() {
        const lastIndex = this.InvestigateDetailStaff.value.filter(x => x.IsModify != 'd').length - 1;
        console.log(lastIndex)
        let item = new fromModels.InvestigateDetailStaffUppercase();
        item.CONTRIBUTOR_ID = null;
        item.FIRST_NAME = null;
        item.INVESTIGATE_DETAIL_ID = null;
        item.IS_ACTIVE = 1;
        item.LAST_NAME = null;
        item.OPERATION_DEPT_CODE = null;
        item.OPERATION_DEPT_LEVEL = null;
        item.OPERATION_DEPT_NAME = null;
        item.OPERATION_OFFICE_CODE = null;
        item.OPERATION_OFFICE_NAME = null;
        item.OPERATION_OFFICE_SHORT_NAME = null;
        item.OPERATION_POS_CODE = null;
        item.OPERATION_POS_LEVEL_NAME = null;
        item.OPREATION_POS_LEVEL = null;
        item.OPREATION_POS_NAME = null;
        item.STAFF_CODE = null;
        item.STAFF_ID = null;
        item.STAFF_TYPE = null;
        item.TITLE_ID = null;
        item.TITLE_NAME_TH = null;
        item.StaffFullName = null;
        item.FULL_NAME = null;
        item.IsModify = 'c';

        if (lastIndex >= 0) {
            const lastDoc = this.InvestigateDetailStaff.at(lastIndex).value;
            if (lastDoc.CONTRIBUTOR_ID) {
                item.RowId = lastDoc.RowId + 1;
                this.InvestigateDetailStaff.push(this.fb.group(item));
            }
        } else {
            item.RowId = 1;
            this.InvestigateDetailStaff.push(this.fb.group(item));
        }
        // this.sortFormArray(this.InvestigateDetailStaff);
    }

    addLocal() {
        const lastIndex = this.InvestigateDetailLocal.value.filter(x => x.IsModify != 'd').length - 1;
        let item = new fromModels.InvestigateDetailLocalUppercase();

        item.ADDRESS_NO = null;
        item.ADDRESS_STATUS = null;
        item.ADDRESS_TYPE = null;
        item.ALLEY = null;
        item.ARREST_ID = null;
        item.BUILDING_NAME = null;
        item.DISTRICT_NAME_EN = null;
        item.DISTRICT_NAME_TH = null;
        item.FLOOR = null;
        item.GPS = null;
        item.IS_ACTIVE = null;
        item.LANE = null;
        item.LATITUDE = null;
        item.LOCALE_ID = null;
        item.LONGITUDE = null;
        item.LOCATION = null;
        item.POLICE_STATION = null;
        item.PROVINCE_NAME_EN = null;
        item.PROVINCE_NAME_TH = null;
        item.ROAD = null;
        item.ROOM_NO = null;
        item.SUB_DISTRICT_ID = null;
        item.SUB_DISTRICT_NAME_EN = null;
        item.SUB_DISTRICT_NAME_TH = null;
        item.VILLAGE_NAME = null;
        item.VILLAGE_NO = null;
        item.IsModify = 'c';
        item.Region = null;
        if (lastIndex >= 0) {
            const lastDoc = this.InvestigateDetailLocal.at(lastIndex).value;
            console.log(lastDoc)
            if (lastDoc.SUB_DISTRICT_ID) {
                item.RowId = lastDoc.RowId;
                this.InvestigateDetailLocal.push(this.fb.group(item));
            }
        } else {
            item.RowId = 1;
            this.InvestigateDetailLocal.push(this.fb.group(item));
        }
        this.sortFormArray(this.InvestigateDetailLocal);
    }


    // addSuspect(suspect: fromModels.InvestigateDetailSuspect) {
    //     suspect.RowId = 1;
    //     suspect.IsModify = 'c';

    //     this.InvestigateDetailSuspect.push(this.fb.group(suspect));
    //     this.sortFormArray(this.InvestigateDetailSuspect);
    // }

    addProduct() {
        // const lastIndex = this.InvestigateDetailProduct.value.filter(x => x.IsModify != 'd').length - 1;
        // let item = new fromModels.InvestigateDetailProductUppercase();

        // item.PRODUCT_ID = null;
        // item.INVESTIGATE_DETAIL_ID = null;
        // item.PRODUCT_GROUP_CODE = '';
        // item.IS_DOMESTIC = 3;
        // item.PRODUCT_CODE = '';
        // item.PRODUCT_BRAND_CODE = '';
        // item.PRODUCT_BRAND_NAME_TH = '';
        // item.PRODUCT_BRAND_NAME_EN = '';
        // item.PRODUCT_SUBBRAND_CODE = '';
        // item.PRODUCT_SUBBRAND_NAME_TH = '';
        // item.PRODUCT_SUBBRAND_NAME_EN = '';
        // item.PRODUCT_MODEL_CODE = '';
        // item.PRODUCT_MODEL_NAME_TH = '';
        // item.DEGREE = '';
        // item.SIZES = '';
        // item.SIZES_UNIT = '';
        // item.PRODUCT_DESC = '';
        // item.LICENSE_PLATE = '';
        // item.QUANTITY = null;
        // item.QUANTITY_UNIT = '';
        // item.VOLUMN = '';
        // item.VOLUMN_UNIT = '';
        // item.IS_ACTIVE = 1;
        // item.IS_TAX_VOLUMN = 0;
        // item.IS_TAX_VALUE = 0;
        // item.IsModify = 'c';

        // if (lastIndex >= 0) {
        //     const lastDoc = this.InvestigateDetailProduct.at(lastIndex).value;
        //     if (lastDoc.ProductDesc) {
        //         item.RowId = lastDoc.RowId;
        //         this.InvestigateDetailProduct.push(this.fb.group(item));
        //     }
        // } else {
        //     item.RowId = 1;
        //     this.InvestigateDetailProduct.push(this.fb.group(item));
        // }
        // this.sortFormArray(this.InvestigateDetailProduct);
        this.modal = this.ngbModel.open(this.productsModal, { size: 'lg', centered: true });
    }

    AddProduct() {
        const prod = { ...InvestProductFormControl, IsModify: 'c', PRODUCT_GROUP_CODE: '', PRODUCT_DESC: '', IS_ACTIVE: 1 };

        const newObj = [...this.InvestigateDetailProduct.value, prod];

        this.setItemFormArray(newObj, 'InvestigateDetailProduct');
    }

    public setProductName(PRODUCT_GROUP_CODE, i) {
        const PRODUCT_GROUP_NAME$ = this.ProductGroup.find(f => f.PRODUCT_GROUP_CODE == PRODUCT_GROUP_CODE.value).PRODUCT_GROUP_NAME;
        this.InvestigateDetailProduct.at(i).patchValue({
            PRODUCT_GROUP_NAME: PRODUCT_GROUP_NAME$
        });
    }

    public onProductGroupChange() {
        const PROD = this.InvestigateDetailProduct.getRawValue();
        this.DuplicatePorductGroup(PROD);
    }

    public DuplicatePorductGroup(PROD: any) {
        this.ProductGroup.map(m => {
            const isSet =
                this.setProductGroupCode(PROD)
                    .filter(f => m.PRODUCT_GROUP_CODE == f.PRODUCT_GROUP_CODE)
                    .length;
            if (isSet)
                m.IS_DISABLED = true;
            else
                m.IS_DISABLED = false;
        });
    }

    public setProductGroupCode(PROD: any[]) {
        let PRODUCT_GROUP_CODE: any[] = [];
        PRODUCT_GROUP_CODE = PROD.reduce((a, c) =>
            [...a, { PRODUCT_GROUP_CODE: c.PRODUCT_GROUP_CODE }], [])
            .filter(f => f.PRODUCT_GROUP_CODE != '');
        return PRODUCT_GROUP_CODE;
    }

    public markDeleteProduct(i) {
        this.swalFn('', Message.confirmAction, 'warning').then(t => {
            if (t.value) {
                const prod = this.InvestigateDetailProduct.getRawValue();
                this.productDel.push(prod[i]);
                this.productDel = this.productDel.reduce((a, c) =>
                    [...a, {
                        ...c,
                        IsModify: c.IsModify == 'c' ? c.IsModify : 'd'
                    }], []);

                this.InvestigateDetailProduct.removeAt(i);
            }
        });
    }

    public async MasProductGroup() {
        await this.s_investDetail.MasProductGroupgetByCon('', '').then(res => {
            this.ProductGroup = res;
            if (this.ProductGroup.length) {
                this.ProductGroup = this.ProductGroup.reduce((a, c) =>
                    [...a, { ...c, IS_DISABLED: false }], [])
                    .filter(f => f.PRODUCT_GROUP_ID != 88); //ตัดหมวด "ของอื่นๆจากระบบคดี" ออก
            }
        });
    }

    addDocument() {
        const lastIndex = this.InvestigateDocument.length - 1;
        let document = new fromModels.InvestigateDocumentModel();
        document.DocumentID = "" + (lastIndex + 1);
        document.DocumentName = "";
        document.FilePath = "";
        document.IsNewItem = true;
        document.DocumentType = 2;
        if (lastIndex < 0) {
            this.InvestigateDocument.push(this.fb.group(document));
        } else {
            const lastDoc = this.InvestigateDocument.at(lastIndex).value;
            if (lastDoc.DocumentName && lastDoc.FilePath) {
                this.InvestigateDocument.push(this.fb.group(document));
            }
        }
    }

    changeArrestDoc(e: any, index: number) {
        const file = e.target.files[0];
        if (file != undefined) {
            this.InvestigateDocument.at(index).patchValue({
                FilePath: replaceFakePath(e.target.value),
                IsActive: 1
            })
        }
    }

    // deleteStaff(i: number) {
    //     this.deleteFormArray(this.InvestigateDetailStaff, i);
    // }

    // deleteSuspect(i: number) {
    //     this.deleteFormArray(this.InvestigateDetailSuspect, i);
    // }

    // deleteLocal(i: number) {
    //     this.deleteFormArray(this.InvestigateDetailLocal, i);
    // }

    // deleteProduct(i: number) {
    //     this.deleteFormArray(this.InvestigateDetailProduct, i);
    // }

    // deleteDocument(i: number) {
    //     this.deleteFormArray(this.InvestigateDocument, i);
    // }

    private createForm() {
        this.investigateFG = this.fb.group({
            InvestigateDetailID: new FormControl(null),
            InvestigateSeq: new FormControl(null, Validators.required),
            StationCode: new FormControl(this.runningOfficeCode),
            StationName: new FormControl(this.officeName),
            InvestigateDateStart: new FormControl(null, Validators.required),
            InvestigateDateEnd: new FormControl(null, Validators.required),
            ConfidenceOfNews: new FormControl(null, Validators.required),
            ValueOfNews: new FormControl(null, Validators.required),
            InvestigateDetail: new FormControl(null, Validators.required),
            IsActive: new FormControl(1, Validators.required),
            InvestigateDetailStaff: this.fb.array([]),
            InvestigateDetailProduct: this.fb.array([]),
            InvestigateDetailLocal: this.fb.array([
                new FormGroup({
                    LOCALE_ID: new FormControl(null),
                    ARREST_ID: new FormControl(null),
                    SUB_DISTRICT_ID: new FormControl(null),

                    LATITUDE: new FormControl(null),
                    LONGITUDE: new FormControl(null),
                    GPS: new FormControl(null),

                    ADDRESS_NO: new FormControl(null),
                    VILLAGE_NO: new FormControl(null),
                    BUILDING_NAME: new FormControl(null),
                    ROOM_NO: new FormControl(null),
                    FLOOR: new FormControl(null),
                    VILLAGE_NAME: new FormControl(null),
                    ALLEY: new FormControl(null),
                    LANE: new FormControl(null),
                    ROAD: new FormControl(null),
                    ADDRESS_TYPE: new FormControl(null),
                    ADDRESS_STATUS: new FormControl(null),
                    LOCATION: new FormControl(null),
                    POLICE_STATION: new FormControl(null),
                    IS_ACTIVE: new FormControl(1),
                    SUB_DISTRICT_NAME_TH: new FormControl(null),
                    SUB_DISTRICT_NAME_EN: new FormControl(null),
                    DISTRICT_NAME_TH: new FormControl(null),
                    DISTRICT_NAME_EN: new FormControl(null),
                    PROVINCE_NAME_TH: new FormControl(null),
                    PROVINCE_NAME_EN: new FormControl(null),
                    IsModify: new FormControl('c'),
                    RowId: new FormControl(1),
                    Region: new FormControl(null)
                })
            ]),
            InvestigateDetailSuspect: this.fb.array([]),
            InvestigateDocument: this.fb.array([])
        });

        this.uploadForm = this.fb.group({
            FILE: [''],
            DOCUMENT_NAME: '',
            DOCUMENT_OLD_NAME: '',
            DOCUMENT_TYPE: '',
            FOLDER: '',
            REFERENCE_CODE: ''
        });
    }

    searchProduct = (text$: Observable<string>) =>
        text$.debounceTime(200).distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadProduct
                    .filter(v => v.ProductDesc.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10));

    searchRegion = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.s_invest.MasLocalegetByCon({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.s_invest.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    serachOffice = (text3$: Observable<string>) =>
        text3$.debounceTime(200).distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadOffice
                    .filter(v => (v.OfficeName && v.OfficeName.toLowerCase().indexOf(term.toLowerCase()) > -1))
                    .slice(0, 10)
            );

    searchUnit = (text$: Observable<string>) =>
        text$.debounceTime(200).distinctUntilChanged()
            .map(term => term == '' ? []
                : this.typeheadQtyUnit
                    .filter(v => v.DutyCode.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatterStaff = (x: { TITLE_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    formatterRegion = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
        `${x.SUB_DISTRICT_NAME_TH} ${x.DISTRICT_NAME_TH} ${x.PROVINCE_NAME_TH}`;

    formatterProduct = (x: { ProductDesc: string }) => x.ProductDesc;

    formatterOffice = (x: { OfficeName: string }) => x.OfficeName;

    formatterUnit = (x: { DutyCode: string }) => x.DutyCode;

    selectItemLocaleRegion(event: any, i) {
        console.log(event.item.SUB_DISTRICT_ID);
        this.InvestigateDetailLocal.at(i).patchValue({
            SUB_DISTRICT_ID: event.item.SUB_DISTRICT_ID,
            SUB_DISTRICT_NAME_TH: event.item.SUB_DISTRICT_NAME_TH,
            SUB_DISTRICT_NAME_EN: event.item.SUB_DISTRICT_NAME_EN,
            DISTRICT_NAME_TH: event.item.DISTRICT_NAME_TH,
            DISTRICT_NAME_EN: event.item.DISTRICT_NAME_EN,
            PROVINCE_NAME_TH: event.item.PROVINCE_NAME_TH,
            PROVINCE_NAME_EN: event.item.PROVINCE_NAME_EN
        });
        console.log(this.InvestigateDetailLocal.at(i).value)
    }

    selectItemProductItem(e, i) {
        const product = this.InvestigateDetailProduct.at(i).value;
        this.InvestigateDetailProduct.at(i).reset(e.item);
        this.InvestigateDetailProduct.at(i).patchValue({
            ProductType: e.item.ProductID ? '1' : '2',
            ProductID: product.ProductID || e.item.ProductID,
            IsModify: product.IsModify == 'r' ? 'u' : product.IsModify,
            RowId: product.RowId,
            GroupCode: e.item.GroupCode || product.GroupCode,
            GroupName: e.item.GroupName || e.item.GroupCode || product.GroupCode,
            IsDomestic: e.item.IsDomestic || product.IsDomestic,
        })
    }

    onChangeProductDesc(e, i) {
        this.InvestigateDetailProduct.at(i).patchValue({
            ProductDesc: e.target.value
        })
    }

    selectItemStaff(e, i) {
        let staff = this.InvestigateDetailStaff.at(i);
        if (staff && e) {
            this.InvestigateDetailStaff.at(i).patchValue({
                IsNewItem: true,
                BIRTH_DATE: e.item.BIRTH_DATE,
                FIRST_NAME: e.item.FIRST_NAME,
                ID_CARD: e.item.ID_CARD,
                IS_ACTIVE: e.item.IS_ACTIVE,
                LAST_NAME: e.item.LAST_NAME,
                FULL_NAME: `${e.item.TITLE_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
                OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE,
                OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL,
                OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME,
                OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE,
                OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME,
                OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
                OPERATION_POS_CODE: e.item.OPERATION_POS_CODE,
                OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME,
                OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE,
                OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL,
                OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME,
                OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE,
                OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL,
                OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME,
                OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL,
                OPREATION_POS_NAME: e.item.OPREATION_POS_NAME,
                STAFF_CODE: e.item.STAFF_CODE,
                STAFF_ID: e.item.STAFF_ID,
                STAFF_TYPE: e.item.STAFF_TYPE,
                STATUS: e.item.STATUS,
                TITLE_ID: e.item.TITLE_ID,
                TITLE_NAME_EN: e.item.TITLE_NAME_EN,
                TITLE_NAME_TH: e.item.TITLE_NAME_TH,
                TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
                TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
            })

            console.log(this.InvestigateDetailStaff.at(i).value)
        }
    }

    onChangeContributer(e: any, i: number) {
        let contributerId = e.target.value;
        let staff = this.InvestigateDetailStaff.at(i).value;
        this.InvestigateDetailStaff.at(i).patchValue({
            ContributorCode: contributerId,
            IsModify: staff.IsModify == 'r' ? 'u' : staff.IsModify
        })
    }

    selectItemOffice(e) {
        this.investigateFG.patchValue({
            ArrestStationCode: e.item.OfficeCode,
            ArrestStation: e.item.OfficeName
        })
    }

    onChangeArrestStation(e: any) {
        this.investigateFG.patchValue({
            ArrestStation: e.target.value
        })
    }

    selectItemQtyUnit(e: any, i: number) {
        this.InvestigateDetailProduct.at(i).patchValue({
            QtyUnit: e.item.DutyCode,
        })
    }

    changeItemQtyUnit(e: any, i: number) {
        const qty = this.typeheadQtyUnit.find(x => x.DutyCode == e.target.value);
        this.InvestigateDetailProduct.at(i).patchValue({
            QUANTITY_UNIT: qty ? qty.DutyCode : '',
        })
    }

    selectItemNetVolumeUnit(e: any, i: number) {
        this.InvestigateDetailProduct.at(i).patchValue({
            NetVolumeUnit: e.item.DutyCode,
        })
    }

    async clearForm() {
        this.investigateFG.reset();
        clearFormArray(this.InvestigateDetailStaff);
        clearFormArray(this.InvestigateDetailSuspect);
        clearFormArray(this.InvestigateDetailLocal);
        clearFormArray(this.InvestigateDetailProduct);
        clearFormArray(this.InvestigateDocument);
    }

    async ngOnDestroy(): Promise<void> {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        await this.clearForm();
    }

    openModal(e) {
        sessionStorage.setItem("investigation_form_data", JSON.stringify(this.investigateFG.value));
        this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
    }

    saveFail() {
        this._isSuccess = false;
        return false;
    }

    checkResponse(res: any) {
        switch (res.IsSuccess) {
            case 'False':
            case false:
                return false;
            default:
                return true;
        }
    }

    checkIsSuccess(res: any) {
        switch (res.IsSuccess) {
            case 'True':
            case true:
                this._isSuccess = true;
                return true;
            default:
                this._isSuccess = false;
                return false;
        }
    }

    catchError(error: any) {
        this._isSuccess = false;
        this.endLoader();
    }

    async onComplete() {
        if (this._isSuccess) {
            swal({
                title: '',
                text: Message.saveComplete,
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
            }).then(async (result) => {
                if (result.value) {
                    await this.clearForm();
                    switch (this.mode) {
                        case 'C':
                            // await this.store.dispatch(new fromStore.RemoveInvestigate);
                            this.onRefreshPage();
                            break;
                        case 'R':
                            this.onPageLoad();
                            break;
                    }
                }
            });

        } else {
            swal('', Message.saveFail, 'error')
        }
    }

    private navigateToManage = () => this.router.navigate([`/investigation/manage`, this.investMode, this.investId]);

    private onRefreshPage = () => {
        this.router.navigate(
            [`/investigation/detail-manage`, 'R'],
            {
                queryParams: {
                    investMode: this.investMode,
                    investCode: this.investCode,
                    invesDetailId: this.invesDetailId
                }
            });
    }

    private async onEdit() {
        if (
            !this.typeheadStaff.length &&
            !this.typeheadOffice.length &&
            !this.typeheadProduct.length &&
            !this.typeheadQtyUnit.length &&
            !this.typeheadNetVolumeUnit.length &&
            !this.typeheadRegion.length) {
            await this.loadMasterData();
        }
    }

    private onCancel() {
        switch (this.mode) {
            case 'C':
                this.navigateToManage();
                break;
            case 'R':
                this.onRefreshPage();
                break;
        }
    }

    private async onDelete() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                console.log(this.invesDetailId)
                this.s_investDetail.InvestigateDetailupdDelete(this.invesDetailId)
                    .takeUntil(this.destroy$)
                    .subscribe(x => {
                        if (this.checkIsSuccess(x)) {
                            swal('', Message.delComplete, 'success');
                            this.navigateToManage();
                        } else {
                            swal('', Message.delFail, 'error');
                        }
                    })
            }
        })
    }

    private async onSave() {
        console.log('onSave')
        const f = this.investigateFG.value;
        const InvestigateDateStart = f.InvestigateDateStart;
        if (!InvestigateDateStart) {
            this.isRequired = true;
            this.isReq_DStart.next(true);
            swal('', `กรุณาระบุข้อมูล "วันที่เริ่มสืบสวน"`, 'warning');
            return false;
        }

        const InvestigateDateEnd = f.InvestigateDateEnd;
        if (!InvestigateDateEnd) {
            this.isRequired = true;
            this.isReq_DEnd.next(true);
            swal('', `กรุณาระบุข้อมูล "วันที่เริ่มสืบสวน"`, 'warning');
            return false;
        }

        const ValueOfNews = f.ValueOfNews;
        if (!ValueOfNews) {
            this.isRequired = true;
            this.isReq_Value.next(true);
            swal('', `กรุณาระบุข้อมูล "มาตรความเชื่อมั่น"`, 'warning');
            return false;
        }

        const ConfidenceOfNews = f.ConfidenceOfNews;
        if (!ConfidenceOfNews) {
            this.isRequired = true;
            this.isReq_Confidence.next(true);
            swal('', `กรุณาระบุข้อมูล "ค่าของเนื้อข่าว"`, 'warning');
            return false;
        }

        const InvestigateDetail = f.InvestigateDetail;
        if (!InvestigateDetail) {
            this.card6.next(true);
            this.isRequired = true;
            this.isReq_Detail.next(true);
            swal('', `กรุณาระบุข้อมูล "รายละเอียด"`, 'warning');
            return false;
        }

        for (let i = 0; i < this.InvestigateDetailStaff.length; i++) {
            let FULL_NAME = this.InvestigateDetailStaff.value[i].TITLE_NAME_TH;
            if (!FULL_NAME) {
                this.card2.next(true);
                this.isRequired = true;
                this.isReq_Staff0.next(true);
                this.showSwal(`กรุณาระบุข้อมูล "ชื่อเจ้าหน้าที่"`, "warning");
                return false;
            }

            let CONTRIBUTOR_ID = this.InvestigateDetailStaff.value[i].CONTRIBUTOR_ID;
            if (!CONTRIBUTOR_ID) {
                this.card2.next(true);
                this.isRequired = true;
                this.isReq_Staff1.next(true);
                this.showSwal(`กรุณาระบุข้อมูล "ฐานะ"`, "warning");
                return false;
            }
        }

        for (let i = 0; i < this.InvestigateDetailLocal.length; i++) {
            let SUB_DISTRICT_ID = this.InvestigateDetailLocal.value[i].SUB_DISTRICT_ID;
            if (!SUB_DISTRICT_ID) {
                this.card4.next(true);
                this.isRequired = true;
                this.isReq_SubDis.next(true);
                this.showSwal(`กรุณาระบุข้อมูล "ตำบล/อำเภอ/จังหวัด"`, "warning");
                return false;
            }
        }

        const PRODUCT: any = this.InvestigateDetailProduct.value;
        if (PRODUCT.length) {
            const PROD_NULL: boolean = PRODUCT.every(e => e.PRODUCT_GROUP_CODE != "" || null);
            if (!PROD_NULL) {
                this.isReq_ProdGroup.next(!PROD_NULL);
                swal({
                    text: `กรุณาระบุข้อมูล "หมวดสินค้า"`,
                    type: 'warning',
                    confirmButtonText: 'ตกลง'
                })
                return false;
            }
        }

        switch (this.mode) {
            case 'C':
                if (this.investCode == 'Auto Generate') {
                    await this.createWithOutInvestCode();
                } else {
                    await this.createWithInvestCode();
                }
                break;
            case 'R':
                await this.onRevice();
                break;
        }
    }

    private async createWithInvestCode() {
        this.loaderService.show();
        let code;
        let id;
        // await this.s_invest.InvestigategetByCon(this.investCode)
        //     .takeUntil(this.destroy$)
        //             .subscribe((x) => {
        //                 if (!this.checkResponse(x)) return;
        //                 code = x.INVESTIGATE_CODE;
        //                 id = x.INVESTIGATE_ID;
        //             });
        await this.insertInvestigateDetail(this.investCode, this.investCode);
        // this.onComplete();
        this.loaderService.hide();
    }

    private async createWithOutInvestCode() {
        this.loaderService.show();
        await this.getTransactionRunning();
        this.onComplete();
        this.loaderService.hide();
    }

    private async onRevice() {
        this.loaderService.show();
        await this.updateInvestigateDetail();
        this.loaderService.hide();
    }

    private async getTransactionRunning() {
        let resRunning: any[] = await this.s_transactionRunning
            .TransactionRunninggetByCon_ph2(this.runningTable, this.runningOfficeCode)
            .then((x: TransactionRunning[]) => {
                if (!this.checkResponse(x)) return;
                return x;
            })
        let investCode: string;
        if (resRunning && resRunning.length) {
            let tr = resRunning.sort((a, b) => b.RUNNING_NO - a.RUNNING_NO)[0] // sort desc
            let str = '' + (tr.RUNNING_NO + 1)
            let pad = '00000';
            let ans = pad.substring(0, pad.length - str.length) + str;
            investCode = `${tr.RUNNING_PREFIX}${tr.RUNNING_OFFICE_CODE}${tr.RUNNING_YEAR}${ans}`;
            await this.s_transactionRunning.
                TransactionRunningupdByCon_ph2(tr.RUNNING_ID)
                .then(async y => {
                    if (!this.checkIsSuccess(y)) return;
                    return true;
                }, () => { this.saveFail(); return; })
                .catch((error) => this.catchError(error));

        } else {
            await this.s_transactionRunning
                .TransactionRunninginsAll_ph2(this.runningOfficeId, this.runningOfficeCode, this.runningTable, this.runningPrefix)
                .then(async y => {
                    if (!this.checkIsSuccess(y)) return;

                    let ans = '00001'
                    let year = ((new Date).getFullYear() + 543).toString()
                    year = year.substring(2, 4);
                    investCode = `${this.runningPrefix}${this.runningOfficeCode}${year}${ans}`;
                    return true;
                }, () => { this.saveFail(); return; })
                .catch((error) => this.catchError(error));
        }
        if (investCode) {
            await this.insertInvestigate(investCode);
        }
    }

    private async insertInvestigate(investCode: string) {
        let invest = this.stateInvest;
        // let sdate = getDateMyDatepicker(form.OCCURRENCE_DATE_FROM);
        // let edate = getDateMyDatepicker(form.OCCURRENCE_DATE_TO);

        const f = Object.assign({}, this.investigateFG.value);

        // f.OCCURRENCE_DATE_FROM = convertDateForSave(sdate) || '';
        // f.OCCURRENCE_DATE_TO = convertDateForSave(edate) || convertDateForSave(new Date());

        const dateEnd = this.dateTimeEnd;
        const dateStart = this.dateTimeStart;
        invest.INVESTIGATE_CODE = investCode;
        const body = {
            DATE_END: dateEnd,
            DATE_START: dateStart,
            INVESTIGATE_CODE: investCode,
            INVESTIGATE_NO: this.investNo,
            INVESTIGATE_NO_YEAR: this.investYear,
            IS_ACTIVE: 1,
            SUBJECT: this.investSubject,
        };
        console.log(body)
        await this.s_invest.InvestigateinsAll(body).then(async x => {
            if (!this.checkIsSuccess(x)) return;
            this.investCode = investCode;
            this.investId = x.INVESTIGATE_ID;
            await this.insertInvestigateDetail(investCode, x.INVESTIGATE_ID);

            this.investMode = 'R';
            this.resetConfig();

        }, () => { this.saveFail(); return; })
            .catch((error) => this.catchError(error));
    }

    private async insertInvestigateDetail(investCode: string, investID?) {
        this.loaderService.show();
        let form: fromModels.InvestigateDetail = this.investigateFG.value;

        form.InvestigateCode = investCode;
        const dateEnd = this.investigateFG.controls.InvestigateDateEnd.value;
        const dateStart = this.investigateFG.controls.InvestigateDateStart.value;
        form.InvestigateDetailLocal = form.InvestigateDetailLocal.filter(x => x.IsModify != 'd')
            .reduce((a, c) => [...a, { ...c, GPS: `${c['LATITUDE']},${c['LONGITUDE']}` }], []);
        form.InvestigateDetailProduct = form.InvestigateDetailProduct.filter(x => x.IsModify != 'd');
        form.InvestigateDetailStaff = form.InvestigateDetailStaff.filter(x => x.IsModify != 'd');
        form.InvestigateDetailSuspect = form.InvestigateDetailSuspect.filter(x => x.IsModify != 'd');
        const body = {
            CONFIDENCE_OF_NEWS: form.ConfidenceOfNews,
            DATE_END: this.dbDateFormat(dateEnd),
            DATE_START: this.dbDateFormat(dateStart),
            INVESTIGATE_DETAIL_DESCRIPTION: form.InvestigateDetail || '',
            INVESTIGATE_DETAIL_ID: '',
            INVESTIGATE_ID: investID || '',
            INVESTIGATE_CODE: form.InvestigateCode || '',
            INVESTIGATE_SEQUENCE: form.InvestigateSeq || '',
            IS_ACTIVE: form.IsActive,
            OFFICE_CODE: form.StationCode || '',
            OFFICE_NAME: form.StationName || '',
            VALUE_OF_NEWS: form.ValueOfNews || '',
            InvestigateDetailLocale: form.InvestigateDetailLocal || [],
            InvestigateDetailProduct: form.InvestigateDetailProduct || [],
            InvestigateDetailStaff: form.InvestigateDetailStaff || [],
            InvestigateDetailSuspect: form.InvestigateDetailSuspect || [],
        };

        console.log(body)

        this.s_investDetail.InvestigateDetailinsAll(body).then(x => {
            if (!this.checkIsSuccess(x)) return;
            this.invesDetailId = x.INVESTIGATE_DETAIL_ID;
            this.fileList.map(async doc => {
                // doc.DOCUMENT_ID = ""
                doc.DOCUMENT_TYPE = 2;
                doc.DATA_SOURCE = "";
                doc.REFERENCE_CODE = this.invesDetailId;

                this.uploadForm.get('FILE').setValue(doc.FILE);
                this.uploadForm.get('DOCUMENT_NAME').setValue(doc.DOCUMENT_NAME);
                this.uploadForm.get('DOCUMENT_OLD_NAME').setValue(doc.DOCUMENT_OLD_NAME);
                this.uploadForm.get('DOCUMENT_TYPE').setValue(doc.DOCUMENT_TYPE);
                this.uploadForm.get('FOLDER').setValue(doc.FOLDER);
                this.uploadForm.get('REFERENCE_CODE').setValue(this.invesDetailId);
                const formData = new FormData();
                formData.append('FILE', this.uploadForm.get('FILE').value);
                formData.append('DOCUMENT_NAME', this.uploadForm.get('DOCUMENT_NAME').value);
                formData.append('DOCUMENT_OLD_NAME', this.uploadForm.get('DOCUMENT_OLD_NAME').value);
                formData.append('DOCUMENT_TYPE', this.uploadForm.get('DOCUMENT_TYPE').value);
                formData.append('FOLDER', this.uploadForm.get('FOLDER').value);
                formData.append('REFERENCE_CODE', this.uploadForm.get('REFERENCE_CODE').value);

                await this.s_invest.DocumentinsAll(formData).subscribe(docIsSuccess => {
                    if (!docIsSuccess) { return false; };

                }, () => { return false; });
            });
            if (this._isSuccess) {
                swal({
                    title: '',
                    text: Message.saveComplete,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then(async (result) => {
                    if (result.value) {
                        await this.clearForm();
                        switch (this.mode) {
                            case 'C':
                                // await this.store.dispatch(new fromStore.RemoveInvestigate);
                                this.onRefreshPage();
                                break;
                            case 'R':
                                this.onPageLoad();
                                break;
                        }
                    }
                });

            } else {
                swal('', Message.saveFail, 'error')
            }
        }, () => { this.saveFail(); return; })
            .catch((error) => {
                this.catchError(error);
                console.log(error)
            });
        this.loaderService.hide();
    }

    private async updateInvestigateDetail() {
        console.log('updateInvestigateDetail')
        this.loaderService.show();
        let form: fromModels.InvestigateDetail = this.investigateFG.value;
        const dateStart = getDateMyDatepicker(form.InvestigateDateStart);
        const dateEnd = getDateMyDatepicker(form.InvestigateDateEnd);
        form.InvestigateDateStart = setZeroHours(dateStart);
        form.InvestigateDateEnd = setZeroHours(dateEnd);

        form.InvestigateDetailLocal = form.InvestigateDetailLocal.filter(x => x.IsModify != 'd');
        form.InvestigateDetailProduct = form.InvestigateDetailProduct.filter(x => x.IsModify != 'd');
        form.InvestigateDetailStaff = form.InvestigateDetailStaff.filter(x => x.IsModify != 'd');
        const body = {
            CONFIDENCE_OF_NEWS: form.ConfidenceOfNews,
            DATE_END: this.dbDateFormat(form.InvestigateDateStart),
            DATE_START: this.dbDateFormat(form.InvestigateDateEnd),
            INVESTIGATE_DETAIL_DESCRIPTION: form.InvestigateDetail || '',
            INVESTIGATE_DETAIL_ID: this.invesDetailId || '',
            INVESTIGATE_ID: this.investCode || '',
            INVESTIGATE_CODE: this.investCode || '',
            INVESTIGATE_SEQUENCE: form.InvestigateSeq || '',
            IS_ACTIVE: form.IsActive,
            OFFICE_CODE: form.StationCode || '',
            OFFICE_NAME: form.StationName || '',
            VALUE_OF_NEWS: form.ValueOfNews || '',
            InvestigateDetailLocal: form.InvestigateDetailLocal || [],
            InvestigateDetailProduct: form.InvestigateDetailProduct || [],
            InvestigateDetailStaff: form.InvestigateDetailStaff || [],
            InvestigateDetailSuspect: form.InvestigateDetailSuspect || [],
        };
        this.s_investDetail.InvestigateDetailupdByCon(body)
            .then((x) => {
                if (!this.checkIsSuccess(x)) return;
                let staff = this.modifyInvestigateDetailStaff(parseInt(this.invesDetailId));
                let suspect = this.modifyInvestigateDetailSuspect(parseInt(this.invesDetailId));
                let local = this.modifyInvestigateDetailLocal(parseInt(this.invesDetailId));
                let product = this.modifyInvestigateDetailProduct(parseInt(this.invesDetailId));
                let ducument = this.modifyMasDocument(parseInt(this.invesDetailId));
                this._isSuccess = true;
                swal({
                    title: '',
                    text: Message.saveComplete,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then(async (result) => {
                    if (result) {
                        this.showEditField = false;
                        this.onPageLoad();

                        setTimeout(() => {
                            location.reload();
                        }, 200);
                    }
                });
                return Promise.all([staff, suspect, local, product, ducument]);
            }, () => { this.saveFail(); return; })
            .catch((error) => this.catchError(error));

        this.loaderService.hide();
    }

    private async modifyInvestigateDetailStaff(investDetailId: number) {
        const staff = await this.InvestigateDetailStaff.value
            .map(async (x: fromModels.InvestigateDetailStaffUppercase, index) => {
                x.INVESTIGATE_DETAIL_ID = investDetailId;
                switch (x.IsModify) {
                    case 'd':
                        if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailStaffupdDelete(x.STAFF_ID.toString())
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'c':
                        if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailStaffinsAll(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'u':
                    case 'r':
                        await this.s_investDetail.InvestigateDetailStaffupdByCon(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                }
            })
        return Promise.all(staff);
    }

    private async modifyInvestigateDetailSuspect(investDetailId: number) {
        const suspect = await this.InvestigateDetailSuspect.value
            .map(async (x: fromModels.InvestigateDetailSuspectUppercase) => {
                x.INVESTIGATE_DETAIL_ID = investDetailId;
                switch (x.IsModify) {
                    case 'd':
                        if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailSuspectupdDelete(x.SUSPECT_ID.toString())
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'c':
                        await this.s_investDetail.InvestigateDetailSuspectinsAll(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                }
            });
        return Promise.all(suspect);
    }

    private async modifyInvestigateDetailLocal(investDetailId: number) {

        const local = await this.InvestigateDetailLocal.value
            .map(async (x: fromModels.InvestigateDetailLocalUppercase, index) => {
                x.INVESTIGATE_DETAIL_ID = investDetailId;
                x.GPS = `${x['LATITUDE']},${x['LONGITUDE']}`;
                switch (x.IsModify) {
                    case 'd':
                        if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailLocalupdDelete(x.LOCALE_ID ? x.LOCALE_ID.toString() : "")
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'c':
                        if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailLocalinsAll(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'u':
                    case 'r':
                        await this.s_investDetail.InvestigateDetailLocalupdByCon(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                }
            });
        return Promise.all(local);
    }

    private async modifyInvestigateDetailProduct(investDetailId: number) {
        const product = await this.InvestigateDetailProduct.value
            .map(async (x: fromModels.InvestigateDetailProductUppercase) => {
                x.INVESTIGATE_DETAIL_ID = investDetailId;
                switch (x.IsModify) {
                    // case 'd':
                    //     if (this.mode == 'C') return;
                    //     await this.s_investDetail.InvestigateDetailProductupdDelete(x.PRODUCT_ID.toString()) 
                    //         .then(y => {
                    //             if (!this.checkIsSuccess(y)) return;
                    //         }, () => { this.saveFail(); return; })
                    //         .catch((error) => this.catchError(error));
                    //     break;
                    case 'c':
                        // if (this.mode == 'C') return;
                        await this.s_investDetail.InvestigateDetailProductinsAll(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                    case 'u':
                    case 'r':
                        await this.s_investDetail.InvestigateDetailProductupdByCon(x)
                            .then(y => {
                                if (!this.checkIsSuccess(y)) return;
                            }, () => { this.saveFail(); return; })
                            .catch((error) => this.catchError(error));
                        break;
                }
            });

        const productDel = await this.productDel
            .filter(f => f.IsModify == 'd')
            .map(async (x: fromModels.InvestigateDetailProductUppercase) => {
                await this.s_investDetail.InvestigateDetailProductupdDelete(x.PRODUCT_ID.toString())
                    .then(y => {
                        if (!this.checkIsSuccess(y)) return;
                    }, () => { this.saveFail(); return; })
                    .catch((error) => this.catchError(error));
            });

        return Promise.all([...product, ...productDel]);
    }

    private async modifyMasDocument(investDetailId: number) {
        await this.fileList.map(async doc => {
            if (doc.IsNewItem) {
                doc.DOCUMENT_TYPE = 2;
                doc.DATA_SOURCE = "";
                doc.REFERENCE_CODE = this.invesDetailId;
                this.uploadForm.get('FILE').setValue(doc.FILE);
                this.uploadForm.get('DOCUMENT_NAME').setValue(doc.DOCUMENT_NAME);
                this.uploadForm.get('DOCUMENT_OLD_NAME').setValue(doc.DOCUMENT_OLD_NAME);
                this.uploadForm.get('DOCUMENT_TYPE').setValue(doc.DOCUMENT_TYPE);
                this.uploadForm.get('FOLDER').setValue(doc.FOLDER);
                this.uploadForm.get('REFERENCE_CODE').setValue(this.invesDetailId);

                const formData = new FormData();
                formData.append('FILE', this.uploadForm.get('FILE').value);
                formData.append('DOCUMENT_NAME', this.uploadForm.get('DOCUMENT_NAME').value);
                formData.append('DOCUMENT_OLD_NAME', this.uploadForm.get('DOCUMENT_OLD_NAME').value);
                formData.append('DOCUMENT_TYPE', this.uploadForm.get('DOCUMENT_TYPE').value);
                formData.append('FOLDER', this.uploadForm.get('FOLDER').value);
                formData.append('REFERENCE_CODE', this.uploadForm.get('REFERENCE_CODE').value);

                await this.s_invest.DocumentinsAll(formData).subscribe(docIsSuccess => {
                    let isSuscess: any
                    isSuscess = docIsSuccess;
                    if (isSuscess.IsSuccess !== "True") { return false; };
                }, () => { return false; });
            }
        });
    }

    private dbDateFormat(date) {
        if (date.date) {
            return moment(`${date.date.year}-${date.date.month}-${date.date.day}`).format('YYYY-MM-DD HH:mm:ss.000');
        }
        return date ? moment(date).format('YYYY-MM-DD HH:mm:ss.000') : '';
    }

    public clickCancel() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                this.router.navigate([`/investigation/list`]);

            }
        })
    }

    deleteItem(i: number) {
        const doc = this.fileList[i];
        if (!doc.DOCUMENT_ID) {
            this.fileList.splice(i, 1);
            return;
        }
        swal({
            title: '',
            text: 'ยืนยันการลบรายการหรือไม่',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                this.s_invest.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
                    .subscribe(x => {
                        let iSuccess: any;
                        iSuccess = x;
                        if (iSuccess.IsSuccess === "True") {
                            swal('', Message.delComplete, 'success');
                            this.fileList.splice(i, 1);
                        } else {
                            swal('', Message.delFail, 'error');
                        }
                    });
            }
        })
    }

    Output(event: Document) {
        console.log('event : ', event)
        this.fileList = [...this.fileList, event]
        // this.fileList.map(m => {
        //     m.IsNewItem = true
        // })
    }

    clickPrint() {
        this.modal = this.ngbModel.open(this.printDocModal, { size: 'lg', centered: true })
    }

    staffId: any = "";
    staffIndex: any = "";
    beforeDeleteStaff(id: string, index: number) {
        this.staffId = id;
        this.staffIndex = index;
        if (this.mode === 'C') {
            this.onDeleteStaff();
        } else if (this.mode === 'R') {
            this.deleteStaff.text = Message.confirmAction;
            this.deleteStaff.show();
        }
    }
    async onDeleteStaff() {
        if (this.mode === 'C') {
            this.InvestigateDetailStaff.removeAt(this.staffIndex);
            // this.showSwal(Message.delStaffComplete, "success");
        } else if (this.mode === 'R') {
            this.loaderService.show();
            if (this.InvestigateDetailStaff.at(this.staffIndex).value.IsNewItem) {
                this.InvestigateDetailStaff.removeAt(this.staffIndex);
                // this.showSwal(Message.delStaffComplete, "success");
            } else {
                await this.s_investDetail.InvestigateDetailStaffupdDelete(this.staffId).then(isSuccess => {
                    if (isSuccess.IsSuccess === "True") {
                        this.InvestigateDetailStaff.removeAt(this.staffIndex);
                        // this.showSwal(Message.delStaffComplete, "success");
                    } else {
                        this.showSwal(Message.delStaffFail, "error");
                    }
                })
            }
            this.loaderService.hide();
        }
    }

    localeId: any = "";
    localeIndex: any = "";
    beforeDeleteLocale(id: string, index: number) {
        this.localeId = id;
        this.localeIndex = index;
        // this.deleteLocale.text = Message.confirmAction;
        // this.deleteLocale.show();
        // this.onDeleteLocale();
        if (this.mode === 'C') {
            this.onDeleteLocale();
        } else if (this.mode === 'R') {
            this.deleteLocale.text = Message.confirmAction;
            this.deleteLocale.show();
        }
    }
    async onDeleteLocale() {
        if (this.mode === 'C') {
            this.InvestigateDetailLocal.removeAt(this.localeIndex);
            // this.showSwal(Message.delLocaleComplete, "success");
        } else if (this.mode === 'R') {
            this.loaderService.show();
            if (this.InvestigateDetailLocal.at(this.localeIndex).value.IsNewItem) {
                this.InvestigateDetailLocal.removeAt(this.localeIndex);
                // this.showSwal(Message.delLocaleComplete, "success");
            } else {
                await this.s_investDetail.InvestigateDetailLocalupdDelete(this.localeId).then(isSuccess => {
                    if (isSuccess.IsSuccess === "True") {
                        this.InvestigateDetailLocal.removeAt(this.localeIndex);
                        // this.showSwal(Message.delLocaleComplete, "success");
                    } else {
                        this.showSwal(Message.delLocaleFail, "error");
                    }
                })
            }
            this.loaderService.hide();
        }
    }

    suspectId: any = "";
    suspectIndex: any = "";
    beforeDeleteSuspect(id: string, index: number) {
        this.suspectId = id;
        this.suspectIndex = index;
        // this.deleteSuspect.text = Message.confirmAction;
        // this.deleteSuspect.show();
        // this.onDeleteSuspect();
        if (this.mode === 'C') {
            this.onDeleteSuspect();
        } else if (this.mode === 'R') {
            this.deleteSuspect.text = Message.confirmAction;
            this.deleteSuspect.show();
        }
    }
    async onDeleteSuspect() {
        if (this.mode === 'C') {
            this.InvestigateDetailSuspect.removeAt(this.suspectIndex);
            // this.showSwal(Message.delSuspcetComplete, "success");
        } else if (this.mode === 'R') {

            this.loaderService.show();
            if (this.InvestigateDetailSuspect.at(this.suspectIndex).value.IsNewItem) {
                this.InvestigateDetailSuspect.removeAt(this.suspectIndex);
                // this.showSwal(Message.delSuspcetComplete, "success");
            } else {
                await this.s_investDetail.InvestigateDetailSuspectupdDelete(this.suspectId).then(isSuccess => {
                    if (isSuccess.IsSuccess === "True") {
                        this.InvestigateDetailSuspect.removeAt(this.suspectIndex);
                        // this.showSwal(Message.delSuspcetComplete, "success");
                    } else {
                        this.showSwal(Message.delSuspectFail, "error");
                    }
                })
            }
            this.loaderService.hide();
        }
    }

    // productId: any = "";
    // productIndex: any = "";
    // beforeDeleteProduct(id: string, index: number) {
    //     this.productId = id;
    //     this.productIndex = index;
    //     // this.deleteProduct.text = Message.confirmAction;
    //     // this.deleteProduct.show();
    //     if (this.mode === 'C') {
    //         this.onDeleteProduct();
    //     } else if (this.mode === 'R') {
    //         this.deleteProduct.text = Message.confirmAction;
    //         this.deleteProduct.show();
    //     }
    // }
    // async onDeleteProduct() {
    //     if (this.mode === 'C') {
    //         this.InvestigateDetailProduct.removeAt(this.productIndex);
    //         // this.showSwal(Message.delProductComplete, "success");
    //     } else if (this.mode === 'R') {
    //         this.loaderService.show();
    //         if (this.InvestigateDetailProduct.at(this.productIndex).value.IsNewItem) {
    //             this.InvestigateDetailProduct.removeAt(this.productIndex);
    //             // this.showSwal(Message.delProductComplete, "success");
    //         } else {
    //             await this.s_investDetail.InvestigateDetailProductupdDelete(this.productId).then(res => {
    //                 if (res.IsSuccess === "True") {
    //                     this.InvestigateDetailProduct.removeAt(this.productIndex);
    //                     // this.showSwal(Message.delProductComplete, "success");
    //                 } else {
    //                     this.showSwal(Message.delProductFail, "error");
    //                 }
    //             })
    //         }
    //         this.loaderService.hide();
    //     }
    // }

    private showSwal(msg: string, iconType: any) {
        this.alertSwal.text = msg;
        this.alertSwal.type = iconType;
        this.alertSwal.show();
    }

    onCollapse(event: BehaviorSubject<Boolean>) {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

    setDefaultStaff() {
        this.addStaff();
        const staff = JSON.parse(localStorage.getItem('staffInfo'));
        // console.log(`${staff.TITLE_NAME_TH || ''}${staff.FIRST_NAME || ''} ${staff.LAST_NAME || ''}`);
        // this.InvestigateDetailStaff.at(0).patchValue({
        //     IsNewItem: true,
        //     BIRTH_DATE: staff.BIRTH_DATE,
        //     FIRST_NAME: staff.FIRST_NAME,
        //     ID_CARD: staff.ID_CARD,
        //     IS_ACTIVE: staff.IS_ACTIVE,
        //     LAST_NAME: staff.LAST_NAME,
        //     FULL_NAME: `${staff.TITLE_NAME_TH || ''}${staff.FIRST_NAME || ''} ${staff.LAST_NAME || ''}`,
        //     OPERATION_DEPT_CODE: staff.OPERATION_DEPT_CODE,
        //     OPERATION_DEPT_LEVEL: staff.OPERATION_DEPT_LEVEL,
        //     OPERATION_DEPT_NAME: staff.OPERATION_DEPT_NAME,
        //     OPERATION_OFFICE_CODE: staff.OPERATION_OFFICE_CODE,
        //     OPERATION_OFFICE_NAME: staff.OPERATION_OFFICE_NAME,
        //     OPERATION_OFFICE_SHORT_NAME: staff.OPERATION_OFFICE_SHORT_NAME,
        //     OPERATION_POS_CODE: staff.OPERATION_POS_CODE,
        //     OPERATION_POS_LEVEL_NAME: staff.OPERATION_POS_LEVEL_NAME,
        //     OPERATION_UNDER_DEPT_CODE: staff.OPERATION_UNDER_DEPT_CODE,
        //     OPERATION_UNDER_DEPT_LEVEL: staff.OPERATION_UNDER_DEPT_LEVEL,
        //     OPERATION_UNDER_DEPT_NAME: staff.OPERATION_UNDER_DEPT_NAME,
        //     OPERATION_WORK_DEPT_CODE: staff.OPERATION_WORK_DEPT_CODE,
        //     OPERATION_WORK_DEPT_LEVEL: staff.OPERATION_WORK_DEPT_LEVEL,
        //     OPERATION_WORK_DEPT_NAME: staff.OPERATION_WORK_DEPT_NAME,
        //     OPREATION_POS_LEVEL: staff.OPREATION_POS_LEVEL,
        //     OPREATION_POS_NAME: staff.OPREATION_POS_NAME,
        //     STAFF_CODE: staff.STAFF_CODE,
        //     STAFF_ID: staff.STAFF_ID,
        //     STAFF_TYPE: staff.STAFF_TYPE,
        //     STATUS: staff.STATUS,
        //     TITLE_ID: staff.TITLE_ID,
        //     TITLE_NAME_EN: staff.TITLE_NAME_EN,
        //     TITLE_NAME_TH: staff.TITLE_NAME_TH,
        //     TITLE_SHORT_NAME_EN: staff.TITLE_SHORT_NAME_EN,
        //     TITLE_SHORT_NAME_TH: staff.TITLE_SHORT_NAME_TH,
        // })
        // console.log(this.InvestigateDetailStaff.at(0).value)
        this.InvestigateDetailStaff.at(0).patchValue(staff);
        this.InvestigateDetailStaff.at(0).patchValue({
            FULL_NAME: `${staff.TITLE_NAME_TH || ''}${staff.FIRST_NAME || ''} ${staff.LAST_NAME || ''}`
        });
    }

    deleteStaffText(ev, i) {
        console.log(i)
        if (!ev.value) {
            this.clearStaffOfindex(i);
        }
    }

    clearStaffOfindex(i) {
        this.InvestigateDetailStaff.at(i).patchValue({
            BIRTH_DATE: '',
            FIRST_NAME: '',
            ID_CARD: '',
            IS_ACTIVE: '',
            LAST_NAME: '',
            FULL_NAME: '',
            OPERATION_DEPT_CODE: '',
            OPERATION_DEPT_LEVEL: '',
            OPERATION_DEPT_NAME: '',
            OPERATION_OFFICE_CODE: '',
            OPERATION_OFFICE_NAME: '',
            OPERATION_OFFICE_SHORT_NAME: '',
            OPERATION_POS_CODE: '',
            OPERATION_POS_LEVEL_NAME: '',
            OPERATION_UNDER_DEPT_CODE: '',
            OPERATION_UNDER_DEPT_LEVEL: '',
            OPERATION_UNDER_DEPT_NAME: '',
            OPERATION_WORK_DEPT_CODE: '',
            OPERATION_WORK_DEPT_LEVEL: '',
            OPERATION_WORK_DEPT_NAME: '',
            OPREATION_POS_LEVEL: '',
            OPREATION_POS_NAME: '',
            STAFF_CODE: '',
            STAFF_ID: '',
            STAFF_TYPE: '',
            STATUS: '',
            TITLE_ID: '',
            TITLE_NAME_EN: '',
            TITLE_NAME_TH: '',
            TITLE_SHORT_NAME_EN: '',
            TITLE_SHORT_NAME_TH: '',
            CONTRIBUTOR_ID: ''
        });
    }
}
