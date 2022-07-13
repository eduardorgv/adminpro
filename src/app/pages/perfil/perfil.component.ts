import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  usuario!: Usuario;
  uploadImg!: any;
  imgTemp: any = null;

  constructor(private usuarioService: UsuarioService, private fileUploadService: FileUploadService) { 
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = new FormGroup({
      nombre: new FormControl(this.usuario.nombre, Validators.required),
      email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp: any) => {
        if(resp.ok) {
          const { nombre, email } = this.perfilForm.value;

          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
        }else {
          Swal.fire('Error', resp.msg, 'error');
        }
      });
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
    this.fileUploadService.actualizarFoto(this.uploadImg, 'usuarios', this.usuario.uid!)
      .then(img => {
        if(img === false){
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }else {
          this.usuario.img = img
          Swal.fire('Guardado','La foto se actualizó correctamente', 'success');
        }
      });
  }

}
