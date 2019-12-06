export const appConfig = {
  LOGIN: 'secure/login',
  FILE_GET: '/file/list/get',
  RT_FILE_GET: 'file/rt/list/get',
  TOTAL_GET_AUM: 'asset/clientTotalAum/get',
  GET_MIS_DATA: 'asset/mis/get',
  GET_SUBCAT_AUM: 'asset/cat/subcat/get',
  GET_SUBCAT_SCHEME: 'asset/cat/subcat/scheme',
  GET_SUBCAT_SCHEMENAME: 'asset/cat/subcat/scheme',
  GET_TOTAL_SCHEME_AUM: 'asset/schemeTotalAum/get',
  GET_TOTAL_AUM_BY_SCHEME: 'asset/schemeTotalAum/get',
  GET_CLIENT_WISE_TOTALAUM: 'asset/report/client/totalaum/get',
  GET_SIP_COUNT_GET: 'asset/sip/count/get',
  GET_AUM_APPLICANT: 'asset/aum/applicantWise/totalaum/applicantName/get',
  GET_AUM_APPLICANT_CATEGORY: 'asset/aum/applicantWise/totalaum/applicantsAllCategory/get',
  GET_AUM_APPLICANT_SUB_CATEGORY: 'asset/aum/applicantWise/totalaum/applicantSubCategory/get',
  GET_AUM_APPLICANT_SCHEME: 'asset/aum/applicantWise/totalaum/applicantSchemes/get',
  GET_AUM_CLIENT_TOTALAUM: 'asset/aum/client/totalaum/get',
  GET_AUM_CLIENT_SCHEME: 'asset/aum/client/schemes',


  /////////////////////// sip api call//////////////////////////////////

  GET_EXPIRING: 'asset/sip/expiring/get',
  GET_expired: 'asset/sip/expired/get',
  GET_SIP_REJECTION: 'asset/sip/sipRejection/get',
  GET_SIP_client_SEARCH: 'asset/sip/client/search/get',
  GET_SIP_SCHEME_SEARCH: 'asset/sip/scheme/search/get',

  GET_SIP_AMC: 'asset/sip/amc/get',
  GET_SIP_AMC_SCHEME: 'asset/sip/amc/scheme/get',
  GET_SIP_INVERSTORS: 'asset/sip/scheme/investors/get',
  Scheme_Investors_Applicants: 'asset/sip/scheme/investors/applicants/get',
  Sip_Schemewise_Get: 'asset/sip/schemewise/get',
  Scheme_Wise_Investor_Get: 'asset/sip/schemewiseInvestor/get',
  scheme_wise_Applicants_Get: 'asset/sip/schemewiseApplicants/get',

  ///////////////////////////// back office/////////////////////////////////////////////

  AllClient_get: 'asset/allClient/get',
  AllClient_ByName_get: 'asset/allClient/ByName/get',
  AllClient_ByTags_get: 'asset/allClient/ByTags/get',
  Update_expiryDate: 'asset/update/expiryDate',
  Update_Password: 'asset/update/password',
  Fileorder_Status_Report_Get: 'asset/fileorder/status/report/get',

  /////////////////////////////Accounts///////////////////////////////////
  ADD_FIXEDDEPOSIT : 'account/asset/fixed-income/fixed-deposit/add',
  ADD_LIFE_INSURANCE:'account/insurance/life-insurance/add',
  GET_LIFE_INSURANCE:'account/insurance/list/get',
  GET_GLOBAL_INSURANCE:'account/insurance/global-list/get',
  EDIT_LIFE_INSURANCE:'account/insurance/life-insurance/edit',
  GET_INSURANCE_GLOBAL_API:'account/insurance/global/get',
  ADD_LIABILITY:'account/liability/loan/add',
  GET_LIABILITY:'account/liability/loan/list/get',
  EDIT_LIABILITY:'account/liability/loan/edit',
  EDIT_FIXEDDEPOSIT:'account/asset/fixed-income/fixed-deposit/edit',
  GET_LIST_FAMILY_MEMBER:'account/income/family-members/get',
  GET_FIXEDDEPOSIT:'account/asset/fixed-income/fixed-deposit/get',
  GET_RECURING_DEPOSIT:'account/asset/fixed-income/recurring-deposit/list/get',
  GET_BONDS:'account/asset/fixed-income/bond/list/get',
  ADD_RECURRING_DEPOSIT:'account/asset/fixed-income/recurring-deposit/add',
  ADD_BOND:'account/asset/fixed-income/bond/add',
  EDIT_RECURRING_DEPOSIT:'account/asset/fixed-income/recurring-deposit/edit',
  EDIT_BONDS:'account/asset/fixed-income/bond/edit',
  GET_GLOBAl:'account/asset/nps/global-data/get',
  GET_BANK_ACCOUNTS:'account/asset/bank-account/list/get',
  ADD_BANK_ACCOUNTS:'account/asset/bank-account/add',
  EDIT_BANK_ACCOUNTS:'account/asset/bank-account/edit',
  GET_CASH_IN_HAND:'account/asset/cash-in-hand/list/get',
  ADD_CASH_IN_HAND:'account/asset/cash-in-hand/add',
  EDIT_CASH_IN_HAND:'account/asset/cash-in-hand/edit',
  GET_GOLD:'account/asset/commodity/gold/list/get',
  ADD_GOLD:'account/asset/commodity/gold/add',
  EDIT_GOLD:'account/asset/commodity/gold/edit',
  GET_OTHERS:'account/asset/commodity/other/list/get',
  ADD_OTHERS:'account/asset/commodity/other/add',
  EDIT_OTHERS:'account/asset/commodity/other/edit',
  GET_ASSET_SMALL_SAVING_SCHEME_PPF:'account/asset/ssc/ppf/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_NSC:'account/asset/ssc/nsc/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_SSY:'account/asset/ssc/ssy/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_KVP:'account/asset/ssc/kvp/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_SCSS:'account/asset/ssc/scss/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_POSAVING:'account/asset/saving-scheme/po-saving/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_PO_RD:'account/asset/ssc/po-rd/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_PO_TD:'account/asset/ssc/po-td/list/get',
  GET_ASSET_SMALL_SAVING_SCHEME_PO_MIS:'account/asset/ssc/po-mis/list/get',
  ADD_OTHER_PAYABLES:'account/liability/otherpayables/add',
  EDIT_OTHER_PAYABLES:'account/liability/otherpayables/edit',
  ADD_REAL_ESTATE:'account/asset/real-estate/add',
  EDIT_REAL_ESTATE:'account/asset/real-estate/edit',
  ADD_PPF_SCHEME:'account/asset/saving-scheme/ppf/add',
  ADD_NSC_SCHEME:'account/asset/saving-scheme/nsc/add',
  ADD_SSY_SCHEME:'account/asset/saving-scheme/ssy/add',
  ADD_SCSS_SCHEME:'account/asset/saving-scheme/scss/add',
  ADD_PO_SAVING:'account/asset/saving-scheme/po-saving/add',
  ADD_PO_RD_SCHEME:'account/asset/saving-scheme/pord/add',
  EDIT_NSC_SCHEME:'account/asset/saving-scheme/nsc/edit',
  EDIT_SSY_SCHEME:'account/asset/saving-scheme/ssy/edit',
  EDIT_SCSS_SCHEME:'account/asset/saving-scheme/scss/edit',
  EDIT_POSAVING_SCHEME:'account/asset/saving-scheme/po-saving/edit',
  ADD_POMIS:'account/asset/saving-scheme/pomis/add',
  EDIT_POMIS:'account/asset/saving-scheme/pomis/edit',
  EDIT_PPF_SCHEME:'account/asset/saving-scheme/ppf/edit',
  ADD_KVP_SCHEME:'account/asset/saving-scheme/kvs/add',
  EDIT_KVP_SCHEME:'account/asset/saving-scheme/kvs/edit',
  EDIT_PORD_SCHEME:'account/asset/saving-scheme/pord/edit',
  ADD_POTD_SCHEME:'account/asset/saving-scheme/potd/add',
  EDIT_POTD_SCHEME:'account/asset/saving-scheme/potd/edit',
  GET_ASSET_COUNT_GLOBAL_DATA:'account/asset/count/list',
  DELETE_PPF_SCHEME:'account/asset/saving-scheme/ppf/delete',
  DELETE_NSC_SCHEME:'account/asset/saving-scheme/nsc/delete',
  DELETE_SSY_SCHEME:'account/asset/saving-scheme/ssy/delete',
  DELETE_KVP_SCHEME:'account/asset/saving-scheme/kvs/delete',
  DELETE_SCSS_SCHEME:'account/asset/saving-scheme/scss/delete',
  DELETE_POSAVING_SCHEME:'account/asset/saving-scheme/po-saving/delete',
  DELETE_PORD_SCHEME:'account/asset/saving-scheme/pord/delete',
  DELETE_POTD_SCHEME:'account/asset/saving-scheme/potd/delete',
  DELETE_POMIS_SCHEME:'account/asset/saving-scheme/pomis/delete',
  GET_POLICY_NAME:'account/insurance/policy-list/get',
  DELETE_INSURANCE:'account/insurance/life-insurance/delete',
  DELETE_REAL_ESTATE:'account/asset/real-estate/delete',
  DELETE_OTHER_PAYABLES:'account/liability/otherpayables/delete',
  DELETE_LIABILITIES:'/account/liability/loan/delete',
  GET_ALL_FILES:'document/account/document/all-file/get',
  DOWNLOAD_FILE:'document/account/document/all-file/file/get',
  DELETE_FILE:'document/account/document/all-file/file/trash',
  MOVE_FILES:'document/account/document/all-file/file/move',
  MOVE_FOLDER:'document/account/document/all-file/folder/move',
  COPY_FILES:'document/account/document/all-file/file/copy',
  RENAME_FILE:'document/account/document/all-file/file/rename',
  RENAME_FOLDER:'document/account/document/all-file/folder/rename',
  DELETE_FOLDER:'document/account/document/all-file/folder/trash',
  STAR_FILE:'document/document/all-file/star',
  VIEW_ACTIVITY_FILE:'document/account/document/all-file/file/view-activity/get',
  VIEW_ACTIVITY_FOLDER:'document/account/document/all-file/folder/view-activity/get',
  DELETE_FIXED_DEPOSITE:'account/asset/fixed-income/fixed-deposit/delete',
  DELETE_RECURRING_DEPOSITE:'account/asset/fixed-income/recurring-deposit/delete',
  DELETE_BOND:'account/asset/fixed-income/bond/delete',
  DELETE_EPF:'account/asset/retirement/epf/delete',
  DELETE_NPS:'account/asset/retirement/nps/delete',
  DELETE_GRATUITY:'account/asset/retirement/gratuity/delete',
  DELETE_SUPERANNUATION:'account/asset/retirement/superannuation/delete',
  DELETE_EPS:'account/asset/retirement/eps/delete',
  DELETE_BANKACCOUNT:'account/asset/bank-account/delete',
  DELETE_CASHINHAND:'account/asset/cash-in-hand/delete',
  DELETE_GOLD:'account/asset/commodity/gold/delete',
  DELETE_OTHERS:'account/asset/commodity/other/delete',
  GLOBAL_LIABILITIES:'account/liability/global/get',
  UPLOAD_FILE:'document/account/document/all-file/file/put',
  NEW_FOLDER:'document/account/document/all-file/folder/post',
  ////////////////////////////// subscription////////////////////////////////////////////
  GET_REAL_ESTATE: 'account/asset/real-estate/get',
  GET_EPF: 'account/asset/retirement/epf/list/get',
  ADD_EPF: 'account/asset/retirement/epf/add',
  EDIT_EPF: 'account/asset/retirement/epf/edit',
  GET_NPS: 'account/asset/retirement/nps/list/get',
  ADD_NPS: 'account/asset/retirement/nps/add',
  EDIT_NPS: 'account/asset/retirement/nps/edit',
  GET_GRATUITY: 'account/asset/retirement/gratuity/list/get',
  ADD_GRATUITY: 'account/asset/retirement/gratuity/add',
  EDIT_GRATUITY: 'account/asset/retirement/gratuity/edit',
  GET_SUPERANNUATION: 'account/asset/retirement/superannuation/list/get',
  ADD_SUPERANNUATION: 'account/asset/retirement/superannuation/add',
  EDIT_SUPERANNUATION: 'account/asset/retirement/superannuation/edit',
  GET_EPS: 'account/asset/retirement/eps/list/get',
  ADD_EPS: 'account/asset/retirement/eps/add',
  EDIT_EPS: 'account/asset/retirement/eps/edit',
  OTHER_PAYABLES: 'account/liability/otherpayables/get',

  ////////////////////////////// subscription////////////////////////////////////////////


  GET_SUBSCRIPTION_INVOICE: 'subscription/invoice/get',
  // GET_SINGLE_INVOICE:'subscription/invoice/get',
  GET_PREFERENCE_BILLER_PROFILE: 'subscription/billerprofile/get',
  GET_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION: 'subscription/setting/prefix/get',
  UPDATE_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION: 'subscription/setting/prefix/update',
  PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION_SAVE: 'subscription/setting/prefix/save',
  SAVE_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION: 'subscription/setting/billerprofile/save',
  DASHBOARD_LETS_BEGIN_SUBSCRIPTION: 'subscription/dashboard/record/payment/add',
  GET_CLIENT_SUBSCRIPTION_LIST: 'subscription/client/get',
  GET_CLIENT_SUBSCRIPTION_QUOTATIONS_LIST: 'subscription/client/quotation/get',
  GET_CLIENT_SUBSCRIPTION_INVOICES_LIST: 'subscription/client/invoice/get',
  GET_CLIENT_SUBSCRIPTION_SETTING_PROFILE: 'subscription/client/setting/profile/get',
  GET_SUBSCRIPTION_QUOTATIONS: 'subscription/quotation/get',
  UPDATE_SUBSCRIPTION_QUOTATIONS: 'subscription/quotation/edit',
  GET_SUBSCRIPTION_SUBSCRIPTION: 'subscription/subscription/get',
  GET_SUBSCRIPTION_PLAN_SERVICE: 'subscription/setting/plan-services/get',
  ADD_SETTING_PLAN_OVERVIEW: 'subscription/plan/add',
  MAP_SERVICE_TO_PLAN: 'subscription/setting/plan/mapservice',
  MAP_DOCUMENTS_TO_PLAN: 'subscription/setting/plan/map/document',
  GET_PLAN_DOCUMENTS_DATA: 'subscription/setting/plan-document/get',
  GET_DOCUMENT_COUNT_SIGNED: 'subscription/document/analytics/get',
  GET_CLIENT_WITH_SCRIPTION: 'subscription/analytics/get',
  GET_INVOICE_TO_BE_REVIEWED: 'subscription/invoice/review/get',
  GET_SUB_SUMMARY: 'subscription/dashboard/summary/get',
  FILTER_SUBCRIPTION: 'subscription/subscription/filtered/get',
  DASHBOARD_SUBSCRIPTION_LETS_BEGIN: 'subscription/lets-begin/get',
  CANCEL_SUBSCRIPTION: 'subscription/cancelled/subscription/update',
  DELETE_SUBSCRIPTION: 'subscription/subscription/deleted/update',
  DELETE_CLIENT_PROFILE_FROM_SUBSCRIPTION_SETTING: 'subscription/setting/clientbillerprofile/delete',
  SAVE_BILLER_PROFILE_SETTING: 'subscription/setting/billerprofile/save',
  UPDATE_BILLER_PROFILE_SETTING: 'subscription/setting/billerprofile/update',
  GET_SUBSCRIPTION_PLAN_SETTING: 'subscription/setting/plan/get',
  GET_SUBSCRIPTION_SERVICE_SETTING: 'subscription/setting/service/get',
  CREATE_SERVICE_SETTING: 'subscription/service/create',
  DELETE_SUBSCRIPTION_PLAN: 'subscription/plan/delete',
  GET_PLAN_MAPPED_TO_ADVISOR: 'subscription/plan/mapped-to/advisor/get',
  GET_SUBSCRIPTION_DOCUMENTS_SETTING: 'subscription/setting/document/get',
  GET_MAP_DOCUMENT_To_SERVICE: 'subscription/mapped/document/service/get',
  ADD_CLIENT_BILLER_PROFILE: 'subscription/client/biller/profile/add',
  ADD_SETTING_DOCUMENT: 'subscription/document/add',
  GET_PLAN_OF_ADVISOR_CLIENT: 'subscription/plans/of/advisor/get',
  GET_PLAN_INVOICE: 'subscription/invoice/get',
  CREATE_SUBSCRIPTION: 'subscription/client/subscription/add',
  EDIT_PAYEE_SETTINGS: 'subscription/client/setting/profile/update',
  MAP_PLAN_TO_SERVICE_SETTING: 'subscription/map/plan/service',
  UPDATE_INVOICE: 'subscription/invoice/edit',
  CHANGE_PAYEE_SETTING: 'subscription/client-biller/setting/subscription/update',
  CHANGE_BILLER_SETTING: 'subscription/change/biller-setting/subscription',
  EDIT_PLAN_SETTING: 'subscription/plan/edit',
  GET_SERVICE_MODULE: 'subscription/service/module/get',
  MAP_MODULE_TO_PLANS: 'subscription/subscription/service/module-list/edit',
  GET_BILLER_PROFILE: 'subscription/biller/profiles/get',
  GET_SERVICES_LIST: 'subscription/invoice-service/get',
  ADD_INVOICE: 'subscription/invoice/manual/add',
  GET_PAYEE_PROFILE: 'subscription/client-biller/profiles/get',
  SET_AS_PRIMARY: 'subscription/client/setting/profile/setprimary',
  MAP_DOCUMENTS_TO_SERVICE: 'subscription/mapped/document/service/insert',
  GET_DATA_FOR_CREATE_SERVICE: 'subscription/service/create/details/get',
  EDIT_FEE_MODIFY_STRUCTURE: 'subscription/client/subscription/fees/edit',
  GET_SUBSCRIPTION_START_DATA: 'subscription/start/subscription/detail/get',
  GET_DOCUMENT_GET: 'subscription/document/get',
  GET_DOCUMENT_UPDATE: 'subscription/document/edit',
  GET_EMAIL_TEMPLATE: 'subscription/email-template/list/get',
  EDIT_EMAIL_TEMPLATE: 'subscription/email-template/edit',
  START_SUBSCRIPTION: 'subscription/client/subscription/start',
  DELETE_SERVICE: 'subscription/service/delete',
  GET_CLIENTLIST: 'subscription/invoice/payees/get',
  SET_PRIMARY_BILLER: 'subscription/setting/billerprofile/setprimary',
  GET_PAYMENT_RECEIVE: 'subscription/invoice/payment/received/list/get',
  EDIT_PAYMENT_RECEIVE: 'subscription/invoice/payment/received/edit',
  GET_TEMPLATE: 'subscription/emailtemplate/get',
  GET_EMAIL_TEMPLATE_FILTER: 'subscription/emailtemplate/get',
  GET_DOCUMENT_MAPPED_PLAN: 'subscription/document/plan/map/get',
  GET_DOCUMENT_MAPPED_SERVICE: 'subscription/document/service/map/get',
  GET_TOTAL_SALE_RECIVED: 'subscription/dashboard/totalsales/feerecieved/get',
  DELETE_SUB_SETTING_BILLER_PROFILE: 'subscription/setting/billerprofile/delete',
  GET_BASE_64: 'api/v1/test/base64/decode',

   
  // Plan Module
  
  GET_INCOME_LIST:'account/income/get',
  ADD_INCOME_LIST:'account/income/add',
  EDIT_INCOME_LIST:'account/income/edit',
  GET_GLOBAL_GROWTH_RATE:'account/income/growth/rate/global/get',
  DELETE_INCOME:'account/income/delete?'
};
