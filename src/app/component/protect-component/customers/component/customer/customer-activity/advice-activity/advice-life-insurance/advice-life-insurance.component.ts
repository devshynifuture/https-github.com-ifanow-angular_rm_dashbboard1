import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-life-insurance',
  templateUrl: './advice-life-insurance.component.html',
  styleUrls: ['./advice-life-insurance.component.scss']
})
export class AdviceLifeInsuranceComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'mvalue', 'advice', 'astatus', 'adate', 'icon'];
  clientId: any;
  advisorId: any;
  lifeInsuranceList: {}[];
  isLoading: boolean;
  allAdvice = true;
  stockCount: number;
  selectedAssetId: any;

  constructor(private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAssetAll();
  }

  getAssetAll() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 3,
      adviceStatusId: 0
    }
    this.lifeInsuranceList = [{}, {}, {}]
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllAssetResponse(data), (error) => {
        this.isLoading = false;
        this.lifeInsuranceList = [];
        this.lifeInsuranceList['tableFlag'] = (this.lifeInsuranceList.length == 0) ? false : true;
        // this.datasource.data = [];
        // this.isLoading = false;
      }
    );
  }

  getAllAssetResponse(data) {
    this.isLoading = false;
    let filterdData = [];
    let stockData = data.STOCKS;
    stockData.forEach(element => {
      var asset = element.AssetDetails;
      element.AdviceList.forEach(obj => {
        obj.assetDetails = asset;
        filterdData.push(obj);
      });
    });
    this.lifeInsuranceList = filterdData;
    this.lifeInsuranceList['tableFlag'] = (data.STOCKS.length == 0) ? false : true;
    console.log(data);
  }

  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.stockCount = count;
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
}
