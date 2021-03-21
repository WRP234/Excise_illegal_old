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

        this.clickSearch({ TEXT_SEARCH: "" });
    }

    ngOnDestroy(): void {
        // this.subOnSearch.unsubscribe();
        //this.subSetNextPage.unsubscribe();
    }


    clickView(masterID: string) {
        this._router.navigate([`/msLawGroupSubSectionRule/manage/R/${masterID}`]);
    }

    clickNew = () => this._router.navigate([`/msLawGroupSubSectionRule/manage/C/NEW`]);

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch
        }

        this.MasService.getAPI1111("MasLawGroupSubSectionRulegetByKeyword", paramsOther).then(list => {
            if(list){
                this.onSearchComplete(list);
                this.preloader.setShowPreloader(false);

                console.log(this.showDataList);
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
    }

    onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);

        this.MasService.getAPI1111("MasLawGroupSubSectionRulegetByConAdv", form.value).then(list => {
            if(list){
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

        list.map(m => {
            if(m.masLawGroupSection){
                m.SECTION_NAME = m.masLawGroupSection.SECTION_NAME;
            }

            let guiltbase = "";
            m.masLawGuiltbase.map(g => {
                guiltbase += '\n' + "- " + g.GUILTBASE_NAME;
            });

            m.GUILTBASE_NAME = guiltbase;
            m.SECTION_ID = m.masLawGroupSubSection.SECTION_ID;
            m.SUBSECTION_NAME = m.masLawGroupSubSection.SUBSECTION_NAME;
        })

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
}
