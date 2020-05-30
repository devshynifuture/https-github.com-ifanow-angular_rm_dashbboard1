import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {CustomerComponent} from '../customer.component';
import {ChartModule} from 'angular-highcharts';
import {MaterialModule} from '../../../../../../material/material';
import {FactSheetComponent} from '../../common-component/fact-shit/fact-sheet.component';
import {TransactionsComponent} from '../../common-component/transactions/transactions.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';

const componentList = [
  FactSheetComponent,
  TransactionsComponent];

@NgModule({
  declarations: [componentList],
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    CustomDirectiveModule,
    CustomCommonModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [componentList],
})
export class AccountUpperSliderModule {
}
