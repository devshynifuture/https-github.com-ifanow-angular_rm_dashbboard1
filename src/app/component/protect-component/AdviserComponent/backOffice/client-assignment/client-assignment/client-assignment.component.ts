import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-assignment',
  templateUrl: './client-assignment.component.html',
  styleUrls: ['./client-assignment.component.scss']
})
export class ClientAssignmentComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  // position: number;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul jain', weight: 'ASIPT7412A' },

];
