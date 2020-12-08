import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatDialog, MatInput } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumServiceService } from '../../../../../../../../../services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'app-add-others-asset',
  templateUrl: './add-others-asset.component.html',
  styleUrls: ['./add-others-asset.component.scss']
})
export class AddOthersAssetComponent implements OnInit {

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
  maxDate: Date = new Date();
  validatorType = ValidatorType;
  othersAssetForm: any;
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
  nomineesListFM: any = [];
  dataFM: any;
  familyList: any;
  nexNomineePer: any;
  showError = false;
  isOwnerPercent: boolean;
  showErrorCoOwner = false;
  familyMemId: any;
  _data: any;
  autoIncrement = 100;
  id: any;
  showErrorOwner = false;
  familyMemberId: any;
  ownerDataName: any;
  ownershipPerc: any;
  flag: any;
  ownerName: any;
  callMethod: any;
  adviceShowHeaderFooter = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public custumService: CustomerService, public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private fb: FormBuilder, public custmService: CustomerService,
    public eventService: EventService, public utils: UtilService,
    public enumService: EnumServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getRealEstate(inputData);
  }

  @Input() popupHeaderText = 'Add Real estate';

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

    //link bank
    this.bankList = this.enumService.getBank();
    //link bank

    this.showMoreData = false;
    this.showArea = false;
    this.showNominee = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getListFamilyMem();
  }

  nomineesList() {
    this.dataFM = this.nomineesListFM;
    if (this.dataFM.length > 0) {
      const name = this.ownerName;
      const evens = this.dataFM.filter(deltData => deltData.userName != name);
      this.familyList = evens;
    }

    console.log('familyList', this.familyList);
  }

  onNomineeChange(value) {
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true;
      console.log('show error Percent cannot be more than 100%');
    } else {
      this.showError = false;
    }
  }

  getListFamilyMem() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.custmService.getListOfFamilyByClient(obj).subscribe(
      data => this.getListOfFamilyByClientRes(data)
    );
  }

  getListOfFamilyByClientRes(data) {
    console.log('family Memebers', data);
    if (data != undefined) {
      this.family = data.familyMembersList;
    }
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  // ===================owner-nominee directive=====================//
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  lisNominee(value) {
    this.ownerData.Fmember = value;
    this.nomineesListFM = Object.assign([], value);
  }

  disabledMember(value, type) {
    this.callMethod = {
      methodName: 'disabledMember',
      ParamValue: value,
      disControl: type
    };
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.othersAssetForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.othersAssetForm.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: 'onChangeJointOwnership',
      ParamValue: data
    };
  }

  /***owner***/

  get getCoOwner() {
    return this.othersAssetForm.get('getCoOwnerName') as FormArray;
  }

  addNewCoOwner(data) {
    this.getCoOwner.push(this.fb.group({
      name: [data ? data.name : '', [Validators.required]],
      share: [data ? data.share : '', [Validators.required]],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0]
    }));
    if (data) {
      setTimeout(() => {
        this.disabledMember(null, null);
      }, 1300);
    }

    if (this.getCoOwner.value.length > 1 && !data) {
      const share = 100 / this.getCoOwner.value.length;
      for (const e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }

  }

  removeCoOwner(item) {
    this.getCoOwner.removeAt(item);
    if (this.othersAssetForm.value.getCoOwnerName.length == 1) {
      this.getCoOwner.controls['0'].get('share').setValue('100');
    } else {
      const share = 100 / this.getCoOwner.value.length;
      for (const e in this.getCoOwner.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share) + 1);
        } else {
          this.getCoOwner.controls[e].get('share').setValue(Math.round(share));
        }
      }
    }
    this.disabledMember(null, null);
  }

  /***owner***/

  /***nominee***/

  get getNominee() {
    return this.othersAssetForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.othersAssetForm.value.getNomineeName.length == 1) {
      this.getNominee.controls['0'].get('sharePercentage').setValue('100');
    } else {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }
  }


  addNewNominee(data) {
    this.getNominee.push(this.fb.group({
      name: [data ? data.name : ''],
      sharePercentage: [data ? data.sharePercentage : 0],
      familyMemberId: [data ? data.familyMemberId : 0],
      id: [data ? data.id : 0],
      isClient: [data ? data.isClient : 0]
    }));
    if (!data || this.getNominee.value.length < 1) {
      for (const e in this.getNominee.controls) {
        this.getNominee.controls[e].get('sharePercentage').setValue(0);
      }
    }

    if (this.getNominee.value.length > 1 && !data) {
      const share = 100 / this.getNominee.value.length;
      for (const e in this.getNominee.controls) {
        if (!Number.isInteger(share) && e == '0') {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share) + 1);
        } else {
          this.getNominee.controls[e].get('sharePercentage').setValue(Math.round(share));
        }
      }
    }


  }

  /***nominee***/
  // ===================owner-nominee directive=====================//
  getFormControl() {
    return this.othersAssetForm.controls;
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
      this.nexNomineePer += parseInt(element.ownershipPer);
    });
    if (this.nexNomineePer > 100) {
      this.showError = true;
      console.log('show error Percent cannot be more than 100%');
    } else {
      this.showError = false;
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
      this.nexNomineePer += element.ownershipPer;
    });
    if (this.nexNomineePer > 100) {
      this.showError = true;
      console.log('show error Percent cannot be more than 100%');
    } else {
      this.showError = false;
    }

  }


  ownerList(value) {
    console.log(value);
    this.familyMemberId = value.id;
  }

  getCoOwnerDetails(item) {
    console.log(item);
    // this.ownerDataName=this.getCoOwner.value[this.getCoOwner.value.length-1];
    // this.othersAssetForm.value.getCoOwnerName.forEach(element => {
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
      this.nexNomineePer = this.othersAssetForm.controls.ownerPercent.value + this.nexNomineePer;
      if (this.nexNomineePer > 100) {
        this.showErrorOwner = true;
        console.log('show error Percent cannot be more than 100%');
      } else {
        this.showErrorOwner = false;
        this.showErrorCoOwner = false;
      }
    } else {
      this.nexNomineePer = 0;

      this.getNominee.value.forEach(element => {
        this.nexNomineePer += (element.ownershipPer) ? parseInt(element.ownershipPer) : null;
      });
      if (this.nexNomineePer > 100) {
        this.showError = true;
        console.log('show error Percent cannot be more than 100%');
      } else {
        this.showError = false;
      }
    }
  }

  getRealEstate(data) {
    this.flag = data;
    if (data) {
      this.showMoreData = true;
    }
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    this.addOwner = false;
    this.othersAssetForm = this.fb.group({
      // ownerName: [(!data) ? '' : this.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      assets: [data.assets, [Validators.required]],
      currentValueDate: [data.currentValueDate, [Validators.required]],
      currentValue: [data.currentValue, [Validators.required]],
      debt: [data.debt, [Validators.required]],
      equity: [data.equity, [Validators.required]],
      hasmaturity: [data.hasmaturity],
      maturityValue: [data.debt, [Validators.required]],
      maturityDate: [data.equity, [Validators.required]],
      recurringContro: [data.recurringContro],
      frequency: [data.equity, [Validators.required]],
      approxAmt: [data.equity, [Validators.required]],
      endDate: [data.equity, [Validators.required]],
      rate: [data.equity, [Validators.required]],
      linkedBankAccount: [!data ? '' : data.linkedBankAccount],
      purchasePeriod: [(data.purchasePeriod == undefined) ? null : new Date(data.purchasePeriod)],
      purchaseValue: [data.purchaseValue,],
      description: [data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      // ownerPercent: [data.ownerPerc, [Validators.required]],
      familyMemberId: [this.familyMemberId,],
      type: [(data.typeId == undefined) ? '' : (data.typeId) + '', [Validators.required]],
      unit: [String(data.unitId),],
      ratePerUnit: [data.ratePerUnit,],
      stampDuty: [data.stampDutyCharge,],
      registration: [data.registrationCharge,],
      gst: [data.gstCharge],
      location: [data.location],


    });
    if (data == '') {
      data = {};
    } else {
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != false);
          if (ownerName.length != 0) {
            this.othersAssetForm.controls.ownerName.setValue(ownerName[0].ownerName);
            this.ownerName = ownerName[0].ownerName;
            this.othersAssetForm.controls.ownerPercent.setValue(ownerName[0].ownershipPerc);
            // this.familyMemId = ownerName[0].familyMemberId
            this.id = ownerName[0].id;
          }
        }
      }

      // ==============owner-nominee Data ========================\\
      /***owner***/
      if (this.othersAssetForm.value.getCoOwnerName.length == 1) {
        this.getCoOwner.controls['0'].get('share').setValue('100');
      }

      if (data.ownerList && data.ownerList.length > 0) {
        this.getCoOwner.removeAt(0);
        data.ownerList.forEach(element => {
          this.addNewCoOwner(element);
        });
      }

      /***owner***/

      /***nominee***/
      if (data.nomineeList) {
        if (data.nomineeList.length > 0) {

          this.getNominee.removeAt(0);
          data.nomineeList.forEach(element => {
            this.addNewNominee(element);
          });
        }
      }
      /***nominee***/

      this.ownerData = { Fmember: this.nomineesListFM, controleData: this.othersAssetForm };
      // ==============owner-nominee Data ========================\\

      // if (data.nominees != undefined) {
      //   if (data.nominees.length != 0) {
      //     data.nominees.forEach(element => {
      //       this.othersAssetForm.controls.getNomineeName.push(this.fb.group({
      //         id: element.id,
      //         name: [(element.name) ? (element.name) + "" : '', [Validators.required]],
      //         ownershipPer: [(element.sharePercentage + ""), Validators.required]
      //       }))
      //     })
      //     this.getNominee.removeAt(0);
      //     console.log(this.othersAssetForm.controls.getNomineeName.value)
      //   }

      // }
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != true);
          ownerName.forEach(element => {
            this.othersAssetForm.controls.getCoOwnerName.push(this.fb.group({
              id: element.id,
              ownerName: [(element.ownerName) + '', [Validators.required]],
              ownershipPerc: [(element.ownershipPerc + ''), Validators.required],
              familyMemberId: [element.familyMemberId],
            }));
          });
          this.getCoOwner.removeAt(0);
        }
      }
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          this.addOwner = true;
        }
      }
      // this.ownerData = this.othersAssetForm.controls;

    }

    // this.ownerData = this.othersAssetForm.controls;
  }

  saveFormData() {

    this.othersAssetForm.controls.familyMemberId.setValue(this.familyMemberId);

    if (this.othersAssetForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.othersAssetForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      const obj = {
        // ownerName: this.ownerName,
        // familyMemeberId:this.familyMemberId,
        ownerList: this.othersAssetForm.value.getCoOwnerName,
        // ownerPercent: this.othersAssetForm.controls.ownerPercent.value,
        clientId: this.clientId,
        advisorId: this.advisorId,
        id: this._data == undefined ? 0 : this._data.id,
        typeId: this.othersAssetForm.controls.type.value,
        marketValue: this.othersAssetForm.controls.marketValue.value,
        purchasePeriod: (this.othersAssetForm.controls.purchasePeriod.value) ? this.othersAssetForm.controls.purchasePeriod.value.toISOString().slice(0, 10) : null,
        purchaseValue: this.othersAssetForm.controls.purchaseValue.value,
        unitId: 1,
        ratePerUnit: this.othersAssetForm.controls.ratePerUnit.value,
        stampDutyCharge: this.othersAssetForm.controls.stampDuty.value,
        registrationCharge: this.othersAssetForm.controls.registration.value,
        gstCharge: this.othersAssetForm.controls.gst.value,
        location: this.othersAssetForm.controls.location.value,
        description: this.othersAssetForm.controls.description.value,
        nomineeList: this.othersAssetForm.value.getNomineeName
      };

      obj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList = this.othersAssetForm.value.getNomineeName;
      if (obj.id == undefined && this.flag != 'adviceRealEstate') {
        console.log(obj);
        this.custumService.addRealEstate(obj).subscribe(
          data => this.addRealEstateRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceRealEstate') {
        const adviceObj = {
          // advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: 'manualAssetDescription'
        };
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
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  addRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true, data });
      this.eventService.openSnackBar('Added successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true, data });
    }
    this.barButtonOptions.active = false;

  }

  editRealEstateRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Updated successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
    this.barButtonOptions.active = false;
  }

  getBank() {
    if (this.enumService.getBank().length > 0) {
      this.bankList = this.enumService.getBank();
    }
    else {
      this.bankList = [];
    }
    console.log(this.bankList, "this.bankList2");
  }

  bankList: any = [];
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    });

  }

}
