import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { UtilService } from 'src/app/services/util.service';
import { FormControl } from '@angular/forms';
import { BackOfficeService } from '../../back-office.service';
import { element } from 'protractor';

@Component({
  selector: 'app-backoffice-new',
  templateUrl: './backoffice-new.component.html',
  styleUrls: ['./backoffice-new.component.scss']
})
export class BackofficeNewComponent implements OnInit {

  assetTypeList = new MatTableDataSource([{}, {}, {}])
  displayedColumns: string[] = ['position', 'schemeName', 'number', 'investName', 'dueDate'];
  isLoading: boolean;
  advisorId: any;
  selectedNextDate = new FormControl("7");
  EndDate: any;
  StartDate: any;
  filterOption: any;
  filterOptionControl = new FormControl();
  selectedSubType = new FormControl();
  reminderType: any;
  fixedDepositFilter: any;
  assetTypeFilterList: unknown[];
  subTypeFilter: any;
  constructor(private eventService: EventService,
    private customerService: CustomerService,
    private backOffice: BackOfficeService) { }


  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.selectedNextDate.setValue('7');
    this.StartDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getEndDate(this.selectedNextDate.value);
    this.getGlobalFilter();

  }

  getGlobalFilter() {
    const obj = {}
    this.backOffice.getGlobalReminderFilter(obj).subscribe(
      data => {
        this.getGlobalFilterRes(data);
      }
    )
  }

  getGlobalFilterRes(data) {
    if (data) {
      console.log(data)
      this.filterOption = data;
      this.assetTypeFilterList = [...new Set(data.map(a => a.name))];
      this.filterOptionControl.setValue(data[0].name)
      this.selectedSubType.setValue(data[0].reminderType);
      this.subTypeFilter = this.filterOption.filter(element => element.name == data[0].name);
      this.callAssetTypeApi(data[0].name);
    }
  }

  getFixedDepositList() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getFixedDeposit(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getAssetListRes(data) {
    this.isLoading = false;
    if (data) {
      if (data.assetList) {
        this.assetTypeList.data = data.assetList;
      } else {
        this.assetTypeList.data = data;
      }
    } else {
      this.assetTypeList.data = [];
      this.isLoading = false;
    }
  }

  getRecurringDepositList() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getRecurringDeposit(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getBondsList() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getBonds(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getListGratuity() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getGrauity(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getNscSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemeNSCData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoRdSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemePORDData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoTdSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getPoMisSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemePOMISData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getPpfSchemeData() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    }
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemePPFData(obj).subscribe(
      data => this.getAssetListRes(data),
      (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      });
  }

  getKvpSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getSsySchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getScssSchemedata() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getOthersAssets() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getOthersAssets(obj).subscribe(
      data => {
        console.log(data, "others");

        this.getAssetListRes(data)
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      });
    // this.getOthersAssetsRes(ELEMENT_DATA3);
  }

  getGoldBondsData() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getGoldBondsData(obj).subscribe(
      data => {
        console.log(data, "others");

        this.getAssetListRes(data)
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      });
  }

  getListNPS() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getNPS(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getListEPS() {
    this.isLoading = true;
    const obj = {
      clientId: 0,
      advisorId: this.advisorId,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    };
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getEPS(obj).subscribe(
      data => this.getAssetListRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    );
  }

  getLifeInsuranceData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: 0,
      insuranceTypeId: 1,
      id: 0,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    }
    this.isLoading = true;
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getInsuranceData(obj).subscribe(
      data => {
        if (data) {
          this.isLoading = false;
          if (data.insuranceList.length > 0) {
            data.insuranceList = data.insuranceList.filter(d => d.realOrFictitious === 1);
          }
          this.assetTypeList.data = data.insuranceList;
        }
        else {
          this.assetTypeList.data = [];
          this.isLoading = false;
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    )
  }

  getGeneralInsuranceData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: 0,
      insuranceTypeId: 1,
      id: 0,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    }
    this.isLoading = true;
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getGeneralInsuranceData(obj).subscribe(
      data => {
        if (data) {
          this.isLoading = false;
          this.assetTypeList.data = data.generalInsuranceList;
        } else {
          this.assetTypeList.data = [];
          this.isLoading = false;
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    )
  }

  getOtherInsuranceData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: 0,
      insuranceTypeId: 1,
      id: 0,
      reminderType: this.selectedSubType.value ? this.selectedSubType.value : 1,
      endDate: this.EndDate,
      startDate: this.StartDate
    }
    this.isLoading = true;
    this.assetTypeList.data = [{}, {}, {}];
    this.customerService.getOtherInsurance(obj).subscribe(
      data => {
        if (data) {
          this.isLoading = false;
          if (data.otherInsuranceList.length > 0) {
            data.otherInsuranceList = data.otherInsuranceList.filter(d => (d.realOrFictitious === 1 || !d.realOrFictitious));
          }
          this.assetTypeList.data = data.otherInsuranceList;
        } else {
          this.assetTypeList.data = [];
          this.isLoading = false;
        }
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.assetTypeList.data = [];
        this.isLoading = false;
      }
    )

  }

  sortDateFilter(event) {
    this.getEndDate(event.value);
    this.callAssetTypeApi(this.filterOptionControl.value);
  }

  changeSubAssetType(event) {
    console.log(event.value);
    this.selectedSubType.setValue(event.value);
    this.callAssetTypeApi(this.filterOptionControl.value);
  }

  changeAssetType(event) {
    this.subTypeFilter = this.filterOption.filter(element => element.name == event.value);
    this.selectedSubType.setValue(this.subTypeFilter[0].reminderType);
    this.callAssetTypeApi(event.value)
  }

  callAssetTypeApi(assetName) {
    switch (true) {
      case (assetName == 'Fixed Deposit'):
        this.getFixedDepositList();
        break;
      case (assetName == 'Recurring Deposit'):
        this.getRecurringDepositList();
        break;
      case (assetName == 'Bonds'):
        this.getBondsList();
        break;
      case (assetName == "Gratuity"):
        this.getListGratuity();
        break;
      case (assetName == "NSC"):
        this.getNscSchemedata();
        break;
      case (assetName == "PO RD"):
        this.getPoRdSchemedata();
        break;
      case (assetName == "PO TD"):
        this.getPoTdSchemedata();
        break;
      case (assetName == "PO MIS"):
        this.getPoMisSchemedata();
        break;
      case (assetName == "PPF"):
        this.getPpfSchemeData();
        break;
      case (assetName == "KVP"):
        this.getKvpSchemedata();
        break;
      case (assetName == "SSY"):
        this.getSsySchemedata();
        break;
      case (assetName == "SCSS"):
        this.getScssSchemedata();
        break;
      case (assetName == "Other Assets"):
        this.getOthersAssets();
        break;
      case (assetName == "Sovereign Gold Bond"):
        this.getGoldBondsData();
        break;
      case (assetName == "EPF"):
        this.getListEPS();
        break;
      case (assetName == "NPS"):
        this.getListNPS();
        break;
      case (assetName == "Life Insurance"):
        this.getLifeInsuranceData();
        break;
      case (assetName == "General Insurance"):
        this.getGeneralInsuranceData();
        break;
      case (assetName == "Other general Insurance"):
        this.getOtherInsuranceData();
        break;
      default:
        console.log("Please add asset in global API")
    }
  }


  getEndDate(value) {
    this.EndDate = UtilService.getStartOfTheDay(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * Number(value))).getTime();
  }

}
