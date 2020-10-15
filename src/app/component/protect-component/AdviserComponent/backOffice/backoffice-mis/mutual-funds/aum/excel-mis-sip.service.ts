import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import * as Excel from 'exceljs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelMisSipService {
    advisor: any;
    client: any;


    constructor() {
        this.advisor = AuthService.getUserInfo();
        this.client = AuthService.getClientData();
    }

    static async exportExcel(headerData, header, excelData: any, footer: any[], metaData: any, totalArray?, arrOfParentTableNames?) {
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

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday',  'Thursday','Friday','Saturday'];
        const monthArr = ['January', 'February','March', 'April','May', 'June', 'July','August','September', 'October','November','December'];
        const currentDate = new Date();
        const curDateFormat = daysArr[currentDate.getDay()] + "- " 
        + monthArr[currentDate.getMonth()] + ' '
        + `${(currentDate.getDate() < 10) ? '0': '' }` + currentDate.getDate() + ', ' 
        + currentDate.getFullYear();

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + username;

        let initialRowCount = 3;
        if(arrOfParentTableNames && arrOfParentTableNames.length!==0){
            arrOfParentTableNames.forEach(element => {
                let row = ws.getRow(initialRowCount);
                row.values = element;
                row.font = { bold: true };
                initialRowCount += 1;
            });
            ws.addRow(['','','','']);
            initialRowCount += 1;
            ws.addRow(['Report as on - ', curDateFormat]);
            initialRowCount += 1;
        } else {
            ws.getCell('A3').value = 'Report as on - ' + curDateFormat;
            initialRowCount = 5;
        }

        const head = ws.getRow(initialRowCount);
        head.font = { bold: true };

        ws.getRow(initialRowCount).values = header;
        // ws.columns[0].style.alignment = {horizontal: 'left'};
        ws.columns = headerData;

        if (excelData && excelData.length !== 0) {
            excelData.forEach(element => {
                ws.addRow([
                    element.field1,
                    element.field2,
                    element.field3,
                    element.field4,
                    (element.hasOwnProperty('field5') && element.field5 !== undefined) ? element.field5 : '',
                    (element.hasOwnProperty('field6') && element.field6 !== undefined) ? element.field6 : '',
                    (element.hasOwnProperty('field7') && element.field7 !== undefined) ? element.field7 : '',
                    (element.hasOwnProperty('field8') && element.field8 !== undefined) ? element.field8 : '',
                    (element.hasOwnProperty('field9') && element.field9 !== undefined) ? element.field9 : '',
                    (element.hasOwnProperty('field10') && element.field10 !== undefined) ? element.field10 : '',
                    (element.hasOwnProperty('field11') && element.field11 !== undefined) ? element.field11 : ''
                ]);
            });
        }

        const last = ws.addRow(totalArray);
        last.font = { bold: true };

        const buf = await wb.xlsx.writeBuffer();
        let name;
        if (userData.hasOwnProperty('fullName')) {
            name = userData.fullName;
        } else {
            name = userData.name;
        }

        saveAs(new Blob([buf]), name + '-' + metaData + '-' + new Date() + '.xlsx');
    }

    static async exportExcel2(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday',  'Thursday','Friday','Saturday'];
        const monthArr = ['January', 'February','March', 'April','May', 'June', 'July','August','September', 'October','November','December'];
        const currentDate = new Date();
        const curDateFormat = daysArr[currentDate.getDay()] + "- " 
        + monthArr[currentDate.getMonth()] + ' '
        + `${(currentDate.getDate() < 10) ? '0': '' }` + currentDate.getDate() + ', ' 
        + currentDate.getFullYear();

        let userData = AuthService.getUserInfo();
        let username;
        if (userData.hasOwnProperty('fullName')) {
            username = userData.fullName;
        } else {
            username = userData.name;
        }

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + username;

        let initialRowCount = 3;
        if(arrOfParentTableNames && arrOfParentTableNames.length!==0){
            arrOfParentTableNames.forEach(element => {
                let row = ws.getRow(initialRowCount);
                row.values = element;
                row.font = { bold: true };
                initialRowCount += 1;
            });
            ws.addRow(['','','','']);
            initialRowCount += 1;
            ws.addRow(['Report as on - ', curDateFormat]);
            initialRowCount += 1;
        } else {
            ws.getCell('A3').value = 'Report as on - ' + curDateFormat;
            initialRowCount = 5;
        }

        const head = ws.getRow(initialRowCount);
        head.font = { bold: true };
        // get a1
        let currentRowPos = initialRowCount;
        let headCell;

        if (choice === 'category-wise-aum-mis') {
            arrayOfExcelData.forEach((catElement, index1) => {
                if (!excluded.clientList) {
                    if (index1 == 0) {
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } else {
                        currentRowPos = currentRowPos + 2;
                    }
                    // else {
                    //     ws.addRow(['', '', '', '']);
                    //     currentRowPos = currentRowPos + 2;
                    //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    //     ws.columns = arrayOfHeaderStyle[0];
                    //     headCell = ws.getRow(currentRowPos);
                    //     headCell.font = { bold: true };
                    // }
                    ws.addRow([
                        catElement.index,
                        catElement.name,
                        catElement.sipAmount,
                        catElement.sipCount,
                        catElement.weightInPerc
                    ]);

                    if (catElement && catElement.hasOwnProperty('subCatList') && catElement.subCatList.length !== 0) {
                        if (!excluded.subCatList) {
                            catElement.subCatList.forEach((subCatElement, index2) => {
                                currentRowPos = currentRowPos + 2;
                                if(index2 === 0 && index1 === 0){
                                    ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                    ws.columns = arrayOfHeaderStyle[1];
                                    headCell = ws.getRow(currentRowPos);
                                    headCell.font = { bold: true };
                                }

                                ws.addRow([
                                    subCatElement.index,
                                    subCatElement.name,
                                    subCatElement.sipAmount,
                                    subCatElement.sipCount,
                                    subCatElement.weightInPerc
                                ]);

                                if (subCatElement && subCatElement.hasOwnProperty('schemeList') && subCatElement.schemeList.length !== 0) {
                                    if (!excluded.schemeList) {
                                        subCatElement.schemeList.forEach((schemeElement, index3) => {
                                            currentRowPos = currentRowPos + 2;

                                            if(index3 === 0 && index2 === 0 && index1 === 0){
                                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                                ws.columns = arrayOfHeaderStyle[2];
                                                headCell = ws.getRow(currentRowPos);
                                                headCell.font = { bold: true };
                                            }
                                            ws.addRow([
                                                schemeElement.index,
                                                schemeElement.name,
                                                schemeElement.schemeName,
                                                schemeElement.folio,
                                                schemeElement.registeredDate,
                                                schemeElement.fromDate,
                                                schemeElement.toDate,
                                                schemeElement.toTriggerDay,
                                                schemeElement.frequency,
                                                schemeElement.amount,
                                                schemeElement.weightInPerc,
                                            ]);
                                        });
                                    }
                                }
                            });
                        }
                    }

                } else {
                    if (catElement && catElement.hasOwnProperty('subCatList') && catElement.subCatList.length !== 0) {
                        if (!excluded.subCatList) {
                            catElement.subCatList.forEach((subCatElement, index2) => {
                                currentRowPos = currentRowPos + 2;
                                if(index2 === 0 && index1 === 0){
                                    ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                    ws.columns = arrayOfHeaderStyle[1];
                                    headCell = ws.getRow(currentRowPos);
                                    headCell.font = { bold: true };
                                }

                                ws.addRow([
                                    subCatElement.index,
                                    subCatElement.name,
                                    subCatElement.sipAmount,
                                    subCatElement.sipCount,
                                    subCatElement.weightInPerc
                                ]);

                                if (subCatElement.schemeList.length !== 0) {
                                    if (!excluded.schemeList) {
                                        // if (subCatElement.applicantList !== 0) {
                                        //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                        // } else {
                                        // }

                                        subCatElement.schemeList.forEach((schemeElement, index3) => {
                                            currentRowPos = currentRowPos + 2;
                                            if(index3 === 0 && index2 === 0 && index1 === 0){
                                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                                ws.columns = arrayOfHeaderStyle[2];
                                                headCell = ws.getRow(currentRowPos);
                                                headCell.font = { bold: true };
                                            }

                                            ws.addRow([
                                                schemeElement.index,
                                                schemeElement.name,
                                                schemeElement.schemeName,
                                                schemeElement.folio,
                                                schemeElement.registeredDate,
                                                schemeElement.fromDate,
                                                schemeElement.toDate,
                                                schemeElement.toTriggerDay,
                                                schemeElement.frequency,
                                                schemeElement.amount,
                                                schemeElement.weightInPerc,
                                            ]);
                                        });
                                    }

                                }
                            });
                        } else {
                            catElement.subCatList.forEach((subCatElement, index2) => {
                                if (subCatElement.schemeList.length !== 0) {

                                    subCatElement.schemeList.forEach((schemeElement, index3) => {
                                        if (!excluded.schemeList) {
                                            currentRowPos = currentRowPos + 2;
                                            if(index3 === 0 && index2 === 0 && index1 === 0){
                                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                                ws.columns = arrayOfHeaderStyle[2];
                                                headCell = ws.getRow(currentRowPos);
                                                headCell.font = { bold: true };
                                            }
                                            ws.addRow([
                                                schemeElement.index,
                                                schemeElement.name,
                                                schemeElement.schemeName,
                                                schemeElement.folio,
                                                schemeElement.registeredDate,
                                                schemeElement.fromDate,
                                                schemeElement.toDate,
                                                schemeElement.toTriggerDay,
                                                schemeElement.frequency,
                                                schemeElement.amount,
                                                schemeElement.weightInPerc,
                                            ]);

                                        } 
                                    });
                                }
                            });
                        }
                    }
                }

            });
        }

        if (choice === 'amc-wise-aum-mis') {
            arrayOfExcelData.forEach((amcElement, index1) => {
                if (!excluded.amcList) {
                    if (index1 == 0) {
                        currentRowPos = 5;
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } else {
                        currentRowPos = currentRowPos + 2;
                    }
                    // else {
                    //     currentRowPos = currentRowPos + 2;
                    //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    //     ws.columns = arrayOfHeaderStyle[0];
                    //     headCell = ws.getRow(currentRowPos);
                    //     headCell.font = { bold: true };
                    // }

                    ws.addRow([
                        amcElement.index,
                        amcElement.name,
                        amcElement.sipAmount,
                        amcElement.sipCount,
                        amcElement.weightInPerc,
                    ]);
                }

                if (amcElement.schemeList.length !== 0) {
                    if (!excluded.schemeList) {
                        amcElement.schemeList.forEach((schemeElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                schemeElement.index,
                                schemeElement.name,
                                schemeElement.sipAmount,
                                schemeElement.sipCount,
                                schemeElement.weightInPerc
                            ]);
                            if (schemeElement.investorList.length !== 0) {
                                if (!excluded.investorList) {
                                    schemeElement.investorList.forEach((investorElement, index2) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            investorElement.index,
                                            investorElement.name,
                                            investorElement.sipAmount,
                                            investorElement.sipCount,
                                            investorElement.weightInPerc
                                        ]);
                                        if (investorElement.applicantList.length !== 0) {
                                            if (!excluded.applicantList) {
                                                investorElement.applicantList.forEach((applicantElement, index3) => {
                                                    currentRowPos = currentRowPos + 2;
                                                    if(index3 === 0 && index2 === 0 && index1=== 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        applicantElement.index,
                                                        applicantElement.name,
                                                        applicantElement.schemeName,
                                                        applicantElement.folio,
                                                        applicantElement.registeredDate,
                                                        applicantElement.fromDate,
                                                        applicantElement.toDate,
                                                        applicantElement.triggerDay,
                                                        applicantElement.frequency,
                                                        applicantElement.amount,
                                                        applicantElement.weightInPerc
                                                    ]);
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        amcElement.schemeList.forEach((schemeElement, index2) => {
                            if (schemeElement.investorList.length !== 0) {
                                if (!excluded.investorList) {
                                    schemeElement.investorList.forEach((investorElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            investorElement.index,
                                            investorElement.name,
                                            investorElement.sipAmount,
                                            investorElement.sipCount,
                                            investorElement.weightInPerc
                                        ]);
                                        if (investorElement.applicantList.length !== 0) {
                                            investorElement.applicantList.forEach(element => {
                                                currentRowPos = currentRowPos + 2;
                                                ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                ws.columns = arrayOfHeaderStyle[3];
                                                headCell = ws.getRow(currentRowPos);
                                                headCell.font = { bold: true };
                                                ws.addRow([
                                                    element.index,
                                                    element.name,
                                                    element.schemeName,
                                                    element.folio,
                                                    element.registeredDate,
                                                    element.fromDate,
                                                    element.toDate,
                                                    element.triggerDay,
                                                    element.frequency,
                                                    element.amount,
                                                    element.weightInPerc,
                                                ]);
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        if (choice === 'client-wise-aum-mis') {
            arrayOfExcelData.forEach((clientElement, index1) => {
                if (!excluded.clientList) {
                    if (index1 == 0) {
                        currentRowPos = 5;
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    }  else {
                        currentRowPos = currentRowPos + 2;
                    }
                    // else {
                    //     currentRowPos = currentRowPos + 2;
                    //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    //     ws.columns = arrayOfHeaderStyle[0];
                    //     headCell = ws.getRow(currentRowPos);
                    //     headCell.font = { bold: true };
                    // }

                    ws.addRow([
                        clientElement.index,
                        clientElement.name,
                        clientElement.sipAmount,
                        clientElement.weightInPerc
                    ]);
                }

                if (clientElement.investorList.length !== 0) {
                    if (!excluded.investorList) {
                        clientElement.investorList.forEach((investorElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }

                            ws.addRow([
                                investorElement.index,
                                investorElement.name,
                                investorElement.schemeName,
                                investorElement.folio,
                                investorElement.registeredDate,
                                investorElement.fromDate,
                                investorElement.toDate,
                                investorElement.triggerDay,
                                investorElement.frequency,
                                investorElement.sipAmount,
                                investorElement.weightInPerc
                            ]);

                            if (investorElement.schemeList.length !== 0) {
                                if (!excluded.schemeList) {
                                    investorElement.schemeList.forEach((schemeElement, index3) => {
                                        currentRowPos = currentRowPos + 2;

                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }

                                        ws.addRow([
                                            schemeElement.index,
                                            schemeElement.name,
                                            schemeElement.totalAum,
                                            schemeElement.weightInPerc
                                        ])

                                        if (schemeElement.schemeFolioList.length !== 0) {

                                            if (!excluded.schemeFolioList) {
                                                schemeElement.schemeFolioList.forEach((element, index4) => {
                                                    // if (investorElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + 1;
                                                    // } else if (investorElement.schemeList.length !== 0 && schemeElement.schemeFolioList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + schemeElement.schemeFolioList.length + 1;
                                                    // } else {
                                                    // }

                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
    
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.index,
                                                        element.name,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.balanceUnit,
                                                        element.weightInPerc
                                                    ]);
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    investorElement.schemeList.forEach(schemeElement => {
                                        if (schemeElement.schemeFolioList.length !== 0) {
                                            if (!excluded.schemeFolioList) {
                                                schemeElement.schemeFolio.forEach((element, index5) => {
                                                    // if (investorElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + 1;
                                                    // } else if (investorElement.schemeList.length !== 0 && schemeElement.schemeFolioList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + schemeElement.schemeFolioList.length + 1;
                                                    // } else {
                                                    // }
                                                    currentRowPos = currentRowPos + 2;

                                                    ws.addRow([
                                                        element.index,
                                                        element.name,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.balanceUnit,
                                                        element.weightInPerc
                                                    ]);
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        clientElement.investorList.forEach((investorElement, index2) => {
                            if (investorElement.schemeList.length !== 0) {
                                if (!excluded.schemeList) {
                                    investorElement.schemeList.forEach((schemeElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }

                                        ws.addRow([
                                            schemeElement.index,
                                            schemeElement.name,
                                            schemeElement.totalAum,
                                            schemeElement.weightInPerc
                                        ])

                                        if (schemeElement.schemeFolioList.length !== 0) {

                                            if (!excluded.schemeFolioList) {
                                                schemeElement.schemeFolioList.forEach((element, index4) => {
                                                    // if (investorElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + 1;
                                                    // } else if (investorElement.schemeList.length !== 0 && schemeElement.schemeFolioList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + schemeElement.schemeFolioList.length + 1;
                                                    // } else {
                                                    // }

                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.index,
                                                        element.name,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.balanceUnit,
                                                        element.weightInPerc
                                                    ]);
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    investorElement.schemeList.forEach(schemeElement => {
                                        if (schemeElement.schemeFolioList.length !== 0) {
                                            if (!excluded.schemeFolioList) {
                                                schemeElement.schemeFolioList.forEach((element, index5) => {
                                                    // if (investorElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + 1;
                                                    // } else if (investorElement.schemeList.length !== 0 && schemeElement.schemeFolioList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + schemeElement.schemeFolioList.length + 1;
                                                    // } else {
                                                    // }

                                                    currentRowPos = currentRowPos + 2;
                                                    if(index5 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.index,
                                                        element.name,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.balanceUnit,
                                                        element.weightInPerc
                                                    ]);
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        if (choice === 'applicant-wise-aum-mis') {
            arrayOfExcelData.forEach((applicantElement, index1) => {
                if (!excluded.applicantList) {
                    if (index1 == 0) {
                        currentRowPos = 5;
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } else {
                        currentRowPos= currentRowPos +2;
                    }
                    // else {
                    //     currentRowPos = currentRowPos + 2;
                    //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    //     ws.columns = arrayOfHeaderStyle[0];
                    //     headCell = ws.getRow(currentRowPos);
                    //     headCell.font = { bold: true };
                    // }
                    ws.addRow([
                        applicantElement.index,
                        applicantElement.name,
                        applicantElement.totalAum,
                        applicantElement.weightInPerc
                    ]);
                }

                if (applicantElement && applicantElement.hasOwnProperty('categoryList') && applicantElement.categoryList.length !== 0) {
                    if (!excluded.categoryList) {
                        applicantElement.categoryList.forEach((categoryElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                categoryElement.index,
                                categoryElement.name,
                                categoryElement.totalAum,
                                categoryElement.weightInPerc
                            ]);

                            if (categoryElement.subCategoryList.length !== 0) {
                                if (!excluded.subCategoryList) {
                                    categoryElement.subCategoryList.forEach((subCatElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
    
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            subCatElement.index,
                                            subCatElement.name,
                                            subCatElement.totalAum,
                                            subCatElement.weightInPerc
                                        ]);

                                        if (subCatElement.schemeList.length !== 0) {
                                            if (!excluded.schemeList) {
                                                subCatElement.schemeList.forEach((schemeElement, index4) => {
                                                    // if (applicantElement.categoryList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                    // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                    // } else {
                                                    // }
                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 === 0 && index3 ===0 && index2 ===0 && index1 ===0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }


                                                    ws.addRow([
                                                        schemeElement.index,
                                                        schemeElement.name,
                                                        schemeElement.folioNumber,
                                                        schemeElement.totalAum,
                                                        schemeElement.weightInPerc
                                                    ]);

                                                    if (schemeElement.schemeFolioList.length !== 0) {
                                                        // if (applicantElement.categoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                        // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                        // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + subCatElement.schemeList.length + 1;
                                                        // } else {
                                                        // }
                                                        
                                                        schemeElement.schemeFolioList.forEach((element, index5) => {
                                                            currentRowPos = currentRowPos + 2;
                                                            if(index5 === 0 && index4 === 0 && index3 ===0 && index2 ===0 && index1 ===0){
                                                                ws.getRow(currentRowPos).values = arrayOfHeaders[4];
                                                                ws.columns = arrayOfHeaderStyle[4];
                                                                headCell = ws.getRow(currentRowPos);
                                                                headCell.font = { bold: true };
                                                            }
                                                            ws.addRow([
                                                                element.index,
                                                                element.name,
                                                                element.folioNumber,
                                                                element.totalAum,
                                                                element.balanceUnit,
                                                                element.weightInPerc
                                                            ]);
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        if (applicantElement.categoryList.length !== 0) {
                            applicantElement.categoryList.forEach((categoryElement, index2) => {
                                if (categoryElement.subCategoryList.length !== 0) {
                                    if (!excluded.subCategoryList) {
                                        categoryElement.subCategoryList.forEach((subCatElement, index3) => {
                                            currentRowPos = currentRowPos + 2;
                                            if(index3 ===0 && index2 ===0 && index1 ===0){
                                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
    
                                                ws.columns = arrayOfHeaderStyle[2];
                                                headCell = ws.getRow(currentRowPos);
                                                headCell.font = { bold: true };
                                            }
                                            ws.addRow([
                                                subCatElement.index,
                                                subCatElement.name,
                                                subCatElement.totalAum,
                                                subCatElement.weightInPerc
                                            ]);

                                            if (subCatElement.schemeList.length !== 0) {
                                                if (!excluded.schemeList) {
                                                    subCatElement.schemeList.forEach((schemeElement, index4) => {
                                                        // if (applicantElement.categoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                        // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                        // } else {
                                                        // }
                                                        currentRowPos = currentRowPos + 2;
                                                        if(index4 === 0 && index3 ===0 && index2 ===0 && index1 ===0){
                                                            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                            ws.columns = arrayOfHeaderStyle[3];
                                                            headCell = ws.getRow(currentRowPos);
                                                            headCell.font = { bold: true };
                                                        }

                                                        ws.addRow([
                                                            schemeElement.index,
                                                            schemeElement.name,
                                                            schemeElement.folioNumber,
                                                            schemeElement.totalAum,
                                                            schemeElement.weightInPerc
                                                        ]);

                                                        if (schemeElement.schemeFolioList.length !== 0) {
                                                            // if (applicantElement.categoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + subCatElement.schemeList.length + 1;
                                                            // } else {
                                                            // }
                                                            
                                                            schemeElement.schemeFolioList.forEach((element,index5) => {
                                                                currentRowPos = currentRowPos + 2;
                                                                if(index5 === 0 && index4 === 0 && index3 ===0 && index2 ===0 && index1 ===0){
                                                                    ws.getRow(currentRowPos).values = arrayOfHeaders[4];
                                                                    ws.columns = arrayOfHeaderStyle[4];
                                                                    headCell = ws.getRow(currentRowPos);
                                                                    headCell.font = { bold: true };
                                                                }
                                                                ws.addRow([
                                                                    element.index,
                                                                    element.name,
                                                                    element.folioNumber,
                                                                    element.totalAum,
                                                                    element.balanceUnit,
                                                                    element.weightInPerc
                                                                ]);
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        categoryElement.subCategoryList.forEach(subCatElement => {
                                            if (subCatElement.schemeList.length !== 0) {
                                                if (!excluded.schemeList) {
                                                    subCatElement.schemeList.forEach((schemeElement, index3) => {
                                                        // if (applicantElement.categoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                        // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                        //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                        // } else {
                                                        // }
                                                        currentRowPos = currentRowPos + 2;
                                                        if(index3 ===0 && index2 ===0 && index1 ===0){
                                                            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                            ws.columns = arrayOfHeaderStyle[3];
                                                            headCell = ws.getRow(currentRowPos);
                                                            headCell.font = { bold: true };
                                                        }

                                                        ws.addRow([
                                                            schemeElement.index,
                                                            schemeElement.name,
                                                            schemeElement.folioNumber,
                                                            schemeElement.totalAum,
                                                            schemeElement.weightInPerc
                                                        ]);

                                                        if (schemeElement.schemeFolioList.length !== 0) {
                                                            // if (applicantElement.categoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + subCatElement.schemeList.length + 1;
                                                            // } else {
                                                            // }
                                                            schemeElement.schemeFolioList.forEach((element, index4) => {
                                                                currentRowPos = currentRowPos + 2;
                                                                if(index4 === 0 && index3 ===0 && index2 ===0 && index1 ===0){
                                                                    ws.getRow(currentRowPos).values = arrayOfHeaders[4];
                                                                    ws.columns = arrayOfHeaderStyle[4];
                                                                    headCell = ws.getRow(currentRowPos);
                                                                    headCell.font = { bold: true };
                                                                }
                                                                ws.addRow([
                                                                    element.index,
                                                                    element.name,
                                                                    element.folioNumber,
                                                                    element.totalAum,
                                                                    element.balanceUnit,
                                                                    element.weightInPerc
                                                                ]);
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    subCatElement.schemeList.forEach(schemeElement => {
                                                        if (schemeElement.schemeFolioList.length !== 0) {
                                                            // if (applicantElement.categoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + 1;
                                                            // } else if (applicantElement.categoryList.length !== 0 && categoryElement.subCategoryList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                            //     currentRowPos = currentRowPos + applicantElement.categoryList.length + categoryElement.subCategoryList.length + subCatElement.schemeList.length + 1;
                                                            // } else {
                                                            //     currentRowPos = currentRowPos + 2;
                                                            // }
                                                            schemeElement.schemeFolioList.forEach((element, index5) => {
                                                            currentRowPos = currentRowPos + 2;
                                                                if(index5 === 0 && index2 ===0 && index1 ===0){
                                                                    ws.getRow(currentRowPos).values = arrayOfHeaders[4];
                                                                    ws.columns = arrayOfHeaderStyle[4];
                                                                    headCell = ws.getRow(currentRowPos);
                                                                    headCell.font = { bold: true };
                                                                }

                                                                ws.addRow([
                                                                    element.index,
                                                                    element.name,
                                                                    element.folioNumber,
                                                                    element.totalAum,
                                                                    element.balanceUnit,
                                                                    element.weightInPerc
                                                                ]);
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }

                    }


                }
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

        const last = ws.addRow(totalArray);
        last.font = { bold: true };

        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), metaData + '-' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.xlsx');

    }

    static async exportExcel3(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?,arrOfParentTableNames?) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday','Saturday'];
        const monthArr = ['January', 'February','March', 'April','May', 'June', 'July','August','September', 'October','November','December'];
        const currentDate = new Date();
        const curDateFormat = daysArr[currentDate.getDay()] + "- " 
        + monthArr[currentDate.getMonth()] + ' '
        + `${(currentDate.getDate() < 10) ? '0': '' }` + currentDate.getDate() + ', ' 
        + currentDate.getFullYear();

        let userData = AuthService.getUserInfo();
        let username;
        if (userData.hasOwnProperty('fullName')) {
            username = userData.fullName;
        } else {
            username = userData.name;
        }

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + username;

        let initialRowCount = 3;
        if(arrOfParentTableNames && arrOfParentTableNames.length!==0){
            arrOfParentTableNames.forEach(element => {
                let row = ws.getRow(initialRowCount);
                row.values = element;
                row.font = { bold: true };
                initialRowCount += 1;
            });
            ws.addRow(['','','','']);
            initialRowCount += 1;
            ws.addRow(['Report as on - ', curDateFormat]);
            initialRowCount += 1;
        } else {
            ws.getCell('A3').value = 'Report as on - ' + curDateFormat;
            initialRowCount = 5;
        }

        const head = ws.getRow(5);
        head.font = { bold: true };

        let currentRowPos = initialRowCount;
        let headCell;

        if (choice === 'category-wise-aum-mis') {
            arrayOfExcelData.forEach((subCatElement, index1) => {
                if (index1 == 0) {
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                } 
                else {
                //     ws.addRow(['', '', '', '']);
                    currentRowPos = currentRowPos + 2;
                }
                //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                //     ws.columns = arrayOfHeaderStyle[0];
                //     headCell = ws.getRow(currentRowPos);
                //     headCell.font = { bold: true };
                // }
                ws.addRow([
                    subCatElement.index,
                    subCatElement.name,
                    subCatElement.sipAmount,
                    subCatElement.sipCount,
                    subCatElement.weightInPerc
                ]);

                if (subCatElement && subCatElement.hasOwnProperty('schemeList') && subCatElement.schemeList.length !== 0) {
                    if (!excluded.schemeList) {
                        subCatElement.schemeList.forEach((schemeElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1=== 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                schemeElement.index,
                                schemeElement.name,
                                schemeElement.schemeName,
                                schemeElement.folio,
                                schemeElement.registeredDate,
                                schemeElement.fromDate,
                                schemeElement.toDate,
                                schemeElement.toTriggerDay,
                                schemeElement.frequency,
                                schemeElement.amount,
                                schemeElement.weightInPerc,
                            ]);

                            if (schemeElement.applicantList.length !== 0) {
                                // if (catElement.subCatList.length !== 0) {
                                //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                // } else if (catElement.subCatList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                //     currentRowPos = currentRowPos + catElement.subCatList.length + subCatElement.schemeList.length + 1;
                                // } else {
                                // }

                                schemeElement.applicantList.forEach((element, index3) => {
                                    currentRowPos = currentRowPos + 2;
                                    if(index3 === 0 && index2 === 0 && index1 === 0){
                                        ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                        ws.columns = arrayOfHeaderStyle[2];
                                        headCell = ws.getRow(currentRowPos);
                                        headCell.font = { bold: true };
                                    }

                                    ws.addRow([
                                        element.name,
                                        element.schemeName,
                                        element.folio,
                                        element.registeredDate,
                                        element.fromDate,
                                        element.toDate,
                                        element.toTriggerDay,
                                        element.frequency,
                                        element.amount,
                                        element.weightInPerc,
                                    ]);
                                });
                            }
                        });
                    }
                }

            });
        }

        if (choice === 'client-wise-aum-mis') {
            arrayOfExcelData.forEach((investorElement, index1) => {
                if (index1 == 0) {
                    currentRowPos = 5;
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                } 
                else {
                    currentRowPos = currentRowPos + 2;
                }
                //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                //     ws.columns = arrayOfHeaderStyle[0];
                //     headCell = ws.getRow(currentRowPos);
                //     headCell.font = { bold: true };
                // }
                ws.addRow([
                    investorElement.index,
                    investorElement.name,
                    investorElement.schemeName,
                    investorElement.folio,
                    investorElement.registeredDate,
                    investorElement.fromDate,
                    investorElement.toDate,
                    investorElement.triggerDay,
                    investorElement.frequency,
                    investorElement.sipAmount,
                    investorElement.weightInPerc
                ]);

                if (investorElement.schemeList.length !== 0) {
                    if (!excluded.schemeList) {
                        investorElement.schemeList.forEach((schemeElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                ws.columns = arrayOfHeaderStyle[2];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }


                            ws.addRow([
                                schemeElement.index,
                                schemeElement.name,
                                schemeElement.totalAum,
                                schemeElement.weightInPerc
                            ])

                            if (schemeElement.schemeFolioList.length !== 0) {

                                if (!excluded.schemeFolioList) {
                                    schemeElement.schemeFolioList.forEach((element, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
    
                                            ws.columns = arrayOfHeaderStyle[3];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            element.index,
                                            element.name,
                                            element.folioNumber,
                                            element.totalAum,
                                            element.balanceUnit,
                                            element.weightInPerc
                                        ]);
                                    });
                                }
                            }
                        });
                    } else {
                        investorElement.schemeList.forEach(schemeElement => {
                            if (schemeElement.schemeFolioList.length !== 0) {
                                if (!excluded.schemeFolioList) {
                                    schemeElement.schemeFolio.forEach((element, index4) => {
                                        currentRowPos = currentRowPos + 2;

                                        ws.addRow([
                                            element.index,
                                            element.name,
                                            element.folioNumber,
                                            element.totalAum,
                                            element.balanceUnit,
                                            element.weightInPerc
                                        ]);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        if (choice === 'amc-wise-aum-mis') {
            arrayOfExcelData.forEach((schemeElement, index1) => {
                if (index1 == 0) {
                    currentRowPos = 5;
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                }
                 else {
                    currentRowPos = currentRowPos + 2;
                 }
                //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                //     ws.columns = arrayOfHeaderStyle[0];
                //     headCell = ws.getRow(currentRowPos);
                //     headCell.font = { bold: true };
                // }
                ws.addRow([
                    schemeElement.index,
                    schemeElement.name,
                    schemeElement.sipAmount,
                    schemeElement.sipCount,
                    schemeElement.weightInPerc
                ]);
                if (schemeElement.investorList.length !== 0) {
                    if (!excluded.investorList) {
                        schemeElement.investorList.forEach((investorElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                ws.columns = arrayOfHeaderStyle[2];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }

                            ws.addRow([
                                investorElement.index,
                                investorElement.name,
                                investorElement.sipAmount,
                                investorElement.sipCount,
                                investorElement.weightInPerc
                            ]);
                            if (investorElement.applicantList.length !== 0) {
                                if (!excluded.applicantList) {
                                    investorElement.applicantList.forEach((applicantElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                            ws.columns = arrayOfHeaderStyle[3];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            applicantElement.index,
                                            applicantElement.name,
                                            applicantElement.schemeName,
                                            applicantElement.folio,
                                            applicantElement.registeredDate,
                                            applicantElement.fromDate,
                                            applicantElement.toDate,
                                            applicantElement.triggerDay,
                                            applicantElement.frequency,
                                            applicantElement.amount,
                                            applicantElement.weightInPerc
                                        ]);
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        const last = ws.addRow(totalArray);
        last.font = { bold: true };

        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), metaData + '-' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.xlsx');
    }
    
    static async exportExcel4(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday',  'Thursday','Friday','Saturday'];
        const monthArr = ['January', 'February','March', 'April','May', 'June', 'July','August','September', 'October','November','December'];
        const currentDate = new Date();
        const curDateFormat = daysArr[currentDate.getDay()] + "- " 
        + monthArr[currentDate.getMonth()] + ' '
        + `${(currentDate.getDate() < 10) ? '0': '' }` + currentDate.getDate() + ', ' 
        + currentDate.getFullYear();

        let userData = AuthService.getUserInfo();
        let username;
        if (userData.hasOwnProperty('fullName')) {
            username = userData.fullName;
        } else {
            username = userData.name;
        }

        ws.getCell('A1').value = 'Type of report - ' + metaData;
        ws.getCell('A2').value = `Client name - ` + username;

        let initialRowCount = 3;
        if(arrOfParentTableNames && arrOfParentTableNames.length!==0){
            arrOfParentTableNames.forEach(element => {
                let row = ws.getRow(initialRowCount);
                row.values = element;
                row.font = { bold: true };
                initialRowCount += 1;
            });
            ws.addRow(['','','','']);
            initialRowCount += 1;
            ws.addRow(['Report as on - ', curDateFormat]);
            initialRowCount += 1;
        } else {
            ws.getCell('A3').value = 'Report as on - ' + curDateFormat;
            initialRowCount = 5;
        }

        const head = ws.getRow(initialRowCount);
        head.font = { bold: true };

        let currentRowPos = initialRowCount;
        let headCell;

        if (choice === 'amc-wise-aum-mis') {
            arrayOfExcelData.forEach((investorElement, index1) => {
                if(index1 ===0) {
                    currentRowPos = 5;
                    ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                    ws.columns = arrayOfHeaderStyle[2];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                }else {
                    currentRowPos = currentRowPos + 2;
                }
                // ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                // ws.columns = arrayOfHeaderStyle[2];
                // headCell = ws.getRow(currentRowPos);
                // headCell.font = { bold: true };

                ws.addRow([
                    investorElement.index,
                    investorElement.name,
                    investorElement.sipAmount,
                    investorElement.sipCount,
                    investorElement.weightInPerc
                ]);
                if (investorElement.applicantList.length !== 0) {
                    if (!excluded.applicantList) {
                        investorElement.applicantList.forEach((applicantElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                ws.columns = arrayOfHeaderStyle[3];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                applicantElement.index,
                                applicantElement.name,
                                applicantElement.schemeName,
                                applicantElement.folio,
                                applicantElement.registeredDate,
                                applicantElement.fromDate,
                                applicantElement.toDate,
                                applicantElement.triggerDay,
                                applicantElement.frequency,
                                applicantElement.amount,
                                applicantElement.weightInPerc
                            ]);
                        });
                    }
                }
            });
        }


        const last = ws.addRow(totalArray);
        last.font = { bold: true };

        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), metaData + '-' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.xlsx');
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
                if (parseInt(c) != rows[cells].cells.length) {
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
        const worksheet = workbook.addWorksheet(this.advisor.name + '_' + title + '_' + 'Data');


        // Add Row and formatting
        worksheet.addRow([]);
        const titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.addRow([]);

        worksheet.addRow(['Advisor', this.advisor.name]);
        worksheet.addRow(['Client', this.client ? this.client.name : '']);
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
        }
        );

        worksheet.getColumn(2).width = 30;
        const footerRow = worksheet.addRow(footer);


        footerRow.eachCell((cell, indexNumber) => {
            footerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCFFE5' }
            };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, title + '.xlsx');
        });
        return data;
    }

    generateAllSipExcel(excelData, title){
        // Create workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(this.advisor.name + '_' + title + '_' + 'Data');


        // Add Row and formatting
        worksheet.addRow([]);
        const titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.addRow([]);

        worksheet.addRow(['Advisor', this.advisor.name]);
        worksheet.addRow(['Client', this.client ? this.client.name : '']);
        worksheet.addRow([]);
        const header = ['Index', 'Applicant Name', 'Scheme Name','Folio Number', 'From Date', 'To Date','Frequency','Amount','Status'];
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
        excelData.forEach(d => {
            worksheet.addRow(d);
            // let qty = row.getCell(5);
        });

        worksheet.getColumn(2).width = 30;
        // const footerRow = worksheet.addRow(footer);


        // footerRow.eachCell((cell, indexNumber) => {
        //     footerRow.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: 'FFCCFFE5' }
        //     };
        //     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        // });
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, title + '.xlsx');
        });
    }
}
