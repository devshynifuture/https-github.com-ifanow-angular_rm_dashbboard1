import { Directive, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';

@Directive({
  selector: '[appBankAccount]'
})
export class BankAccountDirective {
  bankAccountList: any;
  advisorId: any;
  clientId: any;

  constructor(private custumService: CustomerService) { }
  @Output() inputChange = new EventEmitter();

  get data() {
    return this.bankAccountList;
  }

  @Input() set data(data) {
    this.bankAccountList = data.controleData;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    this.getAccountList();
  }

  getAccountList() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custumService.getBankAccount(obj).subscribe(
      data => this.getBankAccountRes(data)
    );
  }
  getBankAccountRes(data) {
    console.log('bankAccountDetails--->', data);
    this.inputChange.emit(data);
  }
}
