import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})

export class LiabilitiesComponent implements OnInit {
  displayedColumns = ['no', 'name', 'type', 'loan','ldate','today','ten','rate','emi','fin','status','icons'];
  dataSource = ELEMENT_DATA;

  constructor() { }
 
 
  viewMode;
  ngOnInit() {
    this.viewMode="tab1"
  }

}

export interface PeriodicElement {
  no: string;
  name: string;
  type: string;
  loan: string;
  ldate:string;
  today:string;
  ten:string;
  rate:string;
  emi:string;
  fin:string;
  status:string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", name: 'Rahul Jain', type: "Home loan", loan: '60,000',ldate:"18/09/2021",today:"1,00,000",ten:"5y 9m",rate:"8.40%",emi:"60,000",fin:"ICICI FD",status:"MATURED"},
  {no: "2", name: 'Shilpa Jain', type: "Home loan", loan: '60,000',ldate:"18/09/2021",today:"1,00,000",ten:"5y 9m",rate:"8.40%",emi:"60,000",fin:"ICICI FD",status:"MATURED"},
  {no: "", name: 'Total', type: "", loan: '1,20,000',ldate:"",today:"1,50,000",ten:"",rate:"",emi:"",fin:"",status:""},
];