import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-view-others-mob',
  templateUrl: './detailed-view-others-mob.component.html',
  styleUrls: ['./detailed-view-others-mob.component.scss']
})
export class DetailedViewOthersMobComponent implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  others: any;
  isLoading = false;

  constructor() {
  }

  @Input()
  set data(inputData) {
    this.others = inputData;
  }

  get data() {
    return this.others;
  }

 
}
