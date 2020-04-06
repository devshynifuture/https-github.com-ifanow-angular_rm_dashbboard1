import { Component, OnInit } from '@angular/core';
import { AddFamilyMemberComponent } from './add-family-member/add-family-member.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { HistoryViewComponent } from './history-view/history-view.component';
import { AddClientComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/add-client.component';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { ClientAddressComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-address/client-address.component';
import { ClientDematComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-demat/client-demat.component';
import { ClientBankComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-bank/client-bank.component';

@Component({
  selector: 'app-overview-profile',
  templateUrl: './overview-profile.component.html',
  styleUrls: ['./overview-profile.component.scss']
})
export class OverviewProfileComponent implements OnInit {
  familyMemberList: any;
  selectedFamilyMember: any;
  clientOverviewData;
  addressList: any;
  dematList: any;
  bankList: any;
  selectedBankData: any;
  selectedDemat: any;

  // clientData;

  constructor(private authService: AuthService, public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private cusService: CustomerService, private eventService: EventService) {
  }

  ngOnInit() {
    this.clientOverviewData = AuthService.getClientData();
    // console.log(sessionStorage.getItem('clientData'));
    // this.clientOverviewData = JSON.parse(sessionStorage.getItem('clientData'));
    console.log(this.clientOverviewData);
    this.getFamilyMembersList();
    this.getAddressList();
    this.getDematList();
    this.getBankList();
  }

  getFamilyMembersList() {
    const obj = {
      clientId: this.clientOverviewData.clientId,
      id: 0
    };
    this.cusService.getFamilyMembers(obj).subscribe(
      data => {
        this.familyMemberList = data;
        console.log(data);
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getAddressList() {
    const obj = {
      userId: this.clientOverviewData.clientId,
      userType: this.clientOverviewData.userType
    };
    this.cusService.getAddressList(obj).subscribe(
      data => {
        console.log(data);
        this.addressList = data;
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getDematList() {
    const obj = {
      userId: this.clientOverviewData.clientId,
      userType: this.clientOverviewData.userType
    };
    this.cusService.getDematList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.dematList = data;
          this.selectedDemat = data[0];
        }
      }, err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getBankList() {
    const obj = {
      userId: this.clientOverviewData.clientId,
      userType: this.clientOverviewData.userType
    };
    this.cusService.getBankList(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;
          this.bankList.forEach(singleBank => {
            singleBank.accountTypeName = singleBank.accountType ?
              singleBank.accountType == '1' ? 'Current A/c' : 'Saving A/c' : 'Saving A/c';
            singleBank.shortAddress = singleBank.address ? singleBank.address.city ? singleBank.address.city : '' : '';
          });
          this.selectedBankData = data[0];
        }
      }, err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  next(flag, index) {
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

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteFamilyMember(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.getFamilyMembersList();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  open(value, data) {
    let component;
    if (value == 'add') {
      component = AddFamilyMemberComponent;
      data = { flag: 'Add Family Member', fieldFlag: 'familyMember' };
    } else {
      data.flag = 'Add Family Member';
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
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getFamilyMembersList();
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
          if (sideBarData.clientData) {
            this.authService.setClientData(sideBarData.clientData);
            this.clientOverviewData = sideBarData.clientData;
          }
          this.getFamilyMembersList();
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
          (flag == 'Address') ? this.getAddressList() : (flag == 'Bank') ? this.getBankList() : this.getDematList();
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


}
