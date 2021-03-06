import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.scss']
})
export class CommoditiesComponent implements OnInit {
  inputData: any;
  assetData: any;
  commodities;
  backToMf;
  showDetailView: any;

  // change this declared to fix build issue
  detailedViewData;
  // 

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = data.data.assetList
    console.log('This is Input data of proceed ', data);
  }
  ngOnInit() {
  }
  getValue(value) {
    this.showDetailView = value;
  }
}
