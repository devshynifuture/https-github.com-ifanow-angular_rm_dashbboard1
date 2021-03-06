import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { SubscriptionService } from '../../../subscription.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-subscription-invoice',
  templateUrl: './add-edit-subscription-invoice.component.html',
  styleUrls: ['./add-edit-subscription-invoice.component.scss']
})
export class AddEditSubscriptionInvoiceComponent implements OnInit {
  invalidExtended;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  validatorType = ValidatorType;
  editPayment: FormGroup;
  igstTaxAmount: any;
  cgstTaxAmount: any;
  sgstTaxAmount: any;
  taxStatus: any;
  finalAmount: any = 0;
  discount: any;
  auto: any;
  editAdd1: boolean = false;
  editAdd2: boolean = false;
  storeData: any;
  rpyment: boolean;
  clientId: any;
  copyStoreData: any;
  finAmountC = 0;
  finAmountS = 0;
  finAmount: any = 0;
  showDateError: boolean = false;
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

  // flags if the template is being edited or not based on the data received
  editFlag: boolean = false;


  service: { serviceName: any; averageFees: string; description: string; fromDate: string; toDate: string; }[];
  advisorBillerProfileId: any;
  dataSource: any;
  showPaymentRecive: boolean;
  feeCollectionMode: any;
  showEdit: boolean = true;
  clientList: any;
  defaultVal: any;
  serviceList: any;
  billerName: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  dueDate: any;
  selectedService: any;
  @ViewChild('billerAddress', { static: true }) billerAddress: ElementRef;
  @ViewChild('payeeAddress', { static: true }) payeeAddress: ElementRef;

  constructor(private ngZone: NgZone, public enumService: EnumServiceService, private datePipe: DatePipe, private fb: FormBuilder, private subService: SubscriptionService,
    public subInjectService: SubscriptionInject) {
  }

  @Input() set data(data) {
    console.log('AddEditSubscriptionInvoiceComponent data : ', data);
    this.copyStoreData = data;
    this.storeData = data;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    if (data.id == undefined || data.flag) {
      this.getClients();
      this.editFlag = false;
    } else {
      this.editFlag = true;
    }
    this.initFormsAndVariable(data);
  }

  ngOnInit() {

    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.showErr = false;
    this.getServicesList();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();

    const autoCompelete = new google.maps.places.Autocomplete(this.billerAddress.nativeElement, {
      types: [],
      componentRestrictions: { 'country': 'IN' }
    });

    const autoCompelete1 = new google.maps.places.Autocomplete(this.payeeAddress.nativeElement, {
      types: [],
      componentRestrictions: { 'country': 'IN' }
    });

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
    if(!this.advisorId){
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId();
    }
    if (this.storeData.balanceDue == 0) {
      this.rpyment = false;
    }
    this.auto = this.storeData.auto;
    this.showEdit = false;
    this.editAdd1 = false;
    this.editAdd2 = false;
    // , [Validators.required]
    this.dueDate;
    if (data.dueDate == undefined) {
      this.dueDate = new Date().setDate(new Date().getDate() + 5);
    }
    else {
      this.dueDate = data.dueDate
    }
    this.editPayment = this.fb.group({
      clientName: [data.clientName, [Validators.required]],
      billerName: [data.billerName ? data.billerName : ''],
      billerAddress: [data.billerAddress, [Validators.required]],
      billingAddress: [(data.billingAddress == undefined) ? '' : data.billingAddress, [Validators.required]],
      invoiceNumber: [data.invoiceNumber, [Validators.required, Validators.maxLength(150)]],
      invoiceDate: [new Date(data.invoiceDate), [Validators.required]],
      finalAmount: [(data.subTotal == undefined) ? 0 : parseInt(data.subTotal), [Validators.required, Validators.min(1.00)]],
      discount: [(data.discount == undefined) ? 0 : data.discount],
      dueDate: [new Date(this.dueDate), [Validators.required]],
      footnote: [data.footnote, [Validators.maxLength(500)]],
      terms: [data.terms, [Validators.maxLength(500)]],
      taxStatus: [data == '' || !data.cgst ? 'IGST(18%)' : 'SGST(9%)|CGST(9%)'],
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
    this.editPayment.controls.invoiceNumber.disable();
    if (!!data.id) {
      this.editPayment.controls.finalAmount.disable();
    }
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
      } else if (val < this.editPayment.value.discount) {
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(val, this.editPayment.value.discount, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.discount.valueChanges.subscribe(val => {
      if (val == null) {
      } else if (val > this.editPayment.controls.finalAmount.value) {
        val = this.editPayment.controls.finalAmount.value;
        this.editPayment.controls.discount.setValue(val);
      }
      this.changeTaxStatus(this.editPayment.controls.finalAmount.value, val, this.editPayment.value.taxStatus);
    });
    this.editPayment.controls.taxStatus.valueChanges.subscribe(val => {
      this.changeTaxStatus(this.editPayment.controls.finalAmount.value, this.editPayment.value.discount, val);
    });
    this.editPayment.controls.clientName.valueChanges.subscribe(value => {
    });
  }

  getFormControlEdit() {
    return this.editPayment.controls;
  }

  selectClient(event, data) {
    if (!data || !event.isUserInput) {

      return;
    }
    this.storeData = data;
    this.storeData.billerAddress = this.defaultVal.biller.billerAddress;
    this.auto = false;
    this.storeData.auto == false;

    const clientName = this.checkAndGetDefaultValue(data.clientName);
    this.clientId = this.storeData.clientId;
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
  }

  checkDateDiff(event) {
    let invoiceDate;
    let dueDate;

    if (this.editPayment.get('invoiceDate').value !== null && this.editPayment.get('dueDate').value !== null) {
      invoiceDate = new Date((this.editPayment.get('invoiceDate').value._d) ? this.editPayment.get('invoiceDate').value._d : this.editPayment.get('invoiceDate').value).getTime();
      dueDate = new Date((this.editPayment.get('dueDate').value._d) ? this.editPayment.get('dueDate').value._d : this.editPayment.get('dueDate').value).getTime();
      (invoiceDate == undefined && dueDate == undefined) ? ''
        : (dueDate <= invoiceDate)
          ? this.showDateError = true :
          this.showDateError = false;
    }
  }

  updateInvoice() {
    // this.showErr = false;
    // if (this.showDateError || this.editPayment.invalid ) {
    //   this.editPayment.get('dueDate').markAsTouched();
    //   this.editPayment.get('taxStatus').markAsTouched();
    //   this.editPayment.get('invoiceDate').markAsTouched();
    //   this.editPayment.get('clientName').markAsTouched();
    //   this.editPayment.get('serviceName').markAsTouched();
    //   this.editPayment.get('finalAmount').markAsTouched();
    // }

    if (this.showDateError || this.editPayment.invalid) {
      // for (let element in this.editPayment.controls) {
      //   if (this.editPayment.get(element).invalid) {
      //     this.inputs.find(input => !input.ngControl.valid).focus();
      //     this.editPayment.controls[element].markAsTouched();
      //   }
      // }
      this.editPayment.markAllAsTouched();
    }
    //  else if (isNaN(this.editPayment.controls.finalAmount.value)) {
    //   this.showErr = true;
    //   return;
    // }
    else {
      this.barButtonOptions.active = true;
      let obj = {
        clientName: this.editPayment.value.clientName,
        billerAddress: this.editPayment.value.billerAddress,
        billingAddress: this.editPayment.value.billingAddress,
        invoiceNumber: this.editPayment.controls.invoiceNumber.value,
        billerName: this.billerName,
        subTotal: this.editPayment.controls.finalAmount.value,
        discount: this.editPayment.value.discount == '' ? 0 : this.editPayment.value.discount,
        finalAmount: parseInt(this.finAmount),
        invoiceDate: this.editPayment.value.invoiceDate,
        dueDate: new Date(this.editPayment.value.dueDate).setDate(new Date(this.editPayment.value.dueDate).getDate() + 1),
        igst: (this.editPayment.value.taxStatus == 'IGST(18%)') ? 18 : null,
        cgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        sgst: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? 9 : null,
        // igstTaxAmount: (this.editPayment.value.taxStatus == 'IGST(18%)') ? this.finAmount : null,
        // cgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountC : null,
        // sgstTaxAmount: (this.editPayment.value.taxStatus == 'SGST(9%)|CGST(9%)') ? this.finAmountS : null,
        igstTaxAmount: this.igstTaxAmount ? this.igstTaxAmount : null,
        cgstTaxAmount: this.cgstTaxAmount ? this.cgstTaxAmount : null,
        sgstTaxAmount: this.sgstTaxAmount ? this.sgstTaxAmount : null,
        footnote: this.editPayment.value.footnote,
        terms: this.editPayment.value.terms
      };

      let service;
      if (this.storeData.id == 0 || this.storeData.id == null) {
        obj['advisorBillerProfileId'] = (!this.storeData.advisorBillerProfileId) ? this.advisorBillerProfileId : this.storeData.advisorBillerProfileId,
          obj['clientId'] = (this.upperData == undefined) ? this.clientId : this.upperData.id,
          obj['advisorId'] = this.advisorId,
          obj['clientBillerId'] = this.storeData.clientBillerId,
          service = [{
            serviceName: this.editPayment.value.serviceName,
            id: this.selectedService.id,
            description: this.selectedService.description
          }];
        obj['services'] = service,
          this.subService.addInvoice(obj).subscribe(
            data => this.addInvoiceRes(data)
          );
      } else {
        service = [{
          serviceName: this.editPayment.value.serviceName,
          averageFees: (this.storeData.services.length == 0) ? '' : this.storeData.services[0].averageFees,
          description: (this.storeData.services.length == 0) ? '' : this.storeData.services[0].description,
          fromDate: (this.storeData.services.length == 0) ? '' : this.storeData.services[0].fromDate,
          toDate: (this.storeData.services.length == 0) ? '' : this.storeData.services[0].toDate,
        }];
        obj['id'] = this.storeData.id,
          obj['auto'] = this.editPayment.value.auto,
          // finalAmount: this.editPayment.controls.finalAmount.value,
          obj['services'] = service,
          this.subService.updateInvoiceInfo(obj).subscribe(
            data => this.updateInvoiceInfoRes(data)
          );
      }
    }

  }

  updateInvoiceInfoRes(data) {
    if (data == 1) {
      this.barButtonOptions.active = false;
      this.cancelAddInvoice.emit(true);
      this.Close('close', true);
    }
  }
  changeSelection(value) {
    if (value == "IGST(18%)") {
      this.cgstTaxAmount = 0;
      this.sgstTaxAmount = 0;
    } else {
      this.igstTaxAmount = 0;
    }
  }
  getClients() {
    const obj = {
      advisorId: this.advisorId,
      clientId: (this.upperData == undefined) ? 0 : this.upperData.id
    };
    this.subService.getClientList(obj).subscribe(
      data => this.getClientListRes(data)
    );
  }

  selectService(service) {
    this.selectedService = service;
    this.editPayment.get("finalAmount").setValue(service.price)
    this.finAmount = service.price
  }

  getClientListRes(data) {
    this.clientList = data.payees;
    this.billerName = data.biller.companyDisplayName
    this.defaultVal = data;
    this.advisorBillerProfileId = data.biller.id;
    this.editPayment.controls.billerAddress.setValue(data.biller.billerAddress);
    this.editPayment.controls.footnote.setValue(data.biller.footnote);
    this.editPayment.controls.terms.setValue(data.biller.terms);
    this.editPayment.controls.invoiceNumber.setValue(data.invoiceNumber);
    this.editPayment.controls.invoiceDate.setValue(new Date());
    this.editPayment.controls.dueDate.setValue(new Date(this.dueDate));
    this.editPayment.controls.taxStatus.setValue("IGST(18%)");
    this.editPayment.controls.invoiceNumber.disable()
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
    data = data.filter(element => element.feeTypeId == 1);
    this.serviceList = data;
  }

  addInvoiceRes(data) {
    if (data == 1) {
      this.barButtonOptions.active = false;
      this.cancelAddInvoice.emit(true);
      // this.Close('close', true);
    }
  }


  Close(state, Dismiss) {
    const closeObj = {
      dataString: this.invoiceInSub,
      closingState: Dismiss
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
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });

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
    if (this.storeData.invoiceNumber == undefined) {
      this.valueChange.emit(false);
      this.cancelAddInvoice.emit(false);
    } else {
      this.showEdit = false;
      this.cancelEditInvoice.emit(this.showEdit);
    }
  }

}
