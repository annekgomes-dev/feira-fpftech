import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AttendancesStudentsService } from '../services/AttendancesStudentsService';
import { Icon } from 'react-native-elements';

const Item = ({ item }) => {
    return (
        <View style={[styles.listItem, styles.listContainer]}>
            <Text numberOfLines={1} style={styles.listTitle}>{item.student_name}</Text>
            <Text style={styles.listInfo}>{item.status}</Text>
        </View>
    );
}

export function AttendancesStudentsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [attendancesStudents, setAttendancesStudents] = useState([]);

    const { attendanceId, attendanceDate, classroomName } = route.params;

    const attendancesStudentsService = AttendancesStudentsService();


    useEffect(() => {
        loadAttendancesStudents();
    }, []);

    const loadAttendancesStudents = () => {
        attendancesStudentsService.getAttendancesStudents(attendanceId, (data) => {
            setAttendancesStudents(data);
        });
    };

    const filteredAttendancesStudents = attendancesStudents.filter(att =>
        att.student_name.toLowerCase().includes(search.toLowerCase()) ||
        att.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name='arrow-left' type='font-awesome' size={24} color='#6b6b6b' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Chamada {classroomName} - {attendanceDate}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Aluno ou Status'
                    />
                </View>
                <FlatList
                    data={filteredAttendancesStudents}
                    renderItem={({ item }) => (<Item item={item} />)}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight: 8,
        paddingLeft: 8,
    },
    list: {
        flex: 1,
    },
    title: {
        maxWidth: '80%',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6b6b6b',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#e8e8e8',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#6b6b6b',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    modalText: {
        fontSize: 16,
    },
    modalInput: {
        width: '100%',
        height: 50,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 12,
        paddingLeft: 8,
    },
    modalButtonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    addButton: {
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        borderRadius: 5,
        backgroundColor: '#4a90e2',
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    safeButton: {
        backgroundColor: '#679289',
    },
    dangerButton: {
        backgroundColor: '#d9534f',
    },
    cancelButton: {
        backgroundColor: '#b8b8b899',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    listContainer: {
        backgroundColor: '#679289',
        marginBottom: 10,
        borderRadius: 10
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 80,
    },
    listTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        width: '68%',
    },
    listInfo: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listAction: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        gap: 20
    },
    listButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    optionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 30,
        height: 30
    },
    menuOption: {
        flexDirection: 'row',
        gap: 10,
        padding: 10,
    },
    menuText: {
        color: '#6b6b6b',
    }
});
