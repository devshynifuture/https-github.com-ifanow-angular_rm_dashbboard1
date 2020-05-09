import { Component, OnInit, ViewChild } from '@angular/core';
import { AddClientMappingComponent } from './add-client-mapping/add-client-mapping.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { TransactionEnumService } from '../../transaction-enum.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

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
  credentialsData: any;
  noData: string;

  constructor(public dialog: MatDialog, private onlineTransact: OnlineTransactionService,
    private eventService: EventService, private utilService: UtilService,
    private enumServiceService: EnumServiceService,
    private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.getFilterOptionData();
  }

  getFilterOptionData() {
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    console.log('encode', obj);
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data), error => {
        this.isLoading = false;
        this.dataSource.data = [];
        this.noData = "No credentials found";
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getFilterOptionDataRes(data) {
    console.log(data);
    if (data) {
      this.credentialsData = data;
      this.filterData = TransactionEnumService.setPlatformEnum(data);
      this.type = '1';
      this.selectedBrokerCode = data[0];
      this.selectedPlatform = String(data[0].aggregatorType);
      this.dataSource.data = [{}, {}, {}];
      this.sortDataFilterWise();
    } else {
      this.isLoading = false;
      this.dataSource.data = [];
      this.noData = "No credentials found";
    }

  }

  getMappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform
    };
    this.tranService.getMapppedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService)
          this.dataSource.sort = this.sort;
        } else {
          this.isLoading = false;
          this.noData = "No clients found";
          this.dataSource.data = [];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.noData = "No clients found";
        this.dataSource.data = [];
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.noData = 'No clients found';
    }
  }

  chnageBrokerCode(value) {
    this.selectedPlatform = String(value.aggregatorType);
    this.sortDataFilterWise();
  }

  changePlatform(value) {
    // this.selectedBrokerCode.aggregatorType = value;
    this.sortDataFilterWise();
  }

  getUnmappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform
    };
    this.tranService.getUnmappedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService)
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
          this.noData = "No clients found";
        }
        this.isLoading = false;
      },
      err => {
        this.dataSource.data = [];
        this.noData = "No clients found";
        this.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  unmapClient(value, data) {
    const dialogData = {
      data,
      header: 'UNMAP',
      body: 'Are you sure you want to unmap?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNMAP',
      positiveMethod: () => {
        const obj = {
          tpUserCredentialId: this.selectedBrokerCode.id,
          tpUserCredFamilyMappingId: value.tpUserCredFamilyMappingId,
          aggregatorType: this.selectedPlatform.aggregatorType
        };
        this.onlineTransact.unmapMappedClient(obj).subscribe(
          data => {
            console.log(data);
            this.sortDataFilterWise();
            dialogRef.close();
          },
          err => {
            this.isLoading = false;
            this.dataSource.data = [];
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
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

  getDefaultDetailsRes(data) {
    console.log('deault', data);
    this.allData = data;
    this.brokerCodeList = data.credentialList;
    // this.clientDataList = data.clientDataList
    // this.defaultCredential = data.defaultCredential
    // this.defaultClient = data.defaultClient
    // this.selectedPlatform = this.defaultCredential.aggregatorType
  }

  sortDataFilterWise() {
    (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  }

  openAddMappiing(data, flag) {
    data.flag = 'client';
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
