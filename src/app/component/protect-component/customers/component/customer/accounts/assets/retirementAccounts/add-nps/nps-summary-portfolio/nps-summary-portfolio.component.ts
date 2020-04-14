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
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
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
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  validatorType = ValidatorType
  myControl = new FormControl();
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  summaryNPS: any;
  ownerData: any;
  callMethod:any;
  isValueAsOn = false;
  isTotalContry = false;
  isCurrentValue = false;
  isFrequency = false;
  isApproxContry = false;
  isAccountPref = false
  nomineeList: any=[];
  advisorId: any;
  nomineesListFM: any=[];

  clientId: any;
  nexNomineePer = 0;
  getPerAllocation: number;
  sumPer: any;
  showError = false;
  nomineeData: any;
  familyList: any;
  dataFM: any[];
  showHide = false;
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
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

  @Input() popupHeaderText: string = 'Add Portfolio summary';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
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
    this.summaryNPS.controls.getCoOwnerName = con.owner;
  }
  if(con.nominee != null && con.nominee){
    this.summaryNPS.controls.getNomineeName = con.nominee;
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
  return this.summaryNPS.get('getCoOwnerName') as FormArray;
}

addNewCoOwner(data) {
  this.getCoOwner.push(this.fb.group({
    name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
  }));
  if (data) {
    setTimeout(() => {
     this.disabledMember(null,null);
    }, 1300);
  }
  if(this.getCoOwner.value.length > 1 && !data){
   let share = 100/this.getCoOwner.value.length;
   for (let e in this.getCoOwner.controls) {
    if(!Number.isInteger(share) && e == "0"){
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
    }
    else{
      this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
    }
   }
  }
 
}

removeCoOwner(item) {
  this.getCoOwner.removeAt(item);
  if (this.summaryNPS.value.getCoOwnerName.length == 1) {
    this.getCoOwner.controls['0'].get('share').setValue('100');
  } else {
    let share = 100/this.getCoOwner.value.length;
    for (let e in this.getCoOwner.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
      }
      else{
        this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
      }
    }
  }
  this.disabledMember(null, null);
}
/***owner***/ 

/***nominee***/ 

get getNominee() {
  return this.summaryNPS.get('getNomineeName') as FormArray;
}

removeNewNominee(item) {
  this.disabledMember(null, null);
  this.getNominee.removeAt(item);
  if (this.summaryNPS.value.getNomineeName.length == 1) {
    this.getNominee.controls['0'].get('sharePercentage').setValue('100');
  } else {
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
  }
}



addNewNominee(data) {
  this.getNominee.push(this.fb.group({
    name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0],isClient: [data ? data.isClient : 0]
  }));
  if (!data || this.getNominee.value.length < 1) {
    for (let e in this.getNominee.controls) {
      this.getNominee.controls[e].get('sharePercentage').setValue(0);
    }
  }

  if(this.getNominee.value.length > 1 && !data){
    let share = 100/this.getNominee.value.length;
    for (let e in this.getNominee.controls) {
      if(!Number.isInteger(share) && e == "0"){
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
      }
      else{
        this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
      }
    }
   }
   
  
}
/***nominee***/ 
// ===================owner-nominee directive=====================//
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
    this.flag = data;

    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.familyMemberId = data.familyMemberId;;
    this.summaryNPS = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      currentValue: [(data == undefined) ? '' : data.currentValuation, [Validators.required]],
      valueAsOn: [(data == undefined) ? '' : new Date(data.valueAsOn), [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice) + "",],
      pran: [(data == undefined) ? '' : data.pran,],
      totalContry: [(data == undefined) ? '' : data.contributionAmount, [Validators.required]],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],
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
  if(this.summaryNPS.value.getCoOwnerName.length == 1){
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

this.ownerData = {Fmember: this.nomineesListFM, controleData:this.summaryNPS}
// ==============owner-nominee Data ========================\\ 
    // this.ownerData = this.summaryNPS.controls;
    // this.nomineeData = this.summaryNPS.controls;
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
    // if (data.nominees != undefined) {
    //   if (data.nominees.length != 0) {
    //     data.nominees.forEach(element => {
    //       this.summaryNPS.controls.nominees.push(this.fb.group({
    //         name: [(element.name),],
    //         familyMemberId: [(element.familyMemberId),],
    //         sharePercentage: [element.sharePercentage,],
    //         id: [element.id,]
    //       }))
    //     })
    //     this.nominee.removeAt(0);

    //   } else {
    //     this.nominee.push(this.fb.group({
    //       name: [null,], sharePercentage: [null,],
    //     }));
    //   }

    // }


    // this.familyMemberId = this.summaryNPS.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]

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
    if (this.summaryNPS.invalid) {
      this.summaryNPS.markAllAsTouched();
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        ownerList: this.summaryNPS.value.getCoOwnerName,
        // familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.summaryNPS.controls.ownerName.value : this.ownerName,
        valueAsOn: this.datePipe.transform(this.summaryNPS.controls.valueAsOn.value, 'yyyy-MM-dd'),
        currentValuation: this.summaryNPS.controls.currentValue.value,
        contributionAmount: this.summaryNPS.controls.totalContry.value,
        pran: this.summaryNPS.controls.pran.value,
        schemeChoice: this.summaryNPS.controls.schemeChoice.value,
        futureContributionList: this.summaryNPS.controls.futureContributionList.value,
        // nominees: this.summaryNPS.controls.nominees.value,
        description: this.summaryNPS.controls.description.value,
        nomineeList: this.summaryNPS.value.getNomineeName,
        id: this.summaryNPS.controls.id.value
      }
      this.barButtonOptions.active = true;
      // this.nominee.value.forEach(element => {
      //   if (element.sharePercentage == null && element.name == null) {
      //     this.nominee.removeAt(0);
      //   }
      //   obj.nominees = this.summaryNPS.controls.nominees.value;
      // });
      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.summaryNPS.value.getNomineeName;
      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.summaryNPS.controls.id.value == undefined && this.flag != 'adviceNPSSummary') {
        this.custumService.addNPS(obj).subscribe(
          data =>{
            this.barButtonOptions.active = false;
            this.addNPSRes(data)
          },
          err =>{
            this.barButtonOptions.active = false;
          } 
        );
      } else if (this.flag == 'adviceNPSSummary') {
        this.custumService.getAdviceNps(adviceObj).subscribe(
          data =>{
            this.barButtonOptions.active = false;
            this.getAdviceNscSummaryRes(data)
          },
          err =>{
            this.barButtonOptions.active = false;
          }
        );
      } else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data =>{
            this.editNPSRes(data);
          },
          err =>{
            this.barButtonOptions.active = false;
          }
        );
      }
    }
  }
  getAdviceNscSummaryRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('NSC added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  addNPSRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
  editNPSRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Updated successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true })
  }
}
