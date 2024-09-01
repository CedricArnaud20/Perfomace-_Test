import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './libs/uuid.js';

export const options = {
 
    stages: [
        { duration: '2m', target: 100 }, 
        { duration: '3m', target: 100 }, 
        { duration: '5m', target: 100 }, 
        { duration: '2m', target: 100 }, 
        { duration: '5m', target: 100 }, 
        { duration: '2m', target: 100 }, 
        { duration: '1m', target: 100 }, 
        { duration: '10m', target: 0 },  
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], //95 % das requisições tem que rodar com menos de 2 segundo
        http_req_failed: ['rate<0.01']  //1 %  das requisições podem falhar
    }
};
export default function () {
    const url = 'http://localhost:3333/signup'

    const payload = JSON.stringify(
        {
            email: `${uuid.v4().substring(24)}@phenix.com.br`,
            password: 'pdw123'
        })

    const headers = {
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    const res = http.post(url, payload, headers)


    check(res, {
        'status should be 200': (r) => r.status === 201
    })

    sleep(1);
}