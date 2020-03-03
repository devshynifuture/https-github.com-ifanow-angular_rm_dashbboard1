import { Component, OnInit, ViewChild } from '@angular/core';
import { OnlineTransactionService } from '../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-mandates-transactions',
  templateUrl: './mandates-transactions.component.html',
  styleUrls: ['./mandates-transactions.component.scss']
})
export class MandatesTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'type', 'status'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  clientId: any;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor( private onlineTransact: OnlineTransactionService,private eventService:EventService) { }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getNSEAchmandate()
  }
  getNSEAchmandate() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    let obj1 = {
     advisorId:this.advisorId,
    }
    this.onlineTransact.getMandateList(obj1).subscribe(
      data => this.getMandateListRes(data), (error) => {
        this.isLoading = false;
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMandateListRes(data){
    this.isLoading = false;
    console.log(data);
    this.dataSource.data=data;
     this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
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
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain', symbol: '5011102595', bank: 'ICICI Bank', bankac: '001101330032',
    amt: '50,000', type: 'E-Mandate', status: 'Approved'
  },

];