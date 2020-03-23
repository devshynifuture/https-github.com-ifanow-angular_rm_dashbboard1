import { Component, OnInit } from '@angular/core';
import { AddPersonalProfileComponent } from './add-personal-profile/add-personal-profile.component';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { OrgSettingServiceService } from '../org-setting-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { OrgProfileComponent } from './add-personal-profile/org-profile/org-profile.component';

@Component({
  selector: 'app-setting-org-profile',
  templateUrl: './setting-org-profile.component.html',
  styleUrls: ['./setting-org-profile.component.scss']
})
export class SettingOrgProfileComponent implements OnInit {
  advisorId: any;
  orgProfile=false;
  userList: any;
  orgDetails: any;

  constructor(private eventService: EventService,
    private utilService: UtilService, private subInjectService: SubscriptionInject, private orgSetting: OrgSettingServiceService, ) { }

  ngOnInit() {
    this.getPersonalProfiles()
    this.orgProfile =false
    this.advisorId = AuthService.getAdvisorId()
  }
  getPersonalProfiles() {
    let obj = {
      id:414
    }
    this.orgSetting.getPersonalProfile(obj).subscribe(
      data => this.getPersonalProfileRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getPersonalProfileRes(data){
    console.log('this.getPersonalProfileRes',data)
    this.userList = data
  }
  getOrgProfiles() {
    let obj = {
      advisorId:414
    }
    this.orgSetting.getOrgProfile(obj).subscribe(
      data => this.getOrgProfileRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );
  }
  getOrgProfileRes(data) {
    console.log('getOrgProfileRes', data)
    this.orgDetails = data
    
  }
  OpenpersonalProfile(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open70' : 'open70',
      componentName: AddPersonalProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openOrg(flag){
    if(flag == true){
      this.orgProfile = true
      this.getOrgProfiles()
    }else{
      this.orgProfile = false
    }
    
  }
  OpenOrgProfile(data, flag) {
    const fragmentData = {
      flag: flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open70' : 'open70',
      componentName: OrgProfileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
