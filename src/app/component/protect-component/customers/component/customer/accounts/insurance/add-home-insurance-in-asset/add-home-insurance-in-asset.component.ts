import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-home-insurance-in-asset',
  templateUrl: './add-home-insurance-in-asset.component.html',
  styleUrls: ['./add-home-insurance-in-asset.component.scss']
})
export class AddHomeInsuranceInAssetComponent implements OnInit {
  maxDate = new Date();

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
  nominees: any[];
  flag: string;
  ownerData: any;
  callMethod: any;
  homeInsuranceForm: any;
  displayList: any;
  nomineesList: any[] = [];
  policyList: any;
  addOns: any;
  dataForEdit: any;
  policyFeature: any;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) { }
  validatorType = ValidatorType
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.inputData = data;
    this.policyList = data.displayList.policyTypes;
    this.policyFeature = data.displayList.policyFeature;
    this.addOns = data.displayList.addOns;
    this.getFamilyMemberList();
    this.getdataForm(data)
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
  getFamilyMember(data, index) {
    this.familyMemberLifeData = data;
    console.log('family Member', this.FamilyMember);
  }


  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.homeInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.homeInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/
  get insuredMembersForm() {
    return this.homeInsuranceForm.get('InsuredMemberForm') as FormArray;
  }
  get planFeatureForm() {
    return this.homeInsuranceForm.get('planFeatureForm') as FormArray;
  }
  get getCoOwner() {
    return this.homeInsuranceForm.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : '', [Validators.required]], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.homeInsuranceForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      let share = 100 / this.getCoOwner.value.length;
      for (let e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        }
        else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }
  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.homeInsuranceForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.homeInsuranceForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }



  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''], sharePercentage: [data ? data.sharePercentage : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (let e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      let share = 100 / this.getNominee.value.length;
      for (let e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == "0") {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        }
        else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }
  getdataForm(data) {
    this.dataForEdit = data.data;
    if (data.data == null) {
      data = {};
      this.dataForEdit = data.data;
      this.flag = "ADD";
    }
    else {
      this.dataForEdit = data.data;
      this.flag = "EDIT";
    }
    this.homeInsuranceForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0,],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      name:[(this.dataForEdit ? this.dataForEdit.name : '')],
      PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId : ''), [Validators.required]],
      planDetails: [(this.dataForEdit ? this.dataForEdit.policyFeatureId+'' : ''), [Validators.required]],
      deductibleAmt: [(this.dataForEdit ? this.dataForEdit.deductibleSumInsured : ''), [Validators.required]],
      policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : ''), [Validators.required]],
      sumAddOns: [(this.dataForEdit ? this.dataForEdit.sumAddOns : ''), [Validators.required]],
      premium: [(this.dataForEdit ? this.dataForEdit.premium : ''), [Validators.required]],
      insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : ''), [Validators.required]],
      financierName: [(this.dataForEdit ? this.dataForEdit.financierName : ''), [Validators.required]],
      planeName: [(this.dataForEdit ? this.dataForEdit.planeName :''), [Validators.required]],
      loanAmount: [(this.dataForEdit ? this.dataForEdit.loanAmount :''), [Validators.required]],
      policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : '', [Validators.required]],
      policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : '', [Validators.required]],
      copay: [(this.dataForEdit ? this.dataForEdit.copay : '')],
      copayType: [this.dataForEdit ? this.dataForEdit.copayRupeesOrPercent + '' : ''],
      cumulativeBonus: [this.dataForEdit ? this.dataForEdit.cumulativeBonus : ''],
      bonusType: [this.dataForEdit ? this.dataForEdit.cumulativeBonusRupeesOrPercent + '' : ''],
      additionalCovers: [this.dataForEdit ? this.dataForEdit.addOns[0].addOnId : ''],
      coversAmount: [this.dataForEdit ? this.dataForEdit.addOns[0].addOnSumInsured : ''],
      exclusion: [this.dataForEdit ? this.dataForEdit.exclusion :''],
      inceptionDate: [this.dataForEdit ? new Date(this.dataForEdit.policyInceptionDate) : ''],
      tpaName: [this.dataForEdit ? this.dataForEdit.tpaName : ''],
      advisorName: [this.dataForEdit ? this.dataForEdit.advisorName :''],
      serviceBranch: [this.dataForEdit ? this.dataForEdit.serviceBranch :''],
      bankAccount: [this.dataForEdit ? this.dataForEdit.linkedBankAccount : ''],
      nominees: this.nominees,
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      InsuredMemberForm: this.fb.array([this.fb.group({
        insuredMembers: ['', [Validators.required]],
        sumAssured: [null, [Validators.required]],
        id:null,
        familyMemberId:[''],
        relationshipId:['']
      })]),
      planFeatureForm: this.fb.array([this.fb.group({
        planfeatures: [''],
        sumInsured:['']
      })])
    })
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.homeInsuranceForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    }

    // if (this.dataForEdit && this.dataForEdit.ownerList) {
    //   this.getCoOwner.removeAt(0);
    //   this.dataForEdit.ownerList.forEach(element => {
    //     this.addNewCoOwner(element);
    //   });
    // }

    if (this.dataForEdit) {
      this.getCoOwner.removeAt(0);
      const data={
        name:this.dataForEdit.policyHolderName,
        familyMemberId:this.dataForEdit.policyHolderId
      }
        this.addNewCoOwner(data);
    }

    /***owner***/

    /***nominee***/
    if (this.dataForEdit) {
      this.getNominee.removeAt(0);
      this.dataForEdit.nominees.forEach(element => {
        this.addNewNominee(element);
      });
    }
    /***nominee***/
    if (this.dataForEdit) {
      this.insuredMembersForm.removeAt(0);
      this.dataForEdit.insuredMembers.forEach(element => {
        this.addTransaction(element);
      });
    }


    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.homeInsuranceForm }

    // this.finalCashFlowData = [];
    // ==============owner-nominee Data ========================\\ 
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.homeInsuranceForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  ngOnInit() {
  }
  getFamilyData(value,data){

    data.forEach(element => {
      for (let e in this.insuredMembersForm.controls) {
        let name = this.insuredMembersForm.controls[e].get('insuredMembers')
        if(element.userName == name.value){
          this.insuredMembersForm.controls[e].get('insuredMembers').setValue(element.userName);
          this.insuredMembersForm.controls[e].get('familyMemberId').setValue(element.id);
          this.insuredMembersForm.controls[e].get('relationshipId').setValue(element.relationshipId);
        }
      }
     
    });
    

  }

  addTransaction(data) {
    this.insuredMembersForm.push(this.fb.group({
      insuredMembers: [data ? data.name : ''],
      sumAssured: [data ? data.sumInsured : ''],
      id:[data ? data.id : ''],
      relationshipId:[data ? data.relationshipId : ''],
      familyMemberId:[data ? data.familyMemberId : '']
    }));
  }

  removeTransaction(item) {
    let finalMemberList = this.homeInsuranceForm.get('InsuredMemberForm') as FormArray 
    if(finalMemberList.length > 1){
    this.insuredMembersForm.removeAt(item);

    }
  }
  /***owner***/
  addNewFeature(data) {
    this.planFeatureForm.push(this.fb.group({
      planfeatures: [data ? data.planFeature : ''],
      sumInsured:[data ? data.sumAssured : '']
    }));
  }
  removeNewFeature(item) {
    let finalFeatureList = this.homeInsuranceForm.get('planFeatureForm') as FormArray 
    if(finalFeatureList.length > 1){
    this.planFeatureForm.removeAt(item);

    }
  }
  openOptionField() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
  }
  getFamilyMemberList() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.customerService.getListOfFamilyByClient(obj).subscribe(
      data => this.getFamilyMemberListRes(data)
    );
  }
  getFamilyMemberListRes(data) {
    console.log(data);
    this.FamilyMember = data.familyMembersList;
    this.ProposerData = Object.assign([], data.familyMembersList);
    console.log('Proposer data', this.ProposerData);
  }
  preventDefault(e) {
    e.preventDefault();
  }
  saveHomeInsurance() {
    let memberList = [];
    let finalMemberList = this.homeInsuranceForm.get('InsuredMemberForm') as FormArray
    finalMemberList.controls.forEach(element => {
      let obj =
      {
        familyMemberId: element.get('familyMemberId').value,
        sumInsured: element.get('sumAssured').value,
        relationshipId: element.get('relationshipId').value,  
        insuredOrNominee: 1,
        id:(element.get('id').value) ? element.get('id').value : null
      }
      memberList.push(obj)
    })
    let featureList = [];
    let finalplanFeatureList = this.homeInsuranceForm.get('planFeatureForm') as FormArray
    finalplanFeatureList.controls.forEach(element => {
      let obj =
      {
        planfeatures : element.get('planfeatures').value,
      }
      featureList.push(obj)
    })
    if (this.homeInsuranceForm.invalid) {
      this.homeInsuranceForm.markAllAsTouched();
    } else {
      const obj = {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "policyHolderId": this.homeInsuranceForm.value.getCoOwnerName[0].familyMemberId,
        "policyStartDate": this.homeInsuranceForm.get('policyStartDate').value,
        "policyExpiryDate": this.homeInsuranceForm.get('policyExpiryDate').value,
        "cumulativeBonus": this.homeInsuranceForm.get('cumulativeBonus').value,
        "cumulativeBonusRupeesOrPercent": this.homeInsuranceForm.get('bonusType').value,
        "policyTypeId": this.homeInsuranceForm.get('PlanType').value,
        "deductibleSumInsured": this.homeInsuranceForm.get('deductibleAmt').value,
        "exclusion": this.homeInsuranceForm.get('exclusion').value,
        "copay": this.homeInsuranceForm.get('copay').value,
        "planName": this.homeInsuranceForm.get('planeName').value,
        "policyNumber": this.homeInsuranceForm.get('policyNum').value,
        "copayRupeesOrPercent": this.homeInsuranceForm.get('copayType').value,
        "tpaName": this.homeInsuranceForm.get('tpaName').value,
        "advisorName": this.homeInsuranceForm.get('advisorName').value,
        "serviceBranch": this.homeInsuranceForm.get('serviceBranch').value,
        "linkedBankAccount": this.homeInsuranceForm.get('bankAccount').value,
        "insurerName": this.homeInsuranceForm.get('insurerName').value,
        "policyInceptionDate": this.homeInsuranceForm.get('inceptionDate').value,
        "insuranceSubTypeId": this.inputData.insuranceSubTypeId,
        "planFeature":featureList,
        "addOns": [{
          "addOnId": this.homeInsuranceForm.get('additionalCovers').value,
          "addOnSumInsured": this.homeInsuranceForm.get('coversAmount').value
        }],
        insuredMembers: memberList,
        nominees: this.homeInsuranceForm.value.getNomineeName,
      }

      if (obj.nominees.length > 0) {
        obj.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index);
          }
        });
        obj.nominees = this.homeInsuranceForm.value.getNomineeName;
        obj.nominees.forEach(element => {
          element.insuredOrNominee = 2
        });
      } else {
        obj.nominees = [];
      }
      console.log(obj);



      if (this.dataForEdit) {
        this.customerService.editGeneralInsuranceData(obj).subscribe(
          data => {
            console.log(data);
            this.eventService.openSnackBar("Updated successfully!", 'dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: this.inputData.insuranceSubTypeId
            }
            this.close(insuranceData)
          }
        );
      } else {
        this.customerService.addGeneralInsurance(obj).subscribe(
          data => {
            console.log(data);
            this.eventService.openSnackBar("Added successfully!", 'dismiss');
            const insuranceData =
            {
              insuranceTypeId: this.inputData.insuranceTypeId,
              insuranceSubTypeId: this.inputData.insuranceSubTypeId
            }
            this.close(insuranceData)
          }
        );
      }
    }
  }

  close(data) {
    this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close', data });
  }
}
