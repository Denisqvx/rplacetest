import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AspectGrid from './boxgrid';

export default function App() {

  return (
    <View style={styles.container}>
      <View style={{height:'50%',width:'50%'}}>
        <AspectGrid/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
