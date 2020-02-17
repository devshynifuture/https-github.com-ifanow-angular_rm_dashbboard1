import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-support-upper-slider',
  templateUrl: './support-upper-slider.component.html',
  styleUrls: ['./support-upper-slider.component.scss']
})
export class SupportUpperSliderComponent implements OnInit {
  constructor(private subInjectService: SubscriptionInject) { }

  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    console.log('close');
  }

}

export interface elementI {

  name: string;
  nav: string;
  schemeName: string;
  schemeCode: string;
  amficode: string;
  navTwo: string;
  navDate: string;
  njCount: string;
  map: string;
}

const ELEMENT_DATA = [
  { name: 'Aditya Birla Sun Life FTP Series - KH - Regular Div', nav: '1898.988', schemeName: ' ', amficode: ' ', navTwo: ' ', navDate: ' ', njCount: ' ', map: ' ' },


]