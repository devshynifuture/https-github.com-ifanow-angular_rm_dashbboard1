import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-aum',
  templateUrl: './aum.component.html',
  styleUrls: ['./aum.component.scss']
})
export class AumComponent implements OnInit {
  viewMode: string;
  showMainWrapperFlag: boolean = true;
  categoryshow: boolean = false;
  showSubTable: boolean = false;
  showAddBtn: boolean = true;
  showRemoveBtn: boolean;
  clientTotalAum;
  amcTotalAum;
  category;
  subcategory;
  MiscData;
  MiscData1;
  aumComponent = true;
  componentWise;
  advisorId: any;


  constructor(private backoffice: BackOfficeService, private dataService: EventService) { }

  teamMemberId = 2929;
  ngOnInit() {
    this.viewMode = 'Select option';
    this.advisorId = AuthService.getAdvisorId();
    this.getTotalAum();
    // this.getSubCatScheme();
    this.getSubCatAum()
    this.getMisData();
  }


  showMainWrapper() {
    this.categoryshow = false;
    this.showMainWrapperFlag = true;
  }

  categorywise() {
    this.categoryshow = true;
    this.showMainWrapperFlag = false;
  }

  showSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = true;
    this.showAddBtn = false;
    this.showRemoveBtn = true;
  }


  hideSubTableList() {
    this.showMainWrapperFlag = false;
    this.showSubTable = false;
    this.showAddBtn = true;
    this.showRemoveBtn = false;
  }

  getTotalAum() {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.getClientTotalAUM(obj).subscribe(
      data => this.getFileResponseDataAum(data),
      err => this.getFilerrorResponse(err)
    )
  }
  getMisData() {
    this.backoffice.getMisData(this.advisorId).subscribe(
      data => this.getFileResponseDataForMis(data),
      err => this.getFilerrorResponse(err)
    )
  }
  getSubCatAum() {
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:-1,
      parentId:-1
    }
    this.backoffice.getSubCatAum(obj).subscribe(
      data => this.getFileResponseDataForSub(data),
      err => this.getFilerrorResponse(err)
    )
  }

  getSubCatSchemeRes(data) {
    console.log(data);
  }
  getFileResponseDataAum(data) {

    console.log("top clients", data)

    this.clientTotalAum = data.clientTotalAum;
    this.amcTotalAum = data.amcTotalAum;
  }
  getFileResponseDataForMis(data) {
    console.log("mis", data)
    this.MiscData1 = data;
  }
  getFileResponseDataForSub(data) {
    console.log("inside", data)
    this.category = data.category;
    this.subcategory = data.subcategory;
  }
  getFileResponseDataForSubScheme(data) {
    console.log(":", data)
    this.MiscData = data.categories;
  }
  getFileResponseDataForSubSchemeName(data) {
    console.log("scheme Name", data)
  }
  getFilerrorResponse(err) {
    this.dataService.openSnackBar('Something went wrong', 'Dismiss')
  }
  categoryWise(value) {
    this.componentWise = value;
    this.aumComponent = false;
  }

}

