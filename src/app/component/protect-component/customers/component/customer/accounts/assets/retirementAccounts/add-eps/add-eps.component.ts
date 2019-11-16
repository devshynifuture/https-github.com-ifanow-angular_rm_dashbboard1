import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-add-eps',
  templateUrl: './add-eps.component.html',
  styleUrls: ['./add-eps.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddEPSComponent implements OnInit {
  inputData: any;
  advisorId: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  eps: any;
  ownerData: any;
  isPensionAmount = false
  isCommencementdate = false;
  isPensionPayFreq = false;

  constructor(private fb: FormBuilder, private custumService : CustomerService,public subInjectService: SubscriptionInject,private datePipe: DatePipe) { }

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
    this.eps = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      commencementDate: [(data == undefined) ? '' : data.commencementDate, [Validators.required]],
      pensionAmount: [(data == undefined) ? '' : data.pensionAmount, [Validators.required]],
      pensionPayFreq: [(data == undefined) ? '' : (data.pensionPayoutFrequencyId)+"", [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.eps.controls;
    this.familyMemberId = this.eps.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    // this.epf.controls.maturityDate.setValue(new Date(data.maturityDate));
  }
  getFormControl(): any {
    return this.eps.controls;
  }
  
  saveEPF() {
    if (this.eps.controls.commencementDate.invalid) {
      this.isCommencementdate = true;
      return;
    } else if (this.eps.controls.pensionAmount.invalid) {
      this.isPensionAmount = true;
      return;
    }else if (this.eps.controls.pensionPayFreq.invalid) {
      this.isPensionPayFreq = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: 2978,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined)?this.eps.controls.ownerName.value:this.ownerName,
        commencementDate: this.eps.controls.commencementDate.value,
        pensionAmount: this.eps.controls.pensionAmount.value,
        pensionPayoutFrequencyId: this.eps.controls.pensionPayFreq.value,
        bankAccountNumber: this.eps.controls.bankAcNo.value,
        description: this.eps.controls.description.value,
        id: this.eps.controls.id.value
      }
      if (this.eps.controls.id.value == undefined) {
        this.custumService.addEPS(obj).subscribe(
          data => this.addEPSRes(data)
        );
      } else {
        //edit call
        this.custumService.editEPS(obj).subscribe(
          data => this.editEPSRes(data)
        );
      }   
    }
  }
  addEPSRes(data){
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
  editEPSRes(data){
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
}
