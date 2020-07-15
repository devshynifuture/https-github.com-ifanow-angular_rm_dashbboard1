import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from '../../../customer.service';
import { MfServiceService } from '../../../accounts/assets/mutual-fund/mf-service.service';
import { InputsModule } from 'angular-bootstrap-md';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mobile-transactions',
  templateUrl: './mobile-transactions.component.html',
  styleUrls: ['./mobile-transactions.component.scss']
})
export class MobileTransactionsComponent implements OnInit {
  openMenue: boolean=false;
  inputData: any;
  option;
  myControl;
  clientId = AuthService.getClientId()
  advisorId = AuthService.getAdvisorId()
  categoryWiseArray: any;
  categoryArray =[];
  subCatArray = [];
  amcArray = [];
  showSearchResult = false;
  equiity = [];
  debt = [];
  hybrid = [];
  solutionOriented = [];
  others = [];
  detailedScheme = false;
  scheme: any;
  constructor(private datePipe: DatePipe,private eventService:EventService,private custumService:CustomerService,private MfServiceService : MfServiceService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.getMutualFundData();
  }
  getMutualFundData(){
    const obj = {
      // advisorId: 2753,
      advisorId: this.advisorId,
      clientId: this.clientId,
      // clientId: this.clientId
    };
    this.custumService.getMutualFund(obj).subscribe(
      data => {
        this.getMutualFundResponse(data)
      }, (error) => {
        this.eventService.openSnackBar(' No Mutual Fund Found', 'Dismiss');
      }
    );
  }
  getMutualFundResponse(data){
    let filterArr1=[];
    let filterArr2=[];
    let filterArr3=[];
    let filterData = this.MfServiceService.doFiltering(data);
    let mfList = filterData.mutualFundList;
    mfList.forEach(element => {
      const obj={
        categoryName:element.categoryName,
        categoryId:element.categoryId,
        mfId:element.id,
        selected:false
      }
     const obj2={
        subCategoryname:element.subCategoryName,
        amcId:element.amcId,
        mfId:element.id,
        selected:false

      }
     const obj3={
      amcName:element.amcName,
      amcId:element.amcId,
      mfId:element.id,
      selected:false

      }
      filterArr1.push(obj);
      filterArr2.push(obj2);
      filterArr3.push(obj3);
    });
    const sortedData1 = this.MfServiceService.sorting(filterArr1, 'categoryName');
    this.categoryArray = [...new Map(sortedData1.map(item => [item.categoryId, item])).values()];;
    const sortedData2 = this.MfServiceService.sorting(filterArr2, 'subCategoryname');
    this.subCatArray =[...new Map(sortedData2.map(item => [item.amcId, item])).values()];;
    const sortedData3 = this.MfServiceService.sorting(filterArr3, 'amcName');
    this.amcArray =[...new Map(sortedData3.map(item => [item.amcId, item])).values()]; ;
    this.categoryWiseArray  = filterData.mutualFundList
  }
  applyClassOnClick(item){
    item.selected =! item.selected;
  }
  clearAll(){
    this.categoryArray.forEach(item => item.selected = false);
    this.subCatArray.forEach(item => item.selected = false);
    this.amcArray.forEach(item => item.selected = false);

  }
  searchSchemes(){
    this.showSearchResult = true;
    const todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let mfId=[];
    this.categoryArray.forEach(item =>{
      if(item.selected){
        mfId.push(item.mfId)
      }
    });
    this.subCatArray.forEach(item =>{
      if(item.selected){
        mfId.push(item.mfId)
      }
    });
    this.amcArray.forEach(item =>{
      if(item.selected){
        mfId.push(item.mfId)
      }
    });
    mfId =[...new Map(mfId.map(item => [item, item])).values()]; ;
     const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      toDate: todayDate,
      id: mfId
    };
    this.custumService.getMutualFund(obj).subscribe(
      data => {
        if(data){
          this.getCategoryWiseData(data);
        }
      }
    );
  }
  getCategoryWiseData(data){
    let filterData = this.MfServiceService.doFiltering(data);
    let mfList = filterData.mutualFundList;
    mfList.forEach(element => {
      switch (element.categoryName) {
        case 'EQUITY':
        this.equiity.push(element)
        break;
        case 'DEBT':
         this.debt.push(element)
          break;
        case 'HYBRID':
          this.hybrid.push(element)
          break;
          case 'SOLUTION ORIENTED':
          this.solutionOriented.push(element)
          break;
          case 'OTHERS':
          this.others.push(element)
          break;
      }
    });
  }
  changedetailedScheme(item){
    this.detailedScheme = true;
    this.scheme = item;
  }
  openMenu(flag) {
    if(this.showSearchResult == true && this.detailedScheme == true){
      //  this.showSearchResult = true;
       this.detailedScheme = false;
      this.openMenue = false
    }else if(this.showSearchResult == true && this.detailedScheme == false){
       this.showSearchResult = false;
       this.detailedScheme == false
      this.openMenue = false
    }else if(flag == false){
      this.openMenue = true
    }
    // if (flag == false) {
    //   this.openMenue = true
    // } else {
    //   this.openMenue = false
    // }
    // this.showSearchResult = false;
    // this.detailedScheme = false;

  }

}
