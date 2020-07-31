import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-details-view',
  templateUrl: './stock-details-view.component.html',
  styleUrls: ['./stock-details-view.component.scss']
})
export class StockDetailsViewComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Buy', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Sell', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Bonus', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Dividend', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  
];
