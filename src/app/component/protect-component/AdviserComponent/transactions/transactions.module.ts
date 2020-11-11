import { EntryComponentsModule } from '../../../../entry.components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { OverviewTransactionsComponent } from './overview-transactions/overview-transactions.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { InvestorsTransactionsComponent } from './investors-transactions/investors-transactions.component';
import { MandatesTransactionsComponent } from './mandates-transactions/mandates-transactions.component';
import { KycTransactionsComponent } from './kyc-transactions/kyc-transactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { SettingsTransactionsModule } from './settings-transactions/settings-transactions.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { PhotoSigntureComponent } from './overview-transactions/know-your-customer/photo-signture/photo-signture.component';
import { VideoKycComponent } from './overview-transactions/know-your-customer/video-kyc/video-kyc.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { ScrollDispatchModule, ScrollingModule } from '@angular/cdk/scrolling';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { TransactionMobileViewComponent } from './transaction-mobile-view/transaction-mobile-view.component';
import { TransactionBottomButtonComponent } from './transaction-mobile-view/transaction-bottom-button/transaction-bottom-button.component';
import { OpenPdfViewComponent } from './open-pdf-view/open-pdf-view.component';
import { ConfirmUploadComponent } from './investors-transactions/investor-detail/confirm-upload/confirm-upload.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    OverviewTransactionsComponent,
    TransactionsListComponent,
    InvestorsTransactionsComponent,
    MandatesTransactionsComponent,
    KycTransactionsComponent,
    PhotoSigntureComponent,
    VideoKycComponent,
    TransactionMobileViewComponent,
    TransactionBottomButtonComponent,
    OpenPdfViewComponent,
    ConfirmUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CustomDirectiveModule,
    CustomCommonModule,
    TransactionRoutingModule,
    EntryComponentsModule,
    SettingsTransactionsModule,
    ScrollDispatchModule,
    ScrollingModule,
    SatDatepickerModule,
    SatNativeDateModule,
  ], exports: [
    TransactionsComponent,
    TransactionsListComponent,
    InvestorsTransactionsComponent,
    MandatesTransactionsComponent,
    ScrollDispatchModule,
    ScrollingModule
  ],
  entryComponents: [TransactionMobileViewComponent, ConfirmUploadComponent,
    TransactionBottomButtonComponent, OpenPdfViewComponent]
  // IinCreationLoaderComponent
})
export class TransactionsModule {

}
