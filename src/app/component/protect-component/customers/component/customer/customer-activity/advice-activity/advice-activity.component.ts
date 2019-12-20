import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advice-activity',
  templateUrl: './advice-activity.component.html',
  styleUrls: ['./advice-activity.component.scss']
})
export class AdviceActivityComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'icons'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol', 'status', 'date', 'adate', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  viewMode: string;

  constructor() { }
  selected;
  ngOnInit() {

    this.viewMode = 'tab1';
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given', date: '23/12/2019' },
  { position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given', date: '23/12/2019' },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;
  adate: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019'
  },
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)',
    weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019'
  },

]
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  status: string;
  date: string;
  adate: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)', weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal', status: 'Given',
    date: '23/12/2019', adate: '23/12/2019'
  },
  {
    position: 'Rahul Jain', name: 'Surplus from life csh flows (Lumpsum)',
    weight: '35, 000', symbol: 'Invest towards Shreya’s Higher education and Rahul’s Retirement goal',
    status: 'Given', date: '23/12/2019', adate: '23/12/2019'
  },

]