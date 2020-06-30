import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomDirectiveModule } from '../../../../common/directives/common-directive.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    DashboardRoutingModule
  ],
  exports: []
})
export class DashboardModule {
  constructor() { }
}