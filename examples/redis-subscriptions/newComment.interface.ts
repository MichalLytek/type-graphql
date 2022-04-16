export interface NewCommentPayload {
  recipeId: string
  dateString: string // limitation of Redis payload serialization
  content: string
  nickname?: string
}
