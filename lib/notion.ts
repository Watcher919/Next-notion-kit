import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'

import { getPreviewImageMap } from './preview-images'
import { getTweetAstMap } from './tweet-embeds'
import {
  isPreviewImageSupportEnabled,
  isTweetEmbedSupportEnabled
} from './config'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId)

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  if (isTweetEmbedSupportEnabled) {
    const tweetAstMap = await getTweetAstMap(recordMap)
    ;(recordMap as any).tweetAstMap = tweetAstMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
