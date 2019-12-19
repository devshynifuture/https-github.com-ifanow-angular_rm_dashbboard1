import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PlanService } from '../plan.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-goals',
  templateUrl: './add-goals.component.html',
  styleUrls: ['./add-goals.component.scss']
})
export class AddGoalsComponent implements OnInit {
  goalTypeData: any;
  goalFlag: any;
  goalTypeFirstRowListData: any;
  goalTypeSecondRowListData: any;
  advisorId: any;

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, private planService: PlanService) { }
  // goalTypeFirstRowListData = [
  //   { id: 1, name: "Retirement", imageUrl: "GlobalRetirementGoalImage", isActive: 0 },
  //   {
  //     id: 2, name: "House", imageUrl: "GlobalHouseGoalImage", isActive: 0, 
  //   },
  //   {
  //     id: 3, name: "Car", imageUrl: "GlobalCarGoalImage", isActive: 0, questions: 
  //   },
  //   {
  //     id: 4, name: "Marriage", imageUrl: "GlobalMarriageGoalImage", isActive: 0, questions: 
  //   },
  //   { id: 5, name: "Vacation", imageUrl: "GlobalVacationGoalImage", isActive: 0 }
  // ];
  // goalTypeSecondRowListData = [
  //   { id: 6, name: "Education", imageUrl: "GlobalEducationGoalImage", isActive: 0 },
  //   {
  //     id: 7, name: "Emergency", imageUrl: "GlobalEmergencyGoalImage", isActive: 0, questions: 
  //   },
  //   {
  //     id: 8, name: "Wealth creation", imageUrl: "GlobalWealthCreationGoalImage", isActive: 0, questions: 
  //   },
  //   {
  //     id: 9, name: "Big spends", imageUrl: "GlobalBigSpendGoalImage", isActive: 0, questions: 
  //   },
  //   {
  //     id: 10, name: "Others", imageUrl: "GlobalOthersGoalImage", isActive: 0, questions: 
  //   }
  // ];
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getGoalGlobalData();
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
    let obj = {
      advisorId: this.advisorId
    }
    this.planService.getGoalGlobalData(obj).subscribe(
      data => this.getGoalGlobalDataRes(data),
      err => this.eventService.openSnackBar(err)
    )

  }
  getGoalGlobalDataRes(data) {
    data.forEach(element => {
      switch (element.id) {
        case 2:
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'When do you want to buy house?',
            Q2: "House's cost as on today?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          break;
        case 3:
          element.questions = {
            Q1: 'When do you want to buy car?',
            Q2: "Car's cost as on today?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          break;
        case 4:
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'Member"s age at the time of marriage?',
            Q2: 'Marriage"s expenses as on today?',
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          break;
        case 7:
          element.questions = {
            Q1: 'Set a time frame to achieve this fund',
            Q2: 'Emergency fund you want to accumulate?',
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          break;
        case 8:
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'When do you want to it?',
            Q2: "wahts the target amount?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          break;
        case 9:
          element.questions = {
            Q1: 'When year do you plan this to happen?',
            Q2: 'How much does it cost today',
            Q3: 'Give this goal a name',
            Q4: 'notes'
          }
          break;
        case 10:
          element.questions = {
            Q1: 'When do you want to achieve this?',
            Q2: 'How much does it cost today',
            Q3: 'Give this goal a name',
            Q4: 'notes'
          }
          break;
        default:
          console.log(element.id)
      }
    });
    console.log(data);
    this.goalTypeFirstRowListData = data.slice(0, 5);
    this.goalTypeSecondRowListData = data.slice(5, 10);
    console.log(`first  :${this.goalTypeFirstRowListData}' second:${this.goalTypeSecondRowListData}`)
  }
  addSelectedGoalType(data) {
    console.log(data);
    this.goalTypeData = data;
  }
  getGoalTypeData(data) {
    this.goalTypeData = data;
    this.goalFlag = (data.id == 1 || data.id == 5 || data.id == 6) ? false : true;
  }
}
