import { Directive, Input, EventEmitter, Output, ElementRef, Renderer2, HostListener } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { ClientBankComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/client-bank/client-bank.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Directive({
  selector: '[appBankAccount]'
})
export class BankAccountDirective {
  bankAccountList: any;
  advisorId: any;
  clientId: any;
  clientData: any;

  constructor(private custumService: CustomerService,private el: ElementRef, private renderer: Renderer2,private subInjectService :SubscriptionInject,private UtilService:UtilService,private eventService:EventService) { }
  @Output() inputChange = new EventEmitter();

 

  @Input() set data(data) {
    this.bankAccountList = data.controleData;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData()
    console.log('1111121212121212121212 OwnerColumnComponent data : ', data);
    this.getAccountList();
  }
  get data() {
    return this.bankAccountList;
  }
  @HostListener('click', ['$event.target']) onClick() {
    this.clientData['clientId'] = this.clientData['id']
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
          this.eventService.openSnackBar('Bank added successfully', 'Ok');
          this.getAccountList();
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
