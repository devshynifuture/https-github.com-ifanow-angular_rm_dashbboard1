import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-leads',
  templateUrl: './people-leads.component.html',
  styleUrls: ['./people-leads.component.scss']
})
export class PeopleLeadsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'lsource', 'status', 'rating', 'lead',
    'icon', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  lsource: string;
  status: string;
  rating: string;
  lead: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Rahul Jain', name: '+91 9821230123', weight: 'rahul.jain01@gmail.com',
    lsource: 'Website',
    status: 'Attempted to contact', rating: 'Hot', lead: 'Aniket Vichare'
  },

];