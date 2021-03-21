import { OpsArrestIndicmentDetailCollection } from './ops-arrest-indicment-detail-collection';

export class ArrestIndictment {
    public IndictmentID: number;
    public IsProve: number;
    public IsActive: number;
    public GuiltBaseID: number;
    public OpsArrestIndicmentDetailCollection: OpsArrestIndicmentDetailCollection[];
    public IsNewItem: boolean;
}
