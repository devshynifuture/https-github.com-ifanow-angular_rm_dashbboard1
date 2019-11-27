import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cashflows-plan',
  templateUrl: './cashflows-plan.component.html',
  styleUrls: ['./cashflows-plan.component.scss']
})
export class CashflowsPlanComponent implements OnInit {

  displayedColumns: string[] = ['year', 'age', 'age2', 'salary', 'salary2', 'total', 'view'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  year: string;
  age: string;
  age2: string;
  salary: string;
  salary2: string;
  total: string;
  view: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view' },
   
];
