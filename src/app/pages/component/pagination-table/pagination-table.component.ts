import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
    selector: 'app-pagination-table',
    templateUrl: './pagination-table.component.html',
    styleUrls: ['./pagination-table.component.scss']
})
export class PaginationTableComponent implements OnInit, OnChanges {

    paginate: any;

    @Input() TotalItems = 0;
    @Input() CurrentPage = 0;
    @Input() PageSize = 0;
    @Input() RowsPerPageOptions = [];

    @Output() onPageChange = new EventEmitter(this.paginate);

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
        this.CurrentPage = 1;
        this.changePage();
    }

    previousPage() {
        if (this.CurrentPage > this.paginate.startPage) {
            this.CurrentPage = this.CurrentPage - 1;
            this.changePage();
        }
    }

    nextPage() {
        if (this.CurrentPage < this.paginate.endPage) {
            this.CurrentPage = parseInt(this.CurrentPage.toString()) + 1; //logic befor fixed is "this.CurrentPage + 1";
            this.changePage();
        }
    }

    changePage() {
        this.paginate = this.getPageItems();
        this.onPageChange.emit(this.paginate);
    }

    changePageSize() {
        this.CurrentPage = 1;
        this.changePage();
    }

    getPageItems() {
        // tslint:disable-next-line:radix
        const totalItems = parseInt(this.TotalItems.toString());
        // tslint:disable-next-line:radix
        const currentPage = parseInt(this.CurrentPage.toString()) || 1;
        // tslint:disable-next-line:radix
        const pageSize = parseInt(this.PageSize.toString()) || 5;

        if (this.TotalItems === 0) {
            return {
                startPage: 0,
                endPage: 0,
                startIndex: 0,
                endIndex: 0,
                totalItems: 0,
                currentPage: 1,
                pageSize: pageSize,
                totalPages: 0,
                pages: []
            }
        }

        /* calculate total pages  */
        const totalPages = Math.ceil(totalItems / pageSize);

        const startPage = 1; // start Page Button number
        const endPage: number = totalPages;   // end Page Button number

        // calculate start and end item indexes
        // Indexes are started from 1 ! It is important
        const startIndex = ((currentPage - 1) * pageSize) + 1;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems);

        // tslint:disable-next-line:prefer-const
        let pages = [];
        // create an array of pages to ng-repeat in the pager control
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // return object with all paging properties required by the view
        return {
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            pages: pages
        };
    }
}
