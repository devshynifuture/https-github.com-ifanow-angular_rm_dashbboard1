import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-deployments',
  templateUrl: './add-deployments.component.html',
  styleUrls: ['./add-deployments.component.scss']
})
export class AddDeploymentsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'unit'];
  dataSource1 = ELEMENT_DATA1;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '520.90', name: '420.90', weight: '100.00' },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  unit: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'SIP', name: '07/01/2019', weight: '5,000.00', symbol: '156.23', unit: '156.23' },

];
