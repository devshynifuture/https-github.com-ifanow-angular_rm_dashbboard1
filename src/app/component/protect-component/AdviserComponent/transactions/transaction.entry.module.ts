import { MaterialModule } from '../../../../material/material';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { OnlineTransactionComponent } from './overview-transactions/doTransaction/online-transaction/online-transaction.component';
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
import { TransactionDetailComponent } from './transactions-list/transaction-detail/transaction-detail.component';
import { KnowYourCustomerComponent } from './overview-transactions/know-your-customer/know-your-customer.component';
import { BackDetailsComponent } from './overview-transactions/know-your-customer/back-details/back-details.component';
import { PermanentAddressComponent } from './overview-transactions/know-your-customer/permanent-address/permanent-address.component';
import { NomineeDetailsComponent } from './overview-transactions/know-your-customer/nominee-details/nominee-details.component';
import { PopUpComponent } from './overview-transactions/doTransaction/pop-up/pop-up.component';
import { PlatformPopUpComponent } from './overview-transactions/doTransaction/platform-pop-up/platform-pop-up.component';
import { EuinSelectPopUpComponent } from './overview-transactions/doTransaction/euin-select-pop-up/euin-select-pop-up.component';
import { BankSelectPopUpComponent } from './overview-transactions/doTransaction/bank-select-pop-up/bank-select-pop-up.component';
import { UmrnPopUpComponent } from './overview-transactions/doTransaction/umrn-pop-up/umrn-pop-up.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { ScrollDispatchModule, ScrollingModule } from '@angular/cdk/scrolling';
import { PersonalDetailsComponent } from './overview-transactions/know-your-customer/personal-details/personal-details.component';
import { LeftKycListComponent } from './overview-transactions/know-your-customer/left-kyc-list/left-kyc-list.component';
import { FatcaDetailsComponent } from './overview-transactions/know-your-customer/fatca-details/fatca-details.component';
import { ContactDetailsComponent } from './overview-transactions/know-your-customer/contact-details/contact-details.component';
import { LeftSideInnUccListComponent } from './overview-transactions/IIN/UCC-Creation/left-side-inn-ucc-list/left-side-inn-ucc-list.component';
import { IinUccCreationComponent } from './overview-transactions/IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { PersonalDetailsInnComponent } from './overview-transactions/IIN/UCC-Creation/personal-details-inn/personal-details-inn.component';
import { ContactDetailsInnComponent } from './overview-transactions/IIN/UCC-Creation/contact-details-inn/contact-details-inn.component';
import { BankDetailsIINComponent } from './overview-transactions/IIN/UCC-Creation/bank-details-iin/bank-details-iin.component';
import { NomineeDetailsIinComponent } from './overview-transactions/IIN/UCC-Creation/nominee-details-iin/nominee-details-iin.component';
import { FatcaDetailsInnComponent } from './overview-transactions/IIN/UCC-Creation/fatca-details-inn/fatca-details-inn.component';
import { SubmitReviewInnComponent } from './overview-transactions/IIN/UCC-Creation/submit-review-inn/submit-review-inn.component';
import { MandateCreationComponent } from './overview-transactions/MandateCreation/mandate-creation/mandate-creation.component';
import { AddMandateComponent } from './overview-transactions/MandateCreation/add-mandate/add-mandate.component';
import { DetailedViewMandateComponent } from './mandates-transactions/detailed-view-mandate/detailed-view-mandate.component';
import { PeopleEntryModule } from '../../PeopleComponent/people/people-entry-module';
import { NoCredFoundComponent } from './noCredFound/no-cred-found/no-cred-found.component';
import { InvestorDetailComponent } from './investors-transactions/investor-detail/investor-detail.component';
import { OpenPdfViewComponent } from './open-pdf-view/open-pdf-view.component';

export const componentList = [
  OnlineTransactionComponent,
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
  TransactionDetailComponent,
  KnowYourCustomerComponent,
  PermanentAddressComponent,
  BackDetailsComponent,
  NomineeDetailsComponent,
  PopUpComponent,
  PlatformPopUpComponent,
  EuinSelectPopUpComponent,
  BankSelectPopUpComponent,
  UmrnPopUpComponent,
  PersonalDetailsComponent,
  FatcaDetailsComponent,
  ContactDetailsComponent,
  LeftSideInnUccListComponent,
  ContactDetailsComponent,
  IinUccCreationComponent,
  PersonalDetailsInnComponent,
  LeftKycListComponent,
  LeftSideInnUccListComponent,
  ContactDetailsInnComponent,
  BankDetailsIINComponent,
  NomineeDetailsIinComponent,
  FatcaDetailsInnComponent,
  SubmitReviewInnComponent,
  MandateCreationComponent,
  AddMandateComponent,
  DetailedViewMandateComponent,
  InvestorDetailComponent,
  OpenPdfViewComponent

  // VideoKycComponent


];

@NgModule({
  declarations: [componentList, NoCredFoundComponent,],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    CustomCommonModule,
    ScrollingModule,
    PeopleEntryModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ScrollDispatchModule, ScrollingModule],
  entryComponents: [componentList]
})

export class TransactionEntryModule {
}
