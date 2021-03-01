import {Component, OnInit} from '@angular/core';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {AbstractControl, ValidationErrors, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {LoginService} from 'src/app/component/no-protected/login/login.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ValidatorType} from 'src/app/services/util.service';
import {AppConstants} from 'src/app/services/app-constants';
import {AuthService} from 'src/app/auth-service/authService';
import {Input} from '@angular/core';
import {OrgSettingServiceService} from 'src/app/component/protect-component/AdviserComponent/setting/org-setting-service.service';

@Component({
  selector: 'app-change-client-password',
  templateUrl: './change-client-password.component.html',
  styleUrls: ['./change-client-password.component.scss']
})
export class ChangeClientPasswordComponent implements OnInit {

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
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
  userData: any;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  formPlaceHolder;
  validatorType = ValidatorType;
  flag: boolean;


  constructor(private subInjectService: SubscriptionInject,
              private loginService: LoginService,
              private event: EventService,
              private fb: FormBuilder,
              private orgSettingService: OrgSettingServiceService) {
    this.formPlaceHolder = AppConstants.formPlaceHolders;
    // this.userData = AuthService.getClientData();
  }

  ngOnInit() {
    if (this.flag) {
      this.setNewPasswordForm = this.fb.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
        confirmPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
      });
    } else {
      this.setNewPasswordForm = this.fb.group({
        // oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
        confirmPassword: ['', [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
      });
    }
  }

  @Input() set data(data) {
    this.userData = data;
    this.flag = data.clientFlag;
  }

  newPasswordLength = 0;
  passwordStregth = {
    upperCase: false,
    lowerCase: false,
    specialCharacter: false
  };
  setNewPasswordForm: FormGroup;

  setNewPassword() {
    if (this.setNewPasswordForm.invalid) {
      this.setNewPasswordForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        password: this.setNewPasswordForm.controls.oldPassword.value,
        newPassword: this.setNewPasswordForm.controls.confirmPassword.value,
        userId: this.userData.userId
      };
      this.loginService.resetPasswordPostLoggedIn(obj).subscribe(data => {
        this.barButtonOptions.active = false;
        this.event.openSnackBar(data, 'Dismiss');
        this.Close();
      }, err => {
        this.event.openSnackBarNoDuration(err, 'Dismiss', null);
        this.barButtonOptions.active = false;
      });
    }
  }

  setTeamMemberPassword() {
    if (this.setNewPasswordForm.invalid) {
      this.setNewPasswordForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        password: this.setNewPasswordForm.controls.confirmPassword.value,
        // newPassword: this.setNewPasswordForm.controls.confirmPassword.value,
        advisorId: this.userData.id
      };
      this.orgSettingService.resetTeamMemberPassword(obj).subscribe(data => {
        this.barButtonOptions.active = false;
        this.event.openSnackBar("Password reset sucessfully", "Dismiss");
        this.Close();
      }, err => {
        this.event.showErrorMessage(err);
        this.barButtonOptions.active = false;
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
    if (password !== '' && confirm_new_password !== '') {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({mismatch: true});
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }

  Close() {
    this.subInjectService.closeNewRightSlider({state: 'close'});
  }

}
