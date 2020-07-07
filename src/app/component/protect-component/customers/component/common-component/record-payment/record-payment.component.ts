import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-record-payment',
  templateUrl: './record-payment.component.html',
  styleUrls: ['./record-payment.component.scss']
})
export class RecordPaymentComponent implements OnInit {
  validatorType = ValidatorType;
  rPayment;
  dataSource: any;
  showPaymentRecive: boolean;
  feeCollectionMode: any;
  formObj: {
    advisorId: any;
    // advisorId: 12345,
    amountReceived: any; chargeIfAny: any; TDS: any; paymentDate: any; paymentMode: any; gstTreatment: any; notes: any;
  }[];
  advisorId: any;
  balDue: any;
  tdsAmt: any;
  showError = false;
  feeMode = [{ name: 'Cheque', selected: false, value: 1 }, { name: 'NEFT', selected: false, value: 2 },
  { name: 'Cash', selected: false, value: 3 }, { name: 'ECS mandate', selected: false, value: 4 }, {
    name: 'Bank transfer',
    selected: false,
    value: 5
  },
  { name: 'Debit card', selected: false, value: 6 }, { name: 'Credit card', selected: false, value: 7 }, {
    name: 'NACH mandate',
    selected: false,
    value: 8
  }];
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public subService: SubscriptionService, private fb: FormBuilder,
    public enumService: EnumServiceService, public AuthService: AuthService,
    public utils: UtilService) {
  }

  @Input() InvRecordData;
  @Input() padding;
  // @Input() selectedInvRecord;
  @Output() outputData = new EventEmitter<Object>();
  finalAmount:any;
  @Input() set selectedInvRecord(selectedInvRecord: any) {
    if(selectedInvRecord){
      this.finalAmount = selectedInvRecord.finalAmount
      console.log(selectedInvRecord, "selectedInvRecord");
      this.getRecordPayment(selectedInvRecord);
      this.rPayment.get('amountReceived').setValidators([Validators.max(selectedInvRecord.finalAmount)]);
      this.rPayment.get('amountReceived').setValue(selectedInvRecord.finalAmount);
      this.rPayment.get('tds').setValue("");
      this.rPayment.get('chargesIfAny').setValue("");
      this.rPayment.get('amountReceived').updateValueAndValidity();
    }
  }
  gstTreatment = [
    { name: 'Registered Business - Regular', value: 0 },
    { name: 'Registered Business - Composition', value: 1 },
    { name: 'Unregistered Business', value: 2 }
  ];

  ngOnInit() {
    console.log(this.padding);
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    if (this.feeCollectionMode.length == 0) {
      this.feeCollectionMode = this.feeMode;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.getRecordPayment(this.InvRecordData);
  }

  roundOff(data: number) {
    return UtilService.roundOffToNearest1(data);
  }

  getRecordPayment(data) {
    this.balDue = data.balanceDue;

    if (data.add == true) {
      data = '';
    }
    console.log('payee data', data);
    this.rPayment = this.fb.group({
      amountReceived: [(data == "") ? this.InvRecordData.balanceDue :data.amountReceived, [Validators.required, Validators.max(UtilService.roundOffToNearest1(this.balDue))]],
      chargesIfAny: [data.chargesIfAny],
      tds: [data.tds, [Validators.max(this.tdsAmt)]],
      paymentDate: [new Date(data.paymentDate), [Validators.required]],
      paymentMode: [(data.paymentMode) ? data.paymentMode : '', [Validators.required]],
      gstTreatment: [(data.gstTreatmentId == 1) ? 'Registered Business - Regular' : (data.gstTreatmentId == 2) ? 'Registered Business - Composition' : (data.gstTreatmentId == 3) ? 'Unregistered Business' : '', [Validators.required]],
      notes: [data.notes],
      id: [data.id],
      editFormData: [true]
    });

    this.getFormControl().amountReceived.maxLength = 10;
    this.getFormControl().chargesIfAny.maxLength = 10;
    this.getFormControl().tds.maxLength = 10;
    this.getFormControl().notes.maxLength = 60;
    this.getPayReceive(this.InvRecordData.id);

  }

  getFormControl() {
    return this.rPayment.controls;
  }

  getPayReceive(data) {
    const obj = {
      invoiceId: data
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
  }

  cancel(data) {
    this.outputData.emit(data);
    this.rPayment.reset();

    // this.showRecord = false;
    // const obj = {
    //   invoiceId: this.storeData.id
    // };
    // this.subService.getPaymentReceive(obj).subscribe(
    //   data => this.getPaymentReceivedRes(data)
    // );
  }

  onChange() {
    this.tdsAmt = this.balDue - this.rPayment.get('amountReceived').value;
    if (this.rPayment.get('tds').value > this.tdsAmt) {
      this.rPayment.get('tds').setErrors({ incorrect: true });

      // this.showError = true
    }

    // this.rPayment.get('tds').errors.max=this.tdsAmt
  }

  getPaymentReceivedRes(data) {
    this.dataSource = data;
    if (data == undefined) {
      this.showPaymentRecive = false;
    } else {
      this.showPaymentRecive = true;
    }
    if (data) {
      this.feeCollectionMode.forEach(o => {
        o.value = parseInt(o.value);
        this.dataSource.forEach(sub => {
          if (o.value == sub.paymentMode) {
            sub.paymentMode = o.name;
          }
        });
      });
    }
  }

  saveFormData() {
    if (this.rPayment.invalid) {
      for (const element in this.rPayment.controls) {
        console.log(element);
        if (this.rPayment.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.rPayment.controls[element].markAsTouched();
        }
      }
    } else {
      this.formObj = [{
        advisorId: this.advisorId,
        // advisorId: 12345,
        amountReceived: this.rPayment.controls.amountReceived.value,
        chargeIfAny: this.rPayment.controls.chargesIfAny.value,
        TDS: this.rPayment.controls.tds.value,
        paymentDate: this.rPayment.controls.paymentDate.value,
        paymentMode: this.rPayment.controls.paymentMode.value,
        gstTreatment: this.rPayment.controls.gstTreatment.value,
        notes: this.rPayment.controls.notes.value
      }];

    }
    const ELEMENT_DATA = this.formObj;
    this.dataSource = ELEMENT_DATA;
    this.feeCollectionMode.forEach(o => {
      if (o.name == this.dataSource[0].paymentMode) {
        this.dataSource[0].paymentMode = o.value;
      }
    });
    this.gstTreatment.forEach(o => {
      if (o.name == this.dataSource[0].gstTreatment) {
        this.dataSource[0].gstTreatment = o.value;
      }
    });
    this.dataSource[0].amountReceived = parseInt(this.dataSource[0].amountReceived);
    this.dataSource[0].chargeIfAny = parseInt(this.dataSource[0].chargeIfAny);
    this.dataSource[0].paymentMode = parseInt(this.dataSource[0].paymentMode);
    this.dataSource[0].gstTreatment = parseInt(this.dataSource[0].gstTreatment);
    this.dataSource[0].TDS = parseInt(this.dataSource[0].TDS);
    this.dataSource[0].paymentDate = this.dataSource[0].paymentDate.toISOString().slice(0, 10);
    if (this.InvRecordData.add != true) {
      const obj = {
        id: this.rPayment.controls.id.value,
        paymentMode: this.dataSource[0].paymentMode,
        amountReceived: this.dataSource[0].amountReceived,
        chargesIfAny: this.dataSource[0].chargeIfAny,
        notes: this.dataSource[0].notes,
        tds: this.dataSource[0].TDS,
        gstTreatmentId: this.dataSource[0].gstTreatment
      };
      this.subService.editPaymentReceive(obj).subscribe(
        data => this.getSubStagesRecordResponse(data)
      );
    } else {
      const obj = {
        invoiceId: this.InvRecordData.id,
        paymentMode: this.dataSource[0].paymentMode,
        amountReceived: this.dataSource[0].amountReceived,
        paymentDate: this.dataSource[0].paymentDate,
        tds: this.dataSource[0].TDS,
        notes: this.dataSource[0].notes,
        chargesIfAny: this.dataSource[0].chargeIfAny,
        advisorId: this.dataSource[0].advisorId,
        referenceNumber: this.InvRecordData.invoiceNumber,
        gstTreatmentId: this.dataSource[0].gstTreatment

      };
      this.subService.getSubscriptionCompleteStages(obj).subscribe(
        data => this.getSubStagesRecordResponse(data)
      );

    }

  }

  getSubStagesRecordResponse(data) {
    console.log('data', data);
    this.feeCollectionMode.forEach(o => {
      if (o.value == this.dataSource[0].paymentMode) {
        this.dataSource[0].paymentMode = o.name;
      }
    });
    const obj = {
      invoiceId: this.InvRecordData.id
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
    this.cancel(data);
  }

}
