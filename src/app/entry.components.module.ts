import { SelectFolioMapComponent } from './component/protect-component/AdviserComponent/backOffice/backoffice-folio-mapping/select-folio-map/select-folio-map.component';
// tslint:disable:max-line-length
import { DetailedPoTdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/po-td-scheme/detailed-po-td/detailed-po-td.component';
import { AddPoRdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoMisComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddPoSavingComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddScssComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddKvpComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { LiabilitiesDetailComponent } from './component/protect-component/customers/component/common-component/liabilities-detail/liabilities-detail.component';
import { DetailedViewFixedDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/detailed-view-fixed-deposit/detailed-view-fixed-deposit.component';
import { DetailedViewRecuringDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/recuring-deposit/detailed-view-recuring-deposit/detailed-view-recuring-deposit.component';
import { DetailedViewBondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/bonds/detailed-view-bonds/detailed-view-bonds.component';
import { BondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/bonds/bonds.component';
import { AddPoTdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-td/add-po-td.component';
import { AddSsyComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-ssy/add-ssy.component';
import { AddNscComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-nsc/add-nsc.component';
import { AddTransactionComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-transaction/add-transaction.component';
import { AddPpfComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-ppf/add-ppf.component';
import { AddEPSComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AddSuperannuationComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddGratuityComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { NpsSummaryPortfolioComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { NgModule } from '@angular/core';
import { AddLiabilitiesComponent } from './component/protect-component/customers/component/common-component/add-liabilities/add-liabilities.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddInsuranceComponent } from './component/protect-component/customers/component/common-component/add-insurance/add-insurance.component';
import { FixedDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import { AddRealEstateComponent } from './component/protect-component/customers/component/customer/accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import { GoldComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/others/others.component';
import { CashInHandComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import { BankAccountsComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/bank-accounts/bank-accounts.component';
import { RecuringDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { AddEPFComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-epf/add-epf.component';
import { AddNPSComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/add-nps.component';
// import {AddGoalComponent} from './component/protect-component/customers/component/customer/plan/goals-plan/add-goal/add-goal.component';
import { NpsSchemeHoldingComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component';
import { DetailedNscComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/nsc-scheme/detailed-nsc/detailed-nsc.component';
import { DetailedViewEPFComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-epf/detailed-view-epf/detailed-view-epf.component';
import { DetailedViewGoldComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/gold/detailed-view-gold/detailed-view-gold.component';
import { DetailedViewOthersComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/others/detailed-view-others/detailed-view-others.component';
import { DetailedViewBankAccountComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/bank-accounts/detailed-view-bank-account/detailed-view-bank-account.component';
import { DetailedViewCashInHandComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/cash-in-hand/detailed-view-cash-in-hand/detailed-view-cash-in-hand.component';
import { DetailedPoSavingsComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/po-savings/detailed-po-savings/detailed-po-savings.component';
import { DetailedPoMisComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/po-mis-scheme/detailed-po-mis/detailed-po-mis.component';
import { DetailedPpfComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/ppf-scheme/detailed-ppf/detailed-ppf.component';
import { DetailedSsyComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/ssy-scheme/detailed-ssy/detailed-ssy.component';
import { DetailedViewEPSComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-eps/detailed-view-eps/detailed-view-eps.component';
import { DetailedKvpComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/kvp-scheme/detailed-kvp/detailed-kvp.component';
import { DetailedViewGratuityComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-gratuity/detailed-view-gratuity/detailed-view-gratuity.component';
import { DetailedScssComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/scss-scheme/detailed-scss/detailed-scss.component';
import { AccountEntryModule } from './component/protect-component/customers/component/customer/accounts/account.entry.module';
import { AccountCommonModule } from './component/protect-component/customers/component/customer/accounts/account.common.module';
import { CopyDocumentsComponent } from './component/protect-component/customers/component/common-component/copy-documents/copy-documents.component';
import { DetailedViewRealEstateComponent } from './component/protect-component/customers/component/customer/accounts/assets/realEstate/detailed-view-real-estate/detailed-view-real-estate.component';
import { DetaildedViewSuperannuationComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-superannuation/detailded-view-superannuation/detailded-view-superannuation.component';
import { DetailedPoRdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/po-rd-scheme/detailed-po-rd/detailed-po-rd.component';
import { DetailedViewSchemeHoldingComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/detailed-view-scheme-holding/detailed-view-scheme-holding.component';
import { ViewActivityComponent } from './component/protect-component/customers/component/customer/accounts/documents/view-activity/view-activity.component';
// import { MfAllocationsComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/mf-allocations/mf-allocations.component';
import { DetailedViewOtherPayablesComponent } from './component/protect-component/customers/component/customer/accounts/liabilities/detailed-view-other-payables/detailed-view-other-payables.component';
import { AddOtherPayablesComponent } from './component/protect-component/customers/component/customer/accounts/liabilities/add-other-payables/add-other-payables.component';
import { MfAllocationsComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/mf-allocations/mf-allocations.component';
import { AddExpensesComponent } from './component/protect-component/customers/component/common-component/add-expenses/add-expenses.component';
import { KeyInfoComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/key-info/key-info.component';
import { CalculatorsComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/calculators/calculators.component';
import { AddGoalsComponent } from './component/protect-component/customers/component/customer/plan/add-goals/add-goals.component';
import { EditNoteGoalComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/edit-note-goal/edit-note-goal.component';
import { ViewPastnotGoalComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/view-pastnot-goal/view-pastnot-goal.component';
import { AddPlaninsuranceComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/add-planinsurance/add-planinsurance.component';
import { AddSuggestPolicyComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/add-suggest-policy/add-suggest-policy.component';
import { CurrentPolicyComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/current-policy/current-policy.component';
import { SingleGoalYearComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/single-goal-year/single-goal-year.component';
import { AddMutualFundComponent } from './component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from './component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from './component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mfscheme-level-transactions/mfscheme-level-transactions.component';
import { MultiYearGoalComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/multi-year-goal/multi-year-goal.component';
import { SelectAdviceComponent } from './component/protect-component/customers/component/customer/customer-activity/advice-activity/select-advice/select-advice.component';
import { HistoryRiskProfileComponent } from './component/protect-component/customers/component/customer/plan/profile-plan/history-risk-profile/history-risk-profile.component';
import { CustomDirectiveModule } from './common/directives/common-directive.module';
import { AddNomineeComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-nominee/add-nominee.component';
import { AddBudgetComponent } from './component/protect-component/customers/component/common-component/add-budget/add-budget/add-budget.component';
import { RightFilterComponent } from './component/protect-component/customers/component/common-component/right-filter/right-filter.component';
// tslint:disable-next-line:max-line-length
import { FolioMasterDetailsComponent } from './component/protect-component/customers/component/common-component/folio-master-details/folio-master-details.component';
import { SipDetailsComponent } from './component/protect-component/customers/component/common-component/sip-details/sip-details.component';
import { Ng5SliderModule } from 'ng5-slider';
// tslint:disable-next-line:max-line-length
import { DetailedViewNpsComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/detailed-view-nps/detailed-view-nps.component';
import { CommonComponentModule } from './component/protect-component/common-component/common-component.module';
import { OwnerNomineeComponent } from './component/protect-component/common-component/owner-nominee/owner-nominee.component';
// tslint:disable-next-line:max-line-length
import { AddRecommendationsInsuComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/add-recommendations-insu/add-recommendations-insu.component';
// tslint:disable-next-line:max-line-length
import { GetSharebleLinkComponent } from './component/protect-component/customers/component/customer/customer-overview/overview-documents/get-shareble-link/get-shareble-link.component';
// tslint:disable-next-line:max-line-length
import { BottomSheetComponent } from './component/protect-component/customers/component/common-component/bottom-sheet/bottom-sheet.component';
import { CustomCommonModule } from './common/custom.common.module';
import { PreviewComponent } from './component/protect-component/customers/component/customer/customer-overview/overview-documents/preview/preview.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AddHealthInsuranceAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';
import { DetailedViewGeneralInsuranceComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/detailed-view-general-insurance/detailed-view-general-insurance.component';
import { DetailedViewLifeInsuranceComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/detailed-view-life-insurance/detailed-view-life-insurance.component';
import { DatailedViewNpsHoldingsComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/datailed-view-nps-holdings/datailed-view-nps-holdings.component';
import { LoanAmortsComponent } from './component/protect-component/customers/component/customer/accounts/liabilities/loan-amorts/loan-amorts.component';
import { BulkEmailTestComponent } from './component/protect-component/customers/component/customer/accounts/assets/mutual-fund/bulk-email-test/bulk-email-test.component';
import { SendNowReportsComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/send-now-reports/send-now-reports.component';
import { StatusReportComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/status-report/status-report.component';
import { OpenSendReportPopupComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/open-send-report-popup/open-send-report-popup.component';
import { BulkOverviewComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-overview/bulk-overview.component';
import { BulkSummaryComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-summary/bulk-summary.component';
import { BulkAllTransactionsComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-all-transactions/bulk-all-transactions.component';
import { BulkCapitalGainSummaryComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-capital-gain-summary/bulk-capital-gain-summary.component';
import { BulkCapitalGainDetailedComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/bulk-capital-gain-detailed/bulk-capital-gain-detailed.component';
import { RightFilterDuplicateComponent } from './component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import { CustomiseSettingComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/customise-setting/customise-setting.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { VerifiedMailsComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/verified-mails/verified-mails.component';
import { VerifyAddEmailComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/verify-add-email/verify-add-email.component';
import { AlertTitleComponent } from './component/protect-component/AdviserComponent/backOffice/bulk-report-sending/alert-title/alert-title.component';
import { SchemeListComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/scheme-list/scheme-list.component';
import { MfImportCasFileComponent } from './component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mf-import-cas-file/mf-import-cas-file.component';
import { IinCreationLoaderComponent } from './component/protect-component/AdviserComponent/transactions/overview-transactions/IIN/UCC-Creation/submit-review-inn/iin-creation-loader/iin-creation-loader.component';
import { StatusFileUploadComponent } from './component/protect-component/AdviserComponent/backOffice/backoffice-file-upload/status-file-upload/status-file-upload.component';
import { PreviewFinPlanComponent } from './component/protect-component/customers/component/customer/plan/profile-plan/preview-fin-plan/preview-fin-plan.component';
import { AddOthersAssetComponent } from './component/protect-component/customers/component/customer/accounts/assets/others-assets/add-others-asset/add-others-asset.component';
import { DetailedViewInsurancePlanningComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/detailed-view-insurance-planning/detailed-view-insurance-planning.component';
import { DetailedViewOthersAssetComponent } from './component/protect-component/customers/component/customer/accounts/assets/others-assets/detailed-view-others-asset/detailed-view-others-asset.component';
import { SaveFinPlanSectionComponent } from './component/protect-component/customers/component/customer/plan/profile-plan/save-fin-plan-section/save-fin-plan-section.component';
import { AddOthersInsuranceInAssetComponent } from './component/protect-component/customers/component/customer/accounts/insurance/add-others-insurance-in-asset/add-others-insurance-in-asset.component';
import { DialogDetailedViewInsPlanningComponent } from './component/protect-component/customers/component/customer/plan/insurance-plan/dialog-detailed-view-ins-planning/dialog-detailed-view-ins-planning.component';
import { AddDeploymentsComponent } from './component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/sip-cleanup/add-deployments/add-deployments.component';
import { AddSovereignGoldBondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/sovereign-gold-bonds/add-sovereign-gold-bonds/add-sovereign-gold-bonds.component';
import { DetailedViewSovereignGoldBondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/sovereign-gold-bonds/detailed-view-sovereign-gold-bonds/detailed-view-sovereign-gold-bonds.component';
import { OpenmobilePopupComponent } from './component/left-sidebar/leftsidebar/openmobile-popup/openmobile-popup.component';
import { OpenDomainWhiteLabelPopupComponent } from './component/left-sidebar/leftsidebar/open-domain-white-label-popup/open-domain-white-label-popup.component';
import { EmailVerificationPopupComponent } from './component/protect-component/AdviserComponent/setting/setting-preference/email-verification-popup/email-verification-popup.component';
import { OpenGalleryPlanComponent } from './component/protect-component/AdviserComponent/setting/setting-plan/setting-plan/plan-gallery/open-gallery-plan/open-gallery-plan.component';
// tslint:disable-next-line:max-line-length
// import { TransactionAddComponent } from './component/protect-component/AdviserComponent/transactions/transaction-add/transaction-add.component';


export const componentList = [
  AddLiabilitiesComponent,
  AddInsuranceComponent,
  AddRealEstateComponent,
  GoldComponent,
  AddNPSComponent,
  RecuringDepositComponent,
  AddEPFComponent,
  OthersComponent,
  CashInHandComponent,
  BankAccountsComponent,
  HistoryRiskProfileComponent,
  SchemeListComponent,
  NpsSchemeHoldingComponent,
  NpsSummaryPortfolioComponent,
  AddGratuityComponent,
  AddSuperannuationComponent,
  AddEPSComponent,
  AddPpfComponent,
  AddNscComponent,
  AddTransactionComponent,
  AddSsyComponent,
  AddPoTdComponent,
  LiabilitiesDetailComponent,
  LoanAmortsComponent,
  AddKvpComponent,
  AddScssComponent,
  AddPoMisComponent,
  AddPoRdComponent,
  DetailedPpfComponent,
  DetailedNscComponent,
  DetailedSsyComponent,
  DetailedViewEPSComponent,
  DetailedKvpComponent,
  DetailedViewGratuityComponent,
  DetailedScssComponent,
  DetailedViewEPFComponent,
  AddScssComponent,
  AddKvpComponent,
  AddPoSavingComponent,
  AddPoMisComponent,
  AddSsyComponent,
  AddTransactionComponent,
  AddEPSComponent,
  AddSuperannuationComponent,
  AddGratuityComponent,
  AddPoTdComponent,
  BondsComponent,
  AddLiabilitiesComponent,
  AddInsuranceComponent,
  FixedDepositComponent,
  AddRealEstateComponent,
  AddNPSComponent,
  RecuringDepositComponent,
  CustomiseSettingComponent,
  OthersComponent,
  CashInHandComponent,
  BankAccountsComponent,
  NpsSchemeHoldingComponent,
  DetailedViewEPFComponent,
  AddScssComponent,
  AddKvpComponent,
  AddPoSavingComponent,
  AddPoMisComponent,
  AddSsyComponent,
  AddNscComponent,
  AddTransactionComponent,
  AddEPSComponent,
  AddSuperannuationComponent,
  AddGratuityComponent,
  NpsSummaryPortfolioComponent,
  AddPoTdComponent,
  AddPoRdComponent,
  BondsComponent,
  AddLiabilitiesComponent,
  AddInsuranceComponent,
  AddRealEstateComponent,
  AddOthersAssetComponent,
  AddSovereignGoldBondsComponent,
  DetailedViewSovereignGoldBondsComponent,
  AddNPSComponent,
  RecuringDepositComponent,
  OthersComponent,
  CashInHandComponent,
  BankAccountsComponent,
  NpsSchemeHoldingComponent,
  LiabilitiesDetailComponent,
  DetailedViewFixedDepositComponent,
  DetailedViewRecuringDepositComponent,
  DetailedViewBondsComponent,
  DetailedViewGoldComponent,
  DetailedViewOthersComponent,
  DetailedViewBankAccountComponent,
  DetailedViewCashInHandComponent,
  DetailedPoSavingsComponent,
  DetailedPoTdComponent,
  BulkCapitalGainDetailedComponent,
  DetailedPoMisComponent,
  BulkCapitalGainSummaryComponent,
  DetailedViewRealEstateComponent,
  DetaildedViewSuperannuationComponent,
  DatailedViewNpsHoldingsComponent,
  BulkOverviewComponent,
  BulkSummaryComponent,
  BulkAllTransactionsComponent,
  CopyDocumentsComponent,
  GetSharebleLinkComponent,
  OpenSendReportPopupComponent,
  BottomSheetComponent,
  DetailedPoRdComponent,
  AddPlaninsuranceComponent,
  DetailedPoRdComponent,
  DetailedViewSchemeHoldingComponent,
  ViewActivityComponent,
  PreviewComponent,
  DetailedViewOtherPayablesComponent,
  AddOtherPayablesComponent,
  MfAllocationsComponent,
  DetailedPoRdComponent,
  DetailedViewSchemeHoldingComponent,
  KeyInfoComponent,
  AddMutualFundComponent,
  MFSchemeLevelHoldingsComponent,
  MFSchemeLevelTransactionsComponent,
  // EmailAddTaskComponent,
  CalculatorsComponent,
  AddGoalsComponent,
  EditNoteGoalComponent,
  ViewPastnotGoalComponent,
  AddSuggestPolicyComponent,
  AddRecommendationsInsuComponent,
  CurrentPolicyComponent,
  SelectAdviceComponent,
  AddNomineeComponent,
  AddBudgetComponent,
  RightFilterComponent,
  BulkEmailTestComponent,
  SendNowReportsComponent,
  VerifiedMailsComponent,
  AlertTitleComponent,
  VerifyAddEmailComponent,
  StatusReportComponent,
  FolioMasterDetailsComponent,
  SipDetailsComponent,
  SingleGoalYearComponent,
  MultiYearGoalComponent,
  DetailedViewNpsComponent,
  OwnerNomineeComponent,
  AddHealthInsuranceAssetComponent,
  AddPersonalAccidentInAssetComponent,
  AddCriticalIllnessInAssetComponent,
  AddMotorInsuranceInAssetComponent,
  AddTravelInsuranceInAssetComponent,
  AddHomeInsuranceInAssetComponent,
  AddFireAndPerilsInsuranceInAssetComponent,
  AddOthersInsuranceInAssetComponent,
  DetailedViewGeneralInsuranceComponent,
  DetailedViewLifeInsuranceComponent,
  RightFilterDuplicateComponent,
  AddExpensesComponent,
  MfImportCasFileComponent,
  IinCreationLoaderComponent,
  SelectFolioMapComponent,
  StatusFileUploadComponent,
  PreviewFinPlanComponent,
  DetailedViewInsurancePlanningComponent,
  DetailedViewOthersAssetComponent,
  SaveFinPlanSectionComponent,
  DialogDetailedViewInsPlanningComponent,
  AddDeploymentsComponent,
  OpenmobilePopupComponent,
  OpenDomainWhiteLabelPopupComponent,
  EmailVerificationPopupComponent,
  OpenGalleryPlanComponent
  // ComposeEmailComponent
];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    CustomCommonModule,
    // OwnerComponentModule,
    AccountEntryModule,
    AccountCommonModule,
    CustomDirectiveModule,
    Ng5SliderModule, // used in MultiYearGoalComponent
    NgxDocViewerModule,
    NgxMaterialTimepickerModule,

  ],
  exports: [
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [componentList]
})

export class EntryComponentsModule {

  static getComponentList() {
    return componentList;
  }
}
