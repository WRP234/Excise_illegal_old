import { Component, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class PreloaderService {
    showPreloader = new BehaviorSubject<Boolean>(false);

    constructor() { }

    setShowPreloader(status: boolean) {
        setTimeout(() => this.showPreloader.next(status), 0);
    }
}

@Component({
    selector: 'app-preloader',
    templateUrl: './preloader.component.html',
    styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

    // isPreload = false;
    // constructor(private loadService: PreloaderService) { }

    ngOnInit() {
        // this.loadService.showPreloader.subscribe(status => this.isPreload = status);
        // console.log(this.isPreload);
    }

}
