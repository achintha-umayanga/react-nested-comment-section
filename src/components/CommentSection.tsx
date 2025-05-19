"use client"

import { useState, useEffect } from "react"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"
import type { Comment } from "../types/comment"
import { fetchComments, addComment } from "../lib/api"

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchComments()
        setComments(data)
      } catch (err) {
        setError("Failed to load comments. Please check your backend connection.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [])

  const handleAddComment = async (content: string) => {
    try {
      setError(null)
      const newComment = await addComment({
        content,
        parentId: null,
      })

      setComments((prevComments) => [newComment, ...prevComments])
      return true
    } catch (err) {
      setError("Failed to add comment")
      console.error(err)
      return false
    }
  }

  return (
    <div className="space-y-6">
      <CommentForm onSubmit={handleAddComment} />

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 my-4">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
            Make sure your backend server is running at the correct URL
          </p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <CommentList comments={comments} setComments={setComments} />
      )}
    </div>
  )
}

export default CommentSection
