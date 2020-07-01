import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/services/app-constants';
import { DatePipe } from '@angular/common';

@Injectable()
export class PreferencesService {

  constructor(
    private datePipe: DatePipe,
  ) { }

  createGoalObjForGoalTypes(oldGoalObj, goalForm) {
    switch (oldGoalObj.singleOrMulti) {
      case 1:
        return this.createSingleYearObj(oldGoalObj, goalForm);
    
      case 2:
        return this.createMultiYearEditObj(oldGoalObj, goalForm);
    }

  }


  createMultiYearEditObj(oldGoalObj, goalForm){

    const remainingData = oldGoalObj.remainingData;
    let gstartDate = goalForm.goalStartDateYear + '-' + goalForm.goalStartDateMonth + '-01';
    let gendtDate = goalForm.goalEndDateYear + '-' + goalForm.goalEndDateMonth + '-01';
    let sStartDate = goalForm.savingStartDateYear + '-' + goalForm.savingStartDateMonth + '-01';
    let sEndtDate = goalForm.savingEndDateYear + '-' + goalForm.savingEndDateMonth + '-01';

    let obj:any = {
      id: remainingData.id,
      goalType: oldGoalObj.goalType,
      clientId: remainingData.clientId,
      advisorId: remainingData.advisorId,
      name: goalForm.name,
      notes: goalForm.notes,
      frequency: goalForm.goalEndDateYear - goalForm.goalStartDateYear,
      futureValue: goalForm.goalValue,
      isArchived: goalForm.archiveGoal || false,
      isFreezed: goalForm.freezeCalculation || false,
      stepUp: goalForm.stepUp,
      savingStartDate: sStartDate,
      savindEndDate: sEndtDate,
      savingType: goalForm.savingStatus,
    }

    if(obj.isFreezed) {
      obj.lastFreezedDate = this.datePipe.transform(new Date(), AppConstants.DATE_FORMAT_DASHED);
    }

    switch (oldGoalObj.goalType) {
      case AppConstants.VACATION_GOAL:
        obj['vacationStartYr'] = gstartDate;
        obj['vacationEndYr'] = gendtDate;
        break;

      case AppConstants.EDUCATION_GOAL:
        obj['ageAttheStartofTheCourse'] = ((new Date(gstartDate).getFullYear() - new Date().getFullYear() + remainingData.presentAge));
        obj['ageAtTheEndofTheCourse'] = ((new Date(gendtDate).getFullYear() - new Date().getFullYear() + remainingData.presentAge));
        break;
    }

    return obj;
  }

  createSingleYearObj(oldGoalObj, goalForm) {

    const remainingData = oldGoalObj.remainingData;
    let gstartDate = goalForm.goalStartDateYear + '-' + goalForm.goalStartDateMonth + '-01';
    let sStartDate = goalForm.savingStartDateYear + '-' + goalForm.savingStartDateMonth + '-01';
    let sEndtDate = goalForm.savingEndDateYear + '-' + goalForm.savingEndDateMonth + '-01';

    let obj:any = {
      id: remainingData.id,
      goalType: oldGoalObj.goalType,
      clientId: remainingData.clientId,
      advisorId: remainingData.advisorId,
      goalName: goalForm.name,
      notes: goalForm.notes,
      archivedValue: (goalForm.archiveGoal ? 1 : 0),
      isFreezed: (goalForm.freezeCalculation ? 1 : 0),
      goalStartDate: gstartDate,
      savingStartDate: sStartDate,
      savindEndDate: sEndtDate,
      savingType: goalForm.savingStatus,
    }
    switch (oldGoalObj.goalType) {
      case AppConstants.CAR_GOAL:
      case AppConstants.HOUSE_GOAL:
      case AppConstants.OTHERS_GOAL:
      case AppConstants.BIG_SPEND_GOAL:
      case AppConstants.MARRIAGE_GOAL:
        obj['goalPresentValue'] = goalForm.goalValue;
        break;
      case AppConstants.WEALTH_CREATION_GOAL:
      case AppConstants.EMERGENCY_GOAL:
        obj['goalFV'] = goalForm.goalValue;
        break;
      default:
        console.error('Invalid goal type found', oldGoalObj.goalType);
        return 0;
    }

    if(obj.isFreezed) {
      obj.lastFreezedDate = this.datePipe.transform(new Date(), AppConstants.DATE_FORMAT_DASHED);
    }

    return obj;
  }


  getGoalValueForForm(data) {
    if(data.singleOrMulti == 2) {
      return data.remainingData.futureValue;
    } else {
      switch (data.goalType) {
        case AppConstants.CAR_GOAL:
        case AppConstants.HOUSE_GOAL:
        case AppConstants.OTHERS_GOAL:
        case AppConstants.BIG_SPEND_GOAL:
        case AppConstants.MARRIAGE_GOAL:
          return data.remainingData.goalPresentValue;
        case AppConstants.WEALTH_CREATION_GOAL:
        case AppConstants.EMERGENCY_GOAL:
          return data.remainingData.goalFV;
        default:
          console.error('Invalid goal type found', data.goalType);
          return 0;
      }
    }
  }
}
