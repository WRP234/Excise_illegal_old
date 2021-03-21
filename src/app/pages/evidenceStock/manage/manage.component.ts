import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { EvidenceStockService } from '../evidenceStock.service';
import { EvidenceService } from '../../evidenceIn/evidenceIn.service'
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import * as formatDate from '../../../config/dateFormat';
import { Message } from '../../../config/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import { del } from '../../../../../node_modules/@types/selenium-webdriver/http';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { async } from '../../../../../node_modules/@angular/core/testing';
import { toLocalShort, compareDate, setZeroHours, setDateMyDatepicker, getDateMyDatepicker } from '../../../config/dateFormat';
import { pagination } from '../../../config/pagination';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import swal from 'sweetalert2';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit, OnDestroy {
    private sub: any;
    private onPrintSubscribe: any;

    WarehourseID: string;
    OfficeName: string;
    WarehouseName: string;
    EvidenceInventoryList = [];
    EvidenceInventoryPagging = [];


    modal: any;
    paginage = pagination;


    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private ngbModel: NgbModal,
        private navService: NavigationService,
        private EvidenceStockService: EvidenceStockService,
        private preloader: PreloaderService,
        private router: Router,
        private sidebarService: SidebarService
    ) {
        // set false
        this.navService.setNewButton(false);
        this.navService.setSearchBar(false);
        this.navService.setNextPageButton(false);
    }

    async ngOnInit() {
        this.preloader.setShowPreloader(true);
        this.active_Route();
        this.navigate_Service();

        await this.ShowEvidenceStock();
        this.preloader.setShowPreloader(false);
    }

    ngOnDestroy(): void {
        this.onPrintSubscribe.unsubscribe();
    }

    private active_Route() {
        this.navService.setSaveButton(false);
        this.navService.setCancelButton(false);
        // set true
        this.navService.setPrintButton(true);
        this.navService.setEditButton(false);
        this.navService.setDeleteButton(false);
        this.navService.setEditField(false);

        this.sub = this.activeRoute.params.subscribe(p => {
            this.WarehourseID = p['code'];
        });
    }

    private navigate_Service() {
        this.onPrintSubscribe = this.navService.onPrint.subscribe(async status => {
            if (status) {
                await this.navService.setOnPrint(false);
                this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true });
            }
        });
    }

    clickView(EvidenceOutID: string) {
        this.router.navigate(['/evidenceStock/managedetail', '1']);
    }

    ShowEvidenceStock() {
        this.EvidenceStockService.getByCon(this.WarehourseID).then(async res => {
            if (res != null && res.IsSuccess != "False") {
                this.EvidenceInventoryList = res;
                this.preloader.setShowPreloader(false);

                // set total record
                this.paginage.TotalItems = this.EvidenceInventoryList.length;
                this.EvidenceInventoryPagging = this.EvidenceInventoryList.slice(0, this.paginage.RowsPerPageOptions[0]);
            } else {
                this.ShowAlertError("Data not found");
                this.preloader.setShowPreloader(false);
                //this.router.navigate(['/evidenceStock/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API EvidenceInventoryCheckStockgetByCon :: " + err.message);
        });
    }

    async pageChanges(event) {
        this.EvidenceInventoryPagging = await this.EvidenceInventoryList.slice(event.startIndex - 1, event.endIndex);
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
