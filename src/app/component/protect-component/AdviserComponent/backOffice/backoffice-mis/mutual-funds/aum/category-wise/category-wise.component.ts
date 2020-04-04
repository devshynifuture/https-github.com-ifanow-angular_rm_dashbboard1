import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// import * as $ from 'jquery';
import { BackOfficeService } from '../../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AumComponent } from '../aum.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';
@Component({
selector: 'app-category-wise',
templateUrl: './category-wise.component.html',
styleUrls: ['./category-wise.component.scss']
})
export class CategoryWiseComponent implements OnInit {
category;
subcategory;
showLoader;
teamMemberId = 2929;
advisorId = AuthService.getAdvisorId();
subCategoryList: any[] = [];
totalAumForSubSchemeName: any;
@Output() changedValue = new EventEmitter();

constructor(
private backoffice: BackOfficeService, private dataService: EventService, public aum: AumComponent
) { }
selectedCategory;
ngOnInit() {
this.getSubCatSchemeName();
// this.getTotalAum()
// this.clientFolioWise();
// this.getSubCatAum();
}
getSubCatSchemeName() {
this.showLoader = true;
const obj = {
advisorId: this.advisorId,
arnRiaDetailsId: -1,
parentId: -1
}
this.backoffice.getTotalByAumScheme(obj).subscribe(
data => this.getFileResponseDataForSubSchemeName(data),
err => this.getFilerrorResponse(err)
)
}
clientFolioWise() {
const obj = {
amcName: 'Aditya Birla',
teamMemberId: this.teamMemberId
}
this.backoffice.getClientFolioWiseInCategory(obj).subscribe(
data => {
console.log(data);
},
err => this.getFilerrorResponse(err)
)
}
// getSubCatAum(){
// this.backoffice.getSubCatAum(this.teamMemberId).subscribe(
// data => this.getFileResponseDataForSub(data),
// err => this.getFilerrorResponse(err)
// )
// }
// getFileResponseDataForSub(data) {
// this.category=data.category;
// this.subcategory=data.subcategory;
// }
showSubTableList(index, category) {
this.selectedCategory = index
this.category[index].showCategory = (category) ? category = false : category = true;
console.log(this.category[index])
console.log(category)
}
getFileResponseDataForSubSchemeName(data) {
console.log("scheme Name:::", data);
if (data) {
this.totalAumForSubSchemeName = data.totalAum;
}
this.category = data.categories;
this.exportToExcelReport('category');
this.category.forEach(o => {
o.showCategory = true;
this.subCategoryList.push(o.subCategoryList);
o.subCategoryList.forEach(sub => {
sub.showSubCategory = true;
})
});
this.showLoader = false;
}
showSchemeName(index, subcashowSubcat) {
this.category[this.selectedCategory].subCategoryList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
}
aumReport() {
    this.changedValue.emit(true);

// this.aum.aumComponent = true;
}
getFilerrorResponse(err) {
this.dataService.openSnackBar(err, 'Dismiss')
}
subCategoryWiseExcelSheet() {
let headerData = [
{ width: 20, key: 'Sr.No.' },
{ width: 50, key: 'Sub Category Name' },
{ width: 30, key: 'Current Value' },
{ width: 30, key: '% Weight' }
];
let header = [
'Sr.No.',
'Sub Category Name',
'Current Value',
'% Weight',
];
let dataValue;
let excelData = [];
let footer = [];
let footerValue = [];
this.category.forEach((element, index) => {
if (element.subCategoryList.length !== 0) {
dataValue = [
index + 1,
element.subCategoryList[index].name,
element.totalAum,
element.weightInPercentage
];
excelData.push(Object.assign(dataValue));
}
});
footer = ['', 'Total', this.totalAumForSubSchemeName, ''];
footerValue.push(Object.assign(footer));
ExcelMisService.exportExcel(headerData, header, excelData, footerValue, 'category-wise-excel');
// excelData: any, footer: any[], metaData: any
}
categoryWiseExcelSheet() {
let arrayOfHeader = [
[
'Sr. No.',
'Category Name',
'Current Value',
'% Weight'
],
[
'Sr. No.',
'Sub Category Name',
'Current Name',
'% Weight'
],
[
'Sr. No.',
'Scheme Name',
'Current Value',
'% Weight'
]
];
let arrayOfHeaderStyles = [
[
{ width: 10, key: 'Sr. No.' },
{ width: 50, key: 'Category Name' },
{ width: 30, key: 'Current Value' },
{ width: 10, key: '% Weight' }
],
[
{ width: 10, key: 'Sr. No.' },
{ width: 50, key: 'Sub Category Name' },
{ width: 30, key: 'Current Value' },
{ width: 10, key: '% Weight' }
],
[
{ width: 10, key: 'Sr. No.' },
{ width: 50, key: 'Scheme Name' },
{ width: 30, key: 'Current Name' },
{ width: 10, key: '% Weight' }
]
];
let dataValue = [];
let arrayOfExcelData = [];
arrayOfExcelData[0] = [];
arrayOfExcelData[1] = [];
arrayOfExcelData[2] = [];
this.category.forEach((element, index1) => {
dataValue = [
index1 + 1,
element.name,
element.totalAum,
element.weightInPercentage
];
arrayOfExcelData[0].push(Object.assign(dataValue));
if (element.hasOwnProperty('subCategoryList') && element.subCategoryList.length !== 0) {
console.log("this is something i need 2");
element.subCategoryList.forEach((element, index2) => {
dataValue = [
index2 + 1,
element.name,
element.totalAum,
element.weightInPercentage
];
arrayOfExcelData[1].push(Object.assign(dataValue));
if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
element.schemes.forEach((element, index3) => {
dataValue = [
index3 + 1,
element.schemeName,
element.totalAum,
element.weightInPercentage
];
});
arrayOfExcelData[2].push(Object.assign(dataValue));
}
});
}
});
ExcelMisService.exportExcel2(arrayOfHeader, arrayOfHeaderStyles, arrayOfExcelData, 'selectedScheme', 'Category Wise MIS Report');
}
exportToExcelReport(choice) {
switch (choice) {
case 'category':
this.categoryWiseExcelSheet();
break;
case 'sub-category':
this.subCategoryWiseExcelSheet();
}
}
}