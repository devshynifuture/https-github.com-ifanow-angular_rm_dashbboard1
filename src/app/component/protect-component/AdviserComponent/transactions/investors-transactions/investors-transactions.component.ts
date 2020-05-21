import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {OnlineTransactionService} from '../online-transaction.service';
import {TransactionEnumService} from '../transaction-enum.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {EnumServiceService} from '../../../../../services/enum-service.service';
import {IinUccCreationComponent} from '../overview-transactions/IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from '../../Subscriptions/subscription-inject.service';
import {InvestorDetailComponent} from './investor-detail/investor-detail.component';

@Component({
  selector: 'app-investors-transactions',
  templateUrl: './investors-transactions.component.html',
  styleUrls: ['./investors-transactions.component.scss']
})
export class InvestorsTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['aggregatorType', 'brokerCode', 'name', 'panNo', 'taxStatus', 'holdingType',
    'clientCode', 'status'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  filterData: any;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  noData: string;
  innUccPendindList: any;
  credentialData: any;
  dontHide: boolean;
  isPendingData = false;

  // dataSource = ELEMENT_DATA;
  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService,
              private enumServiceService: EnumServiceService, private subInjectService: SubscriptionInject) {
  }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.isLoading = true;
    // this.getMappedData();
    this.getFilterOptionData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
    if (this.dataSource.filteredData.length == 0) {
      this.noData = 'No investors found';
    }
  }

  refresh(flag) {
    this.dontHide = true;
    this.getIINUCC();
  }

  getFilterOptionData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data),
      err => {
        this.isLoading = false;
        this.noData = 'No credentials found';
        this.dataSource.data = [];
      }
    );
  }

  getFilterOptionDataRes(data) {

    if (data) {
      this.credentialData = data;
      this.getMappedData();
    } else {
      this.isLoading = false;
      this.dataSource.data = [];
      this.noData = 'No credentials found';
    }
    // this.filterData = TransactionEnumService.setPlatformEnum(data);
  }

  // sortDataFilterWise() {
  //   (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  // }
  getMappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      // tpUserCredentialId: this.selectedBrokerCode.id,
      // aggregatorType: this.selectedPlatform.aggregatorType
    };
    this.isPendingData = false;
    this.onlineTransact.getMapppedClients(obj).subscribe(
      data => {
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService);
          this.dataSource.sort = this.sort;
        } else if (data == undefined) {
          this.noData = 'No investors found';
          this.dataSource.data = [];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.noData = 'No investors found';
        this.dataSource.data = [];
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  getIINUCC() {
    this.dontHide = true;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId
    };
    this.isPendingData = true;

    this.onlineTransact.getIINUCCPending(obj).subscribe(
      data => {
        this.isLoading = false;
        this.dontHide = true;
        this.innUccPendindList = data || [];
        this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
        this.dataSource.data = TransactionEnumService.setTaxStatusDesc(this.dataSource.data, this.enumServiceService);
        this.dataSource.sort = this.sort;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  openInvestorDetail(data) {
    if (this.isLoading || !this.isPendingData) {
      return;
    }
    const fragmentData = {
      flag: 'investorDetail',
      data,
      id: 1,
      state: 'open35',
      componentName: InvestorDetailComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

}
