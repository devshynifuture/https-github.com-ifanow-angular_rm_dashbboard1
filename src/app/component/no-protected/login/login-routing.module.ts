import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { SignupTeamMemberComponent } from './signup-team-member/signup-team-member.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { SupportLoginComponent } from './support-login/support-login.component';
import { SetTeamMemberPasswordComponent } from './set-team-member-password/set-team-member-password.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'team-member-signup',
    component: SignupTeamMemberComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'setpassword',
    component: SetNewPasswordComponent
  },
  {
    path: 'setTeamMemberPassword',
    component: SetTeamMemberPasswordComponent
  },
  {
    path: 'verifyotp',
    component: VerifyOtpComponent
  },
  {
    path: 'termscondition',
    component: TermsConditionsComponent
  },
  {
    path: 'support-login',
    component: SupportLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
