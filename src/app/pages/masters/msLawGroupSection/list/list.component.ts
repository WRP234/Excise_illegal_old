import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../masters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pagination } from '../../../../config/pagination';
import { Message } from '../../../../config/message';
import { toLocalShort, compareDate, setZeroHours } from '../../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from "../../../../shared/header-navigation/navigation.service";
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {

    advSearch: any;
    dataList = [];
    showDataList = [];
    paginage = pagination;

    LAW_GROUP_SECTION_LIST = [];
    LAW_GROUP_LIST = [];
    PART_LIST = [];
    SECTION_LIST = [];

    LAW_GROUP_NO: string;
    PART_NO: string;
    SECTION_ID: string;

    modal: any;

    // ----- Model ------ //
    //@ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    constructor(
        private _router: Router,
        private sidebarService: SidebarService,
        private navService: NavigationService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        localStorage.setItem('programcode', 'ILG60-19-06');
        this.sidebarService.setVersion('Masters 0.0.0.2');

        this.getLawGroupSection();
        this.getPart();
        this.getSection();

        this.clickSearch({ TEXT_SEARCH: "" });

        this.LAW_GROUP_NO = "";
        this.PART_NO = "";
        this.SECTION_ID = "";
    }

    ngOnDestroy(): void {
        // this.subOnSearch.unsubscribe();
        //this.subSetNextPage.unsubscribe();
    }


    clickView(masterID: string) {
        this._router.navigate([`/msLawGroupSection/manage/R/${masterID}`]);
    }

    clickNew = () => this._router.navigate([`/msLawGroupSection/manage/C/NEW`]);

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch
        }

        this.MasService.getAPI1111("MasLawGroupSectiongetByKeyword", paramsOther).then(list => {
            if (list) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.showDataList = [];
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {

            this.ShowAlertNoRecord();
            this.showDataList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());

        this.LAW_GROUP_NO = "";
        this.PART_NO = "";
        this.SECTION_ID = "";
    }

    onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);

        this.MasService.getAPI1111("MasLawGroupSectiongetByConAdv", form.value).then(list => {
            if (list) {
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);
            } else {
                this.showDataList = [];
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
            this.preloader.setShowPreloader(false);
        });
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    async onSearchComplete(list: any) {
        this.dataList = [];

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.showDataList = [];

            return false;
        }

        if (Array.isArray(list)) {
            this.dataList = list;
        } else {
            this.dataList.push(list);
        }

        // set total record
        this.paginage.TotalItems = this.dataList.length;
        this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    }

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

        lawGroup.push({ LAW_GROUP_NO: "", LAW_GROUP_NAME: "ทั้งหมด" });

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

        this.PART_NO = "";
        this.getSection();

        partList.push({ PART_NO: "", PART_NAME: "ทั้งหมด" });

        this.LAW_GROUP_SECTION_LIST.filter(f => f.LAW_GROUP_NO === this.LAW_GROUP_NO).forEach(element => {
            partList.push({ PART_NO: element.PART_NO, PART_NAME: element.PART_NAME });
        });

        this.PART_LIST = Array.from(new Set(partList.map(x => x.PART_NO)))
            .map(id => {
                return {
                    PART_NO: id,
                    PART_NAME: partList.find(s => s.PART_NO === id).PART_NAME
                };
            });
    }

    getSection() {
        let sectionList = [];
        this.SECTION_LIST = [];

        this.SECTION_ID = "";

        sectionList.push({ SECTION_ID: "", SECTION_NAME: "ทั้งหมด" });

        this.LAW_GROUP_SECTION_LIST.filter(f => f.LAW_GROUP_NO === this.LAW_GROUP_NO && f.PART_NO === this.PART_NO).forEach(element => {
            sectionList.push({ SECTION_ID: element.SECTION_ID, SECTION_NAME: element.SECTION_NAME });
        });

        this.SECTION_LIST = Array.from(new Set(sectionList.map(x => x.SECTION_ID)))
            .map(id => {
                return {
                    SECTION_ID: id,
                    SECTION_NAME: sectionList.find(s => s.SECTION_ID === id).SECTION_NAME
                };
            });
    }
}
