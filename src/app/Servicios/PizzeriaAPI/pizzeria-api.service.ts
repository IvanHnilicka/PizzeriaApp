import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from 'src/app/Modelos/ILogin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaAPIService {

  constructor(private http: HttpClient) { }

  loginAPI(loginData: ILogin){
    return this.http.post('https://localhost:7219/authentication/login', loginData);
  }

  getNumEmpleadoLoggeado(): Observable<any>{
    return this.http.get('https://localhost:7219/authentication/loggedId');
  }

  getDatosEmpleadoByNum(numEmpleado: number){
    return this.http.get(`https://localhost:7219/authentication/${numEmpleado}`);
  }
}
