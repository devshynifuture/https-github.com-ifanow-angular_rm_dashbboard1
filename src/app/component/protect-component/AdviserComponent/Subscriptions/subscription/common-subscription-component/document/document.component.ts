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
import {element} from 'protractor';
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

  /*@Input()*/
  documentDesign;
  planDocumentData;
  serviceDocumentData;
  mappedData = [];
  dataCount;

  constructor(public subInjectService: SubscriptionInject,
              private eventService: EventService, public dialog: MatDialog, private subService: SubscriptionService,
              public subscription: SubscriptionService) {
    // this.subInjectService.rightSliderDocument.subscribe(
    //   data => this.getDocumentsDesignData(data)
    // );
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
      data => this.getDocumentResponseData(data)
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

  getDocumentResponseData(data) {
    console.log(data);
    if (data) {
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
      singleData.docText = '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams.</h1>\n' +
        '\n' +
        '\n' +
        '<p>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams, he found himself transformed in his bed into \n' +
        'a horrible vermin. He lay on his armour-like back, \n' +
        'and if he lifted his head a little he could see his \n' +
        'brown belly, slightly domed and divided by arches into \n' +
        'stiff sections. The bedding was hardly able to cover \n' +
        '<strong>strong</strong> it and seemed ready to slide \n' +
        'off any moment. His many legs, pitifully thin \n' +
        'compared with the size of the rest of him, \n' +
        '<a class="external ext" href="#">link</a> waved about \n' +
        'helplessly as he looked. "What\'s happened to me? " he \n' +
        'thought. It wasn\'t a dream. His room, a proper human \n' +
        'room although a little too small, lay peacefully \n' +
        'between its four familiar walls.</p>\n' +
        '\n' +
        '\n' +
        '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams.</h1>\n' +
        '\n' +
        '\n' +
        '<h2>The bedding was hardly able to cover it.</h2>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<h2>The bedding was hardly able to cover it.</h2>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<ul>\n' +
        '  <li>Lorem ipsum dolor sit amet consectetuer.</li>\n' +
        '  <li>Aenean commodo ligula eget dolor.</li>\n' +
        '  <li>Aenean massa cum sociis natoque penatibus.</li>\n' +
        '</ul>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<form action="#" method="post">\n' +
        '  <fieldset>\n' +
        '    <label for="name">Name:</label>\n' +
        '    <input type="text" id="name" placeholder="Enter your \n' +
        'full name" />\n' +
        '\n' +
        '    <label for="email">Email:</label>\n' +
        '    <input type="email" id="email" placeholder="Enter \n' +
        'your email address" />\n' +
        '\n' +
        '    <label for="message">Message:</label>\n' +
        '    <textarea id="message" placeholder="What\'s on your \n' +
        'mind?"></textarea>\n' +
        '\n' +
        '    <input type="submit" value="Send message" />\n' +
        '\n' +
        '  </fieldset>\n' +
        '</form>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<table class="data">\n' +
        '  <tr>\n' +
        '    <th>Entry Header 1</th>\n' +
        '    <th>Entry Header 2</th>\n' +
        '    <th>Entry Header 3</th>\n' +
        '    <th>Entry Header 4</th>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry First Line 1</td>\n' +
        '    <td>Entry First Line 2</td>\n' +
        '    <td>Entry First Line 3</td>\n' +
        '    <td>Entry First Line 4</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry Line 1</td>\n' +
        '    <td>Entry Line 2</td>\n' +
        '    <td>Entry Line 3</td>\n' +
        '    <td>Entry Line 4</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry Last Line 1</td>\n' +
        '    <td>Entry Last Line 2</td>\n' +
        '    <td>Entry Last Line 3</td>\n' +
        '    <td>Entry Last Line 4</td>\n' +
        '  </tr>\n' +
        '</table>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n';
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
    this.serviceDocumentData.forEach(element => {
      if (element.selected) {
        this.mappedData.push(element)
      }
      element.docText = '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams.</h1>\n' +
        '\n' +
        '\n' +
        '<p>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams, he found himself transformed in his bed into \n' +
        'a horrible vermin. He lay on his armour-like back, \n' +
        'and if he lifted his head a little he could see his \n' +
        'brown belly, slightly domed and divided by arches into \n' +
        'stiff sections. The bedding was hardly able to cover \n' +
        '<strong>strong</strong> it and seemed ready to slide \n' +
        'off any moment. His many legs, pitifully thin \n' +
        'compared with the size of the rest of him, \n' +
        '<a class="external ext" href="#">link</a> waved about \n' +
        'helplessly as he looked. "What\'s happened to me? " he \n' +
        'thought. It wasn\'t a dream. His room, a proper human \n' +
        'room although a little too small, lay peacefully \n' +
        'between its four familiar walls.</p>\n' +
        '\n' +
        '\n' +
        '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        'dreams.</h1>\n' +
        '\n' +
        '\n' +
        '<h2>The bedding was hardly able to cover it.</h2>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<h2>The bedding was hardly able to cover it.</h2>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<ul>\n' +
        '  <li>Lorem ipsum dolor sit amet consectetuer.</li>\n' +
        '  <li>Aenean commodo ligula eget dolor.</li>\n' +
        '  <li>Aenean massa cum sociis natoque penatibus.</li>\n' +
        '</ul>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<form action="#" method="post">\n' +
        '  <fieldset>\n' +
        '    <label for="name">Name:</label>\n' +
        '    <input type="text" id="name" placeholder="Enter your \n' +
        'full name" />\n' +
        '\n' +
        '    <label for="email">Email:</label>\n' +
        '    <input type="email" id="email" placeholder="Enter \n' +
        'your email address" />\n' +
        '\n' +
        '    <label for="message">Message:</label>\n' +
        '    <textarea id="message" placeholder="What\'s on your \n' +
        'mind?"></textarea>\n' +
        '\n' +
        '    <input type="submit" value="Send message" />\n' +
        '\n' +
        '  </fieldset>\n' +
        '</form>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n' +
        '\n' +
        '\n' +
        '<table class="data">\n' +
        '  <tr>\n' +
        '    <th>Entry Header 1</th>\n' +
        '    <th>Entry Header 2</th>\n' +
        '    <th>Entry Header 3</th>\n' +
        '    <th>Entry Header 4</th>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry First Line 1</td>\n' +
        '    <td>Entry First Line 2</td>\n' +
        '    <td>Entry First Line 3</td>\n' +
        '    <td>Entry First Line 4</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry Line 1</td>\n' +
        '    <td>Entry Line 2</td>\n' +
        '    <td>Entry Line 3</td>\n' +
        '    <td>Entry Line 4</td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>Entry Last Line 1</td>\n' +
        '    <td>Entry Last Line 2</td>\n' +
        '    <td>Entry Last Line 3</td>\n' +
        '    <td>Entry Last Line 4</td>\n' +
        '  </tr>\n' +
        '</table>\n' +
        '\n' +
        '\n' +
        '<p>It showed a lady fitted out with a fur hat and fur \n' +
        'boa who sat upright, raising a heavy fur muff that \n' +
        'covered the whole of her lower arm towards the \n' +
        'viewer.</p>\n';
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
        mappingId:1
      };
      obj.push(data);
    });
    this.subService.mapDocumentsToPlanData(obj).subscribe(
      data => this.saveMappingDocumentToPlansResponse(data)
    );

  }

  saveMappingDocumentToPlansResponse(data) {
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
