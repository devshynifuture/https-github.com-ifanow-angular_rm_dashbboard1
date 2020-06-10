import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from '../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { EventService } from '../../../../../../../../Data-service/event.service';
import { PeopleService } from '../../../../../../PeopleComponent/people.service';
import { MatTableDataSource } from '@angular/material';
import { MatProgressButtonOptions } from '../../../../../../../../common/progress-button/progress-button.component';
import { map, startWith } from 'rxjs/operators';
import { EnumDataService } from '../../../../../../../../services/enum-data.service';
import { ProcessTransactionService } from '../../../../../../AdviserComponent/transactions/overview-transactions/doTransaction/process-transaction.service';
import { UtilService } from '../../../../../../../../services/util.service';
import { CancelFlagService } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-service/cancel-flag.service';

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
  showSuggestion: boolean = true;
  selectedClientData: any;
  rows: FormArray = this.fb.array([]);
  form: FormGroup = this.fb.group({ 'clients': this.rows });
  selectedClientFormGroup: FormGroup
  requiredRefresh: boolean = false;

  constructor(private datePipe: DatePipe, private subInjectService: SubscriptionInject,
    private fb: FormBuilder, private eventService: EventService,
    private peopleService: PeopleService, private enumDataService: EnumDataService,
    public processTransaction: ProcessTransactionService, private cancelFlagService: CancelFlagService) {
  }

  ngOnInit() {
    let clientList = Object.assign([], this.data.clientData.ClientList);
    if (this.data.clientData.SuggestionList) {
      this.data.clientData.SuggestionList.filter(element => {
        this.rows.push(this.fb.group({
          relation: ['', [Validators.required]],
          gender: ['', [Validators.required]]
        }))
      })
    }
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            const filterValue = state.toLowerCase();
            const list = clientList.filter(state => state.name.toLowerCase().includes(filterValue));
            if (list.length == 0) {
              this.showSuggestion = true;
              this.stateCtrl.setErrors({ invalid: true });
              this.stateCtrl.markAsTouched();
            }
            return clientList.filter(state => state.name.toLowerCase().includes(filterValue));
          } else {
            return this.data.clientData.ClientList;
          }
        }),
      );

    if (this.data.clientData.client.clientType == 2) {
      this.relationTypeList = [
        { name: 'Father', value: 6 },
        { name: 'Mother', value: 7 },
        { name: 'Other', value: 10 }
      ]
    }
    else {
      if (this.data.clientData.client.duplicateFlag) {
        this.relationTypeList = [
          // { name: 'Mother', value:  },
          { name: 'Father', value: 6 },
          { name: 'Mother', value: 7 },
          { name: 'Other', value: 10 },
          { name: 'Son', value: 4 },
          { name: 'Daughter', value: 5 }
        ]
      }
      else {
        let obj = (this.data.clientData.client.genderId == 2) ? { name: 'Husband', value: 2 } : { name: 'Wife', value: 3 };
        this.relationTypeList = [
          obj,
          // { name: 'Mother', value:  },
          { name: 'Father', value: 6 },
          { name: 'Mother', value: 7 },
          { name: 'Other', value: 10 },
          { name: 'Son', value: 4 },
          { name: 'Daughter', value: 5 }
        ]
      }
    }
  }
  hideSuggetion(value) {
    if (value == '') {
      this.showSuggestion = true
      this.selectedClientData = undefined
    };
  }
  optionSelected(value) {
    if (value.count == 0) {
      this.eventService.openSnackBar("Cannot convert family member count 0 to family member", "Dismiss")
      return;
    }
    // this.showSuggestion = false;
    this.requiredRefresh = false;
    this.selectedClientFormGroup = this.fb.group({
      relation: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    })
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
        this.showSuggestion = false
        if (responseData == undefined) {
          return;
        } else {
          // Object.assign(data, responseData);
          data.genderString = UtilService.getGenderStringFromGenderId(data.genderId);
          responseData.dateOfBirth = (responseData.dateOfBirth) ? this.datePipe.transform(responseData.dateOfBirth, 'dd/MM/yyyy') : '-'
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
    this.subInjectService.changeNewRightSliderState((data == 'close' && this.requiredRefresh == false) ? { state: 'close' } : { state: 'close', refreshRequired: true });
  }

  saveFamilyMembers() {
    if (!this.selectedClient) {
      this.eventService.openSnackBar('Please select the client to merge', 'Dismiss');
      return;
    }
    if (this.selectedClientFormGroup.invalid) {
      this.selectedClientFormGroup.markAllAsTouched();
      return;
    }
    this.barButtonOptions.active = true
    const arrayObj = {
      ownerClientId: this.data.clientData.client.clientId,
      mergeClientId: this.selectedClient.clientId,
      relationshipId: this.selectedClientFormGroup.controls.relation.value,
      genderId: this.selectedClientFormGroup.controls.gender.value
    };
    this.peopleService.mergeClient(arrayObj).subscribe(
      data => {
        console.log(data),
          this.requiredRefresh = true
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
        clientData.isLoading = false;
        clientData.addedFlag = true;
        this.requiredRefresh = true;
        this.cancelFlagService.setCancelFlag(true)
      },
      err => {
        clientData.addedFlag = false;
        clientData.isLoading = true;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    )
  }

  changeGender(relationData, flag, index) {
    let genderId;
    switch (true) {
      case (relationData.value == 2 || relationData.value == 4 || relationData.value == 6):
        genderId = 1;
        break;
      case (relationData.value == 3 || relationData.value == 5 || relationData.value == 7):
        genderId = 2;
        break;
      default:
        genderId = 1;
        break;
    }
    if (flag == "suggestionList") {
      this.rows.controls[index].get('gender').setValue(String(genderId));
    }
    else {
      this.selectedClientFormGroup.controls.gender.setValue(String(genderId));
    }
  }
}
