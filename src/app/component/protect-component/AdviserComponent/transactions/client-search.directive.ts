import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { OnlineTransactionService } from './online-transaction.service';
import { Observable, Subscription } from 'rxjs';
import { PeopleService } from '../../PeopleComponent/people.service';

@Directive({
  selector: '[appClientSearch]'
})
export class ClientSearchDirective implements OnInit {
  familyMemberData: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any = [];
  @Output() valueChange = new EventEmitter();
  @Output() valueChange1 = new EventEmitter();
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();

  constructor(private onlineTransact: OnlineTransactionService, private peopleService: PeopleService) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getFamilyList(data);
  }

  ngOnInit() {
    console.log('client search');
  }

  getFamilyList(value) {
    console.log('getFamilyList value: ', value);

    (value == '') ? this.familyMemberData = undefined : '';
    const obj = {
      advisorId: this.advisorId,
      displayName: value
    };
    // if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
    //   this.familyOutputSubscription.unsubscribe();
    // }
    if (value.length > 2) {
      this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
        this.getFamilyMemberListRes(responseArray);
      }, error => {
        console.log('getFamilyMemberListRes error : ', error);
      });
      /*this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
        debounceTime(1000)).subscribe(
        data => {
          this.onlineTransact.getFamilyMemberList(obj).subscribe(responseArray => {
            this.getFamilyMemberListRes(responseArray);
          }, error => {
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );*/
    }
  }

  getFamilyMemberListRes(data) {
    console.log('getFamilyMemberListRes', data);
    this.nomineesListFM = (data) ? data : null;
    this.valueChange1.emit(this.nomineesListFM);
  }
}
