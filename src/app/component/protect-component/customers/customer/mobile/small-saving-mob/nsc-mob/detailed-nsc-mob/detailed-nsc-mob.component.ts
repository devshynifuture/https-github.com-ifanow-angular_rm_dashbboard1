import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-nsc-mob',
  templateUrl: './detailed-nsc-mob.component.html',
  styleUrls: ['./detailed-nsc-mob.component.scss']
})
export class DetailedNscMobComponent implements OnInit {
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
