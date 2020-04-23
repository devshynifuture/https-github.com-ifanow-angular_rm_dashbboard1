import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-add-health-insurance-asset',
  templateUrl: './add-health-insurance-asset.component.html',
  styleUrls: ['./add-health-insurance-asset.component.scss']
})
export class AddHealthInsuranceAssetComponent implements OnInit {
  inputData: any;
  ownerName: any;
  nomineesListFM: any = [];
  familyMemberId: any;
  advisorId: any;
  clientId: any;
  insuranceId: any;
  addMoreFlag = false;
  FamilyMember: any;
  ProposerData: any;
  familyMemberLifeData: any;
  flag: string;
  ownerData: any;
  callMethod: any;
  healthInsuranceForm: any;
  displayList: any;
  nomineesList: any[] = [];
  policyList: any;
  addOns: any;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService) { }
  validatorType = ValidatorType
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.policyList = data.displayList.policyTypes;
    this.addOns = data.displayList.addOns;
    this.getdataForm(data)
    this.inputData = data;
    // this.setInsuranceDataFormField(data);
    console.log(data);
  }
  get data() {
    return this.inputData;
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
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
      this.healthInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if(con.nominee != null && con.nominee){
      this.healthInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }
  
  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName : "onChangeJointOwnership",
      ParamValue : data
    }
  }
  
  /***owner***/ 
  get insuredMembersForm() {
    return this.healthInsuranceForm.get('InsuredMemberForm') as FormArray;
  }
  get getCoOwner() {
    return this.healthInsuranceForm.get('getCoOwnerName') as FormArray;
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
    if (this.healthInsuranceForm.value.getCoOwnerName.length == 1) {
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
    return this.healthInsuranceForm.get('getNomineeName') as FormArray;
  }
  
  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.healthInsuranceForm.value.getNomineeName.length == 1) {
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
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "ADD";
    }
    else {
      this.flag = "EDIT";
    }
    this.healthInsuranceForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      PlanType: [data.PlanType, [Validators.required]],
      planDetails: [data.planDetails, [Validators.required]],
      insuredMembers: [data.insuredMembers, [Validators.required]],
      sumAssured: [data.sumAssured, [Validators.required]],
      deductibleAmt: [data.deductibleAmt, [Validators.required]],
      policyNum: [data.policyNum, [Validators.required]],
      insurerName: [data.insurerName, [Validators.required]],
      planeName: [data.planeName, [Validators.required]],
      loanAmount: [data.loanAmount, [Validators.required]],
      policyStartDate: [data.policyStartDate, [Validators.required]],
      policyExpiryDate: [data.policyExpiryDate, [Validators.required]],
      copay: [data.copay],
      copayType: [data.copayType],
      cumulativeBonus: [data.cumulativeBonus],
      bonusType: [data.bonusType],
      additionalCovers: [data.additionalCovers],
      coversAmount: [data.coversAmount],
      exclusion: [data.exclusion],
      inceptionDate: [data.inceptionDate],
      nomineeRelation: [data.nomineeRelation],
      tpaName: [data.tpaName],
      advisorName: [data.advisorName],
      serviceBranch: [data.serviceBranch],
      bankAccount: [data.bankAccount],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      InsuredMemberForm: this.fb.array([this.fb.group({
        insuredMembers: [''],
        sumAssured: null
      })])
    })
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.healthInsuranceForm.value.getCoOwnerName.length == 1) {
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
    if (data.nomineeList) {
      this.getNominee.removeAt(0);
      data.nomineeList.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.healthInsuranceForm }
    // ==============owner-nominee Data ========================\\ 
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.healthInsuranceForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  ngOnInit() {
  }

  addTransaction() {
    this.insuredMembersForm.push(this.fb.group({
      insuredMembers: [''],
      sumAssured: null
    }));
  }

  removeTransaction(item) {
    this.insuredMembersForm.removeAt(item);
  }
  /***owner***/

  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
  }

  saveHealthInsurance() {
    if (this.healthInsuranceForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.healthInsuranceForm.markAllAsTouched();
      return
    }
    else { 
      const obj ={
        "clientId":this.clientId,
        "advisorId":this.advisorId,
        "policyHolderId":17,
        "policyStartDate":this.healthInsuranceForm.get('policyStartDate').value,
        "policyExpiryDate":this.healthInsuranceForm.get('policyExpiryDate').value,
        "cumulativeBonus":500.0,
        "cumulativeBonusRupeesOrPercent":2,
        "sumInsuredIdv":500.0,
        "policyTypeId":5,
        "geographyId":3,
        "deductibleSumInsured":500.0,
        "exclusion":"basiagkbduif",
        "premiumAmount":800.0,
        "copay":80.0,
        "copayRupeesOrPercent":1,
        "vehicleTypeId":1,
        "vehicleRegNo":"bdsf",
        "vehicleRegistrationDate":"2020-01-02",
        "vehicleModel":"ford",
        "engineNo":"11",
        "chasisNo":"3646",
        "fuelTypeId":1,
        "hypothetication":"lcsiadfi",
        "specialDiscount":80.0,
        "noClaimBonus":80.0,
        "tpaName":"pqrts",
        "advisorName":"Shilpa",
        "serviceBranch":"Goregaon",
        "linkedBankAccount":"kbksad",
        "insuranceSubTypeId":6,
        "addOns":[{
           "addOnId":13,
           "addOnSumInsured":500
        }],
        "policyFeatures":[
           {
               "policyFeatureId":1
           }
        ],
        "insuredMembers":[
        {
        "familyMemberId":17,
        "relationshipId":2,
        "insuredOrNominee":1,
        "sumInsured":500
        }
        ],
        "nominees":[
        {
        "familyMemberId":18,
        "relationshipId":2,
        "insuredOrNominee":2
        }
        ]
        }
    }

  }
  close(data) {
    this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }

}
