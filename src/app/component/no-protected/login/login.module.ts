import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
// import { OtpInputComponent } from './otp-input/otp-input.component';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    SetNewPasswordComponent,
    VerifyOtpComponent,
    // OtpInputComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    CustomCommonModule
  ]
})
export class LoginModule { }
