import { UtilService } from './../../../../services/util.service';
import { SubscriptionInject } from './../Subscriptions/subscription-inject.service';
import { ComposeEmailComponent } from './email-component/compose-email/compose-email.component';
import { appConfig } from 'src/app/config/component-config';
import { AuthService } from './../../../../auth-service/authService';
import { BehaviorSubject, throwError } from 'rxjs';
import { apiConfig } from './../../../../config/main-config';
import { HttpService } from './../../../../http-service/http-service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailAddTaskComponent } from './email-component/email-list/email-add-task/email-add-task.component';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private dataSourceOneMailView = new BehaviorSubject<Object>('');
  data = this.dataSourceOneMailView.asObservable();
  paginatorLength;
  constructor(public https: HttpClient,
    public http: HttpService,
    private authService: AuthService,
    private subInjectService: SubscriptionInject) { }

  getPaginatorLength() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_PROFILE, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  deleteThreadsFromTrashForever(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.DELETE_MULTIPLE_THREADS, {
      ids: ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  // needs to work on ids 
  deleteMessageFromView(ids?: string) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.DELETE_MESSAGES, {
      ids: ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  moveThreadsToTrashFromList(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_THREADS_TO_TRASH, {
      ids: ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  // id param to work on
  moveMessageToTrashFromView(ids?: string) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_MESSAGES_TO_TRASH, {
      ids: ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  // move gmail inbox threads to list
  moveThreadsFromTrashToList(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_THREADS_FROM_TRASH, {
      ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  // need to work on ids 
  moveMessagesFromTrashToList(ids?: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_MESSAGES_FROM_TRASH, {
      ids,
      emailId: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  getMailInboxList(labelIds: string, maxResults: number = 50, pageToken: string = '') {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_GMAIL_INBOX_LIST, {
      email: userInfo.emailId,
      userId: userInfo.advisorId,
      labelIds,
      maxResults,
      pageToken
    });
  }

  getRightSideNavList() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_RIGHT_SIDE_NAV, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  createUpdateDraft(body) {
    const userInfo = AuthService.getUserInfo();
    return this.http.post(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, {
      email: userInfo.emailId,
      userId: userInfo.advisorId,
      ...body
    });
  }

  openEmailAddTask(data) {
    const fragmentData = {
      flag: 'addEmailTask',
      data,
      id: 1,
      state: 'open35',
      componentName: EmailAddTaskComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openComposeEmail(data) {
    const fragmentData = {
      flag: 'composeEmail',
      data,
      id: 1,
      state: 'open35',
      componentName: ComposeEmailComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }

  getEmailList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailDraftList() {

    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_DRAFT_LIST, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }



  sendNextData(data: Object) {
    this.dataSourceOneMailView.next(data);
  }
}
