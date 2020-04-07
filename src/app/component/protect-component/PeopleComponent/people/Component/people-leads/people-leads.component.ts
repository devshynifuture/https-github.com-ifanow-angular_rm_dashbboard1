import {Component, OnInit} from '@angular/core';
import {LeadsClientsComponent} from './leads-clients/leads-clients.component';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AddClientComponent} from '../people-clients/add-client/add-client.component';
import {AuthService} from 'src/app/auth-service/authService';
import {PeopleService} from '../../../people.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-people-leads',
  templateUrl: './people-leads.component.html',
  styleUrls: ['./people-leads.component.scss']
})
export class PeopleLeadsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'lsource', /*'status', 'rating',*/ 'lead',
    'icon', 'icons'];
  leadDataSource = new MatTableDataSource();
  isLoading: boolean;
  advisorId: any;
  constructor(public eventService: EventService, private subInjectService: SubscriptionInject, private peopleService: PeopleService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getLeadList();
  }
  getLeadList() {
    this.leadDataSource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      status: 2
    };
    this.peopleService.getClientList(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        if (data && data.length > 0) {
          data.forEach((singleData) => {
            if (singleData.mobileList && singleData.mobileList.length > 0) {
              singleData.mobileNo = singleData.mobileList[0].mobileNo;
            }
            if (singleData.emailList && singleData.emailList.length > 0) {
              singleData.email = singleData.emailList[0].email;
            }
          });
        }
        this.leadDataSource.data = data;
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    );
  }
  open(data, flag) {
    let component;
    if (flag == 'lead') {
      if (data == null) {
        data = {flag: 'Add lead', fieldFlag: 'lead'};
      } else {
        data.flag = 'Edit lead';
        data.fieldFlag = 'lead';
      }
      component = AddClientComponent;
    } else {
      component = LeadsClientsComponent;
    }
    const fragmentData = {
      flag,
      id: 1,
      data,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getLeadList();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

}
