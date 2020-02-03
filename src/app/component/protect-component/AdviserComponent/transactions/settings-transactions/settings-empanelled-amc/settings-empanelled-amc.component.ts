import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-empanelled-amc',
  templateUrl: './settings-empanelled-amc.component.html',
  styleUrls: ['./settings-empanelled-amc.component.scss']
})
export class SettingsEmpanelledAmcComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {

  position: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Aditya Birla Sun Life Mutual Fund' },
  { position: 'Axis Mutual Fund' },
  { position: 'BOI AXA Mutual Fund' },
  { position: 'Baroda Asset Management India Limited' },
  { position: 'DSP Investment Managers Private Limited	' },
  { position: 'Edelweiss Mutual Fund	' },
  { position: 'Essel Mutual Fund	' },
  { position: 'Franklin Templeton Mutual Fund' },

];