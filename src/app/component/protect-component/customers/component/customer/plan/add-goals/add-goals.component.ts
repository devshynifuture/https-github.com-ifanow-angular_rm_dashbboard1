import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {PlanService} from '../plan.service';
import {AuthService} from 'src/app/auth-service/authService';
import { UtilService, LoaderFunction } from 'src/app/services/util.service';
import { CustomerService } from '../../customer.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { AppConstants } from 'src/app/services/app-constants';

@Component({
  selector: 'app-add-goals',
  templateUrl: './add-goals.component.html',
  styleUrls: ['./add-goals.component.scss'],
  providers: [LoaderFunction]
})
export class AddGoalsComponent implements OnInit {
  goalTypeData: any;
  showGoalType: any;
  goalTypeFirstRowListData: any;
  goalTypeSecondRowListData: any;
  advisorId: any;
  familyList:any[] = [];
  @Input() data;
  clientName: string;
  clientId: any;

  constructor(
    public subInjectService: SubscriptionInject, 
    private eventService: EventService, 
    private planService: PlanService,
    private utilService: UtilService,
    private peopleService: PeopleService,
    public loaderFn: LoaderFunction
  ) {
    let clientData = AuthService.getClientData();
    this.clientName = clientData.name;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  ngOnInit() {
    this.loadGlobalGoalData();
    this.getFamilyMembersList();
  }

  close() {
    this.eventService.changeUpperSliderState({state: 'close'});
  }

  // load goal types and related images to display
  // TODO:- create restrictive mechanism for failures of apis
  loadGlobalGoalData() {
    let advisorObj = {
      advisorId: this.advisorId
    }
    this.loaderFn.increaseCounter();
    this.planService.getGoalGlobalData(advisorObj).subscribe(
      data => this.getGoalGlobalDataRes(data),
      error => {
        this.eventService.showErrorMessage(error);
        this.loaderFn.decreaseCounter();
      }
    )
  }



  getFamilyMembersList() {
    const obj = {
      clientId: this.clientId,
    };
    this.loaderFn.increaseCounter();
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.familyList = data;
        } else {
          this.familyList = [];
        }
        this.familyList = this.familyList.map(fam => {
          return {
            ...fam,
            relationshipId: fam.familyMemberType
          }
        })
        this.familyList = this.familyList.sort((a, b) => {
          return a.relationshipId - b.relationshipId;
        });
        this.familyList = this.utilService.calculateAgeFromCurrentDate(this.familyList);
        this.loaderFn.decreaseCounter();
      },
      err => {
        this.familyList = [];
        this.eventService.openSnackBar(err, "Dismiss")
        this.loaderFn.decreaseCounter();
        console.error(err);
      }
    );
  }

  // Set questionnaires for all the and divide the goal set into two rows
  // TODO:- improve ui such that we dont need to divide it into two rows.
  getGoalGlobalDataRes(data) {
    data.forEach(element => {
      switch (element.id) {
        case AppConstants.RETIREMENT_GOAL: // Retirement
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'Age you want to retire?',
            Q2: 'Your current monthly expenses?',
            Q5: "At retirement, by what % will the expenses change?",
            Q6: "Milestones you'd also like to plan for (optional)",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 60,
            minCostReduction: 0,
            maxCostReduction: -50,
            minCost: 500000,
            maxCost: 100000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            ageIncreament: 5,
            minReduction: -20,
            cost: 7500000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.HOUSE_GOAL: // House
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'When do you want to buy house?',
            Q2: "House's cost as on today?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 60,
            minCost: 500000,
            maxCost: 100000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 7500000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.CAR_GOAL: // Car
          element.questions = {
            Q1: 'When do you want to buy car?',
            Q2: "Car's cost as on today?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 20,
            minCost: 500000,
            maxCost: 50000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 500000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.MARRIAGE_GOAL: // Marriage
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'Member"s age at the time of marriage?',
            Q2: 'Marriage"s expenses as on today?',
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAge: 18,
            maxAge: 60,
            minCost: 100000,
            maxCost: 100000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 3000000,
            planningForRelative: [AppConstants.RELATIONSHIP_SON,AppConstants.RELATIONSHIP_DAUGHTER], // children
          }
          break;
        case AppConstants.VACATION_GOAL: // Vacation
        element.questions = {
          Q1: 'Which year you plan to travel',
          Q2: 'Travel expense in today\'s value',
          Q3: 'Give this goal a name',
          Q4: 'Notes'
        }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 50,
            minCost: 5000,
            maxCost: 1000000,
            showAge: false,
            placeHolder: 'Year'
          }
          element.defaults = {
            gap: 10,
            cost: 75000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.EDUCATION_GOAL: // Education
        element.questions = {
          Q: 'Who are you planning this for?',
          Q1: 'Member\'s age at the time of course?',
          Q2: 'Annual Course expenses in today\'s value',
          Q3: 'Give this goal a name',
          Q4: 'Notes'
        }
          element.validations = {
            minAge: 2,
            maxAge: 60,
            minAgeFromPresent: 0,
            maxAgeFromPresent: 0,
            minCost: 50000,
            maxCost: 50000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            gap: 5,
            cost: 3000000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF,AppConstants.RELATIONSHIP_SON,AppConstants.RELATIONSHIP_DAUGHTER], // children // abhishek said self too
          }
          break;
        case AppConstants.EMERGENCY_GOAL: // Emergency
          element.questions = {
            Q1: 'Set a time frame to achieve this fund',
            Q2: 'Emergency fund you want to accumulate?',
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAge: 1,
            maxAge: 60,
            minCost: 10000,
            maxCost: 10000000,
            showAge: true, // here age is true as we want fixed numbers of months
            placeHolder: 'Months'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 500000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.WEALTH_CREATION_GOAL: // Wealth Creation
          element.questions = {
            Q: 'Who are you planning this for?',
            Q1: 'When do you want to it?',
            Q2: "What's the target amount?",
            Q3: 'Give this goal a name',
            Q4: 'Notes'
          }
          element.validations = {
            minAgeFromPresent: 2,
            maxAgeFromPresent: 28,
            minCost: 75000,
            maxCost: 100000000,
            showAge: true,
            placeHolder: 'Age'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 500000,
            planningForRelative: [AppConstants.RELATIONSHIP_SON,AppConstants.RELATIONSHIP_DAUGHTER], // children
          }
          break;
        case AppConstants.BIG_SPEND_GOAL: // Big Spends
          element.questions = {
            Q1: 'When year do you plan this to happen?',
            Q2: 'How much does it cost today',
            Q3: 'Give this goal a name',
            Q4: 'notes'
          }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 30,
            minCost: 100000,
            maxCost: 10000000,
            showAge: false,
            placeHolder: 'Year'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 1000000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        case AppConstants.OTHERS_GOAL: // Others
          element.questions = {
            Q1: 'When do you want to achieve this?',
            Q2: 'How much does it cost today',
            Q3: 'Give this goal a name',
            Q4: 'notes'
          }
          element.validations = {
            minAgeFromPresent: 0,
            maxAgeFromPresent: 30,
            minCost: 500000,
            maxCost: 100000000,
            showAge: false,
            placeHolder: 'Year'
          }
          element.defaults = {
            ageIncreament: 5,
            cost: 75000,
            planningForRelative: [AppConstants.RELATIONSHIP_SELF], // self
          }
          break;
        default:
          break;
      }
    });
    this.goalTypeFirstRowListData = data.slice(0, 5);
    this.goalTypeSecondRowListData = data.slice(5, 10);
    this.loaderFn.decreaseCounter();
  }
  
  // TODO:- understand implementation of retirement goal
  setGoalTypeData(data) {
    if(this.validateIfUserAllowedToCreateGoal(data)){
      this.goalTypeData = data;
      this.showGoalType = [AppConstants.VACATION_GOAL, AppConstants.EDUCATION_GOAL].includes(data.id) ? 'multiYear' : 'singleYear' 
    }
  }

  validateIfUserAllowedToCreateGoal(goalTypeData) {
    // family validation
    let owner = this.familyList.filter((member) => goalTypeData.defaults.planningForRelative.includes(member.relationshipId));
    if(owner.length == 0) {
      this.eventService.openSnackBar("No family member found for such goal", "Dismiss");
      return false;
    }
    return true;

    // age validation can also be added?
  }

  cancelGoal(){
    this.goalTypeData = undefined;
    this.showGoalType = undefined;
  }
}
