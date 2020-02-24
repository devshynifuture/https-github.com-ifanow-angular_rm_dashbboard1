import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-goals',
  templateUrl: './plan-goals.component.html',
  styleUrls: ['./plan-goals.component.scss']
})
export class PlanGoalsComponent implements OnInit {

  constructor() { }
  isLoading = false;
  displayedColumns: string[] = ['details', 'value', 'monthly', 'lumpsum'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['name', 'description', 'derived', 'adverse', 'moderate', 'optimum', 'radioOne', 'radioTwo'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns2: string[] = ['particulars', 'amountOne', 'amountTwo', 'emptybox'];
  dataSource2 = ELEMENT_DATA2;

  displayedColumns3: string[] = ['description', 'actualOne', 'applicableOne', 'actualTwo', 'applicableTwo', 'emptybox'];
  dataSource3 = ELEMENT_DATA3;

  ngOnInit() {
  }

}

export interface PeriodicElement {
  details: string;
  value: string;
  monthly: string;
  lumpsum: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { details: " ", value: '48,13,000', monthly: '25,600', lumpsum: '25,88,500' },
  { details: " ", value: '48,13,000', monthly: '25,600', lumpsum: '25,88,500' },
  { details: " ", value: '48,13,000', monthly: '25,600', lumpsum: '25,88,500' },
  { details: " ", value: '48,13,000', monthly: '25,600', lumpsum: '25,88,500' },


];



export interface PeriodicElement1 {
  name: string;
  description: string;
  derived: string;
  adverse: string;
  moderate: string;
  optimum: string;
  radioOne: string;
  radioTwo: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: "Basic liquidity ratio", description: 'This ratio indicates ones ability to meet mandatory monthly expenses & other emergency needs.', derived: ' ', adverse: '< 3', moderate: '3 - 6', optimum: '6 - 15', radioOne: '55.8', radioTwo: '62.3' },
  { name: "Expanded liquidity ratio", description: ' Your ability to meet emergencies when it may not be possible to convert assets into cash.', derived: ' ', adverse: '< 3', moderate: '3 - 6', optimum: '6 - 15', radioOne: '55.8', radioTwo: '62.3' },

];




export interface PeriodicElement2 {
  particulars: string;
  amountOne: string;
  amountTwo: string;
  emptybox: string;


}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { particulars: "Gross life insurance required (1 + 2 +3)", amountOne: '12,00,000', amountTwo: '12,00,000', emptybox: '' },
  { particulars: "Liabilities", amountOne: '12,00,000', amountTwo: '12,00,000', emptybox: '' },
  { particulars: "Less : Existing life insurance (sum assured)", amountOne: '12,00,000', amountTwo: '12,00,000', emptybox: '' },
  { particulars: "Additional life insurance required (4 - 5 - 6 - 7)", amountOne: '12,00,000', amountTwo: '12,00,000', emptybox: '' },


];


export interface PeriodicElement3 {
  description: string;
  actualOne: string;
  applicableOne: string;
  actualTwo: string;
  applicableTwo: string;
  emptybox: string;


}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { description: "A.   Income from salary / pension", actualOne: '8,50,000', applicableOne: '8,50,000', actualTwo: '8,50,000', applicableTwo: '8,50,000', emptybox: '' },
  { description: "B.   Income (Profits) from business / profession", actualOne: '8,50,000', applicableOne: '8,50,000', actualTwo: '8,50,000', applicableTwo: '8,50,000', emptybox: '' },


];