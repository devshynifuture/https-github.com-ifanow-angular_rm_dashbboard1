import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-po-rd-mob',
  templateUrl: './detailed-po-rd-mob.component.html',
  styleUrls: ['./detailed-po-rd-mob.component.scss']
})
export class DetailedPoRdMobComponent implements OnInit {
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
