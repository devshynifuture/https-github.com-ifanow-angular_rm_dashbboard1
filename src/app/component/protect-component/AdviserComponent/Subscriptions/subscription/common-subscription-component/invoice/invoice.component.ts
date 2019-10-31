import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from 'src/app/auth-service/authService';
import { EnumServiceService } from '../../enum-service.service';

export interface PeriodicElement {
  date: string;
  reference: string;
  paymentMode: string;
  amount: number
}

// export class TableStickyHeaderExample {
//   displayedColumns1 = ['position', 'name', 'weight', 'symbol'];
//   dataSource1 = ELEMENT_DATA1;
// }

// export interface PeriodicElement1 {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

const ELEMENT_DATA: PeriodicElement[] = [
  {date: '25/08/2019', reference: 'Hydrogen', paymentMode: 'cash', amount: 1000},
  {date: '25/08/2019', reference: 'Helium', paymentMode: 'nefty', amount:4000 },
  {date: '25/08/2019', reference: 'Lithium', paymentMode: 'fhfdh', amount: 400},
];
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     document: 'Scope of work',
//     plan: 'Starter plan',
//     date: '25/08/2019',
//     sdate: '25/08/2019',
//     cdate: '25/08/2019',
//     status: 'READY TO SEND'
//   },

// ];

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  auto: boolean;
  taxStatus: any;
  copyStoreData: any;
  serviceList: any;

  @Input() invoiceValue;

  dataSub: any;
  storeData;
  showRecord: any;
  clientInvoice: any;
  invData: any;
  showEdit: boolean;
  isamountValid: boolean;
  ischargeValid: boolean;
  istdsValid: boolean;
  ismodeValid: boolean;

  @Input() invoiceData;
  @Input() invoiceInSub;
  @Input() clientData;
  editPayment;
  @Output() valueChange = new EventEmitter();

  @Input() invoiceTab;
  rPayment;
  advisorId;
  editAdd1;
  editAdd2;
dataSource;
  displayedColumns: string[] =['date', 'reference', 'paymentMode', 'amount'];
  // dataSource = ELEMENT_DATA;
  feeCollectionMode: any;
  formObj: [{
  }];
  ELEMENT_DATA: {}[];

  constructor(public enumService:EnumServiceService,public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService, private auth: AuthService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getInvoiceData(data)
    );
    this.subInjectService.singleProfileData.subscribe(
      data => this.getRecordPayment(data)
    );
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log('this.invoiceSubscription', this.invoiceInSub);
    this.showRecord = false;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;

    console.log('invoiceValue+++++++++++', this.invoiceValue);
    if (this.invoiceValue == 'edit' || this.invoiceValue == 'EditInInvoice') {
      this.auto = true;
      this.showEdit = true;
      this.storeData =
        this.taxStatus = ['IGST(18%)'];

    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getServicesList() {
    const obj = {
      advisorId: this.advisorId
      // advisorId: 12345
    };
    this.subService.getServicesListForInvoice(obj).subscribe(
      data => this.getServicesListForInvoiceRes(data)
    );
  }

  getServicesListForInvoiceRes(data) {
    console.log('getServicesListForInvoiceRes', data);
    this.serviceList = data;
  }

  saveCode(codeValue) {
    console.log('codeValue', codeValue);
  }

  onclickChangeAdd1(editVlaue) {
    if (editVlaue == false) {
      this.editAdd1 = true;
    } else {
      this.editAdd1 = false;
    }
  }

  onclickChangeAdd2(editVlaue) {
    if (editVlaue == false) {
      this.editAdd2 = true;
    } else {
      this.editAdd2 = false;
    }
  }

  getRecordPayment(data) {
    console.log('payee data', data);
    this.rPayment = this.fb.group({
      amountReceive: [data.amountReceive, [Validators.required]],
      charges: [data.charges, [Validators.required]],
      tds: [data.tds, [Validators.required]],
      paymentDate: [data.paymentDate],
      paymentMode: [data.paymentMode, [Validators.required]],
      gstTreatment: [data.gstTreatment],
      notes: [data.notes]
    });

    this.getFormControl().amountReceive.maxLength = 10;
    this.getFormControl().charges.maxLength = 10;
    this.getFormControl().tds.maxLength = 10;
    this.getFormControl().paymentMode.maxLength = 10;
    this.getFormControl().notes.maxLength = 40;

  }

  getInvoiceData(data) {
    this.copyStoreData = data;
    this.storeData = data;
    this.auto = (this.storeData.auto == false);
    console.log(this.storeData);
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [data.clientName, [Validators.required]],
      billerAddress: [data.billerAddress, [Validators.required]],
      billingAddress: [data.billingAddress, [Validators.required]],
      invoiceNumber: [data.invoiceNumber, [Validators.required]],
      invoiceDate: [data.invoiceDate, [Validators.required]],
      finalAmount: [data.finalAmount, [Validators.required]],
      discount: [data.discount, [Validators.required]],
      footnote: [data.footnote, [Validators.required]],
      terms: [data.terms, [Validators.required]],
      taxStatus: ['IGST(18%)'],
      balanceDue: [(data == undefined) ? '' : data.balanceDue],
      serviceName: [(data == undefined) ? '' : data.serviceName],
      subTotal: [(data == undefined) ? '' : data.subTotal],
      igstTaxAmount: [data.igstTaxAmount],
      auto: [data.auto]
      // fromDate : [data.services[0].fromDate,[Validators.required]],

    });
    this.getFormControledit().clientName.maxLength = 10;
    this.getFormControledit().billerAddress.maxLength = 150;
    this.getFormControledit().billingAddress.maxLength = 150;
    this.getFormControledit().invoiceNumber.maxLength = 10;
    this.getFormControledit().footnote.maxLength = 100;
    this.getFormControledit().terms.maxLength = 100;
  }

  changeTaxStatus() {
    this.taxStatus = this.editPayment.value.taxStatus;
  }

  updateInvoice() {
    if (this.getFormControledit().id == undefined) {
      const service = [{
        serviceName: this.editPayment.value.serviceName
      }];
      const obj = {
        clientName: this.editPayment.value.clientName,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        invoiceNumber: this.editPayment.value.invoiceNumber,
        subTotal: this.editPayment.value.subTotal,
        total: this.editPayment.value.total,
        discount: this.editPayment.value.discount,
        finalAmount: this.editPayment.value.finalAmount,
        invoiceDate: this.editPayment.value.invoiceDate,
        DueDate: this.editPayment.value.DueDate,
        igst: (this.editPayment.value.tax == 'IGST(18%)') ? 18 : 18,
        cgst: (this.editPayment.value.tax == 'SGST(9%)|CGST(9%)') ? 9 : 9,
        footnote: this.editPayment.value.footnote,
        terms: this.editPayment.value.terms,
        services: service,
      };
      console.log('this.editPayment', obj);
      this.subService.addInvoice(obj).subscribe(
        data => this.addInvoiceRes(data)
      );
    } else {
      const service = [{
        serviceName: this.editPayment.value.serviceName
      }];
      const obj = {
        id: this.editPayment.value.id,
        clientName: this.editPayment.value.clientName,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        finalAmount: this.editPayment.value.finalAmount,
        invoiceNumber: this.editPayment.value.invoiceNumber,
        subTotal: this.editPayment.value.subTotal,
        total: this.editPayment.value.total,
        discount: this.editPayment.value.discount,
        invoiceDate: this.editPayment.value.invoiceDate,
        DueDate: this.editPayment.value.DueDate,
        igst: (this.editPayment.value.tax == 'IGST(18%)') ? 18 : 18,
        cgst: (this.editPayment.value.tax == 'SGST(9%)|CGST(9%)') ? 9 : 9,
        footnote: this.editPayment.value.footnote,
        terms: this.editPayment.value.terms,
        services: service,
      };
      console.log('this.editPayment', obj);
      this.subService.updateInvoiceInfo(obj).subscribe(
        data => this.updateInvoiceInfoRes(data)
      );
    }
  }

  updateInvoiceInfoRes(data) {
    console.log('updateInvoiceInfoRes', data);
  }

  addInvoiceRes(data) {
    console.log('addInvoiceRes', data);
  }

  getFormControledit() {
    return this.editPayment.controls;
  }

  getFormControl() {
    return this.rPayment.controls;
  }

  saveFormData(state) {
    if (this.rPayment.controls.amountReceive.invalid) {
      this.isamountValid = true;
      return;
    } else if (this.rPayment.controls.charges.invalid) {
      this.ischargeValid = true;
      return;
    } else if (this.rPayment.controls.tds.invalid) {
      this.istdsValid = true;
      return;
    } else if (this.rPayment.controls.paymentMode.invalid) {
      this.ismodeValid = true;
      return;
    } else {
      this.formObj = [{
        advisorId: this.advisorId,
        // advisorId: 12345,
        amountReceieve: this.rPayment.controls.amountReceive.value,
        chargeIfAny: this.rPayment.controls.charges.value,
        TDS: this.rPayment.controls.tds.value,
        paymentDate: this.rPayment.controls.paymentDate.value,
        paymentMode: this.rPayment.controls.paymentMode.value,
        gstTreatment: this.rPayment.controls.gstTreatment.value,
        notes: this.rPayment.controls.notes.value
      }];
      
  }
  const ELEMENT_DATA = this.formObj;
    this.dataSource = ELEMENT_DATA;
      console.log('form data', this.formObj);
   this.rPayment.reset();
    this.cancel();
  }

  recordPayment() {
    this.showRecord = true;
  }

  cancel() {
    this.showRecord = false;
  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  passInvoice(data, event) {
    console.log(data);
    this.storeData = data;
  }

  editInvoice() {
    this.showEdit = true;
  }

  closeEditInv() {
    if(this.invoiceValue=='EditInInvoice' || this.invoiceValue=='edit'){
      this.valueChange.emit(this.invoiceValue);
    }else{
      this.showEdit = false;

    }
  }

  Close(state) {
    if (this.showRecord == true) {
      this.showRecord = false;
    } else {
      (this.invoiceTab == 'invoiceUpperSlider') ? this.subInjectService.rightSliderData(state) : this.subInjectService.rightSideData(state);
      this.valueChange.emit(this.invoiceInSub);
    }

  }

  saveInvoice() {
    console.log(this.editPayment);
  }

}
