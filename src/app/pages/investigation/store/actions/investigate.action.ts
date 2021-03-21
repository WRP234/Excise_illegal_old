import { Action } from '@ngrx/store'
import { InvestigateModel } from '../../models';
import { InvestigateModelUppercase } from '../../models';

export const CREATE_INVESTIGATE = '[INVESTIGATE] Create'
export const ADD_INVESTIGATE = '[INVESTIGATE] Add'
export const REMOVE_INVESTIGATE = '[INVESTIGATE] Remove'
export const UPDATE_INVESTIGATE = '[INVESTIGATE] Update'

export class CreateInvestigate implements Action {
    readonly type = CREATE_INVESTIGATE
    constructor(public payload: InvestigateModelUppercase) { }
}

export class AddInvestigate implements Action {
    readonly type = ADD_INVESTIGATE
    constructor(public payload: InvestigateModel) { }
}

export class UpdateInvestigate implements Action {
    readonly type = UPDATE_INVESTIGATE
    constructor(public payload: InvestigateModel) { }
}

export class RemoveInvestigate implements Action {
    readonly type = REMOVE_INVESTIGATE
    constructor() { }
}

export type InvestigateActions = CreateInvestigate | AddInvestigate | RemoveInvestigate | UpdateInvestigate