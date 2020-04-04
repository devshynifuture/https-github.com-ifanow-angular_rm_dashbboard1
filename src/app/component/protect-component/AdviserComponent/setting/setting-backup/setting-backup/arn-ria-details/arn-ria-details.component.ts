import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { AddArnRiaDetailsComponent } from '../../../setting-entry/add-arn-ria-details/add-arn-ria-details.component';
import { SettingsService } from '../../../settings.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-arn-ria-details',
  templateUrl: './arn-ria-details.component.html',
  styleUrls: ['./arn-ria-details.component.scss']
})
export class ArnRiaDetailsComponent implements OnInit {

  advisorId:any;
  arnobjs = []
  globalData: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData(){
    this.settingsService.getArnGlobalData().subscribe((res)=>{
      this.globalData = res;
    });
    this.getArnDetails();
  }

  getArnDetails() {
    this.settingsService.getArnlist({advisorId: this.advisorId}).subscribe((data)=> {
      this.arnobjs = data || [];
    });
  }

  openArnDetails(value, data) {
    let popupHeaderText = !!data ? 'Edit Fixed deposit' : 'Add Fixed deposit';
    let fullData = {
      globalData: this.globalData,
      mainData: data || {}
    }

    const fragmentData = {
      flag: value,
      data: fullData,
      id: 1,
      state: 'open50',
      componentName: AddArnRiaDetailsComponent,
      popupHeaderText: popupHeaderText,
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getArnDetails()
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getGstApplicale(id) {
    if(this.globalData.gst_applicable_list)
      return this.globalData.gst_applicable_list.find((data) => data.id == id).type
  }

  getArnType(id) {
    if(this.globalData.arn_type_list)
      return this.globalData.arn_type_list.find((data) => data.id == id).type
  }

  getArnMasterType(id) {
    if(this.globalData.arn_type_master_list)
      return this.globalData.arn_type_master_list.find((data) => data.id == id).type
  }
}
