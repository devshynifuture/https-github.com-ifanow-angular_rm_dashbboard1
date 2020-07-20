import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detailed-view-gold-mob',
  templateUrl: './detailed-view-gold-mob.component.html',
  styleUrls: ['./detailed-view-gold-mob.component.scss']
})
export class DetailedViewGoldMobComponent implements OnInit {
  _data: any;
  gold: any;
  @Output() outputValue = new EventEmitter<any>();

  constructor() { }
  @Input()
  set data(inputData) {
    this._data = inputData;
    this.gold = this._data;

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
}
