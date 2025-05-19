export interface User {
  id: string
  name: string
  image?: string
}

export interface Comment {
  id: string
  content: string
  parentId: string | null
  user: User
  createdAt: string
  updatedAt: string
  likes: number
}

export interface CommentInput {
  content: string
  parentId: string | null
}
