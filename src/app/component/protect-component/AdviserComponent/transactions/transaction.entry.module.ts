
import { MaterialModule } from '../../../../material/material';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { OnlineTrasactionComponent } from './overview-transactions/doTransaction/online-trasaction/online-trasaction.component';
import { AddArnRiaCredentialsComponent } from './settings-transactions/settings-manage-credentials/arn-ria-credentials/add-arn-ria-credentials/add-arn-ria-credentials.component';
import { PurchaseTrasactionComponent } from './overview-transactions/doTransaction/purchase-trasaction/purchase-trasaction.component';
import { AddSubBrokerCredentialsComponent } from './settings-transactions/settings-manage-credentials/sub-broker-team-member/add-sub-broker-credentials/add-sub-broker-credentials.component';
import { TransactionSummaryComponent } from './overview-transactions/doTransaction/transaction-summary/transaction-summary.component';
import { AddClientMappingComponent } from './settings-transactions/settings-client-mapping/add-client-mapping/add-client-mapping.component';
import { ConfirmationTransactionComponent } from './overview-transactions/doTransaction/confirmation-transaction/confirmation-transaction.component';
import { SwitchTransactionComponent } from './overview-transactions/doTransaction/switch-transaction/switch-transaction.component';
import { RedemptionTransactionComponent } from './overview-transactions/doTransaction/redemption-transaction/redemption-transaction.component';
import { SwpTransactionComponent } from './overview-transactions/doTransaction/swp-transaction/swp-transaction.component';
import { StpTransactionComponent } from './overview-transactions/doTransaction/stp-transaction/stp-transaction.component';
import { SipTransactionComponent } from './overview-transactions/doTransaction/sip-transaction/sip-transaction.component';
import { TransactionsHistoryComponent } from './transactions-list/transactions-history/transactions-history.component';
import { KnowYourCustomerComponent } from './overview-transactions/know-your-customer/know-your-customer.component';
import { PersonalDetailsComponent } from './overview-transactions/know-your-customer/personal-details/personal-details.component';
import { BackDetailsComponent } from './overview-transactions/know-your-customer/back-details/back-details.component';
import { PermanentAddressComponent } from './overview-transactions/know-your-customer/permanent-address/permanent-address.component';
import { NomineeDetailsComponent } from './overview-transactions/know-your-customer/nominee-details/nominee-details.component';
import { PopUpComponent } from './overview-transactions/doTransaction/pop-up/pop-up.component';
import { PlatformPopUpComponent } from './overview-transactions/doTransaction/platform-pop-up/platform-pop-up.component';
import { EuinSelectPopUpComponent } from './overview-transactions/doTransaction/euin-select-pop-up/euin-select-pop-up.component';
import { BankSelectPopUpComponent } from './overview-transactions/doTransaction/bank-select-pop-up/bank-select-pop-up.component';
import { UmrnPopUpComponent } from './overview-transactions/doTransaction/umrn-pop-up/umrn-pop-up.component';

export const componentList = [
    TransactionAddComponent,
    OnlineTrasactionComponent,
    AddArnRiaCredentialsComponent,
    AddSubBrokerCredentialsComponent,
    PurchaseTrasactionComponent,
    TransactionSummaryComponent,
    AddClientMappingComponent,
    ConfirmationTransactionComponent,
    SwitchTransactionComponent,
    RedemptionTransactionComponent,
    SwpTransactionComponent,
    StpTransactionComponent,
    SipTransactionComponent,
    TransactionsHistoryComponent,
    KnowYourCustomerComponent,
    PersonalDetailsComponent,
    PermanentAddressComponent,
    BackDetailsComponent,
    NomineeDetailsComponent,
    PopUpComponent,
    PlatformPopUpComponent,
    EuinSelectPopUpComponent,
    BankSelectPopUpComponent,
    UmrnPopUpComponent,
    // FatcaDetailsComponent,
    // VideoKycComponent



]
@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDirectiveModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule],
    entryComponents: [componentList]
})

export class TransactionEntryModule { }
