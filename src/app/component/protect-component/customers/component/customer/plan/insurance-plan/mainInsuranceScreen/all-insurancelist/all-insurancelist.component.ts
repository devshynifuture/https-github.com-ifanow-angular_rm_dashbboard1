import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddNewInsuranceComponent } from '../../add-new-insurance/add-new-insurance.component';
import { UtilService } from 'src/app/services/util.service';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { AddInsurancePlanningComponent } from '../../add-insurance-planning/add-insurance-planning.component';
import { AddInsuranceUpperComponent } from '../../add-insurance-upper/add-insurance-upper.component';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';
import { CurrentPolicyComponent } from '../../current-policy/current-policy.component';

@Component({
  selector: 'app-all-insurancelist',
  templateUrl: './all-insurancelist.component.html',
  styleUrls: ['./all-insurancelist.component.scss']
})
export class AllInsurancelistComponent implements OnInit {


  displayedColumns = ['pname', 'sum2', 'premium2', 'status', 'empty'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'premium', 'returns', 'advice'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  insuranceList = [{
    heading:'Life insurance',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/LIsmall.svg',
    familyMem :'Rahul Jain',
  }, {
    heading:'Health insurance',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/HIsmall.svg',
    familyMem :'Rahul Jain,Shilpa Jain',
  }, {
    heading:'Critical illness',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/CIsmall.svg',
    familyMem :'Rahul Jain',
  },{
    heading:'Cancer care',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/CCsmall.svg',
    familyMem :'Rahul Jain',
  },{
    heading:'Personal accident',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/PAsmall.svg',
    familyMem :'Rahul Jain',
  },{
    heading:'Fire insurance',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/FIsmall.svg',
    familyMem :'Rahul Jain',
  },{
    heading:'Householders',
    advice:'1,80,00,000',
    logo:'/assets/images/svg/Hsmall.svg',
    familyMem :'Rahul Jain',
  }]
  detailsInsurance: any;
  constructor(private subInjectService: SubscriptionInject, private eventService: EventService) {
  }

  isLoading = true;

  ngOnInit() {
    this.detailsInsurance = this.insuranceList[0]
  }
  openDetailsInsurance(insurance){
    this.detailsInsurance = insurance
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
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
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

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval' },
];

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

