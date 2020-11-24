import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../../actiity.service';
import { AdviceUtilsService } from '../../advice-utils.service';

@Component({
  selector: 'app-all-advice-general-insurance',
  templateUrl: './all-advice-general-insurance.component.html',
  styleUrls: ['./all-advice-general-insurance.component.scss']
})
export class AllAdviceGeneralInsuranceComponent implements OnInit {
  advisorId: any;
  clientId: any;
  isLoading: boolean;
  selectedAssetId: any = [];
  healthInsuranceDataSource = new MatTableDataSource([{}, {}, {}]);
  personalAccidentDataSource = new MatTableDataSource([{}, {}, {}]);
  healthCount: any;
  personalCount: any;
  criticalInsDataSource = new MatTableDataSource([{}, {}, {}]);
  criticalCount: any;
  motorDataSource = new MatTableDataSource([{}, {}, {}]);
  motorCount: any;
  travelDataSource = new MatTableDataSource([{}, {}, {}]);
  travelCount: any;
  homeInsDataSource = new MatTableDataSource([{}, {}, {}]);
  homeCount: any;
  FireDataSource = new MatTableDataSource([{}, {}, {}]);
  fireCount: any;
  allAdvice = true;
  constructor(private activityService: ActiityService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }

  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      // assetCategory: 10,
      // adviceStatusId:1
      categoryMasterId: 4,
      categoryTypeId: 0,
      status: 1
    }
    this.isLoading = true;
    this.healthInsuranceDataSource = new MatTableDataSource([{}, {}, {}]);
    this.personalAccidentDataSource = new MatTableDataSource([{}, {}, {}]);
    this.criticalInsDataSource = new MatTableDataSource([{}, {}, {}]);
    this.motorDataSource = new MatTableDataSource([{}, {}, {}]);
    this.travelDataSource = new MatTableDataSource([{}, {}, {}]);
    this.homeInsDataSource = new MatTableDataSource([{}, {}, {}]);
    this.FireDataSource = new MatTableDataSource([{}, {}, {}]);
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
        this.isLoading = false;
        this.healthInsuranceDataSource.data = [];
        this.personalAccidentDataSource.data = [];
        this.criticalInsDataSource.data = [];
        this.motorDataSource.data = [];
        this.travelDataSource.data = [];
        this.homeInsDataSource.data = [];
        this.FireDataSource.data = [];
      }
    );
  }
  filterForAsset(data) {//filter data to for showing in the table
    let filterdData = [];
    data.forEach(element => {
      var asset = element.AssetDetails;
      if (element.AdviceList.length > 0) {
        element.AdviceList.forEach(obj => {
          obj.assetDetails = asset;
          filterdData.push(obj);
        });
      } else {
        const obj = {
          assetDetails: asset
        }
        filterdData.push(obj);
      }

    });
    return filterdData;
  }
  getAllSchemeResponse(data) {
    this.isLoading = false;
    let healthData = this.filterForAsset(data.HEALTH)
    this.healthInsuranceDataSource.data = healthData;
    let personalData = this.filterForAsset(data.PERSONAL_ACCIDENT)
    this.personalAccidentDataSource.data = personalData;
    let critical = this.filterForAsset(data.CRITICAL_ILLNESS)
    this.criticalInsDataSource.data = critical;
    let motorData = this.filterForAsset(data.MOTOR)
    this.motorDataSource.data = motorData;
    let travelData = this.filterForAsset(data.TRAVEL)
    this.travelDataSource.data = travelData;
    let homeData = this.filterForAsset(data.HOME)
    this.homeInsDataSource.data = homeData;
    let fireData = this.filterForAsset(data.FIRE)
    this.FireDataSource.data = fireData;
    this.healthInsuranceDataSource['tableFlag'] = (data.PPF.length == 0) ? false : true;
    this.personalAccidentDataSource['tableFlag'] = (data.NSC.length == 0) ? false : true;
    this.criticalInsDataSource['tableFlag'] = (data.SSY.length == 0) ? false : true;
    this.motorDataSource['tableFlag'] = (data.KVP.length == 0) ? false : true;
    this.travelDataSource['tableFlag'] = (data.SCSS.length == 0) ? false : true;
    this.homeInsDataSource['tableFlag'] = (data.PO_Savings.length == 0) ? false : true;
    this.FireDataSource['tableFlag'] = (data.PO_RD.length == 0) ? false : true;
    console.log("::::::::::::::::", data)
  }
  checkAll(flag, tableDataList, tableFlag) {
    console.log(flag, tableDataList)
    const { selectedIdList, count } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    this.selectedAssetId = selectedIdList;
    this.getFlagCount(tableFlag, count)
    // console.log(this.selectedAssetId);
  }
  getFlagCount(flag, count) {
    switch (true) {
      case (flag == 'health'):
        this.healthCount = count;
        break;
      case (flag == 'personal'):
        this.personalCount = count;
        break;
      case (flag == 'critical'):
        this.criticalCount = count;
        break;
      case (flag == 'motor'):
        this.motorCount = count;
        break;
      case (flag == 'travel'):
        this.travelCount = count;
        break;
      case (flag == 'home'):
        this.homeCount = count;
        break;
      case (flag == 'fire'):
        this.fireCount = count;
        break;
    }
  }
  checkSingle(flag, selectedData, tableData, tableFlag) {
    if (flag.checked) {
      selectedData.selected = true;
      this.selectedAssetId.push(selectedData.assetDetails.id)
    }
    else {
      selectedData.selected = false
      this.selectedAssetId.splice(this.selectedAssetId.indexOf(selectedData.assetDetails.id), 1);
    }
    let countValue = AdviceUtilsService.selectSingleCheckbox(Object.assign([], tableData));
    this.getFlagCount(tableFlag, countValue)
    console.log(this.selectedAssetId)
  }


}
