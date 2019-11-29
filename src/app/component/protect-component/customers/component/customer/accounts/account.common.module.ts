import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {CustomerComponent} from '../customer.component';
import {ChartModule} from 'angular-highcharts';
import {OwnerComponentComponent} from './owner-component/owner-component.component';
import {MaterialModule} from '../../../../../../material/material';
import {OwnerColumnComponent} from './owner-component/owner-column/owner-column.component';

const componentList = [
  OwnerComponentComponent,
  OwnerColumnComponent,
];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [componentList],
})
export class AccountCommonModule {
}
