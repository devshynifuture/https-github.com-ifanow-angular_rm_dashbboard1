import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionService } from '../../../subscription.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

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
  finalAmount: any = 0;
  discount: any;
  auto: any;
  editAdd1: boolean;
  editAdd2: boolean;
  storeData: any;
  rpyment: boolean;
  clientId: any;
  copyStoreData: any;
  finAmountC = 0;
  finAmountS = 0;
  finAmount: any = 0;
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
    console.log('initFormsAndVariable data : ', data);
    if (this.storeData.balanceDue == 0) {
      this.rpyment = false;
    }
    this.auto = this.storeData.auto;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;
    console.log(this.storeData);
    this.editPayment = this.fb.group({
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
        // val = 0;
        // this.editPayment.controls.finalAmount.setValue(val);
      } else if (val < this.editPayment.value.discount) {
        // val = this.editPayment.value.finalAmount;
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(val, this.editPayment.value.discount, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.discount.valueChanges.subscribe(val => {
      // console.log('this.editPayment.controls.discount : ', val);
      if (val == null) {
        // val = 0;
        // this.editPayment.controls.discount.setValue(val);
      } else if (val > this.editPayment.value.finalAmount) {
        val = this.editPayment.value.finalAmount;
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(this.editPayment.value.finalAmount, val, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.taxStatus.valueChanges.subscribe(val => {
      this.changeTaxStatus(this.editPayment.value.finalAmount, this.editPayment.value.discount, val);
    });

    this.editPayment.controls.clientName.valueChanges.subscribe(value => {
      // this.selectClient(value);
    });
  }

  getFormControlEdit() {
    return this.editPayment.controls;
  }

  selectClient(event, data) {
    if (!data || !event.isUserInput) {
      console.log('selectClient data  is null : ', data);
      console.log('selectClient isUserInput  is false : ', event);

      return;
    }
    console.log('selectClient event : ', event);
    // console.log('ssss', data);
    console.log('data ', data);
    this.storeData = data;
    this.storeData.billerAddress = this.defaultVal.biller.billerAddress;
    this.auto = false;
    this.storeData.auto == false;
    console.log(this.storeData);

    const clientName = this.checkAndGetDefaultValue(data.clientName);
    this.clientId = this.storeData.clientId;
    console.log('clientName : ', clientName);
    // this.editPayment.controls.clientName.setValue(clientName);
    this.editPayment.controls.billingAddress.setValue(this.checkAndGetDefaultValue(data.billingAddress));
    if (data.services) {
      this.editPayment.controls.serviceName.setValue(data.services[0].serviceName);
    }

    if (data.auto == true) {
      this.editPayment.controls.serviceName.disable();
    }
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
    if (price == null) {
      price = 0;
    }
    if (discount == null) {
      discount = 0;
    }
    if (changeTaxStatus == null) {
      changeTaxStatus = 0;
    }
    if (changeTaxStatus == 'SGST(9%)|CGST(9%)') {
      this.finAmountC = price - parseInt(discount);
      this.cgstTaxAmount = this.finAmountC * 9 / 100;
      console.log('changeTaxStatus cgstTaxAmount : ', this.cgstTaxAmount);
      this.cgstTaxAmount = UtilService.roundOff(this.cgstTaxAmount, 2);
      this.sgstTaxAmount = this.finAmountC * 9 / 100;
      this.sgstTaxAmount = UtilService.roundOff(this.sgstTaxAmount, 2);
      this.finAmount = this.finAmountC + this.sgstTaxAmount + this.cgstTaxAmount;
      this.finAmount = UtilService.roundOff(this.finAmount, 2);
    } else {
      this.finAmount = price - parseInt(discount);
      this.igstTaxAmount = (this.finAmount) * 18 / 100;
      this.igstTaxAmount = UtilService.roundOff(this.igstTaxAmount, 2);
      this.finAmount = this.finAmount + this.igstTaxAmount;
      this.finAmount = UtilService.roundOff(this.finAmount, 2);
    }
    if (this.storeData)
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
      let obj = {
        clientName: this.editPayment.value.clientName,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        invoiceNumber: this.editPayment.value.invoiceNumber,
        subTotal: this.editPayment.value.finalAmount,
        discount: this.editPayment.value.discount,
        finalAmount:parseInt(this.finAmount) - parseInt(this.editPayment.value.discount),
        invoiceDate: this.editPayment.value.invoiceDate,
        dueDate: this.editPayment.value.dueDate,
        igst: (this.editPayment.value.taxStatus == 'IGST(18%)') ? 18 : null,
        cgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        sgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        igstTaxAmount: (this.editPayment.value.taxStatus == 'IGST(18%)') ? this.finAmount : null,
        cgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountC : null,
        sgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountS : null,
        footnote: this.editPayment.value.footnote,
        terms: this.editPayment.value.terms
      };
      let service;
      if (this.storeData.id == 0 || this.storeData.id == null) {
        obj['billerName'] = this.editPayment.value.billerName,
          obj['advisorBillerProfileId'] = (!this.storeData.advisorBillerProfileId) ? this.advisorBillerProfileId : this.storeData.advisorBillerProfileId,
          obj['clientId'] = (this.upperData == undefined) ? this.clientId : this.upperData,
          obj['advisorId'] = this.advisorId,
          obj['clientBillerId'] = this.storeData.clientBillerId,
          service = [{
            serviceName: this.editPayment.value.serviceName
          }];
        obj['services'] = service,
          console.log('this.editPayment', obj);
        this.subService.addInvoice(obj).subscribe(
          data => this.addInvoiceRes(data)
        );
      } else {
        service = [{
          serviceName: this.editPayment.value.serviceName,
          averageFees: (this.storeData.services == undefined) ? '' : this.storeData.services[0].averageFees,
          description: (this.storeData.services == undefined) ? '' : this.storeData.services[0].description,
          fromDate: (this.storeData.services == undefined) ? '' : this.storeData.services[0].fromDate,
          toDate: (this.storeData.services == undefined) ? '' : this.storeData.services[0].toDate,
        }];
        obj['id'] = this.storeData.id,
          obj['auto'] = this.editPayment.value.auto,
          // finalAmount: this.editPayment.value.finalAmount,
          obj['services'] = service,
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
      this.Close('close', true);
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

      // (this.invoiceTab == 'invoiceUpperSlider') ?
      this.subInjectService.rightSliderData(state)
      this.subInjectService.rightSideData(state);
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
