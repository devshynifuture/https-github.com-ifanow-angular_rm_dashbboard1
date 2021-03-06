import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { SubscriptionService } from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EnumServiceService } from './enum-service.service';
import { OnlineTransactionService } from '../component/protect-component/AdviserComponent/transactions/online-transaction.service';
import { AuthService } from '../auth-service/authService';
import { CustomerService } from '../component/protect-component/customers/component/customer/customer.service';
import { OrgSettingServiceService } from '../component/protect-component/AdviserComponent/setting/org-setting-service.service';
import { PeopleService } from '../component/protect-component/PeopleComponent/people.service';
import { SubscriptionInject } from '../component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { apiConfig } from '../config/main-config';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnumDataService {

  constructor(private enumService: EnumServiceService, private subService: SubscriptionService,
    private onlineTransactionService: OnlineTransactionService, private custumService: CustomerService,
    private orgSettingService: OrgSettingServiceService, private peopleService: PeopleService,
    private subInject: SubscriptionInject) {
    this.enumService.setAssetShortForms(this.cashflowAssetNaming);
  }

  maxBankAccountLength = 18;
  PRODUCTION = apiConfig.PRODUCTION;
  MARKET_SUMMARY = apiConfig.MARKET_PLACE;
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

  cashflowAssetNaming = [
    { assetName: 'ASSETS', assetType: 1, assetShortName: 'Asset' },
    { assetShortName: 'Liabilities', assetName: 'LIABILITIES', assetType: 2 },
    { assetShortName: 'LI', assetName: 'LIFE_INSURANCE', assetType: 3 },
    { assetShortName: 'GI', assetName: 'GENERAL_INSURANCE', assetType: 4 },
    { assetShortName: 'MF', assetName: 'MUTUAL_FUNDS', assetType: 5 },
    { assetShortName: 'Stocks', assetName: 'STOCKS', assetType: 6 },
    { assetShortName: '', assetName: 'FIXED_INCOME', assetType: 7 },
    { assetShortName: 'Real estate', assetName: 'REAL_ESTATE', assetType: 8 },
    { assetShortName: '', assetName: 'RETIREMENT_ACCOUNTS', assetType: 9 },
    { assetShortName: '', assetName: 'SMALL_SAVING_SCHEMES', assetType: 10 },
    { assetShortName: '', assetName: 'CASH_AND_BANKS', assetType: 11 },
    { assetShortName: '', assetName: 'COMMODITIES', assetType: 12 },
    { assetShortName: 'FD', assetName: 'FIXED_DEPOSIT', assetType: 13 },
    { assetShortName: 'RD', assetName: 'RECURRING_DEPOSIT', assetType: 14 },
    { assetShortName: 'Bonds', assetName: 'BONDS', assetType: 15 },
    { assetShortName: 'EPF', assetName: 'EPF', assetType: 16 },
    { assetShortName: 'NPS', assetName: 'NPS', assetType: 17 },
    { assetShortName: 'Gratuity', assetName: 'GRATUITY', assetType: 18 },
    { assetShortName: 'FD', assetName: 'SUPERANNUATION', assetType: 19 },
    { assetShortName: 'EPS', assetName: 'EPS', assetType: 20 },
    { assetShortName: 'PPF', assetName: 'PPF', assetType: 21 },
    { assetShortName: 'NSC', assetName: 'NSC', assetType: 22 },
    { assetShortName: 'SSY', assetName: 'SSY', assetType: 23 },
    { assetShortName: 'KVP', assetName: 'KVP', assetType: 24 },
    { assetShortName: 'SCSS', assetName: 'SCSS', assetType: 25 },
    { assetShortName: 'PO savings', assetName: 'PO_SAVINGS', assetType: 26 },
    { assetShortName: 'PO RD', assetName: 'PO_RD', assetType: 27 },
    { assetShortName: 'PO TD', assetName: 'PO_TD', assetType: 28 },
    { assetShortName: 'PO MIS', assetName: 'PO_MIS', assetType: 29 },
    { assetShortName: 'Bank accounts', assetName: 'BANK_ACCOUNTS', assetType: 30 },
    { assetShortName: 'Cash', assetName: 'CASH_IN_HAND', assetType: 31 },
    { assetShortName: 'Gold', assetName: 'GOLD', assetType: 32 },
    { assetShortName: 'Others', assetName: 'Others', assetType: 33 },
  ];
  accountTypes: any;
  accountViewTypes = new Subject();
  accountTypeMap: any = {};

  relationshipList: any;

  bankList: any = [];
  advisorId: any;
  clientData: any;
  userData: any;

  clientFamilybankList: any = [];
  getAll: boolean;

  getAccountList(userData) {
    const self = this;
    self.getAll = false;
    if (userData != null) {
      self.userData = userData;
    }
    if (userData) {
      this.getDematList(userData)
      userData.forEach(u => {
        if (u.familyMemberAge < 18) {
          self.getAll = true;
        }
      });
    }

    return new Promise(function (resolve, reject) {
      // this.advisorId = AuthService.getAdvisorId();
      // this.clientData = AuthService.getClientData();
      if (self.getAll) {
        // let self = this;
        self.clientData = AuthService.getClientData();
        const obj = {
          clientId: self.clientData.clientId
        };
        self.custumService.getclientFamilybankList(obj).subscribe(
          (data) => {
            self.bankList = data;
            resolve(data);
            self.enumService.addBank(self.bankList);
          },
          (err) => {
            reject('failed');
          });
      } else {
        let obj = [];
        if (userData) {
          userData.forEach(u => {
            let user = {
              userId: u.id == 0 ? u.clientId : u.id,
              userType: u.userType
            };
            obj.push(user);
          });
        }


        self.custumService.getJointBankList(obj).subscribe(
          (data) => {
            self.bankList = data;
            // self.getJointAccounts(obj)
            resolve(self.bankList);
            self.enumService.addBank(self.bankList);
          },
          (err) => {
            reject('failed');
          }
        );
      }
    });
  }

  getDematList(data) {

    const obj = {
      userId: data[0].clientId,
      userType: data[0].userType
    };
    this.custumService.getDematList(obj).subscribe(
      data => {
        if (data != 0) {
          this.enumService.addDematBank(data);
        }
        else {
          this.enumService.addDematBank([]);
        }
      }, err => {

        console.error(err);
      }
    );
  }

  getDematDetail(data) {
    let self = this;
    return new Promise(function (resolve, reject) {
      const obj = {
        userId: data[0].clientId,
        userType: data[0].userType
      };
      self.custumService.getDematList(obj).subscribe(
        data => {
          if (data != 0) {
            resolve(data)
          }
          else {
            resolve([])
          }
        }, err => {
          reject(err);
          // console.error(err);
        }
      );

    })
  }
  // getJointAccounts(obj){
  //   this.custumService.getJointBankList(obj).subscribe(
  //     (data) => {
  //       data.forEach(b => {
  //         this.bankList.push(b);
  //       });
  // resolve(data);
  // self.enumService.addBank(self.bankList);
  //     },
  //     (err) => {
  //       // reject('failed');
  //     }
  //   );
  // }
  getclientFamilybankList() {
    const self = this;
    this.clientData = AuthService.getClientData();
    const obj = {
      clientId: this.clientData.clientId
    };
    self.custumService.getclientFamilybankList(obj).subscribe(
      (data) => {
        self.clientFamilybankList = data;
        self.enumService.addclientFamilyBanks(self.clientFamilybankList);
      },
      (err) => {

      });
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
      }, err => {
        this.getClientRole();
      }
    );
  }

  searchClientList() {
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.peopleService.getClientSearch(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.setSearchData(data);
          this.subInject.addSingleProfile(data);
        }
      },
    );
  }

  setBankAccountTypes() {
    if (this.accountTypeMap.lastSyncTime) {
      const difference = new Date().getTime() - this.accountTypeMap.lastSyncTime;
      if (difference < 86400000) {
        return;
      }
    }
    const obj = {};
    this.peopleService.getbankAccountTypes(obj).subscribe(
      data => {
        if (data) {
          data.forEach(element => {
            if (element.id == 1 || element.id == 2 || element.id == 5) {
              element.name = this.toCamelCase(element.name);
            }
          });
          this.accountTypes = data;
          this.accountViewTypes.next([...this.accountTypes])
        }
      }
    );
  }

  toCamelCase(str) {
    return str.toLowerCase().replace(/(?:(^.)|(\s+.))/g, function (match) {
      return match.charAt(match.length - 1).toUpperCase();
    });
  }

  setRelationShipStatus() {
    const obj = {};
    this.peopleService.getRelationShipStatusList(obj).subscribe(
      data => {
        if (data) {
          this.relationshipList = data;
        }
      }
    );
  }

  getBankAccountTypes() {
    return this.accountTypes;
  }

  getBankAccountViewTypes() {
    return this.accountViewTypes.asObservable();
  }

  getRelationshipStatus() {
    return this.relationshipList;
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
    if (this.searchData && this.searchData.length > 0) {
      return this.searchData.filter(state => state.name.toLowerCase().includes(filterValue));
    }
  }

  getEmptySearchStateData() {
    return this.searchData;
  }

  public getBank() {
    if (this.bankList && this.bankList.length <= 0) {
      this.getAccountList(null);
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
