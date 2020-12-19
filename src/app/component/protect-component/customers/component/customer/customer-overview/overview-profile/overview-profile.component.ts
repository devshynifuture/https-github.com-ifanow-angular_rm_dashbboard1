import {Component, OnInit} from '@angular/core';
import {AddFamilyMemberComponent} from './add-family-member/add-family-member.component';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {HistoryViewComponent} from './history-view/history-view.component';
import {AddClientComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/add-client.component';
import {CustomerService} from '../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {AuthService} from 'src/app/auth-service/authService';
import {ClientAddressComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-address/client-address.component';
import {ClientDematComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-demat/client-demat.component';
import {ClientBankComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-bank/client-bank.component';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {EnumDataService} from 'src/app/services/enum-data.service';
import {ActivatedRoute} from '@angular/router';
import {CancelFlagService} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-service/cancel-flag.service';
import {UpdateClientProfileComponent} from './update-client-profile/update-client-profile.component';
import {AgePopupComponent} from './age-popup/age-popup.component';
import {ClientSggestionListService} from './client-sggestion-list.service';
import {ResetClientPasswordComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/reset-client-password/reset-client-password.component';

@Component({
  selector: 'app-overview-profile',
  templateUrl: './overview-profile.component.html',
  styleUrls: ['./overview-profile.component.scss']
})
export class OverviewProfileComponent implements OnInit {
  familyMemberList: any;
  selectedFamilyMember: any;
  clientOverviewData: any = {};
  addressList: any;
  dematList: any;
  bankList: any;
  selectedBankData: any;
  selectedDemat: any;
  clientData: any;
  Tab = 'Tab1';
  letsideBarLoader: boolean;
  adressFlag = true;
  bankFlag: boolean;
  dematFlag: boolean;
  hasError = false;

  // clientData;
  showSectionError = {
    familyMemberList: false,
    addressList: false,
    dematList: false,
    bankList: false
  };
  duplicateFlag: any;
  clientList: any;
  relationList: any;

  constructor(private peopleService: PeopleService, private authService: AuthService,
              public dialog: MatDialog, public subInjectService: SubscriptionInject,
              private cusService: CustomerService, private eventService: EventService,
              private utils: UtilService, private enumDataService: EnumDataService,
              private route: ActivatedRoute, private cancelFlagService: CancelFlagService,
              private clientSuggeService: ClientSggestionListService) {
  }

  ngOnInit() {
    this.enumDataService.setBankAccountTypes();
    this.clientData = AuthService.getClientData();
    this.enumDataService.getRoles();
    this.enumDataService.getProofType();
    // this.enumDataService.getBank();
    this.enumDataService.getClientRole();
    this.clientSuggeService.setEmptySuggestionList();
    this.route.queryParams.subscribe((params) => {
      if (params.Tab) {
        this.Tab = params.Tab;
      }
    });
    // console.log(sessionStorage.getItem('clientData'));
    // this.clientOverviewData = JSON.parse(sessionStorage.getItem('clientData'));
    this.letsideBarLoader = true;
    this.getClientData(this.clientData);
    this.getAddressList(this.clientData);
    this.getDematList(this.clientData);
    this.getBankList(this.clientData);
    this.enumDataService.getDataForTaxMasterService();
    this.getFamilyMembersList(this.clientData);
    this.enumDataService.searchClientList();
  }

  getClientData(data) {
    this.letsideBarLoader = true;
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        if (data == undefined) {
          return;
        } else {
          this.letsideBarLoader = false;
          // this.authService.setClientData(data);
          if (data.mobileList && data.mobileList.length > 0 && data.mobileList[0].mobileNo !== 0) {
            data.mobileNo = data.mobileList[0].mobileNo;
            const obj = {
                advisorId: AuthService.getAdvisorId(),
                isdCodeId: data.mobileList[0].isdCodeId,
                mobileNo: data.mobileNo
              };
            this.clientSuggeService.setSuggestionListUsingMobile(obj);
          }
          if (data.emailList && data.emailList.length > 0) {
            data.email = data.emailList[0].email;
            const obj = {
                advisorId: AuthService.getAdvisorId(),
                email: data.email
              };
            this.clientSuggeService.setSuggestionListUsingEmail(obj);
          }
          (data.martialStatusId == 1 || data.martialStatusId == 0) ? data.martialStatus = 'Married' : (data.martialStatusId == 2) ? data.martialStatus = 'Unmarried' : (data.martialStatusId == 0) ? data.martialStatus = 'N/A' : data.martialStatus = 'Other';
          (data.genderId == 1) ? data.gender = 'Male' : (data.genderId == 2) ? data.gender = 'Female' : (data.genderId == 3) ? data.gender = 'Other' : data.gender = 'N/A';
          this.clientOverviewData = data;
          this.subInjectService.addSingleProfile(this.clientOverviewData.displayName);
          AuthService.setClientProfilePic(this.clientOverviewData.profilePicUrl);
          this.authService.setClientData(data);
          this.calculateAge(this.clientOverviewData.dateOfBirth);
        }
      },
      err => {
        console.error(err);
        this.hasError = true;
      }
    );
  }

  openAgePopup() {
    const dialogRef = this.dialog.open(AgePopupComponent,
      {
        width: '400px',
        height: '200px',
        data: this.clientOverviewData
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result.flag != 'cancel') {
        this.getClientData(this.clientOverviewData);
      }
    });
  }

  getFamilyMembersList(data) {
    const obj = {
      clientId: data.clientId,
      id: 0
    };
    this.cusService.getFamilyMembers(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.duplicateFlag = data.map(element => {
            return;
          });
          data.forEach(element => {
            if (element.mobileList && element.mobileList.length > 0 && element.mobileList[0].mobileNo !== 0) {
              element.mobileNo = element.mobileList[0].mobileNo;
            }
            if (element.emailList && element.emailList.length > 0) {
              element.email = element.emailList[0].email;
            }
            if (element.name.length > 22) {
              element.shortName = element.name.substr(0, element.name.indexOf(' '));
            }
          });
          this.familyMemberList = data;
          this.familyMemberList = this.utils.calculateAgeFromCurrentDate(data);
          console.log(this.familyMemberList);
        } else {
          this.familyMemberList = undefined;
        }
      },
      err => {
        this.familyMemberList = undefined;
        this.showSectionError.familyMemberList = true;
        console.error(err);
      }
    );
  }

  getAddressList(data) {
    this.adressFlag = true;
    const obj = {
      userId: data.clientId,
      userType: data.userType
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.addressList = data;
        } else {
          this.addressList == undefined;
        }
        this.adressFlag = false;
      },
      err => {
        this.adressFlag = false;
        this.showSectionError.addressList = true;
        console.error(err);
      }
    );
  }

  getDematList(data) {
    this.dematFlag = true;
    const obj = {
      userId: data.clientId,
      userType: data.userType
    };
    this.cusService.getDematList(obj).subscribe(
      data => {
        this.dematFlag = false;
        console.log(data);
        if (data && data.length > 0) {
          this.dematList = data;
          this.selectedDemat = data[0];
        }
      }, err => {
        this.dematFlag = false;
        this.dematList = undefined;
        this.showSectionError.dematList = true;
        console.error(err);
      }
    );
  }

  calculateAge(data) {
    const today = new Date();
    const birthDate = new Date(data);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.clientOverviewData.age = isNaN(age) ? 0 : age;
  }

  getBankList(data) {
    this.bankFlag = true;
    const obj = [{
      userId: data.clientId,
      userType: data.userType
    }];
    this.cusService.getBankList(obj).subscribe(
      data => {
        this.bankFlag = false;
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;
          this.bankList.forEach(singleBank => {
            singleBank.accountTypeName = (singleBank.accountType == '1') ? 'Saving A/c' : (singleBank.accountType == '2') ? 'Current A/c' : (singleBank.accountType == '3') ? 'NRE' : (singleBank.accountType == '4') ? 'NRO' : 'Cash credit A/c';
            singleBank.shortAddress = singleBank.address ? singleBank.address.city ? singleBank.address.city : '' : '';
          });
          this.selectedBankData = data[0];
        }
      },
      err => {
        this.bankFlag = false;
        this.bankList = undefined;
        this.showSectionError.bankList = true;
        console.error(err);
      }
    );
  }


  next(flag, index) {
    // console.log('next index: ', index);
    if (flag == 'bank') {
      (index < this.bankList.length - 1) ? this.selectedBankData = this.bankList[index + 1] : '';
    } else {
      (index < this.dematList.length - 1) ? this.selectedDemat = this.dematList[index + 1] : '';
    }
  }

  previous(flag, index) {
    if (flag == 'bank') {
      (index > 0) ? this.selectedBankData = this.bankList[index - 1] : '';
    } else {
      (index > 0) ? this.selectedDemat = this.dematList[index - 1] : '';
    }
  }


  open(value, data) {
    this.enumDataService.setRelationShipStatus();
    let component;
    if (value == 'add') {
      if (this.clientOverviewData.clientType == 1) {
        if (this.familyMemberList) {
          const relationType = (this.clientOverviewData.genderId == 1) ? 3 : 2;
          this.duplicateFlag = this.familyMemberList.some(element => {
            if (element.relationshipId == relationType) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          this.duplicateFlag = false;
        }
      }
      this.clientOverviewData.duplicateFlag = this.duplicateFlag;
      component = AddFamilyMemberComponent;

      let ClientList = Object.assign([], this.enumDataService.getEmptySearchStateData());
      // let testList = ClientList.filter(element => element.name.match('Arun'));
      // console.log('this is sidebardata in befor filter testList : ', testList);
      ClientList = ClientList.filter(element => element.userId != this.clientOverviewData.userId);
      // testList = ClientList.filter(element => element.name.match('Arun'));
      // console.log('this is sidebardata in after filter testList : ', testList);
      data = {flag: 'Add member', fieldFlag: 'familyMember', client: this.clientOverviewData, ClientList};
    } else {
      data.flag = 'Edit member';
      data.fieldFlag = 'familyMember';
      component = AddClientComponent;
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // const testList = sideBarData.data.ClientList.filter(element => element.name.match('Arun'));
        // console.log('this is sidebardata in testList : ', testList);

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired || this.cancelFlagService.getCancelFlag()) {
            this.getFamilyMembersList(this.clientData);
            this.enumDataService.searchClientList();
            this.cancelFlagService.setCancelFlag(undefined);
            this.clientSuggeService.setEmptySuggestionList();
            this.familyMemberList = undefined;
            if (this.clientOverviewData.mobileList && this.clientOverviewData.mobileList.length > 0) {
              this.clientOverviewData.mobileNo = this.clientOverviewData.mobileList[0].mobileNo;
              const obj = {
                  advisorId: AuthService.getAdvisorId(),
                  isdCodeId: this.clientOverviewData.mobileList[0].isdCodeId,
                  mobileNo: this.clientOverviewData.mobileNo
                };
              this.clientSuggeService.setSuggestionListUsingMobile(obj);
            }
            if (this.clientOverviewData.emailList && this.clientOverviewData.emailList.length > 0) {
              this.clientOverviewData.email = this.clientOverviewData.emailList[0].email;
              const obj = {
                  advisorId: AuthService.getAdvisorId(),
                  email: this.clientOverviewData.email
                };
              this.clientSuggeService.setSuggestionListUsingEmail(obj);
            }
          }
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openClient(value, data) {
    data.flag = 'Edit client';
    data.fieldFlag = 'client';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: AddClientComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired || this.cancelFlagService.getCancelFlag()) {
            setTimeout(() => {
              this.getClientData(this.clientOverviewData);
              this.clientOverviewData = undefined;
              this.getAddressList(this.clientData);
              this.getBankList(this.clientData);
              this.getDematList(this.clientData);
              this.addressList = undefined;
              this.bankList = undefined;
              this.dematList = undefined;
              // this.authService.setClientData(sideBarData.clientData);
              // this.clientOverviewData = sideBarData.clientData;
              // this.getFamilyMembersList(this.clientData);
            });
          }
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openAddEdit(clientData, data, flag, headerFlag) {
    let component;
    if (flag == 'Address') {
      component = ClientAddressComponent;
      clientData.addressData = data;
    } else if (flag == 'Bank') {
      component = ClientBankComponent;
      clientData.bankData = data;
    } else {
      component = ClientDematComponent;
      clientData.dematData = data;
    }
    clientData.headerFlag = headerFlag;
    const fragmentData = {
      flag,
      data: clientData,
      id: 1,
      state: 'open50',
      componentName: component,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired) {
            if (flag == 'Address') {
              this.addressList = undefined;
              this.getAddressList(this.clientData);

            } else if (flag == 'Bank') {
              this.bankList = undefined;
              this.getBankList(this.clientData);
            } else {
              this.dematList = undefined;
              this.getDematList(this.clientData);
            }
          }
          clientData = [];
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openHistory(value, data) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open35',
      componentName: HistoryViewComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


  OpenpersonalProfile(openTab = 0) {
    const dataObj = {
      profile: this.clientOverviewData,
      openTab
    };
    const fragmentData = {
      flag: null,
      data: dataObj,
      id: 1,
      state: 'open',
      componentName: UpdateClientProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.clientOverviewData.profilePicUrl = undefined;
            this.getClientData(this.clientData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  resetPassword(value, data) {
    const dialogData = {
      data: value,
      header: 'RESET PASSWORD',
      body: 'Are you sure you want to reset password?',
      body2: 'An email will be sent to the client to reset password',
      btnYes: 'CANCEL',
      btnNo: 'RESET',
      positiveMethod: () => {
        const obj = {
          advisorId: data.advisorId,
          clientId: data.clientId
        };
        this.peopleService.resetClientPassword(obj).subscribe(
          responseData => {
            this.eventService.openSnackBar('Email sent successfully!', 'Dismiss');
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ResetClientPasswordComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


}
