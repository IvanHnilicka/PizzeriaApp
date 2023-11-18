import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { INuevoUsuario } from 'src/app/Modelos/INuevo-Usuario';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
})
export class EditarUsuarioComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Valida que un usuario este loggeado
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
    }else{
      // Valida que el usuario tenga permisos de administrador
      this.ApiService.getDatosUsuarioLoggeado().subscribe((res: any) => {
        let datos = res.value;
        if(datos){
          this.isAdmin = datos.admin;
        }
  
        if(!this.isAdmin){
          this.toastr.error('No cuentas con permisos de administrador', 'Acceso denegado');
          this.router.navigateByUrl('pedidos');
        }
      });
    }

    // Obtiene el numero de empleado de la ruta y busca los datos del empleado
    this.route.params.subscribe({
      next: (params) => {
        this.numEmpleado = params['numEmpleado'];
        this.ApiService.getUsuarioByNumEmpleado(this.numEmpleado).subscribe({
          next: (data: any) => {
            this.usuario.Nombre = data.nombre;
            this.usuario.Correo = data.correo;
            this.usuario.Telefono = data.telefono;
            this.usuario.Admin = data.admin;
            
            this.updateUsuarioForm.controls['nombre'].setValue(this.usuario.Nombre);
            this.updateUsuarioForm.controls['correo'].setValue(this.usuario.Correo);
            this.updateUsuarioForm.controls['telefono'].setValue(this.usuario.Telefono);
            this.updateUsuarioForm.controls['administrador'].setValue(this.usuario.Admin);
          },
          error: () => {
            this.toastr.error('Ha ocurrido un error');
          }
        });
      },
      error: (error) => console.log>(error),
    });
  }


  usuario: INuevoUsuario = {
    Nombre: '',
    Correo: '',
    Contraseña: '',
    Telefono: '',
    Admin: false,
  }
  
  updateUsuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    contraseña: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)]),
    confirmacion: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)]),
    administrador: new FormControl(false),
  })

  numEmpleado: number = -1;
  isAdmin: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarConfirmacion: boolean = false;

  updateUsuario(){
    if(this.updateUsuarioForm.controls['contraseña'].value != this.updateUsuarioForm.controls['confirmacion'].value){
      this.toastr.error('Contraseñas no coinciden', 'Error');
      return;
    }

    this.usuario.Nombre = this.updateUsuarioForm.controls['nombre'].value;
    this.usuario.Correo = this.updateUsuarioForm.controls['correo'].value;
    this.usuario.Telefono = this.updateUsuarioForm.controls['telefono'].value.toString();
    this.usuario.Contraseña = this.updateUsuarioForm.controls['contraseña'].value;
    this.usuario.Admin = this.updateUsuarioForm.controls['administrador'].value;

    this.ApiService.updateUsuario(this.numEmpleado, this.usuario).subscribe({
      next: () => {
        this.ApiService.updateEmpleado(this.numEmpleado, this.usuario).subscribe({
          next: () => {
            this.toastr.success('Los datos han sido actualizados');
            this.router.navigateByUrl('/usuarios');
          },
          error: (error: HttpErrorResponse) => {
            this.toastr.error(error.message, 'Ha ocurrido un error');
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    });
  }
}
