import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { LoginService } from 'src/app/component/no-protected/login/login.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  newPasswordLength = 0;
  upperCaseFlag: boolean;
  passwordStregth = {
    upperCase: false,
    lowerCase: false,
    specialCharacter: false
  };
  hide1 = true;
  hide2 = true;
  hide3 = true;
  userData: any;
  signUpBarList = [
    { name: "CREATE ACCOUNT", flag: true },
    { name: "VERIFY EMAIL", flag: true },
    { name: "VERIFY MOBILE", flag: true },
    { name: "SET PASSWORD", flag: false }
  ]
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
  ) {
    this.userData = AuthService.getUserInfo();
  }

  setNewPasswordForm: FormGroup;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Reset Password',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };

  ngOnInit() {
    this.setNewPasswordForm = this.fb.group({
      oldPassword: [, [Validators.required]],
      newPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
      confirmPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }

  setNewPassword() {
    if (this.setNewPasswordForm.invalid) {
      this.setNewPasswordForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        oldPassword: this.setNewPasswordForm.controls.oldPassword.value,
        password: this.setNewPasswordForm.controls.confirmPassword.value,
        userId: this.userData.userId
      };
      this.loginService.savePassword(obj).subscribe(
        data => {
          console.log(data);
          if (data == 1) {
            if (!this.userData.buttonFlag) {
              const obj = {
                advisorId: this.userData.advisorId
              };
              this.loginService.sendWelcomeEmail(obj).subscribe(
                data => {
                  this.barButtonOptions.active = false;
                  console.log(data);
                },
                err => { console.log(err) }
              );
            }
            // this.authService.setToken(data.token);
            // this.loginService.handleUserData(this.authService, this.router, this.userData);
            this.authService.setToken('authTokenInLoginComponnennt');
            this.eventService.openSnackBar("Password changed successfully!");
            this.Close(true);
          } else {
            // this.passEvent = '';
            // this.errorMsg = true;
            // this.errorStyle = {
            //   visibility: this.errorMsg ? 'visible' : 'hidden',
            //   opacity: this.errorMsg ? '1' : '0',
            // };
            // this.barButtonOptions.active = false;
            this.eventService.showErrorMessage("Unable to save password");
            this.barButtonOptions.active = false;
          }
        }, err => {
          this.eventService.showErrorMessage(err);
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
    console.log(this.newPasswordLength);
    if (password !== '' && confirm_new_password !== '') {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }

  Close(flag = false) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
