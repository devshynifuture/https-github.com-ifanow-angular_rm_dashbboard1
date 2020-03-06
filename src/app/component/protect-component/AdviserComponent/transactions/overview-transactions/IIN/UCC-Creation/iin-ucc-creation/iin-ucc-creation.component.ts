import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { PersonalDetailsInnComponent } from '../personal-details-inn/personal-details-inn.component';
import { OnlineTransactionService } from '../../../../online-transaction.service';

@Component({
  selector: 'app-iin-ucc-creation',
  templateUrl: './iin-ucc-creation.component.html',
  styleUrls: ['./iin-ucc-creation.component.scss']
})
export class IinUccCreationComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject,private fb: FormBuilder,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService, 
    private onlineTransact: OnlineTransactionService,public eventService: EventService) { }

 ngOnInit() {
  this.getIINUCCRegistration()
 }

 Close(flag) {
   this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
 }
 close() {
  const fragmentData = {
    direction: 'top',
    componentName: IinUccCreationComponent,
    state: 'close'
  };

  this.eventService.changeUpperSliderState(fragmentData);
}
 openPersonalDetails(data) {
   const fragmentData = {
     flag: 'app-upper-customer',
     id: 1,
     data,
     direction: 'top',
     componentName: PersonalDetailsInnComponent,
     state: 'open'
   };
   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
     upperSliderData => {
       if (UtilService.isDialogClose(upperSliderData)) {
         // this.getClientSubscriptionList();
         subscription.unsubscribe();
       }
     }
   );
 }
 getIINUCCRegistration(){
   let obj ={
    id : 2,
   }

  this.onlineTransact.getIINUCCRegistration(obj).subscribe(
    data => this.getIINUCCRegistrationRes(data), (error) => {
    }
  );
 }
 getIINUCCRegistrationRes(data){
  console.log('INN UCC CREATION DATA GET', data)
 }
 
}
