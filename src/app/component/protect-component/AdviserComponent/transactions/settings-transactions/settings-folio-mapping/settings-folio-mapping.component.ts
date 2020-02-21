import { Component, OnInit } from '@angular/core';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AddClientMappingComponent } from '../settings-client-mapping/add-client-mapping/add-client-mapping.component';

@Component({
  selector: 'app-settings-folio-mapping',
  templateUrl: './settings-folio-mapping.component.html',
  styleUrls: ['./settings-folio-mapping.component.scss']
})
export class SettingsFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'iname', 'hold', 'map'];
  dataSource;
  filterData: any;
  type: string;
  selectedBrokerCode: any;
  selectedPlatform: any;
  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

  ngOnInit() {
    this.getFilterOptionData();
  }
  sortDataFilterWise() {
    (this.type == '1') ? this.getFolioMappedData() : this.getFolioUnmappedData();
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
    (this.type == '1') ? this.getFolioMappedData() : this.getFolioUnmappedData();
  }
  getFolioMappedData() {
    const obj =
    {
      advisorId: 414,
      onlyBrokerCred: true
    }
    this.onlineTransact.getFolioMappedData(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
      }
    )
  }
  getFolioUnmappedData() {
    const obj =
    {
      advisorId: 414,
      onlyBrokerCred: true
    }
    this.onlineTransact.getUnmappedFolios(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
      }
    )
  }
  openAddMappiing(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open',
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
