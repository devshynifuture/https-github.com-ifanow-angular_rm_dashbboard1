import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { MyIfasComponent } from './my-ifas/my-ifas.component';
import { IfaOnboardingComponent } from './ifa-onboarding/ifa-onboarding.component';
import { SupportMiscellaneousComponent } from './support-miscellaneous/support-miscellaneous.component';
import { AddStockMasterComponent } from './support-dashboard/add-stock-master/add-stock-master.component';
import { AddLifeInsuranceMasterComponent } from './support-dashboard/add-life-insurance-master/add-life-insurance-master.component';
import { SchemeMappingComponent } from './support-dashboard/scheme-mapping/scheme-mapping.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';
import { SupportEntryModule } from './support.entry.module';


@NgModule({
  declarations: [SupportSidebarComponent, SupportDashboardComponent, MyIfasComponent, IfaOnboardingComponent, SupportMiscellaneousComponent, AddStockMasterComponent, AddLifeInsuranceMasterComponent, SchemeMappingComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    SupportEntryModule
  ],
  entryComponents: [],
  providers: [DynamicComponentService]
})
export class SupportModule { }
