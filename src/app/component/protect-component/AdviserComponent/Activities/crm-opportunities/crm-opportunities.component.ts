import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crm-opportunities',
  templateUrl: './crm-opportunities.component.html',
  styleUrls: ['./crm-opportunities.component.scss']
})
export class CrmOpportunitiesComponent implements OnInit {
  displayedColumns: string[] = ['client', 'cat', 'des', 'assigned', 'dueDate', 'status', 'menuList'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  client: string;
  cat: string;
  des: string;
  assigned: string;
  dueDate: string;
  status: string;
  menuList: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { client: 'Rahul Jain', cat: 'Mutual Funds', des: 'MF rebalancing', assigned: 'Rahul Jain', dueDate: '05/09/2019', status: 'OVERDUE', menuList: '' },
];