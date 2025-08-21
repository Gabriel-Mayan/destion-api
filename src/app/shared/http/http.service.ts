import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import axios from './axios.client';

@Injectable()
export class HttpService {
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return await axios.get<T>(url, config);
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig) {
    return await axios.post<T>(url, data, config);
  }

  async put<T>(url: string, data: any, config?: AxiosRequestConfig) {
    return await axios.put<T>(url, data, config);
  }

  async patch<T>(url: string, data: any, config?: AxiosRequestConfig) {
    return await axios.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return await axios.delete<T>(url, config);
  }
}
