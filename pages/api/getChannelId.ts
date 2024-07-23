import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await axios.get(url as string)
    const html = response.data
    const jsonMatch = html.match(/var ytInitialData = (.+?);<\/script>/)
    
    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1])
      let channelId

      if (url.includes('/channel/')) {
        channelId = url.split('/channel/')[1].split('/')[0]
      } else if (url.startsWith('@') || url.includes('/@')) {
        const params = data?.responseContext?.serviceTrackingParams[0]?.params
        channelId = params?.find((param: any) => param.key === 'browse_id')?.value
      } else {
        channelId = data?.header?.c4TabbedHeaderRenderer?.channelId
      }

      if (channelId) {
        return res.status(200).json({ channelId })
      }
    }
    
    return res.status(404).json({ error: 'Channel ID not found' })
  } catch (error) {
    console.error('Error fetching channel ID:', error)
    return res.status(500).json({ error: 'Failed to fetch channel ID' })
  }
}