import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-nps-scheme-holding',
  templateUrl: './nps-scheme-holding.component.html',
  styleUrls: ['./nps-scheme-holding.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],

})
export class NpsSchemeHoldingComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  schemeHoldingsNPS: any;
  isPran = false
  advisorId: any;
  ownerData: any;
  schemes: any[];
  schemeList: any;
  idForscheme: any;
  idForscheme1: any[];
  clientId: any;
  nomineesListFM: any;
  dataFM = [];
  familyList: any;
  nexNomineePer = 0;
  showError = false;
  flag: any;

  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.idForscheme1 = []
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.getGlobalList()


  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
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
  onNomineeChange(value) {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.nomineePercentageShare;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getGlobalList() {
    this.custumService.getGlobal().subscribe(
      data => this.getGlobalRes(data)
    );
  }
  getGlobalRes(data) {

    console.log('getGlobalRes', data)
    this.schemeList = data.npsScheme;
  }

  getdataForm(data) {
    this.flag=data;
    if (data == undefined) {
      data = {}
    }
    this.schemeHoldingsNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice) + "", [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      schemeName: [(data == undefined) ? '' : data.schemeName, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      holdingList: this.fb.array([this.fb.group({
        schemeName: [null, [Validators.required]], holdingAsOn: [null, [Validators.required]],
        totalUnits: [null, [Validators.required]], totalNetContribution: [null, [Validators.required]]
      })]),
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: [null, [Validators.required]],
        accountPreferenceId: [null, [Validators.required]], approxContribution: [null, [Validators.required]]
      })]),
      nominees: this.fb.array([this.fb.group({
        name: null, sharePercentage: null,
      })]),
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.schemeHoldingsNPS.controls;
    this.familyMemberId = this.schemeHoldingsNPS.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    if (data.futureContributionList != undefined || data.nominees != undefined || data.holdingList != undefined) {
      data.futureContributionList.forEach(element => {
        this.schemeHoldingsNPS.controls.futureContributionList.push(this.fb.group({
          frequencyId: [(element.frequencyId) + "", [Validators.required]],
          accountPreferenceId: [(element.accountPreferenceId + ""), Validators.required],
          approxContribution: [(element.approxContribution), Validators.required],
          id: [element.id, [Validators.required]]
        }))
      })
      // data.nominees.forEach(element => {
      //   this.schemeHoldingsNPS.controls.nominees.push(this.fb.group({
      //     name: [(element.name), [Validators.required]],
      //     sharePercentage: [element.sharePercentage , Validators.required],
      //     id:[element.id,[Validators.required]],
      //     familyMemberId:[element.familyMemberId]
      //   }))
      // })
      if (data.nominees != undefined) {
        if (data.nominees.length != 0) {
          data.nominees.forEach(element => {
            this.schemeHoldingsNPS.controls.nominees.push(this.fb.group({
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
      data.holdingList.forEach(element => {
        this.schemeHoldingsNPS.controls.holdingList.push(this.fb.group({
          schemeName: [(element.schemeId) + "", [Validators.required]],
          totalUnits: [(element.totalUnits), Validators.required],
          totalNetContribution: [(element.totalNetContribution), Validators.required],
          holdingAsOn: [new Date(element.totalNetContribution), Validators.required],
          id: [element.id, [Validators.required]]
        }))
      })
      // this.nominee.removeAt(0);
      this.futureContry.removeAt(0);
      this.holdings.removeAt(0);
    }

  }
  get holdings() {
    return this.schemeHoldingsNPS.get('holdingList') as FormArray;
  }
  addHoldings() {
    this.holdings.push(this.fb.group({
      schemeName: [null, [Validators.required]], holdingAsOn: [null, [Validators.required]],
      totalUnits: [null, [Validators.required]], totalNetContribution: [null, [Validators.required]]
    }));

  }
  removeHoldings(item) {
    if (this.holdings.value.length > 1) {
      this.holdings.removeAt(item)
    }
  }
  get futureContry() {
    return this.schemeHoldingsNPS.get('futureContributionList') as FormArray;
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
    return this.schemeHoldingsNPS.get('nominees') as FormArray;
  }
  addNominee() {
    // this.nexNomineePer = _.sumBy(this.nominee.value, function (o) {
    //   return o.nomineePercentageShare;
    // });
    this.nominee.value.forEach(element => {
      this.nexNomineePer += element.sharePercentage;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
    if (this.showError == false) {
      this.nominee.push(this.fb.group({
        name: null, sharePercentage: null,
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
      this.nexNomineePer += element.nomineePercentageShare;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getFormControl(): any {
    return this.schemeHoldingsNPS.controls;
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }
  saveSchemeHolding() {
    console.log(this.schemeHoldingsNPS.get('holdingList').invalid)
    console.log(this.schemeHoldingsNPS.get('futureContributionList').invalid)
    console.log(this.schemeHoldingsNPS.get('nominees').invalid)
    if (this.schemeHoldingsNPS.get('pran').invalid) {
      this.schemeHoldingsNPS.get('pran').markAsTouched();
      return;
    } else if (this.schemeHoldingsNPS.get('ownerName').invalid) {
      this.schemeHoldingsNPS.get('ownerName').markAsTouched();
      return
    } else if (this.schemeHoldingsNPS.get('holdingList').invalid) {
      this.schemeHoldingsNPS.get('holdingList').markAsTouched();
      return
    } else if (this.schemeHoldingsNPS.get('futureContributionList').invalid) {
      this.schemeHoldingsNPS.get('futureContributionList').markAsTouched();
      return
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.schemeHoldingsNPS.controls.ownerName.value : this.ownerName,
        pran: this.schemeHoldingsNPS.controls.pran.value,
        holdingList: this.schemeHoldingsNPS.controls.holdingList.value,
        futureContributionList: this.schemeHoldingsNPS.controls.futureContributionList.value,
        nominees: this.schemeHoldingsNPS.controls.nominees.value,
        description: this.schemeHoldingsNPS.controls.description.value,
        id: this.schemeHoldingsNPS.controls.id.value
      }
      this.nominee.value.forEach(element => {
        if (element.sharePercentage == null && element.name == null) {
          this.nominee.removeAt(0);
        }
        obj.nominees = this.schemeHoldingsNPS.controls.nominees.value;
      });
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.schemeHoldingsNPS.controls.id.value == undefined && this.flag!='adviceNPSSchemeHolding') {
        this.custumService.addNPS(obj).subscribe(
          data => this.addNPSRes(data)
        );
      } else if(this.flag=='adviceNPSSchemeHolding'){
        this.custumService.getAdviceNps(adviceObj).subscribe(
          data => this.getAdviceNscSchemeLevelRes(data),
        );
      }else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data => this.editNPSRes(data)
        );
      }
    }
  }
  getAdviceNscSchemeLevelRes(data){
    this.event.openSnackBar('NPS added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
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
