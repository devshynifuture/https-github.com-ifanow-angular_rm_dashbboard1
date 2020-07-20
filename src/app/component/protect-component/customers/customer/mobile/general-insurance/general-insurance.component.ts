import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-general-insurance',
  templateUrl: './general-insurance.component.html',
  styleUrls: ['./general-insurance.component.scss']
})
export class GeneralInsuranceComponent implements OnInit {
  inputData: any;
  assetData: any;
  cashAndBank;
  backToMf;
  detailedViewData;
  generalInsuranceData;
  showDetailView = false;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = data.data ? data.data.generalInsuranceList : [];
    console.log('This is Input data of proceed ', data);
  }
  ngOnInit() {
  }
  getValue(value){
    this.showDetailView = value;
  }
}
