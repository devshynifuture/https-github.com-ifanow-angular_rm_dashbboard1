import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-run-sip-mapping-master',
  templateUrl: './run-sip-mapping-master.component.html',
  styleUrls: ['./run-sip-mapping-master.component.scss']
})
export class RunSipMappingMasterComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
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
  { position: '4,489', name: '1,720', weight: '1,339', symbol: '381' },

];