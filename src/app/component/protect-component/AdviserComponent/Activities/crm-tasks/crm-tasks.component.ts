import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crm-tasks',
  templateUrl: './crm-tasks.component.html',
  styleUrls: ['./crm-tasks.component.scss']
})
export class CrmTasksComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'client', 'cat', 'des', 'value', 'advice', 'status', 'date', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  client: string;
  cat: string;
  des: string;
  value: string;
  advice: string;
  status: string;
  date: string;
  icons: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { client: 'Rahul Jain', cat: 'Mutual Funds', des: 'HDFC Equity fund - Regular plan - Growth option | 098098883', value: 'Rahul Jain', advice: 'STP 5,000/month to HDFC Dynamic bond fund regular plan monthly dividend', status: 'ACCEPTED', date: '05/09/2019', icons: '' },
];
