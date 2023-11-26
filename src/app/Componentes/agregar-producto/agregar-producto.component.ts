import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { INuevoProducto } from 'src/app/Modelos/INuevo-Producto';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css']
})
export class AgregarProductoComponent {

  constructor(private ApiService: PizzeriaAPIService, private router: Router, private toastr: ToastrService){ }

  nuevoProductoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
  });

  nuevoProducto: INuevoProducto = {
    Nombre: '',
    Costo: 0
  }

  agregarProducto(){
    this.nuevoProducto.Nombre = this.nuevoProductoForm.controls['nombre'].value;
    this.nuevoProducto.Costo = this.nuevoProductoForm.controls['precio'].value;

    this.ApiService.agregarProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.toastr.success('Producto agregado exitosamente');
        this.nuevoProductoForm.reset();
        this.router.navigateByUrl('productos');
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error(error.error, 'Ha ocurrido un error');
      }
    })
  }
}
