import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth-service/authService';
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class PdfGenService {
  advisor: any;
  client: any
  constructor(private datePipe: DatePipe) {
    this.advisor = AuthService.getUserInfo();
    this.client = AuthService.getClientData();
  }

  generatePdf(rows, title) {
    let headers = [];
    let footer = [];
    let td = [];
    let trTd = [];
    const header = headers;
    const data = trTd;
    for (let cells in rows) {
      for (let c in rows[cells].cells) {
        if (parseInt(c) + 1 != rows[cells].cells.length) {
          if (cells == "0" && rows[cells].cells[c].innerText != undefined) {
            headers.push(rows[cells].cells[c].innerText);
          }
          else if (cells == rows.length - 1 + "" && rows[cells].cells[c].innerText != undefined) {
            footer.push(rows[cells].cells[c].innerText);
          }
          else {
            if (rows[cells].cells[c].innerText != undefined) {
              if (td.length >= parseInt(c) + 1) {
                trTd.push(td);
                td = []
              }
              td.push(rows[cells].cells[c].innerText);
            }
          }
        }
      }
    };
    trTd.push(td);
    let tabArr = [];
    let cellWidth = [];
    tabArr.push(headers);
    trTd.forEach(tr => {
      tabArr.push(tr);
    });
    tabArr.push(footer);
    headers.forEach(th => {
      //  if(th == "No"){
      //   cellWidth.push(20);
      //  }
      //  else if(th == "Rate"){
      //   cellWidth.push(30);
      //  }
      //  else{
      cellWidth.push('auto');
      //  }
    });
    console.log(tabArr, "tabArr");


    const documentDefinition = {
      pageOrientation: 'landscape',
      info: {
        title: title,
        author: 'IFAnow',
      },
      defaultStyle: {
        fontSize: 9
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true
        },
        anotherStyle: {
          fontSize: 12,
          bold: true
        }
      },
      content: [

        { text: title, style: 'header' },
        { text: 'Adviser: ' + this.advisor.name, style: 'anotherStyle' },
        { lineHeight: 2, text: 'Client: ' + (this.client == undefined) ? '' : this.client.name, style: 'anotherStyle' },
        // { lineHeight: 2,text: 'Date: ' + this.datePipe.transform(new Date(), 'medium'), style: 'anotherStyle'},

        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: cellWidth,
            body: tabArr
          }
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
