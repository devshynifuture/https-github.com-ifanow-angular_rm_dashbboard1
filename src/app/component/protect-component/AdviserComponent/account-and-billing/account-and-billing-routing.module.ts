import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopBarAccountAndBllingComponent } from './top-bar-account-and-blling/top-bar-account-and-blling.component';
import { SettingOrgProfileComponent } from '../setting/setting-org-profile/setting-org-profile.component';
import { SettingPreferenceComponent } from '../setting/setting-preference/setting-preference.component';
import { SettingActivityComponent } from '../setting/setting-activity/setting-activity.component';
import { SettingUserRolesComponent } from '../setting/setting-user-roles/setting-user-roles.component';
import { SettingBackofficeComponent } from '../setting/setting-backoffice/setting-backoffice.component';
import { AccountAndBillingComponent } from './account-and-billing/account-and-billing.component';


const routes: Routes = [
  {
    path: '',
    component: TopBarAccountAndBllingComponent,
    children: [
      {
        path: 'accountAndBilling',
        component: AccountAndBillingComponent
      },
      {
        path: '',
        redirectTo: 'accountAndBilling',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountAndBillingRoutingModule { }
