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
        head.fill = {
            type: 'pattern',
            pattern: 'darkVertical',
            fgColor: { argb: 'FFFFFF' }
        };
        ws.getRow(5).values = header;
        // ws.columns[0].style.alignment = {horizontal: 'left'};
        ws.columns = headerData;
        excelData.forEach(element => {
            ws.addRow(element);
        });
        footer.forEach(element => {
            const last = ws.addRow(element);
            last.font = { bold: true };
        });
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), userData.fullName + '-' + metaData + '-' + new Date() + '.xlsx');
    }

    static exportExcel2(arrayOfHeaders, arrayOfExcelData, selectedSchemeName, ) {
        // create workbook,
        // create sheet
        // get a1
        // insert header data
        // headerStyles styles
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
    }



}
