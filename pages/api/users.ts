import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import cheerio from 'cheerio';

type UserDistibutionType = {
  kaiden: any;
  chuden: any;
  jyudan: any;
  kudan: any;
  others: any;
};

const fetchUserDistribution = (html: string) => {
  const users: UserDistibutionType = {
    kaiden: {},
    chuden: {},
    jyudan: {},
    kudan: {},
    others: {},
  };

  const $ = cheerio.load(html);
  $('#users-index > tbody > tr').each((_, elem) => {
    const userData = $(elem)
      .text()
      .split('\n')
      .map((e) => e.trim());
    const cpi = userData[4];
    const danni = userData[5];
    const cpiClass = `${Math.floor(Number(cpi) / 50) * 50}~`;

    if (cpi !== '') {
      if (danni === '皆伝') {
        if (users.kaiden[cpiClass]) {
          users.kaiden[cpiClass]++;
        } else {
          users.kaiden[cpiClass] = 1;
        }
      } else if (danni === '中伝') {
        if (users.chuden[cpiClass]) {
          users.chuden[cpiClass]++;
        } else {
          users.chuden[cpiClass] = 1;
        }
      } else if (danni == '十段') {
        if (users.jyudan[cpiClass]) {
          users.jyudan[cpiClass]++;
        } else {
          users.jyudan[cpiClass] = 1;
        }
      } else if (danni == '九段') {
        if (users.kudan[cpiClass]) {
          users.kudan[cpiClass]++;
        } else {
          users.kudan[cpiClass] = 1;
        }
      } else {
        if (users.others[cpiClass]) {
          users.others[cpiClass]++;
        } else {
          users.others[cpiClass] = 1;
        }
      }
    }
  });

  return JSON.stringify(users);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://cpi.makecir.com/users';

  return await axios.get(url).then(({ data }) => {
    res.status(200).json(fetchUserDistribution(data));
  });
};
