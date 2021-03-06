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
import { AssetValidationService } from '../../asset-validation.service';
import { CustomerOverviewService } from '../../../../customer-overview/customer-overview.service';

@Component({
  selector: 'app-add-sovereign-gold-bonds',
  templateUrl: './add-sovereign-gold-bonds.component.html',
  styleUrls: ['./add-sovereign-gold-bonds.component.scss']
})
export class AddSovereignGoldBondsComponent implements OnInit {
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
  goldBondForm: any;
  ownerData: any;
  selectedFamilyData: any;
  advisorId: any;
  addOwner: boolean;
  showMoreData: boolean = false;
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
  flag: any;

  showErrorOwner = false;
  familyMemberId: any;
  ownerDataName: any;
  ownershipPerc: any;
  bankList: any;
  ownerName: any;
  callMethod: any;
  minDate: Date = new Date();
  adviceShowHeaderFooter = true;
  @Input() popupHeaderText = 'Add Real estate';
  private unSubcripDemat: Subscription;

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  error: {};
  constructor(public custumService: CustomerService, private enumDataService: EnumDataService, private datePipe: DatePipe, public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private assetValidation: AssetValidationService,
    private fb: FormBuilder, public custmService: CustomerService,
    public eventService: EventService, public utils: UtilService,
    public enumService: EnumServiceService,
    private customerOverview: CustomerOverviewService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    // this.getIssuePrice();
    this.bondSeriesList = this.enumService.getbondSeriesList();
    this.getGoldBond(inputData);
  }

  bankDematList: any = [];
  ngOnInit() {
    //link bank
    this.bankList = this.enumService.getBank();
    //link bank
    this.unSubcripDemat = this.enumService.getDenatAC().subscribe((data: any) => {
      this.bankDematList = data;
    });
    this.bondSeriesList = this.enumService.getbondSeriesList();

  }

  ngOnDestroy() {
    // this.unSubcripBank.unsubscribe();
    this.unSubcripDemat.unsubscribe();
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
      this.goldBondForm.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.goldBondForm.controls.getNomineeName = con.nominee;
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
    return this.goldBondForm.get('getCoOwnerName') as FormArray;
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
    if (this.goldBondForm.value.getCoOwnerName.length == 1) {
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
    return this.goldBondForm.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.goldBondForm.value.getNomineeName.length == 1) {
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
    return this.goldBondForm.controls;
  }

  showMore() {
    this.showMoreData = true;
  }

  showLess() {
    this.showMoreData = false;
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
    this.ownerDataName = this.getCoOwner.value[this.getCoOwner.value.length - 1];
    // this.goldBondForm.value.getCoOwnerName.forEach(element => {
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
      this.nexNomineePer = this.goldBondForm.controls.ownerPercent.value + this.nexNomineePer;
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

  getGoldBond(data) {
    this.flag = data;
    if (data) {
      this.showMoreData = true;
    }
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    this.addOwner = false;
    this.goldBondForm = this.fb.group({
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
      bond: [data.bondNameAndSeries ? data.bondNameAndSeries : '', [Validators.required]],
      issueDate: [data.investmentOrIssueDate ? new Date(data.investmentOrIssueDate) : null, [Validators.required]],
      amountInvested: [data.investmentAmount, [Validators.required]],
      issuePrice: [data.issuePrice, [Validators.required]],
      units: [data.unitsInGram, [Validators.required]],
      rates: [data.interestRate ? data.interestRate : 2.5, [Validators.required]],
      tenure: [8, [Validators.required]],
      bondNumber: [data.bondNumber],
      userBankMappingId: [!data ? '' : data.linkedBankAccount],
      linkedBankAccount: [!data ? '' : data.linkedBankAccount],
      linkedDematAccount: [!data ? '' : data.linkedDematAccount],
      description: [data.description],
      id: [data.id],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })]),
      sovereignGoldTransactionList: this.fb.array([]),
      // ownerPercent: [data.ownerPerc, [Validators.required]],

    });

    if (data.bondNameAndSeries) {
      this.getSelectedBondPrice(data.bondNameAndSeries)
    }

    if (data == '') {
      data = {};
    } else {
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != false);
          if (ownerName.length != 0) {
            this.goldBondForm.controls.ownerName.setValue(ownerName[0].ownerName);
            this.ownerName = ownerName[0].ownerName;
            this.goldBondForm.controls.ownerPercent.setValue(ownerName[0].ownershipPerc);
            // this.familyMemId = ownerName[0].familyMemberId
            this.id = ownerName[0].id;
          }
        }
      }

      // ==============owner-nominee Data ========================\\
      /***owner***/
      if (this.goldBondForm.value.getCoOwnerName.length == 1) {
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

      /***nominee***/
      if (data.sovereignGoldTransactionList) {
        if (data.sovereignGoldTransactionList.length > 0) {
          data.sovereignGoldTransactionList.forEach(element => {
            this.addTransaction(element);
          });
        }
      }
      /***nominee***/

      this.ownerData = { Fmember: this.nomineesListFM, controleData: this.goldBondForm };
      // ==============owner-nominee Data ========================\\

      // if (data.nominees != undefined) {
      //   if (data.nominees.length != 0) {
      //     data.nominees.forEach(element => {
      //       this.goldBondForm.controls.getNomineeName.push(this.fb.group({
      //         id: element.id,
      //         name: [(element.name) ? (element.name) + "" : '', [Validators.required]],
      //         ownershipPer: [(element.sharePercentage + ""), Validators.required]
      //       }))
      //     })
      //     this.getNominee.removeAt(0);
      //     console.log(this.goldBondForm.controls.getNomineeName.value)
      //   }

      // }
      if (data.realEstateOwners != undefined) {
        if (data.realEstateOwners.length != 0) {
          const ownerName = data.realEstateOwners.filter(element => element.owner != true);
          ownerName.forEach(element => {
            this.goldBondForm.controls.getCoOwnerName.push(this.fb.group({
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
      // this.ownerData = this.goldBondForm.controls;

    }
  }

  checkOwner() {
    if (this.goldBondForm.value.getCoOwnerName[0].name == '') {
      this.eventService.openSnackBar("Please select owner");
    }
    // console.log(this.scipLevelHoldingForm.value.getCoOwnerName[0].name == '', "test owner");

  }

  bondSeriesList: any;
  // getIssuePrice() {
  //   this.custumService.getSovereignGoldBondIssuePrice().subscribe(
  //     data => {
  //       this.bondSeriesList = data;
  //     }, (error) => {
  //       this.barButtonOptions.active = false;
  //       this.eventService.showErrorMessage(error);
  //     }
  //   );
  // }

  // add transaction

  get getTransaction() {
    return this.goldBondForm.get('sovereignGoldTransactionList') as FormArray;
  }

  addTransaction(data) {
    this.getTransaction.push(this.fb.group({
      transactionDate: [!data ? '' : this.datePipe.transform(data.transactionDate, 'yyyy-MM-dd'), [Validators.required]],
      unit: [!data ? '' : data.unit, [Validators.required]],
      amount: [!data ? '' : data.amount, [Validators.required]],
      type: ['redemption', [Validators.required]],
      isActive: [!data ? 1 : data.isActive],
      id: [!data ? null : data.id]

    }));
  }


  removed: any = [];
  removeTransaction(item) {
    if (this.getTransaction.controls[item].value.id) {
      // this.transactionForm.controls.ppfTransactionList.controls['isActive'].setValue(0);
      this.getTransaction.controls[item].value.isActive = 0

      this.removed.push(this.getTransaction.controls[item]);
      console.log(this.removed, "removed 123");
      this.goldBondForm.controls.sovereignGoldTransactionList.removeAt(item);
      // this.outputEvent.emit({removed:this.removed, data:this.getTransaction})
      // this.transactionForm.controls.transactionFormList.push(this.removed);
    }
    else {
      if (this.getTransaction.controls[item].value.id) {
        let id = {
          sovereignGoldTransactionId: this.getTransaction.controls[item].value.id
        }
        this.custumService.deleteSovereignGoldBondTransaction(id).subscribe(
          data => {
            console.log('delete', data)
          }
        )
      }
      this.goldBondForm.controls.sovereignGoldTransactionList.removeAt(item)
      // this.addTransactionList = this.getTransaction.controls.length;
    }
    // this.getTransaction.removeAt(item);
  }

  // add transaction


  getSelectedBondPrice(data) {
    if (this.bondSeriesList) {
      let price = this.bondSeriesList.filter(x => x.seriesName == data);
      this.goldBondForm.get("issuePrice").setValue(price[0].retailPrice);
      this.goldBondForm.get("issueDate").setValue(new Date(price[0].issueDate));
    }
    this.calUnits();
  }

  calUnits() {
    if (this.goldBondForm.value.amountInvested && this.goldBondForm.value.issuePrice) {
      let unit = this.goldBondForm.value.amountInvested / this.goldBondForm.value.issuePrice;
      this.goldBondForm.get("units").setValue(unit.toFixed(2));
    }
  }
  validationOnUnitValue(value) {
    let sumOfUnit = 0;
    let finalMemberList = this.goldBondForm.get('sovereignGoldTransactionList') as FormArray;
    finalMemberList.controls.forEach(element => {
      sumOfUnit += parseInt(element.get('unit').value ? element.get('unit').value : 0);
    });
    if (this.goldBondForm.value.units) {
      if (sumOfUnit > parseInt(this.goldBondForm.value.units)) {
        this.error = 'Unit cannot be greater than alloted units'
      } else {
        this.error = null;
      }
    }

    console.log(sumOfUnit)
  }
  saveFormData() {
    if (this.goldBondForm.value.sovereignGoldTransactionList.length > 0) {
      this.goldBondForm.value.sovereignGoldTransactionList.forEach(element => {
        element.transactionDate = this.datePipe.transform(element.transactionDate, 'yyyy-MM-dd');
      });
    }
    let bondObj = {
      "clientId": this.goldBondForm.value.clientId,
      "advisorId": this.goldBondForm.value.advisorId,
      "bondNameAndSeries": this.goldBondForm.value.bond,
      "investmentOrIssueDate": this.datePipe.transform(this.goldBondForm.value.issueDate, 'yyyy-MM-dd'),
      "issuePrice": this.goldBondForm.value.issuePrice,
      "investmentAmount": this.goldBondForm.value.amountInvested,
      "unitsInGram": this.goldBondForm.value.units,
      // "interestAmountYearly": (this.goldBondForm.value.amountInvested / 100) * this.goldBondForm.value.rates, //chetan said no needed in request
      // "interestHalfYearly": (this.goldBondForm.value.amountInvested / 100) * this.goldBondForm.value.rates / 2, //chetan said no needed in request
      "interestRate": this.goldBondForm.value.rates,
      "tenure": this.goldBondForm.value.tenure,
      "bondNumber": this.goldBondForm.value.bondNumber,
      "linkedBankAccount": this.goldBondForm.value.linkedBankAccount,
      "linkedDematAccount": this.goldBondForm.value.linkedDematAccount,
      "description": this.goldBondForm.value.description,
      "ownerList": this.goldBondForm.value.getCoOwnerNamebond,
      "sovereignGoldTransactionList": this.goldBondForm.value.sovereignGoldTransactionList,
      "nomineeList": this.goldBondForm.value.getNomineeName,
      "id": this.goldBondForm.value.id,
    }
    if (this.error) {
      this.goldBondForm.markAllAsTouched();
    } else if (this.goldBondForm.invalid) {
      // this.inputs.find(input => !input.ngControl.valid).focus();
      this.goldBondForm.markAllAsTouched();
      return;
    } else {
      this.barButtonOptions.active = true;
      bondObj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      this.removed.forEach(element => {
        bondObj.sovereignGoldTransactionList.push(element.value);
      });
      bondObj.nomineeList = this.goldBondForm.value.getNomineeName;
      bondObj['ownerList'] = this.goldBondForm.value.getCoOwnerName;
      bondObj['nomineeList'] = this.goldBondForm.value.getNomineeName;
      if (bondObj.id == undefined && this.flag != 'adviceRealEstate') {
        delete bondObj['id'];
        // console.log(obj);
        this.custumService.addSovereignGoldBond(bondObj).subscribe(
          data => this.addSovereignGoldBondRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
      else {
        console.log(bondObj);
        this.custumService.editSovereignGoldBond(bondObj).subscribe(
          data => this.editSovereignGoldBondRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }


  addSovereignGoldBondRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.assetValidation.addAssetCount({ type: 'Add', value: 'otherAsset' })
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true, data });
      this.eventService.openSnackBar('Added successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true, data });
    }
    this.barButtonOptions.active = false;
  }

  editSovereignGoldBondRes(data) {
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
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
