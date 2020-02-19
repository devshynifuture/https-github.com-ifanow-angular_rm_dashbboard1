import { Component, OnInit } from '@angular/core';
import { AddClientMappingComponent } from './add-client-mapping/add-client-mapping.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  brokerCodeList: any;
  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

  ngOnInit() {
    this.getFilterOptionData();
    this.getUnmappedFolios()
  }
  getFilterOptionData() {
    let obj = {
      advisorId: 414,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => {
        console.log(data)
      }
    );
  }
  getUnmappedFolios() {
    const obj =
    {
      advisorId: 3021
    }
    this.tranService.getUnmappedFolios(obj).subscribe(
      data => {
        this.dataSource = data;
        console.log(data)
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
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
  openAddMappiing(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open50',
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