import { AuthService } from 'src/app/auth-service/authService';
import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelMisService {
    
    constructor() { }
    // single array excel 
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

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Friday','Saturday'];
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

        
        ws.getRow(initialRowCount).values = header;
        ws.getRow(initialRowCount).font = { bold: true };
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
                    (element.hasOwnProperty('field6') && element.field6 !== undefined) ? element.field6 : ''
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
        saveAs(new Blob([buf]), name + '-' + metaData + '.xlsx');
    }
    // main excel 
    static async exportExcel2(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {
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

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Friday','Saturday'];
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
        // get a1

        let currentRowPos = initialRowCount;
        let headCell;

        if (choice === 'category-wise-aum-mis') {
            arrayOfExcelData.forEach((catElement, index1) => {
                //  if index >0 check downDisable false  || index == 0
                if (!excluded.categoryList) {
                    if (index1 == 0) {
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } 
                    else {
                        // ws.addRow(['', '', '', '']);
                        currentRowPos = currentRowPos + 2;
                    }
                    //     ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    //     ws.columns = arrayOfHeaderStyle[0];
                    //     headCell = ws.getRow(currentRowPos);
                    //     headCell.font = { bold: true };
                    // }
                    ws.addRow([
                        catElement.index,
                        catElement.categoryName,
                        catElement.totalAum,
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
                                    subCatElement.totalAum,
                                    subCatElement.weightInPerc
                                ]);

                                if (subCatElement.schemeList.length !== 0) {

                                    // if (subCatElement.subCatList !== 0) {
                                    //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                    // } else {
                                    // }

                                    subCatElement.schemeList.forEach((schemeElement, index3) => {
                                        // if (subCatElement.showBottomList) {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3===0 && index2 === 0 && index1 === 0){
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
                                        ]);

                                        if (schemeElement.applicantList.length !== 0) {
                                            // if (catElement.subCatList.length !== 0) {
                                            //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                            // } else if (catElement.subCatList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                            //     currentRowPos = currentRowPos + catElement.subCatList.length + subCatElement.schemeList.length + 1;
                                            // } else {
                                            // }

                                            schemeElement.applicantList.forEach((element, index4) => {
                                                // if (schemeElement.showBottomList) {
                                                currentRowPos = currentRowPos + 2;
                                                if(index4 === 0 && index3 === 0 && index2 ===0 && index1 === 0){
                                                    ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                    ws.columns = arrayOfHeaderStyle[3];
                                                    headCell = ws.getRow(currentRowPos);
                                                    headCell.font = { bold: true };
                                                }

                                                ws.addRow([
                                                    element.name,
                                                    element.balanceUnit,
                                                    element.folioNumber,
                                                    element.totalAum,
                                                    element.weightInPerc
                                                ]);
                                                // }

                                            });
                                        }
                                        // }
                                    });
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
                                    subCatElement.totalAum,
                                    subCatElement.weightInPerc
                                ]);

                                if (subCatElement.schemeList.length !== 0) {
                                    if (!excluded.subCatList) {
                                        // if (subCatElement.subCatList !== 0) {
                                        //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                        // } else {
                                        // }

                                        subCatElement.schemeList.forEach((schemeElement, index3) => {
                                            // if (subCatElement.showBottomList) {
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
                                            ]);

                                            if (schemeElement.applicantList.length !== 0) {
                                                // if (catElement.subCatList.length !== 0) {
                                                //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                                // } else if (catElement.subCatList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                //     currentRowPos = currentRowPos + catElement.subCatList.length + subCatElement.schemeList.length + 1;
                                                // } else {
                                                // }

                                                schemeElement.applicantList.forEach((element, index4) => {
                                                    // if (schemeElement.showBottomList) {
                                                    currentRowPos = currentRowPos + 2;

                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.name,
                                                        element.balanceUnit,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.weightInPerc
                                                    ]);
                                                    // }
                                                });
                                            }
                                            // }
                                        });
                                    } else {
                                        subCatElement.schemeList.forEach((schemeElement, index3) => {
                                            if (schemeElement.applicantList.length !== 0) {
                                                // if (catElement.subCatList.length !== 0) {
                                                //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                                // } else if (catElement.subCatList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                //     currentRowPos = currentRowPos + catElement.subCatList.length + subCatElement.schemeList.length + 1;
                                                // } else {
                                                // }

                                                schemeElement.applicantList.forEach((element, index4) => {
                                                    // if (schemeElement.showBottomList) {
                                                    currentRowPos = currentRowPos + 1;
                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.name,
                                                        element.balanceUnit,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.weightInPerc
                                                    ]);
                                                    // }

                                                });
                                            }
                                        });
                                    }

                                }
                            });
                        } else {
                            catElement.subCatList.forEach((subCatElement, index2) => {
                                if (subCatElement.hasOwnProperty('schemeList') && subCatElement.schemeList.length !== 0) {
                                    // if (catElement.subCatList.length !== 0) {
                                    //     currentRowPos = currentRowPos + catElement.subCatList.length + 1;
                                    // } else {
                                    // }

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
                                                schemeElement.totalAum,
                                                schemeElement.weightInPerc
                                            ]);

                                            if (schemeElement.applicantList.length !== 0) {

                                                schemeElement.applicantList.forEach((element, index4) => {
                                                    // if (schemeElement.shwoBottomList) {
                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 ===0 && index3 === 0 && index2 === 0 && index1 ===0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.name,
                                                        element.balanceUnit,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.weightInPerc
                                                    ]);
                                                    // }

                                                });
                                            }
                                        } else {
                                            if (schemeElement.applicantList.length !== 0) {
                                                schemeElement.applicantList.forEach((element, index4) => {
                                                    // if (catElement.subCatList.length !== 0) {
                                                    //     currentRowPos = currentRowPos  + 1;
                                                    // } else if (catElement.subCatList.length !== 0 && subCatElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + 2;
                                                    // } else {
                                                    //     currentRowPos = currentRowPos + 2;
                                                    // }
                                                    // if (schemeElement.showBottomList) {
                                                    currentRowPos = currentRowPos + 2;

                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
                                                        ws.getRow(currentRowPos).values = arrayOfHeaders[3];
                                                        ws.columns = arrayOfHeaderStyle[3];
                                                        headCell = ws.getRow(currentRowPos);
                                                        headCell.font = { bold: true };
                                                    }
                                                    ws.addRow([
                                                        element.name,
                                                        element.balanceUnit,
                                                        element.folioNumber,
                                                        element.totalAum,
                                                        element.weightInPerc
                                                    ]);
                                                    // }
                                                });
                                            }
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
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } 
                    else {
                        currentRowPos = currentRowPos + 2;
                        // ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        // ws.columns = arrayOfHeaderStyle[0];
                        // headCell = ws.getRow(currentRowPos);
                        // headCell.font = { bold: true };
                    }

                    ws.addRow([
                        amcElement.index,
                        amcElement.name,
                        amcElement.totalAum,
                        amcElement.weightInPerc
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
                                schemeElement.totalAum,
                                schemeElement.weightInPerc
                            ]);

                            if (schemeElement.applicantList.length !== 0) {
                                if (!excluded.applicantList) {
                                    schemeElement.applicantList.forEach((applicantElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2===0 &&index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            applicantElement.name,
                                            applicantElement.balanceUnit,
                                            applicantElement.folioNumber,
                                            applicantElement.totalAum,
                                            applicantElement.weightInPerc
                                        ]);
                                    });
                                }
                            } 
                        });
                    } else {
                        amcElement.schemeList.forEach((schemeElement, index2) => {
                            if (schemeElement.applicantList.length !== 0) {
                                if (!excluded.applicantList) {
                                    schemeElement.applicantList.forEach(applicantElement => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                            ws.columns = arrayOfHeaderStyle[2];
                                            headCell = ws.getRow(currentRowPos);
                                            headCell.font = { bold: true };
                                        }
                                        ws.addRow([
                                            applicantElement.name,
                                            applicantElement.balanceUnit,
                                            applicantElement.folioNumber,
                                            applicantElement.totalAum,
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

        if (choice === 'client-wise-aum-mis') {
            arrayOfExcelData.forEach((clientElement, index1) => {
                if (!excluded.clientList) {
                    if (index1 == 0) {
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
                        clientElement.index,
                        clientElement.name,
                        clientElement.totalAum,
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
                                investorElement.totalAum,
                                investorElement.weightInPerc
                            ]);

                            if (investorElement.schemeList.length !== 0) {
                                if (!excluded.schemeList) {
                                    investorElement.schemeList.forEach((schemeElement, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2===0 &&index1===0){
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
                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 ===0){
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
                                                    // if (investorElement.schemeList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + 1;
                                                    // } else if (investorElement.schemeList.length !== 0 && schemeElement.schemeFolioList.length !== 0) {
                                                    //     currentRowPos = currentRowPos + investorElement.schemeList.length + schemeElement.schemeFolioList.length + 1;
                                                    // } else {
                                                    // }

                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 === 0 && index2 === 0 && index1 === 0){
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
                                    investorElement.schemeList.forEach((schemeElement, index3) => {
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
                                                    if(index4 === 0 && index3 === 0 && index2 ===0 && index1 === 0){
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
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } else {
                        currentRowPos = currentRowPos + 2;
                    }
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

                if (applicantElement.categoryList.length !== 0) {
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
                                                    currentRowPos = currentRowPos + 2;
                                                    if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
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

                                                        schemeElement.schemeFolioList.forEach((element,index5) => {
                                                            currentRowPos = currentRowPos + 2;
                                                            if(index5 === 0 && index4 === 0 &&  index3 === 0 && index2 === 0 && index1 === 0){
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
                                                        currentRowPos = currentRowPos + 2;
                                                        if(index4 === 0 && index3 === 0 && index2 === 0 && index1 === 0){
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
                                                            schemeElement.schemeFolioList.forEach((element, index5) => {
                                                                currentRowPos = currentRowPos + 2;
                                                                if(index5 === 0 && index4 == 0&& index3 === 0 && index2 === 0 && index1 === 0){
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
                                                    subCatElement.schemeList.forEach((schemeElement, index2) => {
                                                        currentRowPos = currentRowPos + 2;

                                                        if(index2 === 0 && index1 === 0){
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
                                                            schemeElement.schemeFolioList.forEach((element, index3) => {
                                                                currentRowPos = currentRowPos + 2;
                                                                if(index3 === 0 && index2 === 0 && index1 === 0){
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
                                                            schemeElement.schemeFolioList.forEach((element, index2) => {
                                                                currentRowPos = currentRowPos + 2;
                                                                if(index2 === 0 && index1 === 0){
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
        let name;
        if (userData.hasOwnProperty('fullName')) {
            name = userData.fullName;
        } else {
            name = userData.name;
        }
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        saveAs(new Blob([buf]), metaData + '-' + `${String(date).length === 1 ? '0' : ''}${date}` + '-' + `${String(month).length === 1 ? '0' : ''}${month}` + '-' + new Date().getFullYear() + '.xlsx');
        // saveAs(new Blob([buf]), metaData + '-' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.xlsx');

    }

    // depth level 2 array excel
    static async exportExcel3(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {
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
        
        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Friday','Saturday'];
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
                ws.addRow(['Report as on - ', curDateFormat]);
                initialRowCount += 1;
            });
            ws.addRow(['','','','']);
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
            arrayOfExcelData.forEach((subCatElement, index1) => {
                if (index1 == 0) {
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                } 
                else {
                    // ws.addRow(['', '', '', '']);
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
                    subCatElement.totalAum,
                    subCatElement.weightInPerc
                ]);

                if (subCatElement.schemeList.length !== 0) {
                    subCatElement.schemeList.forEach((schemeElement, index2) => {
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
                            schemeElement.totalAum,
                            schemeElement.weightInPerc
                        ]);

                        if (schemeElement.applicantList.length !== 0) {
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
                                    element.balanceUnit,
                                    element.folioNumber,
                                    element.totalAum,
                                    element.weightInPerc
                                ]);
                            });
                        }
                    });
                }
            });
        }

        if (choice === 'amc-wise-aum-mis') {
            arrayOfExcelData.forEach((schemeElement, index1) => {
                if (!excluded.schemeList) {
                    if (index1 == 0) {
                        ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                        ws.columns = arrayOfHeaderStyle[0];
                        headCell = ws.getRow(currentRowPos);
                        headCell.font = { bold: true };
                    } else {
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
                        schemeElement.totalAum,
                        schemeElement.weightInPerc
                    ]);

                    if (schemeElement.applicantList.length !== 0) {
                        schemeElement.applicantList.forEach((applicantElement, index2) => {
                            currentRowPos = currentRowPos + 2;
                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                applicantElement.name,
                                applicantElement.balanceUnit,
                                applicantElement.folioNumber,
                                applicantElement.totalAum,
                                applicantElement.weightInPerc
                            ]);
                        });
                    }

                } else {
                    if (schemeElement.applicantList.length !== 0) {
                        schemeElement.applicantList.forEach((applicantElement, index2) => {
                            currentRowPos = currentRowPos + 2;

                            if(index2 === 0 && index1 === 0){
                                ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                                ws.columns = arrayOfHeaderStyle[1];
                                headCell = ws.getRow(currentRowPos);
                                headCell.font = { bold: true };
                            }
                            ws.addRow([
                                applicantElement.name,
                                applicantElement.balanceUnit,
                                applicantElement.folioNumber,
                                applicantElement.totalAum,
                                applicantElement.weightInPerc
                            ]);
                        });
                    }
                }
            });
        }

        if (choice === 'client-wise-aum-mis') {
            arrayOfExcelData.forEach((investorElement, index1) => {
                if (!excluded.investorList) {
                    if (index1 == 0) {
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
                        investorElement.totalAum,
                        investorElement.weightInPerc
                    ]);

                }
                if (investorElement.schemeList.length !== 0) {
                    if (!excluded.schemeList) {
                        investorElement.schemeList.forEach((schemeElement, index2) => {
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
                                schemeElement.totalAum,
                                schemeElement.weightInPerc
                            ])

                            if (schemeElement.schemeFolioList.length !== 0) {

                                if (!excluded.schemeFolioList) {
                                    schemeElement.schemeFolioList.forEach((element, index3) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index3 === 0 && index2 === 0 && index1 === 0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
    
                                            ws.columns = arrayOfHeaderStyle[2];
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
                                    schemeElement.schemeFolio.forEach((element, index2) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index2 === 0 && index1 ==0){
                                            ws.getRow(currentRowPos).values = arrayOfHeaders[2];
    
                                            ws.columns = arrayOfHeaderStyle[2];
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

        if (choice === 'applicant-wise-aum-mis') {
            arrayOfExcelData.forEach((categoryElement, index1) => {
                if (index1 == 0) {
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
                    categoryElement.index,
                    categoryElement.name,
                    categoryElement.totalAum,
                    categoryElement.weightInPerc
                ]);
                if (categoryElement.subCategoryList.length !== 0) {
                    categoryElement.subCategoryList.forEach((subCatElement, index2) => {
                        currentRowPos = currentRowPos + 2;
                        if(index2 === 0 && index1===0){
                            ws.getRow(currentRowPos).values = arrayOfHeaders[1];
    
                            ws.columns = arrayOfHeaderStyle[1];
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
                            subCatElement.schemeList.forEach((schemeElement, index3) => {
                                currentRowPos = currentRowPos + 2;
                                if(index3 === 0 && index2 ===0 && index1 === 0){
                                    ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                    ws.columns = arrayOfHeaderStyle[2];
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

                                    schemeElement.schemeFolioList.forEach((element, index4) => {
                                        currentRowPos = currentRowPos + 2;
                                        if(index4 === 0 && index3 === 0 && index2 === 0 && index1 ===0){
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
                            });
                        }
                    });
                }
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
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        saveAs(new Blob([buf]), metaData + '-' + `${String(date).length === 1 ? '0' : ''}${date}` + '-' + `${String(month).length === 1 ? '0' : ''}${month}` + '-' + new Date().getFullYear() + '.xlsx');

    }

    // depth level 3 array excel
    static async exportExcel4(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {

        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Friday','Saturday'];
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
            arrayOfExcelData.forEach((schemeElement, index1) => {
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
                    schemeElement.index,
                    schemeElement.name,
                    schemeElement.totalAum,
                    schemeElement.weightInPerc
                ]);

                if (schemeElement.applicantList.length !== 0) {
                    schemeElement.applicantList.forEach((element, index4) => {
                        currentRowPos = currentRowPos + 2;
                        if(index4 === 0 && index1 === 0){
                            ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                            ws.columns = arrayOfHeaderStyle[1];
                            headCell = ws.getRow(currentRowPos);
                            headCell.font = { bold: true };
                        }

                        ws.addRow([
                            element.name,
                            element.balanceUnit,
                            element.folioNumber,
                            element.totalAum,
                            element.weightInPerc
                        ]);
                    });
                }
            });
        }

        if (choice === 'applicant-wise-aum-mis') {
            arrayOfExcelData.forEach((subCatElement, index1) => {
                if (index1 == 0) {
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                }
                 else {
                    currentRowPos = currentRowPos + 2;
                    // ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    // ws.columns = arrayOfHeaderStyle[0];
                    // headCell = ws.getRow(currentRowPos);
                    // headCell.font = { bold: true };
                } 
                ws.addRow([
                    subCatElement.index,
                    subCatElement.name,
                    subCatElement.totalAum,
                    subCatElement.weightInPerc
                ]);

                if (subCatElement.schemeList.length !== 0) {
                    subCatElement.schemeList.forEach((schemeElement, index2) => {
                        currentRowPos = currentRowPos + 2;
                        if(index2 === 0 && index1 ===0){
                            ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                            ws.columns = arrayOfHeaderStyle[1];
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

                            schemeElement.schemeFolioList.forEach((element, index3) => {
                                currentRowPos = currentRowPos + 2;
                                if(index3 === 0 && index2=== 0 && index1===0) {
                                    ws.getRow(currentRowPos).values = arrayOfHeaders[2];
                                    ws.columns = arrayOfHeaderStyle[2];
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
            })
        }

        if (choice === 'client-wise-aum-mis') {
            arrayOfExcelData.forEach((schemeElement, index1) => {

                if (index1 == 0) {
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
                    schemeElement.totalAum,
                    schemeElement.weightInPerc
                ])

                if (schemeElement.schemeFolioList.length !== 0) {
                    schemeElement.schemeFolioList.forEach((element, index2) => {
                        currentRowPos = currentRowPos + 2;
                        if(index2 === 0 && index1 === 0){
                            ws.getRow(currentRowPos).values = arrayOfHeaders[1];

                            ws.columns = arrayOfHeaderStyle[1];
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

        //
        const last = ws.addRow(totalArray);
        last.font = { bold: true };

        const buf = await wb.xlsx.writeBuffer();
        let name;
        if (userData.hasOwnProperty('fullName')) {
            name = userData.fullName;
        } else {
            name = userData.name;
        }
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        saveAs(new Blob([buf]), metaData + '-' + `${String(date).length === 1 ? '0' : ''}${date}` + '-' + `${String(month).length === 1 ? '0' : ''}${month}` + '-' + new Date().getFullYear() + '.xlsx');

    }

    static async exportExcel5(arrayOfHeaders, arrayOfHeaderStyle, arrayOfExcelData, metaData, choice, excluded, totalArray?, arrOfParentTableNames?) {
        const wb = new Excel.Workbook();
        const ws = wb.addWorksheet();
        const meta1 = ws.getCell('A1');
        const meta2 = ws.getCell('A2');
        const meta3 = ws.getCell('A3');
        meta1.font = { bold: true };
        meta2.font = { bold: true };
        meta3.font = { bold: true };

        const daysArr = ['Sunday','Monday', 'Tuesday','Wednesday', 'Friday','Saturday'];
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

        if (choice === 'applicant-wise-aum-mis') {
            arrayOfExcelData.forEach((schemeElement, index1) => {
                if (index1 == 0) {
                    ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    ws.columns = arrayOfHeaderStyle[0];
                    headCell = ws.getRow(currentRowPos);
                    headCell.font = { bold: true };
                } 
                else {
                    currentRowPos = currentRowPos + 2;
                }
                    // ws.getRow(currentRowPos).values = arrayOfHeaders[0];
                    // ws.columns = arrayOfHeaderStyle[0];
                    // headCell = ws.getRow(currentRowPos);
                    // headCell.font = { bold: true };
                // }
                ws.addRow([
                    schemeElement.index,
                    schemeElement.name,
                    schemeElement.folioNumber,
                    schemeElement.totalAum,
                    schemeElement.weightInPerc
                ]);
                if (schemeElement.schemeFolioList.length !== 0) {

                    schemeElement.schemeFolioList.forEach((element, index3) => {
                        currentRowPos = currentRowPos + 2;
                        if(index3 === 0 && index1 === 0){
                            ws.getRow(currentRowPos).values = arrayOfHeaders[1];
                            ws.columns = arrayOfHeaderStyle[1];
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
            })
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
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        saveAs(new Blob([buf]), metaData + '-' + `${String(date).length === 1 ? '0' : ''}${date}` + '-' + `${String(month).length === 1 ? '0' : ''}${month}` + '-' + new Date().getFullYear() + '.xlsx');

    }
}