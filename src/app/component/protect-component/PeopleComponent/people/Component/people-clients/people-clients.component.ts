import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddClientComponent } from './add-client/add-client.component';

@Component({
  selector: 'app-people-clients',
  templateUrl: './people-clients.component.html',
  styleUrls: ['./people-clients.component.scss']
})
export class PeopleClientsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'member', 'owner',
    'login', 'status', 'icons', 'icons1'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject, public eventService: EventService) { }

  ngOnInit() {
  }
  Addclient(data) {
    const fragmentData = {
      flag: 'detailedViewCashInHand',
      id: 1,
      data,
      state: 'open50',
      componentName: AddClientComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  member: string;
  owner: string;
  login: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Abhishek Jain', name: '+91 9821230123', weight: ' abhishekjain@yahoo.com',
    symbol: 'AATPJ1239L', member: '3', owner: 'Ankit Mehta', login: '30 min ago', status: 'Active'
  },

];