import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { MasterService } from '../../masters/masters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../config/message';
import { pagination } from '../../../config/pagination';

@Component({
    selector: 'app-searchproduct-modal',
    templateUrl: './searchproduct-modal.component.html',
    styleUrls: ['./searchproduct-modal.component.scss']
})

export class SearchProductModalComponent implements OnInit {
    PRODUCT_GROUP_LIST = [];
    PRODUCT = [];
    SHOW_PRODUCT_LIST = [];
    PRODUCT_GROUP_ID: string;
    PRODUCT_NAME_DESC: string;

    selectAllChb: any;
    paginage = pagination;

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

        this.PRODUCT_GROUP_ID = "";
    }

    async getProductGroup() {
        this.preloader.setShowPreloader(true);

        await this.MasService.getAPI1111("MasProductGROUPCategoryForLiquorgetByCon", {}).then(async list => {
            let prodGroup = [];
            prodGroup.push({ PRODUCT_GROUP_ID: "", PRODUCT_GROUP_NAME: "เลือกหมวดสินค้า" });

            list.forEach(element => {
                if (element.PRODUCT_GROUP_ID == 13)
                    prodGroup.push({ PRODUCT_GROUP_ID: element.PRODUCT_GROUP_ID, PRODUCT_GROUP_NAME: element.PRODUCT_CATEGORY_NAME });
                else
                    prodGroup.push({ PRODUCT_GROUP_ID: element.PRODUCT_GROUP_ID, PRODUCT_GROUP_NAME: element.PRODUCT_GROUP_NAME });
            });


            this.PRODUCT_GROUP_LIST = Array.from(new Set(prodGroup.map(x => x.PRODUCT_GROUP_ID)))
                .map(id => {
                    return {
                        PRODUCT_GROUP_ID: id,
                        PRODUCT_GROUP_NAME: prodGroup.find(s => s.PRODUCT_GROUP_ID === id).PRODUCT_GROUP_NAME
                    };
                });

            this.preloader.setShowPreloader(false);
        }, (error) => { console.error(error); return false; });
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch
        }

        this.MasService.getAPI1111("MasProductMappinggetByKeyword", paramsOther).then(list => {
            this.onSearchComplete(list)

            console.log(list);

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertNoRecord();
            //this.ListProve = [];
            this.preloader.setShowPreloader(false);
        });
    }

    clickAdvSearch() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            PRODUCT_GROUP_ID: this.PRODUCT_GROUP_ID,
            PRODUCT_NAME_DESC: this.PRODUCT_NAME_DESC
        }

        this.MasService.getAPI1111("MasProductMappinggetByConAdv", paramsOther).then(list => {
            this.onSearchComplete(list);

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertNoRecord();
            this.preloader.setShowPreloader(false);
        });
    }

    async onSearchComplete(list: any) {
        this.PRODUCT = [];

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.SHOW_PRODUCT_LIST = [];

            return false;
        }

        await list.map((item) => {
            if (item.IS_DOMESTIC == 1)
                item.DOMESTIC_NAME = "ในประเทศ";
            else if (item.IS_DOMESTIC == 2)
                item.DOMESTIC_NAME = "สถานบริการ";
            else if (item.IS_DOMESTIC == 3)
                item.DOMESTIC_NAME = "ต่างประเทศ";
            else if (item.IS_DOMESTIC == 4)
                item.DOMESTIC_NAME = "ไม่ระบุ";

            item.PRODUCT_FULLNAME = `${item.PRODUCT_CATEGORY_NAME == null ? "" : item.PRODUCT_CATEGORY_NAME}`
                + `${item.PRODUCT_TYPE_NAME == null ? "" : " " + item.PRODUCT_TYPE_NAME}`
                + `${item.SIZES == null ? "" : " ขนาด " + item.SIZES}`
                + `${item.SIZES_UNIT == null ? "" : " " + item.SIZES_UNIT}`
                + `${item.QUANTITY == null ? "" : " จำนวน " + item.QUANTITY}`
                + `${item.QUANTITY_UNIT == null ? "" : " " + item.QUANTITY_UNIT}`
                + `${item.VOLUMN == null ? "" : " รวมปริมาณสุทธิ " + item.VOLUMN}`
                + `${item.VOLUMN_UNIT == null ? "" : " " + item.VOLUMN_UNIT}`;

            item.DEGREE = `${item.PRODUCT_GROUP_ID != '2'
                && item.PRODUCT_GROUP_ID != '6'
                && item.PRODUCT_GROUP_ID != '13' ? "" : item.DEGREE}`;

            item.ISPROVE = false;
            item.ISSELECTED = false;
        })

        if (Array.isArray(list)) {
            this.PRODUCT = list;
        } else {
            this.PRODUCT.push(list);
        }

        // set total record
        //this.Prove = this.Prove.sort((a, b) => a.ProveReportNo.localeCompare(b.ProveReportNo));
        this.paginage.TotalItems = this.PRODUCT.length;
        this.SHOW_PRODUCT_LIST = this.PRODUCT.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.SHOW_PRODUCT_LIST = await this.PRODUCT.slice(event.startIndex - 1, event.endIndex);
    }

    selectedChkAll() {
        for (var i = 0; i < this.SHOW_PRODUCT_LIST.length; i++) {
            this.SHOW_PRODUCT_LIST[i].ISSELECTED = this.selectAllChb;
        }
    }

    checkIfAllChbSelected() {
        this.selectAllChb = this.SHOW_PRODUCT_LIST.every(function (item: any) {
            return item.ISSELECTED == true;
        });
    }

    AddProduct() {
        this.SHOW_PRODUCT_LIST.map(item => {
            item.REMAIN_QUANTITY = item.QUANTITY;
            item.REMAIN_QUANTITY_UNIT = item.QUANTITY_UNIT;
            item.REMAIN_VOLUMN = item.VOLUMN;
            item.REMAIN_VOLUMN_UNIT = item.VOLUMN_UNIT;
        });

        let prod = this.SHOW_PRODUCT_LIST.filter(f => f.ISSELECTED == true);
        this.passEntry.emit(prod);
    }

    dismiss(e) {
        this.passEntry.emit(e);
    }
}
