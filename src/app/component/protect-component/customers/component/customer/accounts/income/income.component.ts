import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  displayedColumns = ['no', 'owner', 'type', 'amt','income','till','rate','status','icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }
  viewMode;
  ngOnInit() {
    this.viewMode="tab1"
  }

}
export interface PeriodicElement {
  no: string;
  owner: string;
  type: string;
  amt: string;
  income:string;
  till:string;
  rate:string;
  status:string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", owner: 'Rahul Jain', type: "Salaried", amt: '60,000',income:"18/09/2021",till:"Retirement",rate:"8.40%",status:"MATURED"},
  {no: "2", owner: 'Rahul Jain', type: "Salaried", amt: '60,000',income:"18/09/2021",till:"Retirement ",rate:"8.40%",status:"LIVE"},
  {no: "", owner: 'Total', type: "", amt: '1,60,000',income:"",till:"",rate:"",status:""},
];     