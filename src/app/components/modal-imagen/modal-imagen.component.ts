import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  uploadImg!: any;
  imgTemp: any = null;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  changeImage(event: any) {
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    this.uploadImg = event.target.files[0];

    if(!extensionesValidas.includes(event.target.files[0].name.split('.').pop())){
      Swal.fire('Error', 'El archivo subido no es un imagen', 'error');
      this.uploadImg = null;
      return;
    }else {

      if(!event){
        this.imgTemp = null;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
  
      reader.onloadend = () => {
        this.imgTemp = reader.result;
      }
    }
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const type = this.modalImagenService.type;

    this.fileUploadService.actualizarFoto(this.uploadImg, type, id)
      .then(img => {
        if(img === false){
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }else {
          Swal.fire('Guardado','La foto se actualizó correctamente', 'success');
          this.modalImagenService.nuevaImagen.emit(img);
        }
        this.cerrarModal();
      });
  }

}
