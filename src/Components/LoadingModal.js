import React from 'react';
import {Modal, View, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingModal = ({isLoading}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});

export default LoadingModal;
