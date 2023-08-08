import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Posting from './components/Posting';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Setting from './components/Setting';
import Comment from './components/Comment';
import HomeG from './components/HomeG';
import { Audio } from 'expo-av';
import AudioSlider from './src/AudioSlider';
import AudioFile from './assets/Hello.mp3';
import AudioFile1 from './assets/audio/MongMotNgayAnhNhoDenEm-HuynhJamesPjnboys-8653756.mp3';
import CommentG from './components/CommentG';
import HomeGuest from './components/HomeGuest';
import Management from './components/Management';

const Tab = createBottomTabNavigator();
const StackASM = createNativeStackNavigator();


const Music = () => {
  return (
    <View style={[styles.StandardContainer, {
      flex: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
      marginTop: 100,
      marginBottom: 5,
    }]}>

      <View style={{
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
      }}>

       
        


      </View>

      <AudioSlider audio={AudioFile}  />
      <View style={{marginTop:30}}/>
      
      <AudioSlider audio={AudioFile1} />
    </View>
  );


}

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='HomeTab' component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name='Music' component={Music}
        options={{
          tabBarLabel: 'Music',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name='Settings' component={Setting}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }} />


    </Tab.Navigator>
  )
}
export function TabNavigator1() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='HomeTabG' component={HomeGuest}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name='Settings' component={Setting}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }} />


    </Tab.Navigator>
  )
}

const App = () => {

  return (
    <NavigationContainer>
      <StackASM.Navigator initialRouteName='Login' screenOptions={{
        headerShown: false
      }}>
        <StackASM.Screen name='Home' component={TabNavigator} options={{ title: 'Trang Chủ' }} />
        <StackASM.Screen name='Posting' component={Posting} options={{ title: 'Posting' }} />
        <StackASM.Screen name='Login' component={Login} options={{ title: 'Đăng Nhập', tabBarVisible: false }} />
        <StackASM.Screen name='Register' component={Register} options={{ title: 'Đăng ký' }} />
        <StackASM.Screen name='Comment' component={Comment} options={{ title: 'Bình Luận' }} />
        <StackASM.Screen name='CommentG' component={CommentG} options={{ title: 'Bình Luận' }} />
        <StackASM.Screen name='HomeGuest' component={TabNavigator1} options={{ title: 'Trang Chủ' }} />
        <StackASM.Screen name='Management' component={Management} options={{ title: 'Người Dùng' }} />
      </StackASM.Navigator>

    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumCover: {
    width: 250,
    height: 250
  },
  controls: {
    flexDirection: 'row'
  },
  control: {
    margin: 20
  },
  vip: {
    margin:10
  }
});
