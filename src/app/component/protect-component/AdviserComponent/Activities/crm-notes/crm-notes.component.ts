import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { Subscription, Observable } from 'rxjs';
import { PeopleService } from '../../../PeopleComponent/people.service';
import { startWith, debounceTime } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ProcessTransactionService } from '../../transactions/overview-transactions/doTransaction/process-transaction.service';

@Component({
  selector: 'app-crm-notes',
  templateUrl: './crm-notes.component.html',
  styleUrls: ['./crm-notes.component.scss']
})
export class CrmNotesComponent implements OnInit {

  isAdvisorSection = true;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  filteredStates: any;
  stateCtrl = new FormControl('', [Validators.required]);
  familyMemberData: any;
  selectedName: any;

  constructor(private peopleService: PeopleService, public processTransaction: ProcessTransactionService, ) { }

  ngOnInit() {
  }
  checkOwnerList(value) {
    if (!this.isAdvisorSection) {
      return;
    }
    if (value.length <= 2) {
      this.filteredStates = undefined
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
              if (value.length >= 0) {
                this.filteredStates = responseArray;
              } else {
                this.filteredStates = undefined
              }
            } else {
              this.filteredStates = undefined
              this.stateCtrl.setErrors({ invalid: true })
            }
          }, error => {
            this.filteredStates = undefined
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }

  ownerDetails(value) {
    this.selectedName = value.name;
    this.familyMemberData = value;
  }
}
