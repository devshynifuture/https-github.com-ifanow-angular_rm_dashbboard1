import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from '../protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'app-change-payee',
  templateUrl: './change-payee.component.html',
  styleUrls: ['./change-payee.component.scss']
})
export class ChangePayeeComponent implements OnInit {

  @Input() upperData;
  PayeeSettingData: any;
  dataSub: any;
  dataObj;
  getRowData: any;
  isSelectedPlan: any;
  arraTosend: any;
  dataMatSlider: any;
  constructor(public subInjectService: SubscriptionInject,public subService:SubscriptionService,public eventService:EventService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data=>this.getPayeeData(data)
    );
  }

  ngOnInit() {
    console.log("change payee upperData",this.upperData)
  }
  Close(state)
  {
    this.subInjectService.rightSideData(state);
    this.subInjectService.rightSliderData(state);
  }
  getPayeeData(data){
    this.getRowData = data
    this.dataObj={
      'clientId': this.getRowData.clientId,
      'subId':this.getRowData.id
    }
    this.subService.getPayeerProfile(this.dataObj).subscribe(
      data=> this.getPayeeProfileRes(data)
    )

    }

  getPayeeProfileRes(data){
    console.log("getPayeeProfileRes data",data)
    this.PayeeSettingData=data;
  }
  onInputChange(event: MatSliderChange,singlePlan) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.dataMatSlider = event.value
  }
  saveChangePayeeSetting(){
    let obj = []
    this.PayeeSettingData.forEach(element => {
     if(element.selected == 1 || element.selected == true){
      let obj1={
        id:element.id,
        subscriptionId:this.getRowData.id
      }
      obj.push(obj1)
     }
    });
    console.log('obj ====',obj)
    this.subService.changePayeeSetting(obj).subscribe(
      data=> this.changePayeeSettingRes(data)
    )
  }
  changePayeeSettingRes(data){
    console.log('changePayeeSettingRes',data)
    if(data ==  1){
      this.eventService.openSnackBar("Payee updated successfully","OK")
      this.Close('close')
    }
  }
  selectedPayee(data,singlePlan)
  {
    console.log(data)
    if(data == true || data == 1){
      singlePlan.selected = false;
    }else {
      singlePlan.selected = true;
    }
  }
}
