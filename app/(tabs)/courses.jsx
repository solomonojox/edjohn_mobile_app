import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL
const MyCourses = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    level: '',
    semester: '',
  });
  const [totalUnits, setTotalUnits] = useState(0);

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  useEffect(() => {
    if (studentInfo.level && studentInfo.semester) {
      fetchRegisteredCourses();
    }
  }, [studentInfo.level, studentInfo.semester]);

  useEffect(() => {
    if (courses.length > 0) {
      const units = courses.reduce((sum, course) => sum + parseInt(course.unit || 0), 0);
      setTotalUnits(units);
    }
  }, [courses]);

  const fetchStudentInfo = async () => {
    try {
      const student = await AsyncStorage.getItem('edUserInfo');
      const { level } = JSON.parse(student);

      setStudentInfo({
        level: level,
        semester: '1',
      });
    } catch (err) {
      console.error('Error fetching student info from AsyncStorage:', err);
      setError('Failed to load student information');
    }
  };

  const fetchRegisteredCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('edToken');
      const response = await axios.get(
        `${baseUrl}/api/course/student?level=${studentInfo.level}&semester=${studentInfo.semester}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
        setError('No registered courses found');
      }
    } catch (err) {
      console.error('Error fetching registered courses:', err);
      setError(err.response?.data?.msg || 'Failed to load registered courses');
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegisteredCourses();
  };

  const renderCourseCard = (course, index) => {
    const cardColors = [
      ['#8A2BE2', '#663399'], // Purple
      ['#4169E1', '#0000CD'], // Blue
      ['#008080', '#20B2AA'], // Teal
      ['#FF6347', '#FF4500'], // Tomato
      ['#2E8B57', '#3CB371']  // Sea Green
    ];

    const colorIndex = index % cardColors.length;

    return (
      <LinearGradient
        key={course.courseId || index}
        colors={cardColors[colorIndex]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-4 rounded-xl overflow-hidden shadow-md"
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <Text className="text-black font-bold">{course.code}</Text>
            </View>
            <View className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <Text className="text-black">{course.unit} Units</Text>
            </View>
          </View>

          <Text className="text-white font-bold text-lg mb-1">{course.name}</Text>

          <View className="mt-3 flex-row items-center">
            <Ionicons name="person" size={16} color="rgba(255,255,255,0.8)" />
            <Text className="text-white ml-1">{course.lecturer}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-6">
      {/* <Image 
        source={require('../assets/empty-courses.png')} // You need to add this image to your assets
        className="h-40 w-40 mb-6"
        resizeMode="contain"
      /> */}
      <Text className="text-xl font-bold text-gray-700 mb-2">No Courses Found</Text>
      <Text className="text-gray-500 text-center mb-6">
        You haven't registered for any courses this semester yet.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('courses/CourseRegistration')}
        className="bg-purple-600 py-3 px-6 rounded-xl"
      >
        <Text className="text-white font-bold">Register Courses</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <View className="mx-5 mt-4 shadow-sm z-10 border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
        <Picker
          selectedValue={studentInfo.semester}
          onValueChange={(itemValue) => setStudentInfo({ ...studentInfo, semester: itemValue })}
          style={{ height: 50, width: '100%', borderColor: 'red' }}
          dropdownIconColor="#663399"
        >
          {/* <Picker.Item label="Select Semester" value="" /> */}
          <Picker.Item label="First Semester" value="1" />
          <Picker.Item label="Second Semester" value="2" />
        </Picker>
      </View>

      <View className="bg-white p-5 shadow-sm z-10">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800">My Courses</Text>
            <Text className="text-gray-500">
              Level {studentInfo.level}, Semester {studentInfo.semester}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            className="h-10 w-10 rounded-full bg-purple-100 items-center justify-center"
          >
            <Ionicons name="person" size={20} color="#663399" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#663399" />
          <Text className="mt-4 text-gray-600">Loading your courses...</Text>
        </View>
      ) : error && courses.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <FontAwesome5 name="exclamation-circle" size={50} color="#f43f5e" className="mb-4" />
          <Text className="text-red-500 text-center mb-2">{error}</Text>
          <TouchableOpacity
            onPress={fetchRegisteredCourses}
            className="mt-4 bg-gray-200 py-2 px-4 rounded-lg"
          >
            <Text>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 p-5"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#663399"]} />
          }
        >
          {courses.length > 0 ? (
            <>
              <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#663399" />
                    <Text className="ml-2 text-gray-800 font-medium">Total Courses</Text>
                  </View>
                  <Text className="font-bold text-lg text-purple-800">{courses.length}</Text>
                </View>

                <View className="border-t border-gray-200 my-3" />

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="counter" size={20} color="#663399" />
                    <Text className="ml-2 text-gray-800 font-medium">Total Units</Text>
                  </View>
                  <Text className="font-bold text-lg text-purple-800">{totalUnits}</Text>
                </View>
              </View>

              {courses.map(renderCourseCard)}
            </>
          ) : (
            renderEmptyState()
          )}

          <View className="h-6" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyCourses;