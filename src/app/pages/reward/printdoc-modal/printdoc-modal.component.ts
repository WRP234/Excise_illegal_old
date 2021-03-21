import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RewardService } from '../reward.service';
import { appConfig } from "app/app.config";
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, FormControlName, Form , ValidatorFn, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    mode : any;
    BRIDE_ID : any;
    REWARD_ID : any;
    HAVE_NOTICE : any;
    INDICTMENT_ID : any;
    BRIBE_REWARD_ID : any;
    COMPARE_ID : any;

    constructor(
        private ActiveModal: NgbActiveModal,
        private rewardService: RewardService,
        private fb: FormBuilder,
        private _router: Router,
        private preloader: PreloaderService,
        private http: HttpClient,
        private httpClient: HttpClient
    ) { }

    ngOnInit() {
        console.log("BRIDE_ID : ",this.BRIDE_ID);
        console.log("REWARD_ID : ",this.REWARD_ID);
        console.log("HAVE_NOTICE : ",this.HAVE_NOTICE);

        this.printForm = this.fb.group({
            print: this.fb.array([]),
        });
        if(this.HAVE_NOTICE == 1){
            this.setPrint();
        }else if(this.HAVE_NOTICE == 0){
            this.setPrint2();
        }
    }

    get print(): FormArray {return this.printForm.get('print') as FormArray;}

    setPrint() {
        let control = <FormArray>this.printForm.controls.print;
        control.push(this.fb.group({
            NAME : new FormControl('คำร้องขอรับเงินสินบน รว.3'),
            TYPE : new FormControl(1),
            printIndex : new FormControl(false),
        }));
        control.push(this.fb.group({
                NAME : new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการเปรียบเทียบคดี รว.4'),
                TYPE : new FormControl(2),
                printIndex : new FormControl(false),
        }));
        // control.push(this.fb.group({
        //     NAME : new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการพิพากษา รว.5'),
        //     TYPE : new FormControl(3),
        //     printIndex : new FormControl(false),
        // }));
        control.push(this.fb.group({
                NAME : new FormControl('รายงานการจับกุมดำเนินคดีของเจ้าพนักงาน รว.7'),
                TYPE : new FormControl(4),
                printIndex : new FormControl(false),
        }));
        control.push(this.fb.group({
                NAME : new FormControl('แบบฟอร์มตารางการแบ่งจ่ายเงินสินบนรางวัล รว.8'),
                TYPE : new FormControl(5),
                printIndex : new FormControl(false),
        }));
        console.log("print : ",this.print.getRawValue())
    }

    setPrint2() {
        let control = <FormArray>this.printForm.controls.print;
        // control.push(this.fb.group({
        //     NAME : new FormControl('คำร้องขอรับเงินสินบน รว.3'),
        //     TYPE : new FormControl(1),
        //     printIndex : new FormControl(false),
        // }));
        control.push(this.fb.group({
                NAME : new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการเปรียบเทียบคดี รว.4'),
                TYPE : new FormControl(2),
                printIndex : new FormControl(false),
        }));
        // control.push(this.fb.group({
        //     NAME : new FormControl('คำร้องขอรับเงินรางวัลกรณีคดีถึงที่สุด โดยการพิพากษา รว.5'),
        //     TYPE : new FormControl(3),
        //     printIndex : new FormControl(false),
        // }));
        control.push(this.fb.group({
                NAME : new FormControl('รายงานการจับกุมดำเนินคดีของเจ้าพนักงาน รว.7'),
                TYPE : new FormControl(4),
                printIndex : new FormControl(false),
        }));
        control.push(this.fb.group({
                NAME : new FormControl('แบบฟอร์มตารางการแบ่งจ่ายเงินสินบนรางวัล รว.8'),
                TYPE : new FormControl(5),
                printIndex : new FormControl(false),
        }));
        console.log("print : ",this.print.getRawValue())
    }

    chkPrint : any = [];
    onSelect(e,i){
        // console.log(e,i);
        let control = <FormArray>this.printForm.controls.print;
        if(e.target.checked == true){
            if (i == 'all'){
                console.log('print all');
                for (var s =0; s< this.print.getRawValue().length;s++){
                    this.chkPrint.push({
                        index : s
                     });
                     control.at(s).patchValue({
                        printIndex : true
                     })
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

    onPrint(){
        let control = <FormArray>this.printForm.controls.print;
        if (this.chkPrint.length == 0){
            console.log("print is null");
        }else{
            console.log("print : ",this.chkPrint);
            this.chkPrint.map(m=>{
                this.file(control.at(m.index).value)
            })
        }
    }

    async file(e){
        console.log("e: ",e);
        let form : any = [];
        form.push(e);
        form.map(async m=>{
            console.log(m)
            if(m.TYPE == 1){
                const param = { 
                    "RequestBribeID": this.BRIDE_ID,
                }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_08_001(param).subscribe(x => {
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
                });
            }
            if(m.TYPE == 2){
                const param = {
                    "CompareID" : this.COMPARE_ID,
                  }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_09_001(param).subscribe(x => {
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
                });
            }
            if(m.TYPE == 3){
                const param = {
                    "RequestBribeID" : this.BRIDE_ID,
                  }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_09_002(param).subscribe(x => {
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
                });
            }
            if(m.TYPE == 4){
                const param = {
                    "BribeRewardID" : this.BRIBE_REWARD_ID,
                  }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_09_003(param).subscribe(x => {
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
                });
            }
            if(m.TYPE == 5){
                const param = {
                    "BRIBE_REWARD_ID" : this.BRIBE_REWARD_ID,
                  }
                this.preloader.setShowPreloader(true);
                await this.ILG60_00_09_004(param).subscribe(x => {
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
                });
            }
            
        })
    }

    ILG60_00_08_001(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_08_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_09_001(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_09_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_09_002(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_09_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_09_003(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_09_003.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
        .catch(this.onCatch)
        .do((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error);
        })
        .map(x => x).finally(() => this.onEnd)
    }

    ILG60_00_09_004(params : any) {
        const url = `${appConfig.apiReport}/ILG60_00_09_004.aspx`;
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


    dismiss(e: any) {
        this.ActiveModal.close();
    }

    close(e: any) {
        this.ActiveModal.close();
    }
}
