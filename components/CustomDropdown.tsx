
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  label: string;
  placeholder: string;
  items: DropdownItem[];
  value: string | number | null;
  onValueChange: (value: string | number) => void;
  disabled?: boolean;
}

export function CustomDropdown({
  label,
  placeholder,
  items,
  value,
  onValueChange,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          commonStyles.dropdown,
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={
            selectedItem
              ? commonStyles.dropdownText
              : commonStyles.dropdownPlaceholder
          }
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <IconSymbol
          ios_icon_name="chevron.down"
          android_material_icon_name="arrow_drop_down"
          size={24}
          color={disabled ? colors.textSecondary : colors.text}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    item.value === value && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item.value === value && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.background,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedItemText: {
    color: colors.accent,
    fontWeight: '600',
  },
});
