import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-planinsurance',
  templateUrl: './add-planinsurance.component.html',
  styleUrls: ['./add-planinsurance.component.scss']
})
export class AddPlaninsuranceComponent implements OnInit {
  _inputData: any;   
  displayedColumns: string[] = ['position', 'details', 'outstanding'];
  dataSource = ELEMENT_DATA;   
  displayedColumns1: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['details', 'amount', 'consider', 'edit'];
  dataSource2 = ELEMENT_DATA2;               
   constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }
  panelOpenState;
  close(){
    if(this._inputData){
      let data=this._inputData
      this.subInjectService.changeNewRightSliderState({ state: 'close',data });
    }
  }

}


export interface PeriodicElement {
  position: string;
  details: string;
  outstanding: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '', details: 'Home loan | ICICI bank', outstanding: '12,00,000'},
   
];


export interface PeriodicElement1 {
  details: string;
  amount: string;
  consider: string;
  edit: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {details: 'Food & groceries', amount: '3,60,000', consider: '100%', edit: ''},
  {details: 'Entertainment', amount: '2,70,000', consider: '50%', edit: ''},
  {details: 'Commuting', amount: '3,00,000', consider: '0', edit: ''},
   
];

export interface PeriodicElement2 {
  details: string;
  amount: string;
  consider: string;
  edit: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {details: 'shreya higher education', amount: '25,00,000', consider: '100%', edit: ''},
  {details: 'shreya marriage ', amount: '12,00,000', consider: '50%', edit: ''},
  {details: 'Legacy planning (Retirment)', amount: '36,00,000', consider: '0', edit: ''},
   
];