import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingRoutingModule} from './setting-routing.module';
import {MaterialModule} from 'src/app/material/material';
import {LeftsidebarSettingComponent} from './leftsidebar-setting/leftsidebar-setting.component';
import {SettingOrgProfileComponent} from './setting-org-profile/setting-org-profile.component';
import {SettingCrmComponent} from './setting-crm/setting-crm.component';
import {SettingUserRolesComponent} from './setting-user-roles/setting-user-roles.component';
import {SettingBackofficeComponent} from './setting-backoffice/setting-backoffice.component';
import {RolesComponent} from './setting-user-roles/setting-users-roles/roles/roles.component';
import {HierachyComponent} from './setting-user-roles/setting-users-roles/hierachy/hierachy.component';
import {ArnRiaDetailsComponent} from './setting-backup/setting-backup/arn-ria-details/arn-ria-details.component';
import {MfRtaDetailsComponent} from './setting-backup/setting-backup/mf-rta-details/mf-rta-details.component';
import {SettingEntryModule} from './setting-entry/setting-entry.module';
import {SchemeBasketComponent} from './setting-backup/setting-backup/scheme-basket/scheme-basket.component';
import {ModelPortfolioComponent} from './setting-backup/setting-backup/model-portfolio/model-portfolio.component';
import {SettingBackupModule} from './setting-backup/setting-backup/setting-backup.module';
import {SettingActivityComponent} from './setting-activity/setting-activity.component';
import {CommonComponentModule} from '../../common-component/common-component.module';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import {UsersComponent} from './setting-user-roles/setting-users-roles/users/users.component';


@NgModule({
  declarations: [LeftsidebarSettingComponent, SettingOrgProfileComponent, SettingCrmComponent, UsersComponent,
    SettingUserRolesComponent, SettingBackofficeComponent, RolesComponent,
    HierachyComponent, ArnRiaDetailsComponent, MfRtaDetailsComponent, SchemeBasketComponent,
    ModelPortfolioComponent,
    SettingActivityComponent],
  exports: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MaterialModule,
    SettingEntryModule,
    SettingBackupModule,
    CommonComponentModule,
    CustomDirectiveModule,
    CommonComponentModule,
    CustomDirectiveModule,
    CustomCommonModule,
    // UserModule,

  ]
})
export class SettingModule {
}
