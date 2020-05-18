import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {SubscriptionInject} from '../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {EventService} from '../../../../../../../../Data-service/event.service';
import {PeopleService} from '../../../../../../PeopleComponent/people.service';
import {MatTableDataSource} from '@angular/material';
import {MatProgressButtonOptions} from '../../../../../../../../common/progress-button/progress-button.component';
import {map, startWith} from 'rxjs/operators';
import {EnumDataService} from '../../../../../../../../services/enum-data.service';
import {ProcessTransactionService} from '../../../../../../AdviserComponent/transactions/overview-transactions/doTransaction/process-transaction.service';
import {UtilService} from '../../../../../../../../services/util.service';

@Component({
  selector: 'app-merge-client-family-member',
  templateUrl: './merge-client-family-member.component.html',
  styleUrls: ['./merge-client-family-member.component.scss']
})
export class MergeClientFamilyMemberComponent implements OnInit {
  displayedColumns: string[] = ['name', 'pan', 'gender'];

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
  dataForTable: any[] = [];
  dataSource = new MatTableDataSource(this.dataForTable);
  stateCtrl = new FormControl('', [Validators.required]);
  filteredStates: any;
  selectedClient;
  @Input() data;

  constructor(private datePipe: DatePipe, private subInjectService: SubscriptionInject,
              private fb: FormBuilder, private eventService: EventService,
              private peopleService: PeopleService, private enumDataService: EnumDataService,
              public processTransaction: ProcessTransactionService) {
  }

  ngOnInit() {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => {
          if (state) {
            const list = this.enumDataService.getSearchData(state);
            if (list.length == 0) {
              this.stateCtrl.setErrors({invalid: true});
            }
            return this.enumDataService.getSearchData(state);
          } else {
            return this.enumDataService.getEmptySearchStateData();
          }
        }),
      );
  }

  ownerDetails(value) {
    console.log(' selected client to merge ', value);
    this.selectedClient = value;
    this.getClientData(value);
  }

  getClientData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      responseData => {
        if (responseData == undefined) {
          return;
        } else {
          Object.assign(data, responseData);
          data.genderString = UtilService.getGenderStringFromGenderId(data.genderId);
          this.dataSource.data = [{data}];
          console.log('mergeclientFamilyMember this.dataSource.data ', this.dataSource.data);

        }
      },
      err => {
        console.error(err);
      }
    );
  }

  close(data) {
    this.subInjectService.changeNewRightSliderState((data == 'close') ? {state: 'close'} : {state: 'close', refreshRequired: true});
  }

  saveFamilyMembers() {
    if (!this.selectedClient) {
      this.eventService.openSnackBar('Please select the client to merge', 'dismiss');
    }
    const arrayObj = {
      ownerClientId: this.data.clientId,
      mergeClientId: this.selectedClient.clientId
    };
    this.peopleService.mergeClient(arrayObj).subscribe(
      data => {
        console.log(data),
          this.close(data);
        this.barButtonOptions.active = false;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.barButtonOptions.active = false;
      }
    );
  }

}
