import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Hideo } from 'react-native-textinput-effects';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Fumi } from 'react-native-textinput-effects';
import { API } from './API';
import { Madoka } from 'react-native-textinput-effects';

const Login = ({ navigation }) => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [status, setstatus] = useState()

    const doLogin = () => {
        // kiểm tra hợp lệ dữ liệu
        if (username.length == 0) {
            // thông báo:
            alert("Chưa nhập username")
            return;
        }
        if (password.length == 0) {
            // thông báo:
            alert("Chưa nhập password")
            return;
        }
        // url_check_login
        let url_check_login = API.login + username;

        fetch(url_check_login)
            .then((res) => {
                return res.json();
            })
            .then(async (res_login) => {
                if (res_login.length != 1) {
                    alert("Tài Khoản hoặc mật khẩu sai");
                    return;
                } else {
                    let objU = res_login[0];
                    if (objU.password == password) {
                        try {
                            await AsyncStorage.setItem("login", JSON.stringify(objU));
                            console.log(objU);
                            if (objU.status == 1) {
                                navigation.navigate('Home')
                            } else {
                                navigation.navigate('HomeGuest')
                            }

                        } catch (e) {
                            // saving error
                            console.log(e);
                        }

                    } else {
                        alert("Sai password");
                    }
                }

            })
    }
    const checkIfDisabled = () => {
        if (username.length == 0 || password.length == 0) {

            return true;
        }
        else return false;
    }


    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, marginTop: 50, fontWeight: 'bold', color: '#00FF00' }}>Đăng Nhập</Text>

            <Fumi style={styles.accountin}
                onChangeText={(txt) => { setusername(txt) }}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                iconColor={'#f95a25'}
                label={'Nhập Tài Khoản'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}

            />
            
            <Fumi style={styles.accountin}
                onChangeText={(txt) => { setpassword(txt) }}
                iconClass={FontAwesomeIcon}
                iconName={'lock'}
                iconColor={'#f95a25'}
                label={'Nhập Mật Khẩu'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                secureTextEntry={true}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
            />

            <TouchableOpacity disabled={checkIfDisabled()}
                onPress={() => { doLogin() }}>
                <View style={{ width: 260, height: 30, backgroundColor: '#00FF00', borderRadius: 10, marginTop: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '500', justifyContent: 'center', marginTop: 5, }}>Đăng Nhập</Text>
                </View>
            </TouchableOpacity>

            <View>



            </View>


            <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                <View style={{ width: 260, height: 30, backgroundColor: '#00FF00', borderRadius: 10, marginTop: 30 }}>
                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 15, fontWeight: '500', justifyContent: 'center', marginTop: 5, }}>Đăng Ký</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0099CC',
        alignItems: 'center',


    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 20
    },
    accountin: {

        margin: 10,

    },
    accountin1: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: -50,

    },
    register: {
        marginBottom: 150,
        flexDirection: 'row',
        color: 'white',

    },
    appButton: {
        padding: 12,
    },
    appButtonText: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    appButtonContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: -50,
    },
    disabled: {
        color: 'red'
    },
    buttonWrapper: {
        color: 'blue'
    },
    accountin: {
        margin: 10,
        width: 300,
    },
});