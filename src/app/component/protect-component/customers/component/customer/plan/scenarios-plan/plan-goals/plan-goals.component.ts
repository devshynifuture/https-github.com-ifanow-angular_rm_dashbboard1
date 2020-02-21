import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-goals',
  templateUrl: './plan-goals.component.html',
  styleUrls: ['./plan-goals.component.scss']
})
export class PlanGoalsComponent implements OnInit {

  constructor() { }
  isLoading = true;
  displayedColumns: string[] = ['details', 'value', 'monthly', 'lumpsum'];
  dataSource = ELEMENT_DATA;

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

];

