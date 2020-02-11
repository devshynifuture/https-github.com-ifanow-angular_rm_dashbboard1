import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-ordering-historical',
  templateUrl: './file-ordering-historical.component.html',
  styleUrls: ['./file-ordering-historical.component.scss']
})
export class FileOrderingHistoricalComponent implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['advisorName', 'rta', 'orderedby', 'startedOn', 'totalfiles', 'queue', 'ordering', 'ordered', 'failed', 'uploaded', 'refresh', 'empty'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }

}

export interface PeriodicElement {
  advisorName: string;
  rta: string;
  orderedby: string;
  startedOn: string;
  totalfiles: string;
  queue: string;
  ordering: string;
  ordered: string;
  failed: string;
  uploaded: string;
  refresh: string;
  empty: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { advisorName: 'Vivek Shah', rta: 'Franklin', orderedby: 'Satish Patel', startedOn: '08/01/2020 11:32', totalfiles: '1', queue: '5', ordering: '5', ordered: '58', failed: '51', uploaded: 'sa', refresh: '54', empty: '' },

];
