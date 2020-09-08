import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth-service/authService';
import { Injectable } from '@angular/core';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ExcelClientListService {
  advisor: any;
  client: any;

  constructor() {
    this.advisor = AuthService.getUserInfo();
    this.client = AuthService.getClientData();
  }

  generateExcel(title, header, tableData) {


    // const headersArray = [];
    const footerArray = tableData.filter((element, index) => index == tableData.length - 1);
    // let tdArray = tableData.filter((element, index) => index == tableData.length - 2);
    const trTdArray = [tableData.filter((element, index) => index != tableData.length - 1)];
    // const header = headersArray;
    const data = trTdArray[0];
    // for (const cells in rows) {
    //   for (const c in rows[cells].cells) {
    //     if (parseInt(c) + 1 != rows[cells].cells.length) {
    //       if (cells == '0' && rows[cells].cells[c].innerText != undefined) {
    //         headersArray.push(rows[cells].cells[c].innerText);
    //       } else if (cells == rows.length - 1 + '' && rows[cells].cells[c].innerText != undefined) {
    //         footerArray.push(rows[cells].cells[c].innerText);
    //       } else {
    //         if (rows[cells].cells[c].innerText != undefined) {
    //           if (td.length >= parseInt(c) + 1) {
    //             trTd.push(td);
    //             td = [];
    //           }
    //           td.push(rows[cells].cells[c].innerText);
    //         }
    //       }
    //     }
    //   }
    // }

    // trTdArray.push(tdArray);
    // console.log(headersArray, 'dataSource excel');
    // console.log(tdArray, 'dataSource excel');
    console.log(trTdArray, 'dataSource excel');
    console.log(footerArray, 'dataSource excel');


    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.advisor.name + '_' + title + '_' + 'Data');


    // Add Row and formatting
    worksheet.addRow([]);
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date :', this.datePipe.transform(new Date(), 'medium')])

    worksheet.addRow(['Advisor', this.advisor.name]);
    worksheet.addRow(['Client', this.client ? this.client.name : '']);

    // Add Image
    // let logo = workbook.addImage({
    //   base64: logoFile.logoBase64,
    //   extension: 'png',
    // });


    // worksheet.addImage(logo, 'E1:F3');
    // worksheet.mergeCells('A1:D2');


    // Blank Row
    worksheet.addRow([]);

    // Add Header Row
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, indexNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    // worksheet.addRows(data);


    // Add Data and Conditional Formatting
    data.forEach(d => {
      const row = worksheet.addRow(d);
      // let qty = row.getCell(5);
      const color = 'FF99FF99';
      // if (+qty.value < 500) {
      //   color = 'FF9999'
      // }

      // qty.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: color }
      // }
    }
    );

    worksheet.getColumn(2).width = 30;
    // worksheet.getColumn(4).width = 30;
    // worksheet.addRow([]);


    // Footer Row
    const footerRow = worksheet.addRow(footerArray[0]);
    // footerRow.fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }


    footerRow.eachCell((cell, indexNumber) => {
      footerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    // Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });
    return data;
  }
}
