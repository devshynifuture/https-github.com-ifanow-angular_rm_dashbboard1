import { NgModule } from '@angular/core';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { MaterialModule } from '../material/material';
import { SubscriptionModule } from '../component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailModule } from '../component/protect-component/AdviserComponent/Email/email.module';

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
    EmailModule
    // DynamicComponentModule,
    // AccountEntryModule,
    // PlanEntryModule,
    // EntryComponentsModule
  ],
  exports: [DialogContainerComponent],
  // entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class CustomCommonModule {
}
