import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-scss-mob',
  templateUrl: './detailed-scss-mob.component.html',
  styleUrls: ['./detailed-scss-mob.component.scss']
})
export class DetailedScssMobComponent implements OnInit {
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
