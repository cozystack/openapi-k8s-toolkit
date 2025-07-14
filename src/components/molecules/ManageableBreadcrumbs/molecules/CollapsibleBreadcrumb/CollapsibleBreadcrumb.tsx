import { FC, useState, useRef, useLayoutEffect } from 'react'
import { Breadcrumb } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { Styled } from './styled'

type CollapsibleBreadcrumbProps = {
  items: BreadcrumbItemType[]
}

export const CollapsibleBreadcrumb: FC<CollapsibleBreadcrumbProps> = ({ items }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const checkWidth = () => {
      if (containerRef.current && breadcrumbRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const breadcrumbWidth = breadcrumbRef.current.scrollWidth
        // console.log('containerWidth:', containerWidth, 'breadcrumbWidth:', breadcrumbWidth)
        setIsCollapsed(breadcrumbWidth > containerWidth)
      }
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [items])

  const renderItems = () => {
    if (!isCollapsed) {
      return items
    }
    if (items.length <= 2) {
      return items
    }
    const firstItem = items[0]
    const lastItem = items[items.length - 1]
    const hiddenItems = items.slice(1, -1)
    const menuItems = hiddenItems.map((item, index) => ({
      key: String(index),
      label: item.href ? <a href={item.href}>{item.title}</a> : item.title,
    }))
    const ellipsisItem: BreadcrumbItemType = {
      title: '...',
      menu: { items: menuItems },
      dropdownProps: { arrow: false },
    }
    return [firstItem, ellipsisItem, lastItem]
  }

  return (
    <Styled.PositionRelativeContainer>
      <Styled.FullWidthContainer ref={containerRef}>
        <Breadcrumb separator=">" items={renderItems()} />
      </Styled.FullWidthContainer>
      <Styled.NoWrapContainer ref={breadcrumbRef}>
        <Breadcrumb separator=">" items={items} style={{ display: 'flex', flexWrap: 'nowrap' }} />
      </Styled.NoWrapContainer>
    </Styled.PositionRelativeContainer>
  )
}
