import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeftsidebarSettingComponent } from './leftsidebar-setting/leftsidebar-setting.component';
import { SettingOrgProfileComponent } from './setting-org-profile/setting-org-profile.component';
import { SettingCrmComponent } from './setting-crm/setting-crm.component';
import { SettingPlanComponent } from './setting-plan/setting-plan.component';
import { SettingUserRolesComponent } from './setting-user-roles/setting-user-roles.component';
import { SettingBackupComponent } from './setting-backup/setting-backup.component';
import { SettingBackofficeComponent } from './setting-backoffice/setting-backoffice.component';


const routes: Routes = [
  {
    path: '',
    component: LeftsidebarSettingComponent,
    children: [
      {
        path: 'orgprofile',
        component: SettingOrgProfileComponent
      },
      {
        path: 'crm',
        component: SettingCrmComponent
      },
      {
        path: 'plan',
        component: SettingPlanComponent
      },
      {
        path: 'users&roles',
        component: SettingUserRolesComponent
      },
      {
        path: 'backoffice',
        component: SettingBackofficeComponent
      },
      {
        path: 'backup',
        component: SettingBackupComponent
      },
      {
        path: '',
        redirectTo: 'orgprofile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
