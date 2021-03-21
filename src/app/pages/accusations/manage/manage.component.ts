import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  exhibitData = [
    {
      itemName: "สุรา/สุราแช่/ชนิดเบียร์/Hoegaarden/Witbier/330 มล.",
      number: 12,
      unit: "หน่วย",
      netAmount: 3960,
      unitNet: "มิลลิลิตร"
    },
    {
      itemName: "สุรา/สุรากลั่น/ชนิดอื่นๆ/Black Label/Blended Wrisky/1000 มล.",
      number: 12,
      unit: "หน่วย",
      netAmount: 12000,
      unitNet: "มิลลิลิตร"
    }
  ];
  accusationsTableData = [
    {
      fullName: "นายธวัชชัย บิงขุนทด",
      type: "เปรียบเทียบคดี",
      caseEnd: "กรมสรรพสามิต",
      descExhibit: this.exhibitData
    },
    {
      fullName: "นายสุชาติ ปัญโญใหญ่",
      type: "ส่งฟ้องศาล",
      caseEnd: "ศาล",
      descExhibit: this.exhibitData
    }
  ];
  allegationData = [
    {
      allegationCode: "001/2561",
      allegationNo: "203",
      allegationSubject:
        "มีไว้ในครอบครองซึ่งสินค้าที่มิได้เสียภาษีหรือเสียมีไว้ในครอบครองซึ่งสินค้าที่มิได้เสียภาษีหรือเสีย",
      allegationStatus: "รับเป็นคดี",
      allegationPenalty:
        "กรณียาสูบ สุรา และไพ่ ปรับ 10 เท่า กรณีความผิดสินค้าอื่น กระทำผิดครั้งที่ 1 ปรับ 2 เท่า เว้นน้ำมัน และผลิตภัณฑ์น้ำมันปรับ 5 เท่า กระทำผิดครั้งที่ 2 ปรับ 5 เท่า เว้นน้ำมันและผลิตภัณฑ์น้ำมันปรับ 10 เท่า กระทำผิดครั้งที่ 3 ปรับ 10 เท่า"
    }
  ];

  condemnTableData = [{
    arrestCode: "TN90806026000001",
    lawsuitNo: "001/2561",
    lawsuitDate: "10-ม.ค.-2560",
    lawsuitTime: "12.14",
    titleName: "นาย",
    firstName: "ธวัชชัย",
    lastName: "บิงขุนทด",
    departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
    positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน"
  },
  {
    arrestCode: "TN90806026000002",
    lawsuitNo: "น.001/2561",
    lawsuitDate: "19-ม.ค.-2560",
    lawsuitTime: "16.32",
    titleName: "นาย",
    firstName: "ธวัชชัย",
    lastName: "บิงขุนทด",
    departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
    positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน"
  },
  {
    arrestCode: "TN90806026000003",
    lawsuitNo: "00122561",
    lawsuitDate: "22-ม.ค.-2560",
    lawsuitTime: "09.48",
    titleName: "นาย",
    firstName: "ธวัชชัย",
    lastName: "บิงขุนทด",
    departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
    positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน"
  },
  {
    arrestCode: "TN90806026000004",
    lawsuitNo: "003/2561",
    lawsuitDate: "11-ม.ค.-2560",
    lawsuitTime: "11.00",
    titleName: "นาย",
    firstName: "ธวัชชัย",
    lastName: "บิงขุนทด",
    departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
    positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน"
  },
  {
    arrestCode: "TN90806026000005",
    lawsuitNo: "004/2561",
    lawsuitDate: "13-ม.ค.-2561",
    lawsuitTime: "15.13",
    titleName: "นาย",
    firstName: "ธวัชชัย",
    lastName: "บิงขุนทด",
    departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
    positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน"
  }]

  condemnData: any;
  showField: any;
  allegationYear: any;
  allegationNumber: any;
  fullName: any;
  navServiceSub: any;
  errorShow:any;


  fileItem = [{
    fileName: "",
    filePath: "",
  }];

  private getDatafromManageViewPage: any;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private navService: NavigationService) { }

  ngOnInit() {

    //set show button
    this.navServiceSub = this.navService.showFieldEdit.subscribe(status => {
      this.showField = status;
      if (!this.showField) {
        this.navService.setCancelButton(true);
        this.navService.setSaveButton(true);
        this.navService.setPrintButton(false);
        this.navService.setSearchBar(false);
        this.navService.setDeleteButton(false);
        this.navService.setEditButton(false);

      } else {
        this.navService.setPrintButton(true);
        this.navService.setDeleteButton(true);
        this.navService.setEditButton(true);
        this.navService.setSearchBar(false);
        this.navService.setCancelButton(false);
        this.navService.setSaveButton(false);
      }
    });

    //subscribe data from manage view page
    this.getDatafromManageViewPage = this.activeRoute.params
      .subscribe(params => {
        //check id from manage view page
        for (let i = 0; i < this.condemnTableData.length; i++) {
          if (params.code == this.condemnTableData[i].arrestCode) {
            this.condemnData = this.condemnTableData[i];
            this.fullName =
              this.condemnTableData[i].titleName +
              this.condemnTableData[i].firstName +
              " " +
              this.condemnTableData[i].lastName;
          }
        }
      });

    var splitSlash = this.allegationData[0].allegationCode.split("/");
    this.allegationNumber = splitSlash[0];
    this.allegationYear = splitSlash[1];
  }


  attachFile(file) {
    this.fileItem.push({
      fileName: file[0].name,
      filePath: ""
    });
  }


  ngOnDestroy() {
    this.getDatafromManageViewPage.unsubscribe();
    this.navServiceSub.unsubscribe();
  }

}
