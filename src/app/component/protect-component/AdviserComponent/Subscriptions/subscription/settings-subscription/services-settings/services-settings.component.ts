import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from '../../../../../../../services/util.service';
import { SubscriptionUpperSliderComponent } from '../../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { Router } from '@angular/router';
import { SubscriptionDataService } from '../../../subscription-data.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-services-settings',
  templateUrl: './services-settings.component.html',
  styleUrls: ['./services-settings.component.scss']
})
export class ServicesSettingsComponent implements OnInit {
  feesDisplay: boolean;

  constructor(public dialog: MatDialog, private subService: SubscriptionService,
    private dataService: EventService, private eventService: EventService, private utilservice: UtilService, private router: Router, private location: Location) {
  }

  button: any;

  // showLoader;

  serviceSettingData: any = [{}, {}];
  isLoading = false;
  advisorId;
  read: boolean = false;
  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.feesDisplay = true;
    // (SubscriptionDataService.getLoderFlag(5) == false) ? this.serviceSettingData = undefined : this.serviceSettingData = [{}, {}, {}]
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
    this.location.replaceState('/subscription-upper');
    (singleService == '') ? singleService = '' : singleService.flag = data;
    const fragmentData = {
      flag: 'services',
      id: 1,
      data: singleService,
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open',
      Name: 'service-upper-slider'
    };
    // this.router.navigate(['/subscription-upper'], { state: { ...fragmentData } })

    AuthService.setSubscriptionUpperSliderData(fragmentData)
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
            this.serviceSettingData = [{}, {}]
            this.getServiceSettingSubData();
          }
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
    // this.serviceSettingData = [{}, {}, {}];
    this.subService.getSubscriptionServiceSettingsData(obj).subscribe(
      data => this.getServiceSettingSubResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.serviceSettingData = [];
        this.isLoading = false;
      }
    );
  }

  getServiceSettingSubResponse(data) {
    if (data != undefined) {
      this.isLoading = false;
      this.feesDisplay = false
      for (let s of data) {
        s['read'] = false;
      }
      data.forEach(element => {
        element['billEveryMode'] = (element.servicePricing.billEvery == 1) ? 'Monthly' : (element.servicePricing.billEvery == 3) ? 'Quarterly' : (element.servicePricing.billEvery == 6) ? 'Half-yearly' : 'Yearly'
      });
      this.serviceSettingData = data;
    }
    else {
      this.serviceSettingData = [];

    }

    // this.showLoader = false;
  }



  getFileErrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss');
  }
}
