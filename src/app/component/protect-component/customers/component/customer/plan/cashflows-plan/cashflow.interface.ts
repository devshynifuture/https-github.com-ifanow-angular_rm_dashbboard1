export interface UpperTableBox {
    description: string;
    month1: { value: string, isAdHocChangesDone: boolean };
    month2: { value: string, isAdHocChangesDone: boolean };
    month3: { value: string, isAdHocChangesDone: boolean };
    month4: { value: string, isAdHocChangesDone: boolean };
    month5: { value: string, isAdHocChangesDone: boolean };
    month6: { value: string, isAdHocChangesDone: boolean };
    month7: { value: string, isAdHocChangesDone: boolean };
    month8: { value: string, isAdHocChangesDone: boolean };
    month9: { value: string, isAdHocChangesDone: boolean };
    month10: { value: string, isAdHocChangesDone: boolean };
    month11: { value: string, isAdHocChangesDone: boolean };
    month12: { value: string, isAdHocChangesDone: boolean };
    total: string;
    remove: string;
}

export interface Group {
    groupName: string
}

export interface GoalTableI {
    goal: string,
    goalYear: string,
    monthlyRequired: string,
    lumpsumRequired: string,
    allocate: string
}

export interface loanTableI {
    loan: string,
    loanYear: string,
    monthlyRequired: string,
    lumpsumRequired: string,
    allocate: string
}