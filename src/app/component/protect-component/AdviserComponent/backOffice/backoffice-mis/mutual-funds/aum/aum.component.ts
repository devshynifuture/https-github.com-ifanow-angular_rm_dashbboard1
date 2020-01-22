import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { BackOfficeService } from '../../../back-office.service';

@Component({
  selector: 'app-aum',
  templateUrl: './aum.component.html',
  styleUrls: ['./aum.component.scss']
})
export class AumComponent implements OnInit {
  showMainWrapperFlag: boolean = true;
  categoryshow: boolean = false;
  showSubTable:boolean= false;
  showAddBtn: boolean = true;
  showRemoveBtn: boolean;
  clientTotalAum;
  amcTotalAum;
  category;
  subcategory;
  MiscData;
  MiscData1;
  aumComponent=true;
  componentWise;
  

  constructor(private backoffice: BackOfficeService,private dataService: EventService) { }
  
  teamMemberId=2929;
  ngOnInit() {
    this.getTotalAum();
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

  showSubTableList(){
  this.showMainWrapperFlag = false;
   this.showSubTable =true;
   this.showAddBtn = false;
   this.showRemoveBtn = true;
  }


  hideSubTableList(){
    this.showMainWrapperFlag = false;
    this.showSubTable = false;
    this.showAddBtn = true;
    this.showRemoveBtn = false;
  }
  
  getTotalAum(){

    this.backoffice.getClientTotalAUM(this.teamMemberId).subscribe(
      
     data => this.getFileResponseDataAum(data),
     err => this.getFilerrorResponse(err)
    )
   }
   getMisData(){
     this.backoffice.getMisData(this.teamMemberId).subscribe(
       data => this.getFileResponseDataForMis(data),
       err => this.getFilerrorResponse(err)
     )
   }
   getSubCatAum(){
     this.backoffice.getSubCatAum(this.teamMemberId).subscribe(
      data => this.getFileResponseDataForSub(data),
      err => this.getFilerrorResponse(err)
    )
   }
   getTotalAumByScheme()
   {
    this.backoffice.getTotalByAumScheme(this.teamMemberId).subscribe(
      data => this.getFileResponseAumByScheme(data),
      err=> this.getFilerrorResponse(err)
    )
   } 

   getFileResponseDataAum(data) {
   
     console.log("top clients",data)

     this.clientTotalAum=data.clientTotalAum;
     this.amcTotalAum=data.amcTotalAum;
   }
    getFileResponseDataForMis(data) {
      console.log("mis",data)
    this.MiscData1=data;
    }
    getFileResponseDataForSub(data) {
      console.log("inside",data)
      this.category=data.category;
      this.subcategory=data.subcategory;
    }
    getFileResponseDataForSubScheme(data) {
      console.log(":",data)
      this.MiscData=data.categories;
    }
    getFileResponseDataForSubSchemeName(data)
    {
      console.log("scheme Name",data)
    }
    getFileResponseAumByScheme(data)
    {
      console.log("Aum By Name",data)
    }
    getFilerrorResponse(err) {
     this.dataService.openSnackBar(err, 'Dismiss')
    }
    categoryWise(value)
    { 
      this.componentWise=value;
      this.aumComponent=false; 
    }
    
}

