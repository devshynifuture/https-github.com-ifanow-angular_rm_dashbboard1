import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-team-members',
  templateUrl: './people-team-members.component.html',
  styleUrls: ['./people-team-members.component.scss']
})
export class PeopleTeamMembersComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'map', 'action'];
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
  { position: 'Amit Mehta', name: 'Amit Mehta', weight: 'amit.mehta@gmail.com', symbol: 'Client' },

];