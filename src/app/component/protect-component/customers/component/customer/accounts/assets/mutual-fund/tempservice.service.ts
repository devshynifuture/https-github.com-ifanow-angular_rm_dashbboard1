export class TempserviceService {

  // decimalPipe = new DecimalPipe('en-IN');

  subCatArrayForSummary = (mutualFundList, type, allData, folio) => {
    let reportType;
    let array = [];
    let sortedData = [];
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : (type[0].name == 'Investor wise') ? reportType = 'ownerName' : reportType = 'ownerName';
    const filteredArray = [];

    let catObj;
    if (mutualFundList) {
      if (reportType != 'ownerName') {
        catObj = this.categoryFilter(mutualFundList, reportType);
      } else {
        catObj = this.categoryFilterForInvestorWise(mutualFundList, 'familyMemberId', allData);
      }
      Object.keys(catObj).map(key => {
        (reportType == 'ownerName') ? filteredArray.push({
          groupName: key,
          pan: catObj[key][0].pan
        }) : filteredArray.push({ groupName: key });
        let totalObj: any = {};
        const isgreatorThanZero = (number) => number.balanceUnit <= 0
        let emptyObjOrNot = catObj[key].every(isgreatorThanZero);
        if (!emptyObjOrNot || folio == '1') {
          catObj[key].forEach((singleData) => {
            if ((folio == '2') ? (singleData.balanceUnit > 0 && singleData.balanceUnit != 0) : (singleData.balanceUnit < 0 || singleData.balanceUnit == 0 || singleData.balanceUnit > 0)) {
              array.push(singleData);
              totalObj = this.addTwoObjectValues(this.calculateTotalValue(singleData), totalObj, { schemeName: true });

              const obj = this.getAbsAndxirrCategoryWise(singleData, allData, reportType, folio);
              totalObj.totalXirr = obj ? obj.xirr : 0;
              totalObj.totalAbsoluteReturn = obj ? obj.absoluteReturn : 0;
              totalObj.totalBalanceUnit = catObj[key][catObj[key].length - 1].balanceUnit;
            } else {
              if (filteredArray.length > 0 && array.length == 0) {
                if (filteredArray[filteredArray.length - 1].groupName) {
                  if (catObj[key].length < 2) {
                    filteredArray.pop();
                  }
                }

              }
            }

          });
        } else {
          if (filteredArray.length > 0 && array.length == 0) {
            if (filteredArray[filteredArray.length - 1].groupName) {
              filteredArray.pop();
            }
          }
        }

        sortedData = this.sorting(array, 'schemeName');
        filteredArray.push(...sortedData);
        array = [];
        if (Object.keys(totalObj).length != 0) {
          filteredArray.push(totalObj);
        }
      });
      return filteredArray;
    }
  };
  shouldRoundOff = true;

  sorting(data, filterId) {
    if (data) {
      data.sort((a, b) =>
        a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
      );
    }
    return data;
  }

  getAbsAndxirrCategoryWise(mainData, allData, reportType, folio) {
    let array;
    let mainDataId;
    let obj;
    if (reportType == 'subCategoryName') {
      array = 'subCategoryData';
      mainDataId = 'subCategoryId';
    } else if (reportType == 'categoryName') {
      array = 'mutualFundCategoryMastersList';
      mainDataId = 'categoryId';
    } else if (reportType == 'ownerName') {

      // array = 'family_member_list';
      // mainDataId = 'familyMemberId';
      array = 'schemeWise';
      mainDataId = 'schemeId';
    } else if (reportType = 'schemeName') {
      array = 'schemeWise';
      mainDataId = 'schemeId';
    } else {
      array = 'subCategoryData';
      mainDataId = 'subCategoryId';
    }
    allData[array].forEach(element => {
      if (folio == '1') {
        if (element.id == mainData[mainDataId]) {
          obj = {
            xirr: element.xirr,
            absoluteReturn: element.absoluteReturn
          };
        }
      } else {
        let balanceUnit = element.balanceUnit ? element.balanceUnit : element.balanceUnits;
        if (element.id == mainData[mainDataId] && balanceUnit > 0) {
          obj = {
            xirr: element.xirr,
            absoluteReturn: element.absoluteReturn
          };
        }
      }

    });
    return obj;
  }

  getCategoryForTransaction(mutualFundList, type, allData, folio) { // first table category wise
    const isSummaryTabValues = true;
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ?
      reportType = 'subCategoryName' : (type[0].name == 'Category wise') ?
        reportType = 'categoryName' : (type[0].name == 'Scheme wise') ? reportType = 'schemeName' : (type == 'id') ? reportType = 'id' : reportType = 'ownerName';
    let catObj = {};
    let newArray = [];

    if (reportType != 'ownerName') {
      catObj = this.categoryFilter(mutualFundList, reportType);
    } else {
      catObj = this.categoryFilterForInvestorWise(mutualFundList, 'familyMemberId', allData);
    }
    Object.keys(catObj).map(key => {
      let totalObj: any = {};
      catObj[key].forEach((singleData) => {
        if ((folio == '2') ? (singleData.balanceUnit > 0 && singleData.balanceUnit != 0) : (singleData.balanceUnit < 0 || singleData.balanceUnit == 0 || singleData.balanceUnit > 0)) {
          // this.totalObj = this.this.getEachTotalValue(singleData);
          totalObj = this.addTwoObjectValues(this.getEachTotalValue(singleData, isSummaryTabValues, folio), totalObj, { total: true });
          // totalObj.totalGain = totalObj.totalGain + totalObj.dividendPayout;
          const obj = this.getAbsAndxirrCategoryWise(singleData, allData, reportType, folio);
          console.log(obj);
          totalObj.xirr = obj ? obj.xirr : 0;
          totalObj.absReturn = obj ? obj.absoluteReturn : 0;
          Object.assign(totalObj, { categoryName: key });
        }
      });
      if (Object.keys(totalObj).length != 0) {
        newArray.push(totalObj);
        newArray = this.sorting(newArray, 'categoryName');
      }
    });
    // this.dataSource = newArray;
    // const output = {
    //   dataSource: newArray,
    //   catObj
    // };
    return newArray;
  }

  getSubCategoryArrayForTransaction(mutualFundList, type, allData, trnType, viewMode, folio) {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : (type[0].name == 'Scheme wise') ? reportType = 'schemeName' : reportType = 'ownerName';
    // const dataArray = [];
    const filteredData = [];
    let catObj;
    let obj: any;
    if (reportType != 'ownerName') {
      catObj = this.categoryFilter(mutualFundList, reportType);
    } else {
      catObj = this.categoryFilterForInvestorWise(mutualFundList, 'familyMemberId', allData);
    }
    // const filteredData = new MatTableDataSource(dataArray);
    Object.keys(catObj).map(key => {
      // this.initializeValues(); // for initializing total values object
      let totalObj: any = {};
      if (reportType != 'schemeName' || reportType == 'ownerName') {
        (reportType == 'ownerName') ? filteredData.push({
          groupName: key,
          pan: catObj[key][0].pan,
          isin: catObj[key][0].isin
        }) : filteredData.push({ groupName: key });

      }
      let catObjLength = catObj[key].length;
      const isgreatorThanZero = (number) => number.balanceUnit <= 0
      let emptyObjOrNot = catObj[key].every(isgreatorThanZero);
      catObj[key].forEach((singleData) => {
        if ((folio == '2') ? (singleData.balanceUnit > 0 && singleData.balanceUnit != 0) : (singleData.balanceUnit < 0 || singleData.balanceUnit == 0 || singleData.balanceUnit > 0)) {
          if (viewMode == 'All Transactions') {
            if (trnType) {
              totalObj = {};
              let result = trnType.every(function (e) {
                return e.selected == false;
              });
              if (!result) {
                singleData.mutualFundTransactions = this.getUnrealizedDataTransaction(singleData.mutualFundTransactions, trnType);
              }
            }
          }
          totalObj = {};
          if (singleData.mutualFundTransactions.length > 0) {

            // if (nav) {
            //   nav.forEach(element => {
            //     if (element.schemeCode == singleData.schemeCode) {
            //       singleData.avgCostNav = element.nav;
            //     }
            //   });
            // }
            singleData.avgNav = singleData.avgNav == '-Infinity' ? '0' : singleData.avgNav == 'Infinity' ? '0' : singleData.avgNav;
            obj = {
              schemeName: singleData.schemeName,
              nav: this.mutualFundRoundAndFormat(singleData.nav, 4),
              navDate: singleData.navDate,
              avgNav: this.mutualFundRoundAndFormat(singleData.avgNav, 4),
              isin: singleData.isin
              // pan: singleData.pan
            };
            if (reportType == 'ownerName') {
              obj.folioNumber = singleData.folioNumber;
              obj.pan = singleData.pan;
              obj.isin = singleData.isin;
            }
            filteredData.push(obj);
            if (reportType != 'ownerName') {
              const obj2 = {
                name: singleData.ownerName,
                pan: singleData.pan,
                folio: singleData.folioNumber,
                isin: singleData.isin
              };
              filteredData.push(obj2);
            }

            singleData.mutualFundTransactions.forEach((ele, ind) => {
              ele.indexId = (ind + 1);
              if (ele.rtTypeId == 6 && !ele.fwTransactionType.includes("CAS")) {
                ele.fwTransactionType = ele.fwTransactionType + '(CAS)'
              }
              if (ele.rtTypeId == 14 && !ele.fwTransactionType.includes("*")) {
                ele.fwTransactionType = ele.fwTransactionType + '*'
              }
              ele.currentAmount = ele.unit * ele.nav;
              filteredData.push(ele);
            });
            totalObj = this.addTwoObjectValues(this.getEachTotalValue(singleData, false, folio), totalObj, { total: true });
            const data = this.getAbsAndxirrCategoryWise(singleData, allData, reportType, folio);
            totalObj.totalCagr =data ? data.xirr : 0 ;
            totalObj.trnAbsoluteReturn = data ? data.absoluteReturn : 0;
            totalObj.totalBalanceUnit = singleData.mutualFundTransactions[singleData.mutualFundTransactions.length - 1].balanceUnits
            filteredData.push(totalObj);
          } else {
            if (filteredData.length > 0) {
              if (filteredData[filteredData.length - 1].groupName) {
                filteredData.pop();
              }
            }
          }
        } else {
          // if (filteredData.length > 0) { /// commenting  for backup
          //   if (filteredData[filteredData.length - 1].groupName) {
          //     filteredData.pop();
          //   }
          // }
          if (filteredData.length > 0 && emptyObjOrNot) {
            if (filteredData[filteredData.length - 1].groupName) {
              filteredData.pop();
            }
          }
        }
      });
    });
    return filteredData;
  }

  getUnrealizedDataTransaction(data, trnData) {
    const filterData = [];
    data.forEach(element => {
      trnData.forEach(ele => {
        if (ele.selected == true) {
          if (ele.name == element.fwTransactionType) {
            filterData.push(element);
          }
        }
      });
    });
    return filterData;
  }

  getFinalTotalValue(data, folio) { // grand total values
    let totalValue: any = {};
    data.forEach(element => {
      totalValue = this.addTwoObjectValues(this.getEachTotalValue(element, true, folio), totalValue, { total: true });
    });

    return totalValue;
  }

  filter(data, key) {// filtering data as per category
    const filterData = [];
    const finalDataSource = [];
    data.filter(element => {
      if (element[key]) {
        filterData.push(element[key]);
      }
    });
    if (filterData.length > 0) {
      filterData.forEach(element => {
        element.forEach(singleData => {
          finalDataSource.push(singleData);
        });
      });
    }
    return finalDataSource;
  }

  initializeValues() {
    // this.amtInvested = 0;
    // this.currentValue = 0;
    // this.unrealizedGainLoss = 0;
    // this.absReturn = 0;
    // this.xirr = 0;
    // this.withdrawals = 0;
    // this.balanceUnit = 0;
    // this.divPayout = 0;
    // this.sip = 0;
    // this.totalTransactionAmt = 0;
    // this.totalUnit = 0;
    // this.totalNav = 0;
    // this.dividendPayout = 0;
    // this.dividendReinvest = 0;
    // this.totalAmount = 0;
    // this.totalGain = 0;
    // this.allocationPer = 0;
  }

  calculateTotalValue(data) {// for getting total value as per category in Summary
    let amtInvested = 0;
    let currentValue = 0;
    let unrealizedGainLoss = 0;
    let absReturn = 0;
    let xirr = 0;
    let withdrawals = 0;
    let balanceUnit = 0;
    let divPayout = 0;
    let sip = 0;
    amtInvested += (data.amountInvested) ? data.amountInvested : 0;
    currentValue += (data.currentValue) ? data.currentValue : 0;
    unrealizedGainLoss += (data.unrealizedGain) ? data.unrealizedGain : 0;
    absReturn += (data.absoluteReturn == 'Infinity' || data.absoluteReturn == '-Infinity' || data.absoluteReturn == 'NaN') ? 0 : (data.absoluteReturn) ? data.absoluteReturn : 0;
    xirr += (data.xirr) ? data.xirr : 0;
    divPayout += (data.dividendPayout) ? data.dividendPayout : 0;
    if (data.currentValue == 0) {
      withdrawals += (data.redemption) ? data.redemption : 0;
    } else {
      withdrawals += (data.withdrawalsTillToday) ? data.withdrawalsTillToday : 0;
    }
    balanceUnit += (data.balanceUnit) ? data.balanceUnit : 0;
    sip += (data.sipAmount) ? data.sipAmount : 0;
    const obj = {
      schemeName: 'Total',
      totalAmountInvested: amtInvested,
      totalCurrentValue: currentValue,
      totalUnrealizedGain: unrealizedGainLoss,
      totalAbsoluteReturn: absReturn,
      totalXirr: xirr,
      totalDividendPayout: divPayout,
      totalSwitchOut: withdrawals,
      totalBalanceUnit: balanceUnit,
      totalSipAmount: sip
    };
    // this.totalObj = obj;
    return obj;
  }

  addTwoObjectValues(primaryObject, secondary, exceptionKeys) {
    for (const [key, value] of Object.entries(primaryObject)) {
      if (exceptionKeys[key]) {
      } else {
        if ((primaryObject[key] || primaryObject[key] == 0) && (secondary[key]) || secondary[key] == 0) {
          primaryObject[key] = value + secondary[key];
        }
      }
    }
    return primaryObject;
  }

  getEachTotalValue(data, isSummaryTabValues, folio) { // get total value as per category for transaction
    let currentValue = 0;
    let absReturn = 0;
    let xirr = 0;
    let balanceUnit = 0;
    let totalTransactionAmt = 0;
    let totalUnit = 0;
    let totalNav = 0;
    let dividendPayout = 0;
    let dividendReinvest = 0;
    let totalAmount = 0;
    let totalGain = 0;
    let allocationPer = 0;
    let withdrawals = 0;
    let sip = 0;
    let netGain = 0;
    let marketValue = 0;
    let netInvestment = 0;
    let redemption = 0;
    let switchIn = 0;
    let totalCagr = 0;
    let trnAbsoluteReturn = 0;
    let totalCurrentValue = 0;
    if (!isSummaryTabValues) {
      data.mutualFundTransactions.forEach(ele => {
        if ((folio == '2') ? (ele.balanceUnits > 0 && ele.balanceUnits != 0) : (ele.balanceUnits < 0 || ele.balanceUnits == 0 || ele.balanceUnits > 0)) {
          totalTransactionAmt += (ele.amount) ? (ele.amount * (ele.effect ? ele.effect : 1)) : 0;
          totalUnit += (ele.unit) ? (ele.unit * (ele.effect ? ele.effect : 1)) : 0;
          totalNav += (ele.transactionNav) ? ele.transactionNav : 0;
          balanceUnit = (ele.balanceUnits) ? ele.balanceUnits : 0;
          currentValue += (ele.currentValue) ? ele.currentValue : 0;
          dividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
          dividendReinvest += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
          totalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
          totalGain += (ele.unrealizedGain) ? ele.unrealizedGain : 0;
          absReturn += (ele.absReturn) ? ele.absReturn : 0;
          netGain += (ele.gainOrLossAmount) ? ele.gainOrLossAmount : 0,
            xirr += (ele.xirr) ? ele.xirr : 0;
          allocationPer += (ele.allocationPercent) ? ele.allocationPercent : 0;
          totalCagr += (ele.cagr) ? ele.cagr : 0;
          trnAbsoluteReturn += (ele.absoluteReturn) ? ele.absoluteReturn : 0;
          totalCurrentValue += (ele.currentAmount) ? ele.currentAmount : 0;
        }
      });
    } else {
      if ((folio == '2') ? (data.balanceUnit > 0 && data.balanceUnit != 0) : (data.balanceUnit < 0 || data.balanceUnit == 0 || data.balanceUnit > 0)) {
        totalTransactionAmt += (data.amountInvested) ? data.amountInvested : 0;
        totalUnit += (data.unit) ? data.unit : 0;
        totalNav += (data.transactionNav) ? data.transactionNav : 0;
        balanceUnit += (data.balanceUnit) ? data.balanceUnit : 0;
        currentValue += (data.currentValue) ? data.currentValue : 0;
        dividendPayout += (data.dividendPayout) ? data.dividendPayout : 0;
        dividendReinvest += (data.dividendReinvest) ? data.dividendReinvest : 0;
        totalAmount += (data.totalAmount) ? data.totalAmount : 0;
        totalGain += (data.unrealizedGain) ? data.unrealizedGain : 0;
        absReturn += (data.absoluteReturn == 'Infinity' || data.absoluteReturn == '-Infinity' || data.absoluteReturn == 'NaN') ? 0 : (data.absoluteReturn) ? data.absoluteReturn : 0;
        xirr += (data.xirr || data.xirr == 0) ? data.xirr : 0;
        allocationPer += (data.allocatedPercentage == 'NaN') ? 0 : (data.allocatedPercentage) ? data.allocatedPercentage : 0;
        if (data.currentValue == 0) {
          withdrawals += (data.redemption) ? data.redemption : 0;
        } else {
          withdrawals += (data.withdrawalsTillToday) ? data.withdrawalsTillToday : 0;
        }
        sip += (data.sipAmount) ? data.sipAmount : 0;
        netGain += (data.gainOrLossAmount) ? data.gainOrLossAmount : 0;
        marketValue += (data.marketValue) ? data.marketValue : 0;
        netInvestment += (data.netInvestment) ? data.netInvestment : 0;
        redemption += (data.redemption) ? data.redemption : 0;
        switchIn += (data.switchIn) ? data.switchIn : 0;
      }

    }

    const obj = {
      total: 'Total',
      totalTransactionAmt,
      totalUnit,
      totalNav,
      totalBalanceUnit: balanceUnit,
      currentValue,
      dividendPayout,
      dividendReinvest,
      totalAmount,
      totalGain,
      absReturn,
      xirr,
      allocationPer,
      withdrawals,
      sip,
      netGain,
      marketValue,
      netInvestment,
      redemption,
      switchIn,
      totalCagr,
      trnAbsoluteReturn,
      totalCurrentValue
    };
    // this.totalObj = obj;
    return obj;
  }

  categoryFilter(data, type) {
    data = this.sorting(data, type);
    const catObj = {};
    const categoryArray = [];
    data.forEach(ele => {
      if (ele[type]) {
        const categoryArrayLocal = catObj[ele[type]] ? catObj[ele[type]] : [];
        categoryArrayLocal.push(ele);
        catObj[ele[type]] = categoryArrayLocal;
      } else {
        categoryArray.push(ele);
      }
    });
    return catObj;
  }

  categoryFilterForInvestorWise(data, type, list) {
    const catObj = {};
    const categoryArrayLocal = [];
    let name;
    const categoryArray = [];
    data.forEach(ele => {
      if (ele[type] || ele[type] == 0) {
        // const categoryArrayLocal = catObj[ele[type]] ? catObj[ele[type]] : [];
        list.family_member_list.forEach(element => {
          if (element.id == ele.familyMemberId) {
            name = 'name';
            ele.name = element.name;
            categoryArrayLocal.push(ele);
          }
        });
        catObj[ele[name]] = categoryArrayLocal;
      } else {
        categoryArray.push(ele);
      }
    });
    Object.keys(catObj).map(key => {
      catObj[key] = catObj[key].filter((item: any) =>
        key == item.name
      );

    });
    return catObj;
  }

  filterScheme(data) {
    const filterData = [];
    const filterData2 = [];
    const filterData3 = [];
    const filterData4 = [];
    let sendData = {};
    data.filter(element => {
      if (element.selected) {
        element.mutualFund.forEach(ele => {
          const obj = {
            folioNumber: ele.folioNumber,
            selected: true
          };
          const obj2 = {
            name: ele.ownerName,
            familyMemberId: ele.familyMemberId,
            selected: true
          };
          const obj3 = {
            category: ele.categoryName,
            categoryId: ele.categoryId,
            selected: true
          };
          filterData.push(obj);
          filterData2.push(obj2);
          filterData3.push(obj3);
        });
        const obj = {
          amc_name: element.amc_name,
          schemeName: element.schemeName,
          mutualFund: element.mutualFund,
          id: element.id,
          amc_id: element.amc_id,
          selected: true
        };
        filterData4.push(obj);
      }
    });
    sendData = {
      filterData,
      filterData2,
      filterData3,
      filterData4
    };
    return sendData;
  }

  filterFinalData(mfData, dataForFilter) {
    const family_member_list = this.filterArray(mfData.family_member_list, 'id', dataForFilter.familyMember, 'familyMemberId');
    const category = this.filterArray(mfData.mutualFundCategoryMastersList, 'id', dataForFilter.category, 'categoryId');
    const subCategoryData = this.filter(mfData.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    const schemeWiseFilter = this.filter(subCategoryData, 'mutualFundSchemeMaster');
    const schemeWise = this.filterArray(schemeWiseFilter, 'amc_id', dataForFilter.amc, 'amc_id');
    const mutualFundListFilter = this.filter(schemeWiseFilter, 'mutualFund');
    let mutualFundList = this.filterArray(mutualFundListFilter, 'folioNumber', dataForFilter.folio, 'folioNumber');
    if (dataForFilter.showFolio == '2') {
      mutualFundList = mutualFundList.filter((item: any) =>
        (item.balanceUnit != 0 && item.balanceUnit > 0) || item.folioNumber != 0
      );
    }
    if (dataForFilter.reportAsOn) {
      mutualFundList.forEach(element => {
        element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
          item.transactionDate <= dataForFilter.reportAsOn
        );
      });
    }
    if (dataForFilter.fromDate && dataForFilter.toDate) {
      mutualFundList.forEach(element => {
        element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
          item.transactionDate >= dataForFilter.fromDate && item.transactionDate <= dataForFilter.toDate
        );
      });
    }
    const sendData = {
      subCategoryData,
      family_member_list,
      category,
      schemeWise,
      mutualFundList,
      reportAsOn: dataForFilter.reportAsOn,
      fromDate: dataForFilter.fromDate,
      toDate: dataForFilter.toDate,
      showFolio: dataForFilter.showFolio,
      reportType: dataForFilter.reportType,
      transactionView: dataForFilter.transactionView,
      overviewFilter: dataForFilter.overviewFilter,
      mfData,
    };
    return sendData;
  }

  filterArray(data, dataKey, filterData, filterDataKey) {
    const filter = [];
    filterData.forEach(ele => {
      data.forEach(element => {
        if (element[dataKey] == ele[filterDataKey]) {
          filter.push(element);
        }
      });
    });
    return filter;
  }

  roundOff(data: number, noOfPlaces: number = 0): number {
    // const roundedValue = parseFloat(String(data)).toFixed(noOfPlaces)
    // const val=Number(roundedValue)
    const roundedValue = parseFloat(data.toFixed(noOfPlaces));
    // console.log(' original / roundedValue ', data, ' / ', roundedValue);

    return roundedValue;
  }

  convertInTitleCase(input) {
    if (!input) {
      return '';
    } else {
      return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
  }

  mutualFundRoundAndFormat(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', {
          'minimumFractionDigits': noOfPlaces,
          'maximumFractionDigits': noOfPlaces
        });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }
    // if (typeof (data) === 'string') {
    //   if (data.includes(',')) {
    //     return data;
    //   }
    // }
    // if (!this.locale) {
    //   this.locale = 'en-IN';
    // }
    // if (data && data !== '') {
    //   if (!isNaN(data)) {
    //     let numberValue: number = parseFloat(data);
    //     if (this.shouldRoundOff) { // true
    //       numberValue = Math.round(numberValue);
    //     }
    //     data = numberValue.toLocaleString('en-IN');
    //   } else {

    //   }
    // } else {
    //   if (data !== 0) {
    //     data = '';
    //   }
    // }

    return data;
  }

}
