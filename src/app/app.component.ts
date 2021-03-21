import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from './pages/login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  constructor(private authService: AuthService) {
  }


  ngOnInit() {
    // let IsNewSuspect = localStorage.getItem('IsNewSuspect')
    // if (window.performance.navigation.type != 1 && IsNewSuspect != 'true') {
    //   localStorage.clear();
    // }
  }
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   console.log("check evant : ",event)  
  //     this.authService.signout();
  // }
}
