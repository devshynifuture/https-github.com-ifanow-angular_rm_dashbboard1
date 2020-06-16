import { Component, NgZone, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AddClientComponent } from './add-client/add-client.component';
import { PeopleService } from '../../../people.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { CancelFlagService } from '../people-service/cancel-flag.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

@Component({
  selector: 'app-people-clients',
  templateUrl: './people-clients.component.html',
  styleUrls: ['./people-clients.component.scss']
})
export class PeopleClientsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'member', 'owner',
    'login', /*'status', *//*'icons',*/ 'icons1'];
  dataSource;
  advisorId: any;
  clientDatasource = new MatTableDataSource();
  isLoading: boolean;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('clientTableSort', { static: false }) clientTableSort: MatSort;
  screenSize: number;

  hasEndReached: boolean = false;
  finalClientList = [];

  constructor(private authService: AuthService, private ngZone: NgZone, private router: Router,
    private subInjectService: SubscriptionInject, public eventService: EventService,
    private peopleService: PeopleService, public dialog: MatDialog, private excel: ExcelGenService, private pdfGen: PdfGenService, private cancelFlagService: CancelFlagService, private enumDataService: EnumDataService,
  ) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    
    this.hasEndReached = true;
    this.clientDatasource.data = [{}, {}, {}];
    this.isLoading = true;
    this.getClientList(0);
  }

  // @HostListener('window:scroll', [])
  onWindowScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.hasEndReached = true;
        this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
      }

    }
  }

  onResize() {
    this.screenSize = window.innerWidth;
  }

  getClientList(offsetValue) {
    const obj = {
      advisorId: this.advisorId,
      status: 1,
      limit: 50,
      offset: offsetValue
    };

    this.peopleService.getClientList(obj).subscribe(
      data => {
        (this.finalClientList.length > 0) ? '' : this.isLoading = false;
        // this.isLoading = false;
        if (data && data.length > 0) {
          data.forEach((singleData) => {
            if (singleData.mobileList && singleData.mobileList.length > 0) {
              singleData.mobileNo = singleData.mobileList[0].mobileNo;
            }
            if (singleData.emailList && singleData.emailList.length > 0) {
              singleData.email = singleData.emailList[0].email;
            }
          });
          this.finalClientList = this.finalClientList.concat(data);
          this.clientDatasource.data = this.finalClientList;
          this.clientDatasource.sort = this.clientTableSort;
          this.hasEndReached = false;
        } else {
          this.isLoading = false;
          (this.finalClientList.length > 0) ? this.clientDatasource.data = this.finalClientList : this.clientDatasource.data = [];
        }
      },
      err => {
        this.isLoading = false;
        this.clientDatasource.data = [];
      }
    );

    // commented code closed which are giving errors ====>>>>>>>>>>>>>>.
  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle);
  }

  pdf(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }

  addClient(data) {
    if (data == null) {
      data = { flag: 'Add client', fieldFlag: 'client' };
    } else {
      data.flag = 'Edit client';
      data.fieldFlag = 'client';
    }
    const fragmentData = {
      flag: 'Add client',
      id: 1,
      data,
      state: 'open50',
      componentName: AddClientComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired || this.cancelFlagService.getCancelFlag()) {
            this.enumDataService.searchClientList();
            this.enumDataService.searchClientAndFamilyMember();
            this.cancelFlagService.setCancelFlag(undefined);
            this.getClientList(0);
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  selectClient(singleClientData) {
    console.log(singleClientData);
    this.ngZone.run(() => {
      this.authService.setClientData(singleClientData);
      this.router.navigate(['/customer/detail/overview/myfeed'], { state: { ...singleClientData } });
    });
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
            this.enumDataService.searchClientList();
            this.enumDataService.searchClientAndFamilyMember();
            this.getClientList(0);
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
