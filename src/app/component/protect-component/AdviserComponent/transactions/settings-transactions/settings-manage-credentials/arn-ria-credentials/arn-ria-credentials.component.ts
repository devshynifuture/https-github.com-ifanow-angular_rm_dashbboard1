import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {AddArnRiaCredentialsComponent} from './add-arn-ria-credentials/add-arn-ria-credentials.component';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-arn-ria-credentials',
  templateUrl: './arn-ria-credentials.component.html',
  styleUrls: ['./arn-ria-credentials.component.scss']
})
export class ArnRiaCredentialsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'aid', 'euin', 'set', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  brokerCredentials: any;
  noData: string;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private eventService: EventService, private onlineTransact: OnlineTransactionService,
              private utilService: UtilService, private subInjectService: SubscriptionInject,
              private customerService: CustomerService, public dialog: MatDialog) {
  }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getBSECredentials();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  getBSECredentials() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getBSECredentialsRes(data), error => {
        this.isLoading = false;
        this.dataSource.data = [];
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getBSECredentialsRes(data) {
    this.getBSESubBrokerCredentials();
    this.brokerCredentials = data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  getBSESubBrokerCredentials() {
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSESubBrokerCredentials(obj).subscribe(
      data => this.getBSESubBrokerCredentialsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getBSESubBrokerCredentialsRes(data) {
    this.isLoading = false;
    if (data == undefined || data.length == 0) {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    } else {
      this.brokerCredentials.forEach(function(ad) {
        const subBrokerMatch = data.find(function(tm) {
          return ad.id == tm.tpUserCredentialId;
        });
        if (subBrokerMatch && subBrokerMatch.euin) {
          ad.euin = subBrokerMatch.euin;
          ad.tp_nse_subbroker_mapping_id = subBrokerMatch.tpUserCredentialId;
          ad.subBrokerCode = subBrokerMatch.subBrokerCode;
        }
      });
      this.dataSource.data = this.brokerCredentials;
      this.dataSource.sort = this.sort;
    }
  }

  openAddCredential(data, flag) {
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: (flag == 'detailedNsc') ? 'open35' : 'open35',
      componentName: AddArnRiaCredentialsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getBSECredentials();

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  deleteCred(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete credentials?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let obj = {
          tpUserCredentialId : data.tpUserCredentialId
        }
        this.onlineTransact.deleteBroker(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Credential is deleted', 'Dismiss');
            dialogRef.close();
            this.getBSECredentials();
          },
          error => this.eventService.showErrorMessage(error)
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
}

// export interface PeriodicElement {
//   name: string;
//   position: string;
//   weight: string;

//   aid: string;
//   mid: string;
//   apip: string;
//   euin: string;

// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 'NSE', name: 'ARN', weight: 'ARN-83865', aid: 'MFS83865', mid: 'ABC123', apip: '****', euin: 'E983726' },


// ];
