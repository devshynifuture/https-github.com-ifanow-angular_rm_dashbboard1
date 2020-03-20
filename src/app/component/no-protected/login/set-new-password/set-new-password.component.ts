import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {
  newPasswordLength = 0;

  constructor(private fb: FormBuilder) { }
  setNewPasswordForm;
  validatorType = ValidatorType
  ngOnInit() {
    this.setNewPasswordForm = this.fb.group({
      newPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]],
      confirmPassword: [, [Validators.required, Validators.pattern(this.validatorType.LOGIN_PASS_REGEX)]]
    });
  }
  setNewPassword() {
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
