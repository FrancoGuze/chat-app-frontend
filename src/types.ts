export type MessageData = {
  from: string;
  id:string
  message: string;
  to?: string;
  status:( "sent" | "delivered" | "seen");
};
