import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-folio-mapping',
  templateUrl: './settings-folio-mapping.component.html',
  styleUrls: ['./settings-folio-mapping.component.scss']
})
export class SettingsFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'iname', 'hold', 'map'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  iname: string;
  hold: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'ARN-83865', name: '77715627566', weight: 'Sundaram Select Small Cap- Growth	',
    iname: 'Sneha Vishal Shah	', hold: 'Anyone or survivor'
  },

];