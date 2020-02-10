import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheme-mapping',
  templateUrl: './scheme-mapping.component.html',
  styleUrls: ['./scheme-mapping.component.scss']
})
export class SchemeMappingComponent implements OnInit {

  constructor() { }

  dataSource = null;
  displayedColumns: string[] = [];

  ngOnInit() {
  }

}
