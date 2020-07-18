import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-po-mis-mob',
  templateUrl: './detailed-po-mis-mob.component.html',
  styleUrls: ['./detailed-po-mis-mob.component.scss']
})
export class DetailedPoMisMobComponent implements OnInit {
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
