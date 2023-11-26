import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from 'src/app/Modelos/ILogin';
import { IDetalleVenta } from 'src/app/Modelos/IDetalle-Venta';
import { INuevoUsuario } from 'src/app/Modelos/INuevo-Usuario';
import { INuevoEmpleado } from 'src/app/Modelos/inuevo-empleado';
import { INuevoProducto } from 'src/app/Modelos/INuevo-Producto';
import { IProducto } from 'src/app/Modelos/IProducto';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaAPIService {

  constructor(private http: HttpClient) { }

  private urlApi = 'https://localhost:7219';


  /* Metodos GET */
  getUsuarios(){
    return this.http.get(`${this.urlApi}/authentication/users`);
  }

  getDatosUsuarioLoggeado(): any{
    return this.http.get(`${this.urlApi}/authentication/loggedUser`);
  }

  getUsuarioByNumEmpleado(numEmpleado: number){
    return this.http.get(`${this.urlApi}/authentication/${numEmpleado}`);
  }

  getProductos(){
    return this.http.get(`${this.urlApi}/productos`)
  }

  getProductoById(productoId: number){
    return this.http.get(`${this.urlApi}/productos/${productoId}`);
  }

  getVentasMes(mes: number){
    return this.http.get(`${this.urlApi}/ventas/mes/${mes}`);
  }


  /* Metodos POST */
  loginAPI(loginData: ILogin){
    return this.http.post(`${this.urlApi}/authentication/login`, loginData);
  }

  crearVenta(numEmpleado: number){
    return this.http.post(`${this.urlApi}/ventas/${numEmpleado}`, numEmpleado);
  }

  crearDetalleVenta(detalleVenta: IDetalleVenta){
    return this.http.post(`${this.urlApi}/detalleVenta`, detalleVenta)
  }

  crearUsuario(nuevoUsuario: INuevoUsuario){
    return this.http.post(`${this.urlApi}/authentication/register`, nuevoUsuario);
  }

  crearEmpleado(nuevoEmpleado: INuevoEmpleado){
    return this.http.post(`${this.urlApi}/empleados`, nuevoEmpleado)
  }

  agregarProducto(nuevoProducto: INuevoProducto){
    return this.http.post(`${this.urlApi}/productos`, nuevoProducto);
  }


  /* Metodos PUT */
  updateTotal(){
    return this.http.put(`${this.urlApi}/update`, {});
  }

  updateUsuario(numEmpleado: number, nuevosDatos: INuevoUsuario){
    return this.http.put(`${this.urlApi}/authentication/${numEmpleado}`, nuevosDatos);
  }

  updateEmpleado(numEmpleado: number, nuevosDatos: INuevoUsuario){
    return this.http.put(`${this.urlApi}/empleados/${numEmpleado}`, nuevosDatos);
  }

  updateProducto(idProducto: number, productoActualizado: INuevoProducto){
    return this.http.put(`${this.urlApi}/productos/${idProducto}`, productoActualizado);
  }


  /* Metodos DELETE */
  deleteUser(numEmpleado: number){
    return this.http.delete(`${this.urlApi}/authentication/${numEmpleado}`);
  }

  deleteEmpleado(numEmpleado: number){
    return this.http.delete(`${this.urlApi}/empleados/${numEmpleado}`);
  }

  deleteProducto(nombreProducto: string){
    return this.http.delete(`${this.urlApi}/productos/${nombreProducto}`);
  }
}
