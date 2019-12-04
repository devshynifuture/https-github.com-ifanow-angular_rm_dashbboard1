import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';
import {ModifyFeeDialogComponent} from '../../common-subscription-component/modify-fee-dialog/modify-fee-dialog.component';
import {AuthService} from "../../../../../../../auth-service/authService";
import {UtilService} from "../../../../../../../services/util.service";

// import {CustomHtmlComponent} from "../../../../../../../common/customhtml.component";

@Component({
  selector: 'app-documents-settings',
  templateUrl: './documents-settings.component.html',
  styleUrls: ['./documents-settings.component.scss']
})
export class DocumentsSettingsComponent implements OnInit {
  button: any;
  documentSettingData;
  showLoader;

  constructor(public dialog: MatDialog, public eventService: EventService, public subInjectService: SubscriptionInject,
              private subService: SubscriptionService) {
  }

  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    // this.openFragment('documents');
    this.getDocumentsSetting();
  }

  getDocumentsSetting() {
    this.showLoader = true;
    const obj = {
      advisorId: this.advisorId,

      // "advisorId": 2735
    };
    // const data = [{}, {}, {}];
    // this.getDocumentsSettingResponse(data);
    this.subService.getSubscriptionDocumentSetting(obj).subscribe(
      data => this.getDocumentsSettingResponse(data)
    )
  }

  getDocumentsSettingResponse(data) {
    data.forEach(singleData => {
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
    console.log(data);
    this.documentSettingData = data;
    this.showLoader = false;
  }

  Open(value, state) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
  }

  openFragment(data, singleDocument) {
    (singleDocument==undefined)?singleDocument=data:singleDocument.flag=data
    // // singleDocument.flag = data;
    const fragmentData = {
      flag: 'app-subscription-upper-slider',
      data: singleDocument,
      id: 1,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          this.getDocumentsSetting();
          subscription.unsubscribe();
        }
      }
    );
    // if (singleDocument.flag == 'documents') {
     
    //   // this.eventService.changeUpperSliderState(fragmentData);


    // } else {
    //   const dialogRef = this.dialog.open(ModifyFeeDialogComponent, {
    //     width: '1400px',
    //     data: fragmentData,
    //     autoFocus: false,
    //     panelClass: 'dialogBox',
    //     //  position: {
    //     //    top: `30px`,
    //     //    right: `40px`
    //     //   },
    //     // openFrom:'{
    //     //   top: -50,
    //     //   width: 30,
    //     //   height: 80
    //     // }',
    //     // closeTo({
    //     //   left: 1500
    //     // })
    //     // hasBackdrop: false,
    //   });

    //   dialogRef.afterClosed().subscribe(result => {

    //   });
    // }

  }
}
