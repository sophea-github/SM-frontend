
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {BaseService} from "../main/base/base.service";


@Injectable({
  providedIn: "root"
})

export class SupplierService extends BaseService{

  // protected URL = 'http://localhost:8080/api/v1/supplier'

  constructor(private httpClient:HttpClient){
    super(httpClient,"/supplier")

  }



}
