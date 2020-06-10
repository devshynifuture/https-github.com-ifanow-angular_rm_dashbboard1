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
       if(th == "Owner"){
        cellWidth.push("*");
       }
       else if(th == "Description"){
        cellWidth.push("*");
       }
       else{
       cellWidth.push('auto');
       }
    });
    tabArr.forEach((data , i) =>{
      for(let i = 0; i < data.length ; i++){
        if(data[i].charAt(0) == '₹'){
          data[i]={
            text : data[i],
            alignment:'right'
          }
        }
      }
      
    })
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
          bold: true,
          alignment:'center'
        },
        anotherStyle: {
          fontSize: 12,
          bold: true,
          alignment:'center'
        },
        clientStyle: {
          fontSize: 12,
          bold: true
        },
        advisorContactStyle: {
          fontSize: 12,
          alignment:'center'
        }

      },
      content: [
        // {
        //   // if you specify both width and height - image will be stretched
        //   image: '../../assets/images/a2.PNG',
        //   width: 150,
        //   height: 150
        // },
        {lineHeight: 2, text:this.advisor.name, style: 'header' },
        { lineHeight: 2, text: 'Number: '+this.advisor.mobileList[0].mobileNo + ' Email: '+this.advisor.emailList[0].email, style: 'advisorContactStyle' },
        { text: title, style: 'anotherStyle' },
        { lineHeight: 2,text: 'Report as on: ' + this.datePipe.transform(new Date(), 'medium'), style: 'anotherStyle'},
        { lineHeight: 2, text: 'Investor: ' + this.client.name, style: 'clientStyle' },

        {
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex == 0) ? '#f6f7f7' : null;
            },
            paddingTop: function(i, node) { return 5; },
				    paddingBottom: function(i, node) { return 5; },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? '#dadce0' : '#dadce0';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? '#dadce0' : '#dadce0';
            }
          },
          // layout: 'lightHorizontalLines', // optional
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
