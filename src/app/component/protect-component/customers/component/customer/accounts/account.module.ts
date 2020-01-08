import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { MaterialModule } from '../../../../../../material/material';
import { AddProfileSummaryComponent } from '../../common-component/add-profile-summary/add-profile-summary.component';
import { BottomSheetComponent } from '../../common-component/bottom-sheet/bottom-sheet.component';
import { DetailedViewComponent } from '../../common-component/detailed-view/detailed-view.component';
import { DocumentNewFolderComponent } from '../../common-component/document-new-folder/document-new-folder.component';
import { IncomeDetailComponent } from '../../common-component/income-detail/income-detail.component';
import { RightFilterComponent } from '../../common-component/right-filter/right-filter.component';
import { SchemeLevelTransactionComponent } from '../../common-component/scheme-level-transaction/scheme-level-transaction.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountsComponent } from './accounts.component';
import { LibilitiesRightComponent } from './liabilities/libilities-right/libilities-right.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AddNomineeComponent } from './assets/smallSavingScheme/common-component/add-nominee/add-nominee.component';
@NgModule({
  declarations: [
    SchemeLevelTransactionComponent,
    AccountsComponent,
    AddProfileSummaryComponent,
    BottomSheetComponent,
    LibilitiesRightComponent,
    RightFilterComponent,
    IncomeDetailComponent,
    DetailedViewComponent,
    DocumentNewFolderComponent,
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
  entryComponents: [BottomSheetComponent, DocumentNewFolderComponent]
})
export class AccountModule {
}
