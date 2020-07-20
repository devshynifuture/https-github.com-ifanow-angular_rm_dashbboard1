import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-nps-mob',
  templateUrl: './detailed-nps-mob.component.html',
  styleUrls: ['./detailed-nps-mob.component.scss']
})
export class DetailedNpsMobComponent implements OnInit {
  detailedData: any;
  inputData: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.detailedData  = data
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
