import {Component, OnInit} from '@angular/core';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {Subscription, Observable} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, startWith} from 'rxjs/operators';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {AuthService} from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mapped-user',
  templateUrl: './mapped-user.component.html',
  styleUrls: ['./mapped-user.component.scss']
})
export class MappedUserComponent implements OnInit {

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'MAP',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };

  isLoading = false;
  isAdvisorSection = true;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  filteredStates: any;
  stateCtrl = new FormControl('', [Validators.required]);
  familyMemberData: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'aid', 'euin', 'set',];
  fragmentData: any;
  storeData: any;
  iin: any;
  clientId: any;
  familyMemberId: any;
  selectedCred;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private onlineTransaction: OnlineTransactionService,
    private peopleService: PeopleService
  ) {
  }

  get data() {
    return this.fragmentData;
  }

  set data(data) {
    this.fragmentData = {data};
    this.storeData = this.fragmentData.data;
    console.log(this.storeData);
    this.storeData.forEach(element => {
      element.selected = false;
      element.iin = '';
    });
  }

  ngOnInit() {
  }

  changeCred(event, value) {
    console.log(event);
    console.log(value);
    /* this.storeData.forEach(element => {
       if (element.selected == value.selected && event.checked == true) {
         element.selected = event.checked;
       } else {
         element.selected = false;
       }
     });*/
  }

  selectClient(value) {
    console.log(value);
    this.clientId = value.clientId;
    this.familyMemberId = value.familyMemberId;
  }

  checkOwnerList(value) {
    if (!this.isAdvisorSection) {
      return;
    }
    if (value.length <= 2) {
      this.filteredStates = undefined;
      return;
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(1000)).subscribe(
      data => {
        this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
          if (responseArray) {
            this.clientId = responseArray[0].clientId;
            if (value.length >= 0) {
              this.filteredStates = responseArray;
            } else {
              this.filteredStates = undefined;
            }
          } else {
            this.filteredStates = undefined;
            this.stateCtrl.setErrors({invalid: true});
          }
        }, error => {
          this.filteredStates = undefined;
          console.log('getFamilyMemberListRes error : ', error);
        });
      }
    );
  }

  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
  }

  mappedUser() {
    if (!this.selectedCred) {
      this.eventService.openSnackBar('Please select credential', 'Dismiss');
      return;
    }
    if (this.stateCtrl.invalid) {
      this.stateCtrl.setErrors({invalid: true});
      this.stateCtrl.markAllAsTouched();
      return;
    } else {
      // const obj1 = this.storeData.filter((x) => x.selected == true);
      const obj = {
        tpUserCredentialId: this.selectedCred.tpUserCredentialId,
        clientCode: this.selectedCred.iin,
        familyMemberId: (this.familyMemberId) ? this.familyMemberId : 0,
        clientId: this.clientId

      };
      console.log(obj);
      this.onlineTransaction.mappedExistingUser(obj)
        .subscribe(res => {
          if (res) {
            console.log('mappedUser', res);
            this.eventService.openSnackBar('Mapped existing user successfully', 'Dismiss');
          } else {
            this.eventService.openSnackBar('Mapping failed', 'Dismiss');
          }
        }, err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        });
    }

  }
}
