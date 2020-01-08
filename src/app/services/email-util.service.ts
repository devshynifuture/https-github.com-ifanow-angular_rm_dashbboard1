import { Injectable } from '@angular/core';
import { GmailInboxResponseI } from '../component/protect-component/AdviserComponent/Email/email-component/email.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailUtilService {


  constructor() {
  }

  static changeStringToBase64(value: string) {
    return btoa(value);
  }

  static parseBase64AndDecodeGoogleUrlEncoding(contentInBase64) {
    // console.log("parseBase64AndDecodeGoogleUrlEncoding ->> ", contentInBase64);
    if(contentInBase64){
      return atob(contentInBase64.replace(/\-/g, '+').replace(/_/g, '/'));
    }
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

  static decodeGmailThreadExtractMessage(gmailThread: GmailInboxResponseI): Object {
    let decodedPartArray = [];
    let id = gmailThread.id;
    let tempHeaders: {}[];
    gmailThread.messages.forEach((message) => {
      const { payload: { parts } } = message;
      const { payload: { headers } } = message;
      const { snippet } = message;
      if (parts && parts !== null) {
        parts.forEach((part) => {
          if (part.body.data && part.body.data !== null) {
            decodedPartArray.push(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data));
          }
          // not perfect
          else {
            console.log(" this is null hope so it is not :: data null");
          }
        });
      } else {
        decodedPartArray.push('');
      }

      tempHeaders = headers;
    });
    return { decodedPart: decodedPartArray, headers: tempHeaders };
  }

  static getGmailLabelIdsFromMessages(gmailThread: GmailInboxResponseI): Object[] {
    let labelIdsArray: Object[] = [];
    gmailThread.messages.forEach((message) => {
      const { labelIds } = message;
      labelIdsArray.push({
        labelIds
      });
    });
    return labelIdsArray;
  }

  static getIdAndDateAndSnippetOfGmailThreadMessages(gmailThread: GmailInboxResponseI): Object[] {
    let arrayObj: Object[] = [];
    gmailThread.messages.forEach((message) => {
      const { historyId, id, internalDate, threadId, snippet } = message;
      arrayObj.push({ historyId, id, internalDate, threadId, snippet });
    });
    return arrayObj;
  }

  static getIdsOfGmailThreads(gmailThread: GmailInboxResponseI): Object {
    const { historyId, id } = gmailThread;
    return { historyId, id };
  }

  static getSubjectAndFromOfGmailHeaders(gmailThread: GmailInboxResponseI): Object {
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

  static getAttachmentFileData(gmailResponse) {
    const returnArray = [];
    gmailResponse.messages.forEach((message) => {

      // const { payload: { headers } } = message;
      const { payload: { parts } } = message;
      if (parts && parts !== null) {
        parts.forEach((part) => {
          const { mimeType, headers } = part;
          returnArray.push({
            headers,
            mimeType
          });
        });
      }
    });
    return returnArray;
  }
}
