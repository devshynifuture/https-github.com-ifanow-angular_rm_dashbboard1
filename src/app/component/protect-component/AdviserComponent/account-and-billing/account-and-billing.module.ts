import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountAndBillingRoutingModule } from './account-and-billing-routing.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { MaterialModule } from 'src/app/material/material';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { TopBarAccountAndBllingComponent } from './top-bar-account-and-blling/top-bar-account-and-blling.component';
import { SettingOrgProfileComponent } from '../setting/setting-org-profile/setting-org-profile.component';
import { SettingUserRolesComponent } from '../setting/setting-user-roles/setting-user-roles.component';
import { SettingBackofficeComponent } from '../setting/setting-backoffice/setting-backoffice.component';
import { SettingCrmComponent } from '../setting/setting-crm/setting-crm.component';
import { UsersComponent } from '../setting/setting-user-roles/setting-users-roles/users/users.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TopBarAccountAndBllingComponent],
  imports: [
    CommonModule,
    AccountAndBillingRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    CustomCommonModule,
  ]
})
export class AccountAndBillingModule { }
