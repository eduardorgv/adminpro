import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  titulo!: string;
  tituloSubs$: Subscription = new Subscription;

  constructor(private router: Router) { 
    this.tituloSubs$ = this.getArgRuta()
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `${titulo} - Admin Pro`;
      })
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgRuta() {
    return this.router.events
    .pipe(
      filter( (event:any) => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event: ActivationEnd) => event.snapshot.data )
    );
  }

}
