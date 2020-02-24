import { Component, OnInit } from '@angular/core';
import { OnlineTransactionService } from '../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { AddClientMappingComponent } from '../settings-client-mapping/add-client-mapping/add-client-mapping.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-settings-folio-mapping',
  templateUrl: './settings-folio-mapping.component.html',
  styleUrls: ['./settings-folio-mapping.component.scss']
})
export class SettingsFolioMappingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'iname', 'hold', 'map'];
  dataSource: any;
  filterData: any;
  type: string;
  selectedBrokerCode: any;
  selectedPlatform: any;
  nomineesListFM: any;
  familyMemberData: any;
  isLoading: boolean;
  constructor(public dialog: MatDialog, private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

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
    this.dataSource = [{}, {}, {}];
    (this.type == '1') ? this.getFolioMappedData() : this.getFolioUnmappedData();
  }
  getFolioMappedData() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    const obj =
    {
      advisorId: 414,
      onlyBrokerCred: true
    }
    this.onlineTransact.getFolioMappedData(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
        this.isLoading = false;
      }
    )
  }
  getFolioUnmappedData() {
    this.dataSource = [{}, {}, {}];
    this.isLoading = true;
    const obj =
    {
      advisorId: 414,
      onlyBrokerCred: true
    }
    this.onlineTransact.getFolioUnmappedData(obj).subscribe(
      data => {
        console.log(data);
        this.dataSource = data;
        this.isLoading = false
      }
    )
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value);
  }
  unmapFolio(value, data) {
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
          tpFolioClientCodeMappingId: value.tpFolioClientCodeMappingId,
        }
        this.onlineTransact.unmapMappedFolios(obj).subscribe(
          data => {
            console.log(data);
            (this.type == '1') ? this.getFolioMappedData() : this.getFolioUnmappedData();
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
