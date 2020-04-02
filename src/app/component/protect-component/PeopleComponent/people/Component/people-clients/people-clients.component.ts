import {Component, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {AddClientComponent} from './add-client/add-client.component';
import {PeopleService} from '../../../people.service';
import {AuthService} from 'src/app/auth-service/authService';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-people-clients',
  templateUrl: './people-clients.component.html',
  styleUrls: ['./people-clients.component.scss']
})
export class PeopleClientsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'member', 'owner',
    'login', 'status', 'icons', 'icons1'];
  dataSource = ELEMENT_DATA;
  advisorId: any;
  clientDatasource = new MatTableDataSource();
  isLoading: boolean;

  constructor(private subInjectService: SubscriptionInject, public eventService: EventService, private peopleService: PeopleService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getClientList();
  }

  getClientList() {
    this.clientDatasource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId
    };

    // commented code which are giving errors ====>>>>>>>>>>>>>>.

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
        this.clientDatasource.data = data;
      },
      err => {
        this.eventService.openSnackBar(err, 'dismiss');
        this.clientDatasource.data = [];
      }
    );

    // commented code closed which are giving errors ====>>>>>>>>>>>>>>.
  }

  Addclient(data) {
    (data == null) ? data = {flag: 'Add client', fieldFlag: 'client', data: null} : data = {
      flag: 'Edit client',
      fieldFlag: 'client',
      data
    };
    const fragmentData = {
      flag: 'Add client',
      id: 1,
      data,
      state: 'open50',
      componentName: AddClientComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getClientList();
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
