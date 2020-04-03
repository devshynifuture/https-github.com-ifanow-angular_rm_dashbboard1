import { Component, OnInit } from '@angular/core';
import { LeadsClientsComponent } from './leads-clients/leads-clients.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddClientComponent } from '../people-clients/add-client/add-client.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from '../../../people.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-people-leads',
  templateUrl: './people-leads.component.html',
  styleUrls: ['./people-leads.component.scss']
})
export class PeopleLeadsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'lsource', 'status', 'rating', 'lead',
    'icon', 'icons'];
  leadDataSource: {}[];
  isLoading: boolean;
  advisorId: any;
  constructor(public eventService: EventService, private subInjectService: SubscriptionInject, private peopleService: PeopleService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getLeadList();
  }
  getLeadList() {
    this.leadDataSource = [{}, {}, {}];
    this.isLoading = true;
    let obj =
    {
      advisorId: this.advisorId,
      status: 2
    }
    this.peopleService.getClientList(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.leadDataSource = data;
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  leadsConvert(data) {
    (data == null) ? data = { flag: 'Add lead', fieldFlag: 'lead' } : '';
    const fragmentData = {
      flag: 'convert Lead',
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
  addLead(data) {
    (data == null) ? data = { flag: 'Add lead', fieldFlag: 'lead' } : '';
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
