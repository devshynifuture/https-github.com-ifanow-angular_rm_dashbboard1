import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
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
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Questions = [{ question: 'How to apply subscription to client?' },
  { question: 'Can we have more than one subscription applied to the client at the same time?' },
  { question: 'What are the Future subscription?' }]
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  noData: string;

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject,
    private subService: SubscriptionService) {
  }

  @Input() upperData: any;

  displayedColumns: string[] = ['name', 'email', 'num', 'balance'];
  advisorId;
  isLoading = false;
  ngOnInit() {
    //this.dataSource = [{}, {}, {}];
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
      data => this.getClientListResponse(data), (error) => {
        this.eventService.openSnackBar('Somthing went worng!', 'dismiss');
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getClientListResponse(data) {
    this.isLoading = false;

    if (data && data.length > 0) {
      this.data = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      // this.DataToSend = data;
    } else {

      this.data = [];
      this.dataSource.data = data;
      // console.log(data);
      this.dataSource.data = []
      this.noData = 'No Data Found';

    }

    // this.dataSource = data;
    // this.dataSource = new MatTableDataSource(data);
    // this.dataSource.sort = this.sort;
  }

  Open(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
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
