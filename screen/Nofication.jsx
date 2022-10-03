import React from 'react'
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { SwipeListView } from 'react-native-swipe-list-view';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

const Nofication = () => {
    const data = [
        {
            time: '6:00 PM',
            content: 'Test',
            success: false
        },
        {
            time: '6:00 PM',
            content: 'Test2',
            success: false
        }
    ]
    const Day = new Date()
    const formatDate = (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <StatusBar barStyle="light-content" />
            <CalendarList style={{ width: '100%', marginTop: 30, padding: 0 }}
                horizontal={true}
                pagingEnabled={true}
                markingType={'custom'}
                initialDate={'2022-09-17'}
                markedDates={{
                    '2022-09-17': {
                        // selected: true,
                        customStyles: {
                            container: {
                                backgroundColor: '#1294F2',
                                borderRadius: 10,
                                elevation: 5
                            },
                            text: {
                                color: 'white',
                                fontWeight: 'bold',
                            }
                        },
                        // selectedColor: '#1294F2'
                    },
                    '2022-09-28': {
                        customStyles: {
                            container: {
                                backgroundColor: '#1294F2',
                                borderRadius: 10,
                                elevation: 5
                            },
                            text: {
                                color: 'white',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    // '2022-09-29': { marked: true },
                    // '2022-09-30': { marked: true, dotColor: 'red', activeOpacity: 0 },
                    // '2022-10-01': { disabled: true, disableTouchEvent: true }
                }}
            />
            <View style={[styles.container, {}]}>
                <Text style={{ marginTop: 10, fontSize: 16 }}>{formatDate(Day)}</Text>
                <SwipeListView
                    data={data}
                    renderItem={(item, rowMap) => (
                        <View style={[styles.ListItem]}>
                            <Text>{item.time} | {item.content} in a SwipeListView</Text>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.rowHide}>
                            <View style={styles.rowHideItem}>
                                <TouchableOpacity>
                                    <FontAwesomeIcon icon={faPenToSquare} style={{ color: '#1294F2' }} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    // leftOpenValue={-10}
                    rightOpenValue={-75}
                />
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingLeft: 20,
        paddingRight: 20
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
        marginTop: 20,
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
        width: 65,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // backgroundColor: '#D9D9D9',
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    }
})

export default Nofication