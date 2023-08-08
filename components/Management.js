import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, FlatList, Image, Share, Modal, ScrollView, RefreshControl, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { API } from './API';
var dem = 0;
const Management = ({ navigation }) => {
    const [reloading, setreloading] = useState(false)
    const [counter, setcounter] = useState(dem)
    const reloadData = React.useCallback(() => {
        // xử lý công việc load lại dữ liệu đổ vào danh sách
        setreloading(true); // set trạng thái bắt đầu reload
        dem++;
        getListUsers();
        setcounter(dem);
        // mô phỏng đợi reload, nếu là reload từ server thật thì không cần viết lệnh dưới
        setTimeout(() => {
            setreloading(false); // sau 2s thì đổi trạng thái không rload nữa
        }, 2000);


    });

    const [data, setdata] = useState([]);

    const [id, setid] = useState();
    const [title, settitle] = useState();
    const [content, setcontent] = useState();
    const [img_source, setimg_source] = useState(null)
    const [username, setusername] = useState()
    const [image, setimage] = useState()
    const [img_base64, setiimg_base64] = useState(null)
    const [userId, setuserId] = useState()
    const [isLoading, setisLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setstatus] = useState()

    useEffect(() => {
        const getData = async () => {

            try {
                const value = await AsyncStorage.getItem("login")
                
                if (value !== null) {
                    let parsed = JSON.parse(value)
                    setuserId(parsed.id)
                    setusername(parsed.username)
                    setimage(parsed.image)
                    setstatus(parsed.status)

                }
            } catch (e) {
                // error reading value
                console.log(e);
            }

        }
        getData();
        getListUsers();
        return () => {

        }
    }, [])


    function UpdateUser() {
        let item = {
            id: id,
            title: title, content: content, image: img_base64, usersId: userId
        }
        console.warn("item", item)
        fetch(API.getlistuser + item.id, {
            method: 'PUT',
            headers: { // config data
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

    const getListUsers = () => {
        fetch(API.getlistuser)
            .then((data_res) => {
                // convert to json
                return data_res.json();
            })
            .then((data_json) => {
                // log
                setdata(data_json);
                
            })
            .catch((err) => {
                // nếu xảy ra lỗi thì log lỗi
                console.log(err);
            }).finally(() => setisLoading(false));

    }

    renderItem = ({ item, index }) => {



        const checkIfDisabled = () => {
            if (item.status == 1) {

                return true;
            }
            else return false;
        }

        const DialogXoa = () => {
            // Alert.alert('Tiêu đề','Nội dung thông báo',mảng_nút_bấm, option);
            Alert.alert('Xóa?', 'Bạn có muốn xóa ?',
                [
                    {
                        text: "Xóa",
                        onPress: () => {
                            XoaItem();
                        }
                    },
                    {
                        text: 'Trở lại', onPress: () => { console.log("No"); }
                    }
                ], {
                cancelable: true,
                onDismiss: () => {
                    // khi người dùng bấm ra ngoài hộp thoại hoặc nút back
                    console.log("Dialog bị tắt");
                }
            });
        }


        const XoaItem = () => {
            // if(! confirm ('Có đồng ý xóa không?') )
            //     return; 


            fetch(API.deleteuser + item.id, {
                method: 'DELETE', // POST: Thêm mới, PUT: Sửa, DELETE: xóa, GET: lấy thông tin
                headers: { // Định dạng dữ liệu gửi đi
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    
                    getListUsers()
                    // nếu status là 200 thì là xóa thành công
                    if (response.status == 200)
                        alert("Xóa thành công");

                })
                .catch((err) => {  // catch để bắt lỗi ngoại lệ
                    console.log(err);
                });
        }
        function SelectArticle() {
            setid(item.id);
            settitle(item.title);
            setcontent(item.content);
        }

        return (
            <View style={{ margin: 10, backgroundColor: 'white', elevation: 5, borderRadius: 8, padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>

                    <Image style={{
                        width: 40, height: 40, marginRight: 5, marginTop: 3,
                        alignItems: 'center', borderRadius: 60, borderWidth: 1, borderColor: "black", backgroundColor: 'white'
                    }} source={{
                        uri: item.image,
                    }} ></Image>
                    <Text style={{
                        marginBottom: 10,
                        fontWeight: 'bold',
                        color: '#d63341',
                        fontSize: 15,
                        marginLeft: 8,
                        marginTop: 2,
                        flex: 8

                    }} > {item.username}</Text>

                    <TouchableOpacity style={{ flex: 1 }} disabled={checkIfDisabled()} onPress={DialogXoa}>
                        <MaterialCommunityIcons
                            name='delete'
                            size={18}
                            color={'#FF0033'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { SelectArticle(item.id); setModalVisible(true) }}>
                        <AntDesign
                            name='setting'
                            size={18}
                            color={'black'}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{ alignItems: 'center', width: '100%', textAlign: 'center', marginBottom: 8, fontSize: 18, fontWeight: '600' }}>{item.title}</Text>

                <View style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>
                    <Text style={{ marginBottom: 5 }} > {item.fullname}</Text>

                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#d6d6d6' }}>
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, marginBottom: 10, marginTop: 10 }}>
                </View>

            </View>
        )

    }


    StatusBar.setHidden(true)
    return (
        <View style={styles.container}>

            <Text style={styles.status}>MẠNG XÃ HỘI</Text>
            <View style={styles.function}>
                <View style={{ width: '100%', backgroundColor: 'white', marginBottom: 5, borderBottomColor: '#d6d6d6', borderBottomWidth: 0.5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 10, flexDirection: 'row' }}>
                            <Image style={{
                                width: 30, height: 30, marginRight: 5, marginTop: 3, marginLeft: 5,
                                alignItems: 'center', borderRadius: 60, borderWidth: 1, borderColor: "black", backgroundColor: 'white'


                            }} source={{
                                uri: image,
                            }} ></Image>
                            <Text style={{ fontSize: 15, marginTop: 10, color: '#3a80a6', fontWeight: '400' }}>Hello, {username}!</Text>
                        </View>
                        {/* <TouchableOpacity style={{ flex: 2, marginTop: 4 }} onPress={() => { navigation.navigate('Posting') }}>
                            <Icon name={'add-circle-outline'}
                                size={30}
                                color={'blue'}>

                            </Icon>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
            <View style={{ width: "100%", flex: 1 }}>
                {isLoading ? <ActivityIndicator /> : (<FlatList refreshControl={
                    <RefreshControl refreshing={reloading}
                        onRefresh={reloadData} />}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => `key-${item.id}`}>
                </FlatList>
                )}

            </View>
            <View style={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,

                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
            }}>

            </View>

        </View>
    )
}
export default Management;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    status: {
        width: '100%',
        backgroundColor: 'white',
        height: 30,
        color: 'blue',
        fontWeight: 'bold',
        alignContent: 'center',
        paddingTop: 10,
        textAlign: 'center'
    },
    appButton: {
        borderWidth: 1,
        borderColor: 'white'
    },
    appButtonText: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    appButtonContainer: {

        width: 160,


    },
    function: {
        flexDirection: 'row',

    },
    content: {
        width: '100%',
        height: '75%',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
        bottom: 0,
        color: 'white'
    }, centeredView: {
        // backgroundColor: rgba(255, 0, 0, 0.2),
    }
});