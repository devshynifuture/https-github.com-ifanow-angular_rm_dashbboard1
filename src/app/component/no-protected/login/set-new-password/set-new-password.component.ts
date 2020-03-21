import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

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
  }
  hide1 = true;
  hide2 = true;
  constructor(private fb: FormBuilder) { }
  setNewPasswordForm;
  validatorType = ValidatorType
  ngOnInit() {
    this.setNewPasswordForm = this.fb.group({
      newPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX), this.checkUpperCase(), this.checkLowerCase(), this.checkSpecialCharacter()]],
      confirmPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }
  setNewPassword() {
  }
  checkUpperCase() {

    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[A-Z])/).test(control.value) && control.value != null) {
        this.passwordStregth.upperCase = true;
        return;
      }
      this.passwordStregth.upperCase = false;
      return;
    }
  }
  checkLowerCase() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[a-z])/).test(control.value) && control.value != null) {
        this.passwordStregth.lowerCase = true;
        return;
      }
      this.passwordStregth.lowerCase = false;
      return;
    }
  }

  checkSpecialCharacter() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (new RegExp(/(?=.*[@#$%])/).test(control.value) && control.value != null) {
        this.passwordStregth.specialCharacter = true;
        return;
      }
      this.passwordStregth.specialCharacter = false;
      return;
    }
  }

  checkPassword() {
    const password = this.setNewPasswordForm.get('newPassword').value;
    const confirm_new_password = this.setNewPasswordForm.get('confirmPassword').value;
    this.newPasswordLength = (password != null) ? password.length : 0;
    console.log(this.newPasswordLength)
    if (password !== "" && confirm_new_password !== "") {
      if (confirm_new_password !== password) {
        this.setNewPasswordForm.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        this.setNewPasswordForm.get('confirmPassword').setErrors(null);
      }
    }
  }
}
