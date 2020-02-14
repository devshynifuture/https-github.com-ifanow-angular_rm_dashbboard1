import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { LeftsidebarSettingComponent } from './leftsidebar-setting/leftsidebar-setting.component';
import { SettingOrgProfileComponent } from './setting-org-profile/setting-org-profile.component';
import { SettingCrmComponent } from './setting-crm/setting-crm.component';
import { SettingUserRolesComponent } from './setting-user-roles/setting-user-roles.component';
import { SettingBackofficeComponent } from './setting-backoffice/setting-backoffice.component';


@NgModule({
  declarations: [LeftsidebarSettingComponent, SettingOrgProfileComponent, SettingCrmComponent, SettingUserRolesComponent, SettingBackofficeComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MaterialModule
  ]
})
export class SettingModule { }
