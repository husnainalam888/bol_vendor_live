import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React from 'react';
import LoadingModal from './LoadingModal';
import {HeaderWithBack} from '../Screens/OrderDetails';

const Container = ({
  children,
  style,
  isLoading = false,
  headerTitle = false,
  onRefresh,
  hideBack = false,
}: any) => {
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      {headerTitle && (
        <HeaderWithBack title={headerTitle} hideBack={hideBack} />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              if (onRefresh) onRefresh();
            }}
          />
        }
        contentContainerStyle={style}>
        <View style={[styles.container, style]}>{children}</View>
      </ScrollView>
      <LoadingModal isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
