import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';


@Component({
    selector: 'app-provescience-modal',
    templateUrl: './provescience-modal.component.html',
    styleUrls: ['./provescience-modal.component.scss']
})

export class ProveScienceModalComponent implements OnInit {
    printDoc = [];

    isOpen = false;
    isCheckAll = false;
    document = new Array<Document>();

    @Input() PRODUCT_MODEL: any;
    // @Input() ArrestCode: string;
    // @Input() IndictmentID: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        private proveService: ProveService,
        private preloader: PreloaderService
    ) { }

    ngOnInit() { }

    onSave() {
        this.passEntry.emit(this.PRODUCT_MODEL);
    }

    dismiss(e: any) {
        this.passEntry.emit(e);
    }
}
