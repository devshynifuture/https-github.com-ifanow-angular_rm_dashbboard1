import { Component, OnInit, ViewChild } from '@angular/core';
import { AddSubBrokerCredentialsComponent } from './add-sub-broker-credentials/add-sub-broker-credentials.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { element } from 'protractor';

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

  constructor(private onlineTransact: OnlineTransactionService, 
    private utilService: UtilService,
    private event : EventService,
     private subInjectService: SubscriptionInject,
     public dialog:MatDialog) {
      this.advisorId = AuthService.getAdvisorId();

     }
  isLoading = false;



  ngOnInit() {
    this.getBSESubBrokerCredentials()
  }

  getBSESubBrokerCredentials() {
    this.isLoading = true;
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
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
      data = data.filter(element => element.teamMemberSessionId != this.advisorId)
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
        if (UtilService.isDialogClose(sideBarData)) {
          this.getBSESubBrokerCredentials()
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  deleteSubCred(singleBillerProfile) {
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete the sub-broker credential?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj = {
          id: singleBillerProfile.id
        }
        this.onlineTransact.deleteSubBroker(obj).subscribe(
          data => {
            this.getBSESubBrokerCredentials();
            dialogRef.close();
            this.event.openSnackBar("sub-broker credential is deleted", "Dismiss")
          },
          error => this.event.showErrorMessage(error)
        );

      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
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
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
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