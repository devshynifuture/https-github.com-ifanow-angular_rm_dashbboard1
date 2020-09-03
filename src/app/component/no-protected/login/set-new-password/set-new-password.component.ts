import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { HttpService } from 'src/app/http-service/http-service';
const Buffer = require('buffer/').Buffer;

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {
  newPasswordLength = 0;
  upperCaseFlag: boolean;
  passwordStregth = {
    upperCase: false,
    lowerCase: false,
    specialCharacter: false
  };
  hide1 = true;
  hide2 = true;
  userData: any;
  signUpBarList = [
    { name: "CREATE ACCOUNT", flag: true },
    { name: "VERIFY EMAIL", flag: true },
    { name: "VERIFY MOBILE", flag: true },
    { name: "SET PASSWORD", flag: false }
  ]
  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private eventService: EventService,
    private httpService: HttpService,
    private route: ActivatedRoute) {
  }

  setNewPasswordForm;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: '',
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

  ngOnInit() {
    this.userData = { buttonFlag: false };
    if (window.history.state.userData) {
      this.userData = window.history.state.userData
    } else {
      this.route.queryParams.subscribe((params) => {
        if (params.userName) {
          const datavalue = (Buffer.from(params.userName, 'base64').toString('utf-8'));
          this.getClientDetails(datavalue)
        }
      });
      // this.getClientDetails(this.httpService.changeBase64ToString(window.history.state.userName));
    }
    (this.userData.buttonFlag) ? this.barButtonOptions.text = 'Reset Password' : this.barButtonOptions.text = 'Set Password';
    this.setNewPasswordForm = this.fb.group({
      newPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
      confirmPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }

  getClientDetails(data) {

    this.loginService.getCLientDetails(data).subscribe(
      res => {
        if (res) {
          this.userData = res;
          this.eventService.openSnackBar(`Your username is ${data}`, "Dismiss")
        }
      }
    )
  }

  setNewPassword() {
    if (this.setNewPasswordForm.invalid) {
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        password: this.setNewPasswordForm.controls.confirmPassword.value,
        userId: this.userData.userId
      };
      this.loginService.savePassword(obj).subscribe(
        data => {
          if (data == 1) {
            if (!this.userData.buttonFlag) {
              const obj = {
                advisorId: this.userData.advisorId
              };
              this.loginService.sendWelcomeEmail(obj).subscribe(
                data => {
                  this.barButtonOptions.active = false;
                },
                err => { }
              );
            }
            // this.authService.setToken(data.token);
            this.loginService.handleUserData(this.authService, this.router, this.userData);
          } else {
            // this.passEvent = '';
            // this.errorMsg = true;
            // this.errorStyle = {
            //   visibility: this.errorMsg ? 'visible' : 'hidden',
            //   opacity: this.errorMsg ? '1' : '0',
            // };
            // this.barButtonOptions.active = false;
            this.barButtonOptions.active = false;
          }
        });
    }
  }

  checkUpperCase() {

    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[A-Z])/).test(control.value) && control.value != null) {
        this.passwordStregth.upperCase = true;
        return;
      }
      this.passwordStregth.upperCase = false;
      return;
    };
  }

  checkLowerCase() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[a-z])/).test(control.value) && control.value != null) {
        this.passwordStregth.lowerCase = true;
        return;
      }
      this.passwordStregth.lowerCase = false;
      return;
    };
  }

  checkSpecialCharacter() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/([!@#$%^&*()])/).test(control.value) && control.value != null) {
        this.passwordStregth.specialCharacter = true;
        return;
      }
      this.passwordStregth.specialCharacter = false;
      return;
    };
  }

  checkPassword() {
    const password = this.setNewPasswordForm.get('newPassword').value;
    const confirm_new_password = this.setNewPasswordForm.get('confirmPassword').value;
    this.newPasswordLength = (password != null) ? password.length : 0;
    if (password !== '' && confirm_new_password !== '') {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }
}
