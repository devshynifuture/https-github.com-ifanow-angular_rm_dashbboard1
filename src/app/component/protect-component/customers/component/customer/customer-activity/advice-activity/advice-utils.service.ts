import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdviceUtilsService {

  constructor() { }

  static selectAll(flag, dataList, selectedIdList) {
    console.log(dataList)
    dataList.forEach(element => {
      element.selected = flag.checked
    });
    return dataList;
  }
}
