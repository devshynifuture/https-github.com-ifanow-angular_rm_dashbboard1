import { AddPpfComponent } from './../common-component/add-ppf/add-ppf.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ExcelService } from '../../../../excel.service';
import { DetailedPpfComponent } from './detailed-ppf/detailed-ppf.component';

@Component({
  selector: 'app-ppf-scheme',
  templateUrl: './ppf-scheme.component.html',
  styleUrls: ['./ppf-scheme.component.scss']
})

export class PPFSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private excel: ExcelService, public dialog: MatDialog, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject) { }
  displayedColumns = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPpfSchemeData();
  }
  getPpfSchemeData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.dataSource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePPFData(obj).subscribe(
      data => this.getPpfSchemeDataResponse(data),
      (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      });
  }
  getPpfSchemeDataResponse(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No scheme found';
      this.dataSource.data = [];
    } else if (data && data.PPFList && data.PPFList.length > 0) {
      console.log('getPpfSchemeDataResponse',data);
      this.dataSource.data = data.PPFList;
      this.dataSource.sort = this.sort;
      UtilService.checkStatusId(this.dataSource.filteredData);

    } else {
      this.noData = 'No scheme found';
      this.dataSource.data = []
    }
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePPF(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("PPF is deleted", "dismiss")
            dialogRef.close();
            this.getPpfSchemeData();
          },
          error => this.eventService.showErrorMessage(error)
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
  openDetailPPF(data) {

    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPpfComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
  openAddPPF(data) {
    const fragmentData = {
      flag: 'addPpf',
      data,
      id: 1,
      state: 'open',
      componentName: AddPpfComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPpfSchemeData();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
export interface PeriodicElement16 {
  no: string;
  owner: string;
  cvalue: string;
  rate: string;
  amt: string;
  number: string;
  mdate: string;
  desc: string;
  status: string;
}
