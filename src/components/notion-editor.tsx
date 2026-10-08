import * as React from 'react'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import {
  TRANSFORMERS,
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from '@lexical/markdown'
import type { EditorState } from 'lexical'
import { FORMAT_TEXT_COMMAND } from 'lexical'
import { Bold, Italic, Code } from 'lucide-react'

import { cn } from '#/lib/utils'

// Lexical Theme definition for Notion-style aesthetics (design.md)
const notionTheme = {
  paragraph:
    'mb-4 leading-[1.75] text-[#292524] dark:text-[#d6d3d1] text-[16px]',
  heading: {
    h1: 'font-display text-[32px] sm:text-[36px] font-normal text-[#292524] dark:text-[#fafaf9] mt-8 mb-3 tracking-tight leading-[1.2]',
    h2: 'font-display text-[24px] sm:text-[26px] font-semibold text-[#292524] dark:text-[#fafaf9] mt-6 mb-2 tracking-tight leading-[1.3]',
    h3: 'text-[18px] sm:text-[20px] font-semibold text-[#292524] dark:text-[#fafaf9] mt-5 mb-2 tracking-tight',
  },
  quote:
    'border-l-[3px] border-[#615fff] pl-4 italic text-[#79716b] dark:text-[#a6a09b] my-4 bg-[#615fff]/5 py-2.5 pr-3 rounded-r-[6px]',
  list: {
    ul: 'list-disc ml-6 my-3 space-y-1.5 text-[#292524] dark:text-[#d6d3d1]',
    ol: 'list-decimal ml-6 my-3 space-y-1.5 text-[#292524] dark:text-[#d6d3d1]',
    listitem: 'text-[16px] leading-[1.65]',
  },
  code: 'font-mono text-[13px] bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] rounded-[8px] p-4 my-4 block overflow-x-auto text-[#292524] dark:text-[#fafaf9] leading-relaxed',
  text: {
    bold: 'font-bold text-[#292524] dark:text-[#fafaf9]',
    italic: 'italic',
    underline: 'underline underline-offset-4',
    strikethrough: 'line-through text-[#79716b]',
    code: 'font-mono text-[13px] bg-[#fafaf9] dark:bg-[#171514] px-1.5 py-0.5 rounded border border-[#e7e5e4] dark:border-[#292524] text-[#615fff]',
  },
  link: 'text-[#615fff] hover:underline underline-offset-2 cursor-pointer',
}

interface NotionEditorProps {
  initialMarkdown?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  className?: string
}

// Custom Plugin to initialize editor content from Markdown string
function InitialContentPlugin({ markdown }: { markdown?: string }) {
  const [editor] = useLexicalComposerContext()
  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    if (!initializedRef.current && markdown) {
      editor.update(() => {
        $convertFromMarkdownString(markdown, TRANSFORMERS)
      })
      initializedRef.current = true
    }
  }, [editor, markdown])

  return null
}

// Minimal Floating/Sticky Formatting Toolbar
function FloatingToolbar() {
  const [editor] = useLexicalComposerContext()

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  const formatItalic = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  const formatCode = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')

  return (
    <div className="flex items-center gap-1 p-1 bg-white/95 dark:bg-[#171514]/95 backdrop-blur-md rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] shadow-sm mb-6 w-fit transition-opacity">
      <button
        type="button"
        onClick={formatBold}
        className="p-1.5 rounded hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
        title="Bold (Cmd+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={formatItalic}
        className="p-1.5 rounded hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
        title="Italic (Cmd+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={formatCode}
        className="p-1.5 rounded hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
        title="Inline Code"
      >
        <Code className="h-3.5 w-3.5" />
      </button>

      <div className="h-3 w-[1px] bg-[#e7e5e4] dark:bg-[#292524] mx-1" />

      <span className="text-[10px] font-mono text-[#a6a09b] px-1 select-none">
        Type #, ##, -, 1., &gt; for blocks
      </span>
    </div>
  )
}

export function NotionEditor({
  initialMarkdown = '',
  onChange,
  placeholder = 'Type your content here or use markdown shortcuts (# for headings, - for lists, > for quotes)...',
  className,
}: NotionEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: 'NotionEditor',
    theme: notionTheme,
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
  }

  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS)
      onChange?.(markdown)
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={cn('relative w-full', className)}>
        <FloatingToolbar />

        <div className="relative min-h-[500px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[500px] text-[16px] leading-[1.75] font-sans text-[#292524] dark:text-[#d6d3d1]" />
            }
            placeholder={
              <div className="pointer-events-none absolute top-0 left-0 text-[#a6a09b] text-[16px] font-sans select-none leading-[1.75]">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <InitialContentPlugin markdown={initialMarkdown} />
        <OnChangePlugin onChange={handleEditorChange} />
      </div>
    </LexicalComposer>
  )
}
