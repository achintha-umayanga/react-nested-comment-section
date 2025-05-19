"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send } from "lucide-react"
import TypingIndicator from "./TypingIndicator"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>
  onCancel?: () => void
  autoFocus?: boolean
  placeholder?: string
  buttonText?: string
}

const CommentForm = ({
  onSubmit,
  onCancel,
  autoFocus = false,
  placeholder = "Add a comment...",
  buttonText = "Comment",
}: CommentFormProps) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const success = await onSubmit(content)

      if (success) {
        setContent("")
      }
    } catch (err) {
      setError("Failed to submit comment")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] resize-none pr-12"
          disabled={isSubmitting}
        />
        {isSubmitting && (
          <div className="absolute bottom-3 right-3">
            <TypingIndicator />
          </div>
        )}
        {!isSubmitting && content.trim() && (
          <Button type="submit" size="icon" className="absolute bottom-3 right-3 h-8 w-8">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {buttonText}
        </Button>
      </div>
    </form>
  )
}

export default CommentForm
