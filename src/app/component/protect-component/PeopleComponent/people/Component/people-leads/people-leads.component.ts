import { Component, OnInit, ViewChild } from '@angular/core';
import { LeadsClientsComponent } from './leads-clients/leads-clients.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddClientComponent } from '../people-clients/add-client/add-client.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from '../../../people.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { CancelFlagService } from '../people-service/cancel-flag.service';

@Component({
  selector: 'app-people-leads',
  templateUrl: './people-leads.component.html',
  styleUrls: ['./people-leads.component.scss']
})
export class PeopleLeadsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'lsource', 'lrating',/*'status', 'rating',*/ 'lead',
    'icons'];
  leadDataSource = new MatTableDataSource();
  isLoading: boolean;
  advisorId: any;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('leadTableSort', { static: false }) leadTableSort: MatSort;
  constructor(private pdfGen: PdfGenService, private excel: ExcelGenService, public dialog: MatDialog, public eventService: EventService, private subInjectService: SubscriptionInject, private peopleService: PeopleService, private cancelFlagService: CancelFlagService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getLeadList();
  }
  getLeadList() {
    this.leadDataSource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      status: 2
    };
    this.peopleService.getClientList(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        if (data && data.length > 0) {
          data.forEach((singleData) => {
            if (singleData.mobileList && singleData.mobileList.length > 0) {
              singleData.mobileNo = singleData.mobileList[0].mobileNo;
            }
            if (singleData.emailList && singleData.emailList.length > 0) {
              singleData.email = singleData.emailList[0].email;
            }
          });
          this.leadDataSource.data = data;
          this.leadDataSource.sort = this.leadTableSort;
        }
        else {
          this.leadDataSource.data = [];
        }
      },
      err => {
        this.leadDataSource.data = [];
      }
    );
  }
  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }
  pdf(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }
  open(data, flag) {
    let component;
    if (flag == 'lead') {
      if (data == null) {
        data = { flag: 'Add lead', fieldFlag: 'lead' };
      } else {
        data.flag = 'Edit lead';
        data.fieldFlag = 'lead';
      }
      component = AddClientComponent;
    } else {
      component = LeadsClientsComponent;
    }
    const fragmentData = {
      flag,
      id: 1,
      data,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired || this.cancelFlagService.getCancelFlag()) {
            this.cancelFlagService.setCancelFlag(undefined)
            this.getLeadList();
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj = {
          clientId: data.clientId,
          userType: 2
        };
        this.peopleService.deleteClient(obj).subscribe(
          responseData => {
            this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
            dialogRef.close();
            this.getLeadList();
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
}
