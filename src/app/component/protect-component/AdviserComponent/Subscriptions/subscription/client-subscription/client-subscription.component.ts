import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { SubscriptionService } from '../../subscription.service';
import { UtilService } from "../../../../../../services/util.service";
import { AuthService } from "../../../../../../auth-service/authService";
import { HelpComponent } from '../common-subscription-component/help/help.component';
import { SubscriptionUpperSliderComponent } from '../common-subscription-component/upper-slider/subscription-upper-slider.component';

export interface PeriodicElement {
  name: string;
  email: string;
  num: number;
  balance: string;
}

@Component({
  selector: 'app-client-subscription',
  templateUrl: './client-subscription.component.html',
  styleUrls: ['./client-subscription.component.scss']
})
export class ClientSubscriptionComponent implements OnInit {

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject,
    private subService: SubscriptionService) {
  }

  @Input() upperData: any;

  displayedColumns: string[] = ['name', 'email', 'num', 'balance'];
  dataSource = [{}, {}, {}];
  advisorId;
  isLoading = false;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log('clients');
    this.getClientSubscriptionList();
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.isLoading = true;
    this.subService.getSubscriptionClientsList(obj).subscribe(
      data => this.getClientListResponse(data)

    );
  }

  getClientListResponse(data) {
    this.isLoading = false;
    this.dataSource = data;
  }

  Open(value, state) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: state,
      componentName: HelpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.eventService.sidebarData(value);
    // this.subInjectService.rightSideData(state);
  }

  // openFragment(data, clientData) {
  /* const fragmentData = {
     flag: 'emailOnly',
     data: clientData,
     id: 1,
     state: 'open'
   };
   const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
     sideBarData => {
       console.log('this is sidebardata in subs subs : ', sideBarData);
       if (UtilService.isDialogClose(sideBarData)) {
         console.log('this is sidebardata in subs subs 2: ',);
         rightSideDataSub.unsubscribe();
       }
     }
   );*/
  //   clientData.flag = data;
  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     id: 1,
  //     data: clientData,
  //     state: 'open'
  //   };

  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         this.getClientSubscriptionList();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }
  openFragment(flag, data) {
    data.flag = flag
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openUpper',
      id: 1,
      data,
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
}
