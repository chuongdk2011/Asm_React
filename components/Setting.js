import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, StatusBar, Image, Modal, Alert, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState, useEffect } from 'react'

import styles from '../styles';
import { API } from './API';

const Setting = ({navigation}) => {
    const [data, setdata] = useState([]);
    const [id, setid] = useState();
    const [userid, setuserid] = useState()
    const [username, setusername] = useState()
    const [fullname, setfullname] = useState()
    const [password, setpassword] = useState()
    const [repassword, setrepassword] = useState()
    const [email, setemail] = useState()
    const [phonenumber, setphonenumber] = useState()
    const [status, setstatus] = useState()
    const [img_source, setimg_source] = useState(null)
    const [img_base64, setiimg_base64] = useState(null)
    const [image, setimage] = useState()
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        const getData = async () => {

            try {
                const value = await AsyncStorage.getItem("login")
               
                if (value !== null) {
                    let parsed = JSON.parse(value)
                   
                    setid(parsed.id)
                    setusername(parsed.username)
                    setpassword(parsed.password)
                    setrepassword(parsed.repassword)
                    setphonenumber(parsed.phonenumber)
                    setemail(parsed.email)
                    setfullname(parsed.fullname)
                    setstatus(parsed.status)
                }
            } catch (e) {
                // error reading value
                console.log(e);
            }
        }
        getData();

    }, [])
    const pickImage = async () => {
        // Đọc ảnh từ thư viện thì không cần khai báo quyền
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3], // khung view cắt ảnh 
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setimg_source(result.assets[0].uri);
            // chuyển ảnh thành base64 để upload lên json
            let _uri = result.assets[0].uri;  // địa chỉ file ảnh đã chọn
            let file_ext = _uri.substring(_uri.lastIndexOf('.') + 1); // lấy đuôi file


            FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' })
                .then((res) => {
                    // phải nối chuỗi với tiền tố data image
                    setiimg_base64("data:image/" + file_ext + ";base64," + res);
                    console.log(img_base64);
                });

        }

    }
    function UpdateAvatar() {
        let item = {
            id: id,
            username:username,
            fullname:fullname,
            password:password,
            repassword:repassword,
            phonenumber:phonenumber,
            email:email,
            status:status,
            image: img_base64
        }
        console.warn("item", item)
        fetch(API.deleteuser + item.id, {
            method: 'PUT',
            headers: { // Định dạng dữ liệu gửi đi
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        }).then((result) => {
            result.json().then((resp) => {
                console.warn(resp)
            })
        })
    }
    return (
        <View style={{ flex: 1 }} >
            <View style={{ backgroundColor: 'white', width: '100%', height: 60, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#8e8e8e', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: '600' }}>Settings</Text>

            </View>
            <View style={{elevation:5,marginBottom:10,backgroundColor:'white',height:30,width:'80%',alignContent:'center',alignItems:'center',alignSelf:'center',borderRadius:8}}>
                <View style={{alignItems:'center',alignContent:'center',alignSelf:'center',marginTop:3}}>
            <TouchableOpacity style={st.function1} onPress={() => { setModalVisible(true) }}>
                <Icon
                    name="camera-outline"
                    size={20}
                    style={{ marginRight: 5 }}>

                </Icon>
                <Text style={{ fontSize: 16,alignItems:'center',textAlign:'center',alignContent:'center' }}>Cập nhật ảnh đại diện</Text>
            </TouchableOpacity>
            </View>
            
            </View>
            <View style={{elevation:5,marginBottom:10,backgroundColor:'white',height:30,width:'80%',alignContent:'center',alignItems:'center',alignSelf:'center',borderRadius:8}}>
                <View style={{alignItems:'center',alignContent:'center',alignSelf:'center',marginTop:3}}>
            <TouchableOpacity style={st.function1} onPress={() => {navigation.navigate('Management') }}>
                <Icon
                    name="log-out-outline"
                    size={20}
                    style={{ marginRight: 5 }}>

                </Icon>
                <Text style={{ fontSize: 16,alignItems:'center',textAlign:'center',alignContent:'center' }}>Quản lý người dùng</Text>
            </TouchableOpacity>
            </View>
            
            </View>
            <View style={{elevation:5,marginBottom:10,backgroundColor:'white',height:30,width:'80%',alignContent:'center',alignItems:'center',alignSelf:'center',borderRadius:8}}>
                <View style={{alignItems:'center',alignContent:'center',alignSelf:'center',marginTop:3}}>
            <TouchableOpacity style={st.function1} onPress={() => {navigation.navigate('Login') }}>
                <Icon
                    name="log-out-outline"
                    size={20}
                    style={{ marginRight: 5 }}>

                </Icon>
                <Text style={{ fontSize: 16,alignItems:'center',textAlign:'center',alignContent:'center' }}>Đăng Xuất</Text>
            </TouchableOpacity>
            </View>
            
            </View>

            <View style={st.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={st.centeredView}>
                        <View style={{ Height: 600, backgroundColor: 'white', elevation: 10, margin: 10, borderRadius: 10, width: 300 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>CHỌN ẢNH ĐẠI DIỆN</Text>
                            <View>
                                <TouchableOpacity style={st.button}>
                                    <Icon
                                        name="add-circle"
                                        onPress={pickImage}
                                        size={40}

                                    >
                                    </Icon>
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', alignContent: 'center' }}>
                                    {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: 140, height: 140, borderRadius: 60 }} />}
                                </View>
                               </View>
                            
                            <View style={{ flexDirection: 'row', marginTop: 15, borderTopWidth: 0.5, marginBottom: 5 }}>
                                <TouchableOpacity onPress={UpdateAvatar} style={{ width: 80, height: 30, backgroundColor: '#1e55a8', borderRadius: 5, marginLeft: 45, marginTop: 8 }} >
                                    <Text style={st.textStyle}>Thay</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ width: 80, height: 30, backgroundColor: '#1e55a8', borderRadius: 5, marginLeft: 40, marginTop: 8 }}>


                                    <Text style={st.textStyle}>Quay Lại</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </View>

    )
}
export default Setting;

const st = StyleSheet.create({
    function1: {
        marginBottom: 5,
        flexDirection: 'row'



    },
    button: {
        width: 160,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        marginBottom: 10
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
        bottom: 0,
        color: 'white'
    },
    centeredView: {
        flex: 1,
        height: 400,
        justifyContent:'center',
        alignItems:'center'
    }
});