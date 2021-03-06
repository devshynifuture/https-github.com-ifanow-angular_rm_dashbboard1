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
  constructor(private subInjectService: SubscriptionInject,
    private peopleService: PeopleService,
    private eventService: EventService) { }
  displayedColumns: string[] = ['memberName', 'pan', 'mobile', 'email', 'kycStatus', 'action'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  ngOnInit() {
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

  kycClientSectionMethod() {
    const hostNameOrigin = window.location.origin;
    const clientData = AuthService.getClientData();
    const obj = {
      name: clientData.name,
      clientId: clientData.clientId,
      email: clientData.email,
      mobileNo: clientData.mobileNo,
      redirectUrl: `${hostNameOrigin}/customer/detail/overview/profile`
    }
    this.peopleService.doKYCNow(obj).subscribe(
      data => {
        if (data.innerObj) {
          window.open(data.innerObj.autoLoginUrl);
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  kycAdvisorSectionMethod() {
    const hostNameOrigin = window.location.origin;
    const obj = {
      name: this.data.name,
      clientId: this.data.clientId,
      email: this.data.email,
      mobileNo: this.data.mobileNo,
      redirectUrl: `${hostNameOrigin}/admin/people/clients`
    }
    this.peopleService.doKYCNow(obj).subscribe(
      data => {
        this.eventService.openSnackBar("Email sent sucessfully", "Dismiss");
      }, err => {
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
