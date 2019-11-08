import { Component, OnInit } from '@angular/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.scss']
})
export class AddInsuranceComponent implements OnInit {
  displayedColumns: string[] = [  'name', 'amountTable'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = [  'name', 'amountTable'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns2: string[] = [  'name', 'amountTable'];
  dataSource2 = ELEMENT_DATA2;

  displayedColumns3: string[] = [  'tpye', 'year', 'amountTable'];
  dataSource3 = ELEMENT_DATA3;

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
  { name: 'Life assured', amountTable: 'Rahul Jain'},
  { name: 'Proposer', amountTable: 'Aryan Jain'},
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral'},
  { name: 'Policy type', amountTable: 'Money back'},
  { name: 'Policy number', amountTable: '9090889898'},
  { name: 'Life assured', amountTable: 'Rahul Jain'},
  { name: 'Proposer', amountTable: 'Aryan Jain'},
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral'},
  { name: 'Policy type', amountTable: 'Money back'},
  { name: 'Policy number', amountTable: '9090889898'},
  { name: 'Life assured', amountTable: 'Rahul Jain'},
  { name: 'Proposer', amountTable: 'Aryan Jain'},
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral'},
  { name: 'Policy type', amountTable: 'Money back'},
  { name: 'Policy number', amountTable: '9090889898'},
];


export interface PeriodicElement1 {
  name: string;
  amountTable: string;
  
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Life assured', amountTable: 'Rahul Jain'},
  { name: 'Proposer', amountTable: 'Aryan Jain'},
  { name: 'Policy name', amountTable: 'LIC Jeevan Saral'},
  { name: 'Policy type', amountTable: 'Money back'},
  { name: 'Policy number', amountTable: '9090889898'}, 
];



export interface PeriodicElement2 {
  name: string;
  amountTable: string;
  
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Life assured', amountTable: 'Rahul Jain'},
  { name: 'Proposer', amountTable: '-'},
  { name: 'Policy name', amountTable: '-'},
   
];



export interface PeriodicElement3 {
  tpye: string;
  year: string;
  amountTable: string;
  
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { tpye: 'Survival benefit', year:'2024' , amountTable: '37,660'},
  { tpye: 'Survival benefit', year:'2029' , amountTable: '37,660'},
  { tpye: 'Survival benefit', year:'2034' , amountTable: '37,660'},
  { tpye: 'Survival benefit', year:'2049' , amountTable: '37,660'},
   
   
];