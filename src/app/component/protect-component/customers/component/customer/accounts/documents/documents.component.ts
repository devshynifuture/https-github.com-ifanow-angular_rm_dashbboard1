import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'lastModi', 'type' , 'size', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor() { }
  viewMode
  ngOnInit() {
  this.viewMode="tab1"
  }

}


export interface PeriodicElement {
 
  name: string;
  lastModi: string;
  type: string;
  size: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Identity & address proofs', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-'},
  {name: 'Accounts', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-'},
  {name: 'Planning', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-'},
  {name: 'Transaction', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-'},
  {name: 'Agreements & invoices', lastModi: '21/08/2019 12:35 PM', type: '-', size: '-'},
   
];

