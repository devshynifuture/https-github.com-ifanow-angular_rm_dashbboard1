import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { MyIfasComponent } from './my-ifas/my-ifas.component';
import { IfaOnboardingComponent } from './ifa-onboarding/ifa-onboarding.component';
import { SupportMiscellaneousComponent } from './support-miscellaneous/support-miscellaneous.component';
import { SchemeMappingComponent } from './support-dashboard/scheme-mapping/scheme-mapping.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DynamicComponentService } from 'src/app/services/dynamic-component.service';
import { SupportEntryModule } from './support.entry.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HighchartsChartModule } from 'highcharts-angular';
import { SupportManagementComponent } from './support-management/support-management.component';

@NgModule({
  declarations: [
    SupportSidebarComponent,
    SupportDashboardComponent,
    MyIfasComponent,
    IfaOnboardingComponent,
    SupportMiscellaneousComponent,
    SchemeMappingComponent,
    SupportManagementComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SupportRoutingModule,
    MaterialModule,
    ScrollDispatchModule,
    CustomDirectiveModule,
    SupportEntryModule,
    HighchartsChartModule,
  ],
  entryComponents: [],
  providers: [DynamicComponentService]
})
export class SupportModule { }
