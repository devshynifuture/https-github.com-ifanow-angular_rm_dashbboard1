import { Component, OnInit,Input } from '@angular/core';
import { UpperSliderComponent } from '../upper-slider/upper-slider.component';
import { SubscriptionService } from '../../../subscription.service';
import { MatDialogRef } from '@angular/material';
import * as _ from "lodash";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<ServicesComponent>,private upper:UpperSliderComponent,private subService:SubscriptionService) { }
  @Input() componentFlag:string;
  planServiceData;
  mappedData;
  ngOnInit() {
  this.getPlanServiceData();
  this.mappedData=[];
}
   getPlanServiceData()
   {
     let obj={
       'advisorId':4747,
       'planId':0
     }
     this.subService.getSettingPlanServiceData(obj).subscribe(
       data =>this.getPlanServiceDataResponse(data)
     )
   }
   getPlanServiceDataResponse(data)
   {
     console.log(data)
     this.planServiceData=data;
   }
   selectService(data,index)
   {  
     (data.selected)?this.unmapPlanToService(data):this.mapPlanToService(data,index);
     console.log(data)
   }
   dialogClose(){
    this.dialogRef.close();
  }
  mapPlanToService(data,index)
  {
    data.selected=true;
    this.mappedData.push(data)
    console.log(this.mappedData.length)
  }
  unmapPlanToService(data)
  {
    data.selected=false;
     _.remove(this.mappedData,function(delData)
     {
       return  delData.id ==data.id;
     })
     console.log(this.mappedData) 
  } 
  savePlanMapToService()
  {
    let obj=[];
    this.mappedData.forEach(element => {
       let data={
        "advisorId": 2735,
        "global": element.global,
        "id": element.id,
        "planId": 10
       }
       obj.push(data)
    });
    console.log(obj)
    this.subService.mapServiceToPlanData(obj).subscribe(
      data=>console.log(data)
    );
  }
}
