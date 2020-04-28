import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { element } from 'protractor';

@Component({
  selector: 'app-detailed-view-real-estate',
  templateUrl: './detailed-view-real-estate.component.html',
  styleUrls: ['./detailed-view-real-estate.component.scss']
})
export class DetailedViewRealEstateComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  realEstate: any;
  nominee: any;
  owners: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.realEstate = this._data
    this.nominee = this._data.nominees;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);
    this.setUnit(this.realEstate);
  }
unit:any
  setUnit(realEstate){
    switch (realEstate.unitId) {
      case 1:this.unit = "Square feet";
      break;

      case 2:this.unit = "Square meter";
      break;

      case 3:this.unit = "Acre";
      break;

      case 4:this.unit = "Hectare";
      break;

      case 5:this.unit = "Bigha";
      break;

      case 6:this.unit = "Biswa";
      break;

      case 7:this.unit = "Biswansi";
      break;

      case 8:this.unit = "Killa";
      break;

      case 9:this.unit = "Ghumaon";
      break;

      case 10:this.unit = "Ankanam";
      break;

      case 11:this.unit = "Cent";
      break;

      case 12:this.unit = "Ground";
      break;

      case 13:this.unit = "Guntha";
      break;

      case 14:this.unit = "kuncham";
      break;

      case 15:this.unit = "Chatak";
      break;

      case 16:this.unit = "Dhur";
      break;

      case 17:this.unit = "Kattha";
      break;

      case 18: this.unit = "Lecha";
      break;
    
    }
  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;

}