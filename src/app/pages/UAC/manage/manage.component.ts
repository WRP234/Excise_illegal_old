import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { Subject } from 'rxjs';
import { Message } from 'app/config/message';
import { Router } from '@angular/router';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2'

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManageComponent implements OnInit {

  form: FormGroup;
  UserName: string;
  Name: string;
  positionName: string;
  officeName: string;
  showEditField: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private navService: NavigationService,
    private router: Router,
    private preloader: PreloaderService, ) {

    // set button false
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrintButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    this.navService.setSearchBar(false);
    // set button true
    this.navService.setSaveButton(true);
    this.navService.setCancelButton(true);
    
    this.UserName = localStorage.getItem('UserName');
    this.Name = localStorage.getItem('Name');
    this.positionName = localStorage.getItem('positionName');
    this.officeName = localStorage.getItem('officeName');
  }

  List: any = [{ "name": "งานสืบสวน" },
  { "name": "ใบแจ้งความนำจับ" },
  { "name": "งานจับกุม" },
  { "name": "บันทึกรับคำกล่าวโทษ" },
  { "name": "งานตรวจรับและพิสูจน์ของกลาง" },
  { "name": "งานเปรียบเทียบและชำระค่าปรับ" },
  { "name": "งานนำส่งรายได้" },
  { "name": "คำร้องขอรับเงินสินบน" },
  { "name": "คำร้องขอรับสินบน" },
  { "name": "คำร้องขอรับเงินรางวัล" },
  { "name": "งานปรับเพิ่ม-ลดค่าปรับ" },
  { "name": "งานตรวจรับของกลางเพื่อจัดเก็บ" },
  { "name": "งานโอนย้ายของกลาง" },
  { "name": "งานทำลายของกลาง" },
  { "name": "งานจัดเก็บของกลางเข้าพิพิธภัณท์" },
  { "name": "งานขายทอดตลาดของกลาง" }
  ];

  ListMaster: any = [{ "name": "งานสืบสวน" },
  { "name": "ข้อมูลผู้ต้องสงสัย" },
  { "name": "ข้อมูลผู้ต้องหา" },
  { "name": "ข้อมูลสินค้า" },
  { "name": "ข้อมูลบทลงโทษ" },
  { "name": "ข้อมูลการแบ่งส่วนเงินสินบนและเงินรางวัล" },
  { "name": "กำหนดสิทธิ์การเข้าถึงข้อมูล" }
  ];



  ngOnInit() {
    this.navigate_Service();
  }

  private navigate_Service() {
    this.navService.showFieldEdit.subscribe(p => {
      this.showEditField = p;
    });


    this.navService.onSave.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        await this.navService.setOnSave(false);
        console.log("onSave")
      }
    });
    this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        console.log("onCancel")
        swal('', 'ยกเลิกการทำรายการ', 'warning');
        await this.navService.setOnCancel(false);
        await this.router.navigate([`/uac/list`]);
      }
    })
  }
}
