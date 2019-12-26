import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-fact-shit',
  templateUrl: './fact-sheet.component.html',
  styleUrls: ['./fact-sheet.component.scss']
})
export class FactSheetComponent implements OnInit {
  displayedColumns = ['name', 'sector', 'ins', 'all', 'assets'];
  dataSource = ELEMENT_DATA;

  constructor() {
  }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  name: string;
  sector: string;
  ins: string;
  all: string;
  assets: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},
  {name: 'ICICI Bank', sector: 'Financial', ins: 'Equity', all: '12.23%', assets: '1,290'},

];
