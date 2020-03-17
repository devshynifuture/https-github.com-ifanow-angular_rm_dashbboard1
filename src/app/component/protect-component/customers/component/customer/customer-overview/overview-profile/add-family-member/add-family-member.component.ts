import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-family-member',
  templateUrl: './add-family-member.component.html',
  styleUrls: ['./add-family-member.component.scss']
})
export class AddFamilyMemberComponent implements OnInit {
  displayedColumns: string[] = ['details', 'status', 'pan', 'relation', 'gender', 'add', 'remove'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  details: string;
  status: string;
  pan: string;
  relation: string;
  gender: string;
  add: string;
  remove: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { details: 'Aditya Rahul Jain', status: 'Minor', pan: 'AATPH4939L', relation: 'Mother', gender: 'Female', add: 'ADDED', remove: '' },
  { details: 'Aditya Rahul Jain', status: 'Minor', pan: 'AATPH4939L', relation: 'Mother', gender: 'Female', add: 'ADDED', remove: '' },

];