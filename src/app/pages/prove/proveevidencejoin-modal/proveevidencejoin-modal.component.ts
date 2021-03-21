import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { MasterService } from '../../masters/masters.service';
import { pagination } from '../../../config/pagination';

@Component({
    selector: 'app-proveevidencejoin-modal',
    templateUrl: './proveevidencejoin-modal.component.html',
    styleUrls: ['./proveevidencejoin-modal.component.scss']
})

export class ProveEvidenceJoinModalComponent implements OnInit {
    document = new Array<Document>();

    paginage = pagination;

    @Input() PROVE_ID: string;
    // @Input() ArrestCode: string;
    // @Input() IndictmentID: string;

    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    constructor(
        private proveService: ProveService,
        private MasService: MasterService,
        private preloader: PreloaderService
    ) { }

    async ngOnInit() {
    }


    dismiss(e: any) {
        console.log(e);
        this.passEntry.emit(e);
    }

    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`;
    }

    MappingNullNumberData(str: string) {
        return `${str == 'null' || str == null ? "0" : str}`;
    }

    async pageChanges(event) {
        // this.SHOW_PRODUCT_LIST = await this.PRODUCT.slice(event.startIndex - 1, event.endIndex);
    }
}
