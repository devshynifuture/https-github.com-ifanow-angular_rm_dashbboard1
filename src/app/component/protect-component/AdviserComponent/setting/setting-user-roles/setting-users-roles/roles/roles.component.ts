import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'del'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },
  { position: 'Admin', name: 'The admin role has unrestricted access to all modules. This role cannot be edited or deleted.' },

];