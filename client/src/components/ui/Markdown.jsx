import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy } from 'lucide-react'

const SAFE_URL = /^(https?:\/\/|mailto:|#|\/)/i

function safeUrl(url) {
  return SAFE_URL.test(String(url || '')) ? url : '#'
}

function CodeBlock({ children }) {
  const ref = useRef(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="relative group mb-2">
      <button
        onClick={copy}
        title="Copy code"
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-600/70 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <pre ref={ref} className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-zinc-900 text-slate-100 p-3 text-xs font-mono leading-relaxed">{children}</pre>
    </div>
  )
}

const components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-1 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[15px] font-bold mb-1.5 mt-1 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-1 first:mt-0">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  a: ({ href, children }) => (
    <a href={safeUrl(href)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500">{children}</a>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700/60 text-[0.85em] font-mono">{children}</code>
  ),
  pre: CodeBlock,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-indigo-300 dark:border-indigo-700 pl-3 my-2 italic text-slate-500 dark:text-slate-400">{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-slate-200 dark:border-zinc-700" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-slate-200 dark:border-zinc-700 px-2 py-1 font-semibold text-left">{children}</th>,
  td: ({ children }) => <td className="border border-slate-200 dark:border-zinc-700 px-2 py-1">{children}</td>,
  input: (props) => <input {...props} disabled />,
}

export default function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
