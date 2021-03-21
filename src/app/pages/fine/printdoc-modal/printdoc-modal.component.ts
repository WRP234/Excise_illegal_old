import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FineService } from '../fine.service';
import { appConfig } from "app/app.config";
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form , ValidatorFn, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
    selector: 'app-printdoc-modal',
    templateUrl: './printdoc-modal.component.html',
    styleUrls: ['./printdoc-modal.component.scss']
})

export class PrintDocModalComponent implements OnInit {

    form : any;
    compare_id : any;
    LawsuitID : any;
    printForm : FormGroup;
    printForm2 : FormGroup;

    constructor(
        private ActiveModal: NgbActiveModal,
        private fineService: FineService,
        private fb: FormBuilder,
        private _router: Router,
        private preloader: PreloaderService,
        private http: HttpClient,
        private httpClient: HttpClient
    ) { }

    ngOnInit() {

        this.printForm = this.fb.group({
            print: this.fb.array([]),
        });
        this.printForm2 = this.fb.group({
            print: this.fb.array([]),
        });
        this.setPrint();
        this.setPrint2();
    }

    get print(): FormArray {return this.printForm.get('print') as FormArray;}
    get print2(): FormArray {return this.printForm2.get('print') as FormArray;}

    setPrint() {
        let form = this.form.aboutPayFine;
        let control = <FormArray>this.printForm.controls.print;
        console.log("form : ",this.form)
        form.map(m=>{
            if(form.COMPARE_NO !== null || form.COMPARE_NO !== ''){
                var name = 'บันทึกการเปรียบเทียบคดี ส.ส.2/52 ';
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(2),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }
            if(form.COMPARE_NO !== null || form.COMPARE_NO !== ''){
                var name = 'บันทึกคำให้การของผู้ต้องหา ส.ส.2/53 ';
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(3),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }
            if(m.COMMAND_NO !== null || m.COMMAND_NO !== ''){
                var name = 'คำร้องขอให้เปรียบเทียบคดี (คด.1) ';
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(4),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }

            if(m.COMMAND_NO !== null || m.COMMAND_NO !== ''){
                var name = 'รายงานขออนุมัติ (คด.2) ';
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(5),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }
        });
        console.log("print : ",this.print.getRawValue())
    }

    setPrint2() {
        let form = this.form.aboutPayFine;
        let control = <FormArray>this.printForm2.controls.print;
        console.log("form : ",this.form)
        form.map(m=>{
            if(m.IS_PAYMENT == 1){
                var name = 'ใบเสร็จรับชำระค่าปรับ '+m.NAME;
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(m.RECEIPT_TYPE),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }

            if(m.APPROVE_TYPE == 1){
                var name = 'แบบอนุมัติ 1 (คด.3) '+m.NAME;
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(6),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }

            if(m.APPROVE_TYPE == 2){
                var name = 'แบบอนุมัติ 2 (คด.4) '+m.NAME;
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(7),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }

            if(m.APPROVE_TYPE == 3){
                var name = 'แบบอนุมัติ 3 (คด.5) '+m.NAME;
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(8),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }

            if(m.APPROVE_TYPE == 4){
                var name = 'แบบอนุมัติ 4 (คด.6) '+m.NAME;
                control.push(this.fb.group({
                    NAME : new FormControl(name),
                    PERSON : new FormControl(m.NAME),
                    IS_PAYMENT : new FormControl(m.IS_PAYMENT),
                    RECEIPT_TYPE : new FormControl(9),
                    RECEIPT_NO : new FormControl(m.RECEIPT_NO),
                    RECEIPT_BOOK_NO : new FormControl(m.RECEIPT_BOOK_NO),
                    DID : new FormControl(m.DID),
                    TYPE : new FormControl(1),
                    printIndex : new FormControl(false),
                    COMPARE_DETAIL_ID : new FormControl(m.COMPARE_DETAIL_ID),
                }));
            }
        });
        console.log("print : ",this.print2.getRawValue())
    }

    chkPrint : any = [];
    onSelect(e,i){
        // console.log(e,i);
        let control = <FormArray>this.printForm.controls.print;
        if(e.target.checked == true){
            if (i == 'all'){
                console.log('print all');
                for (var s =0; s< this.print.getRawValue().length;s++){
                    
                    if(this.print.getRawValue()[s].RECEIPT_TYPE == 1 && this.print.getRawValue()[s].RECEIPT_TYPE !== ''){
                        console.log("dis print : ",this.print.getRawValue()[s]);
                    }else{
                    this.chkPrint.push({
                        index : s
                     });
                     control.at(s).patchValue({
                        printIndex : true
                     });
                    }
                }
            }else{
                this.chkPrint.push({
                   index : i
                });
                control.at(i).patchValue({
                    printIndex : true
                })
            }
        }else{
            if (i == 'all'){
                this.chkPrint = [];
                for (var s =0; s< this.print.getRawValue().length;s++){
                    control.at(s).patchValue({
                        printIndex : false
                    });
                }
            }else{
                this.chkPrint = [];
                control.at(i).patchValue({
                    printIndex : false
                 });
            }
        }
        // console.log("chkPrint : ",this.chkPrint)
    }

    chkPrint2 : any = [];
    onSelect2(e,i){
        // console.log(e,i);
        let control = <FormArray>this.printForm2.controls.print;
        if(e.target.checked == true){
            if (i == 'all'){
                console.log('print all');
                for (var s =0; s< this.print2.getRawValue().length;s++){
                    
                    if(this.print2.getRawValue()[s].RECEIPT_TYPE == 1 && this.print2.getRawValue()[s].RECEIPT_TYPE !== ''){
                        console.log("dis print : ",this.print2.getRawValue()[s]);
                    }else{
                    this.chkPrint2.push({
                        index : s
                     });
                     control.at(s).patchValue({
                        printIndex : true
                     });
                    }
                }
            }else{
                this.chkPrint2.push({
                   index : i
                });
                control.at(i).patchValue({
                    printIndex : true
                })
            }
        }else{
            if (i == 'all'){
                this.chkPrint2 = [];
                for (var s =0; s< this.print2.getRawValue().length;s++){
                    control.at(s).patchValue({
                        printIndex : false
                    });
                }
            }else{
                this.chkPrint2 = [];
                control.at(i).patchValue({
                    printIndex : false
                 });
            }
        }
        // console.log("chkPrint : ",this.chkPrint)
    }

    onPrint(){
        let control = <FormArray>this.printForm.controls.print;
        let control2 = <FormArray>this.printForm2.controls.print;

        if (this.chkPrint.length == 0){
            console.log("print1 is null");
        }else{
            console.log("print1 : ",this.chkPrint);
            this.chkPrint.map(m=>{
                this.file(control.at(m.index).value);
            });
        }

        if (this.chkPrint2.length == 0){
            console.log("print2 is null");
        }else{
            console.log("print2 : ",this.chkPrint2);
            this.chkPrint2.map(m=>{
                this.file(control2.at(m.index).value);
            });
        }
    }

    async file(e){
        console.log("e: ",e);
        let form : any = [];
        form.push(e);
        form.map(async m=>{
            console.log(m)
            if(m.RECEIPT_TYPE == 0){ //ใบเส็จ manual
                const param = {
                    "receipt_no": m.RECEIPT_NO,
                    "SystemId": "systemid",
                    "UserName": "my_username",
                    "Password": "bbbbb",
                    "IpAddress": "10.11.1.10",
                    "Operation": "1",
                    "RequestData":
                    {
                    //   "UserName": localStorage.getItem("UserName"),
                    //   "OffCode": localStorage.getItem("officeCode")
                        "UserName":"wannapa_j",       
                        "OffCode":"100300"   
                    }
                }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_002(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)

                    // downloadLink.href = linkSource;
                    // downloadLink.download = fileName;
                    // downloadLink.click();
                    // };
                    // reader.onerror = function (error) {
                    // console.log('Error: ', error);
                    // };
                    this.preloader.setShowPreloader(false);
                })
                // .catch(e=>{
                //     console.log(e)
                //     this.preloader.setShowPreloader(false);
                //     swal({
                //         type: 'warning',
                //         text: "พิมพ์เอกสารไม่สำเร็จ",
                //         confirmButtonText: 'ตกลง',
                //         buttonsStyling: true,
                //     })
                // })
            } 
            
            if (m.RECEIPT_TYPE == 1){ //ใบเส็จ auto
                const param = {
                    "dID": m.DID
                }
                this.preloader.setShowPreloader(true);
                await this.fineService.signerDID("signerDID",param).then(async res => {
                    console.log("res",res)
                    const linkSource = await 'data:application/pdf;base64,'+res.data.primaryFile;
                    const downloadLink = document.createElement("a");
                    const fileName = "ใบเสร็จรับชำระค่าปรับ (Auto).pdf";
    
                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                    this.preloader.setShowPreloader(false);
                }).catch(e=>{
                    console.log(e)
                    this.preloader.setShowPreloader(false);
                    swal({
                        type: 'warning',
                        text: "พิมพ์เอกสารไม่สำเร็จ",
                        confirmButtonText: 'ตกลง',
                        buttonsStyling: true,
                    })
                })
            } 

            if(m.RECEIPT_TYPE == 2){ //บันทึกคำให้การของผู้ต้องหา ส.ส. 2/52
                const param = { "CompareID": this.compare_id}
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_003(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            }

            if(m.RECEIPT_TYPE == 3){ //บันทึกคำให้การของผู้ต้องหา ส.ส. 2/53
                const param = { "CompareID": this.compare_id}
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_001(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            }
            
            if(m.RECEIPT_TYPE == 4){ //คด.1
                const param = { "LawsuitID": this.LawsuitID }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_004(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            } 
            
            if(m.RECEIPT_TYPE == 5){ //คด.2
                const param = { "CompareID": this.compare_id }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_005(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            } 
            
            if(m.RECEIPT_TYPE == 6){ //คด.3
                const param = { "CompareDetailID": e.COMPARE_DETAIL_ID }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_006(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            }
            
            if(m.RECEIPT_TYPE == 7){ //คด.4
                const param = { "CompareDetailID": e.COMPARE_DETAIL_ID }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_007(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            } 
            
            if(m.RECEIPT_TYPE == 8){ //คด.5
                const param = { "CompareDetailID": e.COMPARE_DETAIL_ID }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_008(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            } 
            
            if(m.RECEIPT_TYPE == 9){ //คด.6
                const param = { "CompareDetailID": e.COMPARE_DETAIL_ID }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_06_009(param).subscribe(x => {
                    // console.log("x : ",x)
                    const file = new Blob([x], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    // console.log(reader.result)
                    // const linkSource = `${reader.result}`;
                    // const downloadLink = document.createElement("a");
                    // const fileName = "ใบเสร็จรับชำระค่าปรับ (Manual).pdf";
                    // console.log("file : ",file)
                    // console.log("linkSource : ",linkSource)
                    // }
                    this.preloader.setShowPreloader(false);
                });
            }
            
        })
    }

    async ReportForm06_002(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: "blob" }).map(res => res).toPromise()
    }
    

    ILG60_00_06_001(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_002(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_003(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_003.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_004(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_004.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_005(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_005.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_006(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_006.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_007(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_007.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_008(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_008.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_06_009(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_06_009.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }
    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }
    private onEnd(): void {
        this.preloader.setShowPreloader(false);
    }

    ReportForm06_001(CompareID: string) {
        const params = {
            CompareID: CompareID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_001.aspx`;

        return this.httpClient.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }
    
    ReportForm06_003(mCompareID: string, mIndictmentID: string, ArrestCode: string) {
        const params = {
            CompareID: mCompareID,
            // IndictmentID: mIndictmentID,
            // ArrestCode: ArrestCode
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_003.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }

    ReportForm06_005(CompareID: string) {
        console.log(' ReportForm06_005 CompareID : ', CompareID)
        const params = {
            CompareID: CompareID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_005.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }
    ReportForm06_006(CompareDetailID: string) {
        const params = {
            CompareDetailID: CompareDetailID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_006.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }
    ReportForm06_007(CompareDetailID: string) {
        const params = {
            CompareDetailID: CompareDetailID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_007.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }
    ReportForm06_008(CompareDetailID: string) {
        const params = {
            CompareDetailID: CompareDetailID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_008.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }
    ReportForm06_009(CompareDetailID: string) {
        const params = {
            CompareDetailID: CompareDetailID
        };
        const url = `${appConfig.apiReport}/ILG60_00_06_009.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .map(x => x)
            .finally(() => this.onEnd());
    }


    dismiss(e: any) {
        this.ActiveModal.close();
    }

    close(e: any) {
        this.ActiveModal.close();
    }
}
