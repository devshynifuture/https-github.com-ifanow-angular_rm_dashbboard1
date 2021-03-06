import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UtilService } from './../../../../services/util.service';
import { SubscriptionInject } from './../Subscriptions/subscription-inject.service';
import { appConfig } from 'src/app/config/component-config';
import { AuthService } from './../../../../auth-service/authService';
import { BehaviorSubject } from 'rxjs';
import { apiConfig } from './../../../../config/main-config';
import { HttpService } from './../../../../http-service/http-service';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private dataSourceOneMailView = new BehaviorSubject<Object>('');
  private draftObs = new BehaviorSubject('');
  private refreshListObs = new BehaviorSubject(false);

  data = this.dataSourceOneMailView.asObservable();
  paginatorLength;

  constructor(public https: HttpClient,
    public http: HttpService,
    private subInjectService: SubscriptionInject) { }

  getProfile() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_PROFILE, {
      email: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  deleteThreadsFromTrashForever(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.DELETE_MULTIPLE_THREADS, {
      ids: ids,
      emailId: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  modifyThreadIds(data) {
    return this.http.post(apiConfig.GMAIL_URL + appConfig.MODIFY_MULTIPLE_THREADS, data);
  }

  // needs to work on ids 
  deleteMessageFromView(ids?: string) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.DELETE_MESSAGES, {
      ids: ids,
      emailId: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  moveThreadsToTrashFromList(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_THREADS_TO_TRASH, {
      ids: ids,
      emailId: userInfo.email,
      userId: userInfo.advisorId
    });
  }

  // id param to work on
  moveMessageToTrashFromView(ids?: string) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_MESSAGES_TO_TRASH, {
      ids: ids,
      emailId: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  // move gmail inbox threads to list
  moveThreadsFromTrashToList(ids: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_THREADS_FROM_TRASH, {
      ids,
      emailId: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  // need to work on ids 
  moveMessagesFromTrashToList(ids?: string[]) {
    const userInfo = AuthService.getUserInfo();

    return this.http.post(apiConfig.GMAIL_URL + appConfig.MOVE_MESSAGES_FROM_TRASH, {
      ids,
      emailId: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  getMailInboxList(data) {
    const { labelIds, maxResults, pageToken } = data;
    const userInfo = AuthService.getUserInfo();
    let sendReq;

    if (data.hasOwnProperty('q')) {
      if (!!userInfo.userName && !!userInfo.advisorId) {
        sendReq = {
          email: userInfo.userName,
          userId: userInfo.advisorId,
          labelIds,
          maxResults,
          pageToken,
          q: data.q
        }
      }
    } else {
      sendReq = {
        email: userInfo.userName,
        userId: userInfo.advisorId,
        labelIds,
        maxResults,
        pageToken,
      }
    }
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_GMAIL_INBOX_LIST, sendReq);
  }

  gmailMessageDetail(messageId: string) {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_MESSAGE_DETAIL, {
      email: userInfo.userName,
      userId: userInfo.advisorId,
      messageId
    });
  }

  getRightSideNavList() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_RIGHT_SIDE_NAV, {
      email: userInfo.userName,
      userId: userInfo.advisorId
    });
  }

  sendEmail(data) {
    return this.http.post(apiConfig.GMAIL_URL + appConfig.SEND_EMAIL, data);
  }

  getAttachmentFiles(data) {
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_ATTACHMENTS, data);
  }

  createDraft(body) {
    const userInfo = AuthService.getUserInfo();
    return this.http.post(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, {
      email: userInfo.email,
      userId: userInfo.advisorId,
      ...body
    });
  }

  updateDraft(body, id) {
    const userInfo = AuthService.getUserInfo();
    return this.http.put(apiConfig.GMAIL_URL + appConfig.UPDATE_DRAFT, {
      email: userInfo.email,
      userId: userInfo.advisorId,
      ...body,
      id
    });
  }

  createUpdateDraft(body, id) {
    const userInfo = AuthService.getUserInfo();

    if (id) {
      return this.http.put(apiConfig.GMAIL_URL + appConfig.UPDATE_DRAFT, {
        email: userInfo.email,
        userId: userInfo.advisorId,
        ...body,
        id
      })
    } else if (id === null) {
      return this.http.post(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, {
        email: userInfo.email,
        userId: userInfo.advisorId,
        ...body
      });
    }

  }

  openEmailAddTask(data, componentName) {
    const fragmentData = {
      flag: 'addEmailTask',
      data,
      id: 1,
      state: 'open35',
      componentName,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openComposeEmail(data, componentName, choice) {
    const fragmentData = {
      flag: 'composeEmail',
      data: { dataToSend: data, choice },
      id: 1,
      state: 'open50',
      componentName
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
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
      email: userInfo.email,
      userId: userInfo.advisorId
    });
  }

  sendNextData(data: Object) {
    this.dataSourceOneMailView.next(data);
  }

  getDraftThread() {
    return this.draftObs.asObservable();
  }

  sendDraftThread(value) {
    this.draftObs.next(value);
  }
}
