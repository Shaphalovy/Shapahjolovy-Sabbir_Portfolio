import { MessagesManager } from "@/components/admin/messages-manager";
import { getMessages } from "@/lib/queries";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Messages</h1>
        <p className="mt-1 text-muted-foreground">Submissions from your contact form.</p>
      </div>
      <MessagesManager messages={messages} />
    </div>
  );
}
