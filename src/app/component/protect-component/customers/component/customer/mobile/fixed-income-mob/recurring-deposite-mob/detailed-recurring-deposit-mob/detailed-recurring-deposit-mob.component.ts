import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-recurring-deposit-mob',
  templateUrl: './detailed-recurring-deposit-mob.component.html',
  styleUrls: ['./detailed-recurring-deposit-mob.component.scss']
})
export class DetailedRecurringDepositMobComponent implements OnInit {
  fdData: any;
  inputData: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.fdData  = data
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
