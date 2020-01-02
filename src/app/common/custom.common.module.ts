import {NgModule} from '@angular/core';
import {DialogContainerComponent} from './dialog-container/dialog-container.component';
import {MaterialModule} from '../material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProgressButtonComponent} from './progress-button/progress-button.component';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    DialogContainerComponent,
    ProgressButtonComponent,
    // DynamicComponentComponent
  ],
  imports: [
    MaterialModule,
    // SubscriptionModule,
    // AccountModule,
    // PlanModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // EmailModule
    // DynamicComponentModule,
    // AccountEntryModule,
    // PlanEntryModule,
    // EntryComponentsModule
  ],
  exports: [DialogContainerComponent, ProgressButtonComponent],
  // entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class CustomCommonModule {
}
