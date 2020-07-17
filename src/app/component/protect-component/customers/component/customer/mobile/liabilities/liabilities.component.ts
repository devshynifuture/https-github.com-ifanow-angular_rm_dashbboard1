import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})
export class LiabilitiesComponent implements OnInit {
  inputData: any;
  assetData: any;
  liabilities;
  backToMf;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = (data.data.loans) ? data.data.loans : data.data
    console.log('This is Input data of proceed ', data);
  }
  ngOnInit() {
  }

}
