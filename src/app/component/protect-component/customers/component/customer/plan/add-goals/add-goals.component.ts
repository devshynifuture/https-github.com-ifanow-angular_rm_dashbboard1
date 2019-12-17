import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../plan.service';

@Component({
  selector: 'app-add-goals',
  templateUrl: './add-goals.component.html',
  styleUrls: ['./add-goals.component.scss']
})
export class AddGoalsComponent implements OnInit {
  goalTypeData: any;

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, private planService: PlanService) { }
  goalTypeFirstRowListData = [
    { id: 1, name: "Retirement", imageUrl: "GlobalRetirementGoalImage", isActive: 0 },
    { id: 2, name: "House", imageUrl: "GlobalHouseGoalImage", isActive: 0 },
    { id: 3, name: "Car", imageUrl: "GlobalCarGoalImage", isActive: 0 },
    { id: 4, name: "Marriage", imageUrl: "GlobalMarriageGoalImage", isActive: 0 },
    { id: 5, name: "Vacation", imageUrl: "GlobalVacationGoalImage", isActive: 0 }
  ];
  goalTypeSecondRowListData = [
    { id: 6, name: "Education", imageUrl: "GlobalEducationGoalImage", isActive: 0 },
    { id: 7, name: "Emergency", imageUrl: "GlobalEmergencyGoalImage", isActive: 0 },
    { id: 8, name: "Wealth creation", imageUrl: "GlobalWealthCreationGoalImage", isActive: 0 },
    { id: 9, name: "Big spends", imageUrl: "GlobalBigSpendGoalImage", isActive: 0 },
    { id: 10, name: "Others", imageUrl: "GlobalOthersGoalImage", isActive: 0 }
  ];
  ngOnInit() {
    // this.getGoalGlobalData();
  }
  close(state) {
    const fragmentData = {
      // direction: 'top',
      // componentName: AddGoalsComponent,
      state: 'close'
    };
    this.eventService.changeUpperSliderState(fragmentData)

  }
  getGoalGlobalData() {
    let obj = {}
    this.planService.getGoalGlobalData(obj).subscribe(
      data => this.getGoalGlobalDataRes(data),
      err => this.eventService.openSnackBar(err)
    )

  }
  getGoalGlobalDataRes(data) {
    console.log(data);
    // this.goalTypeFirstRowListData = data.slice(0, 5);
    // this.goalTypeSecondRowListData = data.slice(5, 10);
    console.log(`first  :${this.goalTypeFirstRowListData}' second:${this.goalTypeSecondRowListData}`)
  }
  addSelectedGoalType(data) {
    console.log(data);
    this.goalTypeData = data;
  }
  getGoalTypeData(data) {
    this.goalTypeData = data;
  }
}
