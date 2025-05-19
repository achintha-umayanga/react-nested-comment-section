// Replace the entire file with this implementation that uses fetch to call your backend
import type { Comment, CommentInput } from "../types/comment"

// Set your backend API URL here
const API_URL = "http://localhost:3000/api"

// Helper function for API requests
async function apiRequest<T>(endpoint: string, method = "GET", data?: any): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication if needed
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API request failed with status ${response.status}`)
  }

  return response.json()
}

// Fetch all comments
export const fetchComments = async (): Promise<Comment[]> => {
  try {
    return await apiRequest<Comment[]>("/comments")
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

// Add a new comment
export const addComment = async (input: CommentInput): Promise<Comment> => {
  try {
    return await apiRequest<Comment>("/comments", "POST", input)
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

// Update a comment
export const updateComment = async (id: string, input: { content: string }): Promise<Comment> => {
  try {
    return await apiRequest<Comment>(`/comments/${id}`, "PUT", input)
  } catch (error) {
    console.error("Error updating comment:", error)
    throw error
  }
}

// Delete a comment
export const deleteComment = async (id: string): Promise<void> => {
  try {
    await apiRequest<void>(`/comments/${id}`, "DELETE")
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw error
  }
}

// Update comment likes
export const updateCommentLikes = async (id: string, likes: number): Promise<void> => {
  try {
    await apiRequest<void>(`/comments/${id}/like`, "PUT", { likes })
  } catch (error) {
    console.error("Error updating comment likes:", error)
    throw error
  }
}
