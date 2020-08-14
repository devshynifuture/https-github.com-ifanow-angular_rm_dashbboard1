import { NgModule } from '@angular/core';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material';
import { CommonModule } from '@angular/common';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';

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
    CommonComponentModule,
    CustomDirectiveModule,
    CustomCommonModule
  ],
  entryComponents: [componentList]
})
export class DashboardEntryModule {
  constructor() { }

  static getComponentList() {
    return componentList;
  }
}