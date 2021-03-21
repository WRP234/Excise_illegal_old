import * as fromModels from '../models';

export * from './actions'
export * from './reducers'

export interface AppState {
    readonly invest: fromModels.InvestigateModelUppercase;
}
