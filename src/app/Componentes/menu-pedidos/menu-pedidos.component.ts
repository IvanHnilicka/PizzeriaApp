import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDatosUsuario } from 'src/app/Modelos/IDatosUsuario';
import { IProducto } from 'src/app/Modelos/IProducto';
import { IDetalleVenta } from 'src/app/Modelos/IDetalle-Venta';
import { PizzeriaAPIService } from 'src/app/Servicios/PizzeriaAPI/pizzeria-api.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-menu-pedidos',
  templateUrl: './menu-pedidos.component.html',
  styleUrls: ['./menu-pedidos.component.css']
})
export class MenuPedidosComponent implements OnInit {
  constructor(private ApiService: PizzeriaAPIService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {    
    let token = localStorage.getItem('token')?.toString();
    if(!token){
      this.toastr.error("Inicia sesion para continuar", "Acceso denegado");
      this.router.navigateByUrl('login');
    }

    // Carga la lista de productos para mostrar en el menu
    this.ApiService.getProductos().subscribe({
      next: (datos: any) => {
        this.listaProductos = datos;
      },
      error: (error) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
        return;
      }
    });

    this.ApiService.getDatosUsuarioLoggeado().subscribe({
      next: (res: any) => {
        this.usuario = res.value;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
        console.log(error);
      } 
    })
  }

  usuario: IDatosUsuario = {
    numEmpleado: -1,
    nombre: '',
    correo: '',
    telefono: '',
    admin: false,
  }

  loadingProductos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  listaProductos: IProducto[] = [];
  pedido: IProducto[] = [];
  productosPedido: Set<IProducto> = new Set();

  
  logOut(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }


  // Agrega uno más del producto al pedido
  agregarProducto(producto: IProducto){
    this.pedido.push(producto);
    if(!this.productosPedido.has(producto)){
      this.productosPedido = new Set(this.pedido);
    }
  }


  // Elimina un elemento del producto en el pedido
  restarProducto(producto: IProducto){
    let index = this.pedido.indexOf(producto);
    this.pedido.splice(index, 1);

    if(this.calcularCantidad(producto) === 0){
      this.productosPedido.delete(producto);
    }
  }


  // Retorna la cantidad de veces que se encuentra el producto en el pedido
  calcularCantidad(producto: IProducto): number{
    return this.pedido.filter(p => p === producto).length;
  }


  // Retorna el total a pagar del pedido
  calcularTotal(): number {
    let suma = 0;
    this.pedido.forEach((producto: IProducto) => {
      suma += producto.costo;
    })

    return parseFloat(suma.toFixed(2));
  }


  // Guarda la venta y los detalles en la Base de Datos
  tomarPedido(){
    this.ApiService.crearVenta(this.usuario.numEmpleado).subscribe({
      next: () => {
        // Creamos un detalle para agregar a la BD por cada producto dentro del pedido
        this.productosPedido.forEach(producto => {
          let detalle: IDetalleVenta = {
            IdProducto: producto.id,
            Cantidad: this.pedido.filter(p => p.id === producto.id).length
          }

          this.ApiService.crearDetalleVenta(detalle).subscribe({
            next: () => {
              // Actualiza el total de la venta cuando se agregan los detalles en la base de datos
              this.ApiService.updateTotal().subscribe({
                error: (error) => {
                  this.toastr.error(error, 'Ha ocurrido un error');
                }
              });
            },
            error: (error) => {
              this.toastr.error(error.message, 'Ha ocurrido un error');
            }
          })
        });

        this.toastr.success('Pedido realizado');
        this.pedido = [];
        this.productosPedido = new Set([]);
      },
      error: (error) => {
        this.toastr.error(error.message, 'Ha ocurrido un error');
      }
    })
  }
}
