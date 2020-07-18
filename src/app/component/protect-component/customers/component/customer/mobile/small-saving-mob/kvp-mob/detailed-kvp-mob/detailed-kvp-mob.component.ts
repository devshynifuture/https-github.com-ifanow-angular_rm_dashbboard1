import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-kvp-mob',
  templateUrl: './detailed-kvp-mob.component.html',
  styleUrls: ['./detailed-kvp-mob.component.scss']
})
export class DetailedKvpMobComponent implements OnInit {
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
