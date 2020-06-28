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
    }

    if(obj.isFreezed) {
      obj.lastFreezedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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

  }
}
