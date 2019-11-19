import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { removeEvent } from 'highcharts';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-nps-summary-portfolio',
  templateUrl: './nps-summary-portfolio.component.html',
  styleUrls: ['./nps-summary-portfolio.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class NpsSummaryPortfolioComponent implements OnInit {
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  summaryNPS: any;
  ownerData: any;
  isValueAsOn = false;
  isTotalContry = false;
  isCurrentValue = false;
  isFrequency = false;
  isApproxContry = false;
  isAccountPref = false
  nomineeList: any;
  advisorId: any;
  nomineesListFM: any;
  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) {
    this.summaryNPS = this.fb.group({
      published: true,
      futureContry: this.fb.array([]),
    });
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.nomineesListFM = value.familyList
    this.familyMemberId = value.id
  }
  
  nomineesList(){
      let name = this.ownerName
      var evens = _.remove( this.nomineesListFM, function(n) {
       return n.userName == name;
     });
   console.log('NomineesList',this.nomineeList)
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.summaryNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      currentValue: [(data == undefined) ? '' : data.currentValuation, [Validators.required]],
      valueAsOn: [(data == undefined) ? '' : new Date(data.valueAsOn), [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice)+"", [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      totalContry: [(data == undefined) ? '' : data.contributionAmount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: null,
        accountPreferenceId: null, approxContribution: null
      })]),
      npsNomineesList: this.fb.array([this.fb.group({
        nomineeName: null,nomineePercentageShare:null,
      })]),
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.summaryNPS.controls;
    if (data != undefined) {
      data.futureContributionList.forEach(element => {
        this.summaryNPS.controls.futureContributionList.push(this.fb.group({
          frequencyId: [(element.frequencyId) + "", [Validators.required]],
          accountPreferenceId: [(element.accountPreferenceId + ""), Validators.required],
          approxContribution: [(element.approxContribution), Validators.required]
        }))
      })
      data.npsNomineesList.forEach(element => {
        this.summaryNPS.controls.npsNomineesList.push(this.fb.group({
          nomineeName: [(element.nomineeName), [Validators.required]],
          nomineePercentageShare: [element.nomineePercentageShare , Validators.required],
        }))
      })
    }
    this.familyMemberId = this.summaryNPS.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]

  }
  getFormControl(): any {
    return this.summaryNPS.controls;
  }
  get futureContry() {
    return this.summaryNPS.get('futureContributionList') as FormArray;
  }
  addFutureContry() {
    this.futureContry.push(this.fb.group({
      frequencyId: null,
      accountPreferenceId: null, approxContribution: null
    }));

  }
  removeFutureContry(item) {
    if (this.futureContry.value.length > 1) {
      this.futureContry.removeAt(item);
    }
  }
  get nominee() {
    return this.summaryNPS.get('npsNomineesList') as FormArray;
  }
  addNominee() {
    this.nominee.push(this.fb.group({
      nomineeName: null,nomineePercentageShare:null,
    }));
  }
  removeNominee(item) {
    if (this.nominee.value.length > 1) {
      this.nominee.removeAt(item);
    }
  }
  summaryNPSSave() {
    if (this.summaryNPS.controls.valueAsOn.invalid) {
      this.isValueAsOn = true;
      return;
    } else if (this.summaryNPS.controls.totalContry.invalid) {
      this.isTotalContry = true;
      return;
    } else if (this.summaryNPS.controls.currentValue.invalid) {
      this.isCurrentValue = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: 2978,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.summaryNPS.controls.ownerName.value : this.ownerName,
        valueAsOn: this.datePipe.transform(this.summaryNPS.controls.valueAsOn.value, 'yyyy-MM-dd'),
        currentValuation: this.summaryNPS.controls.currentValue.value,
        contributionAmount: this.summaryNPS.controls.totalContry.value,
        pran: this.summaryNPS.controls.pran.value,
        schemeChoice: this.summaryNPS.controls.schemeChoice.value,
        futureContributionList: this.summaryNPS.controls.futureContributionList.value,
        npsNomineesList: this.summaryNPS.controls.npsNomineesList.value,
        description: this.summaryNPS.controls.description.value,
        id: this.summaryNPS.controls.id.value
      }
      if (this.summaryNPS.controls.id.value == undefined) {
        this.custumService.addNPS(obj).subscribe(
          data => this.addNPSRes(data)
        );
      } else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data => this.editNPSRes(data)
        );
      }
    }
  }
  addNPSRes(data) {
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
  editNPSRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
}
