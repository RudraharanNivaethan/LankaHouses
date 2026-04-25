import { z } from 'zod'

export const createInquirySchema = z.object({
  title:   z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be at most 5000 characters'),
})

export const adminReplySchema = z.object({
  adminReply: z.string().min(1, 'Reply is required').max(5000, 'Reply must be at most 5000 characters'),
})

export type CreateInquirySchema = z.infer<typeof createInquirySchema>
export type AdminReplySchema    = z.infer<typeof adminReplySchema>
