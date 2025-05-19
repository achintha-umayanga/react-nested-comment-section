import type React from "react"
import CommentItem from "./CommentItem"
import type { Comment } from "../types/comment"

interface CommentListProps {
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  parentId?: string | null
  level?: number
}

const CommentList = ({ comments, setComments, parentId = null, level = 0 }: CommentListProps) => {
  // Filter comments that belong to this level
  const filteredComments = comments.filter((comment) => comment.parentId === parentId)

  if (filteredComments.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${level > 0 ? "ml-6 pl-4 border-l border-gray-200 dark:border-gray-700" : ""}`}>
      {filteredComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} comments={comments} setComments={setComments} level={level} />
      ))}
    </div>
  )
}

export default CommentList
