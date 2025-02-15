import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StudentsService } from '../services/StudentsService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent }) => {
    return (
        <TouchableOpacity style={styles.listContainer} onPress={onPress}>
            <View style={styles.listItem}>
                <Text numberOfLines={1} style={styles.listTitle}>{item.name}</Text>
                <View style={styles.listAction}>
                    {
                        selected === item.id && (
                            <>
                                <Pressable style={styles.listButton} onPress={() => setModalContent('updateStudent', item)}>
                                    <Icon name='pencil' type='font-awesome' color='white' />
                                </Pressable>
                                <Pressable style={styles.listButton} onPress={() => setModalContent('viewStudent', item)}>
                                    <Icon name='eye' type='font-awesome' color='white' />
                                </Pressable>
                                <Pressable style={styles.listButton} onPress={() => setModalContent('deleteStudent', item)}>
                                    <Icon name='trash' type='font-awesome' color='white' />
                                </Pressable>
                            </>
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function StudentsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [totalAttendance, setTotalAttendance] = useState('');
    const [totalAbsence, setTotalAbsence] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [students, setStudents] = useState([]);
    const [modalContent, setModalContent] = useState('');

    const studentsService = StudentsService();

    const { classroomId, classroomName } = route.params;

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        studentsService.getStudents(classroomId, (data) => {
            setStudents(data);
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase())
    );


    function addStudent(name) {
        if (!name) return;
        studentsService.addStudent(classroomId, name, () => {
            loadStudents();
            Alert.alert('', 'Aluno adicionado com sucesso!');
        });
    }

    function updateStudent(id, name, feedback) {
        if (!name) return;
        if (!feedback) feedback = 'Nenhuma Observação.';
        studentsService.updateStudent(id, classroomId, name, feedback, () => {
            loadStudents();
            Alert.alert('', 'Aluno atualizado com sucesso!');
        });
    }

    function deleteStudent(id) {
        studentsService.deleteStudent(id, () => {
            loadStudents();
            Alert.alert('', 'Aluno excluído com sucesso!');
        });
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        if (content === 'addStudent') {
            setName('');
            setFeedback('');
        } else {
            setId(item.id);
            setName(item.name);
            setFeedback(item.feedback);
            setTotalAttendance(item.total_attendance);
            setTotalAbsence(item.total_absence);
        }
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name='arrow-left' type='font-awesome' size={24} color='#6b6b6b' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Alunos - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Aluno'
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => handleModalContent('addStudent')}>
                        <Icon name='plus-square' type='font-awesome' color='white' />
                        <Text style={styles.addButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredStudents}
                    renderItem={({ item }) => (
                        <Item
                            item={item}
                            selected={selectedItem}
                            onPress={() => handleSelectedItem(item)}
                            setModalContent={(content, item) => handleModalContent(content, item)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {modalContent === 'addStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Adicionar Aluno</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        addStudent(name)
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                {modalContent === 'updateStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Aluno</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <TextInput
                                textAlignVertical='top'
                                multiline={true}
                                numberOfLines={4}
                                style={styles.modalTextArea}
                                onChangeText={setFeedback}
                                value={feedback}
                                placeholder='Observação'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        updateStudent(id, name, feedback);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                {modalContent === 'viewStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Detalhes</Text>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalLabel}>Nome</Text>
                                <Text style={styles.modalText}>{name}</Text>
                                <Text style={styles.modalLabel}>Total de Presenças</Text>
                                <Text style={styles.modalText}>{totalAttendance}</Text>
                                <Text style={styles.modalLabel}>Total de Faltas</Text>
                                <Text style={styles.modalText}>{totalAbsence}</Text>
                                <Text style={styles.modalLabel}>Observação</Text>
                                <Text style={styles.modalText}>{feedback}</Text>
                            </View>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                {modalContent === 'deleteStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Excluir Aluno</Text>
                            <Text style={styles.modalText}>Deseja realmente excluir este aluno?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.dangerButton]}
                                    onPress={() => {
                                        deleteStudent(id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Excluir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
    modalContent: {
        width: '100%',
        alignItems: 'flex-start',
    },
    modalTitle: {
        color: '#6b6b6b',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    modalLabel: {
        color: 'gray',
        fontSize: 16,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
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
    modalTextArea: {
        width: '100%',
        height: 100,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 12,
        padding: 10,
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
        backgroundColor: '#b8b8b8',
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
        width: '68%'
    },
    listAction: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        gap: 10
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
