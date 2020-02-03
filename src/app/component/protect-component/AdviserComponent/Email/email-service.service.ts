import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  data = this.dataSourceOneMailView.asObservable();
  paginatorLength;

  constructor(public https: HttpClient,
    public http: HttpService,
    private subInjectService: SubscriptionInject) { }

  getProfile() {
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

  getMailInboxList(data) {
    const { labelIds, maxResults, pageToken } = data;
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_GMAIL_INBOX_LIST, {
      email: userInfo.emailId,
      userId: userInfo.advisorId,
      labelIds,
      maxResults,
      pageToken
    });
  }

  gmailMessageDetail(messageId: string) {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_MESSAGE_DETAIL, {
      email: userInfo.emailId,
      userId: userInfo.advisorId,
      messageId
    });
  }

  getRightSideNavList() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_RIGHT_SIDE_NAV, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  // needs to work on email body attachments and to from of http Params
  // createDraft({ to, from, emailBody, attachments, subject }) {
  //   const userInfo = AuthService.getUserInfo();


  //   const obj =
  //   {
  //     "attachmentIds": [
  //       ""
  //     ],
  //     "bccs": [
  //       ""
  //     ],
  //     "ccs": [
  //       ""
  //     ],
  //     "contentType": "",
  //     "draft": {
  //       "historyId": "",
  //       "id": "",
  //       "messages": {
  //         "historyId": 0,
  //         "id": "",
  //         "internalDate": 0,
  //         "labelIds": [
  //           "DRAFT"
  //         ],
  //         "payload": {
  //           "body": {
  //             "data": emailBody,
  //             "size": 0
  //           },
  //           "fileName": "",
  //           "headers": [
  //             {
  //               "name": "",
  //               "value": ""
  //             }
  //           ],
  //           "mimeType": "",
  //           "partId": "",
  //           "parts": [
  //             {
  //               "body": {
  //                 "data": "",
  //                 "size": 0
  //               },
  //               "fileName": "",
  //               "headers": [
  //                 {
  //                   "name": "",
  //                   "value": ""
  //                 }
  //               ],
  //               "mimeType": "",
  //               "partId": ""
  //             }
  //           ]
  //         },
  //         "sizeEstimate": 0,
  //         "snippet": "",
  //         "threadId": ""
  //       },
  //       "threadId": ""
  //     },
  //     "email": userInfo.emailId,
  //     "fileData": [
  //       {
  //         "data": "",
  //         "filename": "",
  //         "mimeType": "",
  //         "partId": "",
  //         "size": 0
  //       }
  //     ],
  //     "id": "0",
  //     "message": emailBody,
  //     "subject": subject,
  //     "toAddress": [
  //       to
  //     ],
  //     "userId": 2727
  //   };

  //   return this.http.post(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, {
  //     ...obj
  //   });
  // }

  // updateDraft({ id, to, from, emailBody, attachments, subject }) {
  //   const userInfo = AuthService.getUserInfo();
  //   const Obj = {
  //     "attachmentIds": [
  //       ""
  //     ],
  //     "bccs": [
  //       ""
  //     ],
  //     "ccs": [
  //       ""
  //     ],
  //     "contentType": "",
  //     "draft": {
  //       "historyId": "",
  //       "id": "",
  //       "messages": {
  //         "historyId": 0,
  //         "id": "",
  //         "internalDate": 0,
  //         "labelIds": [
  //           "DRAFT"
  //         ],
  //         "payload": {
  //           "body": {
  //             "data": "",
  //             "size": 0
  //           },
  //           "fileName": "",
  //           "headers": [
  //             {
  //               "name": "",
  //               "value": ""
  //             }
  //           ],
  //           "mimeType": "",
  //           "partId": "",
  //           "parts": [
  //             {
  //               "body": {
  //                 "data": "",
  //                 "size": 0
  //               },
  //               "fileName": "",
  //               "headers": [
  //                 {
  //                   "name": "",
  //                   "value": ""
  //                 }
  //               ],
  //               "mimeType": "",
  //               "partId": ""
  //             }
  //           ]
  //         },
  //         "sizeEstimate": 0,
  //         "snippet": "",
  //         "threadId": ""
  //       },
  //       "threadId": ""
  //     },
  //     "email": userInfo.emailId,
  //     "fileData": [
  //       {
  //         "data": "",
  //         "filename": "",
  //         "mimeType": "",
  //         "partId": "",
  //         "size": 0
  //       }
  //     ],
  //     "id": id,
  //     "message": emailBody,
  //     "subject": subject,
  //     "toAddress": [
  //       to
  //     ],
  //     "userId": 2727
  //   };
  //   return this.http.post(apiConfig.GMAIL_URL + appConfig.UPDATE_DRAFT, {
  //     email: userInfo.emailId,
  //     userId: userInfo.advisorId,
  //     ...Obj
  //   });
  // }

  sendEmail(data) {
    return this.http.post(apiConfig.GMAIL_URL + appConfig.SEND_EMAIL, data);
  }

  getAttachmentFiles(data) {
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_ATTACHMENTS, data);
  }

  createUpdateDraft(body, id) {
    const userInfo = AuthService.getUserInfo();
    // console.log(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, " \n http params \n", {
    //   emailId: userInfo.emailId,
    //   userId: userInfo.advisorId,
    //   ...body
    // });

    // console.log("draft obj ->>>>>>>>>>", {
    //   email: userInfo.emailId,
    //   userId: userInfo.advisorId,
    //   ...body
    // });

    if (id) {
      return this.http.post(apiConfig.GMAIL_URL + appConfig.UPDATE_DRAFT, {
        email: userInfo.emailId,
        userId: userInfo.advisorId,
        ...body
      })
    } else if (id === null) {
      console.log("create draft api::: response", {
        email: userInfo.emailId,
        userId: userInfo.advisorId,
        ...body
      })
      return this.http.post(apiConfig.GMAIL_URL + appConfig.CREATE_DRAFT, {
        email: userInfo.emailId,
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
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openComposeEmail(data, componentName) {
    const fragmentData = {
      flag: 'composeEmail',
      data,
      id: 1,
      state: 'open35',
      componentName
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
