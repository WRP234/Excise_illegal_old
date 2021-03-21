import { pagination } from '../../../config/pagination';
import { BehaviorSubject } from 'rxjs';

export class ListConfig {
  // public advSearch: any;
  public TextSearch: string;
  public paginage = pagination;
  public dataTable: any;
  public advSearch: BehaviorSubject<Boolean>;

  public btnCreate = `<li class="nav-item">
  <div class="nav-link text-muted waves-effect waves-dark">
  <a class="btn btn-ghost" href="javascript:void(0)" (click)="clickNew()">สร้างข้อมูล</a>
  </div>
  </li>`;

  public searchBar = `<ul class="navbar-nav my-lg-0">
  <li class="nav-item col-8">
      <form autocomplete="off" class="app-search" #formSearch="ngForm"
          (ngSubmit)="clickSearch(formSearch)">
          <input type="search" name="Textsearch" id="" ngModel class="form-control">
          <a href="javaScript:void(0);" (click)="clickSearch(formSearch)" class="srh-btn">
              <i class="ti-search"></i>
          </a>
      </form>
  </li>
  <li class="nav-item col-9">
      <a href="javaScript:void(0);" class="btn text-white" (click)="clickAdvSearch()">
          ค้นหาขั้นสูง
      </a>
  </li>
</ul>`;

}
