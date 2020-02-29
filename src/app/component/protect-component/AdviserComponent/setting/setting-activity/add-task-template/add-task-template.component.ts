import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-task-template',
  templateUrl: './add-task-template.component.html',
  styleUrls: ['./add-task-template.component.scss']
})
export class AddTaskTemplateComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Sub task 1' },

];