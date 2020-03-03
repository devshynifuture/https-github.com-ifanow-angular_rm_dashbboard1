import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OnlineTransactionService } from '../online-transaction.service';
import { TransactionEnumService } from '../transaction-enum.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-investors-transactions',
  templateUrl: './investors-transactions.component.html',
  styleUrls: ['./investors-transactions.component.scss']
})
export class InvestorsTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'status', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  filterData: any;
  selectedBrokerCode: any;
  selectedPlatform: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // dataSource = ELEMENT_DATA;
  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService) { }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
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
    // this.type = '1';
    // this.selectedBrokerCode = data[0];
    // this.selectedPlatform = data[0];
    // this.dataSource = [{}, {}, {}];
    // this.sortDataFilterWise();
  }
  // sortDataFilterWise() {
  //   (this.type == '1') ? this.getMappedData() : this.getUnmappedData();
  // }
  getMappedData() {
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    let obj =
    {
      advisorId: this.advisorId,
      // tpUserCredentialId: this.selectedBrokerCode.id,
      // aggregatorType: this.selectedPlatform.aggregatorType
    }
    this.onlineTransact.getMapppedClients(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dataSource.data = TransactionEnumService.setHoldingTypeEnum(data);
          this.dataSource.sort = this.sort;
        } 
        this.isLoading = false;
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    )
  }
  // getUnmappedData() {
  //   this.isLoading = true;
  //   this.dataSource = [{}, {}, {}];
  //   let obj =
  //   {
  //     advisorId: this.advisorId,
  //     tpUserCredentialId: this.selectedBrokerCode.id,
  //     aggregatorType: this.selectedPlatform.aggregatorType
  //   }
  //   this.onlineTransact.getUnmappedClients(obj).subscribe(
  //     data => {
  //       console.log(data);
  //       this.dataSource = TransactionEnumService.setHoldingTypeEnum(data);
  //       this.isLoading = false;
  //     },
  //     err => this.eventService.openSnackBar(err, 'dismiss')
  //   )
  // }
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