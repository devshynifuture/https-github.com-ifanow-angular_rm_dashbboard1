import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'client', 'cat', 'des', 'assige', 'due', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
    console.log('test')
  }

}
export interface PeriodicElement {
  client: string;
  cat: string;
  des: string;
  assige: string;
  due: string;
  status: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { client: 'Rahul Jain', cat: 'Mutual Funds', des: 'MF rebalancing', assige: 'Rahul Jain', due: '05/09/2019', status: 'OVERDUE' },

];