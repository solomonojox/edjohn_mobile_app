import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    StatusBar
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from '@/services/useFetch';
import { fetchDepartments } from "@/services/api";

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

const CourseRegistration = () => {
    const { data: departments, loading: departmentLoading } = useFetch(() => fetchDepartments());
    const [year, setYear] = useState('');
    const [level, setLevel] = useState('');
    const [department, setDepartment] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalUnits, setTotalUnits] = useState(0);

    const levels = ['100', '200', '300', '400'];
    const semesters = ['1', '2'];
    // const departments = ['Computer Science', 'Engineering', 'Biochemistry'];

    useEffect(() => {
        // Calculate total units whenever selected courses change
        if (courses.length > 0) {
            const units = courses
                .filter(course => selectedCourses.includes(course.courseId))
                .reduce((sum, course) => sum + parseInt(course.unit), 0);
            setTotalUnits(units);
        }
    }, [selectedCourses, courses]);

    const fetchCourses = async () => {
        if (level && department && year) {
            setLoading(true);
            try {
                setErrorMsg('');
                const response = await axios.get(
                    `${baseUrl}/api/course/getCoursesByLevelAndSemesterAndDepartment?level=${level}&semester=${year}&department=${encodeURIComponent(department)}`
                );
                setCourses(response.data.data);
                setSelectedCourses([]);
            } catch (error) {
                console.error('Error fetching courses:', error);
                if (error.response?.data?.msg) {
                    setErrorMsg(error.response.data.msg);
                } else {
                    setErrorMsg('Failed to fetch courses. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert('Missing Fields', 'Please select semester, level, and department before searching.');
        }
    };

    const toggleCourseSelection = (code) => {
        if (selectedCourses.includes(code)) {
            setSelectedCourses(selectedCourses.filter(id => id !== code));
        } else {
            setSelectedCourses([...selectedCourses, code]);
        }
    };

    const getSelectedCourseDetails = () => {
        return courses.filter(course => selectedCourses.includes(course.code));
    };

    const registerCourses = async () => {
        const token = await AsyncStorage.getItem('edToken');
        Alert.alert(
            'Confirm Registration',
            'Are you sure you want to register selected courses?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const payload = { codes: selectedCourses };
                            // console.log(payload, 'payload');
                            // Replace with your actual endpoint
                            const res = await axios.post(`${baseUrl}/api/course/student/register-courses`, payload, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            // console.log(res.data, 'res');
                            Alert.alert('Success', 'Courses registered successfully');
                            setSelectedCourses([]);
                            setModalVisible(false);
                        } catch (err) {
                            console.error(err);
                            const msg = err.response?.data?.message || 'Failed to register courses';
                            Alert.alert('Error', msg);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const renderPickerWithLabel = (label, value, setter, items, placeholder) => (
        <View className="mb-2">
            <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
            <View className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                <Picker
                    selectedValue={value}
                    onValueChange={setter}
                >
                    <Picker.Item label={placeholder} value="" />
                    {items.map((item) => <Picker.Item key={item} label={item} value={item} />)}
                </Picker>
            </View>
        </View>
    );

    const renderCourseCard = (course) => {
        const isSelected = selectedCourses.includes(course.code);

        return (
            <TouchableOpacity
                key={course.courseId}
                onPress={() => toggleCourseSelection(course.code)}
                className={`mb-4 rounded-xl shadow-sm overflow-hidden border ${isSelected ? 'border-primary' : 'border-gray-200'}`}
            >
                <LinearGradient
                    colors={isSelected ? ['#8a2be2', '#663399'] : ['#ffffff', '#f9f9f9']}
                    className="p-4"
                >
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                {course.code}
                            </Text>
                            <Text className={`font-medium text-base ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                {course.name}
                            </Text>
                            <Text className={`mt-1 ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                                Unit: {course.unit} • {course.lecturer}
                            </Text>
                        </View>
                        <View className={`h-8 w-8 rounded-full border-2 justify-center items-center ${isSelected ? 'border-white bg-white' : 'border-gray-300 bg-white'}`}>
                            {isSelected && <Ionicons name="checkmark" size={16} color="#663399" />}
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View className="flex-1 p-5">
                <View className="flex-row items-center justify-between mb-2">
                    {selectedCourses.length > 0 && (
                        <View className="flex-row justify-between items-center w-full ">
                            <Text className="text-xl font-bold text-gray-800">Selected Courses</Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                className="flex-row items-center bg-purple-100 px-4 py-2 rounded-full"
                            >
                                <FontAwesome5 name="clipboard-list" size={14} color="#663399" />
                                <Text className="text-primary font-medium ml-2">{selectedCourses.length} Selected</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Selection Form Area */}
                {!selectedCourses.length && (
                    <View className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
                        {renderPickerWithLabel('Semester', year, setYear, semesters, 'Select Semester')}
                        {renderPickerWithLabel('Level', level, setLevel, levels, 'Select Level')}
                        <View className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 mb-3">
                            <Picker
                                selectedValue={department}
                                onValueChange={(itemValue) => setDepartment(itemValue)}
                            >
                                <Picker.Item label="Select Department" value="" />
                                {departmentLoading ? (
                                    <Picker.Item label="Loading..." value="" />
                                ) : (
                                    departments?.map((dept) => (
                                        <Picker.Item key={dept.departmentId} label={dept.name} value={dept.name} />
                                    ))
                                )}
                            </Picker>
                        </View>

                        <TouchableOpacity
                            onPress={fetchCourses}
                            disabled={!year || !level || !department || loading}
                            className={`py-4 rounded-xl shadow-sm ${year && level && department ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text className="text-white text-center font-bold">Search Courses</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Error Message */}
                {errorMsg !== '' && (
                    <View className="bg-red-100 p-3 rounded-xl mb-4">
                        <Text className="text-red-700">{errorMsg}</Text>
                    </View>
                )}

                {/* Course List */}
                {courses.length > 0 && (
                    <ScrollView className="mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Available Courses</Text>
                            <Text className="text-sm text-gray-600">{courses.length} courses found</Text>
                        </View>

                        {courses.map(renderCourseCard)}
                    </ScrollView>
                )}
            </View>

            {/* Selected Courses Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-end">
                    <View className="bg-white rounded-t-3xl p-5 h-3/4">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Selected Courses</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View className="bg-purple-50 rounded-xl p-4 mb-4 flex-row justify-between">
                            <Text className="text-primary font-medium">Total Courses: {selectedCourses.length}</Text>
                            <Text className="text-primary font-medium">Total Units: {totalUnits}</Text>
                        </View>

                        <ScrollView className="flex-1 mb-4">
                            {getSelectedCourseDetails().map((course, index) => (
                                <View key={course.courseId} className="flex-row items-center p-4 border-b border-gray-200">
                                    <View className="h-10 w-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                                        <Text className="font-bold text-primary">{index + 1}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold text-gray-800">{course.code} - {course.name}</Text>
                                        <Text className="text-gray-600">Unit: {course.unit} • {course.lecturer}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => toggleCourseSelection(course.code)}>
                                        <Ionicons name="trash-outline" size={20} color="#f43f5e" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            onPress={registerCourses}
                            className="bg-primary py-4 rounded-xl shadow-lg"
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text className="text-white text-center font-bold">Register Selected Courses</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CourseRegistration;