import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
var api_url = "http://10.24.29.62:3000/articles";
const HomeG = ({ navigation }) => {
    const [data, setdata] = useState([]);
    const [id, setid] = useState();
    const [title, settitle] = useState();
    const [content, setcontent] = useState();
    const [image, setimage] = useState();
    const [status, setstatus] = useState();
    const [isLoading, setisLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        
        getListArticle();
        return () => {

        }
    }, [])
    const getUserId = async () => {
        UserId = await AsyncStorage.getItem()
    }
    const getListArticle = () => {
        fetch("http://192.168.102.16:3000/posts?_expand=users")
            .then((data_res) => {
                // chuyển dữ liệu dạng json
                return data_res.json();
            })
            .then((data_json) => {
                // ghi log kết quả json
                setdata(data_json);
                console.log(data_json);
            })
            .catch((err) => {
                // nếu xảy ra lỗi thì log lỗi
                console.log(err);
            }).finally(() => setisLoading(false));

    }
    renderItem = ({ item, index }) => {


        const XoaItem = () => {
            // if(! confirm ('Có đồng ý xóa không?') )
            //     return; 

            let url_api = 'http://192.168.102.16:3000/posts/' + item.id;

            fetch(url_api, {
                method: 'DELETE', // POST: Thêm mới, PUT: Sửa, DELETE: xóa, GET: lấy thông tin
                headers: { // Định dạng dữ liệu gửi đi
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    console.log(response.status);
                    getListArticle()
                    // nếu status là 200 thì là xóa thành công
                    if (response.status == 200)
                        alert("Xóa thành công");
                    
                })
                .catch((err) => {  // catch để bắt lỗi ngoại lệ
                    console.log(err);
                });
        }
        return (
            <View style={{ margin: 10, backgroundColor: 'white', elevation: 5, borderRadius: 8, padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        marginBottom: 10,
                        fontWeight: 'bold',
                        color: '#d63341',
                        fontSize: 15,
                        marginLeft: 8,
                        flex: 8

                    }} > {item.users.username}</Text>

                    <TouchableOpacity onPress={XoaItem} style={{ flex: 2, width: 40, height: 20, backgroundColor: '#f75959', borderRadius: 8, marginRight: 6 }}>
                        <Text style={{ textAlign: 'center' }} >Delete</Text>
                    </TouchableOpacity>
                </View>


                <Text style={{ alignItems: 'center', width: '100%', textAlign: 'center', marginBottom: 8, fontSize: 18, fontWeight: '400' }}>{item.title}</Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{
                        width: 80, height: 80,
                        marginBottom: 10
                    }} source={{
                        uri: item.image,
                    }} ></Image>
                </View>
                <View style={{ flexDirection: 'row' }}>

                    <View style={{ fontWeight: 'bold', fontSize: 15 }}>
                        <Text style={styles.input} > {item.content}</Text>
                    </View>

                </View>

                <Icon.Button
                    borderRadius={0}
                    name={'chatbox-outline'}
                    iconColor={''}
                    onPress={() => { navigation.navigate('CommentG', { id: item.id }) }}

                    style={styles.appButton}
                >

                </Icon.Button>




            </View>
        )

    }




    StatusBar.setHidden(true)
    return (
        <View style={styles.container}>

            <Text style={styles.status}>MẠNG XÃ HỘI</Text>
            <View style={styles.function}>



            </View>
            <View style={{ width: "90%", height: 350 }}>
                {isLoading ? <ActivityIndicator /> : (<FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => `key-${item.id}`}>
                </FlatList>
                )}

            </View>



        </View>
    )
}
export default HomeG;
const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',


    },
    status: {
        width: '100%',
        backgroundColor: '#E30425',
        height: 40,
        color: 'white',
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
        flex: 1
    },
    content: {
        width: '100%',
        height: '75%',
        backgroundColor: 'white',
        marginBottom: 10,
    }
});