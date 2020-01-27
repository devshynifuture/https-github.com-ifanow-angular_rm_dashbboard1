import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { MyIfasComponent } from './my-ifas/my-ifas.component';
import { IfaOnboardingComponent } from './ifa-onboarding/ifa-onboarding.component';
import { SupportAumReconciliationComponent } from './support-aum-reconciliation/support-aum-reconciliation.component';
import { FileOrderingUploadComponent } from './file-ordering-upload/file-ordering-upload.component';
import { SupportReportsComponent } from './support-reports/support-reports.component';
import { supportsPassiveEventListeners } from '@angular/cdk/platform';
import { SupportMiscellaneousComponent } from './support-miscellaneous/support-miscellaneous.component';

const routes: Routes = [
  {
    path: '',
    component: SupportSidebarComponent,
    children: [
      {
        path: 'dashboard',
        component: SupportDashboardComponent
      },
      {
        path: 'my-ifas',
        component: MyIfasComponent
      },
      {
        path: 'ifa-onboarding',
        component: IfaOnboardingComponent
      },
      {
        path: 'aum-reconciliation',
        component: SupportAumReconciliationComponent
      },
      {
        path: 'file-ordering',
        component: FileOrderingUploadComponent
      },
      {
        path: 'reports',
        component: SupportReportsComponent
      },
      {
        path: 'miscellaneous',
        component: SupportMiscellaneousComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
