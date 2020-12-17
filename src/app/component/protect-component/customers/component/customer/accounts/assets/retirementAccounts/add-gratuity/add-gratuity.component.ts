import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth-service/authService';
import { MAT_DATE_FORMATS, MatInput, MatDialog } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { LinkBankComponent } from 'src/app/common/link-bank/link-bank.component';
@Component({
  selector: 'app-add-gratuity',
  templateUrl: './add-gratuity.component.html',
  styleUrls: ['./add-gratuity.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddGratuityComponent implements OnInit {
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
  gratuity: any;
  ownerData: any;
  familyMemberId: any;
  showHide = false;
  isNoOfcompleteYrs = false;
  isAmountRecived = false;
  inputData: any;
  advisorId: any;
  ownerName: any;
  clientId: any;
  flag: any;
  maxDate: Date = new Date();
  nomineesListFM: any = [];
  callMethod: any;
  bankList: any = [];
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public event: EventService, public dialog: MatDialog, private enumService: EnumServiceService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Gratuity';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.bankList = this.enumService.getBank();
  }


  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
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

  selectOwner: any;
  disabledMember(value, type) {
    this.callMethod = {
      methodName: "disabledMember",
      ParamValue: value,
      disControl: type
    }

    setTimeout(() => {
      this.selectOwner = this.nomineesListFM.filter((m) => m.id == this.gratuity.value.getCoOwnerName[0].familyMemberId);
    }, 1000);
  }

  displayControler(con) {
    console.log('value selected', con);
    if (con.owner != null && con.owner) {
      this.gratuity.controls.getCoOwnerName = con.owner;
    }
    if (con.nominee != null && con.nominee) {
      this.gratuity.controls.getNomineeName = con.nominee;
    }
  }

  onChangeJointOwnership(data) {
    this.callMethod = {
      methodName: "onChangeJointOwnership",
      ParamValue: data
    }
  }

  /***owner***/

  get getCoOwner() {
    return this.gratuity.get('getCoOwnerName') as FormArray;
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
    if (this.gratuity.value.getCoOwnerName.length == 1) {
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
    return this.gratuity.get('getNomineeName') as FormArray;
  }

  removeNewNominee(item) {
    this.disabledMember(null, null);
    this.getNominee.removeAt(item);
    if (this.gratuity.value.getNomineeName.length == 1) {
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
  /***nominee***/
  // ===================owner-nominee directive=====================//
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    if (data) {
      this.showHide = true;
    }
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    this.gratuity = this.fb.group({
      getCoOwnerName: this.fb.array([this.fb.group({
        name: ['', [Validators.required]],
        share: [0, [Validators.required]],
        familyMemberId: 0,
        id: 0,
        isClient: 0
      })]),
      // ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      // noOfcompleteYrs: [(data == undefined) ? '' : data.yearsCompleted, [Validators.required]],
      amountRecived: [(data == undefined) ? '' : data.amountReceived, [Validators.required]],
      yearOfJoining: [(data == undefined) ? '' : new Date(data.yearOfJoining), [Validators.required]],
      employmentType: [(data == undefined) ? '' : data.employmentType, [Validators.required]],
      nameOfOrg: [(data == undefined) ? '' : data.organizationName,],
      yearOfReceipt: [(data == undefined) ? '' : data.yearOfReceipt,],
      resonOfRecipt: [(data == undefined) ? '' : data.reasonOfReceipt,],
      bankAcNo: [(data == undefined) ? '' : data.userBankMappingId,],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],

      // familyMemberId: [[(data == undefined) ? '' : data.familyMemberId],],
      getNomineeName: this.fb.array([this.fb.group({
        name: [''],
        sharePercentage: [0],
        familyMemberId: [0],
        id: [0]
      })])
    });
    // ==============owner-nominee Data ========================\\
    /***owner***/
    if (this.gratuity.value.getCoOwnerName.length == 1) {
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

    this.ownerData = { Fmember: this.nomineesListFM, controleData: this.gratuity }
    // ==============owner-nominee Data ========================\\ 
    // this.familyMemberId = this.gratuity.controls.familyMemberId.value
    // this.familyMemberId = this.familyMemberId[0]
    // this.gratuity.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.gratuity.controls;
  }
  saveEPF() {
    if (this.gratuity.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.gratuity.markAllAsTouched();
      return;
    } else {

      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        ownerList: this.gratuity.value.getCoOwnerName,
        familyMemberId: this.familyMemberId,
        // ownerName: (this.ownerName == undefined) ? this.gratuity.controls.ownerName.value : this.ownerName,
        // yearsCompleted: this.gratuity.controls.noOfcompleteYrs.value,
        amountReceived: this.gratuity.controls.amountRecived.value,
        yearOfJoining: this.datePipe.transform(this.gratuity.controls.yearOfJoining.value, 'yyyy-MM-dd'),
        employmentType: this.gratuity.controls.employmentType.value,
        organizationName: this.gratuity.controls.nameOfOrg.value,
        yearOfReceipt: this.gratuity.controls.yearOfReceipt.value,
        reasonOfReceipt: this.gratuity.controls.resonOfRecipt.value,
        familyMemberDob: this.datePipe.transform(this.selectOwner[0].dateOfBirth, 'dd/MM/yyyy'),
        bankAccountNumber: this.gratuity.controls.bankAcNo.value,
        userBankMappingId: this.gratuity.controls.bankAcNo.value,
        description: this.gratuity.controls.description.value,
        nomineeList: this.gratuity.value.getNomineeName,
        id: this.gratuity.controls.id.value
      }
      this.barButtonOptions.active = true;
      obj.nomineeList.forEach((element, index) => {
        if (element.name == '') {
          this.removeNewNominee(index);
        }
      });
      obj.nomineeList = this.gratuity.value.getNomineeName;

      let adviceObj = {
        // advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.gratuity.controls.id.value == undefined && this.flag != 'adviceGratuity') {
        this.custumService.addGratuity(obj).subscribe(
          data => this.addGratuityRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.event.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceGratuity') {
        this.custumService.getAdviceGratuity(adviceObj).subscribe(
          data => this.getAdviceGratuityRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.event.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        this.custumService.editGratuity(obj).subscribe(
          data => this.editGratuityRes(data), (error) => {
            this.barButtonOptions.active = false;
            this.event.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceGratuityRes(data) {
    this.barButtonOptions.active = false;
    this.event.openSnackBar('Gratuity added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })

  }
  addGratuityRes(data) {
    this.barButtonOptions.active = false;
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })
    this.event.openSnackBar('Added successfully!', 'Dismiss');
  }
  editGratuityRes(data) {
    this.barButtonOptions.active = false;
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })
    this.event.openSnackBar('Updated successfully!', 'Dismiss');

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
  //link bank
  openDialog(eventData): void {
    const dialogRef = this.dialog.open(LinkBankComponent, {
      width: '50%',
      data: { bankList: this.bankList, userInfo: true, ownerList: this.getCoOwner }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        this.bankList = this.enumService.getBank();
      }, 5000);
    })

  }
  //link bank
}
