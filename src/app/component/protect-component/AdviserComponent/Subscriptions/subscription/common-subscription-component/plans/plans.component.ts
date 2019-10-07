import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import * as _ from "lodash";
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PlansComponent>, private subService: SubscriptionService) { }
  @Input() componentFlag: string;
  @Input() upperData;
  servicePlanData;
  mappedPlan = [];
  ngOnInit() {
    this.getPlansMappedToAdvisor();
  }
  getPlansMappedToAdvisor() {
    let obj = {
      'advisorid': 12345
    }
    this.subService.getPlansMappedToAdvisor(obj).subscribe(
      data => this.getPlansMappedToAdvisorResponse(data)
    )
  }
  getPlansMappedToAdvisorResponse(data) {
    console.log("service plan data", data)

    this.servicePlanData = data;
    this.servicePlanData.forEach(element => {
      if (element.isActive == 1) {
        this.mappedPlan.push(element);
      }
    });
  }
  dialogClose() {
    this.dialogRef.close();
  }
  selectServicePlan(data) {

    (data.isActive == 1) ? this.unmapPlanToService(data) : this.mapPlanToService(data);
  }
  mapPlanToService(data) {
    data.isActive = 1
    this.mappedPlan.push(data)
  }
  unmapPlanToService(data) {
    data.isActive = 0
    _.remove(this.mappedPlan, function (delData) {
      return delData.id == data.id;
    })
  }
  saveMappedPlans() {
   console.log("Mapped Plan",this.mappedPlan)
   console.log("clientId",this.upperData) 
    let obj={
      "planIds":[],
      "serviceId":this.upperData,
      "advisorId":12345
    }
   this.mappedPlan.forEach(planData=>{
     obj.planIds.push(planData.id)
   })
   console.log("Mapped Plans",obj)

   this.subService.mapPlanToServiceSettings(obj).subscribe(
     data =>console.log("mapped sucessfully",data)
   )
  }
}
