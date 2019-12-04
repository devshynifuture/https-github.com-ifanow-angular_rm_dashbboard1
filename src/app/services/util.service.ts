import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  getFamilyMemberData: any;

  constructor() {
  }
  static convertObjectToArray(inputObject: object): object[] {
    const outputArray = [];
    Object.keys(inputObject).map(key => {
      outputArray.push({
        name: inputObject[key],
        value: key,
        selected: false
      });
    });

    return outputArray;
  }

  totalCalculator(data: number[]) {
    return data.reduce((accumulator, currentValue) => {
      accumulator = accumulator + currentValue;
      return accumulator;
    }, 0);
  }

  static convertObjectToCustomArray(inputObject: object, keyNameForOutput: string, keyValueForOutput: string): object[] {
    const outputArray = [];
    Object.keys(inputObject).map(key => {
      const object = { selected: false };
      object[keyNameForOutput] = inputObject[key];
      object[keyValueForOutput] = key;

      outputArray.push(object);
    });

    return outputArray;
  }

  static isDialogClose(data) {
    return data && data.state && data.state === 'close';
  }

  static getStartOfTheDay(date: Date) {
    date.setHours(0)
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static getEndOfDay(date: Date) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;

  }

  formatNumbers(data) {
    return (parseInt(data)).toLocaleString('en-IN');
  }

  formatter(data) {
    return Math.round(data);
  }

  calculateAgeFromCurrentDate(data) {
    data.forEach(element => {
      const bdate = new Date(element.dateOfBirth);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      element['age'] = age
    });
    this.getFamilyMemberData = data;
    console.log("family Member with age", this.getFamilyMemberData)
    return this.getFamilyMemberData;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\. ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  static convertDateObjectToDateString(datePipe: DatePipe, date: Date) {
    return datePipe.transform(date, 'yyyy-MM-dd');
  }
  static exportAsExcelFile(value, excelFileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(value.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, excelFileName);
    XLSX.writeFile(wb, excelFileName + '.xlsx');
    // this.saveAsExcelFile(excelBuffer, excelFileName);
  }
   static saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
