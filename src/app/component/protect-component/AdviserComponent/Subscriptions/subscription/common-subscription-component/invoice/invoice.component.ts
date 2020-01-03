import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EnumServiceService} from '../../../../../../../services/enum-service.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {EmailOnlyComponent} from '../email-only/email-only.component';


export interface PeriodicElement {
  date: string;
  reference: string;
  paymentMode: string;
  amount: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],

})

export class InvoiceComponent implements OnInit {
  highLight: boolean;

  [x: string]: any;

  gstTreatment = [
    {name: 'Registered Business - Regular', value: 0},
    {name: 'Registered Business - Composition', value: 1},
    {name: 'Unregistered Business', value: 2}
  ];
  numValidator = ValidatorType.NUMBER_ONLY;
  numKeyValidator = ValidatorType.NUMBER_KEY_ONLY;

  constructor(public utils: UtilService, public enumService: EnumServiceService, public subInjectService: SubscriptionInject,
              private fb: FormBuilder, private subService: SubscriptionService, private auth: AuthService, public dialog: MatDialog) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getInvoiceData(data)
    );
    this.subInjectService.singleProfileData.subscribe(
      data => this.getRecordPayment(data)
    );
  }

  get data() {
    return this.inputData;
  }

  discount: any;
  inputData: any;
  templateType: number;
  dataInvoices: any;

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
  isgstValid: boolean;
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
  // rPayment;
  advisorId;
  editAdd1;
  editAdd2;
  dataSource;
  displayedColumns: string[] = ['date', 'reference', 'paymentMode', 'amount', 'icons'];
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
  finalAmount: any;
  editFormData: boolean;
  paymentDate: string;
  rPayment;

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('InvoiceComponent inputData', this.inputData);
    this.getInvoiceData(data);
    this.getRecordPayment(data);
  }

  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.getClients();
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log('this.feeCollectionMode', this.feeCollectionMode);
    // this.getPayReceive(data);
    console.log('this.invoiceSubscription', this.invoiceInSub);
    console.log('###########', this.clientData);
    this.dataInvoices = this.clientData;
    this.showRecord = false;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;
    this.feeCalc = false;
    console.log('invoiceValue+++++++++++', this.dataInvoices);
    if (this.invoiceValue == 'edit' || this.invoiceValue == 'EditInInvoice') {
      this.editPayment.reset();
      this.auto = true;
      this.showEdit = true;
      this.finalAmount = 0;
      this.discount = 0;
      this.storeData =
        this.taxStatus = ['IGST(18%)'];
      this.editPayment.controls.serviceName.enable();

    }
  }

  // onDateInput(event){
  //   this.paymentDate += this.utils.dateFormat(event);
  // }


  keyPress(event: any) {
    console.log(event.target.value.length);
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  dontAllowTyping(event, maxLength: number) {
    // console.log(this.rPayment.value());
    if (event.target.value.length > maxLength) {
      event.preventDefault();
    }
  }

  getPayReceive(data) {
    const obj = {
      invoiceId: data
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
  }

  getPaymentReceivedRes(data) {

    this.dataSource = data;
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

  selectClient(c, data) {
    console.log(c);
    console.log('ssss', data);

    console.log('getInvoiceDataRes', data);
    this.storeData = data;
    this.storeData.billerAddress = this.defaultVal.biller.billerAddress;
    this.auto = false;
    this.storeData.auto == false;
    console.log(this.storeData);
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [(data.clientName == undefined) ? '' : data.clientName, [Validators.required]],
      billerName: [(data.billerName == undefined) ? '' : data.billerName, [Validators.required]],
      advisorId: [(data.advisorId == undefined) ? '' : data.advisorId, [Validators.required]],
      billerAddress: [this.defaultVal.biller.billerAddress],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      finalAmount: [(parseInt(data.finalAmount) == undefined) ? '' : parseInt(data.finalAmount), [Validators.required]],
      discount: [(data.discount == undefined) ? '' : data.discount, [Validators.required]],
      invoiceNumber: [(data.invoiceNumber == undefined) ? this.defaultVal.invoiceNumber : data.invoiceNumber, [Validators.required]],
      invoiceDate: [(data.invoiceDate == undefined) ? new Date() : new Date(data.invoiceDate), [Validators.required]],
      taxStatus: [(data.igst != undefined) ? 'IGST(18%)' : 'SGST(9%)|CGST(9%)'],
      balanceDue: [(data.balanceDue == undefined) ? '' : data.balanceDue],
      serviceName: [(data.services == undefined) ? '' : data.services[0].serviceName, [Validators.required]],
      subTotal: [(data.subTotal == undefined) ? '' : data.subTotal],
      footnote: [(data.footnote == undefined) ? '' : data.footnote, [Validators.required]],
      terms: [(data.terms == undefined) ? '' : data.terms, [Validators.required]],
      igstTaxAmount: [data.igstTaxAmount],
      auto: [(data.auto == undefined) ? '' : data.auto],
      advisorBillerProfileId: [(data.advisorBillerProfileId == undefined) ? '' : data.advisorBillerProfileId],
      clientBillerId: [(data.clientBillerId == undefined) ? '' : data.clientBillerId],
      clientId: [(data.clientId == undefined) ? '' : data.clientId],
    });

    this.getFormControledit().clientName.maxLength = 10;
    this.getFormControledit().billerAddress.maxLength = 150;
    this.getFormControledit().billingAddress.maxLength = 150;
    this.getFormControledit().invoiceNumber.maxLength = 10;
    this.getFormControledit().footnote.maxLength = 150;
    this.getFormControledit().terms.maxLength = 150;
    if (data.auto == true) {
      this.editPayment.controls.serviceName.disable();
    }
    this.finalAmount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.finalAmount.value;
    this.discount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.discount.value;
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
    this.editPayment.controls.billerAddress.setValue(data.biller.billerAddress);
    this.editPayment.controls.footnote.setValue(data.biller.footnote);
    this.editPayment.controls.terms.setValue(data.biller.terms);
    this.editPayment.controls.invoiceNumber.setValue(data.invoiceNumber);
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
      amountReceived: [data.amountReceived, [Validators.required, Validators.min(0), Validators.max(10)]],
      chargesIfAny: [data.chargesIfAny, [Validators.required]],
      tds: [data.tds, [Validators.required]],
      paymentDate: [new Date(data.paymentDate), [Validators.required]],
      paymentMode: [data.paymentMode, [Validators.required]],
      gstTreatment: [(data.gstTreatmentId == 1) ? 'Registered Business - Regular' : (data.gstTreatmentId == 2) ? 'Registered Business - Composition' : 'Unregistered Business', [Validators.required]],
      notes: [data.notes],
      id: [data.id],
      editFormData: [true]
    });

    this.getFormControl().amountReceived.maxLength = 10;
    this.getFormControl().chargesIfAny.maxLength = 10;
    this.getFormControl().tds.maxLength = 10;
    this.getFormControl().notes.maxLength = 40;
    this.getPayReceive(data.id);

  }

  getInvoiceData(data) {
    this.copyStoreData = data;
    this.storeData = data;
    this.auto = this.storeData.auto;
    console.log(this.storeData);
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [data.clientName, [Validators.required]],
      billerAddress: [data.billerAddress, [Validators.required]],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      invoiceNumber: [data.invoiceNumber, [Validators.required]],
      invoiceDate: [new Date(data.invoiceDate), [Validators.required]],
      finalAmount: [(data.finalAmount == undefined) ? 0 : parseInt(data.finalAmount), [Validators.required]],
      discount: [(data.discount == undefined) ? 0 : data.discount, [Validators.required]],
      dueDate: [new Date(data.dueDate), [Validators.required]],
      footnote: [data.footnote, [Validators.required]],
      terms: [data.terms, [Validators.required]],
      taxStatus: ['IGST(18%)'],
      serviceName: [(data.services == undefined) ? '0' : (data.services.length == 0) ? '0' : data.services[0].serviceName, [Validators.required]],
      subTotal: [(data == undefined) ? '' : data.subTotal],
      igstTaxAmount: [data.igstTaxAmount],
      auto: [data.auto]
      // fromDate : [data.services[0].fromDate,[Validators.required]],

    });
    this.getFormControledit().clientName.maxLength = 10;
    this.getFormControledit().billerAddress.maxLength = 150;
    this.getFormControledit().billingAddress.maxLength = 150;
    this.getFormControledit().invoiceNumber.maxLength = 20;
    this.getFormControledit().footnote.maxLength = 100;
    this.getFormControledit().terms.maxLength = 150;
    this.finalAmount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.finalAmount.value;
    this.discount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.discount.value;
    this.auto = this.editPayment.controls.auto.value;
    if (data.auto == true) {
      this.editPayment.controls.serviceName.disable();
    }
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
        sgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
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
        auto: this.editPayment.value.auto,
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
        sgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
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

  saveFormData() {
    if (this.rPayment.controls.amountReceived.invalid) {
      this.isamountValid = true;
      return;
    } else if (this.rPayment.controls.chargesIfAny.invalid) {
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
    }
    if (this.rPayment.controls.gstTreatment.invalid) {
      this.isgstValid = true;
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
    if (this.editFormData != undefined) {
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
        invoiceId: this.storeData.id,
        paymentMode: this.dataSource[0].paymentMode,
        amountReceived: this.dataSource[0].amountReceived,
        paymentDate: this.dataSource[0].paymentDate,
        tds: this.dataSource[0].TDS,
        notes: this.dataSource[0].notes,
        chargesIfAny: this.dataSource[0].chargeIfAny,
        advisorId: this.dataSource[0].advisorId,
        referenceNumber: this.storeData.invoiceNumber,
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
      invoiceId: this.storeData.id
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
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

  editForm(data) {
    this.editFormData = true;
    this.showRecord = true;
    this.getRecordPayment(data);
  }

  cancel() {
    this.showRecord = false;
    const obj = {
      invoiceId: this.storeData.id
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
    this.rPayment.reset();
  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  passInvoice(data,index,event) {
    console.log(data);
    this.storeData = data;
    const obj = {
      invoiceId: data.id
    };
    this.highLight=index;
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
  }

  editInvoice() {
    this.showEdit = true;
  }

  closeEditInv() {
    // this.editPayment.reset();
    if (this.invoiceValue == 'EditInInvoice' || this.invoiceValue == 'edit') {
      this.valueChange.emit(this.invoiceValue);
    } else {
      this.showEdit = false;

    }
  }

  Close(state) {
    if (this.showRecord == true) {
      this.showRecord = false;
      const obj = {
        invoiceId: this.storeData.id
      };
      this.subService.getPaymentReceive(obj).subscribe(
        data => this.getPaymentReceivedRes(data)
      );
      this.rPayment.reset();
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

  openSendEmail(input) {

    const data = {
      advisorId: 2828,
      clientData: this.storeData,
      templateType: 1, // 2 is for quotation
      documentList: [this.storeData],
      isInv: true
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    if (input == 'upper') {
      this.OpenEmailUpper(data, 'email');
    } else {
      this.OpenEmail(data, 'email');

    }
  }

  OpenEmail(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      componentName: EmailOnlyComponent,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  OpenEmailUpper(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }
    );
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

  printPage(templateRef) {
    console.log('this is template html::', templateRef);
    // window.print();
  }

}
