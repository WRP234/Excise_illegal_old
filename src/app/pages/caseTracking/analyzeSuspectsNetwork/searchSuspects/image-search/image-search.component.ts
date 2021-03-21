import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { suspectsImgList } from '../../analyze-models/searchSuspects-models'

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ImageSearchComponent implements OnInit {

  fileName: any

  suspectsImgList: suspectsImgList[] = [
    { SUSPECT_NAME: 'นายวราวุฒิ พิธพิชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '1', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายวรยุทธิ์ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '2', LAWBREAKER_ADDRESS: 'สถานประกอบการ CP' },
    { SUSPECT_NAME: 'นายสิทธิพัธ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '3', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายเสธิชัย พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '9', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายวราวุฒิ พิธพิชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '1', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายวรยุทธิ์ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '2', LAWBREAKER_ADDRESS: 'สถานประกอบการ CP' },
    { SUSPECT_NAME: 'นายสิทธิพัธ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '3', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายเสธิชัย พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '9', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายวราวุฒิ พิธพิชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '1', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายวรยุทธิ์ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '2', LAWBREAKER_ADDRESS: 'สถานประกอบการ CP' },
    { SUSPECT_NAME: 'นายสิทธิพัธ พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '3', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
    { SUSPECT_NAME: 'นายเสธิชัย พรชัย', PERSON_TYPE: 'คนไทย', IMAGE: 'assets/images/imgLawbreaker.png', MISTREAT_NO: '9', LAWBREAKER_ADDRESS: 'มีนบุรี/มีนบุรี/กทม.' },
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  setAdvSearch() {
    this.router.navigate(['/suspectsAnalyze/list']);
  }
  selectImg(e: any) {
    // console.log('e :',e)
    let reader = new FileReader();
    let file = e.target.files[0];
    let fileSize = file.size;
    let fileType = file.type;

    var fileSizeMB = Number((fileSize / 1048576).toFixed(2))
    if (fileSizeMB > 1.00) {
      swal({
        title: '',
        text: 'กรุณาเลือกขนาดรูปภาพ ไม่เกิน 1 MB',
        type: 'warning',
        showCancelButton: true,
        showConfirmButton: false,
        focusCancel: false,
        // confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // confirmButtonText: 'Confirm!'
      })
      this.fileName = ``;
    } else {
      this.fileName = `ชื่อไฟล์ : ${file.name}`;
      reader.readAsDataURL(file);
      reader.onload = () => {
        let dataSource = reader.result.toString().split(',')[1];
        if (dataSource && dataSource !== undefined) {
          //
        }
      }
    }
  }
}
