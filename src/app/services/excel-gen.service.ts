import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth-service/authService';
// import * as logoFile from './carlogo.js';
// import { DatePipe } from '../../node_modules/@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ExcelGenService {

  advisor: any;
  client: any;

  constructor(private datePipe: DatePipe) {
    this.advisor = AuthService.getUserInfo();
    this.client = AuthService.getClientData();
  }

  generateExcel(rows, title) {


    const headers = [];
    const footer = [];
    let td = [];
    const trTd = [];
    const header = headers;
    const data = trTd;
    for (const cells in rows) {
      for (const c in rows[cells].cells) {
        if (parseInt(c) + 1 != rows[cells].cells.length) {
          if (cells == '0' && rows[cells].cells[c].innerText != undefined) {
            headers.push(rows[cells].cells[c].innerText);
          } else if (cells == rows.length - 1 + '' && rows[cells].cells[c].innerText != undefined) {
            footer.push(rows[cells].cells[c].innerText);
          } else {
            if (rows[cells].cells[c].innerText != undefined) {
              if (td.length >= parseInt(c) + 1) {
                trTd.push(td);
                td = [];
              }
              td.push(rows[cells].cells[c].innerText);
            }
          }
        }
      }
    }

    trTd.push(td);
    console.log(headers, 'dataSource excel');
    console.log(td, 'dataSource excel');
    console.log(trTd, 'dataSource excel');
    console.log(footer, 'dataSource excel');


    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(title + 'Data');


    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date :', this.datePipe.transform(new Date(), 'medium')])

   worksheet.addRow(['Advisor:', this.advisor.name]);
   worksheet.addRow(['Client:', this.client.name]);

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
    const footerRow = worksheet.addRow(footer);
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
