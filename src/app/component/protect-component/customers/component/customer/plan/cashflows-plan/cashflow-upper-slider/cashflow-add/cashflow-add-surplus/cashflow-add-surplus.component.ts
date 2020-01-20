import { Component, OnInit } from '@angular/core';
import { GoalTableI, loanTableI } from '../../../cashflow.interface';

@Component({
  selector: 'app-cashflow-add-surplus',
  templateUrl: './cashflow-add-surplus.component.html',
  styleUrls: ['./cashflow-add-surplus.component.scss']
})
export class CashflowAddSurplusComponent implements OnInit {

  constructor() { }

  dataSource1: GoalTableI[] = ELEMENT_DATA1;
  dataSource2: loanTableI[] = ELEMENT_DATA2;
  displayedColumns1: string[] = ['goal', 'goalYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];
  displayedColumns2: string[] = ['loan', 'loanYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];

  ngOnInit() {
  }

}



export const ELEMENT_DATA1: GoalTableI[] = [
  { goal: 'deasvikandk', goalYear: '2020', monthlyRequired: '83494', lumpsumRequired: '2409809', allocate: "" }
]

export const ELEMENT_DATA2: loanTableI[] = [
  { loan: "adhvgbha", loanYear: '2020', monthlyRequired: '48978', lumpsumRequired: '948735', allocate: '' }
]
