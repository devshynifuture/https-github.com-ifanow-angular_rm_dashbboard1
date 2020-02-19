import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mf-rta-details',
  templateUrl: './mf-rta-details.component.html',
  styleUrls: ['./mf-rta-details.component.scss']
})
export class MfRtaDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'email', 'mail', 'use', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'email', 'mail', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'ARN-83866', name: 'firstname.lastname@abcconsultants.com', weight: '* * * * * *' },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  email: string;
  mail: string;
  use: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'ARN-83866', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *', use: 'Yes'
  },
  {
    position: 'INA000004409', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *', use: 'Yes'
  },
];
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  email: string;
  mail: string;


}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'ARN-83866', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *'
  },
  {
    position: 'INA000004409', name: 'abcconsult', weight: '* * * * * *', email: 'firstname.lastname@abcconsultants.com',
    mail: '* * * * * *'
  },
];