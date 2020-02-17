import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-assetallocation',
  templateUrl: './plan-assetallocation.component.html',
  styleUrls: ['./plan-assetallocation.component.scss']
})
export class PlanAssetallocationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'debt1', 'equity1', 'debt2', 'equity2', 'debt3', 'equity3',
    'debt4', 'equity4', 'debt5', 'equity5'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {

  position: string;
  equity1: string;
  debt1: string;
  equity2: string;
  debt2: string;
  equity3: string;
  debt3: string;
  equity4: string;
  debt4: string;
  equity5: string;
  debt5: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: '> 15 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '10 - 15 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '6 - 10 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
  {
    position: '3 - 6 years', equity1: '0', debt1: '100', equity2: '10', debt2: '90', equity3: '20', debt3: '80',
    equity4: '30', debt4: '70', equity5: '40', debt5: '60'
  },
];