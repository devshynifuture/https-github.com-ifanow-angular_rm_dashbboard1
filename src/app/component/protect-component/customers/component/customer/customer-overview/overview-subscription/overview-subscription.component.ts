import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-overview-subscription',
  templateUrl: './overview-subscription.component.html',
  styleUrls: ['./overview-subscription.component.scss']
})
export class OverviewSubscriptionComponent implements OnInit {

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject,
    private subService: SubscriptionService, private router: Router) {
      this.clientData = AuthService.getClientData();
      this.clientId = AuthService.getClientId();
}

  advisorId;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  noData: string;
  clientData:any;
  clientId

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getClientSubData();
  }


  getClientSubData() {
    this.getClientSubscriptionList().subscribe(
      data => {
        this.getClientListResponse(data);
      }, (error) => {
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getClientListResponse(data) {

    this.isLoading = false;

    if (data && data.length > 0) {
      let subscriptionData = data.filter(d => d.id === this.clientId);
      AuthService.setSubscriptionUpperSliderData(subscriptionData[0])
    } else {

      this.data = [];
      this.dataSource.data = data;
      this.dataSource.data = [];
      this.noData = 'No Data Found';

    }
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.isLoading = true;
    return this.subService.getSubscriptionClientsList(obj);
  }

}
