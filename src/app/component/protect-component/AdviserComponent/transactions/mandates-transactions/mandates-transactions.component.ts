import { Component, OnInit } from '@angular/core';
import { OnlineTransactionService } from '../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mandates-transactions',
  templateUrl: './mandates-transactions.component.html',
  styleUrls: ['./mandates-transactions.component.scss']
})
export class MandatesTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'type', 'status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  dataSource: any;
  clientId: any;
  constructor( private onlineTransact: OnlineTransactionService,private eventService:EventService) { }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getNSEAchmandate()
  }
  getNSEAchmandate() {
    this.dataSource = [{}, {}, {}];
    this.isLoading = true;
    let obj1 = {
     advisorId:this.advisorId,
    }
    this.onlineTransact.getMandateList(obj1).subscribe(
      data => this.getMandateListRes(data), (error) => {
        this.isLoading = false;
        this.dataSource=undefined;
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMandateListRes(data){
    this.isLoading = false;
    console.log(data);
    this.dataSource=data;
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