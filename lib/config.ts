/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.js" as well as environment variables
 * for optional depenencies.
 */

import { getSiteConfig, getEnv } from './get-config-value'

// where it all starts -- the site's root Notion page
export const rootNotionPageId: string = getSiteConfig('rootNotionPageId')

// general site config
export const name: string = getSiteConfig('name')
export const author: string = getSiteConfig('author')
export const domain: string = getSiteConfig('domain')
export const description: string = getSiteConfig('description', 'Notion Blog')

// social accounts
export const twitter: string | null = getSiteConfig('twitter', null)
export const github: string | null = getSiteConfig('github', null)
export const linkedin: string | null = getSiteConfig('linkedin', null)

export const socialImageTitle: string | null = getSiteConfig(
  'socialImageTitle',
  null
)
export const socialImageSubtitle: string | null = getSiteConfig(
  'socialImageSubtitle',
  null
)

// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
export const defaultPageIcon: string | null = getSiteConfig(
  'defaultPageIcon',
  null
)
export const defaultPageCover: string | null = getSiteConfig(
  'defaultPageCover',
  null
)
export const defaultPageCoverPosition: number = getSiteConfig(
  'defaultPageCoverPosition',
  0.5
)

// Optional utteranc.es comments via GitHub issue comments
export const utterancesGitHubRepo: string | null = getSiteConfig(
  'utterancesGitHubRepo',
  null
)

// Optional image CDN host to proxy all image requests through
export const imageCDNHost: string | null = getSiteConfig('imageCDNHost', null)

// Optional whether or not to enable support for LQIP preview images
// (requires a Google Firebase collection)
export const isPreviewImageSupportEnabled: boolean = getSiteConfig(
  'isPreviewImageSupportEnabled',
  false
)

// ----------------------------------------------------------------------------

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const isServer = typeof window === 'undefined'

export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`

export const apiBaseUrl = `${host}/api`

export const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`,
  renderSocialImage: (pageId) => `${apiBaseUrl}/render-social-image/${pageId}`
}

// ----------------------------------------------------------------------------

export const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID
console.log('config', {
  fathomId,
  isDev,
  env: process.env.NEXT_PUBLIC_FATHOM_ID
})

export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined

const defaultEnvValueForPreviewImageSupport =
  isPreviewImageSupportEnabled && isServer ? undefined : null

export const googleProjectId = getEnv(
  'GCLOUD_PROJECT',
  defaultEnvValueForPreviewImageSupport
)

export const googleApplicationCredentials = getGoogleApplicationCredentials()

export const firebaseCollectionImages = getEnv(
  'FIREBASE_COLLECTION_IMAGES',
  defaultEnvValueForPreviewImageSupport
)

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
function getGoogleApplicationCredentials() {
  if (!isPreviewImageSupportEnabled || !isServer) {
    return null
  }

  try {
    const googleApplicationCredentialsBase64 = getEnv(
      'GOOGLE_APPLICATION_CREDENTIALS',
      defaultEnvValueForPreviewImageSupport
    )

    return JSON.parse(
      Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
    )
  } catch (err) {
    console.error(
      'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
    )

    throw err
  }
}
