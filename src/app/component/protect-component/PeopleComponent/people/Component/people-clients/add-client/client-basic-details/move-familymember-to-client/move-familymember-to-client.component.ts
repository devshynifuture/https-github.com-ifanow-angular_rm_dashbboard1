import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EventService } from 'src/app/Data-service/event.service';
import { element } from 'protractor';
import { AuthService } from 'src/app/auth-service/authService';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-move-familymember-to-client',
  templateUrl: './move-familymember-to-client.component.html',
  styleUrls: ['./move-familymember-to-client.component.scss']
})
export class MoveFamilymemberToClientComponent implements OnInit {
  showSpinnerOwner: boolean;
  showSuggestion: boolean;
  selectedClientData: any;
  filteredStates: any;
  selectedClient: any;
  selectedClientFormGroup: FormGroup;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  delayTime = 0.1;
  @Input() data;
  clientList: any;
  value: any;
  flag: any;
  fieldFlag: any;
  constructor(private peopleService: PeopleService,
    private datePipe: DatePipe,
    private enumDataService: EnumDataService,
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder,
    private eventService: EventService) { }
  stateCtrl = new FormControl('', [Validators.required]);
  ngOnInit() {
    this.value = this.data.value;
    this.flag = this.data.flag;
    this.fieldFlag = this.data.fieldFlag;
    this.barButtonOptions.text = this.flag;
    if (this.flag == 'Move') {
      this.clientList = this.enumDataService.getEmptySearchStateData().filter(element => element.clientId != this.data.clientId);
      this.filteredStates = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(state => {
            if (state) {
              const filterValue = state.toLowerCase();
              const list = this.clientList.filter(state => state.name.toLowerCase().includes(filterValue));
              if (list.length == 0) {
                this.showSuggestion = true;
                this.stateCtrl.setErrors({ invalid: true });
                this.stateCtrl.markAsTouched();
              }
              return this.clientList.filter(state => state.name.toLowerCase().includes(filterValue));
            } else {
              return this.clientList;
            }
          }),
        );
    }
  }

  optionSelected(value) {
    this.stateCtrl.setValue(value.name)
    this.selectedClient = value;
    this.selectedClientFormGroup = this.fb.group({
      relation: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    })
    this.getClientData(value)
  }

  mergeOptionSelected(value) {
    this.stateCtrl.setValue(value.name)
    this.selectedClient = value;
    this.selectedClientFormGroup = this.fb.group({
      relation: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    })
    if (value.familyMemberId == 0) {
      this.getClientData(value);
    } else {
      value.genderString = UtilService.getGenderStringFromGenderId(value.genderId);
      value.dateOfBirth = (value.dateOfBirth) ? this.datePipe.transform(value.dateOfBirth, 'dd/MM/yyyy') : '-'
      this.selectedClientData = value;
      this.showSuggestion = false
    }
  }


  getClientData(data) {
    this.showSpinnerOwner = true;
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      responseData => {
        this.showSpinnerOwner = false;
        this.showSuggestion = false
        if (responseData == undefined) {
          return;
        } else {
          data.genderString = UtilService.getGenderStringFromGenderId(data.genderId);
          responseData.dateOfBirth = (responseData.dateOfBirth) ? this.datePipe.transform(responseData.dateOfBirth, 'dd/MM/yyyy') : '-'
          this.selectedClientData = responseData;
        }
      },
      err => {
        this.showSpinnerOwner = false;
        console.error(err);
      }
    );
  }

  close(data) {
    this.subInjectService.changeNewRightSliderState((data == 'close') ? { state: 'close' } : { state: 'close', refreshRequired: true });
  }

  moveFamilyMember() {
    if (this.stateCtrl.invalid) {
      this.stateCtrl.markAllAsTouched();
      return
    }
    // if (this.selectedClientFormGroup.invalid) {
    //   this.selectedClientFormGroup.markAllAsTouched();
    //   return;
    // }
    const obj = {
      familyMemberId: this.value.familyMemberId,
      newClientId: this.selectedClient.clientId
    }
    this.barButtonOptions.active = true;
    this.peopleService.moveFamilyMemberFromOnceToOther(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar("Family member moved sucessfully", "Dimiss")
        this.close({})
      }, err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, "Dimiss")
      }
    )
  }

  familyOutputSubscription: Subscription;
  familyOutputObservable: Observable<any> = new Observable<any>();
  searchClientFamilyMember(value) {
    if (value.length <= 2) {
      // this.showDefaultDropDownOnSearch = false;
      // this.isLoding = false;
      this.clientList = undefined;
      return;
    }
    if (!this.clientList) {
      // this.showDefaultDropDownOnSearch = true;
      // this.isLoding = true;
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      displayName: value
    };
    if (this.familyOutputSubscription && !this.familyOutputSubscription.closed) {
      this.familyOutputSubscription.unsubscribe();
    }
    this.familyOutputSubscription = this.familyOutputObservable.pipe(startWith(''),
      debounceTime(700)).subscribe(
        data => {
          this.showSpinnerOwner = true;
          this.peopleService.getClientFamilyMemberList(obj).subscribe(responseArray => {
            if (responseArray) {
              this.showSpinnerOwner = false;
              if (value.length >= 0) {
                this.clientList = responseArray;
                // this.showDefaultDropDownOnSearch = false;
                // this.isLoding = false;
              } else {
                // this.showDefaultDropDownOnSearch = undefined;
                // this.isLoding = undefined;
                this.stateCtrl.setErrors({ invalid: true })
                this.clientList = undefined;
              }
            } else {
              this.showSpinnerOwner = false;
              // this.showDefaultDropDownOnSearch = true;
              // this.isLoding = false;
              this.clientList = undefined;
            }
          }, error => {
            this.showSpinnerOwner = false;
            this.clientList = undefined;
            console.log('getFamilyMemberListRes error : ', error);
          });
        }
      );
  }


  mergeDuplicateFamilyMember() {
    if (this.stateCtrl.invalid) {
      this.stateCtrl.markAllAsTouched();
      return
    }
    let obj;
    if (this.fieldFlag == 'familyMember') {
      if (this.selectedClientData.familyMemberId == 0) {
        obj = {
          familyMemberId: this.value.familyMemberId,
          duplicateClientId: this.selectedClient.clientId
        }
      } else {
        obj = {
          familyMemberId: this.value.familyMemberId,
          duplicateFamilyMemberId: this.selectedClient.familyMemberId
        }
      }
    } else {
      if (this.selectedClientData.familyMemberId == 0) {
        obj = {
          clientId: this.value.clientId,
          duplicateClientId: this.selectedClient.clientId
        }
      } else {
        obj = {
          clientId: this.value.clientId,
          duplicateFamilyMemberId: this.selectedClient.familyMemberId
        }
      }
    }
    this.barButtonOptions.active = true;
    this.peopleService.mergeDuplicateFamilyMember(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar("Family member merged sucessfully", "Dimiss")
        this.close({})
      }, err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, "Dimiss")
      }
    )
  }


  hideSuggetion(value) {
    if (value == '') {
      this.showSuggestion = true
      this.selectedClientData = undefined
    };
  }

  changeGender(relationData, flag, index) {
    let genderId;
    switch (true) {
      case (relationData.value == 2 || relationData.value == 4 || relationData.value == 6):
        // case 4:
        // case 6:
        genderId = 1;
        break;
      case (relationData.value == 3 || relationData.value == 5 || relationData.value == 7):
        // case 3:
        // case 5:
        // case 7:
        genderId = 2;
        break;
      default:
        genderId = 1;
    }
    this.selectedClientFormGroup.controls.gender.setValue(String(genderId));
  }
}
