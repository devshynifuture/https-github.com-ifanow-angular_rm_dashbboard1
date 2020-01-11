import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from '../../../../../../../services/util.service';
import { SubscriptionUpperSliderComponent } from '../../common-subscription-component/upper-slider/subscription-upper-slider.component';

@Component({
  selector: 'app-services-settings',
  templateUrl: './services-settings.component.html',
  styleUrls: ['./services-settings.component.scss']
})
export class ServicesSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog, private subService: SubscriptionService,
    private dataService: EventService, private eventService: EventService) {
  }

  button: any;

  // showLoader;

  serviceSettingData = [{}, {}];
  isLoading = false;
  advisorId;

  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.getServiceSettingSubData();
  }

  // openFragment(singleService, data) {
  //   (singleService=='')?singleService='':singleService.flag=data
  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     // flag: 'plan',
  //     // planData: '',
  //     data: singleService,
  //     state: 'open',
  //     id: 2
  //   };
  //   // this.eventService.changeUpperSliderState(fragmentData);
  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         this.getServiceSettingSubData();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }

  openFragment(singleService, data) {
    (singleService == '') ? singleService = '' : singleService.flag = data;
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openUpper',
      id: 1,
      data: singleService,
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          this.getServiceSettingSubData();
          subscription.unsubscribe();
        }
      }
    );
  }

  getServiceSettingSubData() {
    this.isLoading = true;
    const obj = {
      // advisorId: 2808
      advisorId: this.advisorId,

    };
    this.serviceSettingData = [{}, {}];

    this.subService.getSubscriptionServiceSettingsData(obj).subscribe(
      data => this.getServiceSettingSubResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        // this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getServiceSettingSubResponse(data) {
    console.log('service data', data);
    this.isLoading = false;
    this.serviceSettingData = data;
    // this.showLoader = false;
  }

  getFileErrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss');
  }
}
