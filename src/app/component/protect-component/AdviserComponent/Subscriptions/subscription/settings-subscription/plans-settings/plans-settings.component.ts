import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { UtilService } from "../../../../../../../services/util.service";
import { SubscriptionUpperSliderComponent } from '../../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { Router } from '@angular/router';
import { SubscriptionDataService } from '../../../subscription-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-plans-settings',
  templateUrl: './plans-settings.component.html',
  styleUrls: ['./plans-settings.component.scss']
})
export class PlansSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog, private subService: SubscriptionService,
    private dataService: EventService, private eventService: EventService, private subinject: SubscriptionInject, private utilservice: UtilService, private router: Router, private location: Location) {
  }

  button: any;

  //showLoader;
  planSettingData: any = [];
  isLoading = false;
  advisorId;

  ngOnInit() {
    this.planSettingData = [{}, {}];

    this.advisorId = AuthService.getAdvisorId();
    // (SubscriptionDataService.getLoderFlag(5) == false) ? this.planSettingData = undefined : this.planSettingData = [{}, {}, {}]
    this.getSettingsPlanData();
    // this.openFragment('', 'plan');
  }

  getSettingsPlanData() {
    this.isLoading = true;
    const obj = {
      // advisorId: 12345
      advisorId: this.advisorId,
      mapped: false
    };
    // this.planSettingData = [{}, {}];
    this.subService.getSubscriptionPlanSettingsData(obj).subscribe(
      data => this.getSettingsPlanResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.planSettingData = [];
        this.isLoading = false;
      }
    );
  }

  getSettingsPlanResponse(data) {
    if (data != undefined) {
      this.isLoading = false;
      for (let p of data) {
        p['read'] = false;
      }
      this.planSettingData = data;

    }
    else {
      this.planSettingData = [];
    }
    //this.showLoader = false;
  }

  getFilerrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss');
  }

  // openFragment(singlePlan, data) {
  //   this.subinject.pushUpperData(singlePlan);
  //   (singlePlan == '') ? singlePlan = data : singlePlan.flag = data
  //   const fragmentData = {
  //     flag: 'app-subscription-upper-slider',
  //     data: singlePlan,
  //     state: 'open'
  //   };
  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         this.getSettingsPlanData();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );

  // /* const dialogRef = this.dialog.open(UpperSliderComponent, {
  //    width: '1400px',
  //    data: Fragmentdata,
  //    autoFocus: false,
  //    panelClass: 'dialogBox',
  //
  //  });
  //
  //  dialogRef.afterClosed().subscribe(result => {
  //
  //  });*/


  openFragment(singlePlan, data) {
    // this.location.replaceState('/subscription-upper');
    (singlePlan == '') ? singlePlan = data : singlePlan.flag = data
    const fragmentData = {
      flag: 'plan',
      id: 1,
      data: singlePlan,
      direction: 'top',
      componentName: SubscriptionUpperSliderComponent,
      state: 'open',
      Name: 'plan-upper-slider'
    };
    // this.router.navigate(['/subscription-upper'], { state: { ...fragmentData } })

    AuthService.setSubscriptionUpperSliderData(fragmentData)
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {

        if (UtilService.isDialogClose(upperSliderData)) {
          if (UtilService.isRefreshRequired(upperSliderData)) {
            this.planSettingData = [{}, {}];
            this.getSettingsPlanData();
          }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
}
