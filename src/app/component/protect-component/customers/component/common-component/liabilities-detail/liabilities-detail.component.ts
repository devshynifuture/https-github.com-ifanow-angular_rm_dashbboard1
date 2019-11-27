import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-liabilities-detail',
  templateUrl: './liabilities-detail.component.html',
  styleUrls: ['./liabilities-detail.component.scss']
})
export class LiabilitiesDetailComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  dataSourceDetail = ELEMENT_DATA;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}

export interface PeriodicElement {
  name: string;
  position: string;

}


const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Owner', position: 'Rahul Jain'},
  {name: 'Loan type', position: 'LIC Jeevan Saral'},
  {name: 'Loan amount', position: '27,000'},
  {name: 'Loan outstanding', position: '8000'},
  {name: 'Tenure remaining', position: '5y 9m'},
  {name: 'Annual interest rate', position: '2.6%'},
  {name: 'EMI', position: '32,333'},
  {name: 'Financial institution', position: '20 years'},
  {name: 'Termination date', position: '23/09/2012'},
  {name: 'Original loan amount', position: '40,000,000'},
  {name: 'Original loan tenure', position: '20 years'},
  {name: 'Total interest paid till date', position: '46,546'},
  {name: 'Total principal paid till date', position: '54,654'},

];
