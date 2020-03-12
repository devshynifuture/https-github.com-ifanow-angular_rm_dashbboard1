import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth-service/authService';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  nomineesListFM: any;
  flag: any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public event: EventService) { }

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
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
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
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : '';
    this.gratuity = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      noOfcompleteYrs: [(data == undefined) ? '' : data.yearsCompleted, [Validators.required]],
      amountRecived: [(data == undefined) ? '' : data.amountReceived, [Validators.required]],
      nameOfOrg: [(data == undefined) ? '' : data.organizationName,],
      yearOfReceipt: [(data == undefined) ? '' : data.yearOfReceipt,],
      resonOfRecipt: [(data == undefined) ? '' : data.reasonOfReceipt,],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber,],
      description: [(data == undefined) ? '' : data.description,],
      id: [(data == undefined) ? '' : data.id,],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId],]
    });
    this.ownerData = this.gratuity.controls;
    this.familyMemberId = this.gratuity.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    // this.epf.controls.maturityDate.setValue(new Date(data.maturityDate));
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
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.gratuity.controls.ownerName.value : this.ownerName,
        yearsCompleted: this.gratuity.controls.noOfcompleteYrs.value,
        amountReceived: this.gratuity.controls.amountRecived.value,
        organizationName: this.gratuity.controls.nameOfOrg.value,
        yearOfReceipt: this.gratuity.controls.yearOfReceipt.value,
        reasonOfReceipt: this.gratuity.controls.resonOfRecipt.value,
        bankAccountNumber: this.gratuity.controls.bankAcNo.value,
        description: this.gratuity.controls.description.value,
        id: this.gratuity.controls.id.value
      }
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.gratuity.controls.id.value == undefined && this.flag != 'adviceGratuity') {
        this.custumService.addGratuity(obj).subscribe(
          data => this.addGratuityRes(data), (error) => {
            this.event.showErrorMessage(error);
          }
        );
      } else if (this.flag == 'adviceGratuity') {
        this.custumService.getAdviceGratuity(adviceObj).subscribe(
          data => this.getAdviceGratuityRes(data), (error) => {
            this.event.showErrorMessage(error);
          }
        );
      } else {
        //edit call
        this.custumService.editGratuity(obj).subscribe(
          data => this.editGratuityRes(data), (error) => {
            this.event.showErrorMessage(error);
          }
        );
      }
    }
  }
  getAdviceGratuityRes(data) {
    this.event.openSnackBar('Gratuity added successfully!', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })

  }
  addGratuityRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })
    this.event.openSnackBar('Added successfully!', 'Dismiss');
  }
  editGratuityRes(data) {
    this.subInjectService.changeNewRightSliderState({ flag: 'addedGratuity', state: 'close', data, refreshRequired: true })
    this.event.openSnackBar('Updated successfully!', 'Dismiss');

  }
}
