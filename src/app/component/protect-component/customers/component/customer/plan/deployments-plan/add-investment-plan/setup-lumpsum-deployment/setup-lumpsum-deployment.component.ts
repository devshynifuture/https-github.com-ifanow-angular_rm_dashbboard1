import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-setup-lumpsum-deployment',
  templateUrl: './setup-lumpsum-deployment.component.html',
  styleUrls: ['./setup-lumpsum-deployment.component.scss']
})
export class SetupLumpsumDeploymentComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['name', 'weight', 'height', 'test', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  advisorId: any;
  clientId: any;
  filterSchemeData: any;
  constructor(private subInjectService: SubscriptionInject, private planService: PlanService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.filterScheme();
  }
  filterScheme() {
    let obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.planService.getFilterGoalScheme(obj).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          element['name'] = ''
          element.forEach(singleData => {
            switch (true) {
              case (singleData.categoryId == 1):
                element.name = "DEBT";
                break;
              case (singleData.categoryId == 2):
                element.name = "EQUITY";
                break;
              default:
                console.log("Test")
            }
          });
        });
        this.filterSchemeData = data;
      }
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity mutual funds', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: '     Debt mutual funds', name: '50,000', weight: '0' },

];
export interface PeriodicElement2 {
  name: string;
  // position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya birla sun life - Equity Savings Fund Regular Plan - Dividend reinvestment / 0980989898', weight: '50,000' },

];
