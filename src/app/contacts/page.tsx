// src/app/contacts/page.tsx
import { ContactsList } from "@/components/contacts/contacts-list";

export default function ContactsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
      <p className="mb-6 text-gray-600">
        These are people who have liked you back! You can now see their contact information.
      </p>
      <ContactsList />
    </div>
  );
}