import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {CustomerComponent} from '../customer.component';
import {ChartModule} from 'angular-highcharts';
import {OwnerComponentComponent} from './owner-component.component';
import {MaterialModule} from '../../../../../../../material/material';
import {OwnerColumnComponent} from "./owner-column/owner-column.component";

@NgModule({
  declarations: [
    OwnerComponentComponent,
    OwnerColumnComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [OwnerComponentComponent, OwnerColumnComponent],
})
export class OwnerComponentModule {
}
