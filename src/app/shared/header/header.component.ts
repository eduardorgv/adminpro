import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  usuario!: Usuario;
  imgUrl!: string;

  constructor(private usuarioService: UsuarioService,
              private router: Router) { 
    this.usuario = this.usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if(termino.length !== 0) {
      this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
    }
    return;
  }

}
