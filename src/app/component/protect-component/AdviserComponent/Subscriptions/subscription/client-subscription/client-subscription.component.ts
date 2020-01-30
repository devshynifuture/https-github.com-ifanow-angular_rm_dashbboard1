import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { SubscriptionService } from '../../subscription.service';
import { UtilService } from "../../../../../../services/util.service";
import { AuthService } from "../../../../../../auth-service/authService";
import { HelpComponent } from '../common-subscription-component/help/help.component';
import { SubscriptionUpperSliderComponent } from '../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { Router } from '@angular/router';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';

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
    private subService: SubscriptionService, private router: Router) {
  }

  @Input() upperData: any;

  displayedColumns: string[] = ['name', 'email', 'num', 'balance'];
  advisorId;
  isLoading = false;
  ngOnInit() {
    //this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    console.log('clients');
    this.getClientSubData();
  }


  getClientSubData() {
    this.getClientSubscriptionList().subscribe(
      data => {
        this.getClientListResponse(data)
      }, (error) => {
        this.errorMessage();
        this.dataSource.data = [];
        this.isLoading = false;
      }
    )
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.isLoading = true;
    return this.subService.getSubscriptionClientsList(obj);
  }
  errorMessage() {
    const fragmentData = {
      flag: 'app-err-page-open',
      data: {},
      id: 1,
      // data,
      direction: 'top',
      componentName: ErrPageOpenComponent,
      state: 'open',
    };
    fragmentData.data = {
      positiveMethod: () => {
        this.getClientSubscriptionList().subscribe(
          data => {
            this.getClientListResponse(data);
            this.eventService.changeUpperSliderState({ state: 'close' })
            // this.errorMessage();
          }, (error) => {
            this.eventService.openSnackBar('Wait sometime....', 'dismiss');
            // this.eventService.showErrorMessage(error);
          }
        )
      },
    }
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // subscription.unsubscribe();
        }
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


  openFragment(flag, data) {
    data.flag = flag
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'clietns',
      id: 1,
      data,
      // direction: 'top',
      // componentName: SubscriptionUpperSliderComponent,
      // state: 'open'
    };
    this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData)
    // const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
    //   upperSliderData => {
    //     if (UtilService.isDialogClose(upperSliderData)) {
    //       // this.getClientSubscriptionList();
    //       subscription.unsubscribe();
    //     }
    //   }
    // );
  }
}
