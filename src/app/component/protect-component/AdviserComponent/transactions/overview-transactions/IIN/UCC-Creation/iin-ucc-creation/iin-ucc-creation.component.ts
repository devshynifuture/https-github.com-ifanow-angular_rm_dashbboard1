import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { OnlineTransactionService } from '../../../../online-transaction.service';
import { ProcessTransactionService } from '../../../doTransaction/process-transaction.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { AuthService } from 'src/app/auth-service/authService';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { EnumServiceService } from '../../../../../../../../services/enum-service.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-iin-ucc-creation',
  templateUrl: './iin-ucc-creation.component.html',
  styleUrls: ['./iin-ucc-creation.component.scss']
})
export class IinUccCreationComponent implements OnInit, AfterViewInit {

  stateCtrl = new FormControl('', [Validators.required]);
  filteredStates: any;

  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;
  advisorId: any;
  clientData: any;
  isLoading = false;
  taxStatusList = [];
  greeting;
  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    public processTransaction: ProcessTransactionService,
    private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
    private peopleService: PeopleService,
    private onlineTransact: OnlineTransactionService, public eventService: EventService,
    private enumDataService: EnumDataService, private enumService: EnumServiceService) {
    this.advisorId = AuthService.getAdvisorId();
    const date = new Date();
    const hourOfDay = date.getHours();
    if (hourOfDay < 12) {
      this.greeting = 'Good morning';
    } else if (hourOfDay < 16) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
    console.log('this.taxStatusList :', this.taxStatusList);
  }

  ngOnInit() {
    // this.getIINUCCRegistration();
    const clientAndFamilyList = this.enumDataService.getClientAndFamilyData('');
    if (clientAndFamilyList && clientAndFamilyList.length > 0) {
      this.getDataForm('');
    } else {
      this.getClients();
    }
    this.processTransaction.getCountryCodeList().subscribe((responseData) => {
    }, error => {
      console.error('country code error : ', error);

    });
  }

  ngAfterViewInit(): void {
    // TODO for testing only
    // this.generalDetails.controls.ownerName.setValue('Gaurav');
    // this.generalDetails.controlss.holdingType.setValue('SI');
    // this.generalDetails.controlss.taxMaster.setValue('01');
  }

  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  close() {
    const fragmentData = {
      direction: 'top',
      state: 'close'
    };

    this.eventService.changeUpperSliderState(fragmentData);
    this.closeRightSlider('');
  }

  getDataForm(data) {

    this.generalDetails = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      holdingType: [(!data) ? '' : data.holdingType, [Validators.required]],
      taxMaster: [(!data) ? { taxMasterId: 1, description: 'Individual' } : data.taxMaster, [Validators.required]],
    });
    // this.generalDetails.controls.ownerName.valueChanges
    //   .subscribe(newValue => {
    //     this.filteredStates = new Observable(this.clientData).pipe(startWith(''),
    //       map(value => {
    //         if (newValue) {
    //           return this.enumDataService.getClientAndFamilyData(newValue);
    //         } else {
    //           return this.enumDataService.getClientAndFamilyData('');
    //         }
    //       }));
    //   });
    this.generalDetails.controls.ownerName.setValue('');
    this.generalDetails.controls.holdingType.valueChanges.subscribe((newValue) => {
      // if (newValue != 'SI') {
      //   this.generalDetails.controls.taxMaster.setValue({taxMasterId: 1, description: 'Individual'});
      // } else {
      // }
    });
  }

  searchClientFamilyMember(value) {
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
            }
            else {
              this.filteredStates = undefined
              this.generalDetails.controls.ownerName.setErrors({ invalid: true })
            }
          }, error => {
            this.filteredStates = undefined
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }

  getFormControl(): any {
    return this.generalDetails.controls;
  }

  openPersonalDetails(data) {

    const subscription = this.processTransaction.openPersonal(data).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  getClients() {
    const obj = {
      advisorId: this.advisorId,
    };
    this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
      this.getClientListRes(responseArray);
    }, error => {
      console.log('getFamilyMemberListRes error : ', error);
    });
  }

  getClientListRes(data) {
    this.enumDataService.setClientAndFamilyData(data);
    this.getDataForm('');
  }

  getIINUCCRegistration() {
    const obj = {
      id: 2,
    };

    this.onlineTransact.getIINUCCRegistration(obj).subscribe(
      data => this.getIINUCCRegistrationRes(data), (error) => {
      }
    );
  }

  getIINUCCRegistrationRes(data) {
  }


  ownerList(value) {
    if (value == '') {
      this.showSpinnerOwner = false;
    } else {
      this.showSpinnerOwner = true;
    }
  }

  ownerDetails(value) {
    this.familyMemberData = value;
    this.familyMemberId = value.familyMemberId;
    this.clientData = value;
    let clientType = 1;
    if (value.clientType > 0) {
      clientType = value.clientType;
    } else if (value.familyMemberType > 0) {
      clientType = value.familyMemberType;
    }
    console.log('selected member : ', value);
    if (clientType == 1) {
      this.taxStatusList = this.enumService.getIndividualTaxList();
      this.setDefaultTaxStatus();
    } else if (clientType == 2) {
      this.taxStatusList = this.enumService.getMinorTaxList();
      this.setDefaultTaxStatus();
    } else {
      this.taxStatusList = [];
      this.generalDetails.controls.taxMaster.setValue('');
    }

  }

  displayFn(user) {

    return user && user.name ? user.name : '';
  }

  setDefaultTaxStatus() {
    this.generalDetails.controls.taxMaster.setValue(this.taxStatusList[0]);
  }

  saveGeneralDetails(data) {
    if (this.generalDetails.invalid) {
      this.generalDetails.markAllAsTouched();
      return;
    }
    const obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingType: this.generalDetails.controls.holdingType.value,
      familyMemberId: this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      taxMaster: this.generalDetails.controls.taxMaster.value,
      taxMasterId: this.generalDetails.controls.taxMaster.value.taxMasterId,
      clientData: this.clientData
    };
    this.openPersonalDetails(obj);
  }
}
