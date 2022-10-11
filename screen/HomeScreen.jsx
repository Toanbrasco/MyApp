import React, { useState, useEffect, is } from 'react'
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, Modal, Pressable, TouchableOpacity, ToastAndroid,
    Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, Image, ImageBackground, BackHandler, Alert
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
// import { useFonts } from 'expo-font';

import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { addSpace } from '../constant';

import firestore from '@react-native-firebase/firestore';
import Loading from './Loading';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCopy, faTrash, faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons'

import * as  Clipboard from 'expo-clipboard';

const HomeScreen = ({ navigation, route }) => {
    const DELETE = 'DELETE'
    const [loading, setLoading] = useState(true)
    const [creditArr, setCreditArr] = useState()
    const [show, setShow] = useState(false)
    const [refesh, setRefesh] = useState(0)
    const [modalData, setModalData] = useState({
        textTitle: '',
        action: '',
        id: '',
        credit: {}
    })
    // const [loaded] = useFonts({
    //     Montserrat: require('../assets/font/RobotoCondensed-Regular.ttf'),
    // });
    const DayArr = ['MON', 'TUE', 'WED', 'THU', 'FIR', 'SAT', 'SUN']
    const Day = new Date().getDate()

    const copyToClipboard = async (type) => {
        switch (type) {
            case "STK":
                await Clipboard.setStringAsync(`${modalData.credit.accountNum}`);
                ToastAndroid.show('Đã copy số tài khoản', ToastAndroid.SHORT);
                break;
            case "ST":
                await Clipboard.setStringAsync(`${modalData.credit.creditNum}`);
                ToastAndroid.show('Đã copy số thẻ', ToastAndroid.SHORT);
                break;
            case "ALL":
                await Clipboard.setStringAsync(`Số tài khoản: ${modalData.credit.accountNum} \n Số thẻ: ${modalData.credit.creditNum}`);
                ToastAndroid.show('Đã copy số thông tin thẻ', ToastAndroid.SHORT);
                break;

            default:
                break;
        }
    };
    const handleModal = (data) => {
        setShow(true)
        setModalData({ ...modalData, id: data._id, credit: data })
    }
    const modalDeleteCredit = () => {
        setModalData({ ...modalData, action: DELETE })
        setShow(true)
    }
    const handleEditCredit = () => {
        setShow(false)
        navigation.navigate('EditCredit', {
            action: 'EDIT',
            itemId: modalData.credit._id
        })
    }
    const deleteCredit = () => {
        firestore()
            .collection('Credit')
            .doc(modalData.credit._id)
            .delete()
            .then(() => {
                // console.log('Credit deleted!');
                ToastAndroid.show('Đã xoá thẻ!', ToastAndroid.SHORT);
                setShow(false)
                setModalData({
                    textTitle: '',
                    action: '',
                    id: '',
                    credit: {}
                })
                setRefesh(refesh + 1)
            });
    }
    const { width } = Dimensions.get('window');
    useEffect(() => {
        firestore()
            .collection('Credit')
            .get()
            .then(querySnapshot => {
                let arr = []
                querySnapshot.forEach(documentSnapshot => {
                    const credit = {
                        _id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    }
                    arr.push(credit)
                });
                setCreditArr(arr)
                setLoading(false)
            });
    }, [refesh])

    if (loading) {
        return <Loading />;
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar barStyle="auto" hidden />
            <View style={[styles.container, {
                height: '10%', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center'
            }]}>
                <Image
                    style={styles.tinyLogo}
                    source={require("../assets/Images/Logo.jpg")}
                />
                <Text style={styles.text}>My App</Text>
            </View>
            <View style={[styles.container, {
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20
            }]}>
                {/* <TouchableOpacity style={
                    [styles.contentBox,
                    styles.shadow,
                    {
                        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: 20
                    }]}
                    onPress={() => navigation.navigate('Nofication')}>
                    <View style={{
                        width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                        {DayArr.map((item, index) =>
                            <Text key={index} style={[styles.Date, { color: '#000', fontSize: 13 }]}>{item}</Text>
                        )}
                    </View>
                    <View style={{
                        width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around',
                        paddingBottom: 10, borderBottomColor: 'gray', borderBottomWidth: 1
                    }}>
                        <Text style={styles.Date}>{Day - 3}</Text>
                        <Text style={styles.Date}>{Day - 2}</Text>
                        <Text style={styles.Date}>{Day - 1}</Text>
                        <Text style={[styles.active, styles.Date]}>{Day}</Text>
                        <Text style={styles.Date}>{Day + 1}</Text>
                        <Text style={styles.Date}>{Day + 2}</Text>
                        <Text style={styles.Date}>{Day + 3}</Text>

                    </View>
                    <View style={{
                        width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                        alignItems: 'center', paddingTop: 10, paddingBottom: 10,
                    }}>
                        <Text style={[{ color: '#000', fontSize: 15 }]}>6:00 PM | </Text>
                        <Text style={[{ color: '#000', fontSize: 15 }]}>Làm cái gì đó</Text>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={[styles.contentBox, styles.shadow, { flex: 1, marginTop: 20 }]}
                    onPress={() => navigation.navigate('Spending')}
                >
                    <Text style={styles.text}>My Spending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.contentBox, styles.shadow, { flex: 2, marginLeft: 20, marginTop: 20 }]}
                    onPress={() => navigation.navigate('Todos')}
                >
                    <Text style={styles.text}>Task List</Text>
                </TouchableOpacity>
                <View style={[
                    {
                        width: '100%', height: 200, marginTop: 20, borderRadius: 15, backgroundColor: 'white', overflow: 'hidden'
                    }]}>
                    <SwiperFlatList
                        style={{ width: '100%', height: 200, borderRadius: 15 }}
                        // autoplayDelay={2}
                        autoplay={false}
                        index={0}
                    >
                        {
                            creditArr.map((item) =>
                                <TouchableWithoutFeedback key={item.creditNum} onLongPress={() => handleModal(item)}>
                                    <LinearGradient
                                        colors={['#B5B5B5', '#000000']}
                                        useAngle={true}
                                        angle={131.17}
                                        locations={[0.23, 1.45]}
                                        // colors={['#F36BFF', '#8C25DE']}
                                        style={{ flex: 1, width: width - 40, borderRadius: 15, height: 200, opacity: 0.9 }}>
                                        <ImageBackground source={require('../assets/Images/Card.png')} resizeMode="cover" style={{
                                            flex: 1, height: 200, display: 'flex', justifyContent: 'space-between', flexDirection: 'column',
                                            padding: 20, borderRadius: 15
                                        }} >
                                            <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={[{ fontSize: 15, color: 'gray' }]}>{item.brandCredit}</Text>
                                                <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }]}>{item.typeCredit}</Text>
                                            </View>
                                            <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
                                                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {
                                                        addSpace(item.creditNum).map((num, index) =>
                                                            <Text key={num + 'Home' + index} style={[{ color: '#dedede', fontWeight: 'normal', fontSize: 25 }]}>{num}</Text>
                                                        )
                                                    }
                                                </View>
                                                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                    <Text style={[{ color: 'gray', fontSize: 15 }]}>{item.accountNum}</Text>
                                                    <Text style={[{ color: 'white', fontSize: 15 }]}>{item.expDate}</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </LinearGradient>
                                </TouchableWithoutFeedback>
                            )
                        }
                        <LinearGradient
                            colors={['#B5B5B5', '#000000']}
                            useAngle={true}
                            angle={131.17}
                            locations={[0.23, 1.45]}
                            style={{ flex: 1, width: width - 40, borderRadius: 15, height: 200, opacity: 0.9 }}>
                            <ImageBackground source={require('../assets/Images/Card.png')} resizeMode="cover" style={{
                                flex: 1, height: 200, display: 'flex', justifyContent: 'space-between', flexDirection: 'column',
                                padding: 30,
                            }} >
                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => navigation.navigate('AddCredit', {
                                        action: 'ADD',
                                    })}>
                                    <Text style={{ fontSize: 30, color: '#FFF', fontWeight: 'bold' }}>Add New Credit</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </LinearGradient>
                    </SwiperFlatList>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={show}
                    onRequestClose={() => {
                        setShow(!show);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {
                                modalData.action === DELETE ?
                                    <View style={{ flex: 1 }}>
                                        {/* <Text style={{ color: '#000', fontSize: 15 }}>Bạn muốn xoá thẻ {modalData.credit.creditNum}</Text> */}
                                        <LinearGradient
                                            colors={['#B5B5B5', '#000000']}
                                            useAngle={true}
                                            angle={131.17}
                                            locations={[0.23, 1.45]}
                                            // colors={['#F36BFF', '#8C25DE']}
                                            style={{ flex: 1, width: '100%', borderRadius: 15, height: '100%', opacity: 0.9 }}>
                                            <ImageBackground source={require('../assets/Images/Card.png')} resizeMode="cover" style={{
                                                flex: 1, height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column',
                                                padding: 20, borderRadius: 15
                                            }} >
                                                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                    <Text style={[{ fontSize: 15, color: 'gray' }]}>{modalData.credit.brandCredit}</Text>
                                                    <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }]}>{modalData.credit.typeCredit}</Text>
                                                </View>
                                                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
                                                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {
                                                            addSpace(modalData.credit.creditNum).map((num, index) =>
                                                                <Text key={'creditNum' + index + num} style={[{ color: '#dedede', fontWeight: 'normal', fontSize: 20 }]}>{num}</Text>
                                                            )
                                                        }
                                                    </View>
                                                    <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                        <Text style={[{ color: 'gray', fontSize: 15 }]}>{modalData.credit.accountNum}</Text>
                                                        <Text style={[{ color: 'white', fontSize: 15 }]}>{modalData.credit.expDate}</Text>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </LinearGradient>
                                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                            <TouchableOpacity style={[styles.creditBtn, { marginRight: 10, backgroundColor: 'red' }]} onPress={deleteCredit}>
                                                {/* <FontAwesomeIcon icon={faTrash} color={'#FFF'} /> */}
                                                <Text style={{ color: 'white', fontWeight: '600' }}>Xoá</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#1294F2' }]} onPress={() => setShow(false)}>
                                                {/* <FontAwesomeIcon icon={faTrash} color={'red'} /> */}
                                                <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    : <View style={{ flex: 1 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <View style={[styles.copyLine, {}]}>
                                                <Text style={{ color: 'gray', fontWeight: '400', flex: 7, marginLeft: 10 }}>Số tài khoản: {modalData.credit.accountNum}</Text>
                                                <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard('STK')}>
                                                    <FontAwesomeIcon icon={faCopy} color={'#FFF'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.copyLine, {}]}>
                                                <Text style={{ color: 'gray', fontWeight: '400', flex: 7, marginLeft: 10 }}>Số thẻ: {modalData.credit.creditNum}</Text>
                                                <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard('ST')}>
                                                    <FontAwesomeIcon icon={faCopy} color={'#FFF'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[styles.copyLine, {}]}>
                                                <Text style={{ color: 'gray', fontWeight: '400', flex: 7, marginLeft: 10 }}>Tất cả thông tin</Text>
                                                <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard('ALL')}>
                                                    <FontAwesomeIcon icon={faCopy} color={'#FFF'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#1294F2' }]}
                                                    onPress={handleEditCredit}>
                                                    <FontAwesomeIcon icon={faPenToSquare} color={'#FFF'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.creditBtn, { marginLeft: 10, marginRight: 10, backgroundColor: 'red' }]} onPress={modalDeleteCredit}>
                                                    <FontAwesomeIcon icon={faTrash} color={'#FFF'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#ffaa33' }]} onPress={() => setShow(false)}>
                                                    {/* <FontAwesomeIcon icon={faTrash} color={'red'} /> */}
                                                    <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                </Modal>
            </View >
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        // padding: 10
        // paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        // flex: 1,
        // backgroundColor: 'red'
    },
    tinyLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        fontSize: 20,
        color: '#000',
        fontWeight: '500',
    },
    contentBox: {
        height: 150,
        // borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 15,
        padding: 10,
        backgroundColor: '#fff'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    active: {
        backgroundColor: '#1294F2',
        color: 'white'
    },
    Date: {
        // width: 35,
        flex: 1,
        height: 40,
        borderRadius: 5,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        textAlign: 'center',
        lineHeight: 40,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '90%',
        height: 250,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    textInput: {
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20
        // marginBottom: 36
    }, buttonPicker: {
        width: '50%',
        padding: 10,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F8F8'
    },
    pikerDate: {
        borderRightWidth: 1,
        borderRightColor: 'lightgray',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    pikerTime: {
        borderLeftWidth: 1,
        borderLeftColor: 'lightgray',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    copyLine: {
        width: '100%',
        backgroundColor: '#F8F8F8',
        // flex: 1,
        height: 40,
        // paddingLeft: 10,
        // paddingRight: 10,
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10
    },
    copyBtn: {
        backgroundColor: '#4BB543',
        flex: 3,
        height: '100%',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
    ,
    creditBtn: {
        flex: 1,
        height: 40,
        backgroundColor: '#4BB543',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
});
export default HomeScreen;