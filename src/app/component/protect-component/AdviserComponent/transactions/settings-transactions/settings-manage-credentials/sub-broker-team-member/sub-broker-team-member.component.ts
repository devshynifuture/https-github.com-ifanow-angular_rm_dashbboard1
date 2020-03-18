import { Component, OnInit, ViewChild } from '@angular/core';
import { AddSubBrokerCredentialsComponent } from './add-sub-broker-credentials/add-sub-broker-credentials.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-sub-broker-team-member',
  templateUrl: './sub-broker-team-member.component.html',
  styleUrls: ['./sub-broker-team-member.component.scss']
})
export class SubBrokerTeamMemberComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'code', 'euin', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  noData: string;

  constructor(private onlineTransact: OnlineTransactionService, private utilService: UtilService, private subInjectService: SubscriptionInject) { }
  isLoading = false;



  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getBSESubBrokerCredentials()
  }

  getBSESubBrokerCredentials() {
    this.isLoading = true;
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSESubBrokerCredentials(obj).subscribe(
      data => this.getBSESubBrokerCredentialsRes(data)
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
  getBSESubBrokerCredentialsRes(data) {
    if(data){
      this.isLoading = false;
      console.log('getBSESubBrokerCredentialsRes', data)
      this.dataSource.data = data
      this.dataSource.sort = this.sort;
    }else{
      this.isLoading = false;
       this.noData = "No scheme found";
      this.dataSource.data = [];
    }
  
  }
  addSubBroker(data){
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open35',
      componentName: AddSubBrokerCredentialsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openAddSubBrokerCredential(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open',
      componentName: AddSubBrokerCredentialsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
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
  code: string;
  euin: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },
  { position: 'NSE', name: 'ARN', weight: 'ARN-83865', symbol: 'Ankit Mehta', code: 'ABC123', euin: 'E983726' },

];