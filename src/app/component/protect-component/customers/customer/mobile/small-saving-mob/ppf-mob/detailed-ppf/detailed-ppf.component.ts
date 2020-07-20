import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detailed-ppf',
  templateUrl: './detailed-ppf.component.html',
  styleUrls: ['./detailed-ppf.component.scss']
})
export class DetailedPpfComponent implements OnInit {
  inputData: any;
  detailedData: any;

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
