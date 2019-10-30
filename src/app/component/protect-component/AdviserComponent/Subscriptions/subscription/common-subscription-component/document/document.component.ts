import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionPopupComponent} from '../subscription-popup/subscription-popup.component';
import {SubscriptionService} from '../../../subscription.service';
import * as _ from 'lodash';
import {AddDocumentComponent} from '../add-document/add-document.component';
import {AuthService} from "../../../../../../../auth-service/authService";
import { element } from 'protractor';
// import {element} from 'protractor';
// import {timingSafeEqual} from 'crypto';

export interface PeriodicElement {
  selected: any;
  document: string;
  plan: string;
  service: string;
  date: string;
  sdate: string;
  cdate: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    selected: '',
    document: 'Scope of work',
    plan: 'Starter plan',
    service: 'AUM Linked fee',
    date: '25/08/2019',
    sdate: '25/08/2019',
    cdate: '25/08/2019',
    status: 'READY TO SEND'
  },

];

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  quotationDesignEmail: any;
  @Input() upperData;

  advisorId;

  documentDesign;
  planDocumentData;
  serviceDocumentData;
  mappedData = [];
  dataCount;

  constructor(public subInjectService: SubscriptionInject,
              private eventService: EventService, public dialog: MatDialog, private subService: SubscriptionService,
              public subscription: SubscriptionService) {
    this.subInjectService.rightSliderDocument.subscribe(
      data => this.getDocumentsDesignData(data)
    );
  }
  @Input() componentFlag: string;

  displayedColumns: string[] = ['checkbox', 'document', 'plan', 'service', 'date', 'sdate', 'cdate', 'status', 'icons'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getplanDocumentData();
    this.getServiceDocumentData();
    this.getdocumentSubData();
    this.documentDesign = 'true';
    console.log('upperData', this.upperData);
    this.dataCount = 0;
  }

  getdocumentSubData() {
    const obj = {
      advisorId: this.advisorId,

      // advisorId: 12345, // pass here advisor id for Invoice advisor
      // clientId: 79187,
      clientId: this.upperData.id,
      flag: 4
    };

    this.subscription.getDocumentData(obj).subscribe(
      data => this.getdocumentResponseData(data)
    );
  }

  openDocument(data) {
    const Fragmentdata = {
      Flag: data,
    };
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '70%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getdocumentResponseData(data) {
    console.log(data);
    if(data==undefined)
    {
      return
    }
    else{
      data.forEach(singleData => {
        singleData.documentText = singleData.docText;
      });
      this.dataSource = data;
     }
    
  }

  openPopup(data) {
    const Fragmentdata = {
      Flag: data,
    };
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      width: '70%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  dialogClose() {
    this.eventService.changeUpperSliderState({state: 'close'});

    // this.dialogRef.close();
  }

  selectDocument(data) {
    (data.selected) ? this.unmapDocumentToPlan(data) : this.mapDocumentToPlan(data);
  }

  mapDocumentToPlan(data) {
    data.selected = true;
    this.mappedData.push(data);
    console.log(this.mappedData.length);
  }

  unmapDocumentToPlan(data) {
    data.selected = false;
    _.remove(this.mappedData, delData => delData.documentRepositoryId === data.documentRepositoryId);
    console.log(this.mappedData.length);
  }

  openDocumentESign(value, state) {
    this.subInjectService.rightSliderData(state);
    this.eventService.sliderData(value);
  }

  getDocumentsDesignData(data) {
    this.documentDesign = data;
  }

  changeDisplay(value, data) {
    this.documentDesign = value;
    this.quotationDesignEmail = this.documentDesign;
    this.subInjectService.addSingleProfile(data);
  }

  getplanDocumentData() {
    const obj = {
      // advisorId: 12345,
      advisorId: this.advisorId,
      planId: this.upperData.id
    };
    this.subService.getPlanDocumentsData(obj).subscribe(
      data => this.getplanDocumentDataResponse(data)
    );

  }

  getplanDocumentDataResponse(data) {
    data.forEach(singleData => {
      singleData.isChecked = false;
    });
    console.log('document Data', data);
    this.planDocumentData = data;
    this.planDocumentData.forEach(element => {
      if (element.selected == true) {
        this.mappedData.push(element);
      }
    });

  }

  getServiceDocumentData() {
    const obj = {
      advisorId: this.advisorId,
      serviceId: this.upperData.id
    };
    this.subService.getMapDocumentToService(obj).subscribe(
      data => this.getServiceDocumentDataResponse(data)
    );
  }

  getServiceDocumentDataResponse(data) {
    console.log('service Documents', data.documentList);
    this.serviceDocumentData = data.documentList;
    this.serviceDocumentData.forEach(element=>{
      if(element.selected)
      {
       this.mappedData.push(element)
      }
    })
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
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

  saveMappingDocumentToPlans() {

      const obj = [];
      this.mappedData.forEach(element => {
        const data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          documentRepositoryId: element.documentRepositoryId,
          mappingId: this.upperData.id
        };
        obj.push(data);
      });
      this.subService.mapDocumentsToPlanData(obj).subscribe(
        data => this.saveMappingDocumentToPlansResponse(data)
      );

  }
  saveMappingDocumentToPlansResponse(data)
  {
    this.eventService.changeUpperSliderState({state: 'close'});
    this.eventService.openSnackBar('Document is mapped', 'OK');
  }
  savePlanMapToDocument() {
    const obj = [];
    this.mappedData.forEach(element => {
      const data = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        documentRepositoryId: element.documentRepositoryId,
        planId: 10
      };
      obj.push(data);
    });
    this.subService.mapDocumentsToPlanData(obj).subscribe(
      data => console.log(data)
    );
  }

  display(data) {
    console.log(data);
    this.ngOnInit();
  }

  mapDocumentToService() {
   
      const obj = [];
      this.mappedData.forEach(element => {
        const data = {
          mappedType: 2,
          mappingId: element.mappingId,
          id: element.id,
          documentRepositoryId: element.documentRepositoryId,
          // advisorId: 12345
          advisorId: this.advisorId,
        };
        obj.push(data);
      });
      this.subService.mapDocumentToService(obj).subscribe(
        data => this.mapDocumentToServiceResponse(data)
      );
    
  }

  mapDocumentToServiceResponse(data) {
    console.log(data);
    this.eventService.openSnackBar('Document is mapped', 'OK');

  }

  selectAll(event) {
    // const checked = event.target.checked;
    // this.dataSource.forEach(item => item.selected = 'checked');
    this.dataCount = 0;
    this.dataSource.forEach(item => {
      //   if(item.selected==false)
      //   {
      //     item.selected = true;
      //     this.dataCount++;
      //   }else{
      //     item.selected = false;
      //     this.dataCount--;
      //   }
      // });
      item.selected = event.checked;
      if (item.selected) {
        this.dataCount++;
      }
      // if(item.dataCountd>=1){
      //   this.dataCount=1
      // }else{
      //   this.dataCount++
      // }
    });
    // if(item.selected=="true"){
    //   this.dataCount++;
    // }else{
    //   this.dataCount--;
    // }

  }

  changeSelect(data) {
    this.dataCount = 0;
    this.dataSource.forEach(item => {
      console.log('item item ', item);
      if (item.selected) {
        this.dataCount++;
      }
    });
    // if(data.selected==false)
    // {
    //   data.selected = true;
    //   this.dataCount++;
    //   data.dataCountd =this.dataCount;
    // }else{
    //   data.selected = false;
    //   this.dataCount--;
    //   data.dataCountd =this.dataCount;
    // }
  }
}
