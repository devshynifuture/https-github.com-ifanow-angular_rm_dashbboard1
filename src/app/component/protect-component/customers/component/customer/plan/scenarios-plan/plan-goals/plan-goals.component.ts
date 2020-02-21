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

