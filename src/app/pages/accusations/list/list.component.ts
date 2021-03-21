import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  listData = [
    {
      arrestCode: "TN90806026000001",
      lawsuitNo: "001/2561",
      lawsuitDate: "10-ม.ค.-2560",
      lawsuitTime: "12.14",
      titleName: "นาย",
      firstName: "ธวัชชัย",
      lastName: "บิงขุนทด",
      departmentlawName: "สสท.ระนอง สาขาเมืองกระบุรี",
      positionLawName: "เจ้าพนักงานสรรพสามิตชำนาญงาน",
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
    }
  ];
  arrestCode: string;
  lawsuitNo: string;
  lawsuitDateStart: Date;
  lawsuitDateEnd: Date;
  lawName: string;
  departmentlawName: string;
  advSearch: any;
  allPageCount: number = 0;
  numberPage: number = 5;
  numberSelectPage;
  errorShow:any;

  constructor(private navService: NavigationService, private router: Router) {
    this.advSearch = this.navService.showAdvSearch;

  }

  ngOnInit() {
    this.navService.setSearchBar(true);
    this.navService.setPrintButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setCancelButton(false);
    this.navService.setEditButton(false);
    this.navService.setSaveButton(false);

    this.allPageCount = this.listData.length / this.numberPage;
    this.numberSelectPage = Array(this.allPageCount).fill(0).map((x, i) => i+1);
  }

  viewData(arrestCode: string) {
    this.router.navigate(['/accusations/manage', 'R'], { queryParams: { code: arrestCode } });
  }

  closeAdvSearch() {
    this.navService.showAdvSearch.next(false);
  }

  changeNumPage(numPage: number) {
    this.numberPage = numPage;
    this.allPageCount = Math.ceil(this.listData.length / this.numberPage);
    this.numberSelectPage = Array(this.allPageCount).fill(0).map((x, i) => i+1);
  }

}
