import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftsidebarRoutingModule } from './leftsidebar-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SubscriptionEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import { SubscriptionUpperEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { LeftsidebarComponent } from './leftsidebar.component';


@NgModule({
  declarations: [
    LeftsidebarComponent
  ],
  imports: [
    CommonModule,
    LeftsidebarRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [SubscriptionEntry.getComponentList(), SubscriptionUpperEntry.getComponentList()]
})
export class LeftsidebarModule { }
