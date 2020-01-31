import {Component, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AddPlaninsuranceComponent} from './add-planinsurance/add-planinsurance.component';
import {AddSuggestPolicyComponent} from './add-suggest-policy/add-suggest-policy.component';
import {CurrentPolicyComponent} from './current-policy/current-policy.component';
import {AddInsurancePlanningComponent} from './add-insurance-planning/add-insurance-planning.component';

@Component({
  selector: 'app-insurance-plan',
  templateUrl: './insurance-plan.component.html',
  styleUrls: ['./insurance-plan.component.scss']
})
export class InsurancePlanComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'annual', 'ret', 'advice'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;

  constructor(private subInjectService: SubscriptionInject) {
  }

  isLoading = true;

  ngOnInit() {
  }

  openAddPlanInsurance(data) {
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

        }
      }
    );
  }

  insuranceplanning(data) {
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

        }
      }
    );
  }

  opensuggestpolicy(data) {
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

        }
      }
    );
  }

  opencurrentpolicies(data) {
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
  {position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval'},
];

export interface PeriodicElement1 {
  name: string;
  sum: string;
  annual: string;
  ret: string;
  advice: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {name: "LIC Jeevan Saral", sum: '20,00,000', annual: "27,000", ret: '4.78%', advice: 'Stop paying premiums'},
];

export interface PeriodicElement2 {

  name: string;
  annual: string;
  amt: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},
  {name: "LIC Jeevan Saral", annual: "-", amt: '12,000,00'},

];
