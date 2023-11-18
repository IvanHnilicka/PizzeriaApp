import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDatosUsuario } from 'src/app/Modelos/IDatosUsuario';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void { 
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      return;
    };

    // Carga los datos del usuario
    this.ApiService.getDatosUsuarioLoggeado().subscribe({
      next: (datos: any) => {
        this.user = datos.value;
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
        return;
      }
    });
  }

  user: IDatosUsuario = {
    nombre: '',
    correo: '',
    telefono: '',
    numEmpleado: -1,
    admin: false
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
