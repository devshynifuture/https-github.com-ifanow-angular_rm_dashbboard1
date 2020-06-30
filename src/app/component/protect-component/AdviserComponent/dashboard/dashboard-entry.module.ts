import { NgModule } from '@angular/core';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material';
import { CommonModule } from '@angular/common';

const componentList = [
  DashboardGuideDialogComponent
]

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule
  ],
  entryComponents: [componentList]
})
export class DashboardEntryModule {
  constructor() { }

  static getComponentList() {
    return componentList;
  }
}