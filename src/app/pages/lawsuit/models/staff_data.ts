import { FormControl } from '@angular/forms';
export class StaffData {
  public Name: string;
  public Position: string;
  public Office: string;
  public as: string;
}

export const StaffDataFormControl = {
  Name: new FormControl(null),
  Position: new FormControl(null),
  Office: new FormControl(null),
  as: new FormControl(null)
}