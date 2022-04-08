import React from 'react'
import cs from 'classnames'
import useDarkMode from '@fisch0920/use-dark-mode'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'

import { Header, Breadcrumbs, Search, useNotionContext } from 'react-notion-x'

import * as types from 'lib/types'
import { navigationStyle, navigationLinks, isSearchEnabled } from 'lib/config'

import styles from './styles.module.css'

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })
  const [hasMounted, setHasMounted] = React.useState(false)
  const { components, mapPageUrl } = useNotionContext()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <div className={cs('breadcrumb', 'button')} onClick={darkMode.toggle}>
            {hasMounted && darkMode.value ? (
              <IoMoonSharp />
            ) : (
              <IoSunnyOutline />
            )}
          </div>

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
