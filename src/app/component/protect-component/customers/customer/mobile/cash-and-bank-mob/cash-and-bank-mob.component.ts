import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

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
  showDetail
  @Output() outputValue = new EventEmitter<any>();
  assetSubType = { assetType: '', data: '' };


  accCv: any;
  cashInHandCv: any;
  constructor(private custumService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getBankAcc();
    this.getCashInHand();
  }
  getBankAcc() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getBankAccounts(obj).subscribe(
      data => {
        if (data) {
          this.bankAccData = data;
          this.accCv = data.sumOfAccountBalance;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  getCashInHand() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getCashInHand(obj).subscribe(
      data => {
        if (data) {
          this.cashInHandData = data;
          this.cashInHandCv = data.sumOfCashValue;
          this.calculateSum();
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);

      }
    );
  }
  calculateSum() {
    this.totalCurrentValue = (this.accCv ? this.accCv : 0) + (this.cashInHandCv ? this.cashInHandCv : 0)
  }
  changeValue(flag) {
    this.outputValue.emit(flag);
  }
  openSubAsset(subAsset, value) {
    this.assetSubType.assetType = subAsset;
    this.assetSubType.data = value;
  }
}
