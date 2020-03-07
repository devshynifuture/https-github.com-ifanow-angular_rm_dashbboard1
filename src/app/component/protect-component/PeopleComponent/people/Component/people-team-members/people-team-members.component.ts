import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-team-members',
  templateUrl: './people-team-members.component.html',
  styleUrls: ['./people-team-members.component.scss']
})
export class PeopleTeamMembersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mobile', 'email', 'type', 'map', 'action'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  mobile: string;
  email: string;
  type: string;
  map: string;
  action: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Amit Mehta', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Amitesh Anand', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Hemal Karia', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },
  { name: 'Kiran Kumar', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: '' },


];