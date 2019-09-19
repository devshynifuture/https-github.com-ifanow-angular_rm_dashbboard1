import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  document: string;
  plan: string;
  date: string;
  sdate: string;
  status:string;
 } 

const ELEMENT_DATA: PeriodicElement[] = [

];
@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class QuotationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['service', 'amt', 'type', 'subs','status','date','bdate','ndate','mode','icons'];
  dataSource = ELEMENT_DATA;
}
