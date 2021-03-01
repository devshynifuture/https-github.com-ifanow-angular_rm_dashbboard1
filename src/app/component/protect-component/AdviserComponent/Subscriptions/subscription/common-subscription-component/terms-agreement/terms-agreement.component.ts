import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { HowToUseDialogComponent } from '../how-to-use-dialog/how-to-use-dialog.component';
import { MatDialog, TooltipPosition } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Router } from '@angular/router';
import { escapeRegExp, UtilService } from 'src/app/services/util.service';
import { HttpClient } from '@angular/common/http';
import { tableHtml } from './document-preview';
import { DocumentPreviewComponent } from '../document-preview/document-preview.component';
import { AddEditDocumentComponent } from '../add-edit-document/add-edit-document.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-terms-agreement',
  templateUrl: './terms-agreement.component.html',
  styleUrls: ['./terms-agreement.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TermsAgreementComponent),
      multi: true
    }
  ]
})
export class TermsAgreementComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
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
  isRefresh: boolean = true;
  model: any;
  dataSub: any;
  storeData: any;
  _upperData: any;
  dataTerms: any;
  advisorId: () => any;
  serviceData: any;
  @Output() changePlanData = new EventEmitter();
  placeholderList: any;
  placeHolderLoader: boolean;

  constructor(private route: Router, public subInjectService: SubscriptionInject, public dialog: MatDialog,
    public subService: SubscriptionService, private eventService: EventService, private render: Renderer2,
    private http: HttpClient, private utilservice: UtilService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getcommanFroalaData(data)
    );
  }

  matTooltipOption: TooltipPosition[] = ['above'];
  @Input() quotationDesignE;
  @Input() componentFlag: string;
  @Output() valueChange = new EventEmitter();
  mailForm = new FormGroup({
    mail_body: new FormControl(''),

  });

  @Input()
  set upperData(upperData) {
    this._upperData = upperData;
    this.isRefresh = false
    this.getDocumentPlaceholderList(upperData.documentData)
    this.getDataTerms(upperData);
    if (upperData && upperData.documentData) {
      // this.changeDisplay();
    }
    this.advisorId = AuthService.getAdvisorId();
    this.getPlanServiceData();
  }

  get upperData() {
    return this._upperData;
  }

  // private froalaEditorContent = 'This is Intial Data';
  // public froalaEditorOptions = {
  //   placeholder: 'Edit Me',
  //   charCounterCount: false,
  //
  //   events: {
  //     focus(e, editor) {
  //
  //
  //     }
  //   }
  // };

  ngOnInit() {

  }

  Close() {
    // this.subInjectService.rightSideData(value);
    // this.valueChange.emit(this.quotationDesignE);
    // this.eventService.changeUpperSliderState({ state: 'close' ,});
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: false });


  }
  getDocumentPlaceholderList(data) {
    this.placeHolderLoader = true
    const obj =
    {
      availableAt: data.availableAt,
      documentTypeId: data.documentTypeId
    }
    this.subService.getDocumentPlaceholder(obj).subscribe(
      data => {
        if (data) {
          this.placeHolderLoader = false
          this.placeholderList = data
        }
      }
    )
  }
  getPlanServiceData() {
    const obj = {
      // advisorId: 12345,
      advisorId: this.advisorId,
      planId: this._upperData.documentData.planId
      // this.planData ? this.planData.id : null
    };
    this.subService.getSettingPlanServiceData(obj).subscribe(
      data => this.serviceData = data,
      err => this.eventService.openSnackBar('Something went wrong', 'Dismiss')
    );
  }

  copyName(data) {
    const text = data.currentTarget.childNodes[0].innerHTML;
    const tag = this.render.createElement('input');
    tag.value = text;
    document.body.appendChild(tag);
    tag.focus();
    tag.select();
    document.execCommand('copy');
    document.body.removeChild(tag);
    this.eventService.openSnackBar('Text copied', 'Dismiss');
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
  }

  getDataTerms(data) {
    this.dataTerms = data.documentData;
  }

  openDocumentPreview() {
    // const obj = {
    //   documentRepositoryId: this._upperData.documentData.documentRepositoryId
    // };
    // this.subService.getQuotationServiceData(obj).subscribe(
    // );
    let d = new Date();
    this.serviceData.forEach(element => {
      this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(service_' + element.id + ')'), 'g'),
        element.serviceName);
      this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(client_name)'), 'g'),
        'Ronak Hindocha');
      this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(service_fee_' + element.id + ')'), 'g'),
        tableHtml);
      this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(advisor_name)'), 'g'), 'Ronak Hindocha')
      this.dataTerms.docText = this.dataTerms.docText.replace(new RegExp(escapeRegExp('$(date)'), 'g'),
        d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear())
    });
    let obj =
    {
      data: this.dataTerms.docText,
      cancelButton: () => {
        this.utilservice.htmlToPdf('', this.dataTerms.docText, 'document', '', this.dataTerms.docText, '', '', false, null);
        dialogRef.close();
      }
    }
    const dialogRef = this.dialog.open(DocumentPreviewComponent, {
      width: '65vw',
      height: '900px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  openDialog(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(HowToUseDialogComponent, {
      width: '30%',
      data: Fragmentdata,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  OpenEdit(data) {
    const fragmentData = {
      flag: 'quotations',
      data: this._upperData.documentData,
      id: 1,
      state: 'open',
      componentName: AddEditDocumentComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.data) {
            this.upperData = sideBarData.data
            this._upperData = sideBarData.data
            this.changePlanData.emit(this.upperData)
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  updateData(data) {
    this.barButtonOptions.active = true;
    const obj = {
      advisorId: data.advisorId,
      availableAt: data.availableAt,
      description: data.description,
      docText: data.docText,
      documentRepositoryId: data.documentRepositoryId, // pass here advisor id for Invoice advisor
      documentTypeId: data.documentTypeId,
      name: data.name,
    };
    this.subService.updateDocumentData(obj).subscribe(
      responseData => {
        this.isRefresh = true
        this.getResponseData(responseData)
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );
  }
  getResponseData(data) {
    this.barButtonOptions.active = false;
    if (data == 1) {
      this.eventService.openSnackBar('Document added successfully', 'OK');
    }
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: this.isRefresh });
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

  getcommanFroalaData(data) {
    this.storeData = data;
  }

  saveData(data) {

  }
}
