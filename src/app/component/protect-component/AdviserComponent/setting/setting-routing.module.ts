import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeftsidebarSettingComponent } from './leftsidebar-setting/leftsidebar-setting.component';
import { SettingOrgProfileComponent } from './setting-org-profile/setting-org-profile.component';
import { SettingCrmComponent } from './setting-crm/setting-crm.component';
import { SettingPlanComponent } from './setting-plan/setting-plan.component';
import { SettingUserRolesComponent } from './setting-user-roles/setting-user-roles.component';
import { SettingBackupComponent } from './setting-backup/setting-backup.component';
import { SettingBackofficeComponent } from './setting-backoffice/setting-backoffice.component';
import { SettingPreferenceComponent } from './setting-preference/setting-preference.component';
import { SettingActivityComponent } from './setting-activity/setting-activity.component';
import { SettingActivityTabsComponent } from './setting-activity/setting-activity-tabs/setting-activity-tabs.component';
import { SettingActivityTaskSettingComponent } from './setting-activity/setting-activity-task-setting/setting-activity-task-setting.component';
import { SettingActivityTaskTemplatesComponent } from './setting-activity/setting-activity-task-templates/setting-activity-task-templates.component';


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
        path: 'preference',
        component: SettingPreferenceComponent
      },
      {
        path: 'activity',
        component: SettingActivityComponent,
        children: [
          {
            path: 'task',
            component: SettingActivityTabsComponent,
            children: [
              {
                path: 'template',
                component: SettingActivityTaskTemplatesComponent
              }, {
                path: 'setting',
                component: SettingActivityTaskSettingComponent
              }, {
                path: '',
                redirectTo: 'template',
                pathMatch: 'full'
              }
            ]
          }, {
            path: '',
            redirectTo: 'task',
            pathMatch: 'full'
          }
        ]
      },
      // {
      //   path: 'crm',
      //   component: SettingCrmComponent
      // },
      {
        path: 'plan',
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/setting/setting-plan/setting-plan/setting-plan.module').then(m => m.SettingPlanModule)
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
        loadChildren: () => import('src/app/component/protect-component/AdviserComponent/setting/setting-backup/setting-backup/setting-backup.module').then(m => m.SettingBackupModule)
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
