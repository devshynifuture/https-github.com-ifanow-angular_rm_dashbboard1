import { Component, OnInit } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {
  teamMemberId=2929;
  advisorId: any;
  category: any;
  showLoader: boolean;
  selectedCategory: any;

  constructor(public aum:AumComponent,private backoffice:BackOfficeService,private dataService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
    this.getApplicantName();
  }
  aumReport()
  {
   this.aum.aumComponent=true;
  }
  getAmcWiseData(){
    this.backoffice.amcWiseGet(this.advisorId).subscribe(
      data => this.getReponseAmcWiseGet(data),
      err=>this.getFilerrorResponse(err)
    )
  }
  getReponseAmcWiseGet(data) {
    this.showLoader = true;
    console.log("scheme Name", data)
    this.category = data.categories;

    this.category.forEach(o => {
      o.showCategory = true;

      o.subCategoryList.forEach(sub => {
        sub.showSubCategory = true;
      })
    });
    this.showLoader = false;
  }
  showSubTableList(index, category) {
    this.selectedCategory = index
    this.category[index].showCategory = (category) ? category = false : category = true;
    console.log(this.category[index])
    console.log(category)
  }
  showSchemeName(index, subcashowSubcat) {
    this.category[this.selectedCategory].subCategoryList[index].showSubCategory = (subcashowSubcat) ? subcashowSubcat = false : subcashowSubcat = true;
  }
  getApplicantName(){
    const obj={
      advisorId:this.advisorId,
      arnRiaDetailId:12345,
      schemeMasterId:1345,
      totalAum:2000
    }
    this.backoffice.amcWiseApplicantGet(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  getFilerrorResponse(err) {
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
