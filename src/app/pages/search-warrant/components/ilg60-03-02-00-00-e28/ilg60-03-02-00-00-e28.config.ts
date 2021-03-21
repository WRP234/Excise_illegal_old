import { ManageConfig } from "../manage/manage.config";
import { Output, EventEmitter, Input } from "@angular/core";
import { FormArray } from "@angular/forms";

export class Ilg6003020000E28Config extends ManageConfig {
    // @Output() emitChange: EventEmitter<IFormChange> = new EventEmitter();
    @Input() isEdit: boolean;
}