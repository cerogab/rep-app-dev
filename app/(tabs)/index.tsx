import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useContacts, Contact, ContactCategory } from '@/lib/contacts-context';
import { ContactCard } from '@/components/ContactCard';
import { FilterChips } from '@/components/FilterChips';

type FilterOption = 'All' | 'New' | 'Contacted' | 'Qualified';

export default function ReceiverPage() {
  const insets = useSafeAreaInsets();
  const { contacts, isLoading, deleteContact } = useContacts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');

  const filteredContacts = useMemo(() => {
    let result = contacts;
    if (filter !== 'All') {
      result = result.filter((c) => c.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }
    return result;
  }, [contacts, filter, search]);

  const handleCall = (contact: Contact) => {
    const phoneUrl = `tel:${contact.phone.replace(/[^+\d]/g, '')}`;
    Linking.openURL(phoneUrl).catch(() => {});
  };

  const handleEmail = (contact: Contact) => {
    Linking.openURL(`mailto:${contact.email}`).catch(() => {});
  };

  const handleContactPress = (contact: Contact) => {
    router.push({ pathname: '/contact-detail', params: { id: contact.id } });
  };

  const handleAddNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-contact');
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ContactCard
      contact={item}
      onPress={() => handleContactPress(item)}
      onCall={() => handleCall(item)}
      onEmail={() => handleEmail(item)}
    />
  );

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.headerRight}>
          <Text style={styles.countBadge}>{contacts.length}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterChips selected={filter} onSelect={setFilter} />
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No contacts found</Text>
          <Text style={styles.emptySubtitle}>
            {search ? 'Try a different search term' : 'Add your first contact to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filteredContacts.length > 0}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + (Platform.OS === 'web' ? 100 : 70) },
          pressed && styles.fabPressed,
        ]}
        onPress={handleAddNew}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countBadge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  filterContainer: {
    marginBottom: 12,
  },
  list: {
    paddingTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
});
