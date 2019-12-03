import {NgModule} from '@angular/core';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {MaterialModule} from '../material/material';
import {SubscriptionModule} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AccountEntryModule } from '../component/protect-component/customers/component/customer/accounts/account.entry.module';
import { PlanEntryModule } from '../component/protect-component/customers/component/customer/plan/plan.entry.module';
import { EntryComponentsModule } from '../entry.components.module';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    DialogContainerComponent,
    // DynamicComponentComponent
  ],
  imports: [
    MaterialModule,
    SubscriptionModule,
    // AccountModule,
    // PlanModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // DynamicComponentModule,
    AccountEntryModule,
    PlanEntryModule,
    EntryComponentsModule
  ],
  exports: [DialogContainerComponent],
  entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class CustomCommonModule {
}
