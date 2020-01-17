import { Component, OnInit, Input } from '@angular/core';
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "ICICI Top 100 fund - weekly dividend plan regular", name: 'Liquid', weight: "47,240", symbol: '12,000'},
  {position: "DSP Equity Fund", name: 'Liquid', weight: "36,005", symbol: '1,400'},
 
];
@Component({
  selector: 'app-fee-calculations',
  templateUrl: './fee-calculations.component.html',
  styleUrls: ['./fee-calculations.component.scss']
})

export class FeeCalculationsComponent implements OnInit {
  @Input() padding;

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
