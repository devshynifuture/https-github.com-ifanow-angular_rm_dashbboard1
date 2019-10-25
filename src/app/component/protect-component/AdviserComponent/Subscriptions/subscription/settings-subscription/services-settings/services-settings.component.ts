import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../../auth-service/authService";
import {UtilService} from "../../../../../../../services/util.service";

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

  showLoader;

  serviceSettingData;
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getServiceSettingSubData();
  }

  openFragment(singleService, data) {
    const fragmentData = {
      Flag: data,
      // Flag: 'plan',
      // planData: '',
      FeeData: singleService,
      state: 'open',
      id: 2
    };
    // this.eventService.changeUpperSliderState(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          this.getServiceSettingSubData();
          subscription.unsubscribe();
        }
      }
    );
    /* const dialogRef = this.dialog.open(UpperSliderComponent, {
       width: '1400px',
       data: Fragmentdata,
       autoFocus: false,
       panelClass: 'dialogBox',
     });
 */

  }

  getServiceSettingSubData() {
    this.showLoader = true;
    const obj = {
      // advisorId: 2808
      advisorId: this.advisorId,

    };
    this.subService.getSubscriptionServiceSettingsData(obj).subscribe(
      data => this.getServiceSettingSubResponse(data),
      err => this.getFileErrorResponse(err)
    );
  }

  getServiceSettingSubResponse(data) {
    console.log('service data', data);
    this.serviceSettingData = data;
    this.showLoader = false;
  }

  getFileErrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss');
  }
}
