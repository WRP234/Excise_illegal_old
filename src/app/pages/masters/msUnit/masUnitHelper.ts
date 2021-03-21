import swal from "sweetalert2"

export class MasUnitHelper {

    public swalFn(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
        })
    }

    public swalFnMulti(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        })
    }
}