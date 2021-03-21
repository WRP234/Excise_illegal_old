import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FormGroupService {
public IsSendColumns$ = new BehaviorSubject<boolean>(false);
constructor() { }

}
