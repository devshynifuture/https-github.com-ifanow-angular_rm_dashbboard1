import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { AumComponent } from "../aum.component";
import { BackOfficeService } from "../../../../back-office.service";
import { AuthService } from "src/app/auth-service/authService";
import { ExcelMisService } from "../excel-mis.service";
import { MfServiceService } from "src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service";

@Component({
  selector: "app-client-wise",
  templateUrl: "./client-wise.component.html",
  styleUrls: ["./client-wise.component.scss"],
})
export class ClientWiseComponent implements OnInit {
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  totalWeight = 0;
  isLoading = false;
  arrayOfExcelData: any[] = [];
  arrayOfHeaders: any[][] = [
    ["Sr. No.", "Client Name", "Current Value", "% Weight"],
    ["Sr. No.", "Investor Name", "Current Value", "% Weight"],
    ["Sr. No.", "Scheme Name", "Current Name", "% Weight"],
    [
      "Sr. No.",
      "Scheme Name",
      "Folio Number",
      "Current Value",
      "Balance Unit",
      "% Weight",
    ],
  ];
  arrayOfHeaderStyles: any[][] = [
    [
      { width: 10, key: "Sr. No." },
      { width: 50, key: "Client Name" },
      { width: 30, key: "Current Value" },
      { width: 10, key: "% Weight" },
    ],
    [
      { width: 10, key: "Sr. No." },
      { width: 50, key: "Investor Name" },
      { width: 30, key: "Current Value" },
      { width: 10, key: "% Weight" },
    ],
    [
      { width: 10, key: "Sr. No." },
      { width: 50, key: "Scheme Name" },
      { width: 30, key: "Current Name" },
      { width: 10, key: "% Weight" },
    ],
    [
      { width: 10, key: "Sr. No." },
      { width: 30, key: "Scheme Name" },
      { width: 30, key: "Folio Number" },
      { width: 30, key: "Current Value" },
      { width: 30, key: "Balance Unit" },
      { width: 10, key: "% Weight" },
    ],
  ];
  investorList: any;
  scheme1List: any;
  scheme2List: any;
  @Output() changedValue = new EventEmitter();
  selectedScheme: any;
  isLoadingInvestor: boolean;
  investorListArr: any[];
  isLoadingScheme: boolean;
  scheme1ListArr: any;
  isLoadingFolio: boolean;
  @Input() data;
  parentId: any;
  clientWiseTotal = [];
  investorWiseTotal = [];
  schemeWiseTotal = [];
  scheme2WiseTotal = [];

  arnRiaValue;
  viewMode;
  arnRiaList = [];
  selectedClientName: any;
  selectedInvestorName: any;
  selectedSchemeName: any;

  constructor(
    public aum: AumComponent,
    private backoffice: BackOfficeService,
    private mfService: MfServiceService
  ) {}

  showLoader = true;
  clientList;
  selectedClient;
  subList;
  selectedInvestor;
  // teamMemberId = 2929;
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  propertyName4: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  reverse4 = true;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getAdminAdvisorId();
    console.log("this is what i m getting :: ", this.data);
    if (
      this.data.hasOwnProperty("arnRiaValue") &&
      this.data.hasOwnProperty("viewMode")
    ) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = "All";
      this.arnRiaValue = -1;
    }
    this.getArnRiaList();
    this.getClientTotalAum();
  }

  changeValueOfArnRia(item) {
    if (item.name !== "All") {
      this.arnRiaValue = item.id;
      this.viewMode = item.number;
    } else {
      this.arnRiaValue = -1;
    }
    this.getClientTotalAum();
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId).subscribe((data) => {
      if (data) {
        // this.advisorId = 0;
        this.arnRiaList = data;
        const obj = {
          number: "All",
          id: -1,
        };
        this.arnRiaList.unshift(obj);
      } else {
        // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
      }
    });
  }

  sortBy(applicant, propertyName) {
    this.propertyName = propertyName;
    this.reverse =
      propertyName !== null && this.propertyName === propertyName
        ? !this.reverse
        : false;
    if (this.reverse === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? 1
          : a[propertyName] === b[propertyName]
          ? 0
          : -1
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? -1
          : a[propertyName] === b[propertyName]
          ? 0
          : 1
      );
    }
  }

  sortByInvestor(applicant, propertyName) {
    this.propertyName2 = propertyName;
    this.reverse2 =
      propertyName !== null && this.propertyName2 === propertyName
        ? !this.reverse2
        : false;
    if (this.reverse2 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? 1
          : a[propertyName] === b[propertyName]
          ? 0
          : -1
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? -1
          : a[propertyName] === b[propertyName]
          ? 0
          : 1
      );
    }
  }

  sortByScheme(applicant, propertyName) {
    this.propertyName3 = propertyName;
    this.reverse3 =
      propertyName !== null && this.propertyName3 === propertyName
        ? !this.reverse3
        : false;
    if (this.reverse3 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? 1
          : a[propertyName] === b[propertyName]
          ? 0
          : -1
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? -1
          : a[propertyName] === b[propertyName]
          ? 0
          : 1
      );
    }
  }

  sortByFolio(applicant, propertyName) {
    this.propertyName4 = propertyName;
    this.reverse4 =
      propertyName !== null && this.propertyName4 === propertyName
        ? !this.reverse4
        : false;
    if (this.reverse4 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? 1
          : a[propertyName] === b[propertyName]
          ? 0
          : -1
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName]
          ? -1
          : a[propertyName] === b[propertyName]
          ? 0
          : 1
      );
    }
  }

  getClientSchemeName() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      arnRiaDetailsId: this.arnRiaValue,
    };
    this.backoffice.getAumClientScheme(obj).subscribe((data) => {});
  }

  getClientTotalAum() {
    this.arrayOfExcelData = [];
    this.totalCurrentValue = 0;
    this.totalWeight = 0;
    this.isLoading = true;
    this.clientList = [{}, {}, {}];
    const obj = {
      advisorId: this.parentId == this.advisorId ? 0 : this.advisorId,
      arnRiaDetailsId: this.data ? this.data.arnRiaDetailId : -1,
      parentId: this.data ? this.data.parentId : -1,
    };
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      (data) => this.clientTotalAum(data),
      (err) => {
        this.isLoading = false;
        this.clientList = [];
      }
    );
  }

  getInvestorName(clientData, index) {
    this.selectedClient = index;
    this.selectedClientName = clientData.name;
    clientData.show = !clientData.show;
    console.log("this is client Data::::", clientData);
    if (clientData.show == false) {
      clientData.investorList = [];
      this.investorList = [];
      clientData.investorList = [{}, {}, {}];
      this.isLoadingInvestor = true;
      const obj = {
        advisorId: this.parentId == this.advisorId ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: this.data ? this.data.parentId : -1,
        clientId: clientData.id,
        totalAum: clientData.totalAum,
      };
      this.backoffice.getAumFamilyMember(obj).subscribe(
        (data) => {
          this.isLoadingInvestor = false;
          if (data) {
            data.forEach((element) => {
              element.showInvestor = true;
            });
            clientData.investorList = data;
            this.investorList = data;
            this.appendingOfValuesInExcel(data, index, "investor");
          } else {
            this.investorList = [];
            clientData.investorList = [];
            this.isLoadingInvestor = false;
          }
        },
        (err) => {
          this.investorList = [];
          clientData.investorList = [];
          this.isLoadingInvestor = false;
        }
      );
    } else {
      this.removeValuesFromExcel("investor", index);
      if (
        clientData.hasOwnProperty("investorList") &&
        clientData.investorList.length !== 0
      ) {
        clientData.investorList.forEach((element) => {
          element.showInvestor = false;
        });
      }
    }
  }

  removeValuesFromExcel(whichList, index) {
    switch (whichList) {
      case "investor":
        this.arrayOfExcelData[index].investorList = [];
        break;
      case "schemes":
        this.arrayOfExcelData[this.selectedClient].investorList[
          index
        ].schemeList = [];
        break;
      case "scheme-folio":
        this.arrayOfExcelData[this.selectedClient].investorList[
          this.selectedInvestor
        ].schemeList[index].schemeFolioList = [];
        break;
    }
  }

  clientWiseExcelSheet(index) {
    ExcelMisService.exportExcel2(
      this.arrayOfHeaders,
      this.arrayOfHeaderStyles,
      this.arrayOfExcelData,
      "MIS Report - Client wise AUM",
      "client-wise-aum-mis",
      {
        clientList: false,
        investorList: false,
        schemeList: false,
        schemeFolioList: false,
      },
      this.clientWiseTotal
    );
  }

  investorWiseExcelSheet(index) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.investorList = [];
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel3(
      arrayOfExcelHeaders,
      arrayOfExcelStyles,
      copyOfExcelData[index].investorList,
      "MIS Report - Client wise AUM",
      "client-wise-aum-mis",
      {
        clientList: true,
        investorList: false,
        schemeList: false,
        schemeFolioList: false,
      },
      this.investorWiseTotal,
      [["Selected Client Name: ", this.selectedClientName]]
    );
  }

  scheme1WiseExcelSheet(clientIndex, investorIndex, schemeIndex) {
    const copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === clientIndex) {
        return;
      } else {
        if (element.investorList.length !== 0) {
          element.investorList.forEach((element) => {
            element.schemeList = [];
          });
        }
      }
    });

    const arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    const arrayOfExcelHeaderStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaders.shift();
    arrayOfExcelHeaderStyles.shift();
    arrayOfExcelHeaderStyles.shift();

    ExcelMisService.exportExcel4(
      arrayOfExcelHeaders,
      arrayOfExcelHeaderStyles,
      copyOfExcelData[clientIndex].investorList[investorIndex].schemeList,
      "MIS Report - Client wise AUM",
      "client-wise-aum-mis",
      {
        clientList: true,
        investorList: true,
        schemeList: false,
        schemeFolioList: false,
      },
      this.schemeWiseTotal,
      [["Selected Client Name: ", this.selectedClientName], ["Selected Investor Name: ", this.selectedInvestorName]]
    );
  }

  scheme2WiseExcelSheet(clientIndex, investorIndex, schemeIndex) {
    const schemeFolioList = this.arrayOfExcelData[clientIndex].investorList[
      investorIndex
    ].schemeList[schemeIndex].schemeFolioList;
    const newarr = [];
    schemeFolioList.forEach((element) => {
      newarr.push({
        field1: element.index,
        field2: element.name,
        field3: element.folioNumber,
        // field4: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        field4: element.totalAum,
        // field5: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
        field5: element.balanceUnit,
        field6: element.weightInPerc,
      });
    });
    ExcelMisService.exportExcel(
      this.arrayOfHeaderStyles[3],
      this.arrayOfHeaders[3],
      newarr,
      [],
      "MIS Report - Client Wise AUM",
      this.scheme2WiseTotal,
      [["Selected Client Name: ", this.selectedClientName], ["Selected Investor Name: ", this.selectedInvestorName], ["Scheme Name: ", this.selectedSchemeName]]
    );
  }

  exportToExcelSheet(choice, clientIndex, investorIndex, schemeIndex) {
    switch (choice) {
      case "client-wise":
        this.clientWiseExcelSheet(clientIndex);
        break;
      case "investor-wise":
        this.investorWiseExcelSheet(clientIndex);
        break;
      case "scheme1-wise":
        this.scheme1WiseExcelSheet(clientIndex, investorIndex, schemeIndex);
        break;
      case "scheme2-wise":
        this.scheme2WiseExcelSheet(clientIndex, investorIndex, schemeIndex);
        break;
    }
  }

  excelInitClientList() {
    let data = {};
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;
    this.clientList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.name,
        // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        investorList: [],
      };
      sumAumTotal = sumAumTotal + element.totalAum;
      sumWeightInPercTotal = sumWeightInPercTotal + element.weightInPercentage;
      this.arrayOfExcelData.push(data);
    });
    let totalAumObj: any = {};
    if (this.data && this.data.totalAumObj) {
      totalAumObj = this.data.totalAumObj;
      this.clientWiseTotal = ["Total", "", totalAumObj.totalAum, 100];
    }
    console.log("totalAumObj : ", totalAumObj);
    console.log("sumAumTotal : ", sumAumTotal);
    console.log("sumWeightInPercTotal : ", sumWeightInPercTotal);
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    let sumAumTotalTemp = 0;
    let sumWeightInPercTemp = 0;
    switch (choice) {
      case "investor":
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].investorList.push({
            index: index1 + 1,
            name: element.investorName,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeList: [],
          });
          sumAumTotalTemp = sumAumTotalTemp + element.totalAum;
          sumWeightInPercTemp =
            sumWeightInPercTemp + element.weightInPercentage;
        });
        this.investorWiseTotal = [
          "Total",
          "",
          sumAumTotalTemp,
          Math.round(sumWeightInPercTemp),
        ];
        break;
      case "schemes":
        // schemes
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedClient].investorList[
            index
          ].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            schemeFolioList: [],
          });
          sumAumTotalTemp = sumAumTotalTemp + element.totalAum;
          sumWeightInPercTemp =
            sumWeightInPercTemp + element.weightInPercentage;
        });
        this.schemeWiseTotal = [
          "Total",
          "",
          sumAumTotalTemp,
          Math.round(sumWeightInPercTemp),
        ];
        break;
      case "scheme-folio":
        // scheme folio
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedClient].investorList[
            this.selectedInvestor
          ].schemeList[index].schemeFolioList.push({
            index: index1 + 1,
            name: element.schemeName,
            folioNumber: element.folioNumber,
            // totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            totalAum: element.totalAum,
            // balanceUnit: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
            balanceUnit: element.balanceUnit,
            weightInPerc: element.weightInPercentage,
          });
          sumAumTotalTemp = sumAumTotalTemp + element.totalAum;
          sumWeightInPercTemp =
            sumWeightInPercTemp + element.weightInPercentage;
          this.scheme2WiseTotal = [
            "Total",
            "",
            "",
            sumAumTotalTemp,
            "",
            Math.round(sumWeightInPercTemp),
          ];
        });
        break;
    }
  }

  clientTotalAum(data) {
    this.isLoading = false;
    if (data) {
      this.clientList = data;
      this.excelInitClientList();
      this.clientList.forEach((o) => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
      let totalAumObj: any = {};
      if (this.data && this.data.totalAumObj) {
        totalAumObj = this.data.totalAumObj;
        console.log("totalAumObj : ", totalAumObj);
        console.log("sumAumTotal : ", this.totalCurrentValue);
        console.log("sumWeightInPercTotal : ", this.totalWeight);
        this.totalCurrentValue = totalAumObj.totalAum;
        this.totalWeight = 100;
      }
      this.showLoader = false;
    } else {
      this.clientList = [];
    }
  }

  clientScheme(data, show, index) {
    this.subList = data;
    this.selectedClient = index;
    this.clientList[index].subList = this.subList;
    this.clientList[index].show = show ? (show = false) : (show = true);
  }

  getSchemeName(investorData, index, clientIndex, selectedClientName) {
    this.selectedInvestorName = investorData.investorName;
    this.selectedClientName = selectedClientName;
    this.selectedInvestor = index;
    this.selectedClient = clientIndex;
    investorData.showInvestor = !investorData.showInvestor;

    if (investorData.showInvestor == false) {
      investorData.schemeList = [];
      this.scheme1ListArr = [];
      investorData.schemeList = [{}, {}, {}];
      this.isLoadingScheme = true;
      const obj = {
        advisorId: this.parentId == this.advisorId ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: this.data ? this.data.parentId : -1,
        familyMemberId: investorData.familyMemberId,
        totalAum: investorData.totalAum,
        clientId: investorData.clientId,
      };
      this.backoffice.getAumFamilyMemberScheme(obj).subscribe(
        (data) => {
          this.isLoadingScheme = false;
          console.log(data);
          if (data) {
            data.forEach((element) => {
              element.showScheme = true;
              element.familyMemberId = investorData.familyMemberId;
              element.clientId = investorData.clientId;
            });
            investorData.schemeList = data;
            this.scheme1ListArr = data;
            this.appendingOfValuesInExcel(data, index, "schemes");
          }
        },
        (err) => {
          this.scheme1ListArr = [];
          investorData.schemeList = [];
          this.isLoadingScheme = false;
        }
      );
    } else {
      this.removeValuesFromExcel("schemes", index);
      if (
        investorData.hasOwnProperty("schemeList") &&
        investorData.schemeList.length !== 0
      ) {
        investorData.schemeList.forEach((element) => {
          element.showScheme = false;
        });
      }
    }
  }

  getFolio(
    schemeData,
    index,
    investorIndex,
    clientIndex,
    selectedInvName,
    selectedClientName
  ) {
    this.selectedScheme = index;
    this.selectedInvestor = investorIndex;
    this.selectedClient = clientIndex;

    this.selectedSchemeName = schemeData.schemeName;
    this.selectedInvestorName = selectedInvName;
    this.selectedClientName = selectedClientName;
    schemeData.showScheme = !schemeData.showScheme;

    if (schemeData.showScheme == false) {
      this.isLoadingFolio = true;
      this.scheme2List = [];
      schemeData.folioList = [];
      schemeData.folioList = [{}, {}, {}];
      const obj = {
        advisorId: this.parentId == this.advisorId ? 0 : this.advisorId,
        arnRiaDetailsId: this.arnRiaValue,
        parentId: this.data ? this.data.parentId : -1,
        familyMemberId: schemeData.familyMemberId,
        totalAum: schemeData.totalAum,
        schemeId: schemeData.mutualFundSchemeMasterId,
        clientId: schemeData.clientId,
      };
      this.backoffice.getAumFamilyMemberSchemeFolio(obj).subscribe(
        (data) => {
          this.isLoadingFolio = false;
          console.log("folio data>::::", data);
          if (data) {
            schemeData.folioList = data;
            this.scheme2List = data;
            // this.initializeExcelData();
            this.appendingOfValuesInExcel(data, index, "scheme-folio");
          } else {
            this.scheme2List = [];
            schemeData.folioList = [];
            this.isLoadingFolio = false;
          }
        },
        (err) => {
          this.scheme2List = [];
          schemeData.folioList = [];
          this.isLoadingFolio = false;
        }
      );
    } else {
      this.removeValuesFromExcel("scheme-folio", index);
    }
  }

  getSchemeName1(index, show) {
    this.clientList[this.selectedClient].subList[this.selectedInvestor].schemes[
      index
    ].showScheme = show ? (show = false) : (show = true);
  }

  aumReport() {
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode,
    });
    this.clientList.forEach((element) => {
      element.show = true;
    });
  }
}
