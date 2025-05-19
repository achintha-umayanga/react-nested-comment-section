"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import type { Comment } from "../types/comment"
import { addComment, deleteComment, updateComment, updateCommentLikes } from "../lib/api"
import { MessageSquare, ThumbsUp, Trash2, Edit, X, Check } from "lucide-react"

interface CommentItemProps {
  comment: Comment
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  level: number
}

const CommentItem = ({ comment, comments, setComments, level }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReply = async (content: string) => {
    try {
      const newComment = await addComment({
        content,
        parentId: comment.id,
      })

      setComments((prevComments) => [...prevComments, newComment])
      setIsReplying(false)
      return true
    } catch (err) {
      setError("Failed to add reply")
      console.error(err)
      return false
    }
  }

  const handleEdit = async () => {
    try {
      setError(null)
      const updatedComment = await updateComment(comment.id, {
        content: editContent,
      })

      setComments((prevComments) => prevComments.map((c) => (c.id === comment.id ? updatedComment : c)))

      setIsEditing(false)
    } catch (err) {
      setError("Failed to update comment")
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await deleteComment(comment.id)

      // Remove this comment and all its replies recursively
      const removeCommentAndReplies = (commentId: string, commentsArray: Comment[]): Comment[] => {
        // Get all direct replies to this comment
        const replies = commentsArray.filter((c) => c.parentId === commentId)

        // For each reply, recursively remove it and its replies
        let filteredComments = commentsArray
        for (const reply of replies) {
          filteredComments = removeCommentAndReplies(reply.id, filteredComments)
        }

        // Remove the comment itself
        return filteredComments.filter((c) => c.id !== commentId)
      }

      setComments((prevComments) => removeCommentAndReplies(comment.id, prevComments))
    } catch (err) {
      setError("Failed to delete comment")
      console.error(err)
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    try {
      setIsLiking(true)
      setError(null)
      const newLikes = comment.likes + 1
      await updateCommentLikes(comment.id, newLikes)
      setComments((prevComments) => prevComments.map((c) => (c.id === comment.id ? { ...c, likes: newLikes } : c)))
    } catch (err) {
      setError("Failed to update likes")
      console.error(err)
    } finally {
      setIsLiking(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  return (
    <div className="comment-item">
      <div className="flex space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.user?.image || "/placeholder-user.jpg"} alt={comment.user?.name || "User"} />
          <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{comment.user?.name || "Anonymous"}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>

            {!isDeleting && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 px-2">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 px-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="h-8 px-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows={3}
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{comment.content}</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!isEditing && !isDeleting && (
            <div className="flex space-x-4 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{comment.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Reply</span>
              </Button>
            </div>
          )}

          {isReplying && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReply}
                autoFocus
                placeholder="Write a reply..."
                buttonText="Reply"
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Render nested comments */}
          <CommentList comments={comments} setComments={setComments} parentId={comment.id} level={level + 1} />
        </div>
      </div>
    </div>
  )
}

export default CommentItem
