import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-grauity-mob',
  templateUrl: './detailed-grauity-mob.component.html',
  styleUrls: ['./detailed-grauity-mob.component.scss']
})
export class DetailedGrauityMobComponent implements OnInit {
  detailedData: any;
  inputData: any;
  //  declared to fix build issue
  backToSS
  // .......

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.detailedData = this.inputData
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }

}
