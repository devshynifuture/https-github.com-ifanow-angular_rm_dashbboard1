/*
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss']
})
export class CommonFroalaComponent implements OnInit {
  showActivityLog: boolean;

  constructor(public subInjectService: SubscriptionInject)  { }

  ngOnInit() {
    this.showActivityLog=false;
  }
  Close(value) {
    if(this.showActivityLog==true){
      this.showActivityLog=false;
    }else{
    this.subInjectService.rightSideData(value);
    }
  }
  openFroala()
  {
    this.showActivityLog=true;
  }
  cancel()
  {
    this.showActivityLog=false;
  }
}
*/
import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { escapeRegExp, UtilService } from 'src/app/services/util.service';
import { EmailOnlyComponent } from '../email-only/email-only.component';
import { AuthService } from '../../../../../../../auth-service/authService';
import { PdfService } from '../../../../../../../services/pdf.service';
import { SubscriptionDataService } from '../../../subscription-data.service';
// import { escapeRegExp } from '';

// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonFroalaComponent),
      multi: true
    }
  ]
})
export class CommonFroalaComponent implements ControlValueAccessor, OnInit, AfterViewInit {


  dataSub: any;
  storeData: any;
  inputData: any;
  templateType: number;
  advisorId;
  /*@ViewChild('renderElement', {
    static: true
  }) renderElement;*/
  @ViewChild('renderElement', {
    read: ElementRef,
    static: false
  }) renderElement: ElementRef;
  feeStructureHtmlData: string = '';
  quotationData: any;
  saveQuotationFlag: any;
  sendEmailFlag: any;

  constructor(public subscription: SubscriptionService, public subInjectService: SubscriptionInject,
    public eventService: EventService, public dialog: MatDialog, private utilService: UtilService,
    private subDataService: SubscriptionDataService) {
    this.advisorId = AuthService.getAdvisorId();
    // this.dataSub = this.subInjectService.singleProfileData.subscribe(
    //   data=>this.getcommanFroalaData(data)
    // );
  }

  @Input() screenType;
  @Input() changeFooter;
  @Input() changeEmailOnly;

  @Input()
  set data(data) {
    this.inputData = data;
    if (data.quotation && data.feeStructureFlag) {
      if (this.quotationData == undefined) {
        this.sendEmailFlag = data.sendEsignFlag
        this.saveQuotationFlag = data.quotationFlag;
        this.getServicesForPlan(data);
        return;
      }
      return;
    }
    this.sendEmailFlag = data.sendEsignFlag
    this.saveQuotationFlag = data.quotationFlag;
    this.getcommanFroalaData(data, null);
  }

  get data() {
    return this.inputData;
  }

  showActivityLog: boolean;

  // End ControlValueAccesor methods.

  model: any;

  config = {
    charCounterCount: false
  };

  ngOnInit() {
    this.showActivityLog = false;
  }

  ngAfterViewInit(): void {
    if (this.renderElement && this.renderElement.nativeElement && this.storeData) {
      this.renderElement.nativeElement.innerHTML = this.storeData.documentText;
    }
  }

  getcommanFroalaData(data, feeStructureTableData) {
    this.storeData = Object.assign({}, data);
    const obj =
    {
      clientName: this.storeData.clientName,
      clientAddress: '',
      advisorName: AuthService.getUserInfo().name,
      advisorAddress: ''
    }
    this.storeData.documentText = this.utilService.replacePlaceholder(this.storeData.documentText, obj);
    if (feeStructureTableData) {
      this.storeData.documentText = this.storeData.documentText.replace(new RegExp(escapeRegExp('$service_fee'), 'g'),
        feeStructureTableData)
      // this.storeData.documentText.replace(new RegExp(escapeRegExp('undefined')), 'g', '');
    }
    // let d = new Date();
    // this.storeData.documentText = this.storeData.documentText.replace(new RegExp(escapeRegExp('$(customer_name)'), 'g'),
    //   this.storeData.clientName);
    // this.storeData.documentText = this.storeData.documentText.replace(new RegExp(escapeRegExp('$(plan_name)'), 'g'),
    //   this.storeData.planName);
    // this.storeData.documentText = this.storeData.documentText.replace(new RegExp(escapeRegExp(' $(date)'), 'g'),
    // d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear());
  }

  Close(data, flag) {
    // if (this.showActivityLog == true) {
    //   this.showActivityLog = false;
    // } else {
    //   this.subInjectService.rightSideData(value);
    // }
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
    this.subInjectService.changeUpperRightSliderState({ state: 'close', data, refreshRequired: flag });

    // this.subInjectService.changeUpperRightSliderState({value:'close'})
    // this.subInjectService.changeUpperRightSliderState({value:'close'})
  }

  openFroala() {
    this.showActivityLog = true;
  }

  cancel() {
    this.showActivityLog = false;
  }

  // Begin ControlValueAccesor methods.
  onChange = (_) => {
  }
  onTouched = () => {
  }

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  Open(value, state, data) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
  }

  saveData(data) {
    this.storeData.documentText = data;
    this.storeData.docText = data;
    this.renderElement.nativeElement.innerHTML = data;
  }
  saveSendEsign() {
    this.inputData['sendEsign'] = true
    this.save();
  }
  save() {
    if (this.storeData.quotation == true) {
      this.updateDataQuot(this.storeData);
    } else {
      this.updateData(this.storeData);
    }
  }

  updateDataQuot(data) {
    const obj = {
      id: data.id, // pass here advisor id for Invoice advisor
      docText: data.documentText,
      quotation: true
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      responseData => this.getResponseData(responseData)
    );
  }

  updateData(data) {
    const obj = {
      id: data.id, // pass here advisor id for Invoice advisor
      docText: data.documentText
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      responseData => this.getResponseData(responseData)
    );
  }

  getResponseData(data) {
    // this.Close('close');
    if (this.inputData.sendEsign) {
      this.openSendEmailEsign();
      this.inputData.sendEsign = false;
    }
    else {
      this.Close('close', true);
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone.',
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

  openSendEmailQuotation() {
    if (this.storeData.quotation) {
      this.templateType = 2;
    } else {
      this.templateType = 4;
    }
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: this.templateType, // 2 is for quotation
      documentList: [this.storeData]
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    this.openEmail(data, 'email');
  }

  generatePdf() {
    this.renderElement.nativeElement.innerHTML = this.storeData.documentText;

    // PdfService.generateTestDocument();
    let docName: string = this.storeData.docName;
    if (docName) {
      if (!docName.includes('.pdf')) {
        docName += '.pdf';
      }
    } else {
      docName = 'documnent.pdf';
    }
    const opt = {
      margin: 1,
      filename: docName,
      // image: {type: 'jpeg', quality: 0.98},
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // html2pdf().from(this.renderElement.nativeElement).save();
    // html2pdf().from(this.renderElement.nativeElement).toContainer().toCanvas().toImg().toPdf().save();
    // if (!window.html2canvas) {
    //   window.html2canvas = html2canvas;
    // }
    /* html2canvas(this.renderElement.nativeElement).then(canvas => {

       PdfService.generatePdfFromCanvas(canvas, docName);
     }).catch(error => {
       console.info('html2canvas renderElement error : ', error);
     });*/
    /*html2canvas(document.querySelector("#renderElement")).then(canvas => {

      // document.body.appendChild(canvas);
    }).catch(error => {
      console.info('html2canvas querySelector error : ', error);

    });*/
    try {
      PdfService.generatePdfFromHtmlText(this.storeData.documentText, opt);

    } catch (e) {
    }
    /*  try {
        PdfService.generatePdfFromHtmlText(this.storeData.documentText, docName);
      } catch (e) {
      }
  */
  }
  openSendEmailEsign() {
    if (this.storeData.isDocument == true) {
      this.templateType = 3;
    } else {
      this.templateType = 2;
    }
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: this.templateType, // 2 is for quotation
      documentList: [this.storeData],
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    this.openEmail(data, 'email');
  }
  openSendEmail() {
    if (this.storeData.isDocument == true) {
      this.templateType = 4;
    } else {
      this.templateType = 2;
    }
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: this.templateType, // 2 is for quotation
      documentList: [this.storeData],
      showfromEmail: (this.inputData.showfromEmail == true) ? true : false,
      fromEmailId: this.inputData.fromEmail,
      subject: this.inputData.subject,
      id: this.inputData.id,
      emailTemplateTypeId: this.inputData.emailTemplateTypeId
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    this.openEmail(data, 'email');
  }

  openEmail(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: EmailOnlyComponent

    };
    if (this.screenType) {
      const rightSideDataSub2 = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
        sideBarData => {
          if (UtilService.isDialogClose(sideBarData)) {
            rightSideDataSub2.unsubscribe();
          }
        }
      );
    } else {
      const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          if (UtilService.isDialogClose(sideBarData)) {
            rightSideDataSub.unsubscribe();
          }
        }
      );
    }

  }

  createQuotation() {
    const obj =
    {
      "planId": this.storeData.planId,
      "documentRepositoryId": this.storeData.documentRepositoryId,
      "clientId": this.storeData.clientId,
      "advisorId": this.advisorId,
      "documentText": this.storeData.documentText
    }
    this.subscription.createQuotation(obj).subscribe(
      data => {
        this.eventService.openSnackBar("Quotation added sucessfully", "Dismiss");
        this.Close('close', true)
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  getServicesForPlan(quotationData) {
    this.quotationData = quotationData;
    const obj =
    {
      advisorId: this.advisorId,
      planId: quotationData.planId
    }
    this.subscription.getSettingPlanServiceData(obj).subscribe(
      responseData => {
        if (responseData && responseData.length > 0) {
          console.log(responseData);
          this.createFeeStructureForFroala(responseData, quotationData);
        }
      }
    )
  }


  createFeeStructureForFroala(responseData, quotationData) {
    responseData.forEach(element => {
      let feeStructureTable = `<div class="hide">
<table style="width: 100%; margin: 0px auto; border: 1px solid rgba(0, 0, 0, 0.12);" align="center">
   <tr>
       <td>
           <table style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12); background: #F5F7F7; ">
               <tr>
                   <td style="padding: 28px 22px;  ">
                       <h3 style="margin: 0px; font-size: 24px;">${element.serviceName}</h3>
                       <h5 style="margin: 0px; font-size: 16px;">${element.serviceCode}</h5>
                   </td>
               </tr>
           </table>
       </td>
   </tr>
   <tr>
       <td>
           <table style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12);">
               <tr>
                   <td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">BILLING NATURE</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.servicePricing.billingNature == 1) ? 'Recurring' : 'Once'}</h4>
                   </td>

                   <td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">BILLING MODE</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.servicePricing.billingMode == 1) ? 'Start Of Period' : 'End Of Period'}</h4>
                   </td>

                   <td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">FEES</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.servicePricing.feeTypeId == 1) ? '₹' : ''}${element.averageFees}${(element.servicePricing.feeTypeId == 2) ? '%' : ''}</h4>
                   </td>
               </tr>
           </table>
       </td>
   </tr>
   <tr>
       <td>
           <table style="width: 100%;">
               <tr>
                   <td style="padding: 24px; border: none; width: 50%; vertical-align: top; border: none;">
                       <p style="font-size: 12px; margin:0px;">DESCRIPTION</p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">${(element.description) ? element.description : 'N/A'}</h4>
                   </td>
               ${(element.servicePricing.feeTypeId == 2) ? `<td style="padding: 24px; border: none;">
                       <p style="font-size: 12px; margin:0px;">VARIABLE FEE DETAILS </p>
                       <h4 style="margin: 0px; padding: 0px; font-size: 18px;">Mutual Funds </h4>
                       <table style="width: 100%; border: 1px solid rgba(0, 0, 0, 0.12);  background: #F5F7F7;">
                           <tr>
                               <td colspan="3" style=" border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);  text-align: center; padding: 10px;">
                                   Direct</td>
                               <td colspan="3" style=" border-bottom: 1px solid rgba(0, 0, 0, 0.12); padding: 10px;  text-align: center;">
                                   Regular</td>
                           </tr>
                           <tr>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12); ">Equity</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Debt</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Liquid</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Equity</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12); border-right: 1px solid rgba(0, 0, 0, 0.12);">Debt</td>
                               <td style="padding: 5px; border-bottom: 1px solid rgba(0, 0, 0, 0.12);">Liquid</td>
                           </tr>
                           <tr>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].equityAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].debtAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[0].liquidAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].equityAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].debtAllocation}%</td>
                               <td style="padding: 5px;border-right: 1px solid rgba(0, 0, 0, 0.12);">${element.servicePricing.pricingList[1].liquidAllocation}%</td>
                           </tr>
                       </table>
                   </td>
                   </tr>`: ''}
           </table>
       </td>
   </tr>
</table>
<br>
</div>`;
      this.feeStructureHtmlData += feeStructureTable;
    });
    this.getcommanFroalaData(quotationData, this.feeStructureHtmlData)
  }

}
