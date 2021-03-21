import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../shared/header-navigation/navigation.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { DownloadDetail } from './models/download-model';
import { NotifyDetail } from './models/notify-model';

@Component({
	selector: 'ea-starter',
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {
	title: string;
	subtitle: string;

	isLinear = false;
	NotifyFG: FormGroup;
	DownloadFG: FormGroup;

	get NotifyDetail(): FormArray {
		return this.NotifyFG.get('NotifyDetail') as FormArray;
	}

	get DownloadDetail(): FormArray {
		return this.DownloadFG.get('DownloadDetail') as FormArray;
	}
	constructor(private navService: NavigationService, private fb: FormBuilder) {
		this.title = "Starter Page";
		this.subtitle = "This is some text within a card block."

		this.navService.setNewButton(false);
		this.navService.setNextPageButton(false);
		this.navService.setPrevPageButton(false);
		this.navService.setSearchBar(false);
		this.navService.setEditField(false);
		this.navService.setEditButton(false);
		this.navService.setPrintButton(false);
		this.navService.setDeleteButton(false);
		this.navService.setSaveButton(false);
		this.navService.setCancelButton(false);
	}

	ngOnInit() {
		this.createForm();
		this.getNotifyForm();
		this.getDownloadForm();
	}

	createForm() {
		this.NotifyFG = this.fb.group({
			NotifyContent: new FormControl('แจ้งข้อมูลข่าวสาร'),
			NotifyDetail: this.fb.array([
				this.fb.group({
					notify_date: new FormControl(''),
					notify_detail: new FormControl('')
				})

			])
		});
		this.DownloadFG = this.fb.group({
			DownloadContent: new FormControl('ดาวน์โหลด'),
			DownloadDetail: this.fb.array([
				this.fb.group({
					download_notifyDate: new FormControl(''),
					download_link: new FormControl(''),
					download_text: new FormControl('')
				})

			])
		});
	}

	getNotifyForm() {
		let NotifyDetail: NotifyDetail[] = [];
		let value: NotifyDetail[] = [{
			notify_date: 'วันที่ 21 มิถุนายน 2562',
			notify_detail: '*** ให้กรอกข้อมูล ค่าปรับรายสินค้า(หน่วย:บาท)ต่อรายการได้ที่เมนู 5.1 รายงานบัญชีสิ่งของ ส.ส 2/4 ตั้งแต่ วันที่ 1 ตุลาคม 2561 เป็นต้นไป ***'
		},
		{
			notify_date: 'วันที่ 22 มิถุนายน 2562',
			notify_detail: '*** หากต้องการเพิ่มข้อมูล (ชนิดสินค้า ,ชนิดยี่ห้อ, อื่นๆ)ติดต่อเจ้าหน้าที่ผู้ดูแลระบบ Tel: 64404, 64409, 64419 Helpdesk Tel: 02-241-5600 ต่อ 61601-08 ***'
		}]
		value.map(m => {
			NotifyDetail.push(m);
		})
		this.setItemFormArray(NotifyDetail, 'NotifyDetail', this.NotifyFG)
	}

	getDownloadForm() {
		let DownloadDetail: DownloadDetail[] = [];
		let value: DownloadDetail[] = [{
			download_notifyDate: 'วันที่ 4 กรกฎาคม 2562',
			download_link: 'http://illegal.excise.go.th/XCS_illegal_old/',
			download_text: 'Link=>>เข้าสู่ระบบงานผู้กระทำผิดกฎหมายสรรพสามิต (พ.ร.บ. สุรา,ยาสูบ และภาษีสรรพสามิต 2527)'
		},
		{
			download_notifyDate: 'วันที่ 23 กรกฎาคม 2562',
			download_link: 'http://192.168.3.134/XCS_Report_Law/UM_2561/UM_2561.pdf',
			download_text: ' Link=>>ดาวน์โหลดคู่มือการใข้งานระบบงานผู้กระทำผิดกฎหมายภาษีสรรพสามิต'
		}]
		value.map(m => {
			DownloadDetail.push(m);
		})
		this.setItemFormArray(DownloadDetail, 'DownloadDetail', this.DownloadFG)
	}


	private setItemFormArray(array: any[], formControl: string, FG: FormGroup) {
		if (array !== undefined && array.length) {
			const itemFGs = array.map(item => this.fb.group(item));
			const itemFormArray = this.fb.array(itemFGs);
			FG.setControl(formControl, itemFormArray);
		}
	}
}

