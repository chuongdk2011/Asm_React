import * as React from 'react'
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API } from './API';

const Posting = ({ navigation }) => {
    const [title, settile] = useState()
    const [image, setimage] = useState();
    const [content, setcontent] = useState();
    const [userId, setuserId] = useState()
    const [img_base64, setiimg_base64] = useState(null)
    const [img_source, setimg_source] = useState(null)


    useEffect(() => {
        const getData = async () => {

            try {
                const value = await AsyncStorage.getItem("login")
                console.log(value);
                if (value !== null) {
                    let parsed = JSON.parse(value)
                    setuserId(parsed.id)

                }
            } catch (e) {
                // error reading value
                console.log(e);
            } finally { setisLoading(false) }

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
                    // upload ảnh lên api thì dùng PUT có thể viết ở đây
                });


        }


    }



    const addPost = () => {
        //1. Chuẩn bị dữ liệu:

        let objUsers = {
            title: title,
            image: img_base64,
            content: content,
            usersId: userId
        }


        //2. Gọi hàm fetch
        fetch(API.updatearticleadmin1, {
            method: 'POST', // POST: Thêm mới, PUT: Sửa, DELETE: xóa, GET: lấy thông tin
            headers: { // Định dạng dữ liệu gửi đi
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objUsers) // chuyển đối tượng SP thành chuỗi JSON
        })
            .then((response) => {
                
                // nếu log là 201 thì là tạo thành công
                if (response.status == 201)
                    alert("Thêm mới thành công");


            })
            .catch((err) => {  // catch để bắt lỗi ngoại lệ
                console.log(err);
            });
        //3. Tạo nút bấm để gọi hàm thêm sản phẩm
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',height:50,backgroundColor:'white',borderBottomWidth:0.5,borderBottomColor:'#e3e4e6'}}>
                <TouchableOpacity style={{marginTop:12,flex:2}} onPress={()=>{navigation.goBack()}}>
                    <Icon name={'arrow-back'}
                    size={22}>

                    </Icon>
                </TouchableOpacity>
            <Text style={styles.status}>Đăng Bài</Text>
            <TouchableOpacity style={{marginTop:10,flex:2,marginRight:10}} onPress={()=>{addPost(),navigation.navigate('Home')}}>
                    <Text style={{paddingTop:3,width:55,height:28,backgroundColor:'blue',color:'white',fontWeight:'bold',textAlign:'center',borderRadius:4}}>ĐĂNG</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.content1}

                textAlignVertical="top" placeholder='Nhập tiêu đề' value={title} onChangeText={text => settile(text)}></TextInput>
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', padding: 8, }}>

                    <TextInput style={{ flex: 10 }}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top" placeholder='Nhập nội dung' value={content} onChangeText={text => setcontent(text)} />
                    <TouchableOpacity style={{ flex: 1 }} onPress={pickImage}>
                        <Icon name='image'
                            size={30}></Icon>
                    </TouchableOpacity>
                </View>
                {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: "100%", height: 250,elevation:15 }} />}
            </View>


        </View>
    )
}
export default Posting;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
       


    },
    content1: {
        height: 40,
        width: '100%',

        elevation: 5,
        marginTop: 6,

        padding: 8,
        backgroundColor: 'white'
    },
    content: {
        height: '100%',
        elevation: 5,
        marginTop: 10,
        width: '100%',
        backgroundColor: 'white'
    },
    status: {
        width: '100%',
        flex:8,
        textAlign:'center',
        height: 40,
        color: 'blue',
        fontWeight: 'bold',
        marginTop:14
    },
    appButton: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
    appButtonText: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    function: {
        flexDirection: 'row',
        flex: 1
    }
});