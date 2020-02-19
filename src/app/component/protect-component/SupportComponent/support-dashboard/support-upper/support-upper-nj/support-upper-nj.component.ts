import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-support-upper-nj',
  templateUrl: './support-upper-nj.component.html',
  styleUrls: ['./support-upper-nj.component.scss']
})
export class SupportUpperNjComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;

  constructor(
    private subInjectService: SubscriptionInject
  ) { }



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