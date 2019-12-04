import {Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {FormGroup, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {HowToUseDialogComponent} from '../how-to-use-dialog/how-to-use-dialog.component';
import {MatDialog} from '@angular/material';
import {SubscriptionService} from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';

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
  model: any;
  dataSub: any;
  storeData: any;
  _upperData: any;
  dataTerms: any;

  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog, public subService: SubscriptionService,private eventService:EventService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getcommanFroalaData(data)
    );
  }

  @Input() quotationDesignE;
  @Input() componentFlag: string;
  @Output() valueChange = new EventEmitter();
  mailForm = new FormGroup({
    mail_body: new FormControl(''),

  });
  @Input()
  set upperData(upperData) {
    this._upperData = upperData;
    console.log('Terms and agreemennt upperData: ', upperData);
    this.getDataTerms(upperData)
    if (upperData && upperData.documentData) {
      // this.changeDisplay();
    }
  };

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
  //       console.log('froalaEditorContent: ', this.froalaEditorContent);
  //       console.log('editor: ', editor);
  //
  //       console.log('e: ', e);
  //
  //       console.log(editor.selection.get());
  //     }
  //   }
  // };

  ngOnInit() {
    console.log('quotationDesign', this._upperData);
  }

  Close() {
    // this.subInjectService.rightSideData(value);
    // this.valueChange.emit(this.quotationDesignE);
    this.eventService.changeUpperSliderState({state: 'close'});

  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.mailForm.value);
  }
  getDataTerms(data){
    this.dataTerms = data.documentData
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
  OpenEdit(data){
    const fragmentData = {
      flag: 'addEditDocument',
      data: this._upperData.documentData,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        // console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          // console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  updateData(data) {
    const obj = {
      id: data.documentRepositoryId, // pass here advisor id for Invoice advisor
      docText: data.docText
    };
    this.subService.updateDocumentData(obj).subscribe(
      data => this.getResponseData(data)
    );
  }

  getResponseData(data) {
    console.log(data);
    if(data == 1){
      this.eventService.openSnackBar("Document updated successfully","OK")
    }
    this.eventService.changeUpperSliderState({state: 'close'});
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
    console.log(data);

  }
}
