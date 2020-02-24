import { Component, OnInit } from '@angular/core';
import { AddClientMappingComponent } from './add-client-mapping/add-client-mapping.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-settings-client-mapping',
  templateUrl: './settings-client-mapping.component.html',
  styleUrls: ['./settings-client-mapping.component.scss']
})
export class SettingsClientMappingComponent implements OnInit {
  displayedColumns: string[] = ['weight', 'symbol', 'pan', 'hold', 'tstatus', 'status', 'map'];
  dataSource;
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
  constructor(public dialog: MatDialog, private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

  ngOnInit() {
    this.getFilterOptionData();
  }
  getFilterOptionData() {
    let obj = {
      advisorId: 414,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data)
    );
  }
  getFilterOptionDataRes(data) {
    console.log(data);
    this.filterData = data;
    this.filterData.forEach(element => {
      element['platformName'] = (element.aggregatorType == 1) ? "NSC" : "BSC"
    });
    this.type = '1';
    this.selectedBrokerCode = data[0];
    this.selectedPlatform = data[0];
    this.dataSource = [{}, {}, {}];
    (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  }

  getMappedData() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    let obj =
    {
      advisorId: 414,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform.aggregatorType
    }
    this.tranService.getMapppedClients(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
        this.isLoading = false;
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    )
  }
  getUnmappedData() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    let obj =
    {
      advisorId: 414,
      tpUserCredentialId: this.selectedBrokerCode.id,
      aggregatorType: this.selectedPlatform.aggregatorType
    }
    this.tranService.getUnmappedClients(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
        this.isLoading = false;
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    )
  }
  unmapClient(value, data) {
    const dialogData = {
      data: value,
      header: 'UNMAP',
      body: 'Are you sure you want to unmap?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'UNMAP',
      positiveMethod: () => {
        let obj =
        {
          tpUserCredFamilyMappingId: value.tpUserCredFamilyMappingId,
          aggregatorType: this.selectedPlatform.aggregatorType
        }
        this.onlineTransact.unmapMappedClient(obj).subscribe(
          data => {
            console.log(data);
            (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
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
      advisorId: 414,
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
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open45',
      componentName: AddClientMappingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
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