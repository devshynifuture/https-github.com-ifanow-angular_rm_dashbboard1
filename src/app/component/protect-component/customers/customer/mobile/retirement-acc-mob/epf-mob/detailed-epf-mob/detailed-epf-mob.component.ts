import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-epf-mob',
  templateUrl: './detailed-epf-mob.component.html',
  styleUrls: ['./detailed-epf-mob.component.scss']
})
export class DetailedEpfMobComponent implements OnInit {
  inputData: any;
  detailedData: any;
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
