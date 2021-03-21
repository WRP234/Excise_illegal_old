import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { MasterService } from '../../masters/masters.service';

@Component({
    selector: 'app-vatprove-modal',
    templateUrl: './vatprove-modal.component.html',
    styleUrls: ['./vatprove-modal.component.scss']
})

export class VatProveModalComponent implements OnInit {
    PRODUCT_GROUP_LIST = [];
    PRODUCT_GROUP_CODE: string;

    PRODUCT_DUTY_LIST = [];
    PRODUCT_CAL_LIST = [];
    PRODUCT_DUTY: any;
    TAX_VALUE: number;
    TAX_VOLUMN: number;

    isOpen = false;
    isCheckAll = false;
    document = new Array<Document>();

    @Input() PROVE_ID: string;
    // @Input() ArrestCode: string;
    // @Input() IndictmentID: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        private proveService: ProveService,
        private MasService: MasterService,
        private preloader: PreloaderService
    ) { }

    async ngOnInit() {
        await this.getProductGroup();

        this.PRODUCT_DUTY_LIST.push({ PRODUCT_CODE: "", DUTY_NAME: "เลือกพิกัดอัตราภาษี" });

        this.PRODUCT_GROUP_CODE = "";
        this.PRODUCT_DUTY = "";
        this.TAX_VALUE = 1;
        this.TAX_VOLUMN = 2;
    }

    async getProductGroup() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            PRODUCT_GROUP_ID: "",
            PRODUCT_GROUP_CODE: ""
        }

        await this.MasService.getAPI1111("MasProductGroupgetByCon", paramsOther).then(async list => {
            // console.log(list);
            this.PRODUCT_GROUP_LIST.push({ PRODUCT_GROUP_CODE: "", PRODUCT_GROUP_NAME: "เลือกหมวดสินค้า" });

            list.forEach(element => {
                this.PRODUCT_GROUP_LIST.push(element);
            });

            this.preloader.setShowPreloader(false);
        }, (error) => { console.error(error); return false; });
    }

    getProductPRC() {
        this.PRODUCT_CAL_LIST = [];

        this.preloader.setShowPreloader(true);
        this.MasService.getAPI1111("MasProductCategoryGroupPRCgetByCon", { DUTY_CODE: this.PRODUCT_GROUP_CODE }).then(list => {
            this.PRODUCT_DUTY_LIST = [];
            this.PRODUCT_DUTY_LIST.push({ PRODUCT_CODE: "", LAW_DUTY_CODE: "", DUTY_NAME: "เลือกพิกัดอัตราภาษี" });

            if (list) {
                list.forEach(element => {
                    this.PRODUCT_DUTY_LIST.push({
                        PRODUCT_CODE: element.PRODUCT_CODE
                        , LAW_DUTY_CODE: this.MappingNullData(element.LAW_DUTY_CODE)
                        , DUTY_NAME: this.MappingNullData(element.LAW_DUTY_CODE) + " " + this.MappingNullData(element.PRODUCT_NAME)
                    });
                });
            }

            this.preloader.setShowPreloader(false);
        }, (error) => { console.error(error); return false; });
    }

    SelectedProductPRC() {
        this.PRODUCT_CAL_LIST = [];

        let dutyModel = this.PRODUCT_DUTY_LIST.find(f => f.PRODUCT_CODE == this.PRODUCT_DUTY);
        dutyModel.PRODUCT_GROUP_ID = this.PRODUCT_GROUP_CODE;
        dutyModel.IS_TAX_VALUE = 1;
        dutyModel.IS_TAX_VOLUMN = 1;
        dutyModel.TAX_VALUE = this.TAX_VALUE;
        dutyModel.TAX_VOLUMN = this.TAX_VOLUMN;
        dutyModel.VOLUMN = "";
        dutyModel.PRICE = "";
        dutyModel.QUANTITY = "";

        this.PRODUCT_CAL_LIST.push(dutyModel);
    }

    dismiss(e: any) {
        this.passEntry.emit(e);
    }

    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`;
    }

    MappingNullNumberData(str: string) {
        return `${str == 'null' || str == null ? "0" : str}`;
    }

    CalVat() {
        let m = this.PRODUCT_CAL_LIST[0];

        if (m != undefined) {
            if (m.PRODUCT_GROUP_ID == 13) {  // สุรา
                if (m.IS_TAX_VALUE == "1")
                    m.VAT_VALUE = (+this.MappingNullNumberData(m.DEGREE) * +this.MappingNullNumberData(m.PRICE.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100*7

                if (m.IS_TAX_VOLUMN == "1")
                    m.VAT_VOLUMN = (+this.MappingNullNumberData(m.DEGREE) * +this.MappingNullNumberData(m.VOLUMN) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100*7
            }
            else { // ไม่ใช่สุรา
                if (m.IS_TAX_VALUE == "1")
                    m.VAT_VALUE = (+this.MappingNullNumberData(m.PRICE) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100*7

                if (m.IS_TAX_VOLUMN == "1")
                    m.VAT_VOLUMN = (+this.MappingNullNumberData(m.VOLUMN) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100*7
            }

            //m.VAT = (+this.MappingNullNumberData(m.VAT_VALUE) + +this.MappingNullNumberData(m.VAT_VOLUMN)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            m.VAT = (+this.MappingNullNumberData(m.VAT_VALUE) + +this.MappingNullNumberData(m.VAT_VOLUMN));
        }
        else
            m.VAT = 0.0000;
    }

    CalTotalVat() {
        let m = this.PRODUCT_CAL_LIST[0];

        if (m != undefined) {
            //m.VAT = (+this.MappingNullNumberData(m.VAT_VALUE) + +this.MappingNullNumberData(m.VAT_VOLUMN)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            m.VAT = (+this.MappingNullNumberData(m.VAT_VALUE) + +this.MappingNullNumberData(m.VAT_VOLUMN));
        }
        else
            m.VAT = 0.0000;
    }

    formatVolumn() {
        let m = this.PRODUCT_CAL_LIST[0];

        m.VOLUMN = m.PRODUCT_GROUP_ID == 2 || m.PRODUCT_GROUP_ID == 1 || m.PRODUCT_GROUP_ID == 13 || m.PRODUCT_GROUP_ID == 14
            ? (+m.VOLUMN).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            : (+m.VOLUMN).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
