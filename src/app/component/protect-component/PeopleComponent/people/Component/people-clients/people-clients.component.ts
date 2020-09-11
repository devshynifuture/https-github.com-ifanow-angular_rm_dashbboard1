import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { CancelFlagService } from '../people-service/cancel-flag.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { Subscription, Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { element } from 'protractor';
import { ResetClientPasswordComponent } from './add-client/reset-client-password/reset-client-password.component';
import { ExcelClientListService } from 'src/app/services/excel-client-list.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  infiniteScrollingFlag;
  hasEndReached = false;
  finalClientList = [];
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  downloadLoader: boolean = false;

  constructor(private authService: AuthService, private ngZone: NgZone, private router: Router,
    private subInjectService: SubscriptionInject, public eventService: EventService,
    private peopleService: PeopleService, public dialog: MatDialog, private excel: ExcelClientListService, private pdfGen: PdfGenService, private cancelFlagService: CancelFlagService, private enumDataService: EnumDataService,
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
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getClientList(this.finalClientList.length);
        // this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
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
        this.isLoading = false;
        if (data && data.length > 0) {
          data = this.formatEmailAndMobile(data)
          this.finalClientList = this.finalClientList.concat(data);
          this.clientDatasource.data = this.finalClientList;
          this.clientDatasource.sort = this.clientTableSort;
          this.hasEndReached = false;
          this.infiniteScrollingFlag = false;
        } else {
          this.isLoading = false;
          this.infiniteScrollingFlag = false;
          this.clientDatasource.data = (this.finalClientList.length > 0) ? this.finalClientList : [];
        }
      },
      err => {
        this.isLoading = false;
        this.clientDatasource.data = [];
      }
    );

    // commented code closed which are giving errors ====>>>>>>>>>>>>>>.
  }

  formatEmailAndMobile(data) {
    data.forEach((singleData) => {
      if (singleData.mobileList && singleData.mobileList.length > 0) {
        singleData.mobileNo = singleData.mobileList[0].mobileNo;
      }
      if (singleData.emailList && singleData.emailList.length > 0) {
        singleData.email = singleData.emailList[0].email;
      }
    });
    return data
  }

  Excel(title, flag) {
    // const rows = this.tableEl._elementRef.nativeElement.rows;
    // this.excel.generateExcel(rows, tableTitle);
    this.getFullClientList(title, flag);
  }

  pdf(title, flag) {
    // const rows = this.tableEl._elementRef.nativeElement.rows;
    // this.pdfGen.generatePdf(rows, tableTitle);
    this.getFullClientList(title, flag);
  }

  getFullClientList(title, flag) {
    this.eventService.openSnackBar(`Downloading ${flag} will take some time!`, "Dismiss");
    this.downloadLoader = true
    const obj = {
      advisorId: this.advisorId,
      status: 1,
      limit: 0,
      offset: -1
    };

    this.peopleService.getClientList(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.downloadLoader = false
          data = this.formatEmailAndMobile(data);
          let tableData = [];
          data.forEach(element => {
            element.mobileNo = element.mobileNo == 0 ? 'N/A' : element.mobileNo;
            tableData.push([element.name, String(element.mobileNo), element.email, element.pan, String(element.count), element.ownerName, element.lastLoginString, String(element.status)]);
          });
          const header = ["Group head name", "Registered mobile", "Registered email", "PAN", "Members", "Client owner", "Last login", "Status"];
          (flag == 'excel') ? this.excel.generateExcel(title, header, tableData) : this.pdfGen.generatePdfWithoutHtml(title, header, tableData);;
        }
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        this.downloadLoader = false
      }
    );
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
            this.finalClientList = [];
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
            this.isLoading = true;
            this.finalClientList = [];
            this.clientDatasource.data = [{}, {}, {}];
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

  resetPassword(value, data) {
    const dialogData = {
      data: value,
      header: 'RESET PASSWORD',
      body: 'Are you sure you want to reset password?',
      body2: 'An email will be sent to the client to reset password',
      btnYes: 'CANCEL',
      btnNo: 'RESET',
      positiveMethod: () => {
        const obj = {
          advisorId: data.advisorId,
          clientId: data.clientId
        };
        this.peopleService.resetClientPassword(obj).subscribe(
          responseData => {
            this.eventService.openSnackBar('Email sent successfully!', 'Dismiss');
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ResetClientPasswordComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  searchClientFamilyMember(value) {
    if (value.length == 0) {
      this.hasEndReached = true;
      this.clientDatasource.data = [{}, {}, {}];
      this.isLoading = true;
      this.getClientList(0)
    }
    if (value.length <= 2) {
      // this.showDefaultDropDownOnSearch = false;
      // this.isLoding = false;
      // this.clientList = undefined;
      return;
    }
    // if (!this.clientList) {
    //   this.showDefaultDropDownOnSearch = true;
    //   this.isLoding = true;
    // }
    this.hasEndReached = true;
    this.clientDatasource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.peopleService.getClientsSearchList(obj).subscribe(responseArray => {
            if (responseArray) {
              responseArray = this.formatEmailAndMobile(responseArray)
              responseArray = responseArray.filter(element => element.userType == 2);
              this.finalClientList = responseArray
              this.clientDatasource.data = responseArray;
              this.hasEndReached = false;
              this.infiniteScrollingFlag = false;
              this.isLoading = false
            } else {
              this.isLoading = false;
              this.infiniteScrollingFlag = false;
              this.clientDatasource.data = [];
            }
          }, error => {
            this.eventService.openSnackBar(error, "Dimiss")
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }
}
