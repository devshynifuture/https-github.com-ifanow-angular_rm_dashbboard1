import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {EnumServiceService} from 'src/app/services/enum-service.service';
import {CustomerService} from '../../customer/customer.service';
import {AuthService} from 'src/app/auth-service/authService';

@Component({
  selector: 'app-detailed-view-expenses',
  templateUrl: './detailed-view-expenses.component.html',
  styleUrls: ['./detailed-view-expenses.component.scss']
})
export class DetailedViewExpensesComponent implements OnInit {
  inputData: any;
  income: any;
  monthlyContribution: any[];
  expense: any;
  bankList = [];
  clientId: any;

  constructor(public custumService: CustomerService, public utils: UtilService, private subInjectService: SubscriptionInject, public enumService: EnumServiceService) {
  }

  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.expense = this.inputData;
    this.bankAccountList();

  }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  bankAccountList() {
    const array = [];
    const obj = {
      userId: this.expense.familyMemberId == 0 ? this.clientId : this.expense.id,
      userType: this.expense.familyMemberId == 0 ? 2 : 3
    };
    array.push(obj);
    this.custumService.getBankList(array).subscribe(
      (data) => {
        if (data) {
          this.bankList = data;
          this.bankList.forEach(element => {
            if (element.id == this.expense.linkedBankAccountNumber) {
              this.expense.bankName = element.bankName;
            }
          });
        }

        this.enumService.addBank(this.bankList);
      },
      (err) => {
        this.bankList = [];
      }
    );


// this.bankList = value;

  }

  get data() {
    return this.inputData;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
