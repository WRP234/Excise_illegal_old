import { ITableDataOptions } from '../table-data/table-data.config';
import { ColumnsInterface } from '../interfaces/columns-interface';

export class CONFIG {
  public TableDataOptions: ITableDataOptions = {};
  public gridData: any;
  public columns: ColumnsInterface[] = [
    {
      title: 'ชื่อเอกสาร',
      field: 'fileName'
    },
    {
      title: 'ประเภทเอกสาร',
      field: 'fileType'
    }
  ];
}
