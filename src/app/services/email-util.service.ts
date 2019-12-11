import { Injectable } from '@angular/core';
import { GmailInboxResponseI } from '../component/protect-component/AdviserComponent/Email/email-component/email.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailUtilService {

  constructor() {
  }

  static parseBase64AndDecodeGoogleUrlEncoding(contentInBase64) {
    return atob(contentInBase64.replace(/\-/g, '+').replace(/_/g, '/'));
  }

  static arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /*  private String mimeType;
    private String filename;
    private int size;
    private String data;*/
  static getBase64FromFile(file, successCallback, errorCallback?) {
    // let me = this;
    // let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // me.modelvalue = reader.result;
      console.log(reader.result);
      successCallback(reader.result);
    };
    reader.onerror = error => {
      console.log('Error: ', error);
      errorCallback(error);
    };
  }

  static decodeGmailThreadExtractMessage(gmailThread: GmailInboxResponseI) {
    let decodedPartArray = []
    let tempHeaders: {}[];
    gmailThread.messages.forEach((message) => {
      const { payload: { parts } } = message;
      const { payload: { headers } } = message;
      if (parts && parts !== null) {
        parts.forEach((part) => {
          if (part.body.data && part.body.data !== null) {
            decodedPartArray.push(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data));
          }
          else {
            decodedPartArray.push('');
          }
        });
      } else {
        decodedPartArray.push('');
      }

      tempHeaders = headers;
    });
    return { decodedPart: decodedPartArray, headers: tempHeaders };
  }

  static getGmailLabelIdsFromMessages(gmailThread: GmailInboxResponseI) {
    let labelIdsArray: Object[] = [];
    gmailThread.messages.forEach((message) => {
      const { labelIds } = message;
      labelIdsArray.push({
        labelIds
      });
    });
    return labelIdsArray;
  }

  static getIdAndDateAndSnippetOfGmailThreadMessages(gmailThread: GmailInboxResponseI) {
    let arrayObj = [];
    gmailThread.messages.forEach((message) => {
      const { historyId, id, internalDate, threadId, snippet } = message;
      arrayObj.push({ historyId, id, internalDate, threadId, snippet });
    });
    return arrayObj;
  }

  static getIdsOfGmailThreads(gmailThread: GmailInboxResponseI) {
    const { historyId, id } = gmailThread;
    return { historyId, id };
  }

  static getSubjectAndFromOfGmailHeaders(gmailThread: GmailInboxResponseI) {
    let headerSubjectArray: string[] = [];
    let headerFromArray: string[] = [];
    gmailThread.messages.forEach((message) => {
      const { payload: { headers } } = message;
      headers.forEach((header) => {
        (header.name === 'Subject') ? headerSubjectArray.push(header.value) : '';
        (header.name === 'From') ? headerFromArray.push(header.value) : '';
      })
    });
    return { headerSubjectArray, headerFromArray };
  }
}
