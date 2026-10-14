import { customAlphabet } from "nanoid";

const nanoidLower = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

export const userMessageId = () => "message_" + nanoidLower();
export const taskId = () => "task_" + nanoidLower();

export const sellerId = () => "seller_"+ nanoidLower()

export const customerId = () => "customer_"+ nanoidLower()