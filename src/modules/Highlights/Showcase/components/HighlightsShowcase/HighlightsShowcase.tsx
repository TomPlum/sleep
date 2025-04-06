import React, { PropsWithChildren } from 'react'
import { HighlightsShowcaseProps } from 'modules/Highlights/Showcase'
import { useShowcaseContext } from 'modules/Highlights/Showcase/context'
import styles from './HighlightsShowcase.module.scss'

export const HighlightsShowcase = ({ children }: PropsWithChildren<HighlightsShowcaseProps>) => {
  const { active } = useShowcaseContext()

  return (
    <div className={styles.wrapper}>
      {
        React.Children.map(children, (child, i) => {
          if (i === active) {
            return child
          }
        })
      }
    </div>
  )
}