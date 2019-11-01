import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EnumServiceService} from '../../enum-service.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {INT_TYPE} from '@angular/compiler/src/output/output_ast';

export interface PeriodicElement {
  date: string;
  reference: string;
  paymentMode: string;
  amount: number;
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
  {date: '25/08/2019', reference: 'Helium', paymentMode: 'nefty', amount: 4000},
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
  isClientName = false;
  isServiceName = false;
  isInvoiceNumber = false;
  isDueDate = false;
  isInvoiceDate = false;
  isTaxstatus = false;
  isPrice = false;

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
  displayedColumns: string[] = ['date', 'reference', 'paymentMode', 'amount'];
  // dataSource = ELEMENT_DATA;
  feeCollectionMode: any;
  formObj: [{}];
  ELEMENT_DATA: {}[];
  clientList: any;
  finAmount: any;
  feeCalc: boolean;
  isdateValid: boolean;
  subToatal: any;
  finAmountC: number;
  finAmountS: number;
  defaultVal: any;

  constructor(public enumService: EnumServiceService, public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService, private auth: AuthService, public dialog: MatDialog) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getInvoiceData(data)
    );
    this.subInjectService.singleProfileData.subscribe(
      data => this.getRecordPayment(data)
    );
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getClients();
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    this.getPayReceive();
    console.log('this.invoiceSubscription', this.invoiceInSub);
    this.showRecord = false;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;
    this.feeCalc = false;

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
  getPayReceive(){
     let obj = {
      invoiceId : this.storeData.id
    }
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getRes(data)
    );
  }
  getRes(data){
    
    console.log("data",data);
    this.dataSource=data;
    // this.feeCollectionMode.forEach(o => {
    //   if(o.value==this.dataSource.paymentMode){
    //    this.dataSource.paymentMode=o.name
    //   }
    //  });
     this.feeCollectionMode.forEach(o => {
      o.value = parseInt(o.value);
      this.dataSource.forEach(sub =>
        {
         if(o.value==sub.paymentMode){
           sub.paymentMode=o.name;
         }
        })
    });
  }
  selectClient(c,data){
    console.log(c)
    console.log('ssss',data)
    // let obj ={
    //   id : service.clientId,
    //   module : 2
    // }
    // this.subService.getInvoices(obj).subscribe(
    //   data => this.getInvoiceDataRes(data)
    // );
    console.log('getInvoiceDataRes',data)
    this.storeData = data;
    this.auto = false;
    this.storeData.auto == false;
    console.log(this.storeData);
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [data.clientName, [Validators.required]],
      billerAddress: [(data.billerAddress == undefined) ? '' : data.billerAddress, [Validators.required]],
      billerName: [(data.billerName == undefined) ? '' : data.billerName, [Validators.required]],
      advisorId: [(data.advisorId == undefined) ? '' : data.advisorId, [Validators.required]],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      invoiceNumber: [(data.invoiceNumber == undefined) ? this.defaultVal.invoiceNumber : data.invoiceNumber, [Validators.required]],
      invoiceDate: [(data.invoiceDate == undefined) ? '' : data.invoiceDate, [Validators.required]],
      finalAmount: [(data.finalAmount == undefined) ? 0 : parseInt(data.finalAmount), [Validators.required]],
      discount: [(parseInt(data.discount) == undefined) ? 0 : data.discount, [Validators.required]],
      dueDate: [(data.dueDate == undefined) ? '' : data.dueDate, [Validators.required]],
      footnote: [(data.footnote == undefined) ? '' : data.footnote, [Validators.required]],
      terms: [(data.terms == undefined) ? '' : data.terms, [Validators.required]],
      taxStatus: [(data.igst != undefined) ? 'IGST(18%)' : 'SGST(9%)|CGST(9%)'],
      balanceDue: [(data.balanceDue == undefined) ? '' : data.balanceDue],
      serviceName: [(data.serviceName == undefined) ? '' : data.serviceName],
      subTotal: [(data.subTotal == undefined) ? '' : data.subTotal],
      igstTaxAmount: [data.igstTaxAmount],
      auto: [(data.auto == undefined) ? '' : false],
      advisorBillerProfileId: [(data.advisorBillerProfileId == undefined) ? '' : data.advisorBillerProfileId],
      clientBillerId: [(data.clientBillerId == undefined) ? '' : data.clientBillerId],
      clientId: [(data.clientId == undefined) ? '' : data.clientId],
    });

    this.getFormControledit().clientName.maxLength = 10;
    this.getFormControledit().billerAddress.maxLength = 150;
    this.getFormControledit().billingAddress.maxLength = 150;
    this.getFormControledit().invoiceNumber.maxLength = 10;
    this.getFormControledit().footnote.maxLength = 100;
    this.getFormControledit().terms.maxLength = 100;

  }

  getInvoiceDataRes(data) {

  }

  getClients() {
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.getClientList(obj).subscribe(
      data => this.getClientListRes(data)
    );
  }

  getClientListRes(data) {
    console.log('getClientListRes', data.payees);
    this.clientList = data.payees;
    this.defaultVal = data;
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
      amountReceived: [data.amountReceived, [Validators.required]],
      charges: [data.charges, [Validators.required]],
      tds: [data.tds, [Validators.required]],
      paymentDate: [data.paymentDate],
      paymentMode: [data.paymentMode, [Validators.required]],
      gstTreatment: [data.gstTreatment],
      notes: [data.notes]
    });

    this.getFormControl().amountReceived.maxLength = 10;
    this.getFormControl().charges.maxLength = 10;
    this.getFormControl().tds.maxLength = 10;
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
      finalAmount: [(parseInt(data.finalAmount) == undefined) ? 0 : parseInt(data.finalAmount), [Validators.required]],
      discount: [(parseInt(data.discount) == undefined) ? 0 : data.discount, [Validators.required]],
      dueDate: [data.dueDate, [Validators.required]],
      footnote: [data.footnote, [Validators.required]],
      terms: [data.terms, [Validators.required]],
      taxStatus: ['IGST(18%)'],
      serviceName: [(data.services == undefined) ? '' : data.services[0].serviceName, [Validators.required]],
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

  changeTaxStatus(changeTaxStatus) {
    console.log('changeTaxStatus', changeTaxStatus);
    if (changeTaxStatus == 'SGST(9%)|CGST(9%)') {
      this.finAmountC = (9 / 100) * this.editPayment.controls.finalAmount.value;
      this.finAmountS = (9 / 100) * this.editPayment.controls.finalAmount.value;
      this.finAmount = this.finAmountC + this.finAmountS + parseInt(this.editPayment.controls.finalAmount.value);
    } else {
      this.finAmount = (18 / 100) * this.editPayment.controls.finalAmount.value + parseInt(this.editPayment.controls.finalAmount.value);
    }
    this.storeData.subToatal = this.editPayment.controls.finalAmount.value;
    this.taxStatus = changeTaxStatus;

  }

  updateInvoice() {
    if (this.editPayment.value.id == 0) {
      const service = [{
        serviceName: this.editPayment.value.serviceName
      }];
      const obj = {
        clientName: this.editPayment.value.clientName,
        advisorBillerProfileId: this.editPayment.value.advisorBillerProfileId,
        billerName: this.editPayment.value.billerName,
        advisorId: this.editPayment.value.advisorId,
        clientBillerId: this.editPayment.value.clientBillerId,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        invoiceNumber: this.editPayment.value.invoiceNumber,
        subTotal: this.editPayment.value.finalAmount,
        total: (parseInt(this.editPayment.value.finalAmount) - parseInt(this.editPayment.value.discount)) + parseInt(this.finAmount),
        discount: this.editPayment.value.discount,
        finalAmount: this.editPayment.value.finalAmount,
        invoiceDate: this.editPayment.value.invoiceDate,
        dueDate: this.editPayment.value.dueDate,
        igst: (this.editPayment.value.taxStatus == 'IGST(18%)') ? 18 : null,
        cgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        igstTaxAmount: (this.editPayment.value.taxStatus == 'IGST(18%)') ? this.finAmount : null,
        cgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountC : null,
        sgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountS : null,
        footnote: this.editPayment.value.footnote,
        terms: this.editPayment.value.terms,
        clientId: this.editPayment.value.clientId,
        services: service,
      };
      console.log('this.editPayment', obj);
      this.subService.addInvoice(obj).subscribe(
        data => this.addInvoiceRes(data)
      );
    } else {
      const service = [{
        serviceName: this.editPayment.value.serviceName,
        averageFees: this.storeData.services[0].averageFees,
        description: this.storeData.services[0].description,
        fromDate: this.storeData.services[0].fromDate,
        toDate: this.storeData.services[0].toDate,
      }];
      const obj = {
        id: this.editPayment.value.id,
        clientName: this.editPayment.value.clientName,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        finalAmount: this.editPayment.value.finalAmount,
        invoiceNumber: this.editPayment.value.invoiceNumber,
        subTotal: this.editPayment.value.finalAmount,
        total: (parseInt(this.editPayment.value.finalAmount) - parseInt(this.editPayment.value.discount)) + parseInt(this.finAmount),
        discount: this.editPayment.value.discount,
        invoiceDate: this.editPayment.value.invoiceDate,
        dueDate: this.editPayment.value.dueDate,
        igst: (this.editPayment.value.taxStatus == 'IGST(18%)') ? 18 : null,
        cgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        igstTaxAmount: (this.editPayment.value.taxStatus == 'IGST(18%)') ? this.finAmount : null,
        cgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountC : null,
        sgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountS : null,
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
    if (data == 1) {
      this.Close('close');
    }
  }

  addInvoiceRes(data) {
    console.log('addInvoiceRes', data);
    if (data == 1) {
      this.Close('close');
    }
  }

  getFormControledit() {
    return this.editPayment.controls;
  }

  getFormControl() {
    return this.rPayment.controls;
  }

  saveFormData(state) {
    if (this.rPayment.controls.amountReceived.invalid) {
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
    } else if (this.rPayment.controls.paymentDate.invalid) {
      this.isdateValid = true;
    } else {
      this.formObj = [{
        advisorId: this.advisorId,
        // advisorId: 12345,
        amountReceived: this.rPayment.controls.amountReceived.value,
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
    console.log(" this.storeData", this.storeData);
    this.feeCollectionMode.forEach(o => {
     if(o.name==this.dataSource[0].paymentMode){
      this.dataSource[0].paymentMode=o.value
     }
    });
    this.dataSource[0].amountReceived = parseInt(this.dataSource[0].amountReceived);
    this.dataSource[0].chargeIfAny = parseInt(this.dataSource[0].chargeIfAny);
    this.dataSource[0].paymentMode = parseInt(this.dataSource[0].paymentMode);
    this.dataSource[0].paymentDate = this.dataSource[0].paymentDate.toISOString().slice(0,10);

    let obj={
        "invoiceId":this.storeData.id,
        "paymentMode":this.dataSource[0].paymentMode,
        "amountReceived":this.dataSource[0].amountReceived,
        "paymentDate":this.dataSource[0].paymentDate,
        "notes":this.dataSource[0].notes,
        "chargesIfAny":this.dataSource[0].chargeIfAny,
        "advisorId":this.dataSource[0].advisorId,
        "referenceNumber":this.storeData.invoiceNumber
    }
    this.subService.getSubscriptionCompleteStages(obj).subscribe(
      data => this.getSubStagesRecordResponse(data)
    );
 
  }
  getSubStagesRecordResponse(data)
  {
    console.log("data",data);
    this.feeCollectionMode.forEach(o => {
      if(o.value==this.dataSource[0].paymentMode){
       this.dataSource[0].paymentMode=o.name
      }
     });
     let obj = {
      invoiceId : this.storeData.id
    }
     this.subService.getPaymentReceive(obj).subscribe(
      data => this.getRes(data)
    );
    this.cancel();
  }

  OpenFeeCalc() {
    this.feeCalc = true;
  }

  recordPayment() {
    this.showRecord = true;
    this.rPayment.reset();

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
    if (this.invoiceValue == 'EditInInvoice' || this.invoiceValue == 'edit') {
      this.valueChange.emit(this.invoiceValue);
    } else {
      this.showEdit = false;

    }
  }

  Close(state) {
    if (this.showRecord == true) {
      this.showRecord = false;
    } else if (this.feeCalc == true) {
      this.feeCalc = false;
    } else {
      (this.invoiceTab == 'invoiceUpperSlider') ? this.subInjectService.rightSliderData(state) : this.subInjectService.rightSideData(state);
      this.valueChange.emit(this.invoiceInSub);
    }

  }

  saveInvoice() {
    console.log(this.editPayment);
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      dataToShow: data,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  printPage() {
    window.print();
  }

}
