import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'
import cheerio from 'cheerio'

const fetchUserDistribution = (html: string) => {
  let users = []

  const $ = cheerio.load(html)
  $('#users-index > tbody > tr').each((_, elem) => {
    const userData = $(elem).text().split("\n").map(e => e.trim())
    const cpi = userData[4]
    const danni = userData[5]
    
    if (userData[4] !== "") {
      users.push({
        cpi,
        danni,
        class: Math.floor(Number(cpi) / 50)
      })
    }
  })

  console.log(users.length)
  return JSON.stringify(users)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://cpi.makecir.com/users'

  return await axios
    .get(url)
    .then(({ data }) => {
      res.status(200).json(fetchUserDistribution(data))
    })
}