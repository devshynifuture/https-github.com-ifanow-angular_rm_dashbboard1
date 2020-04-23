import { Component, OnInit } from '@angular/core';
import { AddPersonalProfileComponent } from './add-personal-profile/add-personal-profile.component';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { OrgProfileComponent } from './add-personal-profile/org-profile/org-profile.component';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-setting-org-profile',
  templateUrl: './setting-org-profile.component.html',
  styleUrls: ['./setting-org-profile.component.scss']
})
export class SettingOrgProfileComponent implements OnInit {
  advisorId: any;
  orgProfile = false;
  userList: any = undefined;
  orgDetails: any = {};
  isLoading = true
  counter: number = 0;
  isOrgProfileLoaded = false;

  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getPersonalProfiles()
    this.orgProfile = false
  }

  getPersonalProfiles() {
    this.loader(1)
    let obj = {
      id: this.advisorId
    }
    this.settingsService.getPersonalProfile(obj).subscribe(
      data => this.getPersonalProfileRes(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.userList = undefined;
        this.loader(-1);
      }
    );
  }
  getPersonalProfileRes(data) {
    this.userList = data
    this.loader(-1);
  }
  getOrgProfiles() {
    if(!this.isOrgProfileLoaded) {
      this.loader(1)
      let obj = {
        advisorId: this.advisorId,
      }
      this.settingsService.getOrgProfile(obj).subscribe(
        data => this.getOrgProfileRes(data),
        err => {
          this.eventService.openSnackBar(err, "Dismiss");
          this.isOrgProfileLoaded = true;
          this.orgDetails = undefined;
          this.loader(-1);
        }
      );
    }
  }
  getOrgProfileRes(data) {
    if (data) {
      this.orgDetails = data
    }
    this.loader(-1);
    this.isOrgProfileLoaded = true;
  }

  OpenpersonalProfile(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open' : 'open',
      componentName: AddPersonalProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPersonalProfiles();
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openOrg(flag) {
    this.orgProfile = flag;
    if (flag) {
      this.getOrgProfiles();
    }
  }

  OpenOrgProfile(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open' : 'open',
      componentName: OrgProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.getOrgProfiles();
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getGSTTreatmentType(value) {
    switch (value) {
      case 1:
        return 'Consumer';
      case 2:
        return 'Not registered business';
      case 3:
        return 'Overseas';
      case 4:
        return 'Registered Business';
      default:
        return 'NA';
    }
  }

  loader(increamenter) {
    this.counter += increamenter;
    if(this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
}
