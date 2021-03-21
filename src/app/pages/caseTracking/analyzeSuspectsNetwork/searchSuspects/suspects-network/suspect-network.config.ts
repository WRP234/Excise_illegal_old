import { Subject, BehaviorSubject } from "rxjs";
import { FormGroup, FormArray } from "@angular/forms";

export class SuspectNetworkConfig {
    //btn
    advSearch: any;
    showAdvSearch = new BehaviorSubject<Boolean>(true);

    public PERSON_ID: string;
    public destroy$: Subject<boolean> = new Subject<boolean>();
    processed = new BehaviorSubject<boolean>(false);

    imgLawbreaker: string = './assets/images/imgLawbreaker.png';
    imgArrest: string = './assets/images/handcuffs.png';
    imgRelationship: string = './assets/images/relationship.png';
    imgDocument: string = './assets/images/doc.png';

    public suspectNetworkFG: FormGroup;
    public suspectNetwork: any;

    suspectNetworkMock: any = {
        name: 'Janis Martin',
        designation: 'ผู้ต้องหา',
        img: this.imgLawbreaker,
        subordinates: [
            {
                name: 'ใบงานจับกุมเดียวกัน',
                designation: '',
                img: this.imgArrest,
                subordinates: [
                    {
                        name: 'Dylan Wilson',
                        designation: 'Web Manager',
                        img: this.imgLawbreaker,
                        subordinates: []
                    },
                    {
                        name: 'Deb Curtis',
                        designation: 'Art Director',
                        img: this.imgLawbreaker,
                        subordinates: []
                    }
                ]
            },
            {
                name: 'เครือญาติ',
                designation: '',
                img: this.imgRelationship,
                subordinates: [
                    {
                        name: 'Dylan Wilson',
                        designation: 'Web Manager',
                        img: this.imgLawbreaker,
                        subordinates: []
                    },
                    {
                        name: 'Deb Curtis',
                        designation: 'Art Director',
                        img: this.imgLawbreaker,
                        subordinates: []
                    }
                ]
            }
        ]
    };
}