import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-biller-settings',
  templateUrl: './biller-settings.component.html',
  styleUrls: ['./biller-settings.component.scss']
})
export class BillerSettingsComponent implements OnInit {
  // obj1: { advisorId: number };
  
  billerSettingData: any;
  dataSub: any;
  dataObj: any;
  isSelectedPlan: any;
  getSubsciption: any;
  getDataRow: any;
  advisorId;
  @Input() set clientData(clientData)
  { 
    this.advisorId = AuthService.getAdvisorId();
    this.getBillerData(clientData)
  };
  constructor(public subInjectService: SubscriptionInject, public subService: SubscriptionService, public eventService: EventService) {

  }

  ngOnInit() {
    
  }

  getBillerData(data) {
    
    this.getDataRow = data;
    this.dataObj = {
      advisorId: this.advisorId,
      subId: this.getDataRow.id
    };
    this.subService.getBillerProfile(this.dataObj).subscribe(
      data => this.getBillerProfileRes(data)
    );
    this.getSubsciption = this.getDataRow;
  }

  saveChangeBillerSetting() {
    const obj = {
      id: this.isSelectedPlan.id,
      subscriptionId: this.getSubsciption.id
    };
    this.subService.changeBillerSetting(obj).subscribe(
      data => this.changeBillerSettingData(data)
    );
  }

  changeBillerSettingData(data) {
    console.log('data', data);
    if (data == true) {
      this.eventService.openSnackBar('Biller is updated', 'OK');
      this.Close('close');
    }
  }

  getBillerProfileRes(data) {
    console.log('getBillerProfileRes data', data);
    this.billerSettingData = data;
    if(this.billerSettingData.length==1)
    {
      this.billerSettingData[0].selected=true
    }
    else{
      this.billerSettingData.forEach(element => {
        element.selected = (element.selected == 0) ? false : true;
        this.isSelectedPlan=element
      });
    }  
  }

  selectedBiller(data, singlePlan) {
    singlePlan.selected = true;
    console.log('selected value', data);
    console.log('selected singlePlan', singlePlan);
    this.billerSettingData.forEach(element => {
      element.selected = false;
    });
    singlePlan.selected = true;
    this.isSelectedPlan = singlePlan;
  }

  Close(state) {
    this.subInjectService.rightSideData(state);
    this.subInjectService.rightSliderData(state);
  }

  editProfileData(data) {
  }
}
