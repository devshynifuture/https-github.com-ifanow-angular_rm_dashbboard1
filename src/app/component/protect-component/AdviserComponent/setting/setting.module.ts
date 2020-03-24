import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { LeftsidebarSettingComponent } from './leftsidebar-setting/leftsidebar-setting.component';
import { SettingOrgProfileComponent } from './setting-org-profile/setting-org-profile.component';
import { SettingCrmComponent } from './setting-crm/setting-crm.component';
import { SettingUserRolesComponent } from './setting-user-roles/setting-user-roles.component';
import { SettingBackofficeComponent } from './setting-backoffice/setting-backoffice.component';
import { UsersComponent } from './setting-user-roles/setting-users-roles/users/users.component';
import { RolesComponent } from './setting-user-roles/setting-users-roles/roles/roles.component';
import { HierachyComponent } from './setting-user-roles/setting-users-roles/hierachy/hierachy.component';

import { ArnRiaDetailsComponent } from './setting-backup/setting-backup/arn-ria-details/arn-ria-details.component';
import { MfRtaDetailsComponent } from './setting-backup/setting-backup/mf-rta-details/mf-rta-details.component';
import { SettingEntryModule } from './setting-entry/setting-entry.module';
import { SchemeBasketComponent } from './setting-backup/setting-backup/scheme-basket/scheme-basket.component';
import { ModelPortfolioComponent } from './setting-backup/setting-backup/model-portfolio/model-portfolio.component';
import { SettingBackupModule } from './setting-backup/setting-backup/setting-backup.module';
import { SettingPreferenceComponent } from './setting-preference/setting-preference.component';
import { SettingActivityComponent } from './setting-activity/setting-activity.component';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { OrgProfileComponent } from './setting-org-profile/add-personal-profile/org-profile/org-profile.component';


@NgModule({
  declarations: [LeftsidebarSettingComponent, SettingOrgProfileComponent, SettingCrmComponent,
    SettingUserRolesComponent, SettingBackofficeComponent, UsersComponent, RolesComponent,
    HierachyComponent, ArnRiaDetailsComponent, MfRtaDetailsComponent, SchemeBasketComponent,
    ModelPortfolioComponent,
    SettingPreferenceComponent,
    SettingActivityComponent,],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MaterialModule,
    SettingEntryModule,
    SettingBackupModule,
    CommonComponentModule,
    CustomDirectiveModule

  ]
})
export class SettingModule { }
