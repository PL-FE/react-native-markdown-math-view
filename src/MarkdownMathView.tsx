import { View, Text, StyleProp, ViewStyle } from 'react-native'

import MarkdownItMath from 'markdown-it-math'
import React from 'react'
import Markdown, {
  ASTNode,
  MarkdownIt,
  RenderRules,
} from 'react-native-markdown-display'

import MathJax from 'react-native-mathjax-svg'

type MarkdownStyleType = React.ComponentProps<typeof Markdown>['style']

const MarkdownMathView = ({
  children,
  style,
  className,
  markdownStyle = {},
}: {
  children: string
  style?: StyleProp<ViewStyle>
  markdownStyle?: MarkdownStyleType
  className?: string
}) => {
  const markdownItInstance = new MarkdownIt({
    typographer: true,
  })
    .use(MarkdownItMath, {
      inlineOpen: '$',
      inlineClose: '$',
      blockOpen: '$$',
      blockClose: '$$',
    })
    .use(MarkdownItMath, {
      inlineOpen: '\\(',
      inlineClose: '\\)',
      blockOpen: '\\[',
      blockClose: '\\]',
    })

  // B 方案
  // markdown-it-texmath
  // .use(MarkdownItTexmath, {
  //     engine: katex,
  //     delimiters: 'brackets',
  //   })
  //   .use(MarkdownItMath, {
  //     engine: katex,
  //     delimiters: 'dollars',
  //   })

  const renderEquation = (node: ASTNode) => {
    const { content } = node

    return <MathJax key={node.key}>{content}</MathJax>
  }

  const rules: RenderRules = {
    math_inline: renderEquation,
    math_block: renderEquation,
    textgroup: (node, children) => {
      return (
        <Text key={node.key} selectable={true}>
          {children}
        </Text>
      )
    },
  }

  try {
    return (
      <View style={style} className={className}>
        <Markdown
          style={{ markdownStyle }}
          rules={rules}
          markdownit={markdownItInstance}
        >
          {children}
        </Markdown>
      </View>
    )
  } catch (error) {
    return <Text>{children}</Text>
  }
}

export default MarkdownMathView
