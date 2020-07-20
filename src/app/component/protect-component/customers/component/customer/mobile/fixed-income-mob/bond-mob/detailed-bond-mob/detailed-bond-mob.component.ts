import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-bond-mob',
  templateUrl: './detailed-bond-mob.component.html',
  styleUrls: ['./detailed-bond-mob.component.scss']
})
export class DetailedBondMobComponent implements OnInit {
  inputData: any;
  fdData: any;
  matured;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.fdData  = data
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
