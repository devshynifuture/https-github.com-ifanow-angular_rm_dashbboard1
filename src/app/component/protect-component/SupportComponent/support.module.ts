import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { MyIfasComponent } from './my-ifas/my-ifas.component';
import { IfaOnboardingComponent } from './ifa-onboarding/ifa-onboarding.component';
import { SupportAumReconciliationComponent } from './support-aum-reconciliation/support-aum-reconciliation.component';
import { FileOrderingUploadComponent } from './file-ordering-upload/file-ordering-upload.component';
import { SupportReportsComponent } from './support-reports/support-reports.component';
import { SupportMiscellaneousComponent } from './support-miscellaneous/support-miscellaneous.component';


@NgModule({
  declarations: [SupportSidebarComponent, SupportDashboardComponent, MyIfasComponent, IfaOnboardingComponent, SupportAumReconciliationComponent, FileOrderingUploadComponent, SupportReportsComponent, SupportMiscellaneousComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    MaterialModule
  ]
})
export class SupportModule { }
