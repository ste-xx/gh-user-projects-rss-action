export interface FeedItem {
  id: string
  url: string
  created: number
  title: string
  content_text: string
}

export type FeedMap = Record<string, FeedItem>
