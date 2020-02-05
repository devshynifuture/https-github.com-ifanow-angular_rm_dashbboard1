import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-investment-plan',
  templateUrl: './add-investment-plan.component.html',
  styleUrls: ['./add-investment-plan.component.scss']
})
export class AddInvestmentPlanComponent implements OnInit {
  _inputData: any;
     
  displayedColumns: string[] = ['name', 'target', 'remaining'];
  dataSource = ELEMENT_DATA;

  displayedColumns2: string[] = ['name', 'amount', 'icon'];
  dataSource2 = ELEMENT_DATA2;

  constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }
  
  close(){
    let data=this._inputData;
     this.subInjectService.changeNewRightSliderState({ state: 'close',data });
   }

}

export interface PeriodicElement {
  name: string;
  target: string;
  remaining: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Equity', target: '3,26,250', remaining: '1,00,000'},
  { name: 'Debt', target: '1,08,750', remaining: '0'},
  
];


export interface PeriodicElement2 {
  name: string;
  amount: string;
  icon: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya birla sun life - Equity Savings Fund Regular Plan - Dividend reinvestment / 0980989898', amount: '3,26,250', icon: ''},
  
  
];