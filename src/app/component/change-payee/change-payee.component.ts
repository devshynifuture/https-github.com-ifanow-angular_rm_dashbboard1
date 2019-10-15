import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SubscriptionService } from '../protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';

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
    this.subInjectService.rightSideData(state)
    this.subInjectService.rightSliderData(state)
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
  saveChangePayeeSetting(){
    // this.PayeeSettingData.forEach(element => {
    //   if(element.selected == 1 || element.selected == true){
    //   this.arraTosend.push(element.id)
    //   }
    // });
  let obj=[{
    id:this.isSelectedPlan.id,
    subscriptionId:this.getRowData.id
  }]
    this.subService.changePayeeSetting(obj).subscribe(
      data=> this.changePayeeSettingRes(data)
    )
  }
  changePayeeSettingRes(data){
    console.log('changePayeeSettingRes',data)
    if(data ==  1){
      this.Close('close')
    }
  }
  selectedPayee(data,singlePlan)
  {
    singlePlan.selected = true;
    console.log('selected value',data)
    console.log('selected singlePlan',singlePlan);
    singlePlan.selected = true;
    this.isSelectedPlan=singlePlan;
  }
}
