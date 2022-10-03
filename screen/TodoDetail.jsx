import React, { useState, useEffect, useRef } from 'react'
import {
    StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, Modal, ScrollView, Animated, I18nManager,
    Pressable, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, SectionList, TouchableHighlight, Button
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { TaskList1 } from '../constant';
import { SwipeListView } from 'react-native-swipe-list-view';
import Loading from './Loading';

import firestore from '@react-native-firebase/firestore';

import { FlatList, RectButton } from 'react-native-gesture-handler';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';

const TodoDetail = ({ route, navigation }) => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState(TaskList1)
    const { itemId } = route.params;
    const [taskList, setTaskList] = useState({})
    const [loading, setLoading] = useState(true)
    const [textInput, setTextInput] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [refesh, setRefesh] = useState(0)
    const SwipeableRef = useRef([])
    console.log(`=> SwipeableRef`, SwipeableRef)

    const [modalData, setModalData] = useState({
        title: '',
        action: '',
        group: 0,
        indexItem: 0
    })
    // Task Group => [Task Title, Task data]
    // Task data => TaskList Item
    const [ADD_GROUP, DELETE_GROUP, EDIT_GROUP, ADD_TASK, EDIT_TASK, DELETE_TASK, EDIT_DELETE] = ['ADD_GROUP', 'EDIT_GROUP', 'DELETE_GROUP', 'ADD_TASK', 'EDIT_TASK', 'DELETE_TASK', 'EDIT_DELETE']

    // Add TaskListItem
    const ModalAddTaskListItem = (index) => {
        setModalData({ ...modalData, action: ADD_TASK, group: index })
        setTextInput('')
        setModalShow(true)
    }
    const handleAddTaskListItem = () => {
        const TaskListItem = taskList.taskGroup[modalData.group].data
        const newTaskItem = {
            task: textInput,
            complete: false
        }
        TaskListItem.push(newTaskItem)
        let taskGroup = taskList.taskGroup
        const title = taskList.taskGroup[modalData.group].title
        taskGroup.splice(modalData.group, 1)
        taskGroup.splice(modalData.group, 0, { title: title, data: [...TaskListItem] })
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        // setTaskList({ ...taskList, taskGroup: taskGroup })
        setModalShow(false)
    }
    // Delete TaskListItem
    const ModalDeleteTaskListItem = (data) => {
        let group = 0
        taskList.taskGroup.forEach((item, index) => {
            if (item.data.indexOf(data) !== -1) {
                group = index
            }
        });
        const indexItem = taskList.taskGroup[group].data.indexOf(data)
        setTextInput(taskList.taskGroup[group].data[indexItem].task)
        setModalData({ ...modalData, action: DELETE_TASK, group: group, indexItem: indexItem })
        setModalShow(true)
    }
    const handleDeleteTaskListItem = () => {
        let TaskListItem = taskList.taskGroup[modalData.group].data
        TaskListItem.splice(modalData.indexItem, 1)
        let taskGroup = taskList.taskGroup
        const title = taskList.taskGroup[modalData.group].title
        taskGroup.splice(modalData.group, 1)
        taskGroup.splice(modalData.group, 0, { title: title, data: [...TaskListItem] })
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        setModalShow(false)
    }
    // EditTaskListItem
    const ModalEditTaskListItem = (data) => {
        setTextInput(data.task)
        let group = 0
        taskList.taskGroup.forEach((item, index) => {
            if (item.data.indexOf(data) !== -1) {
                group = index
            }
        });
        const indexItem = taskList.taskGroup[group].data.indexOf(data)
        setModalData({ ...modalData, action: EDIT_TASK, group: group, indexItem: indexItem })
        setModalShow(true)
    }
    const handleEditTaskListItem = () => {
        let TaskListItem = taskList.taskGroup[modalData.group].data
        const EditTaskItem = {
            task: textInput,
            complete: taskList.taskGroup[modalData.group].data[modalData.indexItem].complete
        }
        TaskListItem.splice(modalData.indexItem, 1)
        TaskListItem.splice(modalData.indexItem, 0, EditTaskItem)
        let taskGroup = taskList.taskGroup
        const title = taskList.taskGroup[modalData.group].title
        taskGroup.splice(modalData.group, 1)
        taskGroup.splice(modalData.group, 0, { title: title, data: [...TaskListItem] })
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        // setTaskList({ ...taskList, taskGroup: taskGroup })
        setModalShow(false)
        console.log(SwipeableRef)
        SwipeableRef.current[modalData.indexItem].close()
        console.log(`=> SwipeableRef[indexItem]`, SwipeableRef[modalData.indexItem])
    }
    // Handle Complete
    const handleTaskListITemComplete = (data, index) => {
        let group = 0
        taskList.taskGroup.forEach((item, index) => {
            if (item.data.indexOf(data) !== -1) {
                group = index
            }
        });
        const indexItem = taskList.taskGroup[group].data.indexOf(data)
        let TaskListItem = taskList.taskGroup[group].data
        const EditTaskItem = {
            task: taskList.taskGroup[group].data[indexItem].task,
            complete: !taskList.taskGroup[group].data[indexItem].complete
        }
        TaskListItem.splice(indexItem, 1)
        TaskListItem.splice(indexItem, 0, EditTaskItem)
        let taskGroup = taskList.taskGroup
        const title = taskList.taskGroup[group].title
        taskGroup.splice(group, 1)
        taskGroup.splice(group, 0, { title: title, data: [...TaskListItem] })
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        // setTaskList({ ...taskList, taskGroup: taskGroup })
        setModalShow(false)
    }
    // Add Task Group
    const ModalAddTaskGroup = () => {
        setTextInput('')
        setModalData({ ...modalData, action: ADD_GROUP })
        setModalShow(true)
    }
    const AddTaskGroup = () => {
        const newGroup = {
            title: textInput,
            data: []
        }
        // setTaskList({ ...taskList, taskGroup:  })
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: [...taskList.taskGroup, newGroup]
            })
        setRefesh(refesh + 1)
        setModalShow(false)
    }
    const handleChooseAction = (index) => {
        setModalData({ ...modalData, action: EDIT_DELETE, group: index })
        setModalShow(true)
    }
    const ModalEditTaskGroup = () => {
        setTextInput(taskList.taskGroup[modalData.group].title)
        setModalData({ ...modalData, action: EDIT_GROUP })
        setModalShow(true)
    }
    const EditTitleTaskGroup = () => {
        let taskGroup = taskList.taskGroup
        const NewTitle = {
            title: textInput,
            data: taskGroup[modalData.group].data
        }
        taskGroup.splice(modalData.group, 1)
        taskGroup.splice(modalData.group, 0, NewTitle)
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        // setTaskList({ ...taskList, taskGroup: taskGroup })
        setModalShow(false)
    }
    const ModalDeleteTaskGroup = () => {
        setTextInput(taskList.taskGroup[modalData.group].title)
        setModalData({ ...modalData, action: DELETE_GROUP })
        setModalShow(true)
    }
    const DeleteTaskGroup = () => {
        let taskGroup = taskList.taskGroup
        taskGroup.splice(modalData.group, 1)
        firestore()
            .collection('Todo')
            .doc(itemId)
            .update({
                taskGroup: taskGroup
            })
        setRefesh(refesh + 1)
        // setTaskList({ ...taskList, taskGroup: taskGroup })
        setModalShow(false)
    }
    const getTaskDetail = async () => {
        const data = await firestore().collection('Todo').doc(itemId).get()
        setTaskList(data._data)
        setLoading(false)
    }
    useEffect(() => {
        getTaskDetail()
    }, [itemId, refesh])

    if (loading) {
        return <Loading />
    }
    // let row: Array<any> = [];
    // const [refsArray, setRefsArray] = useState([])
    // let refsArray = []
    const renderRightAction = (progress, item, index) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0],
        });
        return (
            <View style={{ width: 64, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
                <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
                    <View style={[styles.rowHideItem, { marginTop: 20 }]}>
                        <TouchableOpacity onPress={() => ModalEditTaskListItem(item)}>
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: '#1294F2' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => ModalDeleteTaskListItem(item)}>
                            <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar barStyle="auto" hidden={true} />
            <View style={[styles.container, { height: '100%' }]}>
                <TouchableOpacity onLongPress={ModalAddTaskGroup} >
                    <Text style={{ fontSize: 25, marginTop: 20, color: '#000' }}>Tiêu đề task</Text>
                </TouchableOpacity>
                <GestureHandlerRootView>
                    <SectionList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        sections={taskList.taskGroup.map((section, index) => ({ ...section, index }))}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item, index }) => (
                            <Swipeable
                                ref={ref => SwipeableRef.current[index] = ref}
                                friction={2}
                                leftThreshold={30}
                                rightThreshold={64}
                                // renderLeftActions={renderLeftActions}
                                renderRightActions={(progress) => renderRightAction(progress, item, index)}
                            >
                                <View style={[styles.ListItem, { marginTop: 20 }]}>
                                    <Text style={{ fontSize: 15, fontWeight: '400', color: '#000', textDecorationLine: item.complete ? 'line-through' : 'none' }}>{item.task}</Text>
                                    <TouchableOpacity style={{
                                        width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: '#000',
                                        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                    }} onPress={() => handleTaskListITemComplete(item, index)} >
                                        <FontAwesomeIcon icon={faCheck} style={{ display: item.complete ? "flex" : 'none' }} />
                                    </TouchableOpacity>
                                </View>
                            </Swipeable>
                        )}
                        renderSectionHeader={({ section }) => (
                            <View View style={{ display: 'flex', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity onLongPress={() => handleChooseAction(section.index)} >
                                    <Text style={{ fontSize: 20, color: '#1294F2', textTransform: 'capitalize' }}>{section.title}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttonAdd, { marginRight: 10 }]} onPress={() => ModalAddTaskListItem(section.index)}>
                                    <FontAwesomeIcon icon={faPlus} size={12} color='#FFF' />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </GestureHandlerRootView>
            </View >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalShow}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalShow(!modalShow);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {modalData.action === DELETE_TASK ?
                            <View>
                                <Text>Bạn có muốn xoá task: {" "}
                                    {textInput}
                                </Text>
                                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose, { flex: 1, marginRight: 10 }]}
                                        onPress={() => setModalShow(!modalShow)}
                                    >
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose, { flex: 1, marginLeft: 10, backgroundColor: 'red' }]}
                                        onPress={handleDeleteTaskListItem}
                                    >
                                        <Text style={styles.textStyle}>Remove</Text>
                                    </Pressable>
                                </View>
                            </View>
                            : modalData.action === DELETE_GROUP ?
                                <View>
                                    <Text>Bạn có muốn xoá nhóm task này: {" "}
                                        {textInput}
                                    </Text>
                                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose, { flex: 1, marginRight: 10 }]}
                                            onPress={() => setModalShow(!modalShow)}
                                        >
                                            <Text style={styles.textStyle}>Cancel</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose, { flex: 1, marginLeft: 10, backgroundColor: 'red' }]}
                                            onPress={DeleteTaskGroup}
                                        >
                                            <Text style={styles.textStyle}>Remove</Text>
                                        </Pressable>
                                    </View>
                                </View> :
                                modalData.action === EDIT_DELETE ?
                                    <View>
                                        <Text>Bạn có muốn làm gì:
                                        </Text>
                                        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose, { flex: 1, marginRight: 10 }]}
                                                onPress={() => setModalShow(!modalShow)}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose, { flex: 1, backgroundColor: '#4BB543' }]}
                                                onPress={ModalEditTaskGroup}>
                                                <Text style={styles.textStyle}>Edit</Text>
                                            </Pressable>
                                            <Pressable
                                                style={[styles.button, styles.buttonClose, { flex: 1, marginLeft: 10, backgroundColor: 'red' }]}
                                                onPress={ModalDeleteTaskGroup}>
                                                <Text style={styles.textStyle}>Remove</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    : <View>
                                        <KeyboardAvoidingView
                                            behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                <View style={styles.inner}>
                                                    {/* <Text style={styles.header}>Header</Text> */}
                                                    <TextInput placeholder="Task" style={styles.textInput} defaultValue={textInput} onChangeText={(newText) => setTextInput(newText)} />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </KeyboardAvoidingView>
                                        {
                                            modalData.action === EDIT_TASK ?
                                                <Pressable
                                                    style={[styles.button, styles.buttonClose, {}]}
                                                    onPress={handleEditTaskListItem}>
                                                    <Text style={styles.textStyle}>Edit Task</Text>
                                                </Pressable>
                                                : modalData.action === ADD_GROUP ?
                                                    <Pressable
                                                        style={[styles.button, styles.buttonClose, {}]}
                                                        onPress={AddTaskGroup}>
                                                        <Text style={styles.textStyle}>Add Task Group</Text>
                                                    </Pressable>
                                                    : modalData.action === EDIT_GROUP ?
                                                        <Pressable
                                                            style={[styles.button, styles.buttonClose, {}]}
                                                            onPress={EditTitleTaskGroup}>
                                                            <Text style={styles.textStyle}>Edit Title Task Group</Text>
                                                        </Pressable>
                                                        :
                                                        <Pressable
                                                            style={[styles.button, styles.buttonClose, {}]}
                                                            onPress={handleAddTaskListItem}>
                                                            <Text style={styles.textStyle}>Add Task</Text>
                                                        </Pressable>
                                        }
                                    </View>
                        }
                    </View>
                </View>
            </Modal >
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        position: 'relative'
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
    checkbox: {
        alignSelf: "center",
    },
    ListItem: {
        width: '100%',
        height: 50,
        backgroundColor: '#F8F8F8',
        borderRadius: 5,
        // marginTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    rowHide: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        marginTop: 20,
        // backgroundColor: '#D9D9D9',
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        zIndex: 10
    },
    rowHideItem: {
        width: 64,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    buttonAdd: {
        width: 20,
        height: 20,
        backgroundColor: '#1294F2',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '90%',
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
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
    actionText: {
        height: 50
    },
    rectButton: {
        flex: 1,
        height: 80,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
    },
    fromText: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    messageText: {
        color: '#999',
        backgroundColor: 'transparent',
    },
    dateText: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        top: 10,
        color: '#999',
        fontWeight: 'bold',
    },

})

export default TodoDetail;