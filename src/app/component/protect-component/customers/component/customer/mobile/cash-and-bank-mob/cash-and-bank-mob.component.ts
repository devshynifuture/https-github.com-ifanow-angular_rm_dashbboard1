import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-cash-and-bank-mob',
  templateUrl: './cash-and-bank-mob.component.html',
  styleUrls: ['./cash-and-bank-mob.component.scss']
})
export class CashAndBankMobComponent implements OnInit {
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  bankAccData: any;
  cashInHandData: any;
  @Output() outputValue = new EventEmitter<any>();
  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getBankAcc();
    this.getCashInHand();
  }
  getBankAcc(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getBankAccounts(obj).subscribe(
      data => {
        if(data){
          this.bankAccData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  getCashInHand(){
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getCashInHand(obj).subscribe(
      data => {
        if(data){
          this.cashInHandData = data;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
  
      }
    );
  }
  calculateSum(){
    this.totalCurrentValue = this.bankAccData.sumOfAccountBalance+this.cashInHandData.sumOfCashValue
  }
  changeValue(flag){
    this.outputValue.emit(flag);
  }
}
