import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-plan',
  templateUrl: './summary-plan.component.html',
  styleUrls: ['./summary-plan.component.scss']
})
export class SummaryPlanComponent implements OnInit {
  displayedColumns: string[] = ['details', 'value', 'month', 'lumpsum'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  details: string;
  value: string;
  month: string;
  lumpsum: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { details: '', value: '48,13,000', month: '25,600', lumpsum: '25,88,500' },

];
