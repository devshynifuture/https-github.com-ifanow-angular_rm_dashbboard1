import {Injectable} from '@angular/core';

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
}
