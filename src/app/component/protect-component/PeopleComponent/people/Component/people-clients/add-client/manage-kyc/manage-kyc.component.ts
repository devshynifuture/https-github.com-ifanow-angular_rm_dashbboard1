import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { AddNewAllKycComponent } from 'src/app/component/protect-component/AdviserComponent/transactions/kyc-transactions/add-new-all-kyc/add-new-all-kyc.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-kyc',
  templateUrl: './manage-kyc.component.html',
  styleUrls: ['./manage-kyc.component.scss']
})
export class ManageKycComponent implements OnInit {
  isLoading: boolean;
  @Input() data;
  userData: any;
  constructor(private subInjectService: SubscriptionInject,
    private peopleService: PeopleService,
    private eventService: EventService) { }
  displayedColumns: string[] = ['memberName', 'pan', 'mobile', 'email', 'kycStatus', 'action'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  ngOnInit() {
    this.userData = AuthService.getUserInfo();
    this.getKYCClientDetailsCall();
  }

  getKYCClientDetailsCall() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      clientId: this.data ? this.data.clientId : AuthService.getClientId()
    }
    this.peopleService.getKYCDetailsData(obj).subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length > 0) {
          data.forEach(element => {
            element['isLoader'] = false;
          });
          this.dataSource.data = data;
        } else {
          this.dataSource.data = []
        }
      }, err => {
        this.isLoading = false;
        this.dataSource.data = []
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  kycClientSectionMethod(elementData) {
    elementData.isLoader = true;
    const hostNameOrigin = window.location.origin;
    const obj = {
      name: this.data ? this.data.name : elementData.name,
      clientId: this.data ? this.data.clientId : elementData.clientId,
      email: this.data ? this.data.email : elementData.email,
      mobileNo: this.data ? this.data.mobileNo : elementData.mobileNo,
      familyMemberId: this.data ? this.data.familyMemberId : elementData.familyMemberId,
      redirectUrl: `${hostNameOrigin}/kyc-redirect`
    }
    if (elementData.kycComplaint != 0) {
      obj['redo'] = true;
    }
    this.peopleService.doKYCNow(obj).subscribe(
      data => {
        elementData.isLoader = false;
        // elementData.kycComplaint = 2;
        if (data.innerObj) {
          window.open(data.innerObj.autoLoginUrl);
        }
      }, err => {
        elementData.isLoader = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  kycAdvisorSectionMethod(elementData) {
    elementData.isLoader = true;
    const hostNameOrigin = window.location.origin;
    const obj = {
      name: this.data ? this.data.name : elementData.name,
      clientId: this.data ? this.data.clientId : elementData.clientId,
      email: this.data ? this.data.email : elementData.email,
      mobileNo: this.data ? this.data.mobileNo : elementData.mobileNo,
      redirectUrl: `${hostNameOrigin}/kyc-redirect`
    }
    if (elementData.kycComplaint != 0) {
      obj['redo'] = true;
    }
    this.peopleService.sendKYCLink(obj).subscribe(
      data => {
        elementData.isLoader = false;
        elementData.kycComplaint = 2;
        this.eventService.openSnackBar("Email sent sucessfully", "Dismiss");
      }, err => {
        elementData.isLoader = false;
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: flag
    });
  }

  openFroala(data, value) {
    if (AuthService.getClientData()) {
      data['btnFlag'] = 'Cancel'
    } else {
      data['btnFlag'] = 'Back';
      data['backComponent'] = "ManageKyc";
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: AddNewAllKycComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isRefreshRequired(sideBarData)) {
          // this.Close(true);
          // data.kycComplaint = 2;
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

}
