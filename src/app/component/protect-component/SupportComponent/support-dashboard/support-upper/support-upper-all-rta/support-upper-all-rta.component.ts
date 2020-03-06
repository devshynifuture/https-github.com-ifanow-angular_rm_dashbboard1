import { EventService } from './../../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-support-upper-all-rta',
  templateUrl: './support-upper-all-rta.component.html',
  styleUrls: ['./support-upper-all-rta.component.scss']
})
export class SupportUpperAllRtaComponent implements OnInit {
  displayedColumns: string[] = ['name', 'nav', 'schemeName', 'schemeCode', 'amficode', 'navTwo', 'navDate', 'njCount', 'map'];
  dataSource;
  isLoading: boolean = false;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  mapUnmappedSchemes(element) {
    console.log(element);
  }

  dialogClose() {
    console.log('close');
    this.eventService.changeUpperSliderState({ state: 'close' });
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