import { NgModule } from '@angular/core';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { MaterialModule } from '../material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressButtonComponent } from './progress-button/progress-button.component';
import { CustomDirectiveModule } from "./directives/common-directive.module";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LinkBankComponent } from './link-bank/link-bank.component';

// import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    // ConfirmDialogComponent,
    DialogContainerComponent,
    ProgressButtonComponent,
    LinkBankComponent,
    // DynamicComponentComponent
  ],
  imports: [
    MaterialModule,
    // SubscriptionModule,
    // AccountModule,
    // PlanModule,
    CommonModule,
    FormsModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    // EmailModule
    // DynamicComponentModule,
    // AccountEntryModule,
    // PlanEntryModule,
    // EntryComponentsModule
  ],
  exports: [DialogContainerComponent, ProgressButtonComponent, LinkBankComponent],
  entryComponents: [LinkBankComponent]
  // entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class CustomCommonModule {
}
