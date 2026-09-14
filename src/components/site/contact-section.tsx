"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/messages";
import type { Profile } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
    </Button>
  );
}

export function ContactSection({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(sendMessage, { error: undefined });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Message sent — I'll get back to you soon.");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="glass grid gap-10 rounded-[var(--radius-lg)] p-8 sm:p-12 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl font-medium sm:text-4xl">Let&apos;s talk</h2>
              <p className="mt-3 text-muted-foreground">
                Have a project in mind or just want to say hello? My inbox is open.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-accent"
                >
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
              )}
              {profile.location && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </span>
              )}
            </div>
          </div>

          <form ref={formRef} action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="What's on your mind?" rows={4} required />
            </div>
            <SubmitButton />
          </form>
        </div>
      </Reveal>
    </section>
  );
}
