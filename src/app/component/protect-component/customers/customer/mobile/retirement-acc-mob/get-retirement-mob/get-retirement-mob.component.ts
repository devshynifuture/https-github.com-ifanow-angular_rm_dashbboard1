import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-get-retirement-mob',
  templateUrl: './get-retirement-mob.component.html',
  styleUrls: ['./get-retirement-mob.component.scss']
})
export class GetRetirementMobComponent implements OnInit {
  inputData: any;
  asset: any;
  backToMf;
  fixdeposit;
  showDetailsEPF: boolean = false;
  showDetailsNPS: boolean = false;
  showDetailsGratuity: boolean = false;
  detailedData: any;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    if (data.asset) {
      this.asset = data.asset.assetList
    } else {
      this.asset = []
    }
    console.log('This is Input data of proceed ', data);
    console.log('This is Input data of proceed ', this.asset);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  openDetailed(item) {
    if (this.inputData.assetType == 'EPF') {
      this.showDetailsEPF = true
      this.detailedData = item
    } else if (this.inputData.assetType =='NPS') {
      this.showDetailsNPS = true
      this.detailedData = item
    } else {
      this.showDetailsGratuity = true
      this.detailedData = item
    }
  }
}

