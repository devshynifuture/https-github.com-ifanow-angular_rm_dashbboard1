import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../../../material/material';
import { MfAllocationsComponent } from './goals-plan/mf-allocations/mf-allocations.component';
import { PreferencesComponent } from './goals-plan/preferences/preferences.component';

export const componentList = [MfAllocationsComponent,
  PreferencesComponent
  // UpperCustomerComponent
];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [componentList]
})

export class PlanEntryModule {

  static getComponentList() {
    return componentList;
  }
}
