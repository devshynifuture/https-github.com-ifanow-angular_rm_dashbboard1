import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SupportUpperSliderService } from './support-upper-slider.service';

@Component({
  selector: 'app-support-upper-slider',
  templateUrl: './support-upper-slider.component.html',
  styleUrls: ['./support-upper-slider.component.scss']
})
export class SupportUpperSliderComponent implements OnInit {
  constructor(
    private subInjectService: SubscriptionInject,
    private supportUpperSliderService: SupportUpperSliderService
  ) { }

  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;

  ngOnInit() {

    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  dialogClose() {
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