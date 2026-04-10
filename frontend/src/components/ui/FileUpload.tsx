import { useRef, useState, useCallback, useEffect } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface FileUploadProps {
  label: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
  files: File[]
  onFilesChange: (files: File[]) => void
  error?: string
  hint?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  label,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 5,
  files,
  onFilesChange,
  error,
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map())

  useEffect(() => {
    const urls = new Map<number, string>()
    files.forEach((file, i) => {
      if (file.type.startsWith('image/')) {
        urls.set(i, URL.createObjectURL(file))
      }
    })
    setPreviewUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [files])

  const displayError = error ?? localError

  const validateAndAdd = useCallback(
    (incoming: File[]) => {
      setLocalError(null)

      const maxBytes = maxSizeMB * 1024 * 1024
      const oversized = incoming.find((f) => f.size > maxBytes)
      if (oversized) {
        setLocalError(`"${oversized.name}" exceeds ${maxSizeMB}MB limit.`)
        return
      }

      if (accept) {
        const allowed = accept.split(',').map((t) => t.trim())
        const invalid = incoming.find((f) => !allowed.includes(f.type))
        if (invalid) {
          setLocalError(`"${invalid.name}" is not an accepted file type.`)
          return
        }
      }

      const merged = [...files, ...incoming]
      if (merged.length > maxFiles) {
        setLocalError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed.`)
        return
      }

      onFilesChange(merged)
    },
    [files, maxFiles, maxSizeMB, accept, onFilesChange],
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = Array.from(e.dataTransfer.files)
      if (dropped.length > 0) validateAndAdd(dropped)
    },
    [validateAndAdd],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? [])
      if (selected.length > 0) validateAndAdd(selected)
      if (inputRef.current) inputRef.current.value = ''
    },
    [validateAndAdd],
  )

  const removeFile = useCallback(
    (index: number) => {
      setLocalError(null)
      onFilesChange(files.filter((_, i) => i !== index))
    },
    [files, onFilesChange],
  )

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragOver
            ? 'border-brand bg-brand/5'
            : displayError
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100',
        ].join(' ')}
      >
        <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-brand">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-400">
          Max {maxSizeMB}MB per file{multiple ? `, up to ${maxFiles} files` : ''}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-label={label}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="group relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              {previewUrls.has(index) && (
                <img
                  src={previewUrls.get(index)}
                  alt={file.name}
                  className="h-10 w-10 rounded object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate max-w-[140px] text-xs font-medium text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                className="ml-1 rounded p-0.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {hint && !displayError && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}

      {displayError && (
        <p role="alert" className="flex items-center gap-1 text-xs text-red-600">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  )
}
