import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';

export const global_storage = new MMKVLoader().initialize();

export const Delivery_DAYS = [
  {id: 'Monday', name: 'Monday'},
  {id: 'Tuesday', name: 'Tuesday'},
  {id: 'Wednesday', name: 'Wednesday'},
  {id: 'Thursday', name: 'Thursday'},
  {id: 'Friday', name: 'Friday'},
  {id: 'Saturday', name: 'Saturday'},
  {id: 'Sunday', name: 'Sunday'},
];
