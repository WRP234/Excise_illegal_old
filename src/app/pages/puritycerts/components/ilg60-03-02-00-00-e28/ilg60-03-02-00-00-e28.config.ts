import { ManageConfig } from '../../manage/manage.config';
import {Output, EventEmitter, Input} from '@angular/core';
import {ArrestIndictment, Document} from '../../model';
import {BehaviorSubject} from 'rxjs/Rx';

export class Ilg6003020000E28Config extends ManageConfig {

  @Input() isEdit: boolean;
  @Input() DocmentsList:  BehaviorSubject<Document[]>;
  @Output() Doc = new EventEmitter<Document[]>();
    // @Output() emitChange: EventEmitter<IFormChange> = new EventEmitter();
}

