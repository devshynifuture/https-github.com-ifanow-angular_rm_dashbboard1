import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { SubscriptionService } from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EnumServiceService } from './enum-service.service';
import { OnlineTransactionService } from '../component/protect-component/AdviserComponent/transactions/online-transaction.service';
import { AuthService } from '../auth-service/authService';
import { CustomerService } from '../component/protect-component/customers/component/customer/customer.service';
import { OrgSettingServiceService } from '../component/protect-component/AdviserComponent/setting/org-setting-service.service';
import { PeopleService } from '../component/protect-component/PeopleComponent/people.service';

@Injectable({
  providedIn: 'root'
})
export class EnumDataService {
  searchData: any;
  clientAndFamilyData: any = [];
  proofType = [
    { proofId: 1, proofType: 'Personal Pan' },
    { proofId: 2, proofType: 'Company Pan' },
    { proofId: 3, proofType: 'Passport' },
    { proofId: 4, proofType: 'Aadhaar' },
    { proofId: 5, proofType: 'Driving licence' },
    { proofId: 6, proofType: 'Voter\'s ID card' },
    { proofId: 7, proofType: 'NREGA job card' }
  ];
  roleList = [
    { roleTypeId: 1, roleTypeName: 'Admin' },
    { roleTypeId: 2, roleTypeName: 'Para planner' },
    { roleTypeId: 3, roleTypeName: 'Relationship manager' },
    { roleTypeId: 4, roleTypeName: 'Operations' },
  ];

  assetTypeSortForms = [
    {assetName: 'ASSETS', assetType: 1, assetShortName: 'Asset'},
    {assetName: 'LIABILITIES', assetType: 2, assetShortName: 'Li'},
    {assetName: 'LIFE_INSURANCE', assetType: 3, assetShortName: ''},
    {assetName: 'GENERAL_INSURANCE', assetType: 4, assetShortName: ''},
    {assetName: 'MUTUAL_FUNDS', assetType: 5, assetShortName: ''},
    {assetName: 'STOCKS', assetType: 6, assetShortName: ''},
    {assetName: 'FIXED_INCOME', assetType: 7, assetShortName: ''},
    {assetName: 'REAL_ESTATE', assetType: 8, assetShortName: ''},
    {assetName: 'RETIREMENT_ACCOUNTS', assetType: 9, assetShortName: ''},
    {assetName: 'SMALL_SAVING_SCHEMES', assetType: 10, assetShortName: ''},
    {assetName: 'CASH_AND_BANKS', assetType: 11, assetShortName: ''},
    {assetName: 'COMMODITIES', assetType: 12, assetShortName: ''},
    {assetName: 'FIXED_DEPOSIT', assetType: 13, assetShortName: ''},
    {assetName: 'RECURRING_DEPOSIT', assetType: 14, assetShortName: ''},
    {assetName: 'BONDS', assetType: 15, assetShortName: ''},
    {assetName: 'EPF', assetType: 16, assetShortName: ''},
    {assetName: 'NPS', assetType: 17, assetShortName: ''},
    {assetName: 'GRATUITY', assetType: 18, assetShortName: ''},
    {assetName: 'SUPERANNUATION', assetType: 19, assetShortName: ''},
    {assetName: 'EPS', assetType: 20, assetShortName: ''},
    {assetName: 'PPF', assetType: 21, assetShortName: ''},
    {assetName: 'NSC', assetType: 22, assetShortName: ''},
    {assetName: 'SSY', assetType: 23, assetShortName: ''},
    {assetName: 'KVP', assetType: 24, assetShortName: ''},
    {assetName: 'SCSS', assetType: 25, assetShortName: ''},
    {assetName: 'PO_SAVINGS', assetType: 26, assetShortName: ''},
    {assetName: 'PO_RD', assetType: 27, assetShortName: ''},
    {assetName: 'PO_TD', assetType: 28, assetShortName: ''},
    {assetName: 'PO_MIS', assetType: 29, assetShortName: ''},
    {assetName: 'BANK_ACCOUNTS', assetType: 30, assetShortName: ''},
    {assetName: 'CASH_IN_HAND', assetType: 31, assetShortName: ''},
    {assetName: 'GOLD', assetType: 32, assetShortName: ''},
    {assetName: 'Others', assetType: 33, assetShortName: ''},
  ]

  constructor(private enumService: EnumServiceService, private subService: SubscriptionService,
    private onlineTransactionService: OnlineTransactionService, private custumService: CustomerService,
    private orgSettingService: OrgSettingServiceService, private peopleService: PeopleService) {
  }

  // clientRoleList = [
  //   { clientRoleId: 1, clientRoleName: 'Mutual Fund (MF) only' },
  //   { clientRoleId: 2, clientRoleName: 'MF + Multi asset' },
  //   { clientRoleId: 3, clientRoleName: 'MF + Multi asset + Basic Plan' },
  //   { clientRoleId: 4, clientRoleName: 'MF + Multi asset + Advanced Plan' },
  // ];

  bankList: any = [];
  advisorId: any;
  clientData: any;

  getAccountList() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getClientData();

    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientData.clientId
    };
    this.custumService.getBankAccount(obj).subscribe(
      (data) => {
        this.bankList = data;
        this.enumService.addBank(this.bankList);
      }
    );
  }

  public getProofType() {
    this.enumService.proofType(this.proofType);
  }

  public getRoles() {
    this.enumService.addRoles(this.roleList);
  }

  public getClientRole() {
    const obj = {
      advisorId: AuthService.getAdvisorId()
    };
    this.orgSettingService.getClientUserRoles(obj).subscribe(
      data => {
        console.log(data);
        this.enumService.addClientRole(data);
      }
    );
  }

  searchClientList() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.peopleService.getClientSearch(obj).subscribe(
      data => {
        if (data) {
          this.setSearchData(data);
        }
      },
    );
  }

  searchClientAndFamilyMember() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
      this.setClientAndFamilyData(responseArray);
    }, error => {
      console.log('getFamilyMemberListRes error : ', error);
    });
  }

  setSearchData(data) {
    console.log(data);
    if (data) {
      this.searchData = data;
    }
  }

  setClientAndFamilyData(data) {
    console.log(data);
    if (data) {
      this.clientAndFamilyData = data;
    }
  }

  getClientAndFamilyData(value) {
    const filterValue = value.toLowerCase();
    return this.clientAndFamilyData.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  getClientSearchData(value) {
    const filterValue = value.toLowerCase();
    return this.searchData.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  getEmptySearchStateData() {
    return this.searchData;
  }

  public getBank() {
    if (this.bankList && this.bankList.length <= 0) {
      this.getAccountList();
    } else {
      this.enumService.addBank(this.bankList);
    }
  }


  public getDataForSubscriptionEnumService() {
    const obj = {};
    this.subService.getDataForCreateService(obj).subscribe(
      data => {
        const newJsonForConsumption = {
          billingMode: [],
          assetTypes: [],
          feeTypes: [],
          billingNature: [],
          otherAssetTypes: [],
          feeCollectionMode: [],
        };
        newJsonForConsumption.billingNature = UtilService.convertObjectToArray(data.billingNature);
        newJsonForConsumption.otherAssetTypes = UtilService.convertObjectToCustomArray(data.otherAssetTypes,
          'subAssetClassName', 'subAssetClassId');
        newJsonForConsumption.feeTypes = UtilService.convertObjectToArray(data.feeTypes);
        newJsonForConsumption.assetTypes = UtilService.convertObjectToArray(data.assetTypes);
        newJsonForConsumption.billingMode = UtilService.convertObjectToArray(data.billingMode);
        newJsonForConsumption.feeCollectionMode = UtilService.convertObjectToArray(data.paymentModes);

        this.enumService.addToGlobalEnumData(newJsonForConsumption);

      }
    );
  }

  public getDataForTaxMasterService() {
    const obj = {};
    this.onlineTransactionService.getTaxMasterData(obj).subscribe(
      data => {

        if (data) {
          const taxStatusMap: any = {};
          const individualTaxList = [];
          const corporateTaxList = [];
          const minorTaxList = [];
          data.forEach(singleData => {
            if (singleData.corporateFlag) {
              corporateTaxList.push(singleData);
              // corporateTaxList.
            } else if (singleData.minorFlag) {
              minorTaxList.push(singleData);
            } else {
              individualTaxList.push(singleData);
            }
            taxStatusMap[singleData.taxStatusCode] = singleData;
          });
          const output = {
            taxStatusList: data,
            taxStatusMap,
            corporateTaxList,
            individualTaxList,
            minorTaxList
          };
          this.enumService.addToGlobalEnumData(output);

        }
      }, error => {
        console.error('error of', error);
      });
  }
}
