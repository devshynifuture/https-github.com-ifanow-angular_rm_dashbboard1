import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-add-real-estate',
  templateUrl: './add-real-estate.component.html',
  styleUrls: ['./add-real-estate.component.scss']
})
export class AddRealEstateComponent implements OnInit {
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
  addrealEstateForm: any;
  ownerData: any;
  selectedFamilyData: any;
  advisorId: any;
  addOwner: boolean;
  showMoreData: boolean;
  showLessData: boolean;
  showArea: boolean;
  showNominee: boolean;
  purchasePeriod: any;
  family: any;
  _inputData: any;
  isTypeValid: boolean;
  isMvValid: boolean;
  clientId: any;
  dataId: any;
  nomineesListFM: any =[];
  dataFM: any;
  familyList: any;
  nexNomineePer: any;
  showError = false;
  isOwnerPercent: boolean;
  showErrorCoOwner = false;
  familyMemId: any;
  _data: any;
  autoIncrement: number = 100;
  id: any;
  showErrorOwner = false;
  familyMemberId: any;
  ownerDataName: any;
  ownershipPerc: any;
  flag: any;
  ownerName: any;
  callMethod:any;
  adviceShowHeaderFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(public custumService: CustomerService, public subInjectService: SubscriptionInject, private fb: FormBuilder, public custmService: CustomerService, public eventService: EventService, public utils: UtilService) { }
  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getRealEstate(inputData);
  }

  @Input() popupHeaderText: string = 'Add Real estate';

  preventDefault(e) {
    e.preventDefault();
  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderFooter = false;
    } else {
      this.adviceShowHeaderFooter = true;
    }
    this.showMoreData = false;
    this.showArea = false;
    this.showNominee = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getListFamilyMem();
  }
  
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      let evens = this.dataFM.filter(deltData => deltData.userName != name)
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  onNomineeChange(value) {
    this.nexNomineePer = 0
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  getListFamilyMem() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.custmService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }
  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data)
    if (data != undefined) {
      this.family = data.familyMembersList
    }
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
      this.addrealEstateForm.controls.getCoOwnerName = con.owner;
    }
    if(con.nominee != null && con.nominee){
      this.addrealEstateForm.controls.getNomineeName = con.nominee;
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
    return this.addrealEstateForm.get('getCoOwnerName') as FormArray;
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
    if (this.addrealEstateForm.value.getCoOwnerName.length == 1) {
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
    return this.addrealEstateForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.getNominee.removeAt(item);
    if (this.addrealEstateForm.value.getNomineeName.length == 1) {
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
  getFormControl() {
    return this.addrealEstateForm.controls;
  }
  
  showMore() {
    this.showMoreData = true;
  }
  showLess() {
    this.showMoreData = false;
  }
  addArea() {
    this.showArea = true;
  }
  removeArea() {
    this.showArea = false;
  }
  
  addNominee() {
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += parseInt(element.ownershipPer)
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
    if (this.showError == false) {
      this.getNominee.push(this.fb.group({
        name: null, ownershipPer: null,
      }));
    }
  }
  removeNominee(item) {
    if (this.getNominee.value.length > 1) {
      this.getNominee.removeAt(item);
    }
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }

  }
  
  
  ownerList(value) {
    console.log(value)
    this.familyMemberId = value.id
  }
  getCoOwnerDetails(item) {
    console.log(item);
    // this.ownerDataName=this.getCoOwner.value[this.getCoOwner.value.length-1];
    // this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
    //   if(element.ownershipPerc==null){
    //     this.getCoOwner.setValue([
    //       { ownerName: item.userName, ownershipPerc:null, familyMemberId: item.id},
    //     ]);
    //   }

    // });
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
  }
  onChange(data) {
    if (data == 'owner') {
      this.nexNomineePer = 0;
      this.getCoOwner.value.forEach(element => {
        this.nexNomineePer += (element.ownershipPerc) ? parseInt(element.ownershipPerc) : null;
      });
      this.nexNomineePer = this.addrealEstateForm.controls.ownerPercent.value + this.nexNomineePer
      if (this.nexNomineePer > 100) {
        this.showErrorOwner = true;
        console.log('show error Percent cannot be more than 100%')
      } else {
        this.showErrorOwner = false
        this.showErrorCoOwner = false;
      }
    } else {
      this.nexNomineePer = 0;

      this.getNominee.value.forEach(element => {
        this.nexNomineePer += (element.ownershipPer) ? parseInt(element.ownershipPer) : null;
      });
      if (this.nexNomineePer > 100) {
        this.showError = true
        console.log('show error Percent cannot be more than 100%')
      } else {
        this.showError = false
      }
    }
  }
  getRealEstate(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    this.addOwner = false;
    this.addrealEstateForm = this.fb.group({
      // ownerName: [(!data) ? '' : this.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['',[Validators.required]],
        share: [0,[Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient:0
      })]),
      // ownerPercent: [data.ownerPerc, [Validators.required]],
      familyMemberId: [this.familyMemberId,],
      type: [(data.typeId == undefined) ? '' : (data.typeId) + "", [Validators.required]],
      marketValue: [data.marketValue, [Validators.required]],
      purchasePeriod: [(data.purchasePeriod == undefined) ? null : new Date(data.purchasePeriod)],
      purchaseValue: [data.purchaseValue,],
      unit: [String(data.unitId),],
      ratePerUnit: [data.ratePerUnit,],
      stampDuty: [data.stampDutyCharge,],
      registration: [data.registrationCharge,],
      gst: [data.gstCharge],
      location: [data.location],
      description: [data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id:[0]
      })])
    });
    if (data == "") {
      data = {};
    } else {
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != false)
          if (ownerName.length != 0) {
            this.addrealEstateForm.controls.ownerName.setValue(ownerName[0].ownerName);
            this.ownerName = ownerName[0].ownerName;
            this.addrealEstateForm.controls.ownerPercent.setValue(ownerName[0].ownershipPerc);
            // this.familyMemId = ownerName[0].familyMemberId
            this.id = ownerName[0].id;
          }
        }
      }

       // ==============owner-nominee Data ========================\\
  /***owner***/ 
    if(this.addrealEstateForm.value.getCoOwnerName.length == 1){
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

  this.ownerData = {Fmember: this.nomineesListFM, controleData:this.addrealEstateForm}
  // ==============owner-nominee Data ========================\\

      // if (data.nominees != undefined) {
      //   if (data.nominees.length != 0) {
      //     data.nominees.forEach(element => {
      //       this.addrealEstateForm.controls.getNomineeName.push(this.fb.group({
      //         id: element.id,
      //         name: [(element.name) ? (element.name) + "" : '', [Validators.required]],
      //         ownershipPer: [(element.sharePercentage + ""), Validators.required]
      //       }))
      //     })
      //     this.getNominee.removeAt(0);
      //     console.log(this.addrealEstateForm.controls.getNomineeName.value)
      //   }

      // }
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != true)
          ownerName.forEach(element => {
            this.addrealEstateForm.controls.getCoOwnerName.push(this.fb.group({
              id: element.id,
              ownerName: [(element.ownerName) + "", [Validators.required]],
              ownershipPerc: [(element.ownershipPerc + ""), Validators.required],
              familyMemberId: [element.familyMemberId],
            }))
          })
          this.getCoOwner.removeAt(0);
        }
      }
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          this.addOwner = true;
        }
      }
      // this.ownerData = this.addrealEstateForm.controls;

    }

    // this.ownerData = this.addrealEstateForm.controls;
  }
  saveFormData() {

    this.addrealEstateForm.controls.familyMemberId.setValue(this.familyMemberId)
    
    if (this.addrealEstateForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.addrealEstateForm.markAllAsTouched();
      return;
    }
    else {
      this.barButtonOptions.active = true;
      const obj = {
        // ownerName: this.ownerName,
        // familyMemeberId:this.familyMemberId,
        ownerList: this.addrealEstateForm.value.getCoOwnerName,
        // ownerPercent: this.addrealEstateForm.controls.ownerPercent.value,
        clientId: this.clientId,
        advisorId: this.advisorId,
        id: this._data == undefined ? 0 : this._data.id,
        typeId: this.addrealEstateForm.controls.type.value,
        marketValue: this.addrealEstateForm.controls.marketValue.value,
        purchasePeriod: (this.addrealEstateForm.controls.purchasePeriod.value) ? this.addrealEstateForm.controls.purchasePeriod.value.toISOString().slice(0, 10) : null,
        purchaseValue: this.addrealEstateForm.controls.purchaseValue.value,
        unitId: 1,
        ratePerUnit: this.addrealEstateForm.controls.ratePerUnit.value,
        stampDutyCharge: this.addrealEstateForm.controls.stampDuty.value,
        registrationCharge: this.addrealEstateForm.controls.registration.value,
        gstCharge: this.addrealEstateForm.controls.gst.value,
        location: this.addrealEstateForm.controls.location.value,
        description: this.addrealEstateForm.controls.description.value,
        nomineeList: this.addrealEstateForm.value.getNomineeName
      }

      obj.nomineeList.forEach((element, index) => {
        if(element.name == ''){
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList= this.addrealEstateForm.value.getNomineeName;
      // this.addrealEstateForm.value.getNomineeName.forEach(element => {
      //   if (element.name) {
      //     let obj1 = {
      //       'id': element.id,
      //       'name': element.name,
      //       'familyMemberId': (element.familyMemberId) ? element.familyMemberId : null,
      //       'sharePercentage': parseInt(element.ownershipPer)
      //     }
      //     obj.nominees.push(obj1)
      //   } else {
      //     obj.nominees = [];
      //   }
      // });
      // this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
      //   if (element.ownerName) {
      //     let obj1 = {
      //       'id': element.id,
      //       'ownerName': element.ownerName,
      //       'familyMemberId': (element.familyMemberId) ? element.familyMemberId : null,
      //       'ownershipPerc': parseInt(element.ownershipPerc),
      //       'isOwner': false
      //     }
      //     obj.realEstateOwners.push(obj1)
      //   }
      // });
      // let obj1 = {
      //   'id': this.id,
      //   'ownerName': this.ownerName,
      //   'familyMemberId': this.familyMemberId,
      //   'ownershipPerc': parseInt(this.addrealEstateForm.controls.ownerPercent.value),
      //   'isOwner': true
      // }
      // obj.realEstateOwners.push(obj1)
      if (obj.id == undefined && this.flag != 'adviceRealEstate') {
        console.log(obj);
        this.custumService.addRealEstate(obj).subscribe(
          data => this.addRealEstateRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceRealEstate') {
        let adviceObj = {
          // advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        this.custumService.getAdviceRealEstate(adviceObj).subscribe(
          data => this.getAdviceRealEstateRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else {
        console.log(obj);
        this.custumService.editRealEstate(obj).subscribe(
          data => this.editRealEstateRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceRealEstateRes(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar('Real estate added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
  }
  addRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
      this.eventService.openSnackBar('Added successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
    }
    this.barButtonOptions.active = false;

  }
  editRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
      this.eventService.openSnackBar('Updated successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
    this.barButtonOptions.active = false;
  }
}
