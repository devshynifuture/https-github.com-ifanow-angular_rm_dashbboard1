import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-support-upper-slider',
  templateUrl: './support-upper-slider.component.html',
  styleUrls: ['./support-upper-slider.component.scss']
})
export class SupportUpperSliderComponent implements OnInit {
  constructor(
    private subInjectService: SubscriptionInject
  ) { }

  displayedColumns: string[] = ['position', 'weight', 'name', 'symbol'];

  dataSource = new MatTableDataSource<elementI>(ELEMENT_DATA);

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    console.log('close');
  }

}

export interface elementI {
  position: string,
  name: string,
  weight: string,
  symbol: string
}

const ELEMENT_DATA = [
  { position: '1', name: 'hello', weight: '23', symbol: 'ajkd' },
  { position: '2', name: 'hello 3', weight: '223', symbol: 'ajkd' },
  { position: '3', name: 'hello 2', weight: '24', symbol: 'ajkd' },
]