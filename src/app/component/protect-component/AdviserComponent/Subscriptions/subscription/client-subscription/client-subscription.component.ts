import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { SubscriptionService } from '../../subscription.service';
import { UtilService } from '../../../../../../services/util.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { HelpComponent } from '../common-subscription-component/help/help.component';
import { SubscriptionUpperSliderComponent } from '../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { Router } from '@angular/router';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';
import { Location } from '@angular/common';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';


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
  { question: 'What are the Future subscription?' }];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  noData: string;
  searchoptionFlag: boolean;

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject,
    private subService: SubscriptionService, private router: Router, private location: Location) {
  }

  @Input() upperData: any;
  @Input() isAdvisor = true;

  displayedColumns: string[] = ['name', 'email', 'num', 'balance'];
  advisorId;
  isLoading = false;
  ngOnInit() {
    // this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    this.getClientSubData();
  }


  getClientSubData() {
    this.getClientSubscriptionList().subscribe(
      data => {
        this.getClientListResponse(data);
      }, (error) => {
        // this.errorMessage();
        this.searchoptionFlag = false;
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
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
      data: {

      },
      id: 1,
      // data,
      direction: 'top',
      componentName: ErrPageOpenComponent,
      state: 'open',
    };
    fragmentData.data = {
      positiveMethod: (barButtonOption: MatProgressButtonOptions) => {
        barButtonOption.active = true;
        this.getClientSubscriptionList().subscribe(
          data => {
            barButtonOption.active = false;

            this.getClientListResponse(data);
            this.eventService.changeUpperSliderState({ state: 'close' });
            // this.errorMessage();
          }, (error) => {
            barButtonOption.active = false;

            this.eventService.openSnackBar('Wait for sometime....', 'Dismiss');
            // this.eventService.showErrorMessage(error);
          }
        );
      },
    };
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
    this.searchoptionFlag = true;
    if (data && data.length > 0) {
      this.data = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      // this.DataToSend = data;
    } else {
      this.searchoptionFlag = false;
      this.data = [];
      this.dataSource.data = data;
      this.dataSource.data = [];
      this.noData = 'No Data Found';

    }

    // this.dataSource = data;
    // this.dataSource = new MatTableDataSource(data);
    // this.dataSource.sort = this.sort;
  }

  Open(value, state, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state,
      componentName: HelpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.eventService.sidebarData(value);
    // this.subInjectService.rightSideData(state);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.noData = 'No mandates found';
    }
  }

  openFragment(flag, data) {
    if (!this.isLoading) {
      this.location.replaceState('/subscription-upper');
      data.flag = flag;
      const fragmentData = {
        flag: 'clietns',
        id: 1,
        data,
        direction: 'top',
        componentName: SubscriptionUpperSliderComponent,
        state: 'open'
      };
      // this.router.navigate(['/subscription-upper'])
      AuthService.setSubscriptionUpperSliderData(fragmentData);
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
}
