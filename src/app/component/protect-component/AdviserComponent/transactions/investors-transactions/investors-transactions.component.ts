import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OnlineTransactionService } from '../online-transaction.service';
import { TransactionEnumService } from '../transaction-enum.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { EnumServiceService } from '../../../../../services/enum-service.service';
import { IinUccCreationComponent } from '../overview-transactions/IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-investors-transactions',
  templateUrl: './investors-transactions.component.html',
  styleUrls: ['./investors-transactions.component.scss']
})
export class InvestorsTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'status'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  filterData: any;
  selectedBrokerCode: any;
  selectedPlatform: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  noData: string;
  innUccPendindList: any;

  // dataSource = ELEMENT_DATA;
  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService,
    private enumServiceService: EnumServiceService) {
  }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.isLoading = true;
    this.getMappedData();
    // this.getFilterOptionData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  // getFilterOptionData() {
  //   let obj = {
  //     advisorId: this.advisorId,
  //     onlyBrokerCred: true
  //   }
  //   console.log('encode', obj)
  //   this.onlineTransact.getBSECredentials(obj).subscribe(
  //     data => this.getFilterOptionDataRes(data)
  //   );
  // }
  getFilterOptionDataRes(data) {

    console.log(data);
    this.filterData = TransactionEnumService.setPlatformEnum(data);
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
    this.onlineTransact.getMapppedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          TransactionEnumService.setTaxStatusDesc(data, this.enumServiceService);
          this.dataSource.sort = this.sort;
        } else if (data == undefined) {
          this.noData = 'No scheme found';
          this.dataSource.data = [];
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.dataSource.data = [];
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  getIINUCC(){
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId
    };
    this.onlineTransact.getIINUCCPending(obj).subscribe(
      data => {
        this.isLoading = false;
        this.innUccPendindList = data || [];
        this.dataSource.data =TransactionEnumService.setHoldingTypeEnum(data)
        TransactionEnumService.setTaxStatusDesc(data, this.enumServiceService);
          this.dataSource.sort = this.sort;
        console.log('innUccPendindList', this.innUccPendindList)
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss')
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

}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  bank: string;
  bankac: string;
  amt: string;
  type: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain', symbol: 'AATPJ1239L', bank: 'Individual', bankac: 'Anyone or survivor',
    amt: '5011102595', type: '50,000', status: 'Investment ready'
  },

];
