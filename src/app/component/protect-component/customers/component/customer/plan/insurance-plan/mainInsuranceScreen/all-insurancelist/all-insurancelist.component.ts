import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddNewInsuranceComponent } from '../../add-new-insurance/add-new-insurance.component';
import { UtilService, LoaderFunction } from 'src/app/services/util.service';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { AddInsurancePlanningComponent } from '../../add-insurance-planning/add-insurance-planning.component';
import { AddInsuranceUpperComponent } from '../../add-insurance-upper/add-insurance-upper.component';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';
import { CurrentPolicyComponent } from '../../current-policy/current-policy.component';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-all-insurancelist',
  templateUrl: './all-insurancelist.component.html',
  styleUrls: ['./all-insurancelist.component.scss']
})
export class AllInsurancelistComponent implements OnInit {


  displayedColumns = ['pname', 'sum2', 'premium2', 'status', 'empty'];
  displayedColumns1 = ['name', 'sum', 'premium', 'returns', 'advice'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  dataSource: any = new MatTableDataSource();
  insurancePlanningList=[{},{},{}]
  insuranceList = [{
    heading: 'Life insurance',
    logo: '/assets/images/svg/LIsmall.svg',
  }, {
    heading: 'Health insurance',
    logo: '/assets/images/svg/HIsmall.svg',
  }, {
    heading: 'Critical illness',
    logo: '/assets/images/svg/CIsmall.svg',
  }, {
    heading: 'Cancer care',
    logo: '/assets/images/svg/CCsmall.svg',
  }, {
    heading: 'Personal accident',
    logo: '/assets/images/svg/PAsmall.svg',
  }, {
    heading: 'Fire insurance',
    logo: '/assets/images/svg/FIsmall.svg',
  }, {
    heading: 'Householders',
    logo: '/assets/images/svg/Hsmall.svg',
  }]
  detailsInsurance: any;
  clientId: any;
  advisorId: any;
  insuranceLoader: boolean;
  counter: any;
  data: Array<any> = [{}, {}, {}];
  // showIsurance: boolean = false;
  showIsurance: boolean = true; //page initial loads blank ..
  constructor(private subInjectService: SubscriptionInject,
    private planService: PlanService,
    private eventService: EventService,) {
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
  }

  isLoading = true;
  isLoadingPlan = true;
  ngOnInit() {
    // this.detailsInsurance = {}
    this.getInsuranceList()
  }
  openDetailsInsurance(insurance) {
    console.log('insurance',insurance)
    this.detailsInsurance = insurance
    this.showIsurance = true
  }
  getInsuranceList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.loader(1);
    this.isLoadingPlan = true;
    this.planService.getInsurancePlaningList(obj).subscribe(
      data => this.getInsurancePlaningListRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.insuranceLoader = true;
        this.isLoadingPlan = false;
         this.showIsurance = false
         this.loader(-1);
      }
    );
  }
  getOutput(value){
    if(value){
      this.getInsuranceList()
    }
  }
  getInsurancePlaningListRes(data) {
    this.loader(-1);
    if(data){
      console.log('incurance list', data)
      this.dataSource = data
      this.dataSource.forEach(element => {
        if (element.insuranceType == 1) {
          element.heading = 'Life insurance'
          element.logo = '/assets/images/svg/LIsmall.svg'
        } else if (element.insuranceType == 5) {
          element.heading = 'Health insurance'
          element.logo = '/assets/images/svg/HIsmall.svg'
        } else if (element.insuranceType == 6) {
          element.heading = 'Critical illness'
          element.logo = '/assets/images/svg/CIsmall.svg'
        } else if (element.insuranceType == 4) {
          element.heading = 'Cancer care'
          element.logo = '/assets/images/svg/CCsmall.svg'
        } else if (element.insuranceType == 10) {
          element.heading = 'Fire insurance'
          element.logo = '/assets/images/svg/FIsmall.svg'
        } else if (element.insuranceType = 11) {
          element.heading = 'Householders'
          element.logo = '/assets/images/svg/Hsmall.svg'
        } else if (element.insuranceType = 7) {
          element.heading = 'Personal accident'
          element.logo = '/assets/images/svg/PAsmall.svg'
        }
      });
      console.log(this.dataSource)
      this.insuranceList = this.dataSource
      this.insurancePlanningList =this.dataSource
      this.detailsInsurance = this.insuranceList[0]
      this.showIsurance = true;
    }else{
      this.showIsurance = false;
    }
  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  addnewinsurance(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openAddgoals',
      id: 1,
      data,
      direction: 'top',
      componentName: AddNewInsuranceComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  openAddPlanInsurance(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'addPlanInsurance',
      data,
      componentName: AddPlaninsuranceComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }

  insuranceplanning(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'addPlanInsurance',
      data,
      componentName: AddInsurancePlanningComponent,
      id: 1,
      state: 'open70',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }
  openUpperInsurance(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: AddInsuranceUpperComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          if(upperSliderData['data'] == true ){
            this.getInsuranceList();
          }
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
  stopLoader(value){
    if(value){
      this.isLoadingPlan = false;
    }
  }
  opensuggestpolicy(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'opensuggestpolicy',
      data,
      componentName: AddSuggestPolicyComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

        }
      }
    );
  }

  opencurrentpolicies(data) {
    this.isLoading = true;
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data,
      componentName: CurrentPolicyComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.isLoading = false;

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
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval' },
// ];

export interface PeriodicElement1 {
  name: string;
  sum: string;
  premium: string;
  returns: string;
  advice: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: "LIC Jeevan Saral", sum: '20,00,000', premium: "27,000", returns: '4.78%', advice: 'Stop paying premiums' },
];

export interface PeriodicElement2 {

  name: string;
  annual: string;
  amt: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },
  { name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00' },

];

