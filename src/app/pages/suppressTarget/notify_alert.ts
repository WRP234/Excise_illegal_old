import swal from 'sweetalert2';
import {Messages_target } from './new_message';
// import { text } from '@angular/core/src/render3/instructions';

export class alert{
    private success_notify(){
        swal({
            type: 'success',
            text: Messages_target.save_mes+Messages_target.complete,
            confirmButtonText:'ยืนยัน',
                       
        })
    }
    private warning_notify(){
        swal({
            type: 'warning',
            text: Messages_target.confirm_mes+' ?',
            showCancelButton: true,
            confirmButtonText:'ยืนยัน',
            cancelButtonText:'ยกเลิก',
            
        })
    }
    private error_notify(){
        swal({
            type:'error',
            text:'',
            
        })
    }
}