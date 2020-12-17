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
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { EnumDataService } from 'src/app/services/enum-data.service';

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
  purchaseDate: any;
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
  private unSubcrip2: Subscription;
  constructor(public custumService: CustomerService, private enumDataService: EnumDataService, private datePipe: DatePipe, public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private fb: FormBuilder, public custmService: CustomerService,
    public eventService: EventService, public utils: UtilService,
    public enumService: EnumServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
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
    console.log(this.bankList, "this.bankList");

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

    // if (this.bankList.length <= 0) {
    //   let user
    //   this.family.forEach(f => {
    //     if(f.){

    //     }
    //   });
    //   this.enumDataService.getAccountList(this.clientData);
    // }
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
      advisorId: [this.advisorId, [Validators.required]],
      clientId: [this.clientId, [Validators.required]],
      // ownerName: [(!data) ? '' : this.ownerName, [Validators.required]],
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      assetName: [data.assetName, [Validators.required]],
      currentValueAsonDate: [new Date(data.currentValueAsonDate), [Validators.required]],
      currentValue: [data.currentValue, [Validators.required]],
      debtAssetAllocPerc: [data.debtAssetAllocPerc, [Validators.required]],
      equityAssetAllocPerc: [data.equityAssetAllocPerc, [Validators.required]],
      hasMaturity: [data.hasMaturity],
      maturityValue: [!data.maturityValue || data.maturityValue == 0 ? "" : data.maturityValue],
      maturityDate: [data.maturityDate ? new Date(data.maturityDate) : ''],
      hasRecurringContribution: [data.hasRecurringContribution],
      recurringContributionFrequency: [!data.recurringContributionFrequency || data.recurringContributionFrequency == 0 ? "" : data.recurringContributionFrequency],
      approxAmount: [!data.approxAmount || data.approxAmount == 0 ? "" : data.approxAmount],
      endDate: [data.endDate ? new Date(data.endDate) : ''],
      growthRate: [data.growthRate, [Validators.required]],
      userBankMappingId: [!data ? '' : data.userBankMappingId],
      purchaseDate: [(data.purchaseDate == undefined) ? null : new Date(data.purchaseDate)],
      purchaseAmt: [data.purchaseAmt,],
      description: [data.description],
      id: [data.id],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      // ownerPercent: [data.ownerPerc, [Validators.required]],

    });
    this.hasShow();
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

  hasShow() {
    setTimeout(() => {
      console.log(this.othersAssetForm.get('hasMaturity').value, "aaa", this.othersAssetForm.get('hasRecurringContribution').value);
      if (this.othersAssetForm.get('hasMaturity').value) {
        this.othersAssetForm.get('maturityValue').setValidators([Validators.required]);
        this.othersAssetForm.get('maturityValue').updateValueAndValidity();

        this.othersAssetForm.get('maturityDate').setValidators([Validators.required]);
        this.othersAssetForm.get('maturityDate').updateValueAndValidity();
      }
      else {
        this.othersAssetForm.get('maturityValue').setValidators(null);
        this.othersAssetForm.get('maturityValue').updateValueAndValidity();

        this.othersAssetForm.get('maturityDate').setValidators(null);
        this.othersAssetForm.get('maturityDate').updateValueAndValidity();
      }


      if (this.othersAssetForm.get('hasRecurringContribution').value) {
        this.othersAssetForm.get('recurringContributionFrequency').setValidators([Validators.required]);
        this.othersAssetForm.get('recurringContributionFrequency').updateValueAndValidity();

        this.othersAssetForm.get('approxAmount').setValidators([Validators.required]);
        this.othersAssetForm.get('approxAmount').updateValueAndValidity();

        this.othersAssetForm.get('endDate').setValidators([Validators.required]);
        this.othersAssetForm.get('endDate').updateValueAndValidity();

      }
      else {
        this.othersAssetForm.get('recurringContributionFrequency').setValidators(null);
        this.othersAssetForm.get('recurringContributionFrequency').updateValueAndValidity();
        this.othersAssetForm.get('approxAmount').setValidators(null);
        this.othersAssetForm.get('approxAmount').updateValueAndValidity();
        this.othersAssetForm.get('endDate').setValidators(null);
        this.othersAssetForm.get('endDate').updateValueAndValidity();

      }
    }, 500);

  }

  saveFormData() {
    if (this.othersAssetForm.invalid && !this.percentErr) {
      // this.inputs.find(input => !input.ngControl.valid).focus();
      this.othersAssetForm.markAllAsTouched();
      return;
    } else {
      if (!this.othersAssetForm.get('hasMaturity').value) {
        this.othersAssetForm.get('maturityValue').setValue("");
        this.othersAssetForm.get('maturityDate').setValue(null);
      }

      if (!this.othersAssetForm.get('hasRecurringContribution').value) {
        this.othersAssetForm.get('recurringContributionFrequency').setValue("");
        this.othersAssetForm.get('approxAmount').setValue(null);
        this.othersAssetForm.get('endDate').setValue(null);
      }
      this.barButtonOptions.active = true;
      let obj = this.othersAssetForm.value;
      obj.hasMaturity = obj.hasMaturity ? 1 : 0;
      obj.hasRecurringContribution = obj.hasRecurringContribution ? 1 : 0;
      obj.currentValueAsonDate = obj.currentValueAsonDate ? this.datePipe.transform(obj.currentValueAsonDate, 'yyyy-MM-dd') : null;
      obj.maturityDate = obj.maturityDate ? this.datePipe.transform(obj.maturityDate, 'yyyy-MM-dd') : null;
      obj.endDate = obj.endDate ? this.datePipe.transform(obj.endDate, 'yyyy-MM-dd') : null;
      obj.purchaseDate = obj.purchaseDate ? this.datePipe.transform(obj.purchaseDate, 'yyyy-MM-dd') : null;
      obj.currentValue = parseInt(obj.currentValue);
      obj.debtAssetAllocPerc = parseInt(obj.debtAssetAllocPerc);
      obj.equityAssetAllocPerc = parseInt(obj.equityAssetAllocPerc);
      obj.maturityValue = parseInt(obj.maturityValue);
      obj.growthRate = parseInt(obj.growthRate);

      obj.approxAmount = parseInt(obj.approxAmount);
      obj.purchaseAmt = obj.purchaseAmt ? parseInt(obj.purchaseAmt) : null;
      obj.recurringContributionFrequency = obj.recurringContributionFrequency ? parseInt(obj.recurringContributionFrequency) : null;
      obj.getNomineeName.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.getNomineeName = this.othersAssetForm.value.getNomineeName;
      obj['ownerList'] = this.othersAssetForm.value.getCoOwnerName;
      obj['nomineeList'] = this.othersAssetForm.value.getNomineeName;
      if (obj.id == undefined && this.flag != 'adviceRealEstate') {
        delete obj['id'];
        console.log(obj);
        this.custumService.addOthersAssets(obj).subscribe(
          data => this.addOthersAssetsRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
      else {
        console.log(obj);
        this.custumService.editOthersAssets(obj).subscribe(
          data => this.editOthersAssetsRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }
  percentErr: boolean = false;

  percentageErr() {
    if (this.othersAssetForm.value.equityAssetAllocPerc && this.othersAssetForm.value.debtAssetAllocPerc) {
      let sum = parseInt(this.othersAssetForm.value.equityAssetAllocPerc) + parseInt(this.othersAssetForm.value.debtAssetAllocPerc);
      if (sum != 100) {
        this.percentErr = true;
      }
      else {
        this.percentErr = false;
      }
    }
  }

  getAdviceRealEstateRes(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar('Real estate added successfully', 'OK');
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
  }

  addOthersAssetsRes(data) {
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

  editOthersAssetsRes(data) {
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
