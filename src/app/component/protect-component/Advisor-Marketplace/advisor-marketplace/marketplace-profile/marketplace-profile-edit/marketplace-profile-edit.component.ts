import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-marketplace-profile-edit',
 // templateUrl: './marketplace-profile-edit.component.html',
  templateUrl: './new-advisor-onbording-component.html',
  styleUrls: ['./marketplace-profile-edit.component.scss']
})
export class MarketplaceProfileEditComponent implements OnInit {
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','pan','invest','prot'];
  dataSource = ELEMENT_DATA;
   displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
  showFilter:string = '';
  constructor(
    private eventService: EventService
  ) { }
  viewMode: string;
  ngOnInit() {
   this.viewMode = 'tab1';
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

  sortTable(filter) {
    this.showFilter = filter;
  }

}
export interface PeriodicElement {
  name: string;
  weight: string;
  symbol: string;
  pan:string;
  invest:string;
  prot:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Rahul Jain', weight: '89657412554', symbol: 'Rahuljain@mail.com',pan:'APYUHFJ254',invest:'9Y 11M',
prot:'25,35,789'},
  
];

export interface PeriodicElement1 {
  name: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Email', weight:'Free ', symbol: 'Details'},
  { name: 'SMS', weight:'₹ 0.15 / SMS ', symbol: 'Details'},
  { name: 'Whatsapp', weight:'₹ 0.15 / SMS ', symbol: 'Details'},
];