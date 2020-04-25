import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-add-motor-insurance-in-asset',
  templateUrl: './add-motor-insurance-in-asset.component.html',
  styleUrls: ['./add-motor-insurance-in-asset.component.scss']
})
export class AddMotorInsuranceInAssetComponent implements OnInit {
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
  motorInsuranceForm: any;
  displayList: any;
  nomineesList: any[] = [];
  policyList: any;
  addOns: any;
  dataForEdit: any;
  options: void;
  policyData: any;
  insuranceSubTypeId: any;
  insuranceTypeId: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private customerService: CustomerService, private eventService: EventService) { }
  validatorType = ValidatorType
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  
  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.inputData = data;
    this.policyList = data.displayList.policyTypes;
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
      this.motorInsuranceForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.motorInsuranceForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get addOnForm() {
    return this.motorInsuranceForm.get('addOnForm') as FormArray;
  }
  get getCoOwner() {
    return this.motorInsuranceForm.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]], share: [data ? data.share : ''], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
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
    if (this.motorInsuranceForm.value.getCoOwnerName.length == 1) {
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
    return this.motorInsuranceForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.motorInsuranceForm.value.getNomineeName.length == 1) {
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
      name: [data ? data.name : ''], sharePercentage: [data ? data.sumInsured : 0], familyMemberId: [data ? data.familyMemberId : 0], id: [data ? data.id : 0], isClient: [data ? data.isClient : 0]
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
    this.motorInsuranceForm = this.fb.group({
      // ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0,],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      name:[(this.dataForEdit ? this.dataForEdit.name : '')],
      // additionalCovers: [this.dataForEdit ? this.dataForEdit.addOns[0].addOnId : ''],
      policyNum: [(this.dataForEdit ? this.dataForEdit.policyNumber : ''), [Validators.required]],
      PlanType: [(this.dataForEdit ? this.dataForEdit.policyTypeId : ''), [Validators.required]],
      insurerName: [(this.dataForEdit ? this.dataForEdit.insurerName : ''), [Validators.required]],
      policyName: [(this.dataForEdit ? this.dataForEdit.policyName : ''), [Validators.required]],
      policyStartDate: [this.dataForEdit ? new Date(this.dataForEdit.policyStartDate) : '', [Validators.required]],
      policyExpiryDate: [this.dataForEdit ? new Date(this.dataForEdit.policyExpiryDate) : '', [Validators.required]],
      declaredValue: [(this.dataForEdit ? this.dataForEdit.declaredValue : ''), [Validators.required]],
      premium: [(this.dataForEdit ? this.dataForEdit.premiumAmount : ''), [Validators.required]],
      vehicleType: [this.dataForEdit ? this.dataForEdit.vehicleTypeId + '' : ''],
      registrationNumber: [(this.dataForEdit ? this.dataForEdit.vehicleRegNo : ''), [Validators.required]],
      registrationDate: [this.dataForEdit ? new Date(this.dataForEdit.vehicleRegistrationDate) : '', [Validators.required]],
      modelName: [(this.dataForEdit ? this.dataForEdit.vehicleModel : ''), [Validators.required]],
      engineNumber: [(this.dataForEdit ? this.dataForEdit.engineNo : '')],
      chassisNumber: [(this.dataForEdit ? this.dataForEdit.chasisNo : ''), [Validators.required]],
      fuelType: [this.dataForEdit ? this.dataForEdit.fuelTypeId + '' : ''],
      cgGvw: [(this.dataForEdit ? this.dataForEdit.cgGvw : ''), [Validators.required]],
      claimBonus: [(this.dataForEdit ? this.dataForEdit.noClaimBonus : ''), [Validators.required]],
      discount: [(this.dataForEdit ? this.dataForEdit.specialDiscount : ''), [Validators.required]],
      exclusion: [this.dataForEdit ? this.dataForEdit.exclusion :''],
      financierName: [this.dataForEdit ? this.dataForEdit.hypothetication :''],
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
      
      addOnForm: this.fb.array([this.fb.group({
        additionalCovers :['',[Validators.required]],
        addOnSumInsured:null
      })])
    })
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.motorInsuranceForm.value.getCoOwnerName.length == 1) {
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
      this.addOnForm.removeAt(0);
      this.dataForEdit.addOns.forEach(element => {
        this.addNewAddOns(element);
      });
    }

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.motorInsuranceForm }

    // this.finalCashFlowData = [];
    // ==============owner-nominee Data ========================\\ 
    // this.DOB = data.dateOfBirth
    // this.ownerData = this.motorInsuranceForm.controls;
    // this.familyMemberId = data.familyMemberId;
  }
  
  ngOnInit() {
  }



  selectPolicy(policy) {
    this.policyData = policy;
    this.insuranceTypeId = policy.insuranceTypeId;
    this.insuranceSubTypeId = policy.insuranceSubTypeId;
  }
  addNewAddOns(data) {
    this.addOnForm.push(this.fb.group({
      additionalCovers :[data ? data.addOnId : ''],
      addOnSumInsured:null
    }));
  }
  removeNewAddOns(item) {
    let finalFeatureList = this.motorInsuranceForm.get('addOnForm') as FormArray 
    if(finalFeatureList.length > 1){
    this.addOnForm.removeAt(item);

    }
  }
  /***owner***/

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
  findPolicyName(data) {
    const inpValue = this.motorInsuranceForm.get('policyName').value;
    const obj = {
      policyName: inpValue
    };
    this.customerService.getPolicyName(obj).subscribe(
      data => {
        console.log(data.policyDetails);
        this.options = data.policyDetails;
      }
    );
  }
  saveMotorInsurance() {
    let addOns = [];
    let addOnList = this.motorInsuranceForm.get('addOnForm') as FormArray
    addOnList.controls.forEach(element => {
      let obj =
      {
        addOnId : element.get('additionalCovers').value,
        addOnSumInsured:null
      }
      addOns.push(obj)
    })
    if (this.motorInsuranceForm.invalid) {
      this.motorInsuranceForm.markAllAsTouched();
    } else {
      const obj = {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "policyHolderId": this.motorInsuranceForm.value.getCoOwnerName[0].familyMemberId,
        "policyTypeId": this.motorInsuranceForm.get('PlanType').value,
        "policyNumber": this.motorInsuranceForm.get('policyNum').value,
        "insurerName": this.motorInsuranceForm.get('insurerName').value,
        "policyName": this.motorInsuranceForm.get('policyName').value,
        "policyStartDate": this.motorInsuranceForm.get('policyStartDate').value,
        "policyExpiryDate": this.motorInsuranceForm.get('policyExpiryDate').value,
        "declaredValue": this.motorInsuranceForm.get('declaredValue').value,
        "premiumAmount": this.motorInsuranceForm.get('premium').value,
        "vehicleTypeId": this.motorInsuranceForm.get('vehicleType').value,
        "vehicleRegNo": this.motorInsuranceForm.get('registrationNumber').value,
        "vehicleRegistrationDate": this.motorInsuranceForm.get('registrationDate').value,
        "vehicleModel": this.motorInsuranceForm.get('modelName').value,
        "engineNo": this.motorInsuranceForm.get('engineNumber').value,
        "chasisNo": this.motorInsuranceForm.get('chassisNumber').value,
        "fuelTypeId": this.motorInsuranceForm.get('fuelType').value,
        "noClaimBonus": this.motorInsuranceForm.get('claimBonus').value,
        "specialDiscount": this.motorInsuranceForm.get('discount').value,
        "exclusion": this.motorInsuranceForm.get('exclusion').value,
        "hypothetication": this.motorInsuranceForm.get('financierName').value,
        "advisorName": this.motorInsuranceForm.get('advisorName').value,
        "serviceBranch": this.motorInsuranceForm.get('serviceBranch').value,
        "linkedBankAccount": this.motorInsuranceForm.get('bankAccount').value,
        "insuranceSubTypeId": this.inputData.insuranceSubTypeId,
        "addOns":addOns,
        nominees: this.motorInsuranceForm.value.getNomineeName,
      }

      if (obj.nominees.length > 0) {
        obj.nominees.forEach((element, index) => {
          if (element.name == '') {
            this.removeNewNominee(index);
          }
        });
        obj.nominees = this.motorInsuranceForm.value.getNomineeName;
        obj.nominees.forEach(element => {
          if(element.sharePercentage){
            element.sumInsured = element.sharePercentage;
          }
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
