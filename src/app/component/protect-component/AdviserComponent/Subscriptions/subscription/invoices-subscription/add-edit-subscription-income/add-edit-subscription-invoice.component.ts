import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/auth-service/authService';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {SubscriptionService} from '../../../subscription.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EnumServiceService} from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-add-edit-subscription-invoice',
  templateUrl: './add-edit-subscription-invoice.component.html',
  styleUrls: ['./add-edit-subscription-invoice.component.scss']
})
export class AddEditSubscriptionInvoiceComponent implements OnInit {
  validatorType = ValidatorType;
  editPayment: FormGroup;
  igstTaxAmount: any;
  cgstTaxAmount: any;
  sgstTaxAmount: any;
  taxStatus: any;
  finalAmount: any;
  discount: any;
  auto: any;
  editAdd1: boolean;
  editAdd2: boolean;
  storeData: any;
  rpyment: boolean;
  clientId: any;
  copyStoreData: any;
  finAmountC: number;
  finAmountS: number;
  finAmount: any;
  showDateError: string;
  showErr: boolean;
  advisorId: any;
  showRecord: any;
  @Input() upperData;
  @Input() invoiceInSub;
  @Input() invoiceTab;
  @Input() invoiceValue;
  @Output() valueChange = new EventEmitter();
  @Output() cancelEditInvoice = new EventEmitter();
  @Output() cancelAddInvoice = new EventEmitter();
  feeCalc: boolean;


  service: { serviceName: any; averageFees: string; description: string; fromDate: string; toDate: string; }[];
  advisorBillerProfileId: any;
  dataSource: any;
  showPaymentRecive: boolean;
  feeCollectionMode: any;
  showEdit: boolean;
  clientList: any;
  defaultVal: any;
  serviceList: any;

  constructor(public enumService: EnumServiceService, private fb: FormBuilder, private subService: SubscriptionService,
              public subInjectService: SubscriptionInject) {
  }

  @Input() set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    // console.log('@@@@@@@@', data);
    this.copyStoreData = data;
    this.storeData = data;
    this.initFormsAndVariable(data);

  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getClients();
    this.showErr = false;
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    if (this.invoiceValue == 'edit' || this.invoiceValue == 'EditInInvoice') {
      this.editPayment.reset();
      this.auto = true;
      this.showEdit = false;
      this.editAdd1 = false;
      this.editAdd2 = false;
      this.showEdit = true;
      this.finalAmount = 0;
      this.discount = 0;
      this.storeData =
        this.taxStatus = ['IGST(18%)'];
      this.editPayment.controls.serviceName.enable();

    }
  }

  initFormsAndVariable(data) {
    if (this.storeData.balanceDue == 0) {
      this.rpyment = false;
    }
    this.auto = this.storeData.auto;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;
    console.log(this.storeData);
    // this.getFormControledit().clientName.maxLength = 10;
    // this.getFormControledit().billerAddress.maxLength = 150;
    // this.getFormControledit().billingAddress.maxLength = 150;
    // this.getFormControledit().invoiceNumber.maxLength = 20;
    // this.getFormControledit().footnote.maxLength = 100;
    // this.getFormControledit().terms.maxLength = 150;
    this.editPayment = this.fb.group({
      id: [data.id],
      clientName: [data.clientName, [Validators.required]],
      billerName: [data.billerName ? data.billerName : '', [Validators.required]],
      billerAddress: [data.billerAddress, [Validators.required]],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      invoiceNumber: [data.invoiceNumber, [Validators.required, Validators.maxLength(150)]],
      invoiceDate: [new Date(data.invoiceDate), [Validators.required]],
      finalAmount: [(data.subTotal == undefined) ? 0 : parseInt(data.subTotal), [Validators.required]],
      discount: [(data.discount == undefined) ? 0 : data.discount, [Validators.required]],
      dueDate: [new Date(data.dueDate), [Validators.required]],
      footnote: [data.footnote, [Validators.required]],
      terms: [data.terms, [Validators.required]],
      taxStatus: [(!data.igstTaxAmount) ? 'SGST(9%)|CGST(9%)' : 'IGST(18%)'],
      serviceName: [(!data.services) ? '0' : (data.services.length == 0) ? '0' : data.services[0].serviceName,
        [Validators.required]],
      subTotal: [(!data.subTotal) ? '' : data.subTotal],
      igstTaxAmount: [data.igstTaxAmount],
      cgstTaxAmount: [data.cgstTaxAmount],
      sgstTaxAmount: [data.sgstTaxAmount],
      auto: [data.auto],
      balanceDue: [(data.balanceDue == undefined) ? '' : data.balanceDue],
      advisorBillerProfileId: [(data.advisorBillerProfileId == undefined) ? '' : data.advisorBillerProfileId],
      clientBillerId: [(data.clientBillerId == undefined) ? '' : data.clientBillerId],
      // fromDate : [data.services[0].fromDate,[Validators.required]],

    });
    this.igstTaxAmount = data.igstTaxAmount;
    this.cgstTaxAmount = data.cgstTaxAmount;
    this.sgstTaxAmount = data.sgstTaxAmount;
    this.taxStatus = this.editPayment.controls.taxStatus.value;

    this.finalAmount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.finalAmount.value;
    this.discount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.discount.value;
    this.auto = this.editPayment.controls.auto.value;
    if (data.auto == true) {
      this.editPayment.controls.serviceName.disable();
    }
    this.editPayment.controls.finalAmount.valueChanges.subscribe(val => {
      if (val == null) {
        val = 0;
        this.editPayment.controls.finalAmount.setValue(val);
      } else if (val < this.editPayment.value.discount) {
        // val = this.editPayment.value.finalAmount;
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(val, this.editPayment.value.discount, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.discount.valueChanges.subscribe(val => {
      console.log('this.editPayment.controls.discount : ', val);
      if (val == null) {
        val = 0;
        this.editPayment.controls.discount.setValue(val);
      } else if (val > this.editPayment.value.finalAmount) {
        val = this.editPayment.value.finalAmount;
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(this.editPayment.value.finalAmount, val, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.taxStatus.valueChanges.subscribe(val => {
      this.changeTaxStatus(this.editPayment.value.finalAmount, this.editPayment.value.discount, val);
    });

  }

  getFormControledit() {
    return this.editPayment.controls;
  }

  selectClient(event, data) {
    console.log('selectClient c : ', event);
    console.log('ssss', data);
    console.log('getInvoiceDataRes', data);
    this.storeData = data;
    this.storeData.billerAddress = this.defaultVal.biller.billerAddress;
    this.auto = false;
    this.storeData.auto == false;
    console.log(this.storeData);
    /* this.editPayment = this.fb.group({
       id: [data.id],
       clientName: [(data.clientName == undefined) ? '' : data.clientName, [Validators.required]],
       billerName: [(data.billerName == undefined) ? '' : data.billerName, [Validators.required]],
       // advisorId: [(data.advisorId == undefined) ? '' : data.advisorId, [Validators.required]],
       billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
       finalAmount: [(parseInt(data.finalAmount) == undefined) ? '' : parseInt(data.finalAmount), [Validators.required]],
       discount: [(data.discount == undefined) ? '' : data.discount, [Validators.required]],
       invoiceNumber: [, [Validators.required]],
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
       // clientId: [(data.clientId == undefined) ? '' : data.clientId],
     });*/
    this.editPayment.controls.clientName.setValue(this.checkAndGetDefaultValue(data.clientName));
    this.editPayment.controls.billingAddress.setValue(this.checkAndGetDefaultValue(data.billingAddress));

    this.editPayment.controls.billerName.setValue(this.checkAndGetDefaultValue(data.billerName));
    this.editPayment.controls.billerAddress.setValue(this.defaultVal.biller.billerAddress);
    this.editPayment.controls.finalAmount.setValue((!data.finalAmount) ? '' : parseFloat(data.finalAmount));

    this.editPayment.controls.discount.setValue(this.checkAndGetDefaultValue(data.discount));
    this.editPayment.controls.invoiceNumber.setValue((!data.invoiceNumber) ? this.defaultVal.invoiceNumber : data.invoiceNumber);
    this.editPayment.controls.invoiceDate.setValue(this.checkAndGetDefaultValue(data.invoiceDate, new Date()));
    this.editPayment.controls.taxStatus.setValue((data.igst != undefined) ? 'IGST(18%)' : 'SGST(9%)|CGST(9%)');
    this.editPayment.controls.balanceDue.setValue(this.checkAndGetDefaultValue(data.balanceDue));
    if (data.services) {
      this.editPayment.controls.serviceName.setValue(data.services[0].serviceName);
    }
    this.editPayment.controls.subTotal.setValue(this.checkAndGetDefaultValue(data.subTotal));
    this.editPayment.controls.dueDate.setValue(new Date(data.dueDate));
    this.editPayment.controls.footnote.setValue(this.checkAndGetDefaultValue(data.footnote));
    this.editPayment.controls.terms.setValue(this.checkAndGetDefaultValue(data.terms));

    this.editPayment.controls.auto.setValue(this.checkAndGetDefaultValue(data.auto));
    this.editPayment.controls.advisorBillerProfileId.setValue(this.checkAndGetDefaultValue(data.advisorBillerProfileId));
    this.editPayment.controls.clientBillerId.setValue(this.checkAndGetDefaultValue(data.clientBillerId));
    this.editPayment.controls.terms.setValue(this.checkAndGetDefaultValue(data.terms));

    // this.getFormControledit().clientName.maxLength = 10;
    // this.getFormControledit().billerAddress.maxLength = 150;
    // this.getFormControledit().billingAddress.maxLength = 150;
    // this.getFormControledit().invoiceNumber.maxLength = 10;
    // this.getFormControledit().footnote.maxLength = 150;
    // this.getFormControledit().terms.maxLength = 150;
    if (data.auto == true) {
      this.editPayment.controls.serviceName.disable();
    }
    this.finalAmount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.finalAmount.value;
    this.discount = (isNaN(this.editPayment.controls.finalAmount.value)) ? 0 : this.editPayment.controls.discount.value;
    console.log('finalAmount', this.finalAmount);
    this.taxStatus = this.editPayment.value.taxStatus;
  }

  checkAndGetDefaultValue(value, defaultValue?) {

    return value ? value : defaultValue ? defaultValue : '';
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

  changeTaxStatus(price, discount, changeTaxStatus) {
    console.log('changeTaxStatus', changeTaxStatus);
    if (changeTaxStatus == 'SGST(9%)|CGST(9%)') {
      this.finAmountC = price - parseInt(discount);
      this.cgstTaxAmount = this.finAmountC * 9 / 100;
      console.log('changeTaxStatus cgstTaxAmount : ', this.cgstTaxAmount);

      this.cgstTaxAmount = UtilService.roundOff(this.cgstTaxAmount, 2);
      console.log('changeTaxStatus cgstTaxAmount : ', this.cgstTaxAmount);

      // this.finAmountS = this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount);
      this.sgstTaxAmount = this.finAmountC * 9 / 100;
      this.sgstTaxAmount = UtilService.roundOff(this.sgstTaxAmount, 2);

      this.finAmount = this.finAmountC + this.sgstTaxAmount + this.cgstTaxAmount;
      console.log('changeTaxStatus finAmount : ', this.finAmount);

      this.finAmount = UtilService.roundOff(this.finAmount, 2);

    } else {
      this.finAmount = price - parseInt(discount);
      this.igstTaxAmount = (this.finAmount) * 18 / 100;
      console.log('changeTaxStatus igstTaxAmount : ', this.igstTaxAmount);

      this.igstTaxAmount = UtilService.roundOff(this.igstTaxAmount, 2);
      console.log('changeTaxStatus igstTaxAmount : ', this.igstTaxAmount);

      this.finAmount = this.finAmount + this.igstTaxAmount;
      console.log('changeTaxStatus before roundoff finAmount : ', this.finAmount);

      this.finAmount = UtilService.roundOff(this.finAmount, 2);

    }
    this.storeData.subTotal = price;
    this.taxStatus = changeTaxStatus;
    console.log('finAmount', this.finAmount);
  }

  checkDateDiff(event) {
    let invoiceDate;
    let dueDate;

    if (this.editPayment.get('invoiceDate').value !== null && this.editPayment.get('dueDate').value !== null) {
      invoiceDate = new Date((this.editPayment.get('invoiceDate').value._d) ? this.editPayment.get('invoiceDate').value._d : this.editPayment.get('invoiceDate').value).getTime();
      dueDate = new Date((this.editPayment.get('dueDate').value._d) ? this.editPayment.get('dueDate').value._d : this.editPayment.get('dueDate').value).getTime();
      (invoiceDate == undefined && dueDate == undefined) ? ''
        : (dueDate <= invoiceDate)
        ? this.showDateError = 'Due date should be greater than invoice date' :
        this.showDateError = undefined;
    }
  }

  updateInvoice() {
    this.showErr = false;
    if (this.editPayment.value.discount == '') {
      this.editPayment.value.discount = 0;
    }
    // this.changeTaxStatus(this.editPayment.value.taxStatus);
    // if (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') {
    //   this.finAmountC = this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount);
    //   this.finAmountC = this.finAmountC * 9 / 100;
    //   this.finAmountS = this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount);
    //   this.finAmountS = this.finAmountS * 9 / 100;
    //   this.finAmount = this.finAmountC + this.finAmountS;
    // } else {
    //   this.finAmount = (this.editPayment.controls.finalAmount.value - parseInt(this.editPayment.value.discount));
    //   this.finAmount = (this.finAmount) * 18 / 100;
    // }
    if (this.showDateError) {
      return;
    }
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
      this.showErr = true;
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
      this.cancelAddInvoice.emit(false);
      // this.Close('close', true);
    }
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

  addInvoiceRes(data) {
    console.log('addInvoiceRes', data);
    if (data == 1) {
      this.cancelAddInvoice.emit(false);
      // this.Close('close', true);
    }
  }


  Close(state, dismiss) {
    const closeObj = {
      dataString: this.invoiceInSub,
      closingState: dismiss
    };
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
      // this.valueChange.emit(closeObj);
    }

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

  closeEditInv() {
    // this.editPayment.reset();
    if (this.invoiceValue == 'EditInInvoice' || this.invoiceValue == 'edit') {
      this.valueChange.emit(false);
      this.cancelAddInvoice.emit(false);
    } else {
      this.showEdit = false;
      this.cancelEditInvoice.emit(this.showEdit);
    }
  }

}
