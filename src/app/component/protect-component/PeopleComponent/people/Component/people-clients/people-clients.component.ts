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
import { Observable, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { ResetClientPasswordComponent } from './add-client/reset-client-password/reset-client-password.component';
import { ExcelClientListService } from 'src/app/services/excel-client-list.service';
import { RoleService } from 'src/app/auth-service/role.service';
import { element } from 'protractor';
import { EnumServiceService } from 'src/app/services/enum-service.service';

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
  clientInfo: any;
  getOrgData: any;
  userInfo: any;
  tabviewshow: any;
  reportDate = new Date();
  constructor(private authService: AuthService, private ngZone: NgZone, private router: Router,
    private utilService: UtilService,
    private subInjectService: SubscriptionInject, public eventService: EventService,
    private peopleService: PeopleService, public dialog: MatDialog, private excel: ExcelClientListService,
    public roleService: RoleService,
    private pdfGen: PdfGenService, private cancelFlagService: CancelFlagService, private enumDataService: EnumDataService,
    private enumService: EnumServiceService,
    private auth: AuthService
  ) {
    this.clientInfo = AuthService.getClientData();
    this.userInfo = AuthService.getUserInfo();
    this.getOrgData = AuthService.getOrgDetails();
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

    if (this.peopleService.clientList) {
      this.hasEndReached = false;
      this.finalClientList = this.peopleService.clientList;
      this.clientDatasource.data = this.finalClientList;
      this.clientDatasource.sort = this.clientTableSort;
      this.isLoading = false;
      const obj = {
        advisorId: this.advisorId,
        status: 1,
        limit: 50,
        offset: 0
      };

      this.peopleService.getClientList(obj).subscribe(
        data => {
          (this.finalClientList.length > 0) ? '' : this.isLoading = false;
          this.isLoading = false;
          if (data && data.length > 0) {
            data = this.formatEmailAndMobile(data);
            this.finalClientList = data;
            this.peopleService.clientList = data;
            this.clientDatasource.data = this.finalClientList;
            this.clientDatasource.sort = this.clientTableSort;
          }
        }
      )
    } else {
      this.hasEndReached = true;
      this.clientDatasource.data = [{}, {}, {}];
      this.isLoading = true;
      this.getClientList(0);
    }
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
          (offsetValue == 0) ? this.peopleService.clientList = data : '';
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

  fragmentData = { isSpinner: false };
  returnValue: any;

  pdf(template, tableTitle) {
    // const rows = this.tableEl._elementRef.nativeElement.rows;
    // this.pdfGen.generatePdf(rows, tableTitle);
    // this.getFullClientList(title, flag);


    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.fragmentData.isSpinner = true;
    const para = document.getElementById(template);
    const obj = {
      htmlInput: para.innerHTML,
      name: tableTitle,
      landscape: true,
      key: '',
      svg: ''
    };
    let header = null
    this.returnValue = this.utilService.htmlToPdf(header, para.innerHTML, tableTitle, false, this.fragmentData, '', '', true, null);
    console.log('return value ====', this.returnValue);
    return obj;
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
            element.lastLoginString = element.loginEnable ? element.lastLoginString : 'DISABLED';
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
    if (window.innerWidth <= 1024) {
      this.tabviewshow = 'open80'
    }
    else { this.tabviewshow = 'open50' }
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
      state: this.tabviewshow,
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
            this.peopleService.clientList = undefined;
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
    this.auth.setClientData(singleClientData);
    if (this.enumService.getClientRole() && this.enumService.getClientRole().some(element => element.id === singleClientData.roleId)) {
      this.ngZone.run(() => {
        // this.roleService.getClientRoleDetails(singleClientData.roleId, (rolesData) => {
        //   this.roleService.constructClientDataSource(rolesData);
        const url = this.roleService.goToValidClientSideUrl();
        this.authService.setClientData(singleClientData);
        this.router.navigate([url], { state: { ...singleClientData } });
        // });
      });
    } else {
      const url = this.roleService.goToValidClientSideUrl();
      this.router.navigate([url], { state: { ...singleClientData } });
    }
  }



  deleteModal(value, data) {
    const obj = {
      advisorId: this.advisorId,
      clientId: data.clientId
    }
    this.peopleService.getClientAllAssetCount(obj).subscribe(
      res => {
        let msg = (res && res != 0) ? `There are ${res} assets mapped against this client. Are you sure you want to delete?` : 'Are you sure you want to delete?';
        const dialogData = {
          data: value,
          header: 'DELETE',
          body: msg,
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
    )

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
  DisableClientLogin(value, data) {
    const dialogData = {
      data: value,
      header: !data.loginEnable ? 'ENABLE LOGIN' : 'DISABLE LOGIN',
      body: !data.loginEnable ? 'Are you sure you want to enable this login?' : 'Are you sure you want to disable this login?',
      body2: !data.loginEnable ? 'If enable client will successfully login' : 'If disable client will not able to login',
      btnYes: 'CANCEL',
      btnNo: !data.loginEnable ? 'ENABLE' : 'DISABLE',
      positiveMethod: () => {
        const obj = {
          clientId: data.clientId,
          loginEnable: !data.loginEnable ? true : false
        };
        this.peopleService.DisableLogin(obj).subscribe(
          responseData => {
            let status = data.loginEnable ? 'Enable' : 'Disable';
            this.eventService.openSnackBar(status + 'client successfully!', 'Dismiss');
            dialogRef.close();
            this.finalClientList = [];
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
