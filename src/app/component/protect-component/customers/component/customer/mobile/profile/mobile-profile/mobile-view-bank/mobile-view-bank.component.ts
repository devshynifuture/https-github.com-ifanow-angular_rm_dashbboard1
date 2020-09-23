import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerService} from '../../../../customer.service';

@Component({
  selector: 'app-mobile-view-bank',
  templateUrl: './mobile-view-bank.component.html',
  styleUrls: ['./mobile-view-bank.component.scss']
})
export class MobileViewBankComponent implements OnInit {
  bankFlag: boolean;
  bankList: any;
  userData: any;
  selectedBank: any;

  constructor(private cusService: CustomerService) {
  }

  ngOnInit() {
  }

  @Output() backfunc = new EventEmitter();

  @Input() set data(data) {
    this.userData = data;
    this.getBankList(data);
  }

  getBankList(data) {
    this.bankFlag = true;
    const obj = [{
      userId: data.familyMemberId,
      userType: data.userType
    }];
    this.cusService.getBankList(obj).subscribe(
      data => {
        this.bankFlag = false;
        console.log(data);
        if (data && data.length > 0) {
          this.bankList = data;
          this.bankList.forEach(singleBank => {
            singleBank.accountTypeName = (singleBank.accountType == '1') ? 'Saving A/c' : (singleBank.accountType == '2') ? 'Current A/c' : (singleBank.accountType == '3') ? 'NRE' : (singleBank.accountType == '4') ? 'NRO' : 'Cash credit A/c';
            singleBank.shortAddress = singleBank.address ? singleBank.address.city ? singleBank.address.city : '' : '';
          });
        }
      },
      err => {
        this.bankFlag = false;
        this.bankList = undefined;
        console.error(err);
      }
    );
  }

  back() {
    this.backfunc.emit(undefined);
  }

  addEditBank(data) {
    this.selectedBank = this.userData;
    this.selectedBank.bankData = data;
  }

  addEditFlag(data) {
    this.selectedBank = undefined;
    this.getBankList(this.userData);
  }
}
