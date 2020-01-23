import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-real-estate',
  templateUrl: './add-real-estate.component.html',
  styleUrls: ['./add-real-estate.component.scss']
})
export class AddRealEstateComponent implements OnInit {
  addrealEstateForm: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  advisorId: any;
  addOwner: boolean;
  showMoreData: boolean;
  showLessData: boolean;
  showArea: boolean;
  showNominee: boolean;
  estateDays: string[];
  estateMonths: string[];
  tenure: any;
  getDate: any;
  datePipe: any;
  getValue: any;
  year: any;
  month: any;
  days: any;
  purchasePeriod: any;
  family: any;
  _inputData: any;
  isTypeValid: boolean;
  isMvValid: boolean;
  clientId: any;
  dataId: any;
  nomineesListFM: any;
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
  constructor(public custumService: CustomerService, public subInjectService: SubscriptionInject, private fb: FormBuilder, public custmService: CustomerService, public eventService: EventService, public utils: UtilService) { }
  // set inputData(inputData) {
  //   this._inputData = inputData;
  //   this.getRealEstate(inputData);
  // }

  // get inputData() {
  //   return this._inputData;
  // }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getRealEstate(inputData);

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    // this.addOwner = false;
    this.showMoreData = false;
    this.showArea = false;
    this.showNominee = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getListFamilyMem();

    this.estateDays = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.estateMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
  lisNominee(value) {
    console.log(value)
    if (value != undefined) {
      this.nomineesListFM = Object.assign([], value.familyMembersList);
    }
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
    // this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
    //   return o.ownershipPer;
    // });
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
  getFormControl() {
    return this.addrealEstateForm.controls;
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value;
    this.selectedFamilyData = value
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
  getDateYMD() {
    this.year = new Date(this.addrealEstateForm.controls.year.value, this.addrealEstateForm.controls.month.value, this.addrealEstateForm.controls.days.value);
    this.purchasePeriod = this.year.toISOString().slice(0, 10);
  }
  get getNominee() {
    return this.addrealEstateForm.get('getNomineeName') as FormArray;
  }
  addNominee() {
    // this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
    //   return o.ownershipPer;
    // });
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
  // demo:boolean = true;
  // demoDraft(){
  //   if(this.demo){
  //     this.demo = false;
  //     console.log(this.demo,"call");
  //     setTimeout(() => {
  //     this.demo = true;

  //       console.log(this.autoIncrement, "this.autoIncrement 123" );
  //     }, 10000);
  //   }
  //   else{
  //     return;
  //   }
  // }

  removeNominee(item) {
    if (this.getNominee.value.length > 1) {
      this.getNominee.removeAt(item);
    }
    // this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
    //   return o.ownershipPer;
    // });
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
  get getCoOwner() {
    return this.addrealEstateForm.get('getCoOwnerName') as FormArray;
  }
  addNewCoOwner(data) {
    if (this.addOwner == data) {
      if (this.showErrorOwner == false) {
        this.getCoOwner.push(this.fb.group({
          ownerName: null, ownershipPerc: null,familyMemberId:null
        }));
      }
    } else {
      if (this.showErrorOwner == false) {
        this.addOwner = data;
        if (this.getCoOwner.value.length == 0) {
          this.getCoOwner.push(this.fb.group({
            ownerName: null, ownershipPerc: null,familyMemberId:null
          }));
        }
      }
    }
  }
  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
  }
  ownerList(value){
    console.log(value)
    this.familyMemberId=value.id
  }
  getCoOwnerDetails(item){
    console.log(item);
    // this.ownerDataName=this.getCoOwner.value[this.getCoOwner.value.length-1];
    // this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
    //   if(element.ownershipPerc==null){
    //     this.getCoOwner.setValue([
    //       { ownerName: element.ownerName, ownershipPerc:(element.ownershipPerc)?element.ownershipPerc:null, familyMemberId: (element.familyMemberId)?element.familyMemberId:item.id},
    //     ]);
    //   }
      
    // });

    // console.log(this.addrealEstateForm.value.getCoOwnerName[this.getCoOwner.value.length-1].setValue(item.id))
  }
  onChange(data) {
    if (data == 'owner') {
      this.nexNomineePer = 0;
      // this.nexNomineePer = _.sumBy(this.getCoOwner.value, function (o) {
      //   return o.ownershipPerc;
      // });
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
      // this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
      //   return o.ownershipPer;
      // });
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
    // if (data == undefined) {
    //   data ={};
    // }
    // this.familyMemberId = data.familyMemberId
    this.addOwner = false;
    this.addrealEstateForm = this.fb.group({
      ownerName: this.ownerName,
      getCoOwnerName: this.fb.array([this.fb.group({
        ownerName: null,
        ownershipPerc: null,
        familyMemberId:null
      })]),
      ownerPercent: [data.ownerPerc, [Validators.required]],
      familyMemberId:[this.familyMemberId,],
      type: [(data.typeId == undefined) ? '' : (data.typeId) + "", [Validators.required]],
      marketValue: [data.marketValue, [Validators.required]],
      year: [data.year],
      month: [data.month, [Validators.required]],
      days: [data.days, [Validators.required]],
      purchasePeriod:[data.purchasePeriod],
      purchaseValue: [data.purchaseValue, [Validators.required]],
      unit: [data.unitId, [Validators.required]],
      ratePerUnit: [data.ratePerUnit, [Validators.required]],
      stampDuty: [data.stampDutyCharge, [Validators.required]],
      registration: [data.registrationCharge],
      gst: [data.gstCharge],
      location: [data.location],
      description: [data.description],
      // nominee: [data.nominee],
      getNomineeName: this.fb.array([this.fb.group({
        name: null,
        ownershipPer: null,
      })])
    });
    if (data == "") {
      data = {};
    } else {
      if (data.realEstateOwners.length != 0) {
        // var ownerName = _.reject(data.realEstateOwners, function (n) {
        //   return n.owner == false;
        // });
        const ownerName = data.realEstateOwners.filter(element => element.owner != false)
        if (ownerName.length != 0) {
          this.addrealEstateForm.controls.ownerName.setValue(ownerName[0].ownerName);
          this.ownerName = ownerName[0].ownerName;
          this.addrealEstateForm.controls.ownerPercent.setValue(ownerName[0].ownershipPerc);
          // this.familyMemId = ownerName[0].familyMemberId
          this.id = ownerName[0].id;
        }
      }

      if (data.nominees.length != 0) {
        data.nominees.forEach(element => {
          this.addrealEstateForm.controls.getNomineeName.push(this.fb.group({
            id: element.id,
            name: [(element.name) ? (element.name) + "" : '', [Validators.required]],
            ownershipPer: [(element.sharePercentage + ""), Validators.required]
          }))
        })
        this.getNominee.removeAt(0);
        console.log(this.addrealEstateForm.controls.getNomineeName.value)
      }
      if (data.realEstateOwners.length != 0) {
        // const ownerName = _.reject(data.realEstateOwners, function (n) {
        //   return n.owner == true;
        // });
        const ownerName = data.realEstateOwners.filter(element => element.owner != true)
        ownerName.forEach(element => {
          this.addrealEstateForm.controls.getCoOwnerName.push(this.fb.group({
            id: element.id,
            ownerName: [(element.ownerName) + "", [Validators.required]],
            ownershipPerc: [(element.ownershipPerc + ""), Validators.required],
            familyMemberId:[element.familyMemberId],
          }))
        })
        this.getCoOwner.removeAt(0);
      }
      if (data.realEstateOwners.length != 0) {
        this.addOwner = true;
      }
      // this.ownerData = this.addrealEstateForm.controls;

    }

    this.ownerData = this.addrealEstateForm.controls;




  }
  saveFormData() {
    this.addrealEstateForm.controls.familyMemberId.setValue(this.familyMemberId)
    this.getValue = this.getDateYMD()
    console.log(this.getValue);
    if (this.addrealEstateForm.get('type').invalid) {
      this.addrealEstateForm.get('type').markAsTouched();
      return
    } else if (this.addrealEstateForm.get('ownerName').invalid) {
      this.addrealEstateForm.get('ownerName').markAsTouched();
      return;
    } else if (this.addrealEstateForm.get('marketValue').invalid) {
      this.addrealEstateForm.get('marketValue').markAsTouched();
      return

    } else if (this.addrealEstateForm.get('ownerPercent').invalid) {
      this.addrealEstateForm.get('ownerPercent').markAsTouched();
      return
    } else {

      const obj = {
        ownerName: this.ownerName,
        // familyMemeberId:this.familyMemberId,
        ownerPercent: this.addrealEstateForm.controls.ownerPercent.value,
        clientId: this.clientId,
        advisorId: this.advisorId,
        id: this._data == undefined ? 0 : this._data.id,
        typeId: this.addrealEstateForm.controls.type.value,
        marketValue: this.addrealEstateForm.controls.marketValue.value,
        purchasePeriod:(this.addrealEstateForm.controls.purchasePeriod.value)?this.addrealEstateForm.controls.purchasePeriod.value.toISOString().slice(0, 10):'',
        purchaseValue: this.addrealEstateForm.controls.purchaseValue.value,
        unitId: this.addrealEstateForm.controls.unit.value,
        ratePerUnit: this.addrealEstateForm.controls.ratePerUnit.value,
        stampDutyCharge: this.addrealEstateForm.controls.stampDuty.value,
        registrationCharge: this.addrealEstateForm.controls.registration.value,
        gstCharge: this.addrealEstateForm.controls.gst.value,
        location: this.addrealEstateForm.controls.location.value,
        description: this.addrealEstateForm.controls.description.value,
        // nominee: this.addrealEstateForm.controls.nominee.value,
        nominees: [],
        realEstateOwners: [],
      }
      this.addrealEstateForm.value.getNomineeName.forEach(element => {
        if (element.name) {
          let obj1 = {
            'id': element.id,
            'name': element.name,
            'familyMemberId': (element.familyMemberId) ? element.familyMemberId : null,
            'sharePercentage': parseInt(element.ownershipPer)
          }
          obj.nominees.push(obj1)
        } else {
          obj.nominees = [];
        }
      });
      this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
        if (element.ownerName) {
          let obj1 = {
            'id': element.id,
            'ownerName': element.ownerName,
            'familyMemberId': (element.familyMemberId) ? element.familyMemberId : null,
            'ownershipPerc': parseInt(element.ownershipPerc),
            'isOwner': false
          }
          obj.realEstateOwners.push(obj1)
        }
      });
      let obj1 = {
        'id': this.id,
        'ownerName': this.ownerName,
        'familyMemberId': this.familyMemberId,
        'ownershipPerc': parseInt(this.addrealEstateForm.controls.ownerPercent.value),
        'isOwner': true
      }
      obj.realEstateOwners.push(obj1)
      if (obj.id == undefined) {
        console.log(obj);
        this.custumService.addRealEstate(obj).subscribe(
          data => this.addRealEstateRes(data)
        );
      } else {

        console.log(obj);
        this.custumService.editRealEstate(obj).subscribe(
          data => this.editRealEstateRes(data)
        );
      }
    }
  }
  addRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
      this.eventService.openSnackBar('Real Estate added successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');

    }
  }
  editRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true })
      this.eventService.openSnackBar('Real edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');
    }
  }
}
