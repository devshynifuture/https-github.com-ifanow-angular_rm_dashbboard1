import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailUtilService {

  constructor() {
  }

  static changeStringToBase64(value: string) {
    return btoa(value);
  }

  static isTheStringBase64Format(value: string) {
    try {
      return btoa(atob(value)) == value;
    } catch (err) {
      return false;
    }

  }

  static convertBase64ToBlobData(base64Data: string, contentType: string, sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  static parseBase64AndDecodeGoogleUrlEncoding(contentInBase64) {
    // console.log("parseBase64AndDecodeGoogleUrlEncoding ->> ", contentInBase64);
    if (contentInBase64) {
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

  static decodeGmailThreadExtractMessage(gmailThread): Object {
    let decodedPartArray = [];
    let id = gmailThread.id;
    let tempHeaders: {}[];
    gmailThread.messages.forEach((message) => {
      const { payload: { parts } } = message;
      const { payload: { headers } } = message;
      const { snippet } = message;
      if (parts && parts.length !== 0 && parts !== null) {
        parts.forEach((part) => {
          if (part.mimeType === 'text/html') {

            const data = part.body.data;

            if (part.body.data) {
              let decodedValue = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data)
              // console.log("this is decoded Value:::::::::::::::", decodedValue);
              if (decodedValue === null) {
                decodedPartArray.push(part.body.data);
              } else if (decodedValue !== '') {
                decodedPartArray.push(decodedValue);
              }
            }

          } else if (part.mimeType === 'multipart/mixed') {
            if (part.hasOwnProperty('parts') && part['parts'] !== null && part['parts'].length !== 0) {
              part['parts'].forEach(partsElement => {
                // element.
                if (partsElement.mimeType === 'multipart/alternative') {
                  if (partsElement.hasOwnProperty('parts') && partsElement['parts'] !== null && partsElement['parts'].length !== 0) {
                    partsElement['parts'].forEach(partElement => {
                      if (partElement.mimeType === 'text/html' && partElement.body.data) {
                        let decodedValue = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(partElement.body.data);
                        if (decodedValue !== null) {
                          decodedPartArray.push(decodedValue);
                        } else {
                          decodedPartArray.push(partElement.body.data);
                        }
                      }
                    });
                  }
                } else if ((partsElement.mimeType === 'text/html') && partsElement.body.data) {
                  let decodedValue = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(partsElement.body.data);
                  if (decodedValue !== null) {
                    decodedPartArray.push(decodedValue);
                  } else {
                    decodedPartArray.push(partsElement.body.data);
                  }
                }
              });
            }
          } else if (part.mimeType === 'multipart/alternative') {
            if (part.hasOwnProperty('parts') && part['parts'] !== null && part['parts'].length !== 0) {
              part['parts'].forEach(element => {
                if ((element.mimeType === 'text/html') && element.body.data) {
                  let decodedValue = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(element.body.data);
                  if (decodedValue !== null) {
                    decodedPartArray.push(decodedValue);
                  } else {
                    decodedPartArray.push(element.body.data);
                  }
                }
              });
            }
          }

          // not perfect
          else {
            let decodedValue = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data);
            if (decodedValue !== null) {
              decodedPartArray.push(decodedValue);
            } else {
              decodedPartArray.push(part.body.data);
            }
          }
        });
      } else {
        decodedPartArray.push('');
      }

      tempHeaders = headers;
    });
    return { decodedPart: decodedPartArray, headers: tempHeaders };
  }

  static getGmailLabelIdsFromMessages(gmailThread): Object[] {
    let labelIdsArray: Object[] = [];
    gmailThread.messages.forEach((message) => {
      const { labelIds } = message;
      labelIdsArray.push(labelIds);
    });
    return labelIdsArray;
  }

  static getAttachmentObjectFromGmailThread(gmailThread) {
    let attachmentObjects = [];
    gmailThread.messages.forEach(message => {
      const { payload } = message;
      if (payload.mimeType === 'multipart/mixed' && payload.parts !== null) {
        const { parts } = payload;
        if (parts && parts.length !== 0) {
          parts.forEach(part => {
            if (part.filename !== '') {
              attachmentObjects.push({
                id: part.body.attachmentId,
                filename: part.filename,
                mimeType: part.mimeType
              })
            }
          });
        }
      } else if (payload.parts !== null) {
        const { parts } = payload;
        if (parts.length !== 0) {
          parts.forEach(part => {
            if (part.filename !== '') {
              attachmentObjects.push({
                id: part.body.attachmentId,
                filename: part.filename,
                mimeType: part.mimeType
              });
              if (part.parts && part.parts.length !== 0) {
                const { parts } = part;
                parts.forEach(part => {
                  if (part.filename !== '') {
                    attachmentObjects.push({
                      id: part.body.attachmentId,
                      filename: part.filename,
                      mimeType: part.mimeType
                    });
                  }

                  if (part.parts && part.parts.length !== 0) {
                    const { parts } = part;
                    parts.forEach(part => {
                      if (part.filename !== '') {
                        attachmentObjects.push({
                          id: part.body.attachmentId,
                          filename: part.filename,
                          mimeType: part.mimeType
                        });
                      }
                      if (part.parts && part.parts.length !== 0) {
                        const { parts } = part;
                        parts.forEach(part => {
                          if (part.filename !== '') {
                            attachmentObjects.push({
                              id: part.body.attachmentId,
                              filename: part.filename,
                              mimeType: part.mimeType
                            });
                          }
                          if (part.parts && part.parts.length !== 0) {
                            const { parts } = part;
                            parts.forEach(part => {
                              if (part.filename !== '') {
                                attachmentObjects.push({
                                  id: part.body.attachmentId,
                                  filename: part.filename,
                                  mimeType: part.mimeType
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
    return attachmentObjects;
  }

  static getIdAndDateAndSnippetOfGmailThreadMessages(gmailThread): Object[] {
    let arrayObj: Object[] = [];
    gmailThread.messages.forEach((message) => {
      const { historyId, id, internalDate, threadId, snippet } = message;
      arrayObj.push({ historyId, id, internalDate, threadId, snippet });
    });
    return arrayObj;
  }

  static getIdsOfGmailThreads(gmailThread): Object {
    const { historyId, id } = gmailThread;
    return { historyId, id };
  }

  static getIdsOfGmailMessages(gmailThread): string[] {
    let idArray: string[] = [];
    gmailThread.messages.forEach(message => {
      const { id } = message;
      idArray.push(id);
    });
    return idArray;
  }

  static getSubjectAndFromOfGmailHeaders(gmailThread): Object {
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
