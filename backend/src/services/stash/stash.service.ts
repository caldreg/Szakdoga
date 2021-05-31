import { response } from 'express';
import { HttpService, Injectable } from '@nestjs/common';

const config = {
    host: 'stash.sed.hu',
    port: 443,
    path: null,
    headers: {
        'Authorization': 'Basic ' + Buffer.from('username' + ':' + 'password').toString('base64')
    },
};

@Injectable()
export class StashService {

    constructor(private httpService: HttpService) {}
    
    async getTags(key: string, project: string): Promise<any> {

        let endpoint = config;
        endpoint.path = 'https://'+ config.host +'/rest/api/1.0/projects/' + key + '/repos/' + project + '/tags?limit=100';

        const response = await this.httpService.get(endpoint.path, { headers: config.headers }).toPromise();

        return response.data.values;
    }

    async getBranhces(key: string, project: string): Promise<any> {

        let endpoint = config;
        endpoint.path = 'https://'+ config.host +'/rest/api/1.0/projects/' + key + '/repos/' + project + '/branches';

        const response = await this.httpService.get(endpoint.path, { headers: config.headers }).toPromise();

        return response.data.values;
   }   
}
