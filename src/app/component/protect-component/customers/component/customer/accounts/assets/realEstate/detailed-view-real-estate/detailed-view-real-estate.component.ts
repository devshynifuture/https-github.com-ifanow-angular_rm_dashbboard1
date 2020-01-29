import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

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
    this.nominee=this._data.nominees;
    this.owners=this._data.realEstateOwners;

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
export interface PeriodicElement {
  name: string;
  position: string;

}