import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})

export class InsuranceComponent implements OnInit {
  displayedColumns = ['no', 'life', 'name', 'number','sum','cvalue','premium','term','pterm','desc','status','icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt','mvalue','rate','mdate','type','ppf','desc','status','icons'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }
  viewMode;
  ngOnInit() {
    this.viewMode="tab1"
  }

}


export interface PeriodicElement {
  no: string;
  life: string;
  name: string;
  number: string;
  sum:string;
  cvalue:string;
  premium:string;
  term:string;
  pterm:string;
  desc:string;
  status:string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", life: "Rahul Jain", name:"Cumulative", number: "358656327863",sum:"94,925",cvalue:"60,000",
premium:"1,00,000",term:"45",pterm:"45",desc:"ICICI FD",status:"MATURED"},
{no: "2", life: "Shilpa Jain", name:"Cumulative", number: "358656327863",sum:"94,925",cvalue:"60,000",
premium:"1,00,000",term:"45",pterm:"45",desc:"ICICI FD",status:"MATURED"},
{no: "", life: "", name:"", number: "",sum:"94,925",cvalue:"60,000",
premium:"1,00,000",term:"",pterm:"",desc:"",status:""},
];

export interface PeriodicElement1 {
  no: string;
  owner: string;
  cvalue: string;
  amt: string;
  mvalue:string;
  rate:string;
  mdate:string;
  type:string;
  ppf:string;
  desc:string;
  status:string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {no: "1", owner: "Rahul Jain", cvalue:"94,925", amt: "60,000",mvalue:"1,00,000",rate:"8.40%",
  mdate:"18/09/2021",type:"Cumulative",ppf:"980787870909",desc:"ICICI FD",status:"MATURED"},
  {no: "2", owner: "Shilpa Jain", cvalue:"94,925", amt: "60,000",mvalue:"1,00,000",rate:"8.40%",
  mdate:"18/09/2021",type:"Cumulative",ppf:"980787870909",desc:"ICICI FD",status:"MATURED"},
  {no: "", owner: "Total", cvalue:"1,28,925", amt: "1,28,925",mvalue:"1,28,925",rate:"",
  mdate:"",type:"",ppf:"",desc:"",status:""},
];