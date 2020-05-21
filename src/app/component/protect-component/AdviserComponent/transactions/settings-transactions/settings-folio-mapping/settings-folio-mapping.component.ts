import {Component, OnInit, ViewChild} from '@angular/core';
import {OnlineTransactionService} from '../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from '../../../Subscriptions/subscription-inject.service';
import {AddClientMappingComponent} from '../settings-client-mapping/add-client-mapping/add-client-mapping.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from 'src/app/auth-service/authService';
import {TransactionEnumService} from '../../transaction-enum.service';

@Component({
  selector: 'app-settings-folio-mapping',
  templateUrl: './settings-folio-mapping.component.html',
  styleUrls: ['./settings-folio-mapping.component.scss']
})
export class SettingsFolioMappingComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'schemeName', 'iname', 'hold', 'map'];
  displayedColumnsUnmapped: string[] = ['folioNumber', 'schemeName', 'name', 'hold', 'map'];
  displayedColumnsMapped: string[] = ['folioNumber', 'schemeName', 'name', 'accountno', 'platformtype', 'map'];
  displayedColumns = [];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  filterData: any;
  type: string = '1';
  selectedBrokerCode: any;
  selectedPlatform: any;
  nomineesListFM: any = [];
  familyMemberData: any;
  isLoading: boolean;
  clientData: any;
  advisorId: any;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public dialog: MatDialog, private onlineTransact: OnlineTransactionService,
              private eventService: EventService, private utilService: UtilService,
              private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.getFilterOptionData();
  }

  sortDataFilterWise() {
    (this.type == '1') ? this.getFolioMappedData() : this.getFolioUnmappedData();
  }

  ownerDetails(value) {
    this.clientData = value;
    this.sortDataFilterWise();
  }

  getFilterOptionData() {
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data)
    );
  }

  getFilterOptionDataRes(data) {
    if (data) {
      this.filterData = TransactionEnumService.setPlatformEnum(data);
      this.type = '1';
      this.selectedBrokerCode = data[0];
      this.selectedPlatform = data[0];
      this.dataSource.data = [{}, {}, {}];
      this.sortDataFilterWise();
    } else {
      this.isLoading = false;
      this.dataSource.data = [];
    }
  }

  getFolioMappedData() {
    this.displayedColumns = this.displayedColumnsMapped;

    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    (this.clientData == undefined) ? this.clientData = {clientId: '', familyMemberId: ''} : '';
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true,
      clientId: this.clientData.clientId,
      familyMemberId: this.clientData.familyMemberId
    };
    this.onlineTransact.getFolioMappedData(obj).subscribe(
      data => {
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
        }
        this.isLoading = false;
      },
      err => {
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  getFolioUnmappedData() {
    this.displayedColumns = this.displayedColumnsUnmapped;
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    (this.clientData == undefined) ? this.clientData = {clientId: '', familyMemberId: ''} : '';
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true,
    };
    this.onlineTransact.getFolioUnmappedData(obj).subscribe(
      data => {
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
        }
        this.isLoading = false;
      },
      err => {
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  chnageBrokerCode(value) {
    this.selectedPlatform = value;
    this.sortDataFilterWise();
  }

  changePlatform(value) {
    this.selectedBrokerCode = value;
    this.sortDataFilterWise();
  }

  lisNominee(value) {
    this.nomineesListFM = Object.assign([], value);
  }

  unmapFolio(value, data) {
    const dialogData = {
      data,
      header: 'UNMAP',
      body: 'Are you sure you want to unmap?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNMAP',
      positiveMethod: () => {
        const obj = {
          tpFolioClientCodeMappingId: value.tpFolioClientCodeMappingId,
        };
        this.onlineTransact.unmapMappedFolios(obj).subscribe(
          data => {
            this.sortDataFilterWise();
            dialogRef.close();
          },
          err => this.eventService.openSnackBar(err, 'Dismiss')
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openAddMappiing(data, flag) {
    data.flag = 'folio';
    data.selectedBroker = this.selectedBrokerCode;
    const fragmentData = {
      flag: 'folioMapping',
      data,
      id: 1,
      state: 'open45',
      componentName: AddClientMappingComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.sortDataFilterWise();
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
