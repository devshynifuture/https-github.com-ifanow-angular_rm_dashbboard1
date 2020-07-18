import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { LeftsidebarRoutingModule } from './leftsidebar-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import { SubscriptionUpperEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { LeftsidebarComponent } from './leftsidebar.component';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
// import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from '../../../constants/date-format.constant';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DashboardEntryModule } from '../../protect-component/AdviserComponent/dashboard/dashboard-entry.module';

@NgModule({
  declarations: [
    LeftsidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SubscriptionEntry,
    SubscriptionUpperEntry,
    LeftsidebarRoutingModule,
    // ScrollDispatchModule,

    CustomDirectiveModule,
    DashboardEntryModule
  ],
  entryComponents: [
    SubscriptionEntry.getComponentList(),
    DashboardEntryModule.getComponentList()
  ],
  providers: [
    DynamicComponentService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 }
  ]
})
export class LeftsidebarModule {
}
