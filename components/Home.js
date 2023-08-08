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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { API } from './API';
var dem = 0;
const Home = ({ navigation }) => {
    const [reloading, setreloading] = useState(false)
    const [counter, setcounter] = useState(dem)
    const reloadData = React.useCallback(() => {
        // xử lý công việc load lại dữ liệu đổ vào danh sách
        setreloading(true); // set trạng thái bắt đầu reload
        dem++;
        getListArticle();
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
    const customshare = () => {
        const shareOptions = {
            message: 'Test'
        }
        try {
            const ShareResponse = Share.open(shareOptions);
        } catch (error) {
            console.log();
        }
    }
    useEffect(() => {
        const getData = async () => {

            try {
                const value = await AsyncStorage.getItem("login")
                
                if (value !== null) {
                    let parsed = JSON.parse(value)
                    setuserId(parsed.id)
                    setusername(parsed.username)
                    setimage(parsed.image)

                }
            } catch (e) {
                // error reading value
                console.log(e);
            }

        }
        getData();
        getListArticle();
        return () => {

        }
    }, [])


    const pickImage = async () => {

        // Đọc ảnh từ thư viện thì không cần khai báo quyền
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3], // khung view cắt ảnh 
            quality: 1,
        });


        


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
                    // upload ảnh lên api thì dùng PUT có thể viết ở đây
                });


        }


    }
    function UpdateArticle() {
        let item = {
            id: id,
            title: title, content: content, image: img_base64, usersId: userId
        }
        console.warn("item", item)
        fetch(API.updatearticleadmin + item.id, {
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

    const getListArticle = () => {
        fetch(API.getlistarticle)
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






        const onShare = async () => {
            try {
                const result = await Share.share({
                    title: item.title,
                    message: item.content,
                    url: item.image,



                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        };
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
           

            fetch(API.deletearticleadmin + item.id, {
                method: 'DELETE', // POST: Thêm mới, PUT: Sửa, DELETE: xóa, GET: lấy thông tin
                headers: { // Định dạng dữ liệu gửi đi
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    
                    getListArticle()
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
                        uri: item.users.image,
                    }} ></Image>
                    <Text style={{
                        marginBottom: 10,
                        fontWeight: 'bold',
                        color: 'green',
                        fontSize: 15,
                        marginLeft: 8,
                        marginTop: 2,
                        flex: 8

                    }} > {item.users.username}</Text>

                    <TouchableOpacity style={{ flex: 1 }} onPress={DialogXoa}>
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
                    <Text style={{ marginBottom: 5 }} > {item.content}</Text>


                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#d6d6d6' }}>
                    <Image style={{
                        width: 270, height: 220,
                        margin: 5
                    }} source={{
                        uri: item.image,
                    }} ></Image>
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, marginBottom: 10, marginTop: 10 }}>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        borderRadius={0}
                        name={'chatbox-outline'}
                        iconColor={''}
                        onPress={() => { navigation.navigate('Comment', { id: item.id }) }}
                        size={30}
                        style={styles.appButton}
                    >
                    </Icon>

                    <FontAwesome name='share' size={30} color='#555555' onPress={onShare} />
                </View>




            </View>
        )

    }




    StatusBar.setHidden(true)
    return (
        <View style={styles.container}>

            <Text style={styles.status}>Trang Chủ</Text>
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
                        <TouchableOpacity style={{ flex: 2, marginTop: 4 }} onPress={() => { navigation.navigate('Posting') }}>
                            <Icon name={'add-circle-outline'}
                                size={30}
                                color={'black'}>
                            </Icon>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
            <View style={{ width: "100%", flex: 1 }}>
                {isLoading ? <ActivityIndicator /> : (<FlatList refreshControl={
                    <RefreshControl refreshing={reloading}
                        onRefresh={reloadData} />}

                    data={data.reverse()}
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
                <Modal

                    visible={modalVisible}
                    onRequestClose={() => {

                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.khungDialog}>
                        <Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>Sửa Bài Viết</Text>

                        <TextInput placeholder='Nhập Tiêu Đề' placeholderTextColor={'black'} style={styles.tip} onChangeText={(txt) => { settitle(txt) }} />

                        <View style={{ width: '100%', borderWidth: 1 }}>

                            <TextInput placeholder='Nhập Nội Dung' style={{ width: '100%', padding: 5 }} onChangeText={(txt) => { setcontent(txt) }} />
                            <AntDesign name='picture' size={35} color='#555555' style={{ alignSelf: 'flex-end' }} onPress={pickImage} />
                            {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: 200, height: 200, alignSelf: 'center', margin: 15 }} />}
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ margin: 10 }}>
                                <Button title='Sửa' onPress={() => { UpdateArticle() }}></Button>
                            </View>
                            <View style={{ margin: 10 }}>
                                <Button title='Trở Về' onPress={() => { setModalVisible(!modalVisible) }}></Button>
                            </View>
                        </View>


                    </View>
                </Modal>
            </View>



        </View>
    )
}
export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',


    },
    status: {
        width: '100%',
        backgroundColor: 'white',
        height: 40,
        color: 'green',
        fontWeight: 'bold',
        alignContent: 'center',
        paddingTop: 10,
        textAlign: 'center',
        fontSize:20,
    },
    appButton: {
        borderWidth: 1,
        borderColor: 'white',
        marginRight: 15
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
    },
    tip: {
        borderWidth: 1,
        margin: 10,
        width: '100%',
        padding: 5

    },
    khungDialog: {
        margin: 30,
        backgroundColor: "white",
        flex: 1,
        alignItems: 'center',


    },
});