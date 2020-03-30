import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-applicant-wise',
  templateUrl: './applicant-wise.component.html',
  styleUrls: ['./applicant-wise.component.scss']
})
export class ApplicantWiseComponent implements OnInit {
  advisorId: any;
  clientId: any;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService) { }
  applicantName;
  showLoader=true;
  teamMemberId=2929;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.aumApplicantWiseTotalaumApplicantNameGet();
  }
  aumApplicantWiseTotalaumApplicantNameGet()
  {
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(this.advisorId).subscribe(
      data => this.applicantNameGet(data)
    )
  }
  applicantNameGet(data)
  {
    this.applicantName=data;
    this.showLoader=false;
  }
  
  category(applicantData)
  {
    let obj=
    {
      'clientId':applicantData.id,
      'clientTotalAum':applicantData.totalAum,
      'advisorId':this.advisorId
    }
    if(applicantData.show==false)
    {
    this.backoffice.getAumApplicantCategory(obj).subscribe(
      data => this.sortCategoryApplicant(data,applicantData.show,applicantData)
    )
    }
    else
    {
      applicantData.show=false;
    }
  }
  sortCategoryApplicant(data,show,applicantData)
  {
    console.log("fasdfkasdf",data);
    applicantData.category=data;
    applicantData.show=(show)?show=false:show=true;

  }
  subCategory(category,showCategory,id)
  {
    let obj=
    {
      'categoryId':category.id,
      'categoryTotalAum':category.totalAum,
      'clientId':id,
      'advisorId':this.advisorId
    }
    if(showCategory==false)
    {
      this.backoffice.getAumApplicantSubCategory(obj).subscribe(
        data =>this.getResponseSubCategoryData(data,category,showCategory)
      )
    }
    else{
      category.showCategory=false;
    }
  }
  getResponseSubCategoryData(data,category,showCategory)
  {  
    console.log(data);
    category.showCategory=(showCategory)?showCategory=false:showCategory=true;
    category.subCategoryList=data;  
  }
  getScheme(subCat,id)
  {
    let obj=
    {
      'clientId':id,
      'subCategoryId':subCat.id,
      'subCategoryTotalAum':subCat.totalAum,
      'advisorId':this.advisorId
    }
    if(subCat.showSubCategory==false)
    {
      this.backoffice.getAumApplicantScheme(obj).subscribe(
        data => this.getResponseSchemeData(data,subCat)
      )
    }
    else{
      subCat.showSubCategory=false;
    }
  }
  getResponseSchemeData(data,subCat)
  {
    subCat.schemes=data;
    subCat.showSubCategory=(subCat.showSubCategory)?subCat.showSubCategory=false:subCat.showSubCategory=true;
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }

}
