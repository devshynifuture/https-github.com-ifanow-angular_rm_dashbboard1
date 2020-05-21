import { Component, OnInit } from '@angular/core';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';
import { Validators, ValidationErrors, AbstractControl, FormBuilder } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-set-team-member-password',
  templateUrl: './set-team-member-password.component.html',
  styleUrls: ['./set-team-member-password.component.scss']
})
export class SetTeamMemberPasswordComponent implements OnInit {
  uuId: any;

  constructor(private authService: AuthService, private fb: FormBuilder, private loginService: LoginService, private router: Router, private eventService: EventService, private route: ActivatedRoute) { }
  setNewPasswordForm;
  validatorType = ValidatorType;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Set Password',
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
  newPasswordLength = 0;
  hide1 = true;
  hide2 = true;
  userData: any;
  passwordStregth = {
    upperCase: false,
    lowerCase: false,
    specialCharacter: false
  };
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.uuid) {
        this.uuId = params.uuid;
        this.getTeamMemberInfo(this.uuId)
      }
    });
    this.setNewPasswordForm = this.fb.group({
      newPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
      confirmPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }
  getTeamMemberInfo(data) {
    let obj = {
      uuid: data
    }
    this.loginService.getTeamMemberInfo(obj).subscribe(
      data => {
        this.userData = data;
      }, err => {
        this.eventService.openSnackBar("Something went wrong");
      }
    )
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
            const obj = {
              advisorId: this.userData.advisorId
            };
            this.loginService.sendWelcomeEmail(obj).subscribe(
              data => {
                this.barButtonOptions.active = false;
              },
              err => { }
            );
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

}
