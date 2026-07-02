import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { memo } from 'react'

function FormField({ name, label, type, icon: Icon, placeholder, value, onChange, onBlur, error, touched, children, inputRef }) {
  const hasError = touched && error
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          id={name}
          ref={inputRef || null}
          type={type}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={!!hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${children ? 'pr-10' : 'pr-4'} py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${hasError ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-700 focus:ring-indigo-500'}`}
        />
        {children}
      </div>
      {hasError && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${name}-error`} className="flex items-center gap-1 mt-1 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </div>
  )
}

export default memo(FormField)
