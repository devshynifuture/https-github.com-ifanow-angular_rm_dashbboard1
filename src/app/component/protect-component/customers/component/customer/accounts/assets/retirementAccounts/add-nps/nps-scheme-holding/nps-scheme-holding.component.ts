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
import { UtilService, ValidatorType } from 'src/app/services/util.service';

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
  validatorType = ValidatorType
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
  nomineesListFM:any = [];
  callMethod:any;
  dataFM = [];
  familyList: any;
  nexNomineePer = 0;
  showError = false;
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;

  constructor(private event: EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Scheme level holding';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.idForscheme1 = []
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.getGlobalList()


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
    this.flag = data;
    if (data == undefined) {
      data = {}
    }
    this.schemeHoldingsNPS = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: ['',[Validators.required]],
        familyMemberId: [0],
        id:0
      })]),
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice) + "",],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      // schemeName: [(data == undefined) ? '' : data.schemeName, [Validators.required]],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],
      holdingList: this.fb.array([this.fb.group({
        schemeName: [null, [Validators.required]], holdingAsOn: [null, [Validators.required]],
        totalUnits: [null, [Validators.required]], totalNetContribution: [null, [Validators.required]]
      })]),
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: [null, [Validators.required]],
        accountPreferenceId: [null, [Validators.required]], approxContribution: [null, [Validators.required]]
      })]),
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    });
    // ==============owner-nominee Data ========================\\
  /***owner***/ 
  if(this.schemeHoldingsNPS.value.getCoOwnerName.length == 1){
    this.getCoOwner.controls['0'].get('share').setValue('100');
  }

  if (data.ownerList) {
    this.getCoOwner.removeAt(0);
    data.ownerList.forEach(element => {
      this.addNewCoOwner(element);
    });
  }
  
/***owner***/ 

/***nominee***/ 
if(data.nomineeList){
  this.getNominee.removeAt(0);
  data.nomineeList.forEach(element => {
    this.addNewNominee(element);
  });
}
/***nominee***/ 

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.schemeHoldingsNPS}
// ==============owner-nominee Data ========================\\ 
    // this.familyMemberId = this.schemeHoldingsNPS.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]
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
      // if (data.nominees != undefined) {
      //   if (data.nominees.length != 0) {
      //     data.nominees.forEach(element => {
      //       this.schemeHoldingsNPS.controls.nominees.push(this.fb.group({
      //         name: [(element.name), [Validators.required]],
      //         familyMemberId: [(element.familyMemberId), [Validators.required]],
      //         sharePercentage: [element.sharePercentage, Validators.required],
      //         id: [element.id, [Validators.required]]
      //       }))
      //     })
      //     this.nominee.removeAt(0);

      //   } else {
      //     this.nominee.push(this.fb.group({
      //       name: [null, [Validators.required]], sharePercentage: [null, [Validators.required]],
      //     }));
      //   }

      // }
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
  removeFutureContry() {
    if (this.futureContry.value.length > 1) {
      // this.futureContry.removeAt(item);
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

 // ===================owner-nominee directive=====================//
 display(value) {
  console.log('value selected', value)
  this.ownerName = value.userName;
  this.familyMemberId = value.id
}

lisNominee(value) {
  this.ownerData.Fmember = value;
  this.nomineesListFM = Object.assign([], value);
}

disabledMember(value, type) {
  this.callMethod = {
    methodName : "disabledMember",
    ParamValue : value,
    disControl : type
  }
}

displayControler(con) {
  console.log('value selected', con);
  if(con.owner != null && con.owner){
    this.schemeHoldingsNPS.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.schemeHoldingsNPS.controls.getNomineeName = con.nominee;
  }
}

onChangeJointOwnership(data) {
  this.callMethod = {
    methodName : "onChangeJointOwnership",
    ParamValue : data
  }
}

/***owner***/ 

get getCoOwner() {
  return this.schemeHoldingsNPS.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? String(data.share) : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
  }));
  if (!data || this.getCoOwner.value.length < 1) {
    for (let e in this.getCoOwner.controls) {
      this.getCoOwner.controls[e].get('share').setValue('');
    }
  }
}

removeCoOwner(item) {
  this.getCoOwner.removeAt(item);
  if (this.schemeHoldingsNPS.value.getCoOwnerName.length == 1) {
    this.getCoOwner.controls['0'].get('share').setValue('100');
  } else {
    for (let e in this.getCoOwner.controls) {
      this.getCoOwner.controls[e].get('share').setValue('');
    }
  }
}
/***owner***/ 

/***nominee***/ 

get getNominee() {
  return this.schemeHoldingsNPS.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.getNominee.removeAt(item);
  
}



addNewNominee(data) {
  this.getNominee.push(this.fb.group({
    name: [data ? data.name : ''], sharePercentage: [data ? String(data.sharePercentage) : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0]
  }));
  if (!data || this.getNominee.value.length < 1) {
    for (let e in this.getNominee.controls) {
      this.getNominee.controls[e].get('sharePercentage').setValue(0);
    }
  }
  
}
/***nominee***/ 
// ===================owner-nominee directive=====================//

  saveSchemeHolding() {
    console.log(this.schemeHoldingsNPS.get('holdingList').invalid)
    console.log(this.schemeHoldingsNPS.get('futureContributionList').invalid)
    // console.log(this.schemeHoldingsNPS.get('nominees').invalid)
    if (this.schemeHoldingsNPS.invalid) {
      this.schemeHoldingsNPS.get('ownerName').markAsTouched();
      this.schemeHoldingsNPS.get('pran').markAsTouched();
      this.schemeHoldingsNPS.get('ownerName').markAsTouched();
      this.schemeHoldingsNPS.get('holdingList').markAsTouched();
      this.schemeHoldingsNPS.get('futureContributionList').markAsTouched();
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.schemeHoldingsNPS.controls.ownerName.value : this.ownerName,
        ownerList: this.schemeHoldingsNPS.value.getCoOwnerName,
        pran: this.schemeHoldingsNPS.controls.pran.value,
        holdingList: this.schemeHoldingsNPS.controls.holdingList.value,
        futureContributionList: this.schemeHoldingsNPS.controls.futureContributionList.value,
        // nominees: this.schemeHoldingsNPS.controls.nominees.value,
        nomineeList: this.schemeHoldingsNPS.value.getNomineeName,
        description: this.schemeHoldingsNPS.controls.description.value,
        id: this.schemeHoldingsNPS.controls.id.value
      }
      // this.nominee.value.forEach(element => {
      //   if (element.sharePercentage == null && element.name == null) {
      //     this.nominee.removeAt(0);
      //   }
      //   obj.nominees = this.schemeHoldingsNPS.controls.nominees.value;
      // });
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.schemeHoldingsNPS.controls.id.value == undefined && this.flag != 'adviceNPSSchemeHolding') {
        this.custumService.addNPS(obj).subscribe(
          data => this.addNPSRes(data)
        );
      } else if (this.flag == 'adviceNPSSchemeHolding') {
        this.custumService.getAdviceNps(adviceObj).subscribe(
          data => this.getAdviceNscSchemeLevelRes(data),
        );
      } else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data => this.editNPSRes(data)
        );
      }
    }
  }
  getAdviceNscSchemeLevelRes(data) {
    this.event.openSnackBar('NPS added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  addNPSRes(data) {
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  editNPSRes(data) {
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
}
