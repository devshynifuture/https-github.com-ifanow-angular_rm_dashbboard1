import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detailed-view-others-mob',
  templateUrl: './detailed-view-others-mob.component.html',
  styleUrls: ['./detailed-view-others-mob.component.scss']
})
export class DetailedViewOthersMobComponent implements OnInit {
  others: any;
  // declared to fix ubuild issue
  backPage
  // ....
  @Output() outputValue = new EventEmitter<any>();

  constructor() { }
  @Input()
  set data(inputData) {
    this.others = inputData;
  }

  get data() {
    return this.others;
  }
  ngOnInit() {
  }
  changeValue(flag) {
    this.outputValue.emit(flag);
  }

}
