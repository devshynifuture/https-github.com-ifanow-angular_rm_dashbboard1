import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from 'src/app/component/protect-component/customers/component/customer/customer.service';
import {DatePipe} from '@angular/common';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {OnlineTransactionService} from '../../../../online-transaction.service';
import {ProcessTransactionService} from '../../../doTransaction/process-transaction.service';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {AuthService} from 'src/app/auth-service/authService';
import {map, startWith} from 'rxjs/operators';
import {EnumDataService} from 'src/app/services/enum-data.service';
import {EnumServiceService} from '../../../../../../../../services/enum-service.service';

@Component({
  selector: 'app-iin-ucc-creation',
  templateUrl: './iin-ucc-creation.component.html',
  styleUrls: ['./iin-ucc-creation.component.scss']
})
export class IinUccCreationComponent implements OnInit {
  nomineesListFM: any = [];
  showSpinnerOwner = false;
  familyMemberData: any;
  familyMemberId: any;
  generalDetails: any;
  advisorId: any;
  clientData: any;
  isLoading: boolean = false;
  taxStatusList = [{taxStatusDesc: 'Individual', taxStatusCode: '01'},
    {taxStatusDesc: 'On behalf of minor', taxStatusCode: '02'},
    {taxStatusDesc: 'NRI - Repatriable (NRE)', taxStatusCode: '21'}];

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private processTrasaction: ProcessTransactionService,
              private custumService: CustomerService, private datePipe: DatePipe, public utils: UtilService,
              private peopleService: PeopleService,
              private onlineTransact: OnlineTransactionService, public eventService: EventService,
              private enumDataService: EnumDataService, private enumService: EnumServiceService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.getIINUCCRegistration();
    this.getDataForm('');
    this.getClients();
    this.nomineesListFM = this.generalDetails.controls.ownerName.valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            let list = this.enumDataService.getSearchData(state);
            if (list.length == 0) {
              this.generalDetails.controls.ownerName.setErrors({invalid: true});
            }
            return this.enumDataService.getSearchData(state);
          } else {
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      );
  }

  closeRightSlider(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
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
      holdingNature: [(!data) ? '' : data.ownerName, [Validators.required]],
      taxStatus: [(!data) ? '' : data.ownerName, [Validators.required]],
    });
    this.generalDetails.controls.holdingNature.valueChanges.subscribe((newValue) => {
      if (newValue != 'SI') {
        this.taxStatusList = [{taxStatusDesc: 'Individual', taxStatusCode: '01'}];
        this.generalDetails.controls.taxStatus.setValue('01');
      } else {
        this.taxStatusList = [{taxStatusDesc: 'Individual', taxStatusCode: '01'},
          {taxStatusDesc: 'On behalf of minor', taxStatusCode: '02'}, {taxStatusDesc: 'NRI - Repatriable (NRE)', taxStatusCode: '21'}];
      }
    });
  }

  getFormControl(): any {
    return this.generalDetails.controls;
  }

  openPersonalDetails(data) {

    const subscription = this.processTrasaction.openPersonal(data).subscribe(
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
    this.peopleService.getClientList(obj).subscribe(
      data => this.getClientListRes(data)
    );
  }

  getClientListRes(data) {
    console.log('client data', data);
    this.clientData = data[0];
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
    console.log('INN UCC CREATION DATA GET', data);
  }

  // getClientAndFamilyMember(data) {
  //   this.isLoading = true
  //   if (data == '') {
  //     this.generalDetails.controls.ownerName.setErrors({ invalid: false });
  //     this.generalDetails.controls.ownerName.setValidators([Validators.required]);
  //     this.generalDetails.controls.ownerName.updateValueAndValidity();
  //     this.nomineesListFM = undefined;
  //     return;
  //   }
  //   const obj = {
  //     advisorId: this.advisorId,
  //     displayName: data
  //   };

  //   this.onlineTransact.getClientAndFmList(obj).subscribe(
  //     data => this.getClientAndFmListRes(data), (error) => {

  //     }
  //   );
  // }
  // getClientAndFmListRes(data) {
  //   if (data == 0) {
  //     this.isLoading = false
  //     this.generalDetails.controls.ownerName.setErrors({ invalid: true });
  //     this.generalDetails.controls.ownerName.markAsTouched();
  //     data = undefined;
  //   }
  //   this.isLoading = false

  //   this.nomineesListFM = data
  //   console.log('getClientAndFmListRes data', this.nomineesListFM)
  // }
  lisNominee(value) {
    // this.showSpinnerOwner = false
    if (value == null) {
      // this.transactionAddForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      // this.transactionAddForm.get('ownerName').markAsTouched();
    }
    console.log(value);
    this.nomineesListFM = Object.assign([], value);
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
    console.log(this.enumService.getTaxStatus());
    /* if (value.guardianId && value.guardianId > 0) {
       this.taxStatusList = this.enumService.getMinorTaxList();
     } else if (value.userType == 2 && value.clientType == 3) {
       // TODO we are not doing corporate registration for now
       // this.taxStatusList = this.enumService.getCorporateTaxList();
       this.taxStatusList = this.enumService.getIndividualTaxList();
     } else {
       this.taxStatusList = this.enumService.getIndividualTaxList();
     }*/
  }

  displayFn(user) {

    return user && user.name ? user.name : '';
  }

  saveGeneralDetails(data) {
    if (this.generalDetails.invalid) {
      this.generalDetails.markAllAsTouched();
      return;
    }
    const obj = {
      ownerName: this.generalDetails.controls.ownerName.value,
      holdingNature: this.generalDetails.controls.holdingNature.value,
      familyMemberId: this.familyMemberId,
      clientId: this.familyMemberData.clientId,
      advisorId: this.advisorId,
      taxStatus: this.generalDetails.controls.taxStatus.value,
      clientData: this.clientData
    };
    this.openPersonalDetails(obj);
  }
}
