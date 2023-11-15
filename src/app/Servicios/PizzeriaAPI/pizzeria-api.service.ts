import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from 'src/app/Modelos/ILogin';
import { IDetalleVenta } from 'src/app/Modelos/IDetalle-Venta';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaAPIService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  private urlApi = 'https://localhost:7219';

  loginAPI(loginData: ILogin){
    return this.http.post(`${this.urlApi}/authentication/login`, loginData);
  }

  getNumEmpleadoLogged(){
    return this.http.get(`${this.urlApi}/authentication/loggedId`);
  }

  getDatosUsuario(): any{
    return this.http.get(`${this.urlApi}/authentication/nombreUser`);
  }

  getProductos(){
    return this.http.get(`${this.urlApi}/productos`)
  }

  crearVenta(numEmpleado: number){
    return this.http.post(`${this.urlApi}/ventas/${numEmpleado}`, numEmpleado);
  }

  crearDetalleVenta(detalleVenta: IDetalleVenta){
    return this.http.post(`${this.urlApi}/detalleVenta`, detalleVenta)
  }

  updateTotal(){
    return this.http.put(`${this.urlApi}/update`, {});
  }
}
