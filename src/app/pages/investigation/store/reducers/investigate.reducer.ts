import { InvestigateModel } from "../../models";
import * as fromAction from '../actions';

export function investReducer(
    state: InvestigateModel,
    action: fromAction.InvestigateActions
) {
    switch (action.type) {
        case fromAction.CREATE_INVESTIGATE:
            return action.payload;

        case fromAction.UPDATE_INVESTIGATE:
            return Object.assign({}, state, action.payload);

        case fromAction.REMOVE_INVESTIGATE:
            state = null;
            return state;

        default:
            return state;
    }
}
