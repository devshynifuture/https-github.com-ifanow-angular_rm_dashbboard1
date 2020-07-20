import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicComponentComponent} from './dynamic-component.component';
import {MaterialModule} from '../../material/material';

const componentList = [
  DynamicComponentComponent

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
  exports: [componentList],
  // entryComponents: [componentList]
})

export class DynamicComponentModule {

}
