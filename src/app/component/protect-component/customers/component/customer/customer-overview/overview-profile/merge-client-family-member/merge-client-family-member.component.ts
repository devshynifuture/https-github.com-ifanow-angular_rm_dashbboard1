import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from '../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { EventService } from '../../../../../../../../Data-service/event.service';
import { PeopleService } from '../../../../../../PeopleComponent/people.service';
import { MatTableDataSource, MatAutocompleteTrigger } from '@angular/material';
import { MatProgressButtonOptions } from '../../../../../../../../common/progress-button/progress-button.component';
import { map, startWith } from 'rxjs/operators';
import { EnumDataService } from '../../../../../../../../services/enum-data.service';
import { ProcessTransactionService } from '../../../../../../AdviserComponent/transactions/overview-transactions/doTransaction/process-transaction.service';
import { UtilService } from '../../../../../../../../services/util.service';
import { CancelFlagService } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-service/cancel-flag.service';
import { ClientSggestionListService } from '../client-sggestion-list.service';
import { element } from 'protractor';

@Component({
  selector: 'app-merge-client-family-member',
  templateUrl: './merge-client-family-member.component.html',
  styleUrls: ['./merge-client-family-member.component.scss']
})
export class MergeClientFamilyMemberComponent implements OnInit {
  displayedColumns: string[] = ['name', 'pan', 'gender', 'relation'];

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
  showSpinnerOwner = false;
  dataForTable: any[] = [];
  dataSource = new MatTableDataSource(this.dataForTable);
  stateCtrl = new FormControl('', [Validators.required]);
  filteredStates: any;
  selectedClient;
  @Input() data;
  relationTypeList: { name: string; value: number; }[];
  displayedColumns1: string[] = ['details', 'status', 'pan', 'relation', 'gender', 'add'];
  dataSource1;
  showSuggestion = true;
  selectedClientData: any;
  rows: FormArray = this.fb.array([]);
  form: FormGroup = this.fb.group({ clients: this.rows });
  selectedClientFormGroup: FormGroup;
  requiredRefresh = false;
  clientListEmail;
  clientListMobile;
  finalSuggestionList;
  clientList: any;
  @ViewChild('searchClient', { read: MatAutocompleteTrigger, static: true }) autoComplete: MatAutocompleteTrigger;
  addClientList = [];


  constructor(private datePipe: DatePipe, private subInjectService: SubscriptionInject,
    private fb: FormBuilder, private eventService: EventService,
    private peopleService: PeopleService, private enumDataService: EnumDataService,
    public processTransaction: ProcessTransactionService, private cancelFlagService: CancelFlagService,
    private clientSuggeService: ClientSggestionListService) {
  }

  ngOnInit() {
    this.clientList = Object.assign([], this.data.clientData.ClientList);
    // if (this.data.clientData.SuggestionList) {
    //   this.data.clientData.SuggestionList.filter(element => {
    //     this.rows.push(this.fb.group({
    //       relation: ['', [Validators.required]],
    //       gender: ['', [Validators.required]]
    //     }))
    //   })
    // }
    if (this.data.clientData.client.clientType == 2 || this.data.clientData.client.martialStatusId == 2) {
      this.relationTypeList = [
        { name: 'Father', value: 6 },
        { name: 'Mother', value: 7 },
        // { name: 'Other', value: 10 }
      ];
    } else {
      if (this.data.clientData.client.duplicateFlag) {
        this.relationTypeList = [
          // { name: 'Mother', value:  },
          { name: 'Father', value: 6 },
          { name: 'Mother', value: 7 },
          // { name: 'Other', value: 10 },
          { name: 'Son', value: 4 },
          { name: 'Daughter', value: 5 },
          { name: 'Brother', value: 8 },
          { name: 'Sister', value: 9 },
          { name: 'Daughter_In_Law', value: 11 },
          { name: 'Sister_In_Law', value: 12 },
          { name: 'Niece', value: 15 },
          { name: 'Nephew', value: 16 },
          { name: 'Others', value: 10 },
          { name: 'Grandmother', value: 13 },
          { name: 'Grandfather', value: 14 },
        ];
      } else {
        // const obj = (this.data.clientData.client.genderId == 2) ?  : ;
        this.relationTypeList = [
          { name: 'Husband', value: 2 },
          { name: 'Wife', value: 3 },
          // { name: 'Mother', value:  },
          { name: 'Father', value: 6 },
          { name: 'Mother', value: 7 },
          // { name: 'Other', value: 10 },
          { name: 'Son', value: 4 },
          { name: 'Daughter', value: 5 },
          { name: 'Brother', value: 8 },
          { name: 'Sister', value: 9 },
          { name: 'Daughter_In_Law', value: 11 },
          { name: 'Sister_In_Law', value: 12 },
          { name: 'Niece', value: 15 },
          { name: 'Nephew', value: 16 },
          { name: 'Others', value: 10 },
          { name: 'Grandmother', value: 13 },
          { name: 'Grandfather', value: 14 },
        ];
      }
    }
    this.clientListEmail = this.clientSuggeService.getSuggestionListUsingEmail();
    if (this.clientListEmail) {
      this.clientListEmail = this.clientListEmail.filter(element => element.userId != this.data.clientData.client.userId);
      // (this.clientListEmail.length == 0) ? this.clientListEmail = undefined : '';
    }
    this.clientListMobile = this.clientSuggeService.getSuggestionListUsingMobile();
    if (this.clientListMobile) {
      this.clientListMobile = this.clientListMobile.filter(element => element.userId != this.data.clientData.client.userId);
      // (this.clientListMobile.length == 0) ? this.clientListMobile = undefined : '';
    }

    if ((this.clientListEmail && this.clientListEmail.length > 0) && (this.clientListMobile == undefined || this.clientListMobile.length == 0)) {
      this.finalSuggestionList = this.clientListEmail;
    }
    if ((this.clientListMobile && this.clientListMobile.length > 0) && (this.clientListEmail == undefined || this.clientListEmail.length == 0)) {
      this.finalSuggestionList = this.clientListMobile;
    }
    if ((this.clientListEmail && this.clientListEmail.length > 0) && (this.clientListMobile && this.clientListMobile.length > 0)) {
      this.finalSuggestionList = this.clientListEmail.concat(this.clientListMobile);
      this.finalSuggestionList = this.getUniqueListBy(this.finalSuggestionList, 'userId');
    }
    if (this.finalSuggestionList) {
      this.finalSuggestionList.map(element => {
        element.addedFlag = false;
        element.isLoading = false;
        this.rows.push(this.fb.group({
          relation: ['', [Validators.required]],
          gender: ['', [Validators.required]]
        }));
      });
    }

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
            return this.data.clientData.ClientList;
          }
        }),
      );
  }

  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  }

  hideSuggetion(value) {
    if (value == '') {
      this.showSuggestion = true;
      this.selectedClientData = undefined;
    }

  }

  optionSelected(value) {
    this.stateCtrl.setValue(value.name);
    if (this.addClientList.length > 0 && this.addClientList.some(element => element == value.displayName)) {
      this.eventService.openSnackBar('Client is already converted into family member', 'Dismiss');
      return;
    }
    // this.showSuggestion = false;
    this.requiredRefresh = false;
    this.selectedClientFormGroup = this.fb.group({
      relation: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
    console.log(' selected client to merge ', value);
    this.selectedClient = value;
    this.getClientData(value);
  }

  getClientData(data) {
    this.showSpinnerOwner = true;
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      responseData => {
        this.showSpinnerOwner = false;
        this.showSuggestion = false;
        if (responseData == undefined) {
          return;
        } else {
          // Object.assign(data, responseData);
          data.genderString = UtilService.getGenderStringFromGenderId(data.genderId);
          responseData.dateOfBirth = (responseData.dateOfBirth) ? this.datePipe.transform(responseData.dateOfBirth, 'dd/MM/yyyy') : '-';
          this.selectedClientData = responseData;
          console.log('mergeclientFamilyMember this.dataSource.data ', this.dataSource.data);

        }
      },
      err => {
        this.showSpinnerOwner = false;
        console.error(err);
      }
    );
  }

  close(data) {
    if (this.requiredRefresh) {
      this.enumDataService.searchClientList();
    }
    this.subInjectService.changeNewRightSliderState((data == 'close' && this.requiredRefresh == false) ? { state: 'close' } : {
      state: 'close',
      refreshRequired: true
    });
  }

  saveFamilyMembers() {
    if (!this.selectedClient) {
      this.eventService.openSnackBar('Please select the client to merge', 'Dismiss');
      return;
    }
    if (this.selectedClient.clientType == 3 || this.selectedClient.clientType == 4) {
      this.selectedClientFormGroup.get('gender').setValidators(null);
    }
    if (this.selectedClientFormGroup.invalid) {
      this.selectedClientFormGroup.markAllAsTouched();
      return;
    }
    this.barButtonOptions.active = true;
    const arrayObj = {
      ownerClientId: this.data.clientData.client.clientId,
      mergeClientId: this.selectedClient.clientId,
      relationshipId: this.selectedClientFormGroup.controls.relation.value,
      genderId: this.selectedClientFormGroup.controls.gender.value
    };
    this.peopleService.mergeClient(arrayObj).subscribe(
      data => {
        console.log(data),
          this.requiredRefresh = true;
        this.enumDataService.searchClientList();
        this.close(data);
        this.barButtonOptions.active = false;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.barButtonOptions.active = false;
      }
    );
  }

  saveSuggestedFamilyMember(index, clientData) {
    if (clientData.isLoading) {
      return;
    }
    if (clientData.clientType == 3 || clientData.clientType == 4) {
      this.rows.controls[index].get('gender').setValidators(null);
    }
    if (this.rows.controls[index].invalid) {
      this.rows.controls[index].markAllAsTouched();
      return;
    }
    clientData.isLoading = true;
    const arrayObj = {
      ownerClientId: this.data.clientData.client.clientId,
      mergeClientId: clientData.clientId,
      relationshipId: this.rows.controls[index].value.relation,
      genderId: this.rows.controls[index].value.gender
    };
    this.peopleService.mergeClient(arrayObj).subscribe(
      data => {
        console.log(data);
        this.addClientList.push(clientData.displayName);
        // this.clientList = this.clientList.filter(element => element.userId != clientData.userId)
        clientData.isLoading = false;
        clientData.addedFlag = true;
        this.requiredRefresh = true;
        this.cancelFlagService.setCancelFlag(true);
        this.enumDataService.searchClientList();
        this.stateCtrl.reset();
      },
      err => {
        clientData.addedFlag = false;
        clientData.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
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
    if (flag == 'suggestionList') {
      this.rows.controls[index].get('gender').setValue(String(genderId));
    } else {
      this.selectedClientFormGroup.controls.gender.setValue(String(genderId));
    }
  }
}
