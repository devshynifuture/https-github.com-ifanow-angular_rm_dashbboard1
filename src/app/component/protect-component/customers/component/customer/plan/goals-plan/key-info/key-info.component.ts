import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss']
})
export class KeyInfoComponent implements OnInit {
  displayedColumns = ['year', 'value', 'fvalue', 'equity','debt','equity1','debt1'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
export interface PeriodicElement {
  year: string;
  value: string;
  fvalue: string;
  equity: string;
  debt:string;
  equity1:string;
  debt1:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
  {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
  {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
  {year: "2020", value: '12,545', fvalue: '45,766', equity: '5,766H',debt:'2,766',equity1:'5,766',debt1:'2,766'},
];