import { Component, OnInit } from '@angular/core';
import { LeadsClientsComponent } from './leads-clients/leads-clients.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-people-leads',
  templateUrl: './people-leads.component.html',
  styleUrls: ['./people-leads.component.scss']
})
export class PeopleLeadsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'lsource', 'status', 'rating', 'lead',
    'icon', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  leadsConvert(data) {
    const fragmentData = {
      flag: 'detailedViewCashInHand',
      id: 1,
      data,
      state: 'open50',
      componentName: LeadsClientsComponent,
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
  lsource: string;
  status: string;
  rating: string;
  lead: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Rahul Jain', name: '+91 9821230123', weight: 'rahul.jain01@gmail.com',
    lsource: 'Website',
    status: 'Attempted to contact', rating: 'Hot', lead: 'Aniket Vichare'
  },

];