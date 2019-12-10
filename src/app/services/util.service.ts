import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  getFamilyMemberData: any;

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

  static convertObjectToCustomArray(inputObject: object, keyNameForOutput: string, keyValueForOutput: string): object[] {
    const outputArray = [];
    Object.keys(inputObject).map(key => {
      const object = {selected: false};
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
    date.setHours(0);
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

  static convertDateObjectToDateString(datePipe: DatePipe, date: Date) {
    return datePipe.transform(date, 'yyyy-MM-dd');
  }

  static async exportAs(headerData, excelData: any, footer: any[]) {
    // var wb = new Workbook()
    // const ws = wb.addWorksheet()
    // //---------MetaData----------//

    // //ws.mergeCells('A1', 'M1');
    // const meta1 = ws.getCell('A1')
    // const meta2 = ws.getCell('A2')
    // const meta3 = ws.getCell('A3')
    // meta1.font = { bold: true }
    // meta2.font = { bold: true }
    // meta3.font = { bold: true }
    // ws.getCell('A1').value = 'Type of report - ' + 'value';
    // ws.getCell('A2').value = 'Client name - Rahul Jain';
    // ws.getCell('A3').value = 'Report as on - ' + new Date();
    // //ws.getCell('A1').alignment = { horizontal: 'center' };
    // const head = ws.getRow(5)
    // head.font = { bold: true }
    // head.fill = {
    //   type: 'pattern',
    //   pattern: 'darkVertical',
    //   fgColor: {
    //     argb: '#f5f7f7'
    //   }
    // };
    // //---------header----------//
    // ws.getRow(5).values = headerData;
    // //----------data---------//
    // excelData.forEach(element => {
    //   ws.addRow(element)
    // });
    // //-------footerData---------//
    // footer.forEach(element => {
    //   const last = ws.addRow(element)
    //   last.font = { bold: true }
    // });
    // const buf = await wb.xlsx.writeBuffer()
    // saveAs(new Blob([buf]), 'Rahul Jain-' + 'value' + '-' + new Date() + '.xlsx')

  }

  totalCalculator(data: number[]) {
    return data.reduce((accumulator, currentValue) => {
      accumulator = accumulator + currentValue;
      return accumulator;
    }, 0);
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
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      element.age = age;
    });
    this.getFamilyMemberData = data;
    console.log('family Member with age', this.getFamilyMemberData);
    return this.getFamilyMemberData;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\. ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
