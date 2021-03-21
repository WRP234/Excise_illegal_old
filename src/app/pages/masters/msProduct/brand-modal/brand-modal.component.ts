import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import swal from 'sweetalert2';
import { MastersConfig } from '../../masters.config';
import { MasterService } from '../../masters.service';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { Message } from 'app/config/message';

@Component({
    selector: 'app-brand-modal',
    templateUrl: './brand-modal.component.html',
    styleUrls: ['./brand-modal.component.scss']
})

export class BrandModalComponent implements OnInit {

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Input() PopupType: string;
    @Input() PopupMode: string;
    @Input() PopupModel: any;
    @Input() PRODUCT_BRAND_ID: any;
    @Output() passEntry = new EventEmitter();

    private sub: any;
    oParam: any = null;
    oFunc: any;
    ID: string;
    PRODUCT_GROUP_CODE: string;
    NAME: string;
    NAME_THAI: string;
    NAME_ENG: string;
    CREATE_DATE: any;
    CREATE_USER_ACCOUNT_ID: string;

    constructor(
        private activeRoute: ActivatedRoute,
        private MasService: MasterService,
        private preloader: PreloaderService
    ) { }

    ngOnInit() {
        console.log('this.PopupMode : ', this.PopupMode)
        console.log('this.PopupModel : ', this.PopupModel)

        /** clear null string */
        for (let key in this.PopupModel) {
            if (this.PopupModel[key] === 'null') {
                this.PopupModel[key] = null;
            }
        }

        this.PRODUCT_GROUP_CODE = this.PopupModel.PRODUCT_GROUP_CODE
        if (this.PopupMode == 'C') {
            this.ID = "Auto Generate";
        }
        else if (this.PopupMode == 'R') {
            switch (this.PopupType) {
                case 'Brand':
                    this.ID = this.PopupModel.PRODUCT_BRAND_ID;
                    this.NAME_THAI = this.PopupModel.PRODUCT_BRAND_NAME_TH;
                    this.NAME_ENG = this.PopupModel.PRODUCT_BRAND_NAME_EN;

                    break;
                case 'SubBrand':
                    this.ID = this.PopupModel.PRODUCT_SUBBRAND_ID;
                    this.NAME_THAI = this.PopupModel.PRODUCT_SUBBRAND_NAME_TH;
                    this.NAME_ENG = this.PopupModel.PRODUCT_SUBBRAND_NAME_EN;

                    break;
                case 'Model':
                    this.ID = this.PopupModel.PRODUCT_MODEL_ID;
                    this.NAME = this.PopupModel.PRODUCT_MODEL_NAME_TH;
                    
                    break;
                case 'Size':
                    this.ID = this.PopupModel.SIZE_ID;
                    this.NAME = this.PopupModel.SIZE_DESC;

                    break;
                case 'Unit':
                    this.ID = this.PopupModel.UNIT_ID;
                    this.NAME = this.PopupModel.UNIT_NAME_TH;
                    this.CREATE_DATE = this.PopupModel.CREATE_DATE;
                    this.CREATE_USER_ACCOUNT_ID = this.PopupModel.CREATE_USER_ACCOUNT_ID;

                    break;
            }
        }
    }

    SetData() {
        this.ID = `${this.ID == "Auto Generate" ? "" : this.ID}`;

        if (this.PopupMode == 'C') {
            switch (this.PopupType) {
                case 'Brand':
                    this.oFunc = "MasProductBrandinsAll";

                    this.oParam = {
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_BRAND_ID: this.ID,
                        PRODUCT_BRAND_NAME_TH: this.NAME_THAI,
                        PRODUCT_BRAND_NAME_EN: this.NAME_ENG,
                        UPDATE_DATE: this.getCurrentDate(),
                        UPDATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
                case 'SubBrand':
                    this.oFunc = "MasProductSubBrandinsAll";

                    this.oParam = {
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_SUBBRAND_ID: this.ID,
                        PRODUCT_SUBBRAND_NAME_TH: this.NAME_THAI,
                        PRODUCT_SUBBRAND_NAME_EN: this.NAME_ENG,
                        CREATE_DATE: this.getCurrentDate(),
                        CREATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Model':
                    this.oFunc = "MasProductModelinsAll";

                    this.oParam = {
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_MODEL_ID: this.ID,
                        PRODUCT_MODEL_NAME_TH: this.NAME,
                        CREATE_DATE: this.getCurrentDate(),
                        CREATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        PRODUCT_CATEGORY_CODE: this.PRODUCT_BRAND_ID,
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Size':
                    this.oFunc = "MasProductSizeinsAll";

                    this.oParam = {
                        SIZE_ID: this.ID,
                        SIZE_DESC: this.NAME,
                        CREATE_DATE: this.getCurrentDate(),
                        CREATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Unit':
                    this.oFunc = "MasProductUnitinsAll";

                    this.oParam = {
                        UNIT_ID: this.ID,
                        UNIT_NAME_TH: this.NAME,
                        CREATE_DATE: this.getCurrentDate(),
                        CREATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
            }
        }
        else if (this.PopupMode == 'R') {
            switch (this.PopupType) {
                case 'Brand':
                    this.oFunc = "MasProductBrandupdAll";

                    this.oParam = {
                        ...this.oParam,
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_BRAND_ID: this.ID,
                        PRODUCT_BRAND_NAME_TH: this.NAME_THAI,
                        PRODUCT_BRAND_NAME_EN: this.NAME_ENG,
                        UPDATE_DATE: this.getCurrentDate(),
                        UPDATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
                case 'SubBrand':
                    this.oFunc = "MasProductSubBrandupdAll";

                    this.oParam = {
                        ...this.oParam,
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_SUBBRAND_ID: this.ID,
                        PRODUCT_SUBBRAND_NAME_TH: this.NAME_THAI,
                        PRODUCT_SUBBRAND_NAME_EN: this.NAME_ENG,
                        UPDATE_DATE: this.getCurrentDate(),
                        UPDATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Model':
                    this.oFunc = "MasProductModelupdAll";

                    this.oParam = {
                        ...this.oParam,
                        PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE,
                        PRODUCT_MODEL_ID: this.ID,
                        PRODUCT_MODEL_NAME_TH: this.NAME,
                        UPDATE_DATE: this.getCurrentDate(),
                        UPDATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        PRODUCT_CATEGORY_CODE: this.PRODUCT_BRAND_ID,
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Size':
                    this.oFunc = "MasProductSizeupdAll";

                    this.oParam = {
                        SIZE_ID: this.ID,
                        SIZE_DESC: this.NAME,
                        IS_ACTIVE: 1
                    }

                    break;
                case 'Unit':
                    this.oFunc = "MasProductUnitupdAll";

                    this.oParam = {
                        UNIT_ID: this.ID,
                        UNIT_NAME_TH: this.NAME,
                        UPDATE_DATE: this.getCurrentDate(),
                        //UPDATE_USER_ACCOUNT_ID: localStorage.getItem('UserAccountID'),
                        CREATE_DATE: this.CREATE_DATE,
                        CREATE_USER_ACCOUNT_ID: this.CREATE_USER_ACCOUNT_ID,
                        IS_ACTIVE: 1
                    }

                    break;
            }
        }
    }

    async onSave() {
        this.SetData();

        if (this.PopupMode == 'C') {
            await this.InsMaster();
        }
        else if (this.PopupMode == 'R') {
            await this.UpdMaster();
        }
    }

    async InsMaster() {
        this.preloader.setShowPreloader(true);

        await this.MasService.MasinsAll(this.oFunc, this.oParam).then(async item => {
            if (item.IsSuccess === "True") {
                this.ShowAlertSuccess(Message.saveComplete);
                this.oParam = { ...this.oParam, ...item };
                this.dismiss();
                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError(Message.saveFail);
            }
        }, (error) => { console.error(error); return false; });
    }

    async UpdMaster() {
        this.preloader.setShowPreloader(true);

        await this.MasService.MasinsAll(this.oFunc, this.oParam).then(async item => {
            if (item.IsSuccess === "True") {
                this.ShowAlertSuccess(Message.saveComplete);
                this.oParam = { ...this.oParam, ...item };
                this.dismiss();
                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError(Message.saveFail);
            }
        }, (error) => { console.error(error); return false; });
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

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    dismiss() {
        if (this.oParam == null) {
            this.SetData();
        }
        this.passEntry.emit(this.oParam);
        this.c.emit('Cross click');
    }
}
