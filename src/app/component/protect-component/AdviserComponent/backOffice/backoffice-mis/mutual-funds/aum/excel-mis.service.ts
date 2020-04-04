import { AuthService } from 'src/app/auth-service/authService';
import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelMisService {

    constructor() { }

    static async exportExcel(headerData, header, excelData: any, footer: any[], metaData: any) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        let userData = AuthService.getUserInfo();

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + userData.fullName;
        ws.getCell('A3').value = 'Report as on - ' + new Date();

        const head = ws.getRow(5);
        head.font = { bold: true };

        ws.getRow(5).values = header;
        // ws.columns[0].style.alignment = {horizontal: 'left'};
        ws.columns = headerData;
        if (excelData && excelData.length !== 0) {
            excelData.forEach(element => {
                ws.addRow(element);
            });
        } else {
            ws.addRow(['', 'No Data Found', '', '', '']);
        }
        footer.forEach(element => {
            const last = ws.addRow(element);
            last.font = { bold: true };
        });
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), userData.fullName + '-' + metaData + '-' + new Date() + '.xlsx');
    }

    static async exportExcel2(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, selectedSchemeName, metaData) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        let userData = AuthService.getUserInfo();

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + userData.fullName;
        ws.getCell('A3').value = 'Report as on - ' + new Date();

        const head = ws.getRow(5);
        head.font = { bold: true };


        console.log("this is what i got", arrayOfExcelData);

        // get a1

        ws.getRow(5).values = arrayOfHeaders[0];
        ws.columns = arrayOfHeaderStyle[0];

        arrayOfExcelData[0].forEach(element => {
            ws.addRow(element);
        });

        let currentRowPos = arrayOfExcelData[0].length + 5 + 1;

        ws.getRow(currentRowPos).values = arrayOfHeaders[1];
        let head1 = ws.getRow(currentRowPos);
        head1.font = { bold: true };

        if (arrayOfExcelData[1] && arrayOfExcelData[1].length !== 0) {
            ws.columns = arrayOfHeaderStyle[1];
            arrayOfExcelData[1].forEach(element => {
                ws.addRow(element);
            });
        } else {
            ws.addRow(['', 'No Data Found', '', '']);
            currentRowPos = currentRowPos + 1;
        }

        if (arrayOfExcelData[1] && arrayOfExcelData[1].length !== 0 && arrayOfHeaders[2]) {
            currentRowPos = currentRowPos + arrayOfExcelData[1].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
            let head2 = ws.getRow(currentRowPos);
            head2.font = { bold: true };
        } else if (arrayOfHeaders[2]) {
            currentRowPos = currentRowPos + arrayOfExcelData[1].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
            let head2 = ws.getRow(currentRowPos);
            head2.font = { bold: true };

        }

        if (arrayOfExcelData[2] && arrayOfExcelData[2].length !== 0) {
            ws.columns = arrayOfHeaderStyle[2];
            arrayOfExcelData[2].forEach(element => {
                ws.addRow(element);
            });
        } else {
            ws.addRow(['', 'No Data Found', '', '']);
            currentRowPos = currentRowPos + 1;
        }

        if (arrayOfExcelData[2] && arrayOfExcelData[2].length !== 0 && arrayOfHeaders[3]) {
            currentRowPos = currentRowPos + arrayOfExcelData[2].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
            let head3 = ws.getRow(currentRowPos);

            head3.font = { bold: true };
        } else if (arrayOfHeaders[3]) {
            currentRowPos = currentRowPos + arrayOfExcelData[2].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
            let head3 = ws.getRow(currentRowPos);

            head3.font = { bold: true };
        }

        if (arrayOfExcelData[3] && arrayOfExcelData[3].length !== 0 && arrayOfHeaderStyle[3]) {
            ws.columns = arrayOfHeaderStyle[3];
            arrayOfExcelData[3].forEach(element => {
                ws.addRow(element);
            });
        } else {
            ws.addRow(['', 'No data found', '', '', '']);
            currentRowPos = currentRowPos + 1;
        }

        if (arrayOfExcelData[3] && arrayOfExcelData[3].length !== 0 && arrayOfHeaders[4]) {
            console.log("hellow im here:", arrayOfHeaders[4]);
            currentRowPos = currentRowPos + arrayOfExcelData[3].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[4];
            let head3 = ws.getRow(currentRowPos);
            head3.font = { bold: true };
        } else if (arrayOfHeaders[4]) {
            currentRowPos = currentRowPos + arrayOfExcelData[3].length + 1;
            ws.getRow(currentRowPos).values = arrayOfHeaders[4];
            let head3 = ws.getRow(currentRowPos);
            head3.font = { bold: true };
        }

        if (arrayOfExcelData[4] && arrayOfExcelData[4].length !== 0 && arrayOfHeaderStyle[4]) {
            ws.columns = arrayOfHeaderStyle[4];
            arrayOfExcelData[4].forEach(element => {
                ws.addRow(element);
            });
        }

        // values forloop

        // insert another header1 data
        // header1Styles styles
        // values1 forloop
        // check for selectedSchemeName
        // if schemeName present
        // header for schemeName
        // values for schemeName
        // else 
        // continue

        // insert another header2 data
        // ehader2 styles
        // values2 forloop
        // check for selectedSchemeName
        // if schemeName present
        // header for schemeName
        // values for schemeName
        // else 
        // continue
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), userData.fullName + '-' + metaData + '-' + new Date() + '.xlsx');

    }



}
