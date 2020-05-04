import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {ClientBankComponent} from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-bank/client-bank.component';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {HostListener} from '@angular/core/src/metadata/*';

@Directive({
  selector: '[appBankAccount]'
})
export class BankAccountDirective {
  bankAccountList: any;
  advisorId: any;
  clientId: any;
  clientData: any;
  @Output() outputValue = new EventEmitter<any>();

  constructor(private custumService: CustomerService,
              private subInjectService: SubscriptionInject,
              private utilService: UtilService, private eventService: EventService) {
  }

  _data;

  get data() {
    return this._data;
  }

  @Input()
  set data(data) {
    this._data = data;
    this.bankAccountList = data.controleData;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    this.getAccountList();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    this.clientData.clientId = this.clientData.clientId;
    this.openBankForm(this.clientData);
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
    this.outputValue.emit(data);
  }

  openBankForm(data) {
    const fragmentData = {
      data,
      id: 1,
      state: 'open50',
      componentName: ClientBankComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log(sideBarData);
          this.eventService.openSnackBar('Bank added successfully', 'Ok');
          this.getAccountList();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
