import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-fixed-deposit-mob',
  templateUrl: './detailed-fixed-deposit-mob.component.html',
  styleUrls: ['./detailed-fixed-deposit-mob.component.scss']
})
export class DetailedFixedDepositMobComponent implements OnInit {
  inputData: any;
  fdData: any;

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
