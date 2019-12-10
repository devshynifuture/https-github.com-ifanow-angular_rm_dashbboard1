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
  display(data){
    this.getDocumentsSetting();
  }
  getDocumentsSettingResponse(data) {
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
