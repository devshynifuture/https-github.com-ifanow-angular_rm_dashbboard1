import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.scss']
})
export class AddNewRoleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit', 'del', 'adv'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'adv'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  position: string;
  adv: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Mutual funds', adv: 'Manage ' },
  { position: 'Stocks', adv: 'Manage ' },
];
export interface PeriodicElement1 {
  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Mutual funds' },
  { position: 'Stocks' },
];