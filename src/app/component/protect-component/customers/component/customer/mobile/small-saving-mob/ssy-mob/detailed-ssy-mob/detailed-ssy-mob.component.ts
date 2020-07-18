import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-ssy-mob',
  templateUrl: './detailed-ssy-mob.component.html',
  styleUrls: ['./detailed-ssy-mob.component.scss']
})
export class DetailedSsyMobComponent implements OnInit {
  detailedData: any;
  inputData: any;
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
