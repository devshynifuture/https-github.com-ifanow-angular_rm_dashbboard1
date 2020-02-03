import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-client-mapping',
  templateUrl: './add-client-mapping.component.html',
  styleUrls: ['./add-client-mapping.component.scss']
})
export class AddClientMappingComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'hname'];
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
  hname: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN-83865', weight: '5011102595', symbol: 'Joint', hname: 'Vishal A Shah' },
  { position: 'BSE', name: 'ARN-83865', weight: '5011102595', symbol: 'Joint', hname: 'Vishal A Shah' },
];