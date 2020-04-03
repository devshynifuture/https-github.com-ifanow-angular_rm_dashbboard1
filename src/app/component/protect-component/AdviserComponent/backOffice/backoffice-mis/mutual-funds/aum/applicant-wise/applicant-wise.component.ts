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
  totalCurrentValue=0;
  totalWeight=0;

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
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailsId:-1,
      parentId:-1
    }
    this.backoffice.getAumApplicantWiseTotalaumApplicantName(obj).subscribe(
      data => this.applicantNameGet(data),
      err=>{
        this.showLoader=false;
      }
    )
  }
  applicantNameGet(data)
  {
    this.applicantName=data;
    this.applicantName.forEach(o => {
      o.show = true;
      this.totalCurrentValue+=o.totalAum;
      this.totalWeight+=o.weightInPercentage;
    });
    this.showLoader=false;
  }
  
  category(applicantData)
  {
    applicantData.show=!applicantData.show
    applicantData.categoryList=[]
    if(applicantData.show==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMembertId:applicantData.id,
        clientTotalAum:applicantData.totalAum
      }
      this.backoffice.getAumApplicantCategory(obj).subscribe(
        data =>{
          if(data){
            data[0].showCategory=true;
            data[0].familyMemberId=applicantData.id
            applicantData.categoryList=data
            console.log(data)
          }
        }
      )
      }
  }
  sortCategoryApplicant(data,show,applicantData)
  {
    console.log("fasdfkasdf",data);
    applicantData.category=data;
    applicantData.show=(show)?show=false:show=true;

  }
  subCategory(catData)
  {
    catData.showCategory=!catData.showCategory
    catData.subCatList=[]
    if(catData.showCategory==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMembertId:catData.familyMemberId,
        categoryId:catData.id,
        categoryTotalAum:catData.totalAum
      }
      this.backoffice.getAumApplicantSubCategory(obj).subscribe(
        data =>{
          if(data){
            data[0].showSubCategory=true;
            data[0].familyMemberId=catData.familyMemberId;
            catData.subCatList=data;
            console.log(data)
          }
        }
      )
      }
    }

  getResponseSubCategoryData(data,category,showCategory)
  {  
    console.log(data);
    category.showCategory=(showCategory)?showCategory=false:showCategory=true;
    category.subCategoryList=data;  
  }
  getScheme(subCatData)
  {
    subCatData.showSubCategory=!subCatData.showSubCategory
    subCatData.schemeList=[]
    if(subCatData.showSubCategory==false){
      const obj={
        advisorId:this.advisorId,
        arnRiaDetailsId:-1,
        parentId:-1,
        familyMembertId:subCatData.familyMemberId,
        subCategoryId:subCatData.id,
        subCategoryTotalAum:subCatData.totalAum
      }
      this.backoffice.getAumApplicantScheme(obj).subscribe(
        data =>{
          if(data){
            data[0].showFolio=true
            subCatData.schemeList=data
            console.log(data)
          }
        }
      )
      }
  }
  getSchemeFolio(schemeData){
    schemeData.showFolio=!schemeData.showFolio

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
