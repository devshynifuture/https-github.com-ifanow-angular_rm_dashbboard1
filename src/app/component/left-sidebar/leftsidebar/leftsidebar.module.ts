import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LeftsidebarRoutingModule} from './leftsidebar-routing.module';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubscriptionEntry} from '../../protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import {SubscriptionUpperEntry} from '../../protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import {LeftsidebarComponent} from './leftsidebar.component';
import {CustomCommonModule} from '../../../common/custom.common.module';
import {DynamicComponentService} from '../../../services/dynamic-component.service';


@NgModule({
  declarations: [
    LeftsidebarComponent
  ],
  imports: [
    SubscriptionEntry,
    SubscriptionUpperEntry,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CustomCommonModule,
    LeftsidebarRoutingModule,

  ],
  entryComponents: [SubscriptionEntry.getComponentList(), SubscriptionUpperEntry.getComponentList()],
  providers: [DynamicComponentService]
})
export class LeftsidebarModule {
}
