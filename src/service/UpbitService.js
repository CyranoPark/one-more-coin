import fs from 'fs';
import upbitApi from '../api/upbit';

class UpbitService {
  writeMarketAll = async () => {
    const { data } = await upbitApi.get('/v1/accounts');
  }

  getCurrentPrices = async () => {

  }
}

export default UpbitService;
