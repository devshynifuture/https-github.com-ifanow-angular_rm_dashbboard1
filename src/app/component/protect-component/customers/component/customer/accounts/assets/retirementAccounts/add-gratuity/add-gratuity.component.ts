import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth-service/authService';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService } from 'src/app/services/util.service';

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
  gratuity: any;
  ownerData: any;
  familyMemberId: any;
  showHide = false;
  isNoOfcompleteYrs = false;
  isAmountRecived =false;
  inputData: any;
  advisorId: any;
  ownerName: any;
  clientId: any;

  constructor(private fb: FormBuilder, private custumService : CustomerService,public subInjectService: SubscriptionInject,private datePipe: DatePipe,public utils: UtilService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  // getDateYMD(){
  //   let now = moment();
  //   this.tenure =moment(this.recuringDeposit.controls.commencementDate.value).add(this.recuringDeposit.controls.tenure.value, 'months');
  //   this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
  //   return this.getDate;
  // }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.gratuity = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      noOfcompleteYrs: [(data == undefined) ? '' : data.yearsCompleted, [Validators.required]],
      amountRecived: [(data == undefined) ? '' : data.amountReceived, [Validators.required]],
      nameOfOrg: [(data == undefined) ? '' : data.organizationName, [Validators.required]],
      yearOfReceipt : [(data == undefined) ? '' : data.yearReceipt, [Validators.required]],
      resonOfRecipt: [(data == undefined) ? '' : data.reasonOfReceipt, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
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
    if (this.gratuity.get('noOfcompleteYrs').invalid) {
      this.gratuity.get('noOfcompleteYrs').markAsTouched();
      return;
    } else if (this.gratuity.get('amountRecived').invalid) {
      this.gratuity.get('amountRecived').markAsTouched();
      return;
    } else {
  
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined)?this.gratuity.controls.ownerName.value:this.ownerName,
        yearsCompleted: this.gratuity.controls.noOfcompleteYrs.value,
        amountReceived: this.gratuity.controls.amountRecived.value,
        organizationName: this.gratuity.controls.nameOfOrg.value,
        yearOfReceipt:this.gratuity.controls.yearOfReceipt.value,
        yearReceipt: this.gratuity.controls.resonOfRecipt.value,
        bankAccountNumber: this.gratuity.controls.bankAcNo.value,
        description: this.gratuity.controls.description.value,
        id: this.gratuity.controls.id.value
      }
      if (this.gratuity.controls.id.value == undefined) {
        this.custumService.addGratuity(obj).subscribe(
          data => this.addGratuityRes(data)
        );
      } else {
        //edit call
        this.custumService.editGratuity(obj).subscribe(
          data => this.editGratuityRes(data)
        );
      }   
    }
  }
  addGratuityRes(data){
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({flag:'addedGratuity', state: 'close', data })
  }
  editGratuityRes(data){
    this.subInjectService.changeNewRightSliderState({flag:'addedGratuity', state: 'close', data })
  }
}
