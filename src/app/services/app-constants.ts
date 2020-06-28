// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class AppConstants {
  constructor(){}

  public static getMonthsArr(){
    const month = f=>Array.from(Array(12),(e,i)=>new Date(25e8*++i).toLocaleString('en-US',{month:f}));
    const shortMonths = month('short');
    const longMonths = month('long');
    const monthNumbers = Array(12).fill(0).map((_, i) => ('0' + (i +1)).toString().slice(-2))
    return monthNumbers.map((v, i) => {return {number: v, short: shortMonths[i], long: longMonths[i]}});
  }


  public static DONUT_CHART_COLORS = ['#008FFF', '#5DC644', '#FFC100', '#A0AEB4', '#FF7272'];

  public static formPlaceHolders = {
    ENTER_MOBILE_NUMBER: 'Enter mobile number',
    ENTER_FULL_NAME: 'Enter full name',
    ENTER_EMAIL_ID: 'Enter email Id',
    SELECT_ROLE: 'Select role',
    ENTER_ROLE_NAME: 'Enter role name',
    SELECT_OPTION: 'Select option',
    ENTER_ARN_RIA_NUMBER: 'Enter ARN/RIA number',
    ENTER_ARN_RIA_HOLDER: 'Enter ARN/RIA holder name',
    ENTER_DATE: 'Enter date',
    ENTER_REGISTERED_EMAIL: 'Enter registered email',
    ENTER_EUIN: 'Enter EUIN',
    ENTER_PAN: 'Enter PAN number',
    ENTER_REGISTERED_PAN: 'Enter registered PAN number',
    ENTER_REGISTERED_ADDRESS: 'Enter registered address',
    ENTER_GST: 'Enter GST number',
    ENTER_PASSWORD: 'Enter password',
    ENTER_LOGIN_ID: 'Enter Login ID',
    ENTER_ANSWER: 'Enter answer',
    SEARCH_USER: 'Search user',
    ADD_SUB_TASK_DESCRIPTION: 'Add sub task description',
    ENTER_COMPANY_NAME: 'Enter company name',
    ENTER_WEBSITE: 'Enter website',
    ENTER_COMPANY_ADDRESS: 'Enter office address',
    ENTER_PIN_CODE: 'Enter pin code',
    REENTER_NEW_PASSWORD: 'Re-enter new password',
    TEMPLATE_NAME: 'Template name',
    SELECT_OWNER: 'Select ownwer',
  }
  public static EDUCATION_GOAL = 6;
  public static VACATION_GOAL = 5;
  public static RETIREMENT_GOAL = 1;
  public static HOUSE_GOAL = 2;
  public static WEALTH_CREATION_GOAL = 8;
  public static MARRIAGE_GOAL = 4;
  public static CAR_GOAL = 3;
  public static EMERGENCY_GOAL = 7;
  public static BIG_SPEND_GOAL = 9;
  public static OTHERS_GOAL = 10;

  public static RELATIONSHIP_FATHER = 6;
  public static RELATIONSHIP_MOTHER = 7;
  public static RELATIONSHIP_SON = 4;
  public static RELATIONSHIP_DAUGHTER = 5;
  public static RELATIONSHIP_OTHER = 10;
  public static RELATIONSHIP_WIFE = 3;
  public static RELATIONSHIP_HUSBAND = 2;
  public static RELATIONSHIP_SELF = 0;

  public static DATE_FORMAT_DASHED = 'yyyy-MM-dd';


  public static EMAIL_DOMAINS = ['gmail.com','hotmail.com','mail.com','outlook.com','yahoo.com','yahoo.co.in','rediffmail.com'];
}
