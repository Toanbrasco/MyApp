import React, { useState, useEffect } from 'react'
import {
    StyleSheet, Text, View, Dimensions, StatusBar, TouchableOpacity, ImageBackground,
    Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, Pressable, ToastAndroid
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { addSpace, DayFormat } from '../constant';
import { text } from '@fortawesome/fontawesome-svg-core';
import DateTimePicker from '@react-native-community/datetimepicker';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowTrendUp, faUtensils, faMotorcycle, faFilm, faPlus, faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons'

import firestore from '@react-native-firebase/firestore';
import Loading from './Loading';

const Credit = ({ route, navigation }) => {
    const { action, itemId } = route.params;
    const [loading, setLoading] = useState(true)
    const { width } = Dimensions.get('window');
    const [creditCard, setCreditCard] = useState({
        accountNum: '',
        creditNum: '',
        expDate: '',
        typeCredit: '',
        brandCredit: ''
    })
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [refesh, setRefesh] = useState(0)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        setCreditCard({ ...creditCard, expDate: FormatExpDate(currentDate) })
    };
    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };
    const handleAddCredit = () => {
        if (creditCard.accountNum.length >= 5 && creditCard.creditNum.length === 12 && creditCard.expDate.length === 5
            && creditCard.typeCredit.length >= 4 && creditCard.brandCredit.length >= 5) {
            firestore()
                .collection('Credit')
                .add(creditCard)
                .then(() => {
                    ToastAndroid.show('Thêm thẻ thành công!', ToastAndroid.SHORT);
                    // console.log('Credit added!');
                });
        } else {
            ToastAndroid.show('Có gì đó sai sai!', ToastAndroid.SHORT);
            // console.log('Méo added!');
        }
    }
    const handleEditCredit = () => {
        if (creditCard.accountNum.length >= 5 && creditCard.creditNum.length === 12 && creditCard.expDate.length === 5
            && creditCard.typeCredit.length >= 4 && creditCard.brandCredit.length >= 5) {
            firestore()
                .collection('Credit')
                .doc(itemId)
                .update(creditCard)
                .then(() => {
                    // console.log('Credit update!');
                    ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
                    setRefesh(refesh + 1)
                });
        } else {
            ToastAndroid.show('Có gì đó sai sai!', ToastAndroid.SHORT);
            // console.log('Méo update!');
        }
    }
    const FormatExpDate = (date) => {
        let year = date.getFullYear().toString()
        return `${date.getDate()}/${year[2] + year[3]}`
    }

    const getCreditDetail = async () => {
        const data = await firestore().collection('Credit').doc(itemId).get()
        setCreditCard(data._data)
        setLoading(false)
    }
    useEffect(() => {
        if (action === "EDIT") {
            getCreditDetail()
        } else {
            setLoading(false)
        }
    }, [itemId, refesh])

    if (loading) {
        return <Loading />
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar hidden />
            <View style={[styles.container, { marginTop: 20 }]}>
                <Text style={{ height: 30, fontSize: 20, marginBottom: 10, color: '#000', fontWeight: '600' }}>{action === 'ADD' ? 'Thêm thẻ mới' : 'Chỉnh sửa thẻ'}</Text>
                <View style={{ width: '100%', height: 200, borderRadius: 15, }}>
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
                                <Text style={[{ fontSize: 15, color: 'gray' }]}>{creditCard.brandCredit}</Text>
                                <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }]}>{creditCard.typeCredit}</Text>
                            </View>
                            <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
                                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {
                                        addSpace(creditCard.creditNum).map((num) =>
                                            <Text key={num} style={[{ color: '#dedede', fontWeight: 'normal', fontSize: 35 }]}>{num}</Text>
                                        )
                                    }
                                </View>
                                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={[{ color: 'gray', fontSize: 15 }]}>{creditCard.accountNum}</Text>
                                    <Text style={[{ color: 'white', fontSize: 15 }]}>{creditCard.expDate}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </LinearGradient>
                </View>
                <View>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.inner}>
                                <TextInput placeholderTextColor="#A5A5A5" placeholder="Tên ngân hàng" style={styles.textInput}
                                    name="brandCredit" onChangeText={(newText) => setCreditCard({ ...creditCard, brandCredit: newText })} defaultValue={creditCard.brandCredit} />
                                <View style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextInput placeholderTextColor="#A5A5A5" placeholder="Số tài khoản" keyboardType='numeric' style={[styles.textInput, { marginRight: 10, flex: 2, marginTop: 0 }]}
                                        name="accountNum" onChangeText={(newText) => setCreditCard({ ...creditCard, accountNum: newText })} defaultValue={creditCard.accountNum} />
                                    <TextInput placeholderTextColor="#A5A5A5" placeholder="Loại thẻ" style={[styles.textInput, { marginLeft: 10, flex: 1, marginTop: 0 }]}
                                        name="typeCredit" onChangeText={(newText) => setCreditCard({ ...creditCard, typeCredit: newText })} defaultValue={creditCard.typeCredit} />
                                </View>
                                <TextInput placeholderTextColor="#A5A5A5" placeholder="Số thẻ" keyboardType='numeric' style={styles.textInput} maxLength={12}
                                    name="creditNum" onChangeText={(newText) => setCreditCard({ ...creditCard, creditNum: newText })} defaultValue={creditCard.creditNum} />
                                <View style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextInput placeholderTextColor="#A5A5A5" placeholder="Ngày hết hạn" editable={false} style={[styles.textInput, { flex: 2, marginRight: 10, marginTop: 0 }]}
                                        name="expDate" onChangeText={(newText) => setCreditCard({ ...creditCard, expDate: newText })} defaultValue={creditCard.expDate} />
                                    <TouchableOpacity onPress={() => setShow(true)} style={[styles.buttonPicker, { flex: 5 }]}>
                                        <FontAwesomeIcon icon={faCalendarDay} />
                                    </TouchableOpacity>
                                    {show && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={'date'}
                                            is24Hour={true}
                                            onChange={onChange}
                                        />)}
                                </View>
                                {
                                    action === "ADD" ?
                                        <Pressable
                                            style={{ borderRadius: 10, padding: 10, elevation: 2, backgroundColor: '#2196F3', marginTop: 20, alignItems: 'center' }}
                                            onPress={handleAddCredit}>
                                            <Text style={[styles.textStyle, { color: 'white' }]}>Add Credit</Text>
                                        </Pressable>
                                        : <Pressable
                                            style={{ borderRadius: 10, padding: 10, elevation: 2, backgroundColor: '#2196F3', marginTop: 20, alignItems: 'center' }}
                                            onPress={handleEditCredit}>
                                            <Text style={[styles.textStyle, { color: 'white' }]}>Edit Credit</Text>
                                        </Pressable>
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    textInput: {
        height: 40,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
        color: '#000'
    },
    buttonPicker: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        marginLeft: 10,
        borderRadius: 10


    }
})

export default Credit;