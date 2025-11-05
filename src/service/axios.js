import axios from 'axios'

export const apiPloomes = axios.create({
    baseURL: 'https://api2.ploomes.com',
});

export const apiBacen = axios.create({
    baseURL: 'https://api.multiplo.moneyp.com.br/api',
});
