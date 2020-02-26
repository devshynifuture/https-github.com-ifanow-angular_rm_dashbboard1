import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterBy = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    console.log("this some event:::::::", event.value);

    // Add our filterBy
    if ((value || '').trim()) {
      this.filterBy.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(filterBy): void {
    const index = this.filterBy.indexOf(filterBy);

    if (index >= 0) {
      this.filterBy.splice(index, 1);
    }
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
