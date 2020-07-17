import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: ['./life-insurance.component.scss']
})
export class LifeInsuranceComponent implements OnInit {
  changeValue;
  inputData: any;
  assetData: any;
  lifeInsuranceData;
  backToMf;
  bankAccData;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = data.data ? data.data.insuranceList : []
    console.log('This is Input data of proceed ', data);
  }

  ngOnInit() {
  }

}
