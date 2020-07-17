import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {
  realEstateData
  backToMf
  inputData: any;
  assetData: any;

  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = data.data.assetList
    console.log('This is Input data of proceed ', data);
  }
  constructor() { }

  ngOnInit() {
  }

}
