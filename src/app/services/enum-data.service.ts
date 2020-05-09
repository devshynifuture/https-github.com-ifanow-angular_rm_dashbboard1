import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {SubscriptionService} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import {EnumServiceService} from './enum-service.service';
import {OnlineTransactionService} from '../component/protect-component/AdviserComponent/transactions/online-transaction.service';
import {AuthService} from '../auth-service/authService';
import {CustomerService} from '../component/protect-component/customers/component/customer/customer.service';
import {OrgSettingServiceService} from '../component/protect-component/AdviserComponent/setting/org-setting-service.service';
import {PeopleService} from '../component/protect-component/PeopleComponent/people.service';

@Injectable({
  providedIn: 'root'
})
export class EnumDataService {
  searchData: any;

  proofType = [
    {proofId: 1, proofType: 'Personal Pan'},
    {proofId: 2, proofType: 'Company Pan'},
    {proofId: 3, proofType: 'Passport'},
    {proofId: 4, proofType: 'Aadhaar'},
    {proofId: 5, proofType: 'Driving licence'},
    {proofId: 6, proofType: 'Voter\'s ID card'},
    {proofId: 7, proofType: 'NREGA job card'},
    {proofId: 8, proofType: 'Bank passbook'},
    {proofId: 9, proofType: 'Bank Statement'},
    {proofId: 10, proofType: 'cancel cheque'},
    {proofId: 11, proofType: 'others'},
  ];
  roleList = [
    {roleTypeId: 1, roleTypeName: 'Admin'},
    {roleTypeId: 2, roleTypeName: 'Para planner'},
    {roleTypeId: 3, roleTypeName: 'Relationship manager'},
    {roleTypeId: 4, roleTypeName: 'Operations'},
  ];

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
    this.orgSettingService.getUserRoles(obj).subscribe(
      data => {
        console.log(data);
        this.enumService.addClientRole(data);
      }
    );
  }

  searchClientAndFamilymember() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: '%'
    };
    this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
      this.setSearchData(responseArray);
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

  getSearchData(value) {
    const filterValue = value.toLowerCase();
    return this.searchData.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
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
    const obj = {tpUserCredentialId: 192, bseUserId: 0};
    this.onlineTransactionService.getTaxMasterData(obj).subscribe(
      data => {

        if (data) {
          const taxStatusMap: any = {};
          const individualTaxList = [];
          const corporateTaxList = [];
          const minorTaxList = [];
          data.forEach(singleData => {
            if (singleData.corporateFlag === 1) {
              corporateTaxList.push(singleData);
              // corporateTaxList.
            } else if (singleData.minorFlag === 1) {
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
