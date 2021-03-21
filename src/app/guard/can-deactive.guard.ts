import { Injectable, HostListener } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NgForm } from "@angular/forms";

@Injectable()
export class CanDeactiveGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {

    if (!component.canDeactivate()) {
      if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

}

// component can deactive
export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}


// form can deactive
export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;

  canDeactivate(): boolean {
    return this.form.submitted || !this.form.dirty
  }
}