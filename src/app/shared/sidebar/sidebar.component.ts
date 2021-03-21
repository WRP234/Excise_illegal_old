import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class SidebarService {
  programVersion = new BehaviorSubject<String>('');

  constructor() { }

  setVersion(text: string) {
    this.programVersion.next(text);
  }
}

@Component({
  selector: 'ma-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  textVersion: any;

  fName: string = "";
  opName: string = "";
  offName: string = "";
  toggle : boolean;

  constructor(
    private sidebarService: SidebarService,
    private router: Router
    ) { 
      this.fName = localStorage.getItem('fullName');
      this.opName = localStorage.getItem('operationPosName');
      this.offName = localStorage.getItem('officeShortName');}

  ngOnInit() {
   this.textVersion = this.sidebarService.programVersion;
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  clickEvent(){
       //if you just want to toggle the class; change toggle variable.
       this.toggle = !this.toggle;       
    }

}
