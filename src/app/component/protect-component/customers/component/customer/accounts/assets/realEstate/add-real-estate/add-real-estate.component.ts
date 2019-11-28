import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import * as _ from 'lodash';

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
  constructor(public custumService: CustomerService, public subInjectService: SubscriptionInject, private fb: FormBuilder, public custmService: CustomerService, public eventService: EventService) { }
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
    this.getRealEstate(this.data);

    this.estateDays = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.estateMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      var evens = _.reject(this.dataFM, function (n) {
        return n.userName == name;
      });
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  onNomineeChange(value) {
    this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
      return o.ownershipPer;
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
    this.family = data.familyMembersList
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getFormControl() {
    return this.addrealEstateForm.controls;
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
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
    this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
      return o.ownershipPer;
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
    this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
      return o.ownershipPer;
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
      if (this.showError == false) {
        this.getCoOwner.push(this.fb.group({
          ownerName: null, ownershipPerc: null,
        }));
      }
    } else {
      if (this.showError == false) {
        this.addOwner = data;
        if (this.getCoOwner.value.length == 0) {
          this.getCoOwner.push(this.fb.group({
            ownerName: null, ownershipPerc: null,
          }));
        }
      }
    }
  }
  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
  }
  onChange(data) {
    if (data == 'owner') {
      this.nexNomineePer = _.sumBy(this.getCoOwner.value, function (o) {
        return o.ownershipPerc;
      });
      this.nexNomineePer = this.addrealEstateForm.controls.ownerPercent.value + this.nexNomineePer
      if (this.nexNomineePer > 100) {
        this.showError = true;
        console.log('show error Percent cannot be more than 100%')
      } else {
        this.showError = false
        this.showErrorCoOwner = false;
      }
    } else {
      this.nexNomineePer = _.sumBy(this.getNominee.value, function (o) {
        return o.ownershipPer;
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
    this.addOwner = false;
    this.addrealEstateForm = this.fb.group({
      ownerName: this.ownerName,
      getCoOwnerName: this.fb.array([this.fb.group({
        ownerName: null,
        ownershipPerc: null,
      })]),
      ownerPercent: [data.ownerPerc, [Validators.required]],
      type: [(data.typeId) + "", [Validators.required]],
      marketValue: [data.marketValue, [Validators.required]],
      year: [data.year],
      month: [data.month, [Validators.required]],
      days: [data.days, [Validators.required]],
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
        var ownerName = _.remove(data.realEstateOwners, function (n) {
          return n.owner == true;
        });
        if (ownerName.length != 0) {
          this.addrealEstateForm.controls.ownerName.setValue(ownerName[0].ownerName);
          this.ownerName = ownerName[0].ownerName;
          this.addrealEstateForm.controls.ownerPercent.setValue(ownerName[0].ownershipPerc);
          this.familyMemId = ownerName[0].familyMemberId
        }
      }

      if (data.realEstateNominees.length != 0) {
        data.realEstateNominees.forEach(element => {
          this.addrealEstateForm.controls.getNomineeName.push(this.fb.group({
            name: [(element.name) + "", [Validators.required]],
            ownershipPer: [(element.ownershipPer + ""), Validators.required]
          }))
        })
        this.getNominee.removeAt(0);
        console.log(this.addrealEstateForm.controls.getNomineeName.value)
      }
      if (data.realEstateOwners.length != 0) {
        data.realEstateOwners.forEach(element => {
          this.addrealEstateForm.controls.getCoOwnerName.push(this.fb.group({
            ownerName: [(element.ownerName) + "", [Validators.required]],
            ownershipPerc: [(element.ownershipPerc + ""), Validators.required]
          }))
        })
        this.getCoOwner.removeAt(0);
      }
      if (data.realEstateOwners.length != 0) {
        this.addOwner = true;
      }
    }

    this.ownerData = this.addrealEstateForm.controls;




  }
  saveFormData() {
    this.getValue = this.getDateYMD()
    console.log(this.getValue);
    if (this.addrealEstateForm.controls.type.invalid) {
      this.isTypeValid = true;
      return;
    } else if (this.addrealEstateForm.controls.marketValue.invalid) {
      this.isMvValid = true;
    } if (this.addrealEstateForm.controls.ownerPercent.invalid) {
      this.isOwnerPercent = true;
      return;
    } else {
      const obj = {
        ownerName: this.ownerName,
        ownerPercent: this.addrealEstateForm.controls.ownerPercent.value,
        clientId: this.clientId,
        advisorId: this.advisorId,
        id: this._inputData.id,
        typeId: this.addrealEstateForm.controls.type.value,
        marketValue: this.addrealEstateForm.controls.marketValue.value,
        purchasePeriod: this.purchasePeriod,
        purchaseValue: this.addrealEstateForm.controls.purchaseValue.value,
        unit: this.addrealEstateForm.controls.unit.value,
        ratePerUnit: this.addrealEstateForm.controls.ratePerUnit.value,
        stampDuty: this.addrealEstateForm.controls.stampDuty.value,
        registration: this.addrealEstateForm.controls.registration.value,
        gst: this.addrealEstateForm.controls.gst.value,
        location: this.addrealEstateForm.controls.location.value,
        description: this.addrealEstateForm.controls.description.value,
        // nominee: this.addrealEstateForm.controls.nominee.value,
        realEstateNominees: [],
        realEstateOwners: [],
      }
      this.addrealEstateForm.value.getNomineeName.forEach(element => {
        if (element) {
          let obj1 = {
            'name': element.name,
            'familyMemberId': element.familyMemberId,
            'ownershipPer': parseInt(element.ownershipPer)
          }
          obj.realEstateNominees.push(obj1)
        }
      });
      this.addrealEstateForm.value.getCoOwnerName.forEach(element => {
        if (element) {
          let obj1 = {
            'ownerName': element.ownerName,
            'familyMemberId': element.familyMemberId,
            'ownershipPerc': parseInt(element.ownershipPerc),
            'isOwner': false
          }
          obj.realEstateOwners.push(obj1)
        }
      });
      let obj1 = {
        'ownerName': this.ownerName,
        'familyMemberId': this.familyMemId,
        'ownershipPerc': parseInt(this.addrealEstateForm.controls.ownerPercent.value),
        'isOwner': true
      }
      obj.realEstateOwners.push(obj1)
      if (this._inputData.id == undefined) {
        console.log(obj);
        delete obj.id;
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
      this.subInjectService.changeNewRightSliderState({ state: 'close' })
      this.eventService.openSnackBar('Liabilities added successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');

    }
  }
  editRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close' })
      this.eventService.openSnackBar('Liabilities edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');
    }
  }
}
