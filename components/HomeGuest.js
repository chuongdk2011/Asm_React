import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity,Pressable, FlatList, Image, Modal, ScrollView, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { API } from './API';
var dem = 0;
const HomeGuest = ({ navigation }) => {
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
    const [liked, setLiked] = useState(false);

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

    const getListArticle = () => {
        fetch(API.getlistarticle)
            .then((data_res) => {
                // convert to json
                return data_res.json();
            })
            .then((data_json) => {
                // log
                setdata(data_json);
                console.log(data_json);
            })
            .catch((err) => {
                // nếu xảy ra lỗi thì log lỗi
                console.log(err);
            }).finally(() => setisLoading(false));

    }
    renderItem = ({ item, index }) => {
        
    
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
                        color: '#d63341',
                        fontSize: 15,
                        marginLeft: 8,
                        marginTop: 2,
                        flex: 8

                    }} > {item.users.username}</Text>

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
                    <Pressable onPress={() => setLiked((isLiked) => !isLiked)}>
                        <MaterialCommunityIcons
                            name={liked ? "heart" : "heart-outline"}
                            size={32}
                            color={liked ? "red" : "black"}
                        />
                    </Pressable>
                    <View style={{marginLeft:10}}/>
                    <Icon
                        borderRadius={0}
                        name={'chatbox-outline'}
                        iconColor={''}
                        onPress={() => { navigation.navigate('CommentG', { id: item.id }) }}
                        size={28}
                        style={styles.appButton}
                    >
                    </Icon>
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

                    </View>

                </View>


            </View>
            <View style={{ width: "100%",flex:1 }}>
                {isLoading ? <ActivityIndicator /> : (<FlatList refreshControl={
                    <RefreshControl refreshing={reloading}
                        onRefresh={reloadData} />}

                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => `key-${item.id}`}>
                </FlatList>
                )}

            </View>




        </View>
    )
}
export default HomeGuest;
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
    }
});