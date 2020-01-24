import { AddPoSavingComponent } from './../common-component/add-po-saving/add-po-saving.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoSavingsComponent } from './detailed-po-savings/detailed-po-savings.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';

@Component({
  selector: 'app-po-savings',
  templateUrl: './po-savings.component.html',
  styleUrls: ['./po-savings.component.scss']
})
export class PoSavingsComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  posavingdata: any;
  currentValueSum: number;
  balanceMentionedSum: number;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];
  footerRowColumn = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];

  displayedColumns20 = ['no', 'owner', 'cvalue', 'rate', 'balanceM', 'balAs', 'desc', 'status', 'icons'];


  constructor(private excel: ExcelService, public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoSavingSchemedata();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 20, key: 'Balance Mentioned' },
    { width: 25, key: 'Balance As On' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' }];
    const header = ['Owner', 'Current Value', 'Rate', 'Balance Mentioned',
      'Balance As On', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue), (element.rate), (element.balance),
      new Date(element.balanceAsOn), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.currentValueSum), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.balanceMentionedSum), '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoSavingSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemePOSAVINGData(obj).subscribe(
      data => this.getPoSavingSchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoSavingSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data && data.PostOfficeSavingsList.length != 0) {
      this.datasource.data = data.PostOfficeSavingsList;
      this.datasource.sort = this.sort;
      this.currentValueSum = data.currentValueSum;
      this.balanceMentionedSum = data.balanceMentionedSum;
      this.posavingdata = data;
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = [];

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
        this.cusService.deletePOSAVING(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('POSAVING is deleted', 'dismiss');
            dialogRef.close();
            this.getPoSavingSchemedata();
          },
          error => this.eventService.showErrorMessage(error)
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

  openDetailPoSaving(data) {
    const fragmentData = {
      flag: 'detailPoSaving',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoSavingsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }

  openAddPOSAVING(data) {
    const fragmentData = {
      flag: 'addPOSAVING',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoSavingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getPoSavingSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
        
      }
    );
  }
}
