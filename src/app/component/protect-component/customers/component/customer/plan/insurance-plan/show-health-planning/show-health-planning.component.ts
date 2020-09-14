import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SuggestHealthInsuranceComponent } from '../suggest-health-insurance/suggest-health-insurance.component';
import { AddHealthInsuranceComponent } from '../add-health-insurance/add-health-insurance.component';
import { AddInsuranceUpperComponent } from '../add-insurance-upper/add-insurance-upper.component';
import { PlanService } from '../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-show-health-planning',
  templateUrl: './show-health-planning.component.html',
  styleUrls: ['./show-health-planning.component.scss']
})
export class ShowHealthPlanningComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'advice', 'icons'];
  dataSource = ELEMENT_DATA;
  inputData: any;
  showInsurance: any;

  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  clientId: any;
  advisorId: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private custumService: CustomerService,
    private utils: UtilService,
    private eventService: EventService,
    private planService:PlanService
  ) { }


  @Input()
  set data(data) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    console.log('insurance data', this.inputData)
    this.showInsurance = this.inputData
    this.getStepOneAndTwoData();
  }
  getStepOneAndTwoData(){
    let obj = {
      id: this.inputData.id,
      insuranceType:this.inputData.insuranceType
    }
    this.planService.getGeneralInsuranceNeedAnalysis(obj).subscribe(
      data => {
        if(data){
          if (data) {
            this.dataSource =this.getFilterData(data.current) ;
            this.dataSource1 =this.getFilterData(data.suggested) ;
            console.log(data);
          }
          this.dataSource = data.current;                                                                                                                                                                                                                                                                                                                                                                                                             
        }                                                                                                                                                                                                                                                                                                                                                                                                             
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  getFilterData(array){
    if(array){
      array.forEach(singleInsuranceData => {
        if (singleInsuranceData.insuranceDetails && singleInsuranceData.insuranceDetails.insuredMembers.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.insuranceDetails.insuredMembers[0].name;
          singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insuranceDetails.insuredMembers[0].sumInsured;
          if (singleInsuranceData.insuranceDetails.insuredMembers.length > 1) {
            for (let i = 1; i < singleInsuranceData.insuranceDetails.insuredMembers.length; i++) {
              if (singleInsuranceData.insuranceDetails.insuredMembers[i].name) {
                const firstName = (singleInsuranceData.insuranceDetails.insuredMembers[i].name as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
                const firstSumInsured = (singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured as string).split(' ')[0];
                singleInsuranceData.displayHolderSumInsured += ', ' + firstSumInsured;
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderName = '';
          singleInsuranceData.displayHolderSumInsured = '';
        }
      });
    }else{
      array=[]
    }

    return array;
  }
  close(data) {
    const fragmentData = {
      direction: 'top',
      componentName: ShowHealthPlanningComponent,
      state: 'close',
      data,
    };

    this.eventService.changeUpperSliderState(fragmentData);
  }
  // closeUpper(data){
  //   const fragmentData = {
  //     direction: 'top',
  //     componentName: AddInsuranceUpperComponent,
  //     state: 'close',
  //     data,
  //   };

  //   this.eventService.changeUpperSliderState(fragmentData);
  // }

  openSuggestHealth(data) {
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: SuggestHealthInsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  openHelthInsurance(data) {
    if (data == null) {
      data = {}
      data.showExisting = true
    } else {
      data.showExisting = true
    }
    data.flag = "suggestExistingPolicy";
    const fragmentData = {
      flag: 'suggestExistingPolicy',
      data,
      componentName: AddHealthInsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getStepOneAndTwoData();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  advice: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Apollo Munich Optima Restore', name: '27,290/year', weight: 'Rahul Jain | 38Y',
    symbol: '5,00,000', advice: 'Port policy'
  },

];

export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'ICICI Lombard Health Suraksha (Recommended)',
    name: '32,300/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
  {
    position: 'HDFC Ergo Health Super (Option 2)',
    name: '35,100/year', weight: 'Rahul Jain | 38Y', symbol: '20,00,000'
  },
];