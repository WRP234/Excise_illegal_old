import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from './loader';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LoaderService {

    private loaderSubject = new Subject<Boolean>();

    loaderState = this.loaderSubject.asObservable();

    constructor() { }

    show() {
        this.loaderSubject.next(true);
    }

    hide() {
        this.loaderSubject.next(false);
    }

    public onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    public onEnd(): void {
        this.hideLoader();
    }

    public showLoader(): void {
        this.show();
    }

    public hideLoader(): void {
        this.hide();
    }
}