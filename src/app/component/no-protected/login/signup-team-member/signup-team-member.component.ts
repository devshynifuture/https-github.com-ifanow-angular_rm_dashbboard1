import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { HttpService } from 'src/app/http-service/http-service';

@Component({
  selector: 'app-signup-team-member',
  templateUrl: './signup-team-member.component.html',
  styleUrls: ['./signup-team-member.component.scss']
})
export class SignupTeamMemberComponent implements OnInit {
  duplicateTableDtaFlag: boolean;
  paramsData: any;

  constructor(private http: HttpService, private fb: FormBuilder, private authService: AuthService, public routerActive: ActivatedRoute,
    private router: Router, private loginService: LoginService, private eventService: EventService, public dialog: MatDialog) { }
  signUpForm;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Create account',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  signUpBarList = [
    { name: "Test", flag: false },
    { name: "Test", flag: false },
    { name: "Test", flag: false },
    { name: "Test", flag: false }
  ]
  ngOnInit() {
    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('query')) {
        this.paramsData = this.changeBase64ToString(queryParamMap.get('query'));
        this.createForm(this.paramsData);
      }
      else {
        this.createForm(null)
      }
    });
    this.barButtonOptions.text = "Create account"
  }
  changeBase64ToString(data) {
    const Buffer = require('buffer/').Buffer;
    const encodedata = data;
    const datavalue = (Buffer.from(encodedata, 'base64').toString('utf-8'));
    const responseData = JSON.parse(datavalue);
    return responseData;
  }
  createForm(data) {
    (data == undefined) ? data = {} : data
    this.signUpForm = this.fb.group({
      fullName: [data.name, [Validators.required]],
      email: [{ value: data.email, disabled: (this.paramsData) ? true : false }, [Validators.required,
      Validators.pattern(this.validatorType.EMAIL)]],
      mobile: [data.mobileNo, [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      termsAgreement: [false, [Validators.required, Validators.requiredTrue]]
    });
  }
  createAccount() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    } else if (this.signUpForm.value.termsAgreement == false) {
      // this.eventService.openSnackBar('Please accept terms and conditions!', 'Dismiss');
      return;
    } else {
      this.barButtonOptions.active = true;
      let obj = {
        "advisorId": this.paramsData.advisorId,
        "mobileNo": this.signUpForm.get('mobile').value,
        "name": this.signUpForm.get('fullName').value,
        "email": this.signUpForm.get('email').value
      }
      this.loginService.createTeamMember(obj).subscribe(
        data => {
          this.barButtonOptions.active = false;
          const forgotPassObjData = {
            mobileNo: this.signUpForm.get('mobile').value,
            email: this.signUpForm.get('email').value,
            flag: true,
            userType: data.userType,
            userId: data.userId,
            clientId: data.clientId,
            advisorId: data.advisorId,
            userData: data,
            showSignUpBar: true,
            showMaskedMsg: true
          };
          if (this.clientSignUp) {
            /*  const jsonData = {
                advisorId: 2808,
                clientId: 2978,
                emailId: 'gaurav@futurewise.co.in',
                authToken: 'data',
                imgUrl: 'https://res.cloudinary.com/futurewise/image/upload/v1566029063/icons_fakfxf.png'
              };
  
              this.authService.setToken('data');
              this.authService.setUserInfo(jsonData);
              this.authService.setClientData({
                id: 2978, name: 'Aryendra Kumar Saxena'
              });
              this.router.navigate(['customer', 'detail', 'overview', 'myfeed']);*/
          } else {
            this.router.navigate(['/login/forgotpassword'], { state: forgotPassObjData });
          }
        },
        err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(err, 'Dismiss');
          // this.confirmModal(err.message);
        }
      );
    }
  }
  clientSignUp(obj: { emailList: { userType: number; email: any; }[]; name: any; displayName: any; mobileList: { userType: number; mobileNo: any; }[]; userType: number; forceRegistration: boolean; }, clientSignUp: any) {
    throw new Error("Method not implemented.");
  }
  showTermsAndConditions() {
    window.open('/login/termscondition');
  }
}
