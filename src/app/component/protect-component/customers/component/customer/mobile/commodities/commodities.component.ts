import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.scss']
})
export class CommoditiesComponent implements OnInit {
  inputData: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.data = data.data;
    console.log('This is Input data of proceed ', data);
  }
  ngOnInit() {
  }

}
