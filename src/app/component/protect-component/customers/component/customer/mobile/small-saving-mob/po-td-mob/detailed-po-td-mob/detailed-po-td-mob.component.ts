import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-po-td-mob',
  templateUrl: './detailed-po-td-mob.component.html',
  styleUrls: ['./detailed-po-td-mob.component.scss']
})
export class DetailedPoTdMobComponent implements OnInit {
  inputData: any;
  detailedData: any;
  backToSS: boolean = false;
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
