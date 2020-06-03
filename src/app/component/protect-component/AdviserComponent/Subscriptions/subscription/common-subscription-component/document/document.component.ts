import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionPopupComponent } from '../subscription-popup/subscription-popup.component';
import { SubscriptionService } from '../../../subscription.service';
import { AddDocumentComponent } from '../add-document/add-document.component';
// import { SubscriptionUpperSliderComponent } from '../../common-subscription-component/upper-slider/subscription-upper-slider.component';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { CommonFroalaComponent } from '../common-froala/common-froala.component';
import { EmailOnlyComponent } from '../email-only/email-only.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// import { window } from 'rxjs/operators';

// import {element} from 'protractor';
// import {timingSafeEqual} from 'crypto';
// declare var window;
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
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
  quotationDesignEmail: any;
  // @Input() upperData;

  advisorId;
  @Output() changeServiceData = new EventEmitter();

  /*@Input()*/
  documentDesign;
  planDocumentData = [{ selected: false }, { selected: false }, { selected: false }];
  serviceDocumentData = [{ selected: false }, { selected: false }, { selected: false }];
  mappedData = [];
  dataCount;
  sendESign: boolean = true;
  _clientData: any;
  _upperData: any;
  noData: string;
  componentFlag: any;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);


  constructor(public subInjectService: SubscriptionInject,
    private eventService: EventService, public dialog: MatDialog, private subService: SubscriptionService,
    public subscription: SubscriptionService, private router: Router, private location: Location) {
    // this.subInjectService.rightSliderDocument.subscribe(
    //   data => this.getDocumentsDesignData(data)
    // );
  }

  @Input()
  set upperData(upperData) {

    this._upperData = upperData;
    // setTimeout(() => {
    //   this.openPlanSliderFee(upperData, 'fixedFee', 'open');
    // }, 300);
  }

  get upperData(): any {
    return this._upperData;
  }

  @Input()
  set componentFlag1(data) {
    this.componentFlag = data
    this.advisorId = AuthService.getAdvisorId();
    if (data === 'plansDocuments') {
      this.getplanDocumentData();
    } else if (data === "servicesDocuments") {
      this.getServiceDocumentData();
    } else {
      return;
    }
  };

  @Input()
  set clientData(clientData) {
    this._clientData = clientData;
    this.advisorId = AuthService.getAdvisorId();
    this.getdocumentSubData();
  }

  get clientData() {
    return this._clientData;
  }

  displayedColumns: string[] = ['checkbox', 'document', 'plan', 'service', 'date', 'sdate', 'cdate', 'status', 'icons'];


  ngOnInit() {


    this.documentDesign = 'true';
    this.dataCount = 0;
  }

  getdocumentSubData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,

      // advisorId: 12345, // pass here advisor id for Invoice advisor
      // clientId: 79187,
      clientId: this.upperData.id,
      flag: 4
    };
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.subscription.getClientDocumentData(obj).subscribe(
      data => this.getDocumentResponseData(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  downloadEsign(element) {

    const obj = {
      id: element.id,
    };

    this.subscription.getEsignedDocument(obj).subscribe(
      data => this.downloadEsignResponseData(data),
      error => {
      }
    );
  }

  downloadEsignResponseData(data) {


    window.open(data.presginedUrl);
  }

  // openFragment(data, singleDocument) {
  //   (singleDocument == null) ? singleDocument = data : singleDocument.flag = data
  //   const fragmentData = {
  //     flag: 'openUpper',
  //     id: 1,
  //     data: singleDocument,
  //     direction: 'top',
  //     componentName: SubscriptionUpperSliderComponent,
  //     state: 'open'
  //   };

  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         this.getdocumentSubData();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }

  // openDocument(data) {
  //   const Fragmentdata = {
  //     flag: data,
  //   };
  //   const dialogRef = this.dialog.open(AddDocumentComponent, {
  //     width: '70%',
  //     data: Fragmentdata,
  //     autoFocus: false,

  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

  getDocumentResponseData(data) {
    this.isLoading = false;

    if (data == undefined) {
      this.dataSource.data = [];
      this.noData = "No Data Found";
    } else {
      data.forEach(singleData => {
        singleData.selected = false;
        singleData.documentText = singleData.docText;
      });
      // this.dataSource = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    }

  }

  openPopup(data) {
    const Fragmentdata = {
      flag: data,
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
    this.eventService.changeUpperSliderState({ state: 'close' });

    // this.dialogRef.close();
  }

  selectDocument(data) {
    (data.selected) ? this.unmapDocumentToPlan(data) : this.mapDocumentToPlan(data);
  }

  mapDocumentToPlan(data) {
    data.selected = true;
    this.mappedData.push(data);
  }

  unmapDocumentToPlan(data) {
    data.selected = false;
    // _.remove(this.mappedData, delData => delData.documentRepositoryId === data.documentRepositoryId);
    this.mappedData = this.mappedData.filter(delData => delData.documentRepositoryId != data.documentRepositoryId)
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
    this.isLoading = true;
    const obj = {
      // advisorId: 12345,
      advisorId: this.advisorId,
      planId: this.upperData.id
    };
    this.subService.getPlanDocumentsData(obj).subscribe(
      data => this.getplanDocumentDataResponse(data), error => {
        this.isLoading = false;
        this.planDocumentData = [];
      }
    );

  }

  openEsignDocument(element) {
    const data = {
      advisorId: this.advisorId,
      clientData: this._clientData,
      templateType: 3, // 1-Invoice, 2 is for quotation, 3 is for esign, 4 is document
      documentList: []
    };
    if (element) {
      data.documentList.push(element);

    } else {


      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          if (singleElement.signed) {
            this.sendESign = false;
          }
          data.documentList.push(singleElement);
        }
      });
    }
    this.openSendEmailComponent('eSignDocument', data);
  }

  openSendEmail() {
    const data = {
      advisorId: this.advisorId,
      clientData: this._clientData,
      templateType: 4, // 2 is for quotation
      documentList: []
    };
    this.dataSource.filteredData.forEach(singleElement => {
      if (singleElement.selected) {
        data.documentList.push(singleElement);
      }
    });
    this.openSendEmailComponent('email', data);
  }
  openSendEmailComponent(value, data) {
    if (this.isLoading) {
      return
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: EmailOnlyComponent
    };
    fragmentData.data.clientName = this._clientData.name;
    fragmentData.data.isDocument = true;
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getdocumentSubData();

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }
  // open(value, data) {

  //   // this.eventService.sliderData(value);
  //   // this.subInjectService.rightSliderData(state);
  //   // this.subInjectService.addSingleProfile(data);

  //   const fragmentData = {
  //     flag: value,
  //     data: data,
  //     id: 1,
  //     state: 'open',
  //     documentList: data
  //   };
  //   fragmentData.data.clientName = this._clientData.name;
  //   fragmentData.data.isDocument = true;
  //   const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         if (UtilService.isRefreshRequired(sideBarData)) {
  //           this.getdocumentSubData();

  //         }
  //         rightSideDataSub.unsubscribe();
  //       }
  //     }
  //   );
  // }
  open(value, data) {
    if (this.isLoading) {
      return
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    fragmentData.data.clientName = this._clientData.name;
    fragmentData.data.isDocument = true;
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getdocumentSubData();

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }
  getplanDocumentDataResponse(data) {
    this.isLoading = false;
    if (data !== undefined) {
      data.forEach(singleData => {
        singleData.isChecked = false;
        // singleData.docText = '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams.</h1>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams, he found himself transformed in his bed into \n' +
        //   'a horrible vermin. He lay on his armour-like back, \n' +
        //   'and if he lifted his head a little he could see his \n' +
        //   'brown belly, slightly domed and divided by arches into \n' +
        //   'stiff sections. The bedding was hardly able to cover \n' +
        //   '<strong>strong</strong> it and seemed ready to slide \n' +
        //   'off any moment. His many legs, pitifully thin \n' +
        //   'compared with the size of the rest of him, \n' +
        //   '<a class="external ext" href="#">link</a> waved about \n' +
        //   'helplessly as he looked. "What\'s happened to me? " he \n' +
        //   'thought. It wasn\'t a dream. His room, a proper human \n' +
        //   'room although a little too small, lay peacefully \n' +
        //   'between its four familiar walls.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams.</h1>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h2>The bedding was hardly able to cover it.</h2>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h2>The bedding was hardly able to cover it.</h2>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<ul>\n' +
        //   '  <li>Lorem ipsum dolor sit amet consectetuer.</li>\n' +
        //   '  <li>Aenean commodo ligula eget dolor.</li>\n' +
        //   '  <li>Aenean massa cum sociis natoque penatibus.</li>\n' +
        //   '</ul>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<form action="#" method="post">\n' +
        //   '  <fieldset>\n' +
        //   '    <label for="name">Name:</label>\n' +
        //   '    <input type="text" id="name" placeholder="Enter your \n' +
        //   'full name" />\n' +
        //   '\n' +
        //   '    <label for="email">Email:</label>\n' +
        //   '    <input type="email" id="email" placeholder="Enter \n' +
        //   'your email address" />\n' +
        //   '\n' +
        //   '    <label for="message">Message:</label>\n' +
        //   '    <textarea id="message" placeholder="What\'s on your \n' +
        //   'mind?"></textarea>\n' +
        //   '\n' +
        //   '    <input type="submit" value="Send message" />\n' +
        //   '\n' +
        //   '  </fieldset>\n' +
        //   '</form>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<table class="data">\n' +
        //   '  <tr>\n' +
        //   '    <th>Entry Header 1</th>\n' +
        //   '    <th>Entry Header 2</th>\n' +
        //   '    <th>Entry Header 3</th>\n' +
        //   '    <th>Entry Header 4</th>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry First Line 1</td>\n' +
        //   '    <td>Entry First Line 2</td>\n' +
        //   '    <td>Entry First Line 3</td>\n' +
        //   '    <td>Entry First Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry Line 1</td>\n' +
        //   '    <td>Entry Line 2</td>\n' +
        //   '    <td>Entry Line 3</td>\n' +
        //   '    <td>Entry Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry Last Line 1</td>\n' +
        //   '    <td>Entry Last Line 2</td>\n' +
        //   '    <td>Entry Last Line 3</td>\n' +
        //   '    <td>Entry Last Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '</table>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n';
      });

      this.planDocumentData = data;
      this.planDocumentData.forEach(element => {
        if (element.selected == true) {
          this.mappedData.push(element);
        }
      });

    } else {
      this.planDocumentData = [];
    }

  }

  getServiceDocumentData() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      serviceId: this.upperData.id
    };
    this.subService.getMapDocumentToService(obj).subscribe(
      data => {
        this.getServiceDocumentDataResponse(data);
      }
    );
  }

  getServiceDocumentDataResponse(data) {
    this.isLoading = false;
    if (data && data !== undefined) {
      this.serviceDocumentData = data.documentList;
      this.serviceDocumentData.forEach(element => {
        if (element.selected) {
          this.mappedData.push(element);
        }
        // element.docText = '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams.</h1>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams, he found himself transformed in his bed into \n' +
        //   'a horrible vermin. He lay on his armour-like back, \n' +
        //   'and if he lifted his head a little he could see his \n' +
        //   'brown belly, slightly domed and divided by arches into \n' +
        //   'stiff sections. The bedding was hardly able to cover \n' +
        //   '<strong>strong</strong> it and seemed ready to slide \n' +
        //   'off any moment. His many legs, pitifully thin \n' +
        //   'compared with the size of the rest of him, \n' +
        //   '<a class="external ext" href="#">link</a> waved about \n' +
        //   'helplessly as he looked. "What\'s happened to me? " he \n' +
        //   'thought. It wasn\'t a dream. His room, a proper human \n' +
        //   'room although a little too small, lay peacefully \n' +
        //   'between its four familiar walls.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h1>One morning, when Gregor Samsa woke from troubled \n' +
        //   'dreams.</h1>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h2>The bedding was hardly able to cover it.</h2>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<h2>The bedding was hardly able to cover it.</h2>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<ul>\n' +
        //   '  <li>Lorem ipsum dolor sit amet consectetuer.</li>\n' +
        //   '  <li>Aenean commodo ligula eget dolor.</li>\n' +
        //   '  <li>Aenean massa cum sociis natoque penatibus.</li>\n' +
        //   '</ul>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<form action="#" method="post">\n' +
        //   '  <fieldset>\n' +
        //   '    <label for="name">Name:</label>\n' +
        //   '    <input type="text" id="name" placeholder="Enter your \n' +
        //   'full name" />\n' +
        //   '\n' +
        //   '    <label for="email">Email:</label>\n' +
        //   '    <input type="email" id="email" placeholder="Enter \n' +
        //   'your email address" />\n' +
        //   '\n' +
        //   '    <label for="message">Message:</label>\n' +
        //   '    <textarea id="message" placeholder="What\'s on your \n' +
        //   'mind?"></textarea>\n' +
        //   '\n' +
        //   '    <input type="submit" value="Send message" />\n' +
        //   '\n' +
        //   '  </fieldset>\n' +
        //   '</form>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n' +
        //   '\n' +
        //   '\n' +
        //   '<table class="data">\n' +
        //   '  <tr>\n' +
        //   '    <th>Entry Header 1</th>\n' +
        //   '    <th>Entry Header 2</th>\n' +
        //   '    <th>Entry Header 3</th>\n' +
        //   '    <th>Entry Header 4</th>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry First Line 1</td>\n' +
        //   '    <td>Entry First Line 2</td>\n' +
        //   '    <td>Entry First Line 3</td>\n' +
        //   '    <td>Entry First Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry Line 1</td>\n' +
        //   '    <td>Entry Line 2</td>\n' +
        //   '    <td>Entry Line 3</td>\n' +
        //   '    <td>Entry Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '  <tr>\n' +
        //   '    <td>Entry Last Line 1</td>\n' +
        //   '    <td>Entry Last Line 2</td>\n' +
        //   '    <td>Entry Last Line 3</td>\n' +
        //   '    <td>Entry Last Line 4</td>\n' +
        //   '  </tr>\n' +
        //   '</table>\n' +
        //   '\n' +
        //   '\n' +
        //   '<p>It showed a lady fitted out with a fur hat and fur \n' +
        //   'boa who sat upright, raising a heavy fur muff that \n' +
        //   'covered the whole of her lower arm towards the \n' +
        //   'viewer.</p>\n';
      });

    } else {
      this.serviceDocumentData = [];
    }
  }

  deleteModal(data) {

    let list = [];
    if (data == null) {
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          list.push(singleElement.id);
        }
      });
    } else {
      list = [data.id];
    }
    const dialogData = {
      data: 'DOCUMENT',
      header: 'DELETE',
      body: list.length == 1 ? 'Are you sure you want to delete the document?' : 'Are you sure you want to delete these documents?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteClientDocumentsMultiple(list).subscribe(
          data => {
            this.eventService.openSnackBar('Document is deleted', 'Dismiss');
            // this.valueChange.emit('close');
            dialogRef.close(list);
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (result.length > 1) {
            if (!singleElement.selected) {
              tempList.push(singleElement);
            }
          } else {
            if (result[0] != singleElement.id) {
              tempList.push(singleElement);
            }
          }
        });
        this.dataSource.data = tempList;
      }
    });

  }

  saveMappingDocumentToPlans() {
    this.barButtonOptions.active = true;
    let obj = [];
    if (this.mappedData) {
      this.mappedData.forEach(element => {
        const data = {
          // advisorId: 12345,
          advisorId: this.advisorId,
          documentRepositoryId: element.documentRepositoryId,
          mappingId: this.upperData.id
        };
        obj.push(data);
      });
    }
    if (obj.length === 0) {
      obj = [
        {
          advisorId: this.advisorId,
          documentRepositoryId: 0,
          mappingId: this.upperData.id
        }
      ]
    }
    this.subService.mapDocumentsToPlanData(obj).subscribe(
      data => {
        if (data !== 204) {
          this.saveMappingDocumentToPlansResponse(data);
        }
        else if (data === 204) {
          this.eventService.openSnackBar('No documents created', 'Dismiss');
          this.barButtonOptions.active = false;
        }
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );

  }

  saveMappingDocumentToPlansResponse(data) {

    this.changeServiceData.emit(this.upperData);
    // this.eventService.changeUpperSliderState({ state: 'close' });
    if (this.mappedData.length == 0) {
      this.eventService.openSnackBar('No document mapped', 'Dismiss');
    } else {
      this.eventService.openSnackBar('Document is mapped', 'OK');
    }
    this.router.navigate(['/admin/subscription/settings', 'plans']);
    this.location.replaceState('/admin/subscription/settings/plans');
    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
    this.barButtonOptions.active = false;
  }

  savePlanMapToDocument() {
    let obj = [];
    if (this.mappedData) {
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
        data => { }
      );

    }
  }

  display(data) {
    this.ngOnInit();
  }

  mapDocumentToService() {
    this.barButtonOptions.active = true;
    let obj = [];
    if (this.mappedData.length == 0) {
      const data = {
        mappedType: 0,
        mappingId: this.upperData.id,
        id: 0,
        documentRepositoryId: 0,
        // advisorId: 12345
        advisorId: this.advisorId,
      };
      obj.push(data);
    } else {
      this.mappedData.forEach(element => {
        const data = {
          mappedType: element.mappedType,
          mappingId: element.mappingId,
          id: element.id,
          documentRepositoryId: element.documentRepositoryId,
          // advisorId: 12345
          advisorId: this.advisorId,
        };
        obj.push(data);
      });
    }


    this.subService.mapServiceToDocument(obj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.mapDocumentToServiceResponse(data);
      },
      err => {
        this.barButtonOptions.active = false;
      }
    );

  }

  mapDocumentToServiceResponse(data) {
    if (this.mappedData.length === 0) {
      this.eventService.openSnackBar('No documents mapped', 'Dismiss');
    } else {
      this.eventService.openSnackBar('Documents mapped', 'OK');
    }
    this.changeServiceData.emit(this.upperData);
    this.router.navigate(['/admin/subscription/settings', 'services']);
    this.location.replaceState('/admin/subscription/settings/services');

    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

  selectAll(event) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }
  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   if (this.dataSource != undefined) {
  //     return this.dataCount === this.dataSource.filteredData.length;
  //   }
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selectAll({ checked: false }) : this.selectAll({ checked: true });
  // }
}
