import { Injectable } from '@nestjs/common';
import { CreateClassifyDto } from './dto/create-classify.dto';
import axios from 'axios';

@Injectable()
export class ClassifyService {
  create(createClassifyDto: CreateClassifyDto) {
    return 'This action adds a new classify';
  }

  classifyName(name: string) {

    if(!name) {
      return res.status(400).json({ error: 'Name parameter is required' }); 
    }
    const res = axios
      .get(`https://api.genderize.io/?name=${name}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching classify data:', error);
        throw new Error('Failed to fetch classify data');
      });

    console.log('Classify data:', res);
    return res;
  }

}
