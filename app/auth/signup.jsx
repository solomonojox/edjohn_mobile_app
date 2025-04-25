import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import useFetch from '@/services/useFetch';
import { fetchDepartments } from "@/services/api";
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

const SignupScreen = () => {
  const { data: departments, loading: departmentLoading } = useFetch(() => fetchDepartments());
  const navigation = useNavigation();
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Error states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [studentIdError, setStudentIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [levelError, setLevelError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateStudentId = (id) => {
    const re = /^\d{8}$/;
    return re.test(id);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSignup = async () => {
    let isValid = true;

    // Full Name validation
    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (fullName.trim().length < 3) {
      setFullNameError('Full name must be at least 3 characters');
      isValid = false;
    } else {
      setFullNameError('');
    }

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Student ID validation
    if (!studentId) {
      setStudentIdError('Student ID is required');
      isValid = false;
    } else {
      setStudentIdError('');
    }

    // Level validation
    if (!level) {
      setLevelError('Level is required');
      isValid = false;
    } else {
      setLevelError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      setLoading(true);
      try {
        const res = await axios.post(`${baseUrl}/api/User/registerUser`, {
          name: fullName,
          email,
          phone,
          studentId,
          password,
          profilePhoto: '',
          department,
          level,
        });

        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: res.data.msg,
        });

        setTimeout(() => {
          navigation.navigate('auth/login');
        }, 1500);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data?.msg || 'Registration failed',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderInput = (placeholder, value, setValue, error, setError, secureEntry = false, keyboardType = 'default', autoCapitalize = 'none') => {
    return (
      <View className="mb-4 w-full">
        <View className={`relative w-full ${error ? 'mb-1' : ''}`}>
          <TextInput
            className="w-full py-5 bg-white border rounded-xl px-4 text-gray-800 focus:border-purple-500"
            style={{ borderColor: error ? '#ff3b30' : '#e5e7eb' }}
            placeholder={placeholder}
            value={value}
            onChangeText={(text) => {
              setValue(text);
              if (setError) setError('');
            }}
            secureTextEntry={secureEntry && secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
          />
          {secureEntry && (
            <TouchableOpacity 
              onPress={toggleSecureEntry} 
              className="absolute right-3 top-3"
            >
              <Ionicons
                name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
        {error ? <Text className="text-red-500 text-xs ml-1">{error}</Text> : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <Toast />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          <View className="items-center mb-4 sticky top-20 bg-white z-10">
            <Image
              source={require('../../assets/logo.png')}
              className="w-20 h-20"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-800 mt-2">Create Account</Text>
            <Text className="text-gray-500 text-center mt-1 mb-6">Fill in your details to get started</Text>
          </View>

          {renderInput("Full Name", fullName, setFullName, fullNameError, setFullNameError, false, 'default', 'words')}
          {renderInput("Student ID", studentId, setStudentId, studentIdError, setStudentIdError)}

          <View className="mb-4 w-full">
            <View className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <Picker
                selectedValue={department}
                onValueChange={(itemValue) => setDepartment(itemValue)}
                // style={{ }}
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
          </View>

          {renderInput("Level", level, setLevel, levelError, setLevelError)}
          {renderInput("Phone Number", phone, setPhone, null, null, false, 'phone-pad')}
          {renderInput("Email Address", email, setEmail, emailError, setEmailError, false, 'email-address')}
          {renderInput("Password", password, setPassword, passwordError, setPasswordError, true)}
          {renderInput("Confirm Password", confirmPassword, setConfirmPassword, confirmPasswordError, setConfirmPasswordError, true)}

          <TouchableOpacity 
            onPress={handleSignup}
            className="w-full h-14 bg-primary rounded-xl justify-center items-center mt-4 mb-6"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-white font-bold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('auth/login')}>
              <Text className="text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;