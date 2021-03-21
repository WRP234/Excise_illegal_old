import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { FindValueOperator } from 'rxjs/internal/operators/find';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../../app.config';
import { map } from "rxjs/operators";
import { Injectable, isDevMode } from "@angular/core";
import swal from 'sweetalert2';
import { MasOfficeModel, MasOfficeModel_New } from '../../../models/mas-office.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MainMasterService } from '../../../services/main-master.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FineService } from '../fine.service';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import { resource } from 'selenium-webdriver/http';
import { create } from 'domain';
import { async } from '@angular/core/testing';
import { error } from 'protractor';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './ILG60_O_05_00_02_04.html',
  styleUrls: ['./ILG60_O_05_00_02_04.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ILG60_O_05_00_02_04 {
  constructor(
    private mainMasterService: MainMasterService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private fineService: FineService,
    private preloader: PreloaderService,
  ) { }

  Uid: any;
  setText: any;
  controlForm: FormGroup;
  imageSource;
  RECEIPT_NO: any;

  async ngOnInit() {

    this.preloader.setShowPreloader(true);
    const staff = JSON.parse(localStorage.getItem("staffInfo"));
    this.controlForm = this.fb.group({
      signature: new FormControl(false),
      staffname: new FormControl(staff.TITLE_NAME_TH + staff.FIRST_NAME + " " + staff.LAST_NAME, Validators.required),
      office: new FormControl(staff.OPERATION_OFFICE_SHORT_NAME),
      postname: new FormControl(staff.OPREATION_POS_NAME),
    })
    // console.log("imageSource:",this.imageSource)
    if (this.imageSource == null) {
      this.controlForm.patchValue({
        signature: false
      })
      swal({
        type: 'warning',
        text: 'ไม่พบข้อมูลลายซ็น',
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
    } else {
      this.controlForm.patchValue({
        signature: true
      })
    }
    this.preloader.setShowPreloader(false);
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  async ReportForm06_002(params: any) {
    console.log('1')
    const url = `${appConfig.apiReport}/ILG60_00_06_002.aspx`;
    return this.http.post(url, params, { ...this.httpOptions, responseType: "blob" }).map(res => res).toPromise()
  }


  async signature(r) {


    if (r == 0) {
      const param = {
        "receipt_no": this.RECEIPT_NO,
        "SystemId": "systemid",
        "UserName": "my_username",
        "Password": "bbbbb",
        "IpAddress": "10.11.1.10",
        "Operation": "1",
        "RequestData":
        {
          "UserName": "wannapa_j",
          "OffCode": "100300"
        }
      }
      
      this.preloader.setShowPreloader(true);
      await this.ReportForm06_002(param).then(x => {
        const file = new Blob([x], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          const linkSource = reader.result;
          var objbuilder = '';
          objbuilder += ('<object width="100%" height="100%" data="');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf" class="internal">');
          objbuilder += ('<embed src="');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf"  />');
          objbuilder += ('</object>');
          var win = window.open("#", "_blank");
          var title = "ใบเสร็จรับชำระค่าปรับ.pdf";
          win.document.write('<html><title>' + title + '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
          win.document.write(objbuilder);
          win.document.write('</body></html>');

        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
        this.preloader.setShowPreloader(false);
      })
    } else {
      const param = {
        "receipt_no": this.RECEIPT_NO,
        "SystemId": "systemid",
        "UserName": "my_username",
        "Password": "bbbbb",
        "IpAddress": "10.11.1.10",
        "Operation": "1",
        "RequestData":
        {
          "UserName": "wannapa_j",
          "OffCode": "100300"
        }
      }
      this.preloader.setShowPreloader(true);
      await this.ReportForm06_002(param).then(x => {
        const file = new Blob([x], { type: 'application/pdf' });
        const params = {
          pdfFile: file,
          textFile: "undefined",
          saveFile: "true",
          docName: this.RECEIPT_NO,
          docTitle: "xcs",
          docAccount: "LAW_RECEIPT",
          docType: "",
          pin: "Suthee#1",
          id: "wannapa_j",
          system: "",
          officeCode: "100300",
          fileType: "ใบเสร็จรับเงินคดี",
          sendMail: "false",
          signDataList: [
            {
              page: "1",
              x: "75",
              y: "100",
              w: "100",
              h: "20",
              isCorporate: "false"
            }
          ]
        }
        this.fineService.MultiplePage("MultiplePage", [params]).then(async list => {
          console.log("listtt : ",await list)
          const linkSource = await list.data.dataFile;

          if (await list.status == "SUCCESS"){
          var objbuilder = '';
          objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf" class="internal">');
          objbuilder += ('<embed src="data:application/pdf;base64,');
          objbuilder += (linkSource);
          objbuilder += ('" type="application/pdf"  />');
          objbuilder += ('</object>');
          // this.imageSource = objbuilder;
          var win = window.open("#", "_blank");
          var title = "ใบเสร็จรับชำระค่าปรับ.pdf";
          win.document.write('<html><title>' + title + '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
          win.document.write(objbuilder);
          win.document.write('</body></html>');
            swal({
              type: 'success',
              text: await list.msgTh,
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            })
            this.setText = false;
            this.activeModal.close(this.setText);
          }else{
            swal({
              type: 'warning',
              text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
              confirmButtonText: 'ตกลง',
              buttonsStyling: true,
            })
          }
          this.preloader.setShowPreloader(false);
        },(error) => {
          console.log("err : ",error)
          swal({
            type: 'warning',
            text: "ลงลายเซ็นดิจิตอลในเอกสารไม่สำเร็จ",
            confirmButtonText: 'ตกลง',
            buttonsStyling: true,
          })
          this.preloader.setShowPreloader(false);
        }
        )
      })
    }

    if (this.controlForm.get('signature').value == false) {
      swal({
        type: 'warning',
        text: 'ไม่พบข้อมูลลายซ็น',
        confirmButtonText: 'ตกลง',
        buttonsStyling: true,
      })
    }
  }

  cancel() {
    this.setText = true;
    this.activeModal.close(this.setText);
  }
  dismiss(click) {
    this.setText = true;
    this.activeModal.close(this.setText);
  }

  _swal(isReq_RECEIPT_BOOK_NO) {
    swal({
      type: 'warning',
      text: isReq_RECEIPT_BOOK_NO,
      confirmButtonText: 'ตกลง',
      buttonsStyling: true,
    })
  }

}
