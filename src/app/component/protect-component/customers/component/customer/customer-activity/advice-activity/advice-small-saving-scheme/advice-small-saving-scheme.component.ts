import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advice-small-saving-scheme',
  templateUrl: './advice-small-saving-scheme.component.html',
  styleUrls: ['./advice-small-saving-scheme.component.scss']
})
export class AdviceSmallSavingSchemeComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'empcon', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['checkbox', 'name', 'desc', 'cvalue', 'emprcon', 'advice', 'astatus', 'adate', 'icon'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  displayedColumns4: string[] = ['checkbox', 'name', 'desc','cvalue', 'advice', 'astatus', 'adate', 'icon'];
  dataSource4 = ELEMENT_DATA4;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement1 {
  name: string;
  desc: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement {
  name: string;
  desc: string;
  cvalue: string;
  empcon: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', empcon: '54000', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement2 {
  name: string;
  desc: string;
  cvalue: string;
  emprcon: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Rahul Jain', desc: '1', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue: 'This is', emprcon: '23123', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];
export interface PeriodicElement4{
  name: string;
  desc: string;
  cvalue: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { name: 'Rahul Jain', desc: '1', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2', cvalue:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];