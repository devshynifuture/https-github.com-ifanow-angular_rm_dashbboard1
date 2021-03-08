import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

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
      redirectUrl: `${hostNameOrigin}/kyc-redirect`
    }
    if (elementData.kycComplaint != 0) {
      obj['redo'] = true;
    }
    this.peopleService.doKYCNow(obj).subscribe(
      data => {
        elementData.isLoader = false;
        elementData.kycComplaint = 2;
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

}
