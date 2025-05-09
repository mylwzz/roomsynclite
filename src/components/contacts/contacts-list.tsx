// src/components/contacts/contacts-list.tsx
"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  role: string;
  cleanlinessLevel: number;
  sleepTime: string;
  noiseTolerance: number;
  location?: string;
  compatibilityScore?: number;
}

export function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current user profile
        const profileResponse = await fetch("/api/profile");
        const profileData = await profileResponse.json();
        setCurrentUser(profileData);
        
        // Fetch mutual matches
        const contactsResponse = await fetch("/api/contacts");
        const contactsJson     = await contactsResponse.json();
        setContacts(Array.isArray(contactsJson) ? contactsJson : []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded shadow">
        <p className="text-lg">No mutual matches yet!</p>
        <p className="text-gray-500">Keep browsing to find your perfect roommate.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clean</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Noise</th>
            {currentUser?.role === "looking" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.age}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.cleanlinessLevel}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.sleepTime}</td>
              <td className="px-6 py-4 whitespace-nowrap">{contact.noiseTolerance}</td>
              {currentUser?.role === "looking" && (
                <td className="px-6 py-4 whitespace-nowrap">{contact.role === "offering" ? contact.location : "-"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}