import *  as React from 'react'
import { Button, TextInput, Text, View, StyleSheet,Image } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { API } from './API';
import { Fumi } from 'react-native-textinput-effects';

const Register = ({ navigation }) => {
    const [fullname, setfullname] = useState()
    const [username, setusername] = useState();
    const [password, setpassword] = useState();
    const [repassword, setrepassword] = useState();
    const [phonenumber, setphonenumber] = useState();
    const [email, setemail] = useState();
    const [image, setimage] = useState("")
    const [status, setstatus] = useState(0)
    const registerUser = () => {

        if (username.length == 0) {
            // thông báo:
            alert("Vui lòng nhập tài khoản")
            return;
        }
        if (password.length == 0) {
            // thông báo:
            alert("Vui lòng nhập mật khẩu")
            return;
        }
        if (repassword.length == 0) {
            // thông báo:
            alert("Vui lòng nhập lại mật khẩu")
            return;
        }if (fullname.length == 0) {
            // thông báo:
            alert("Vui lòng nhập họ tên")
            return;
        }
        if (phonenumber.length == 0) {
            // thông báo:
            alert("Vui lòng nhập số điện thoại")
            return;
        }
        if (email.length == 0) {
            // thông báo:
            alert("Vui lòng nhập email")
            return;
        }

        //1. Chuẩn bị dữ liệu:

        let objUsers = {
            fullname: fullname,
            username: username,
            password: password,
            repassword: repassword,
            phonenumber: phonenumber,
            email:email,
            status:status,
            image:image
        }


        //2. Gọi hàm fetch
        fetch(API.getlistuser, {
            method: 'POST', // POST: Thêm mới, PUT: Sửa, DELETE: xóa, GET: lấy thông tin
            headers: { // Định dạng dữ liệu gửi đi
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objUsers) // chuyển đối tượng SP thành chuỗi JSON
        })
            .then((response) => {
                console.log(response.status);
                // nếu log là 201 thì là tạo thành công
                if (response.status == 201)
                    alert("Đăng ký thành công");
                    

            })
            .catch((err) => {  // catch để bắt lỗi ngoại lệ
                console.log(err);
            });
        //3. Tạo nút bấm để gọi hàm thêm sản phẩm
    }

    return (
        <View style={styles.container}>
            <View style={{marginTop:20,flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center',padding:10,marginLeft:10}}>
                <Icon style={{flex:2,marginBottom:8}}
                name='arrow-back'
                color={'white'}
                onPress={()=>{navigation.goBack()}}
                size={30}></Icon>
               <Text style={{flex:16,fontSize:30,fontWeight:'bold',color:'white',marginBottom:10,marginRight:'auto',marginLeft:'20%'}}>ĐĂNG KÝ</Text>
            </View>

            <View style={{elevation:5,borderRadius:20,backgroundColor: '#CCCC99',width:'100%',alignItems:'center'}}>
            <Fumi style={styles.content1}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                iconColor={'#f95a25'}
                label={'Nhập Tài Khoản'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
                onChangeText={(txt) => { setusername(txt) }}
            />
            <Fumi style={styles.content1}
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
                onChangeText={(txt) => { setpassword(txt) }}
            />
            <Fumi style={styles.content1}
                iconClass={FontAwesomeIcon}
                iconName={'lock'}
                iconColor={'#f95a25'}
                label={'Nhập Lại Mật Khẩu'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                secureTextEntry={true}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
                onChangeText={(txt) => { setrepassword(txt) }}
            />
            <Fumi style={styles.content1}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                iconColor={'#f95a25'}
                label={'Nhập Họ Tên'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
                onChangeText={(txt) => { setfullname(txt) }}
            />
            <Fumi style={styles.content1}
                iconClass={FontAwesomeIcon}
                iconName={'phone'}
                iconColor={'#f95a25'}
                label={'Nhập Số Điện Thoại'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
                keyboardType='numeric'
                onChangeText={(txt) => { setphonenumber(txt) }}
            />
            <Fumi style={styles.content1}
                iconClass={FontAwesomeIcon}
                iconName={'envelope'}
                iconColor={'#f95a25'}
                label={'Nhập Email'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                iconBackgroundColor={'#33FF33'}
                inputStyle={{ color: '#464949' }}
                onChangeText={(txt) => { setemail(txt) }}
            />
            
            
            <View style={{marginBottom:25   }}>
                <Button title='Đăng ký' onPress={() => { registerUser()}}></Button>
            </View>
            </View>
            
            

            
        </View>
    )
}
export default Register;
const styles = StyleSheet.create({
 
    container: {
        backgroundColor: '#657fc7',
        flex: 1,
        alignItems: 'center',
        lineHeight: 10,
        flexDirection: 'column'

    },
    content: {
        marginLeft: 10,
        marginRight: 10
    },
    content1: {
        margin: 10,
        width: 300,
    },
});