import { Directive, Input, EventEmitter, Output, ElementRef, Renderer2, HostListener } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { ClientBankComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-bank/client-bank.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Directive({
  selector: '[appBankAccount]'
})
export class BankAccountDirective {
  bankAccountList: any;
  advisorId: any;
  clientId: any;

  constructor(private custumService: CustomerService,private el: ElementRef, private renderer: Renderer2,private subInjectService :SubscriptionInject,private UtilService:UtilService) { }
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
  @HostListener('click', ['$event.target']) onClick() {
    this.openBankForm('');
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

  openBankForm(data) {
    const fragmentData = {
      data: data,
      id: 1,
      state: 'open50',
      componentName: ClientBankComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log(sideBarData)
          this.getAccountList();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
