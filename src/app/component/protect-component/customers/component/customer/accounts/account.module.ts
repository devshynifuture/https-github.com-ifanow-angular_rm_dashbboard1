import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { MaterialModule } from '../../../../../../material/material';
import { AddProfileSummaryComponent } from '../../common-component/add-profile-summary/add-profile-summary.component';
import { DetailedViewComponent } from '../../common-component/detailed-view/detailed-view.component';
import { IncomeDetailComponent } from '../../common-component/income-detail/income-detail.component';
import { SchemeLevelTransactionComponent } from '../../common-component/scheme-level-transaction/scheme-level-transaction.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountsComponent } from './accounts.component';
import { LibilitiesRightComponent } from './liabilities/libilities-right/libilities-right.component';
@NgModule({
  declarations: [
    SchemeLevelTransactionComponent,
    AccountsComponent,
    AddProfileSummaryComponent,
    LibilitiesRightComponent,
    IncomeDetailComponent,
    DetailedViewComponent,
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    // CustomDirectiveModule
  ],
  exports: [],
  entryComponents: []
})
export class AccountModule {
}
