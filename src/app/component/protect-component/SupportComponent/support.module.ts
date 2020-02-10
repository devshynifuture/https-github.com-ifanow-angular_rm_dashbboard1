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
import { FileOrderingHistoricalComponent } from './file-ordering-upload/file-ordering-historical/file-ordering-historical.component';
import { FileOrderingBulkComponent } from './file-ordering-upload/file-ordering-bulk/file-ordering-bulk.component';
import { ReportReceivablesComponent } from './support-reports/report-receivables/report-receivables.component';
import { ReportUpsellingsComponent } from './support-reports/report-upsellings/report-upsellings.component';
import { AddStockMasterComponent } from './support-dashboard/add-stock-master/add-stock-master.component';
import { AddLifeInsuranceMasterComponent } from './support-dashboard/add-life-insurance-master/add-life-insurance-master.component';
import { SchemeMappingComponent } from './support-dashboard/scheme-mapping/scheme-mapping.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { IfasDetailsComponent } from './my-ifas/ifas-details/ifas-details.component';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';
import { SupportEntryModule } from './support.entry.module';
import { IfaBoradingHistoryComponent } from './ifa-onboarding/ifa-borading-history/ifa-borading-history.component';
import { AdminDetailsComponent } from './ifa-onboarding/admin-details/admin-details.component';


@NgModule({
  declarations: [SupportSidebarComponent, SupportDashboardComponent, MyIfasComponent, IfaOnboardingComponent, SupportMiscellaneousComponent, AddStockMasterComponent, AddLifeInsuranceMasterComponent, SchemeMappingComponent, IfasDetailsComponent, IfaBoradingHistoryComponent, AdminDetailsComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ],
  entryComponents: [SupportEntryModule.getComponentList()],
  providers: [DynamicComponentService]
})
export class SupportModule { }
