import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  // @Input('valor') progreso: number = 50;
  @Input() progreso: number = 50;
  @Input() btnClase: string = 'btn btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.btnClase = `btn ${this.btnClase}`
  }

  OnChange(nuevoValor: number) {
    if(nuevoValor >= 100) {
      this.progreso = 100;
    }else if(nuevoValor <= 0) {
      this.progreso = 0;
    }else {
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit(this.progreso);
  }

  cambiarValor(valor: number) {
    if((this.progreso + valor) > 100){
      this.valorSalida.emit(100);
      this.progreso = 100;
    }else if((this.progreso + valor) < 0){
      this.valorSalida.emit(0);
      this.progreso = 0;
    }else {
      this.progreso = (this.progreso + valor);
      this.valorSalida.emit(this.progreso);
    }
  }

}
