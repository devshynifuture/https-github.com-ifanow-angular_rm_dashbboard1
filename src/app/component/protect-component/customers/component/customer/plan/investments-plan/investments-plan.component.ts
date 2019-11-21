import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investments-plan',
  templateUrl: './investments-plan.component.html',
  styleUrls: ['./investments-plan.component.scss']
})
export class InvestmentsPlanComponent implements OnInit {

  displayedColumns: string[] = ['item', 'cost'];
  constructor() { }

  ngOnInit() {
  }

  
  
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
    {item: 'Frisbee', cost: 2},
    {item: 'Sunscreen', cost: 4},
    {item: 'Cooler', cost: 25},
    {item: 'Swim suit', cost: 15},
  ];

  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }


}

export interface Transaction {
  item: string;
  cost: number;
}

