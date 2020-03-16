import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.scss']
})
export class HistoryViewComponent implements OnInit {
  displayedColumns: string[] = ['date', 'rstatus', 'rscore', 'empty'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}


export interface PeriodicElement {
  date: string;
  rstatus: string;
  rscore: string;
  empty: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { date: '24/07/2019', rstatus: 'Aggresive', rscore: '30', empty: 'VIEW' },
  { date: '20/10/2019', rstatus: 'Moderate', rscore: '60', empty: 'VIEW' },
  { date: '20/10/2019', rstatus: ' Moderately conservative', rscore: '90', empty: 'VIEW' },

];