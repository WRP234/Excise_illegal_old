import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainMasterService } from '../../services/main-master.service';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { AuthService } from './auth.service';
import { ErrorMsg, paramsLDPAG } from './login.errMsg';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LayoutComponent]
})
export class LoginComponent implements OnInit {

  returnUrl: string;

  errMsg: string = "";
  fullName: string = "";
  operationPosName: string = "";
  OfficeShortName: string = "";
  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private mainMasterService: MainMasterService) {

    // reset signin status
    this.authService.signout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(form: any) {
    const User = form.userName;
    const Pass = form.password;

    if (!User) {
      this.errMsg = ErrorMsg.EnterUserName;
      return false;
    } else if (!Pass) {
      this.errMsg = ErrorMsg.EnterPassword;
      return false;
    }

    if (User && Pass) {
      if (this.authService.signin(form)) {

        paramsLDPAG.UserName = User.trim();
        paramsLDPAG.Password = Pass.trim();



        //***********************************Used with in the Excise Only (Don't Delete)********************************** */
        // this.errMsg = ErrorMsg.Wait;
        // this.authService.LDPAGAuthen(paramsLDPAG).subscribe(
        //   async (res) => {
        //     const userThaiId = res.Body.ResponseObj.userThaiId;

        //     if (userThaiId) {
        //       this.errMsg = ErrorMsg.Wait;
        //       const staff = await this.mainMasterService.MasStaffgetByCon(userThaiId);

        //       if (staff.SUCCESS) {
        //         const s = staff.RESPONSE_DATA.filter(f => f.ID_CARD == userThaiId);

        //         if (s.length) {
        //           this.fullName = s[0].TITLE_NAME_TH + " " + s[0].FIRST_NAME + " " + s[0].LAST_NAME;

        //           localStorage.setItem('UserName', paramsLDPAG.UserName);
        //           localStorage.setItem('fullName', this.fullName);
        //           localStorage.setItem('operationPosName', s[0].OPREATION_POS_NAME);
        //           localStorage.setItem('officeShortName', s[0].OPERATION_OFFICE_SHORT_NAME || s[0].OPERATION_OFFICE_NAME);
        //           localStorage.setItem('staffCode', s[0].STAFF_CODE);
        //           localStorage.setItem('officeCode', s[0].OPERATION_OFFICE_CODE);
        //           localStorage.setItem('UserAccountID', s[0].STAFF_ID);
        //           localStorage.setItem('staffInfo', JSON.stringify(s[0]));

        //           let url = decodeURIComponent(this.returnUrl);
        //           this.router.navigateByUrl(url);

        //         } else this.setErrMsg(ErrorMsg.Authority); return false;

        //       } else this.setErrMsg(ErrorMsg.Contact); return false;

        //     } else this.setErrMsg(ErrorMsg.Invalid); return false;

        //   }, () => { this.setErrMsg(ErrorMsg.Contact); return false; });
        //****************************(End Used with in the Excise Only)***************************** */





        /*****************************Used outside the Excise (Don't Delete*)****************************** */
        // from([paramsLDPAG])
        //   .pipe(
        //     switchMap(term => this.authService.userAuth(term)
        //       .catch(() => { return of(false); })))
        //   .subscribe(s => {
        //     const res = s.response;
        //     if (res) {
        //       this.fullName = res.TITLE_NAME_TH + " " + res.FIRST_NAME + " " + res.LAST_NAME;
        //       this.operationPosName = res.OPREATION_POS_NAME;
        //       this.OfficeShortName = res.OPERATION_OFFICE_SHORT_NAME;
        //       localStorage.setItem('UserName', paramsLDPAG.UserName);
        //       localStorage.setItem('fullName', this.fullName);
        //       localStorage.setItem('operationPosName', this.operationPosName);
        //       localStorage.setItem('officeShortName', this.OfficeShortName);
        //       localStorage.setItem('staffCode', res.STAFF_CODE);
        //       localStorage.setItem('officeCode', res.OPERATION_OFFICE_CODE);
        //       localStorage.setItem('UserAccountID', res.USER_ACCOUNT_ID);
        //       // add for default staff in investigate please remove password for secure
        //       localStorage.setItem('staffInfo', JSON.stringify(res));
        //       let url = decodeURIComponent(this.returnUrl);
        //       this.router.navigateByUrl(url);
        //     } else
        //       setTimeout(() => {
        //         this.errMsg = ErrorMsg.Check;
        //       }, 300);
        //   });
        /*****************************End Used outside the Excise****************************** */





        /*****************************Used outside the Excise On OAG (Don't Delete*)****************************** */
        this.errMsg = ErrorMsg.Wait;
        this.authService.AccessToken(paramsLDPAG.UserName, paramsLDPAG.Password).subscribe(
          (token) => {

            if (token.access_token) {
              this.authService.LDPAGAuthenViaOAG(paramsLDPAG, token.access_token).subscribe(
                async (res) => {
                  const userThaiId = res.Body.ResponseObj.userThaiId

                  if (userThaiId) {
                    this.setErrMsg(ErrorMsg.Wait)
                    const staff = await this.mainMasterService.MasStaffgetByCon1(userThaiId);

                    if (staff.SUCCESS) {
                      const s = staff.RESPONSE_DATA.filter(f => f.ID_CARD == userThaiId);

                      if (s.length) {
                        this.fullName = s[0].TITLE_NAME_TH + " " + s[0].FIRST_NAME + " " + s[0].LAST_NAME;

                        localStorage.setItem('UserName', paramsLDPAG.UserName);
                        localStorage.setItem('fullName', this.fullName);
                        localStorage.setItem('operationPosName', s[0].OPREATION_POS_NAME);
                        localStorage.setItem('officeShortName', s[0].OPERATION_OFFICE_SHORT_NAME || s[0].OPERATION_OFFICE_NAME);
                        localStorage.setItem('staffCode', s[0].STAFF_CODE);
                        localStorage.setItem('officeCode', s[0].OPERATION_OFFICE_CODE || res.Body.ResponseObj.officeId);
                        localStorage.setItem('UserAccountID', s[0].STAFF_ID);
                        localStorage.setItem('staffInfo', JSON.stringify(s[0]));

                        let url = decodeURIComponent(this.returnUrl);
                        this.router.navigateByUrl(url);

                      } else this.setErrMsg(ErrorMsg.Authority); return false;
                    } else this.setErrMsg(ErrorMsg.Contact); return false;

                  } else this.setErrMsg(ErrorMsg.Invalid); return false;
                }, () => { this.setErrMsg(ErrorMsg.Contact); return false; });

            } else this.setErrMsg(ErrorMsg.Contact); return false;
          }, () => { this.setErrMsg(ErrorMsg.Contact); return false; });
        /*****************************Used outside the Excise On OAG (Don't Delete*)****************************** */
      }
    }
  }

  ClearErrMsg = () => this.errMsg = '';

  setErrMsg = (Msg) => this.errMsg = Msg;


  ngOnInit() { }

}
