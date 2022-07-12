import { AfterViewInit, Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(localStorage.getItem('email') || '', [Validators.required, Validators.email]),
    password: new FormControl('123456', [Validators.required]),
    remember: new FormControl(false),
  });

  constructor(private router: Router, 
              private usuarioService: UsuarioService, 
              private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '990977923739-a59hlrl137l4hsvo1ite3cqj2m1re1p1.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        if(resp.ok) {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        }
      });
  }

  login() {
    if(this.loginForm.invalid) {
      return;
    }
    this.usuarioService.loginUsuario(this.loginForm.value)
      .subscribe(resp => {
        if(this.loginForm.get('remember')?.value){
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        }else {
          localStorage.removeItem('email');
        }
        
        if(resp.ok){
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        }
      })
  }

}
