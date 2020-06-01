import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { EnumDataService } from '../../../../../services/enum-data.service';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionDataService } from '../subscription-data.service';
import { apiConfig } from '../../../../../config/main-config';
import { appConfig } from '../../../../../config/component-config';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  settingIndex: number;
  _value: number;
  set value(value: number) {
    this._value = value;
  }

  @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;

  constructor(private utilservice: UtilService, private eventService: EventService, private enumDataService: EnumDataService, private router: Router, private subService: SubscriptionService, private route: ActivatedRoute) {
    this.eventService.sidebarSubscribeData.subscribe(
      data => this.getFileResponseDataAum(data)
    );
    this.eventService.tabChangeData.subscribe(
      data => this.getTabChangeData(data)
    );
  }

  subscriptionTab;
  setLabel: boolean = false;
  selected: any;
  label: any = 'plans';

  ngOnInit() {
    this.enumDataService.getClientRole();
    // this.getActiveParam();
    // this.route.paramMap.subscribe(params => {
    //   if(this.label != 'plans'){
    //   this.label = params.get("label");
    //   }else{
    //     params.get("label")
    //   }
    // })

    // this.currentState = 'close';
    this.enumDataService.getDataForSubscriptionEnumService();
    this.selected = 1;
    if (this.router.url.split('/')[3] === 'dashboard') {
      this._value = 1;
    } else if (this.router.url.split('/')[3] === 'clients') {
      this._value = 2;
    } else if (this.router.url.split('/')[3] === 'subscriptions') {
      this._value = 3;
    } else if (this.router.url.split('/')[3] === 'quotations') {
      this._value = 4;
    } else if (this.router.url.split('/')[3] === 'invoices') {
      this._value = 5;
    } else if (this.router.url.split('/')[3] === 'documents') {
      this._value = 6;
    } else if (this.router.url.split('/')[3] === 'settings') {
      this._value = 7;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.subService.getDashboardSubscriptionResponse(this.advisorId).subscribe(
      data => {
        SubscriptionDataService.setLoderFlag(data.advisorAccomplishedSubscriptionFinalList);
      }
    );
    // this.selected = 6;
  }

  getFileDetails(e) {
    const file = e.target.files[0];
    const requestMap = {
      tpUserRequestId: 1,
      documentType: 1
    };
    // this.byte = this.file.arrayBuffer();
    FileUploadService.uploadFileToServer(apiConfig.TRANSACT + appConfig.UPLOAD_FILE_IMAGE,
      file, requestMap, (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

        if (status == 200) {
          const responseObject = JSON.parse(response);

        }

      });
  }

  activeParam;
  // getActiveParam(){
  //  this.activeParam = this.eventService.activeParam.subscribe((active)=>{
  //     this.label = active;
  //   })
  // }


  isLinkActive(): boolean {

    return 'settings' === this.router.url.split('/')[3];
  }

  // ngDoCheck(){
  //   this.route.paramMap.subscribe(params => {
  //     if(this.label == 'plans'){
  //     this.label = params.get("label");
  //     }else{
  //       params.get("label")
  //     }
  //   })
  // }
  advisorId(advisorId: any) {
    throw new Error('Method not implemented.');
  }

  getIndex(value) {
    if (value.selectedSettingTab) {
      this.tabGroup.selectedIndex = value.selectedTab;
      this.settingIndex = value;
    }
    // this.selected=index
  }

  getFileResponseDataAum(data) {
    this.subscriptionTab = data;
  }

  getTabChangeData(data) {
    this._value = data;
    // if(data==1){
    //   this._value=2;
    // } else if(data==3){
    //   this._value=4;
    // }else if(data==4){
    //   this._value=5
    // }else if(data==5){
    //   this._value=6;
    // }else if(){}
    // if(data=="")
    // {
    //   return
    // }
    // this.tabGroup.selectedIndex=6
    // if(data==6)
    // {
    //   this.settingIndex=3
    // }
  }

  tabClick(event) {
    this.eventService.sidebarData(event.tab.textLabel);
    if (event.index != 6) {
      this.settingIndex = 0;
    }
  }

  help() {

  }
}
