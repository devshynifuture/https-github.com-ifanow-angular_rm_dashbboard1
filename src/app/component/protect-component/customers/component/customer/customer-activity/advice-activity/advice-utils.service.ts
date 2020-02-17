import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdviceUtilsService {

  constructor() { }

  static selectAll(flag, dataList, selectedIdList) {
    console.log(dataList)
    dataList.forEach(element => {
      element.selected = flag.checked;
      if (flag.checked) {
        selectedIdList.push(element.id);
      }
      else {
        selectedIdList.forEach(singleId => {
          (singleId == element.id) ? selectedIdList.splice(selectedIdList.indexOf(singleId), 1) : ''
        });
      }
    });
    return { dataList, selectedIdList };
  }
}
