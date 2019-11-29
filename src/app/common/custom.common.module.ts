import {NgModule} from '@angular/core';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {MaterialModule} from '../material/material';
import {SubscriptionModule} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicComponentComponent} from './dynamic-component/dynamic-component.component';
import {CommonModule} from '@angular/common';
import {BottomSheetComponent} from "../component/protect-component/customers/component/common-component/bottom-sheet/bottom-sheet.component";
import {EntryComponentsModule} from "../entry.components.module";

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    DialogContainerComponent,
    DynamicComponentComponent
  ],
  imports: [
    MaterialModule,
    SubscriptionModule,
    // AccountModule,
    // PlanModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // AppModule
    // EntryComponentsModule
  ],
  exports: [DialogContainerComponent],
  // entryComponents: [ EntryComponentsModule.getComponentList()]
})
export class CustomCommonModule {
}
