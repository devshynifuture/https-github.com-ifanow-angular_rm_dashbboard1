import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
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
  myControl = new FormControl();
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
  nomineesListFM: any[];

  clientId: any;
  nexNomineePer = 0;
  getPerAllocation: number;
  sumPer: any;
  showError = false;
  nomineeData: any;
  familyList: any;
  dataFM: any[];
  showHide = false;
  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) {
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
    this.clientId = AuthService.getClientId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      // var evens = _.reject(this.dataFM, function (n) {
      //   return n.userName == name;
      // });
      let evens = this.dataFM.filter(deltData => deltData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  onNomineeChange(value) {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.nomineePercentageShare
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.summaryNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      currentValue: [(data == undefined) ? '' : data.currentValuation, [Validators.required]],
      valueAsOn: [(data == undefined) ? '' : new Date(data.valueAsOn), [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice) + "", [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      totalContry: [(data == undefined) ? '' : data.contributionAmount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: [null, [Validators.required]],
        accountPreferenceId: [null, [Validators.required]], approxContribution: [null, [Validators.required]]
      })]),
      nominees: this.fb.array([this.fb.group({
        name: [null, [Validators.required]], sharePercentage: [null, [Validators.required, Validators.min(1)]],
      })]),
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.summaryNPS.controls;
    this.nomineeData = this.summaryNPS.controls;
    if (data.futureContributionList != undefined) {
      data.futureContributionList.forEach(element => {
        this.summaryNPS.controls.futureContributionList.push(this.fb.group({
          frequencyId: [(element.frequencyId) + "", [Validators.required]],
          accountPreferenceId: [(element.accountPreferenceId + ""), Validators.required],
          approxContribution: [(element.approxContribution), Validators.required],
          id: [element.id, [Validators.required]]
        }))
      })
      this.futureContry.removeAt(0);

    }
    if (data.nominees != undefined) {
      if (data.nominees.length != 0) {
        data.nominees.forEach(element => {
          this.summaryNPS.controls.nominees.push(this.fb.group({
            name: [(element.name), [Validators.required]],
            familyMemberId: [(element.familyMemberId), [Validators.required]],
            sharePercentage: [element.sharePercentage, Validators.required],
            id: [element.id, [Validators.required]]
          }))
        })
        this.nominee.removeAt(0);

      } else {
        this.nominee.push(this.fb.group({
          name: [null, [Validators.required]], sharePercentage: [null, [Validators.required]],
        }));
      }

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
      frequencyId: [null, [Validators.required]],
      accountPreferenceId: [null, [Validators.required]], approxContribution: [null, [Validators.required]]
    }));

  }
  removeFutureContry(item) {
    if (this.futureContry.value.length > 1) {
      this.futureContry.removeAt(item);
    }
  }
  get nominee() {
    return this.summaryNPS.get('nominees') as FormArray;
  }
  addNominee() {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.sharePercentage
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
    if (this.showError == false) {
      this.nominee.push(this.fb.group({
        name: [null, [Validators.required]], sharePercentage: [null, [Validators.required]],
      }));
    }


  }
  removeNominee(item) {
    if (this.nominee.value.length > 1) {
      this.nominee.removeAt(item);
    }
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.nomineePercentageShare
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  summaryNPSSave() {
    if (this.summaryNPS.get('currentValue').invalid) {
      this.summaryNPS.get('currentValue').markAsTouched();
      return;
    } else if (this.summaryNPS.get('ownerName').invalid) {
      this.summaryNPS.get('ownerName').markAsTouched();
      return
    } else if (this.summaryNPS.get('valueAsOn').invalid) {
      this.summaryNPS.get('valueAsOn').markAsTouched();
      return;
    } else if (this.summaryNPS.get('totalContry').invalid) {
      this.summaryNPS.get('totalContry').markAsTouched();
      return;
    } else if (this.summaryNPS.get('futureContributionList').invalid) {
      this.summaryNPS.get('futureContributionList').markAsTouched();
      return
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.summaryNPS.controls.ownerName.value : this.ownerName,
        valueAsOn: this.datePipe.transform(this.summaryNPS.controls.valueAsOn.value, 'yyyy-MM-dd'),
        currentValuation: this.summaryNPS.controls.currentValue.value,
        contributionAmount: this.summaryNPS.controls.totalContry.value,
        pran: this.summaryNPS.controls.pran.value,
        schemeChoice: this.summaryNPS.controls.schemeChoice.value,
        futureContributionList: this.summaryNPS.controls.futureContributionList.value,
        nominees: this.summaryNPS.controls.nominees.value,
        description: this.summaryNPS.controls.description.value,
        id: this.summaryNPS.controls.id.value
      }
      this.nominee.value.forEach(element => {
        if (element.sharePercentage == null && element.name == null) {
          this.nominee.removeAt(0);
        }
        obj.nominees = this.summaryNPS.controls.nominees.value;
      });
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
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  editNPSRes(data) {
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
}
