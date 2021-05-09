import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type ChartData = {
  name: string;
  kaiden: number;
  chuden: number;
  jyudan: number;
  kudan: number;
  others: number;
};

export default function Home() {
  const [userData, setUserData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/api/users');

      const data: ChartData[] = [];

      for (const [key, value] of Object.entries(result.data['kaiden'])) {
        let flg = true;
        for (const elem of data) {
          if (elem['name'] === key) {
            elem['kaiden'] = value as number;
            flg = false;
          }
        }
        if (flg) {
          data.push({
            name: key,
            kaiden: value as number,
            chuden: 0,
            jyudan: 0,
            kudan: 0,
            others: 0,
          });
        }
      }

      for (const [key, value] of Object.entries(result.data['chuden'])) {
        let flg = true;
        for (const elem of data) {
          if (elem['name'] === key) {
            elem['chuden'] = value as number;
            flg = false;
          }
        }
        if (flg) {
          data.push({
            name: key,
            kaiden: 0,
            chuden: value as number,
            jyudan: 0,
            kudan: 0,
            others: 0,
          });
        }
      }

      for (const [key, value] of Object.entries(result.data['jyudan'])) {
        let flg = true;
        for (const elem of data) {
          if (elem['name'] === key) {
            elem['jyudan'] = value as number;
            flg = false;
          }
        }
        if (flg) {
          data.push({
            name: key,
            kaiden: 0,
            chuden: 0,
            jyudan: value as number,
            kudan: 0,
            others: 0,
          });
        }
      }

      for (const [key, value] of Object.entries(result.data['kudan'])) {
        let flg = true;
        for (const elem of data) {
          if (elem['name'] === key) {
            elem['kudan'] = value as number;
            flg = false;
          }
        }
        if (flg) {
          data.push({
            name: key,
            kaiden: 0,
            chuden: 0,
            jyudan: 0,
            kudan: value as number,
            others: 0,
          });
        }
      }

      for (const [key, value] of Object.entries(result.data['others'])) {
        let flg = true;
        for (const elem of data) {
          if (elem['name'] === key) {
            elem['others'] = value as number;
            flg = false;
          }
        }
        if (flg) {
          data.push({
            name: key,
            kaiden: 0,
            chuden: 0,
            jyudan: 0,
            kudan: 0,
            others: value as number,
          });
        }
      }

      const compare = (a: ChartData, b: ChartData) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      };
      data.sort(compare);

      setUserData(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>IIDX CPI CHART</title>
        <meta
          name="description"
          content="beatmania IIDX（弐寺）の CPI のユーザー分布をグラフで可視化します."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!isLoading ? (
          <BarChart
            width={1000}
            height={600}
            data={userData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="kaiden" name="皆伝" stackId="a" fill="#ffd900" />
            <Bar dataKey="chuden" name="中伝" stackId="a" fill="#a7a9a9" />
            <Bar dataKey="jyudan" name="十段" stackId="a" fill="#ff6347" />
            <Bar dataKey="kudan" name="九段" stackId="a" fill="#81e3e3" />
            <Bar dataKey="others" name="その他" stackId="a" fill="#f0c6c6" />
          </BarChart>
        ) : (
          <h2>{'Now loading...'}</h2>
        )}
      </main>
    </div>
  );
}
