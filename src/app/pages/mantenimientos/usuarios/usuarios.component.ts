import { Component, OnInit, OnDestroy } from '@angular/core';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  totalUsuarios: number = 0;
  usuarios!: Usuario[];
  usuariosTemp!: Usuario[];
  from: number = 0;
  cargando: boolean = true;
  imgSubs!: Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedaService,
              private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(1000)
      ).subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.from)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      if(usuarios.length !== 0){
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
      }
      this.cargando = false;
    });
  }

  cambiarPagina(newFrom: number) {
    if((this.from + newFrom) > this.totalUsuarios) {
      this.from = this.totalUsuarios;
    }else if((this.from + newFrom) < 0) {
      this.from = 0;
    }else {
      this.from = (this.from + newFrom);
    }

    this.cargarUsuarios();
  }

  buscar(term: string) {
    if(term.length !== 0){
      this.busquedaService.buscar('usuarios', term)
      .subscribe(resp => {
        this.usuarios = resp;
      });
    }else {
      this.usuarios = this.usuariosTemp;
    }
  }

  eliminarUsuario(usuario: Usuario) {
    if(usuario.uid === this.usuarioService.uid){
      Swal.fire('Error', 'No puede borrarse a sí mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de eliminar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '¡Si, eliminarlo!',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe((resp:any) => {
            if(resp.ok){
              Swal.fire(
                'Usuario eliminado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
              );
              this.cargarUsuarios();
            }
          })
      }
    })
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);
      })
  }

  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

}
