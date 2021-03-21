import { ManageConfig } from "../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { IArrestDocument } from "../../models/arrest-document";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Ilg6003020000E28Config extends ManageConfig {
    // @Output() emitChange: EventEmitter<IFormChange> = new EventEmitter();
    public TempDocDel: any[] = [];

    @Output() Output = new EventEmitter<IArrestDocument[]>(null);
    @Output() delDoc = new EventEmitter();
    @Input() isEdit: boolean;
    @Input() mode: string;
    @Input() inputData = new BehaviorSubject<IArrestDocument[]>([]);
}