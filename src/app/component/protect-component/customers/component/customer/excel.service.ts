import { AuthService } from 'src/app/auth-service/authService';
import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';


export interface UserDataI {
  userId: number;
  fullName: string;
  emailId: string;
  profilePic: string;
  adminAdvisorId: number;
  roleId: number;
  token: string;
  faLink: boolean;
  advisorId: number;

}
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

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
    let username;

    if (userData.hasOwnProperty('fullName')) {
      username = userData.fullName;
    } else {
      username = userData.name;
    }
    ws.getCell('A1').value = 'Type of report - ' + metaData;
    ws.getCell('A2').value = `Client name - ` + username;
    ws.getCell('A3').value = 'Report as on - ' + new Date();
    const head = ws.getRow(5);
    head.font = { bold: true };
    head.fill = {
      type: 'pattern',
      pattern: 'darkVertical',
      fgColor: { argb: 'CCCCCC' }
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
    saveAs(new Blob([buf]), username + '-' + metaData + '-' + new Date() + '.xlsx');
  }

}
