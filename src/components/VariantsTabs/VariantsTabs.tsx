import React from 'react'
import { useFilterContext } from '../../context/FilterContext'

interface iVariantsTabs {
  variants: { label: string; value: string }[]
}

const VariantsTabs = ({ variants }: iVariantsTabs) => {
  const { variant, setVariant } = useFilterContext()

  return (
    <div className='gov-tabs__links-holder' role='tablist' aria-label='Varianty'>
      {variants.map(({ value, label }, index) => (
        <button
          key={index}
          id={'link-tab-' + value}
          className={'gov-tabs__link ' + (variant === value ? 'is-active' : '')}
          aria-selected='true'
          role='tab'
          onClick={(e) => setVariant(value)}
          aria-controls='link-0-tab'
          tabIndex={0}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default VariantsTabs
