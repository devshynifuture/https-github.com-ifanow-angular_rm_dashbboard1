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
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
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
  feeStructureHtmlData = '';
  quotationData: any;
  saveQuotationFlag: any;
  sendEmailFlag: any;

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
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
  };

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
    this.sendEmailFlag = data.sendEsignFlag;
    this.saveQuotationFlag = data.quotationFlag;
    this.getcommanFroalaData(data);
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

  getcommanFroalaData(data) {
    this.storeData = Object.assign({}, data);
    const obj = {
      clientName: this.storeData.clientName,
      clientAddress: '',
      advisorName: AuthService.getUserInfo().name,
      advisorAddress: ''
    };
    this.storeData.documentText = this.utilService.replacePlaceholder(this.storeData.documentText, obj);
  }

  Close(data, flag) {
    // if (this.showActivityLog == true) {
    //   this.showActivityLog = false;
    // } else {
    //   this.subInjectService.rightSideData(value);
    // }
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: flag });
    this.subInjectService.changeUpperRightSliderState({ state: 'close', data, refreshRequired: flag });
    if (flag != close && this.storeData.quotation) {
      this.subInjectService.addSingleProfile('true');
    }
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
    this.inputData.sendEsign = true;
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
    } else {
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
    let docName: string = this.storeData.documentName;
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
    this.barButtonOptions.active = true;
    const obj = {
      planId: this.storeData.planId,
      documentRepositoryId: this.storeData.documentRepositoryId,
      clientId: this.storeData.clientId,
      advisorId: this.advisorId,
      documentText: this.storeData.documentText
    };
    this.subscription.createQuotation(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar('Quotation added sucessfully', 'Dismiss');
        this.Close('close', true);
      },
      err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }


}
