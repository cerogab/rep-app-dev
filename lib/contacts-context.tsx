import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ContactCategory = 'New' | 'Contacted' | 'Qualified' | 'Unknown';
export type MessageFrequency = 'Weekly' | 'Biweekly' | 'Monthly';

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  category: ContactCategory;
  frequency: MessageFrequency;
  notes: string;
  createdAt: number;
  messageSent?: boolean;
}

interface ContactsContextValue {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ContactsContext = createContext<ContactsContextValue | null>(null);

const STORAGE_KEY = '@bram_contacts';

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        const sampleContacts: Contact[] = [
          {
            id: 'sample1',
            fullName: 'Sarah Johnson',
            email: 'sarah@techvision.com',
            phone: '+1 (555) 234-5678',
            company: 'TechVision Inc',
            category: 'New',
            frequency: 'Monthly',
            notes: 'Interested in enterprise plan',
            createdAt: Date.now() - 86400000 * 3,
          },
          {
            id: 'sample2',
            fullName: 'Michael Chen',
            email: 'michael@dataflow.io',
            phone: '+1 (555) 345-6789',
            company: 'DataFlow Systems',
            category: 'Contacted',
            frequency: 'Biweekly',
            notes: 'Follow up next week',
            createdAt: Date.now() - 86400000 * 7,
          },
          {
            id: 'sample3',
            fullName: 'Emily Rodriguez',
            email: 'emily@greenleaf.com',
            phone: '+1 (555) 456-7890',
            company: 'GreenLeaf Marketing',
            category: 'New',
            frequency: 'Weekly',
            notes: '',
            createdAt: Date.now() - 86400000 * 2,
          },
          {
            id: 'sample4',
            fullName: 'James Wilson',
            email: 'james@atlas.co',
            phone: '+1 (555) 567-8901',
            company: 'Atlas Consulting',
            category: 'Qualified',
            frequency: 'Monthly',
            notes: 'Ready for proposal',
            createdAt: Date.now() - 86400000 * 14,
          },
        ];
        setContacts(sampleContacts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContacts = async (updated: Contact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updated = [newContact, ...contacts];
    setContacts(updated);
    await saveContacts(updated);
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setContacts(updated);
    await saveContacts(updated);
  };

  const deleteContact = async (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    await saveContacts(updated);
  };

  const value = useMemo(
    () => ({ contacts, addContact, updateContact, deleteContact, isLoading }),
    [contacts, isLoading],
  );

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}
