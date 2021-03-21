import { RewardHelper } from '../../reward.helper';
import { pagination } from 'app/config/pagination';
import { Input } from '@angular/core';
import { ColumnsInterface } from '../interfaces/columns-interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ITableDataOptions {
  action?: 'VIEW' | 'ADD' | 'EDIT' | 'DELETE';
  actionUrl?: string;
  actionFieldParams?: string[];
  isSumFooter?: boolean;
}
export interface IShowInputModel {
  field: string;
  index: number;
}
export class TableDataConfig extends RewardHelper {
  public ShowInputModel: number[] = [];
  public paginage = pagination;
  @Input()
  set columns(val) {
    this.columns$.next(val);
  }
  get columns() {
    return this.columns$.asObservable();
  }
  @Input()
  set data(val) {
    this.data$.next(val);
  }
  get data() {
    return this.data$.asObservable();
  }
  public data$ = new BehaviorSubject<any>(null);

  @Input() public options: ITableDataOptions;
  @Input() public showIndex = true;

  public columns$ = new BehaviorSubject<any>(null);
}
