import React, { useState } from 'react'
import {
    View, Text, StyleSheet, StatusBar, SafeAreaView, Dimensions, Modal, Pressable, TouchableOpacity,
    Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import { PieChart, BarChart } from "react-native-gifted-charts";
import { barData, barData2, pieData, DayFormat } from '../constant';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowTrendUp, faUtensils, faMotorcycle, faFilm, faPlus, faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons'

import DateTimePicker from '@react-native-community/datetimepicker';


const Spending = () => {
    const { width } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar barStyle="auto" hidden />
            <SafeAreaView style={[styles.container]}>
                {/* <Text style={{ marginTop: 20 }}>Spending</Text> */}
                {/* <View style={{ width: '100%', height: 200, marginTop: 20 }}> */}
                <View style={[
                    {
                        width: '100%', height: 200, marginTop: 25, borderRadius: 15, backgroundColor: 'white'
                    }]}>
                    <SwiperFlatList

                        style={{ width: '100%', height: 200, borderRadius: 15, }}
                        // autoplayDelay={2}
                        autoplay={false}
                        index={0}
                    >
                        <LinearGradient
                            colors={['#8E8E8E', '#D7D7D7']}
                            useAngle={true}
                            angle={138.76}
                            locations={[0.073, 0.49]}
                            // colors={['#F36BFF', '#8C25DE']}
                            style={[styles.BgLinear, { flex: 1, width: width - 40, borderRadius: 15, height: 200, opacity: 0.9, padding: 15 }]}>

                            <Text style={{ fontSize: 20, color: '#fff' }}>Chi tiêu tháng 10</Text>
                            <View style={styles.BoxChar}>
                                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                                    <PieChart
                                        donut
                                        showGradient
                                        sectionAutoFocus
                                        radius={60}
                                        innerRadius={40}
                                        innerCircleColor={'#232B5D'}
                                        data={pieData}
                                        centerLabelComponent={() => {
                                            return (
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text
                                                        style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                                                        47%
                                                    </Text>
                                                    <Text style={{ fontSize: 14, color: 'white' }}>Còn dư</Text>
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, height: '100%', padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {pieData.map((item) =>
                                        <View key={item.value} style={styles.RowInfo}>
                                            <View style={{ width: 20, height: 20, backgroundColor: item.color }}></View>
                                            <Text style={styles.colorWhite}>{item.content}</Text>
                                        </View>
                                    )}
                                </View>

                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#8E8E8E', '#D7D7D7']}
                            useAngle={true}
                            angle={138.76}
                            locations={[0.073, 0.49]}
                            // colors={['#F36BFF', '#8C25DE']}
                            style={[styles.BgLinear, { flex: 1, width: width - 40, borderRadius: 15, height: 200, opacity: 0.9, padding: 10 }]}>

                            <Text style={{ fontSize: 20, color: '#fff' }}>Thu nhập hàng tháng</Text>
                            <View style={[styles.BoxChar, { alignItems: 'center', zIndex: 10, marginLeft: 10 }]}>
                                <BarChart
                                    data={barData}
                                    height={100}
                                    barWidth={14}
                                    initialSpacing={5}
                                    spacing={10}
                                    barBorderRadius={2}
                                    hideRules
                                    xAxisThickness={0}
                                    yAxisThickness={0}
                                    yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                                    yAxisLabelTexts={['0', '4M', '8M', '12M', '16M', '20M']}
                                    stepValue={4000000}
                                    noOfSections={5}
                                    maxValue={20000000}
                                    showLine
                                    lineConfig={{
                                        color: '#F29C6E',
                                        thickness: 3,
                                        curved: true,
                                        hideDataPoints: true,
                                        shiftY: 20,
                                        initialSpacing: -30,
                                    }}

                                />
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#8E8E8E', '#D7D7D7']}
                            useAngle={true}
                            angle={138.76}
                            locations={[0.073, 0.49]}
                            // colors={['#F36BFF', '#8C25DE']}
                            style={[styles.BgLinear, { flex: 1, width: width - 40, borderRadius: 15, height: 200, opacity: 0.9, padding: 10 }]}>

                            <Text style={{ fontSize: 20, color: '#fff' }}>Chi tiêu hàng tháng</Text>
                            <View style={[styles.BoxChar, { alignItems: 'center', zIndex: 10, marginLeft: 10 }]}>
                                <BarChart
                                    data={barData2}
                                    height={100}
                                    barWidth={14}
                                    initialSpacing={5}
                                    spacing={10}
                                    barBorderRadius={2}
                                    hideRules
                                    xAxisThickness={0}
                                    yAxisThickness={0}
                                    yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                                    yAxisLabelTexts={['0', '4M', '8M', '12M', '16M', '20M']}
                                    stepValue={4000000}
                                    noOfSections={5}
                                    maxValue={20000000}
                                    showLine
                                    lineConfig={{
                                        color: '#058a00',
                                        thickness: 3,
                                        curved: true,
                                        hideDataPoints: true,
                                        shiftY: 20,
                                        initialSpacing: -30,
                                    }}

                                />
                            </View>
                        </LinearGradient>
                    </SwiperFlatList>
                </View>
                <Text style={{ fontSize: 20, marginTop: 20 }}>Today</Text>
                <View style={{ marginTop: 20 }}>
                    <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row' }}>
                        <View style={[styles.iconBox, { backgroundColor: '#E1FFE1' }]}>
                            <FontAwesomeIcon icon={faArrowTrendUp} size={32} color={'#23B473'} />
                        </View>
                        <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#23B473' }}>Lương về</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13 }}>15-9-2022</Text>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>8:00 PM</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 20, color: '#23B473' }}>+10.000.000.0</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row' }}>
                        <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                            <FontAwesomeIcon icon={faUtensils} size={32} color={'#EB8424'} />
                        </View>
                        <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#EB8424' }}>Ăn uống</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13 }}>15-9-2022</Text>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>8:00 PM</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 20, color: '#EB8424' }}>+10.000.000.0</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row' }}>
                        <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                            <FontAwesomeIcon icon={faMotorcycle} size={32} color={'#EB8424'} />
                        </View>
                        <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#EB8424' }}>Di chuyển</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13 }}>15-9-2022</Text>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>8:00 PM</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 20, color: '#EB8424' }}>+10.000.000.0</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row' }}>
                        <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                            <FontAwesomeIcon icon={faFilm} size={32} color={'#EB8424'} />
                        </View>
                        <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, color: '#EB8424' }}>Dịch vụ</Text>
                                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13 }}>15-9-2022</Text>
                                    <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>8:00 PM</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 20, color: '#EB8424' }}>+10.000.000.0</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.shadow, {
                    width: 50, height: 50, backgroundColor: '#1294F2', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', borderRadius: 20, position: 'absolute', bottom: 50, right: 20, zIndex: 10
                }]}
                    onPress={() => setModalVisible(!modalVisible)} >
                    <FontAwesomeIcon icon={faPlus} size={35} color='#FFF' />
                </TouchableOpacity>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        // style={styles.container}
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={styles.inner}>
                                    {/* <Text style={styles.header}>Header</Text> */}
                                    <TextInput placeholder="Nội dung chi tiêu" style={styles.textInput} />
                                    <TextInput placeholder="Nội dung số" keyboardType='numeric' style={styles.textInput} />
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                        <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={showDatepicker} style={[styles.buttonPicker, styles.pikerDate]}>
                                <FontAwesomeIcon icon={faCalendarDay} />
                                <Text>{DayFormat(date, 'DATE')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showTimepicker} style={[styles.buttonPicker, styles.pikerTime]}>
                                <Text>{DayFormat(date, 'TIME')}</Text>
                                <FontAwesomeIcon icon={faClock} />
                            </TouchableOpacity>
                        </View>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />)}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                                <FontAwesomeIcon icon={faFilm} size={32} color={'#EB8424'} />
                            </View>
                            <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                                <FontAwesomeIcon icon={faMotorcycle} size={32} color={'#EB8424'} />
                            </View>
                            <View style={[styles.iconBox, { backgroundColor: '#FDF7E0' }]}>
                                <FontAwesomeIcon icon={faUtensils} size={32} color={'#EB8424'} />
                            </View>
                            <View style={[styles.iconBox, { backgroundColor: '#E1FFE1' }]}>
                                <FontAwesomeIcon icon={faArrowTrendUp} size={32} color={'#23B473'} />
                            </View>
                        </View>
                        {/* <Button title="Show date picker!" />
                        <Button onPress={showTimepicker} title="Show time picker!" />
                        <Text>selected: {date.toLocaleString()}</Text> */}
                        <Pressable
                            style={[styles.button, styles.buttonClose, { marginTop: 'auto' }]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Add Spendding</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        paddingLeft: 20,
        paddingRight: 20
    },
    BoxChar: {
        // flex: 1,
        // width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    BgLinear: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    RowInfo: {
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    colorWhite: {
        color: '#FFF'
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        width: '100%',
        height: 400,
        // margin: 20,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20
        // marginBottom: 36
    },
    buttonPicker: {
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
    }

})

export default Spending;