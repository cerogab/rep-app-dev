import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useContacts, Contact, MessageFrequency } from '@/lib/contacts-context';
import { ContactCard } from '@/components/ContactCard';
import { FilterChips } from '@/components/FilterChips';

type FilterOption = 'All' | 'New' | 'Qualified';

export default function ReceiverPage() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { contacts, isLoading, updateContact } = useContacts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

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

  const handleContactPress = (contact: Contact) => {
    router.push({ pathname: '/contact-detail', params: { id: contact.id } });
  };

  const handleFrequencyChange = (contact: Contact, frequency: MessageFrequency) => {
    updateContact(contact.id, { frequency });
  };

  const handleAddNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-contact');
  };

  const handleSendMessage = (contact: Contact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/send-message', params: { id: contact.id } });
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ContactCard
      contact={item}
      onPress={() => handleContactPress(item)}
      onFrequencyChange={(freq) => handleFrequencyChange(item, freq)}
      onSendMessage={() => handleSendMessage(item)}
    />
  );

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + webTopInset }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.primary }]}>{greeting}</Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }, pressed && styles.addBtnPressed]}
            onPress={handleAddNew}
            hitSlop={8}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.white, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterChips selected={filter} onSelect={setFilter} />
        <Text style={[styles.countBadge, { backgroundColor: colors.primary }]}>{contacts.length}</Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No contacts found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {search ? 'Try a different search term' : 'Add your first contact to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filteredContacts.length > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
  countBadge: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
