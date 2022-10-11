import React, { useState, useEffect, useRef } from 'react'
import {
    View, Text, StyleSheet, StatusBar, SafeAreaView, Dimensions, Modal, Pressable, TouchableOpacity, I18nManager, Animated,
    Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, ScrollView, ToastAndroid
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import { PieChart, BarChart } from "react-native-gifted-charts";
import { barData, barData2, pieData, DayFormat, spending, numberFormat, monthArr } from '../constant';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowTrendUp, faUtensils, faMotorcycle, faFilm, faPlus, faCalendarDay, faClock, faBagShopping, faWallet, faTrash } from '@fortawesome/free-solid-svg-icons'

import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList, GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import firestore from '@react-native-firebase/firestore';
import Loading from './Loading';


const Spending = () => {
    const { width } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [loading, setLoading] = useState(true)
    // const [percent, setPercent] = useState(100)
    const [refesh, setRefesh] = useState(0)
    const [month, setMonth] = useState('MONTH_1')
    let SwipeableRef = useRef([])
    const [info, setInfo] = useState({
        imconeInfo: 0,
        spendingInfo: 0,
        percent: 100,
    })
    const [modalDelete, setModalDelete] = useState({
        index: 0,
        action: ''
    })
    const [SERVICE, MOVING, EATTING, INCOME, SHOPPING] = ['SERVICE', 'MOVING', 'EATTING', 'INCOME', 'SHOPPING']
    const [modalData, setModalData] = useState({
        value: 0,
        content: '',
        date: new Date(),
        time: new Date(),
        icon: EATTING
    })
    const initModalData = {
        value: 0,
        content: '',
        date: new Date(),
        time: new Date(),
        icon: EATTING
    }
    // console.log(`=> modalData`, modalData)
    const [spendingData, setSpendingData] = useState([])

    const [pieChartData, setPieChartData] = useState([
        { value: 0, color: '#177AD5', content: 'Ăn uống', icon: faUtensils },
        { value: 0, color: '#79D2DE', content: 'Đi lại', icon: faMotorcycle },
        { value: 0, color: '#ED6665', content: 'Dịch vụ', icon: faFilm },
        { value: 0, color: '#FFA5BA', content: 'Shopping', icon: faBagShopping },
        { value: 1000000, color: '#FFFFFF', content: 'Còn lại', icon: faWallet },
    ])

    const mergeDate = (date, time) => {
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        const hour = time.getHours()
        const minute = time.getMinutes()
        const merge = new Date(year, month, day, hour, minute, 0, 0)
        return merge
    }

    const handleAddSpending = () => {
        if (modalData.content.length !== 0) {
            const newSpending = {
                content: modalData.content,
                value: parseInt(modalData.value),
                date: mergeDate(modalData.date, modalData.time),
                type: modalData.icon
            }
            firestore()
                .collection('Spending')
                .doc(month)
                .update({ Spending: [...spendingData, newSpending] })
                .then(() => {
                    // console.log('Todo added!');
                    ToastAndroid.show('Đã Thêm!', ToastAndroid.SHORT);
                    setRefesh(refesh + 1)
                    setModalData(initModalData)
                    setModalVisible(!modalVisible)
                })
            // setSpendingData([...spendingData, newSpending])
            // setModalVisible(!modalVisible)
        } else {
            ToastAndroid.show('Thiếu tiêu đề', ToastAndroid.SHORT);
        }
    }
    const handleIcon = (type) => {
        setModalData({ ...modalData, icon: type })
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        // setDate(currentDate);
        if (mode === 'time') {
            setModalData({ ...modalData, time: currentDate })
        } else {
            setModalData({ ...modalData, date: currentDate })
        }
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
    const iconSpeding = [
        {
            type: SERVICE,
            icon: faFilm,
            color: '#EB8424',
            backgroundColor: '#FDF7E0'
        },
        {
            type: MOVING,
            icon: faMotorcycle,
            color: '#EB8424',
            backgroundColor: '#FDF7E0'
        },
        {
            type: EATTING,
            icon: faUtensils,
            color: '#EB8424',
            backgroundColor: '#FDF7E0'
        },
        {
            type: SHOPPING,
            icon: faBagShopping,
            color: '#EB8424',
            backgroundColor: '#FDF7E0'
        },
        {
            type: INCOME,
            icon: faArrowTrendUp,
            color: '#23B473',
            backgroundColor: '#E1FFE1'
        },

    ]
    const getIconIndex = (type) => {
        let value = 0
        iconSpeding.forEach((item, index) => {
            if (item.type === type) {
                value = index
            }
        })
        return value
    }

    const handleDataPieChart = (data) => {
        let income = 0, moving = 0, eating = 0, services = 0, shopping = 0
        if (data.length === 0) setLoading(true)
        data.forEach((item, index) => {
            switch (item.type) {
                case 'INCOME':
                    income += item.value
                    break;
                case 'MOVING':
                    moving += item.value
                    break;
                case 'EATTING':
                    eating += item.value
                    break;
                case 'SERVICE':
                    services += item.value
                    break;
                case 'SHOPPING':
                    shopping += item.value
                    break;

                default:
                    break;
            }
        })
        const percent = (moving + eating + services + shopping) / income
        // console.log(`=> income - (moving + eating + services)`, income, moving, eating, services)
        const income3 = () => {
            let incomeFinal = 0
            if (income - (moving + eating + services) < 0) {
                incomeFinal = 0
            } else {
                incomeFinal = income - (moving + eating + services + shopping)
            }
            return incomeFinal
        }
        const pie = [
            { value: eating, color: '#177AD5', content: 'Ăn uống', icon: faUtensils },
            { value: moving, color: '#79D2DE', content: 'Đi lại', icon: faMotorcycle },
            { value: services, color: '#ED6665', content: 'Dịch vụ', icon: faFilm },
            { value: shopping, color: '#FFA5BA', content: 'Shopping', icon: faBagShopping },
            { value: income3(), color: '#FFFFFF', content: 'Còn lại', icon: faWallet },
        ];
        // console.log(`=> income - (moving + eating + services)`, income - (moving + eating + services))
        // setPercent()
        setPieChartData(pie)
        setInfo({
            ...info,
            imconeInfo: income,
            spendingInfo: income - (income - (moving + eating + services + shopping)),
            percent: 100 - (percent * 100).toFixed(2) === -Infinity ? 0 : 100 - (percent * 100).toFixed(2)
        })
        setLoading(false)
    }

    const handleModalDelete = (index) => {
        setModalDelete({ ...modalDelete, action: 'DELETE', index: index })
        setModalVisible(true)
    }
    const renderRightAction = (progress, index) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
        });
        return (
            <View style={{ width: 50, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
                <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
                    <TouchableOpacity style={[styles.rowHideItem, {
                        marginTop: 20, height: 50, padding: 20, display: 'flex',
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                    }]} onPress={() => handleModalDelete(index)}>
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} size={12} />
                    </TouchableOpacity>
                </Animated.View>
            </View >
        );
    };

    const getSpeding = async () => {
        const data = await firestore().collection('Spending').doc(monthArr[new Date().getMonth()]).get()
        setSpendingData(data._data.Spending)
        await handleDataPieChart(data._data.Spending)
    }
    const deleteSpeding = () => {
        const removeItem = spendingData
        removeItem.splice(modalDelete.index, 1)
        firestore()
            .collection('Spending')
            .doc(month)
            .update({ Spending: removeItem })
            .then(() => {
                // console.log('Todo added!');
                ToastAndroid.show('Đã xoá!', ToastAndroid.SHORT);
                setRefesh(refesh + 1)
                setModalData(initModalData)
                setModalDelete({ index: 0, action: '' })
                setModalVisible(false)
                SwipeableRef.current[modalDelete.index].close()
            })
    }
    const [spendingMonth, setSpendingMonth] = useState([])
    const [incomeMonth, setIncomeMonth] = useState([])

    const handleIncomeMonth = async () => {
        let MonthSpendingArr = []
        let YearArr = []
        await firestore()
            .collection('Spending')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((documentSnapshot) => {
                    YearArr[monthArr.indexOf(documentSnapshot.id)] = documentSnapshot.data().Spending
                });
            });
        YearArr.forEach((items, index) => {
            let value = 0
            items.forEach(item => {
                if (item.type === 'INCOME') {
                    value += item.value
                }
            })
            MonthSpendingArr.push({
                value: value,
                label: index + 1,
                labelTextStyle: { color: 'gray', fontSize: 13 },
                frontColor: '#177AD5',
            })
        })
        setIncomeMonth(MonthSpendingArr)
    }
    const handleSpendingMonth = async () => {
        let MonthSpendingArr = []
        let YearArr = []
        await firestore()
            .collection('Spending')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((documentSnapshot) => {
                    YearArr[monthArr.indexOf(documentSnapshot.id)] = documentSnapshot.data().Spending
                });
            });
        YearArr.forEach((items, index) => {
            let value = 0
            items.forEach(item => {
                if (item.type !== 'INCOME') {
                    value += item.value
                }
            })
            MonthSpendingArr.push({
                value: value,
                label: index + 1,
                labelTextStyle: { color: 'gray', fontSize: 13 },
                frontColor: '#ED6665',
            })
        })
        setSpendingMonth(MonthSpendingArr)
    }

    useEffect(() => {
        setMonth(monthArr[new Date().getMonth()])
        getSpeding()
        handleIncomeMonth()
        handleSpendingMonth()
    }, [refesh])

    if (loading) return <Loading />
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', position: 'relative' }}>
            <StatusBar barStyle="auto" hidden />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={[styles.container, { marginBottom: 50 }]}>

                    {/* <Text style={{ marginTop: 20 }}>Spending</Text> */}
                    {/* <View style={{ width: '100%', height: 200, marginTop: 20 }}> */}

                    <View style={[
                        {
                            width: '100%', height: 250, marginTop: 25, borderRadius: 15, backgroundColor: 'white', overflow: 'hidden'
                        }]}>
                        <SwiperFlatList
                            style={{ width: '100%', height: '100%', borderRadius: 15, }}
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
                                style={[styles.BgLinear, { flex: 1, width: width - 40, borderRadius: 15, height: '100%', padding: 20 }]}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>Chi tiêu tháng {new Date().getMonth() + 1}</Text>
                                <View style={styles.BoxChar}>
                                    <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                                        <PieChart
                                            donut
                                            showGradient
                                            sectionAutoFocus
                                            radius={60}
                                            innerRadius={40}
                                            innerCircleColor={'#232B5D'}
                                            data={pieChartData}
                                            centerLabelComponent={() => {
                                                return (
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text
                                                            style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                                                            {info.percent}%
                                                        </Text>
                                                        <Text style={{ fontSize: 14, color: 'white' }}>Còn dư</Text>
                                                    </View>
                                                );
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, height: '100%', padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {pieChartData.map((item, index) =>
                                            <View key={item.content + index} style={styles.RowInfo} >
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <View style={{ width: 20, height: 20, backgroundColor: item.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <FontAwesomeIcon icon={item.icon} color={item.icon !== faWallet ? '#FFF' : '#23B473'} size={12} />
                                                    </View>
                                                </View>
                                                <Text style={{ color: '#FFF', marginLeft: 10 }}>{numberFormat(item.value)}</Text>
                                                {/* <Text style={styles.colorWhite}>{item.content}</Text> */}
                                            </View>
                                        )}
                                    </View>

                                </View>
                                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex1: 1, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                        <Text style={styles.colorWhite}>Thu nhập: </Text>
                                        <Text style={styles.colorWhite}> {numberFormat(info.imconeInfo)}</Text>
                                    </View>
                                    <View style={{ flex1: 1, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }} >
                                        <Text style={styles.colorWhite}>Đã chi tiêu: </Text>
                                        <Text style={[styles.colorWhite, { color: info.spendingInfo > info.imconeInfo ? '#ED6665' : 'white' }]}> {numberFormat(info.spendingInfo)}</Text>
                                    </View>
                                </View>

                            </LinearGradient>
                            <LinearGradient
                                colors={['#8E8E8E', '#D7D7D7']}
                                useAngle={true}
                                angle={138.76}
                                locations={[0.073, 0.49]}
                                // colors={['#F36BFF', '#8C25DE']}
                                style={[styles.BgLinear, {
                                    flex: 1, width: width - 40, height: '100%', borderRadius: 15, opacity: 0.9,
                                    paddingLeft: 15, paddingBottom: 20, paddingTop: 20
                                }]}>

                                <Text style={{ fontSize: 20, color: '#fff' }}>Thu nhập hàng tháng</Text>
                                <View style={[styles.BoxChar, { alignItems: 'center', zIndex: 10, marginLeft: 10 }]}>
                                    <BarChart
                                        data={incomeMonth}
                                        height={150}
                                        barWidth={10}
                                        initialSpacing={10}
                                        spacing={width / 12 - 19}
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
                                            shiftY: 30,
                                            initialSpacing: -20,
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
                                style={[styles.BgLinear, {
                                    flex: 1, width: width - 40, borderRadius: 15, height: '100%',
                                    opacity: 0.9, paddingLeft: 15, paddingBottom: 20, paddingTop: 20
                                }]}>

                                <Text style={{ fontSize: 20, color: '#fff' }}>Chi tiêu hàng tháng</Text>
                                <View style={[styles.BoxChar, { alignItems: 'center', zIndex: 10, marginLeft: 10 }]}>
                                    <BarChart
                                        data={spendingMonth}
                                        height={150}
                                        barWidth={10}
                                        initialSpacing={10}
                                        spacing={width / 12 - 19}
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
                                            shiftY: 30,
                                            initialSpacing: -20,
                                        }}

                                    />
                                </View>
                            </LinearGradient>
                        </SwiperFlatList>
                    </View>
                    <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: '#000' }}>Tháng {new Date().getMonth() + 1}</Text>
                        {
                            <Text style={[styles.colorWhite, { color: 'red' }]}>
                                {
                                    info.spendingInfo >= info.imconeInfo * 1.5 ?
                                        'Nghèo vl rùi ăn hoài' :
                                        info.spendingInfo >= info.imconeInfo ?
                                            'Ăn ít thôi nghèo rồi' :
                                            info.spendingInfo >= info.imconeInfo * 0.8 ?
                                                'Ăn ít thôi sắp nghèo rồi' : ''
                                }
                            </Text>
                        }
                    </View>
                    {/* {
                        spendingData.map((item, index) =>
                            <View key={item.content + index} style={{ width: '100%', height: 50, marginTop: 20, display: 'flex', flexDirection: 'row' }}>
                                <View style={[styles.iconBox, { backgroundColor: iconSpeding[getIconIndex(item.type)].backgroundColor }]} >
                                    <FontAwesomeIcon icon={iconSpeding[getIconIndex(item.type)].icon} size={32} color={iconSpeding[getIconIndex(item.type)].color} />
                                </View>
                                <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(item.type)].color }}>{item.content}</Text>
                                        <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: '#BDBDBD', fontSize: 13 }}>{DayFormat(item.date, 'DATE')}</Text>
                                            <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>{DayFormat(item.date, 'TIME')}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(item.type)].color }}>{item.type === 'INCOME' ? '+' : '-'}{numberFormat(item.value)}</Text>
                                </View>
                            </View>
                        )} */}
                    <GestureHandlerRootView>
                        {
                            spendingData.map((item, index) =>
                                <Swipeable
                                    key={index + item.content}
                                    ref={ref => SwipeableRef.current[index] = ref}
                                    friction={2}
                                    leftThreshold={30}
                                    rightThreshold={64}
                                    // renderLeftActions={renderLeftActions}
                                    renderRightActions={(progress) => renderRightAction(progress, index)}
                                >
                                    <View style={{ width: '100%', height: 50, marginTop: 20, display: 'flex', flexDirection: 'row', backgroundColor: '#FFF' }}>
                                        <View style={[styles.iconBox, { backgroundColor: iconSpeding[getIconIndex(item.type)].backgroundColor }]} >
                                            <FontAwesomeIcon icon={iconSpeding[getIconIndex(item.type)].icon} size={32} color={iconSpeding[getIconIndex(item.type)].color} />
                                        </View>
                                        <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                                                <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(item.type)].color }}>{item.content}</Text>
                                                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ color: '#BDBDBD', fontSize: 13 }}>{DayFormat(item.date.toDate(), 'DATE')}</Text>
                                                    <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>{DayFormat(item.date.toDate(), 'TIME')}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(item.type)].color }}>{item.type === 'INCOME' ? '+' : '-'}{numberFormat(item.value)}</Text>
                                        </View>
                                    </View>
                                </Swipeable>
                            )}
                    </GestureHandlerRootView>
                </View>
            </ScrollView >
            <TouchableOpacity style={[styles.shadow, {
                width: 50, height: 50, backgroundColor: '#1294F2', display: 'flex', justifyContent: 'center',
                alignItems: 'center', borderRadius: 20, position: 'absolute', bottom: 50, right: 20, zIndex: 10
            }]}
                onPress={() => setModalVisible(!modalVisible)} >
                <FontAwesomeIcon icon={faPlus} size={35} color='#FFF' />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                {
                    modalDelete.action === 'DELETE' ?
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, { width: '90%', height: 150, borderRadius: 15, alignItems: 'flex-start', justifyContent: 'center' }]}>
                                {/* <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text>{spendingData[modalDelete.index].content}</Text>
                                    <Text>{spendingData[modalDelete.index].value}</Text>
                                </View> */}
                                <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', backgroundColor: '#FFF' }}>
                                    <View style={[styles.iconBox, { backgroundColor: iconSpeding[getIconIndex(spendingData[modalDelete.index].type)].backgroundColor }]} >
                                        <FontAwesomeIcon icon={iconSpeding[getIconIndex(spendingData[modalDelete.index].type)].icon} size={32} color={iconSpeding[getIconIndex(spendingData[modalDelete.index].type)].color} />
                                    </View>
                                    <View style={{ flex: 1, padding: 10, paddingRight: 0, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                                            <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(spendingData[modalDelete.index].type)].color }}>{spendingData[modalDelete.index].content}</Text>
                                            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: '#BDBDBD', fontSize: 13 }}>{DayFormat(spendingData[modalDelete.index].date.toDate(), 'DATE')}</Text>
                                                <Text style={{ color: '#BDBDBD', fontSize: 13, marginLeft: 10 }}>{DayFormat(spendingData[modalDelete.index].date.toDate(), 'TIME')}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 20, color: iconSpeding[getIconIndex(spendingData[modalDelete.index].type)].color }}>{spendingData[modalDelete.index].type === 'INCOME' ? '+' : '-'}{numberFormat(spendingData[modalDelete.index].value)}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                    <TouchableOpacity style={[styles.creditBtn, { marginRight: 10, backgroundColor: 'red' }]} onPress={deleteSpeding}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>Xoá</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.creditBtn, { marginLeft: 10, backgroundColor: '#4BB543' }]} onPress={() => setModalVisible(false)}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={styles.endView}>
                            <View style={styles.modalView}>

                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                // style={styles.container}
                                >
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <View style={styles.inner}>
                                            {/* <Text style={styles.header}>Header</Text> */}
                                            <TextInput placeholder="Nội dung chi tiêu" placeholderTextColor="#A5A5A5" style={styles.textInput} defaultValue={modalData.content} onChangeText={newText => setModalData({ ...modalData, content: newText })} />
                                            <TextInput placeholder="Xiền" placeholderTextColor="#A5A5A5" keyboardType='numeric' style={styles.textInput} defaultValue={modalData.value} onChangeText={newText => setModalData({ ...modalData, value: newText })} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                                <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={showDatepicker} style={[styles.buttonPicker, styles.pikerDate]}>
                                        <FontAwesomeIcon icon={faCalendarDay} />
                                        <Text style={{ color: "#A5A5A5" }}>{DayFormat(modalData.date, 'DATE')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={showTimepicker} style={[styles.buttonPicker, styles.pikerTime]}>
                                        <Text style={{ color: "#A5A5A5" }}>{DayFormat(modalData.time, 'TIME')}</Text>
                                        <FontAwesomeIcon icon={faClock} />
                                    </TouchableOpacity>
                                </View>
                                {show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={modalData.date}
                                        mode={mode}
                                        is24Hour={true}
                                        onChange={onChange}
                                    />)}
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    {
                                        iconSpeding.map((item, index) =>
                                            <TouchableOpacity key={item.type + index}
                                                style={[styles.iconBox, modalData.icon === item.type ? styles.iconActive : {}, { backgroundColor: item.backgroundColor },]}
                                                onPress={() => handleIcon(item.type)}
                                            >
                                                <FontAwesomeIcon icon={item.icon} size={32} color={item.color} />
                                            </TouchableOpacity>
                                        )
                                    }
                                    {/* <View style={[styles.iconBox, modalData.icon === MOVING ? styles.iconActive : {}, { backgroundColor: '#FDF7E0' }]}>
                                <FontAwesomeIcon icon={faMotorcycle} size={32} color={'#EB8424'} />
                            </View>
                            <View style={[styles.iconBox, modalData.icon === EATTING ? styles.iconActive : {}, { backgroundColor: '#FDF7E0' }]}>
                                <FontAwesomeIcon icon={faUtensils} size={32} color={'#EB8424'} />
                            </View>
                            <View style={[styles.iconBox, modalData.icon === INCOME ? styles.iconActive : {}, { backgroundColor: '#E1FFE1' }]}>
                                <FontAwesomeIcon icon={faArrowTrendUp} size={32} color={'#23B473'} />
                            </View> */}
                                </View>
                                {/* <Button title="Show date picker!" />
                        <Button onPress={showTimepicker} title="Show time picker!" />
                        <Text>selected: {date.toLocaleString()}</Text> */}
                                <Pressable
                                    style={[styles.button, styles.buttonClose, { marginTop: 'auto' }]}
                                    onPress={handleAddSpending}
                                >
                                    <Text style={styles.textStyle}>Add Spendding</Text>
                                </Pressable>
                            </View>
                        </View>
                }
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
        justifyContent: 'space-around',
        // alignItems: 'center'
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
        justifyContent: "center",
        alignItems: "center",
    },
    endView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        width: '100%',
        height: 350,
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
        marginBottom: 20,
        color: '#000'
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
    },
    iconActive: {
        borderWidth: 1,
        borderColor: '#2196F3'
    },
    creditBtn: {
        flex: 1,
        height: 40,
        backgroundColor: '#4BB543',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }

})

export default Spending;