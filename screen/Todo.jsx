import React, { useState, useEffect, useRef } from 'react'
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, Modal, Pressable, TouchableOpacity, Button,
    Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, ToastAndroid, ScrollView
} from 'react-native'

import { barData, barData2, pieData, DayFormat, TaskList1 } from '../constant';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClipboardCheck, faClipboardQuestion, faAngleRight, faPlus, faCalendarDay, faBell, faBellSlash, faCheck, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import DateTimePicker from '@react-native-community/datetimepicker';

import firestore from '@react-native-firebase/firestore';
import Loading from './Loading';

// import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Todo = ({ navigation, route }) => {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const [TaskList, setTaskList] = useState([])
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState('date');
    const [refesh, setRefesh] = useState(0)
    const [modalData, setModalData] = useState({
        id: '',
        action: '',
        titleTask: '',
        date: '',
        notification: false,
    })
    const initState = {
        id: '',
        action: '',
        titleTask: '',
        date: '',
        notification: false,
    }
    const handleModalTask = (data) => {
        setModalData({
            ...modalData,
            id: data._id,
            titleTask: data.titleTask,
            date: data.date.toDate(),
            notification: data.notification,
            taskGroup: data.taskGroup,
            action: 'CHOOSE'
        })
        setModalVisible(true)
    }
    const handleModalDelete = () => {
        setModalData({ ...modalData, action: 'DELETE' })
        setModalVisible(true)
    }
    const handleDelete = () => {
        firestore()
            .collection('Todo')
            .doc(modalData.id)
            .delete()
            .then(() => {
                // console.log('Todo deleted!');
                ToastAndroid.show('Đã xoá Task', ToastAndroid.SHORT);
                setRefesh(refesh + 1)
                setModalVisible(false)
                setModalData(initState)
            });
    }
    const handleModalEdit = () => {
        setModalData({ ...modalData, action: 'EDIT' })
        setModalVisible(true)
    }
    const handleEdit = () => {
        firestore()
            .collection('Todo')
            .doc(modalData.id)
            .update({
                titleTask: modalData.titleTask,
                notification: modalData.notification,
                date: modalData.date,
            })
            .then(() => {
                // console.log('Todo update!');
                ToastAndroid.show('Đã update!', ToastAndroid.SHORT);
                setRefesh(refesh + 1)
                setModalVisible(false)
                setModalData(initState)
            });
    }
    const handleModalAdd = () => {
        setModalData({ ...modalData, action: 'ADD', date: new Date() })
        setModalVisible(true)
    }
    const handleCancel = () => {
        setModalVisible(false)
        setModalData(initState)
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        // setDate(currentDate);
        setModalData({ ...modalData, date: currentDate })
    };
    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
        }
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };
    const showTimepicker = () => {
        showMode('time');
    };
    const handleCreateTask = () => {
        if (modalData.titleTask.length !== 0) {
            firestore()
                .collection('Todo')
                .add({
                    "titleTask": modalData.titleTask,
                    "date": modalData.date,
                    "notification": modalData.notification,
                    "taskGroup": []
                })
                .then(() => {
                    // console.log('Todo added!');
                    ToastAndroid.show('Đã Thêm!', ToastAndroid.SHORT);
                    setRefesh(refesh + 1)
                    setModalData(initState)
                    setModalVisible(!modalVisible)
                });
        } else {
            // console.log('Todo title < 0!');
            ToastAndroid.show('Có gì đó sai sai!', ToastAndroid.SHORT);
        }
    }
    const countComplete = (data) => {
        let count = 0
        data.forEach((items) => {
            items.data.forEach(item => {
                if (item.complete) {
                    count += 1
                }
            })
        })
        return count
    }
    const countPending = (data) => {
        let count = 0
        data.forEach((items) => {
            items.data.forEach(item => {
                if (!item.complete) {
                    count += 1
                }
            })
        })
        return count
    }
    const schedulePushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Deadline tới đít rùi!📬",
                // body: 'Deadline tới đít rùi!',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 2 },
        });
    }
    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }
    const pushNotification = () => {

    }
    useEffect(() => {
        firestore()
            .collection('Todo')
            .get()
            .then(querySnapshot => {
                let taskList = []
                querySnapshot.forEach(documentSnapshot => {
                    const Task = {
                        _id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    }
                    taskList.push(Task)
                });
                setTaskList(taskList)
                setLoading(false)
            });
    }, [refesh])


    if (loading) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: '#FFF' }}>
            <StatusBar barStyle="auto" hidden />
            {/* <Button
                title="Press to schedule a notification"
                onPress={async () => {
                    await schedulePushNotification();
                }}
            /> */}
            <ScrollView style={{}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <View style={[styles.container, { marginBottom: 50 }]}>
                    <Text style={{ fontSize: 25, marginTop: 15, color: '#000' }}>Task List</Text>
                    {
                        TaskList.map((item, index) =>
                            <TouchableOpacity key={index} style={[styles.shadow,
                            {
                                width: '100%', height: 100, backgroundColor: 'white', borderRadius: 5,
                                padding: 10, marginTop: 20, display: 'flex', flexDirection: 'row',
                                justifyContent: 'space-between', alignItems: 'center', zIndex: 100,
                                // borderColor: 'gray', borderWidth: 1
                            }]}
                                onLongPress={() => handleModalTask(item)}
                                onPress={() => navigation.navigate('TodoDetail', {
                                    itemId: item._id,
                                })}>
                                <View style={{ width: '90%', height: '100%', display: 'flex', zIndex: 100 }}>
                                    <Text style={{ width: '100%', fontSize: 15, color: '#000' }}>{item.titleTask}</Text>
                                    <View style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                <View style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: '#E1FFE1', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <FontAwesomeIcon icon={faClipboardCheck} style={{ fontSize: 10, color: '#23B473' }} size={15} />
                                                </View>
                                                <Text style={{ marginLeft: 10, color: '#23B473' }}>Complete {countComplete(item.taskGroup)}</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: '#FFE1E1', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <FontAwesomeIcon icon={faClipboardQuestion} style={{ fontSize: 10, color: '#FF0000' }} size={13} />
                                                </View>
                                                <Text style={{ marginLeft: 10, color: '#FF0000' }}>Pending  {countPending(item.taskGroup)}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                {item.notification ?
                                                    <FontAwesomeIcon icon={faBell} style={{ fontSize: 20, color: '#000' }} size={15} />
                                                    : <FontAwesomeIcon icon={faBellSlash} style={{ fontSize: 20, color: '#000' }} size={15} />
                                                }
                                                <Text style={{ marginLeft: 10, color: '#000' }}>{DayFormat(item.date.toDate(), 'DATE')}</Text>
                                                {/* <View style={{ width: 20, height: 20, borderRadius: 5, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                </View> */}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: '10%' }}>
                                    <FontAwesomeIcon icon={faAngleRight} size={30} />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {/* <FlatList
                    data={TaskList}
                    renderItem={(item, index) => <Task item={item} index={index} />}
                    keyExtractor={item => item.id}
                /> */}
                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.shadow, {
                width: 50, height: 50, backgroundColor: '#1294F2', display: 'flex', justifyContent: 'center',
                alignItems: 'center', borderRadius: 20, position: 'absolute', bottom: 50, right: 20, zIndex: 10
            }]}
                onPress={handleModalAdd} >
                <FontAwesomeIcon icon={faPlus} size={35} color='#FFF' />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }} >
                {
                    modalData.action === 'CHOOSE' ?
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView2, styles.shadow]}>
                                <View style={{ width: '100%', height: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#000' }}>Task: </Text>
                                    <Text style={{ color: '#000' }}>{modalData.titleTask}</Text>
                                </View>
                                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#1294F2' }]} onPress={handleModalEdit}>
                                        <FontAwesomeIcon icon={faPenToSquare} color={'#FFF'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.creditBtn, { marginLeft: 10, marginRight: 10, backgroundColor: 'red' }]} onPress={handleModalDelete} >
                                        <FontAwesomeIcon icon={faTrash} color={'#FFF'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#4BB543' }]} onPress={handleCancel}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        : modalData.action === 'DELETE' ?
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView2, styles.shadow]}>
                                    <View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Text style={{ color: '#000' }}>Bạn có muốn xoá Task: </Text>
                                        <Text style={{ color: '#000' }}>{modalData.titleTask}</Text>
                                    </View>
                                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                        <TouchableOpacity style={[styles.creditBtn, { marginRight: 10, backgroundColor: 'red' }]} onPress={handleDelete} >
                                            <Text style={{ color: 'white', fontWeight: '600' }}>Xoá</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.creditBtn, { marginLeft: 10, backgroundColor: '#4BB543' }]} onPress={handleCancel}>
                                            <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : modalData.action === 'EDIT' ?
                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView2, styles.shadow, { height: 250 }]}>
                                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <View style={{}}>
                                                    <Text style={{ marginBottom: 5 }}>Tiêu đề Task</Text>
                                                    <TextInput placeholder="Tiêu đề Task" placeholderTextColor="#A5A5A5" style={styles.textInput} defaultValue={modalData.titleTask} onChangeText={(newText) => setModalData({ ...modalData, titleTask: newText })} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </KeyboardAvoidingView>
                                        <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity onPress={showDatepicker} style={[styles.buttonPicker, styles.pikerDate]}>
                                                <FontAwesomeIcon icon={faCalendarDay} />
                                                <Text style={{ color: '#000' }}>{DayFormat(modalData.date, 'DATE')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.buttonPicker, styles.pikerTime]} onPress={() => setModalData({ ...modalData, notification: !modalData.notification })}>
                                                <FontAwesomeIcon icon={faBell} />
                                                <View style={{
                                                    width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#000',
                                                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    <FontAwesomeIcon icon={faCheck} style={{ display: modalData.notification ? "flex" : 'none' }} />
                                                </View>
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
                                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                            <TouchableOpacity style={[styles.creditBtn, { backgroundColor: '#1294F2' }]} onPress={handleEdit}>
                                                <FontAwesomeIcon icon={faPenToSquare} color={'#FFF'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.creditBtn, { marginLeft: 10, backgroundColor: '#4BB543' }]} onPress={handleCancel}>
                                                <Text style={{ color: 'white', fontWeight: '600' }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View> :
                                <View style={styles.endView}>
                                    <View style={[styles.modalView, styles.shadow]}>
                                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <View style={styles.inner}>
                                                    <Text style={{ marginBottom: 5 }}>Tiêu đề Task</Text>
                                                    <TextInput placeholderTextColor="#A5A5A5" placeholder="Tiêu đề Task" style={styles.textInput}
                                                        defaultValue={modalData.titleTask} onChangeText={(newText) => setModalData({ ...modalData, titleTask: newText })} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </KeyboardAvoidingView>
                                        <View style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity onPress={showDatepicker} style={[styles.buttonPicker, styles.pikerDate]}>
                                                <FontAwesomeIcon icon={faCalendarDay} />
                                                <Text style={{ color: '#000' }}>{DayFormat(modalData.date, 'DATE')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.buttonPicker, styles.pikerTime]} onPress={() => setModalData({ ...modalData, notification: !modalData.notification })}>
                                                <FontAwesomeIcon icon={faBell} />
                                                <View style={{
                                                    width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#000',
                                                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                                }} >
                                                    <FontAwesomeIcon icon={faCheck} style={{ display: modalData.notification ? "flex" : 'none' }} />
                                                </View>
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
                                        <Pressable
                                            style={[styles.button, styles.buttonClose, { marginTop: 'auto' }]}
                                            onPress={handleCreateTask}
                                        >
                                            <Text style={styles.textStyle}>Add Task</Text>
                                        </Pressable>
                                    </View>
                                </View>
                }
            </Modal>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,

    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
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
        height: 250,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    modalView2: {
        width: '90%',
        height: 150,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
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
export default Todo;