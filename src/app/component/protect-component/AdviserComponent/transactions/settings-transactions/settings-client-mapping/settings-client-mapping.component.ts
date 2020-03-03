import { Component, OnInit, ViewChild } from '@angular/core';
import { AddClientMappingComponent } from './add-client-mapping/add-client-mapping.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { TransactionEnumService } from '../../transaction-enum.service';

@Component({
  selector: 'app-settings-client-mapping',
  templateUrl: './settings-client-mapping.component.html',
  styleUrls: ['./settings-client-mapping.component.scss']
})
export class SettingsClientMappingComponent implements OnInit {
  displayedColumns: string[] = ['weight', 'symbol', 'pan', 'hold', 'tstatus', 'status', 'map'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  defaultDetails: any;
  allData: any;
  clientDataList: any;
  defaultCredential: any;
  defaultClient: any;
  selectedPlatform: any;
  brokerCodeList: any = [];
  platformList: any = [];
  brokerCodeDisplayList: any = [];
  selectedBrokerCode: any;
  type: string;
  filterData: any;
  isLoading: any;
  advisorId: any;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public dialog: MatDialog, private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.getFilterOptionData();
  }
  getFilterOptionData() {
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data)
    );
  }
  getFilterOptionDataRes(data) {
    console.log(data);
    this.filterData = TransactionEnumService.setPlatformEnum(data);
    this.type = '1';
    this.selectedBrokerCode = data[0];
    this.selectedPlatform = data[0];
    this.dataSource.data = [{}, {}, {}];
    this.sortDataFilterWise();
  }

  getMappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj =
    {
      advisorId: this.advisorId,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform.aggregatorType
    }
    this.tranService.getMapppedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    )
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
  chnageBrokerCode(value) {
    this.selectedPlatform = value;
    this.sortDataFilterWise();
  }
  changePlatform(value) {
    this.selectedBrokerCode = value
    this.sortDataFilterWise();
  }
  getUnmappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj =
    {
      advisorId: this.advisorId,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform.aggregatorType
    }
    this.tranService.getUnmappedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    )
  }
  unmapClient(value, data) {
    const dialogData = {
      data: data,
      header: 'UNMAP',
      body: 'Are you sure you want to unmap?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNMAP',
      positiveMethod: () => {
        let obj =
        {
          tpUserCredentialId: this.selectedBrokerCode.id,
          tpUserCredFamilyMappingId: value.tpUserCredFamilyMappingId,
          aggregatorType: this.selectedPlatform.aggregatorType
        }
        this.onlineTransact.unmapMappedClient(obj).subscribe(
          data => {
            console.log(data);
            this.sortDataFilterWise();
            dialogRef.close();
          },
          err => this.eventService.openSnackBar(err, 'dismiss')
        )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getDefaultDetails(platform) {
    let obj = {
      advisorId: this.advisorId,
      familyMemberId: 112166,
      clientId: 53637,
      aggregatorType: platform
    }
    this.tranService.getDefaultDetails(obj).subscribe(
      data => this.getDefaultDetailsRes(data)
    );
  }
  getDefaultDetailsRes(data) {
    console.log('deault', data)
    this.allData = data
    this.brokerCodeList = data.credentialList
    // this.clientDataList = data.clientDataList
    // this.defaultCredential = data.defaultCredential
    // this.defaultClient = data.defaultClient
    // this.selectedPlatform = this.defaultCredential.aggregatorType
  }
  sortDataFilterWise() {
    (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  }
  openAddMappiing(data, flag) {
    data['flag'] = "client";
    data.selectedBroker = this.selectedBrokerCode;

    const fragmentData = {
      flag: 'clientMapping',
      data,
      id: 1,
      state: 'open45',
      componentName: AddClientMappingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.sortDataFilterWise();
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
