import {ValidatorType} from './../../../../../../../services/util.service';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EnumServiceService} from '../../../../../../../services/enum-service.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {UtilService} from 'src/app/services/util.service';
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

})

export class InvoiceComponent implements OnInit {
  highLight: boolean;
  maxDate = new Date();
  validatorType = ValidatorType;
  advisorBillerProfileId: any;
  sendRecordPaymentData: any;
  recordData: any;
  clientId: any;
  igstTaxAmount: any;
  cgstTaxAmount: any;
  sgstTaxAmount: any;
  showEditIn: boolean;
  service: { serviceName: any; averageFees: any; description: any; fromDate: any; toDate: any; }[];
  feeCalc: boolean;
  rpyment = true;
  showDateError: string;
  moreStatus: any;

  [x: string]: any;

  // invoiceTemplate
  gstTreatment = [
    {name: 'Registered Business - Regular', value: 0},
    {name: 'Registered Business - Composition', value: 1},
    {name: 'Unregistered Business', value: 2}
  ];

  @ViewChild('invoiceTemplate', {static: false}) invoiceTemplate: ElementRef;

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
  showErr = false
  isServiceName = false;
  isInvoiceNumber = false;
  isDueDate = false;
  isInvoiceDate = false;
  isTaxstatus = false;
  isPrice = false;

  @Input() invoiceData;
  @Input() invoiceInSub;
  @Input() clientData;
  @Input() invoiceDesign;
  @Input() upperData;
  editPayment;
  @Output() valueChange = new EventEmitter();
  @Output() cancelInvoiceSubscription = new EventEmitter();
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
  isdateValid: boolean;
  subToatal: any;
  finAmountC: number;
  finAmountS: number;
  defaultVal: any;
  finalAmount: any;
  editFormData: boolean;
  paymentDate: string;
  rPayment;
  showPaymentRecive = false;

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('InvoiceComponent inputData', this.inputData);
    this.getInvoiceData(data);
    this.getRecordPayment(data);
  }

  ngOnInit() {
    this.showPaymentRecive = false;
    this.advisorId = AuthService.getAdvisorId();
    this.getClients();
    this.showErr = false
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    console.log('this.feeCollectionMode', this.feeCollectionMode);
    // this.getPayReceive(data);
    console.log('this.invoiceSubscription', this.invoiceInSub);
    console.log('###########', this.clientData);
    console.log('@@@@@@@@', this.upperData);
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
      // this.storeData =
      this.taxStatus = ['IGST(18%)'];
      this.editPayment.controls.serviceName.enable();

    }
  }

  keyPress(event: any) {
    console.log(event.target.value.length);
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  addStatus(value,status){
    let obj = {
      id:value.id,
      status:status.value
    }
    this.subService.getInvoiceStatus(obj).subscribe(
      data => this.getInvoiceStatusRes(data)
    );
  }
  getInvoiceStatusRes(data){
    console.log('getInvoiceStatusRes',data)
    this.Close('close', true);
  }
  dontAllowTyping(event, maxLength: number) {
    if (event.target.value.length > maxLength) {
      event.preventDefault();
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  getCancelFlag(data) {
    this.showEdit = false;
  }

  getPayReceive(data) {
    const obj = {
      invoiceId: data
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
  }

  display(value) {
    console.log(value)
    this.cancel(value);
  }

  getPaymentReceivedRes(data) {
    this.dataSource = data;
    if (data == undefined) {
      this.showPaymentRecive = false;
    } else {
      this.showPaymentRecive = true;
    }
    if (data) {
      if(this.feeCollectionMode!=undefined){
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
  }

  checkDateDiff(event) {
    let invoiceDate;
    let dueDate;

    if (this.editPayment.get('invoiceDate').value !== null && this.editPayment.get('dueDate').value !== null) {
      invoiceDate = new Date((this.editPayment.get('invoiceDate').value._d) ? this.editPayment.get('invoiceDate').value._d : this.editPayment.get('invoiceDate').value).getTime();
      dueDate = new Date((this.editPayment.get('dueDate').value._d) ? this.editPayment.get('dueDate').value._d : this.editPayment.get('dueDate').value).getTime();
      (invoiceDate == undefined && dueDate == undefined) ? ''
        : (dueDate <= invoiceDate)
        ? this.showDateError = "invoice date should be greater than due" :
        this.showDateError = undefined;
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
      more: [(data.advisorId == undefined) ? '' : data.more, [Validators.required]],
      billerAddress: [this.defaultVal.biller.billerAddress],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      finalAmount: [(parseInt(data.finalAmount) == undefined) ? '' : parseInt(data.finalAmount), [Validators.required]],
      discount: [(data.discount == undefined) ? '' : data.discount, [Validators.required]],
      invoiceNumber: [(data.invoiceNumber == undefined) ? this.defaultVal.invoiceNumber : data.invoiceNumber, [Validators.required]],
      invoiceDate: [(data.invoiceDate == undefined) ? new Date() : new Date(data.invoiceDate), [Validators.required]],
      taxStatus: [(data.igst != undefined) ? 'IGST(18%)' : 'SGST(9%)|CGST(9%)'],
      balanceDue: [(data.balanceDue == undefined) ? '' : data.balanceDue],
      serviceName: [(data.services == undefined) ? this.editPayment.controls.serviceName.value : data.services[0].serviceName, [Validators.required]],
      subTotal: [(data.subTotal == undefined) ? '' : data.subTotal],
      dueDate: [new Date(data.dueDate), [Validators.required]],
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
    console.log('finalAmount', this.finalAmount);
    this.taxStatus = this.editPayment.value.taxStatus;
  }

  getInvoiceDataRes(data) {

  }

  getClients() {
    const obj = {
      advisorId: this.advisorId,
      clientId :(this.storeData.id == undefined)? 0:this.storeData.id
    };
    this.subService.getClientList(obj).subscribe(
      data => this.getClientListRes(data)
    );
  }

  getClientListRes(data) {
    console.log('getClientListRes', data.payees);
    this.clientList = data.payees;
    this.defaultVal = data;
    this.advisorBillerProfileId = data.biller.id;
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
    this.recordData = data
    if(data!=""){
      this.getPayReceive(data.id);
    }
  }

  getInvoiceData(data) {
    console.log('@@@@@@@@', data);
    this.copyStoreData = data;
    this.storeData = data;
    if(data.status==5 || data.status==6){
      this.moreStatus=data.status;
    }else{
      this.moreStatus="";
    }
    if (this.storeData.balanceDue == 0) {
      this.rpyment = false
    }else {
      this.rpyment = true;
    }
    this.clientId = AuthService.getClientId();
    this.auto = this.storeData.auto;
    console.log(this.storeData);
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [data.clientName, [Validators.required]],
      billerAddress: [data.billerAddress, [Validators.required]],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      invoiceNumber: [data.invoiceNumber, [Validators.required]],
      invoiceDate: [new Date(data.invoiceDate), [Validators.required]],
      finalAmount: [(data.subTotal == undefined) ? 0 : parseInt(data.subTotal), [Validators.required]],
      discount: [(data.discount == undefined) ? 0 : data.discount, [Validators.required]],
      dueDate: [new Date(data.dueDate), [Validators.required]],
      footnote: [data.footnote, [Validators.required]],
      terms: [data.terms, [Validators.required]],
      taxStatus: [(data.igstTaxAmount == undefined) ? 'SGST(9%)|CGST(9%)' : 'IGST(18%)'],
      serviceName: [(data.services == undefined) ? '0' : (data.services.length == 0) ? '0' : data.services[0].serviceName, [Validators.required]],
      subTotal: [(data == undefined) ? '' : data.subTotal],
      igstTaxAmount: [data.igstTaxAmount],
      cgstTaxAmount: [data.cgstTaxAmount],
      sgstTaxAmount: [data.sgstTaxAmount],
      auto: [data.auto]
      // fromDate : [data.services[0].fromDate,[Validators.required]],

    });
    this.igstTaxAmount = data.igstTaxAmount
    this.cgstTaxAmount = data.cgstTaxAmount
    this.sgstTaxAmount = data.sgstTaxAmount
    this.taxStatus = this.editPayment.controls.taxStatus.value
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
    if (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') {
      this.finAmountC = this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount);
      this.finAmountC = this.finAmountC * 9 / 100;
      this.finAmountS = this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount);
      this.finAmountS = this.finAmountS * 9 / 100;
      this.finAmount = this.finAmountC + this.finAmountS;
    } else {
      this.finAmount = (this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount));
      this.finAmount = (this.finAmount) * 18 / 100;
    }
    this.storeData.subToatal = this.editPayment.controls.finalAmount.value;
    this.taxStatus = changeTaxStatus;
    console.log('finAmount', this.finAmount);
  }

  updateInvoice() {
    this.showErr = false
    if (this.editPayment.value.discount == "") {
      this.editPayment.value.discount = 0
    }
    this.changeTaxStatus(this.editPayment.value.taxStatus)
   
    if (this.editPayment.get('dueDate').invalid) {
      this.editPayment.get('dueDate').markAsTouched();
      return;
    } else if (this.editPayment.get('invoiceDate').invalid) {
      this.editPayment.get('invoiceDate').markAsTouched();
      return;
    } else if (this.editPayment.get('taxStatus').invalid) {
      this.editPayment.get('taxStatus').markAsTouched();
      return;
    } else if (isNaN(this.editPayment.controls.finalAmount.value)) {
      this.showErr = true
      return;
    } else {
      if (this.editPayment.value.id == 0 || this.editPayment.value.id == null) {
        const service = [{
          serviceName: this.editPayment.value.serviceName
        }];
        const obj = {
          clientName: this.editPayment.value.clientName,
          advisorBillerProfileId: (this.editPayment.value.advisorBillerProfileId == undefined) ? this.advisorBillerProfileId : this.editPayment.value.advisorBillerProfileId,
          billerName: this.editPayment.value.billerName,
          advisorId: this.advisorId,
          clientBillerId: this.editPayment.value.clientBillerId,
          billerAddress: this.editPayment.value.billerAddress,
          billingAddress: this.editPayment.value.billingAddress,
          invoiceNumber: this.editPayment.value.invoiceNumber,
          subTotal: this.editPayment.value.finalAmount,
          discount: this.editPayment.value.discount,
          finalAmount: (parseInt(this.editPayment.value.finalAmount) - parseInt(this.editPayment.value.discount)) + parseInt(this.finAmount),
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
          clientId: (this.upperData == undefined) ? this.clientId : this.upperData,
          services: service,
        };

        console.log('this.editPayment', obj);
        this.subService.addInvoice(obj).subscribe(
          data => this.addInvoiceRes(data)
        );
      } else {
        if (this.storeData.services == undefined) {
          this.service = [{
            serviceName: this.editPayment.value.serviceName,
            averageFees: '',
            description: '',
            fromDate: '',
            toDate: '',
          }];
        } else {
          this.service = [{
            serviceName: this.editPayment.value.serviceName,
            averageFees: this.storeData.services[0].averageFees,
            description: this.storeData.services[0].description,
            fromDate: this.storeData.services[0].fromDate,
            toDate: this.storeData.services[0].toDate,
          }];
        }
        const obj = {
          id: this.editPayment.value.id,
          clientName: this.editPayment.value.clientName,
          auto: this.editPayment.value.auto,
          billerAddress: this.editPayment.value.billerAddress,
          billingAddress: this.editPayment.value.billingAddress,
          // finalAmount: this.editPayment.value.finalAmount,
          invoiceNumber: this.editPayment.value.invoiceNumber,
          subTotal: this.editPayment.value.finalAmount,
          finalAmount: (parseInt(this.editPayment.value.finalAmount) - parseInt(this.editPayment.value.discount)) + parseInt(this.finAmount),
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
          services: this.service,
        };
        console.log('this.editPayment', obj);
        this.subService.updateInvoiceInfo(obj).subscribe(
          data => this.updateInvoiceInfoRes(data)
        );
      }
    }

  }

  updateInvoiceInfoRes(data) {
    console.log('updateInvoiceInfoRes', data);
    if (data == 1) {
      this.Close('close', true);
    }
  }

  getAddCancelFlag(data) {
    this.cancelInvoiceSubscription.emit(data)
  }

  addInvoiceRes(data) {
    console.log('addInvoiceRes', data);
    if (data == 1) {
      this.Close('close', true);
    }
  }

  getFormControledit() {
    return this.editPayment.controls;
  }

  getFormControl() {
    return this.rPayment.controls;
  }


  OpenFeeCalc() {
    this.feeCalc = true;
  }

  recordPayment() {
    this.showRecord = true;
    this.sendRecordPaymentData = this.recordData;
    this.sendRecordPaymentData.add = true;


  }

  editForm(data) {
    // this.editFormData = true;
    this.showRecord = true;
    // this.getRecordPayment(data);
    this.sendRecordPaymentData = data;
    this.sendRecordPaymentData.add = false;
    // this.sendRecordPaymentData.add=false;
  }

  cancel(value) {
    if (value != undefined) {
      this.storeData.balanceDue = value.balanceDue;
      this.storeData.status=value.status;
    }
    this.showRecord = false;
    const obj = {
      invoiceId: this.storeData.id
    };
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
    // this.rPayment.reset();
  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  passInvoice(data, index, event) {
    if (data.balanceDue == 0) {
      this.rpyment = false
    }else{
      this.rpyment =true
    }
    if(data.status==5 || data.status==6){
      this.moreStatus=data.status;
    }else{
      this.moreStatus="";
    }   
     this.recordData = data;
    console.log(data);
    this.storeData = data;
    const obj = {
      invoiceId: data.id
    };
    this.highLight = index;
    this.subService.getPaymentReceive(obj).subscribe(
      data => this.getPaymentReceivedRes(data)
    );
  }

  editInvoice() {
    this.showEditIn = true;
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

  Close(state, dismiss) {
    const closeObj = {
      dataString: this.invoiceInSub,
      closingState: dismiss
    }
    if (this.showRecord == true) {
      this.showRecord = false;
      const obj = {
        invoiceId: this.storeData.id
      };
      this.subService.getPaymentReceive(obj).subscribe(
        data => this.getPaymentReceivedRes(data)
      );
      // this.rPayment.reset();
    } else if (this.feeCalc == true) {
      this.feeCalc = false;
    } else {
      (this.invoiceTab == 'invoiceUpperSlider') ? this.subInjectService.rightSliderData(state) : this.subInjectService.rightSideData(state);
      this.subInjectService.changeNewRightSliderState({ state: 'close'});
      this.subInjectService.changeUpperRightSliderState({ state: 'close'});
      this.valueChange.emit(closeObj);
    }

  }

  saveInvoice() {
    console.log(this.editPayment);
  }

  openSendEmail(input) {
    // console.log('invoiceComponent openSendEmail this.invoiceTemplate.nativeElement.innerHTML : ', this.invoiceTemplate.nativeElement.innerHTML);
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: 1, // 2 is for quotation
      documentList: [{
        ...this.storeData,
        documentName: this.storeData.invoiceNumber,
        docText: this.invoiceTemplate.nativeElement.innerHTML
      }],
      isInv: true
    }
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
      console.log('this is template result delete::', result);

      this.Close(result, true);
    });

  }

  printPage(templateRef) {
    console.log('this is template html::', templateRef);
    // window.print();
  }

  generatePdf() {
    let para = document.getElementById('template');
    this.utils.htmlToPdf(para.innerHTML, 'Test')
  }


}
