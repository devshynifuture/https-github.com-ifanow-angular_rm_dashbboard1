import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ViewActivityComponent } from './overview-documents/view-activity/view-activity.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';


export const componentList = [
  ViewActivityComponent,
  // DocumentNewFolderComponent,
];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    CustomCommonModule,
    CommonComponentModule,
  ],
  entryComponents: [componentList]
})
export class CustomerOverviewEntryModule {
  static getComponentList() {
    return componentList;
  }
}
