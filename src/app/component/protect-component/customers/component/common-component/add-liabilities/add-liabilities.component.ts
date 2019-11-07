import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-liabilities',
  templateUrl: './add-liabilities.component.html',
  styleUrls: ['./add-liabilities.component.scss']
})
export class AddLiabilitiesComponent implements OnInit {
  displayedColumns: string[] = [  'name', 'amountTable'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = [  'year', 'principal', 'interest', 'totalPaid', 'balance'];
  dataSource1 = ELEMENT_DATA1;

  constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }

  close(){
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }
}

export interface PeriodicElement {
  name: string;
  amountTable: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Loan amount', amountTable: '40,00,000'},
  { name: 'Interest %', amountTable: '8.75%'},
  { name: 'Loan period', amountTable: '20 years'},
  { name: 'Payment frequency', amountTable: 'Monthly'},
  { name: 'Commencement date', amountTable: '16/08/2014'},
];


export interface PeriodicElement1 {
  year: string;
  principal: string;
  interest: string;
  totalPaid: string;
  balance: string;
  
}


const ELEMENT_DATA1: PeriodicElement1[] = [
  { year: '2019', principal: '1,868.07', interest: '8,736.45', totalPaid: '10,604.52', balance: '3,98,131.93' },
  { year: '2020', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2021', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2022', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
  { year: '2023', principal: '7,893.09', interest: '34,524.99', totalPaid: '42,418.08', balance: '3,90,238.84' },
];