import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
    Alert,
    StatusBar,
    Image,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

// Mock student data
const STUDENT_DATA = {
    id: "10045721",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    program: "Computer Science",
    level: "3rd Year",
    enrollmentDate: "August 2022",
    gpa: "3.8",
    advisorName: "Dr. Emily Richards",
    advisorEmail: "e.richards@university.edu",
    profileImage: null // This would be a URI in a real app
};

const StudentProfileScreen = () => {
    const { logout, user } = useAuth();

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState({
        current: true,
        new: true,
        confirm: true
    });
    const [loading, setLoading] = useState(false);

    const toggleSecureEntry = (field) => {
        setSecureTextEntry({
            ...secureTextEntry,
            [field]: !secureTextEntry[field]
        });
    };

    const handleChangePassword = async () => {
        const value = await AsyncStorage.getItem('edToken');
        // Reset error
        setPasswordError('');

        // Simple validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        setLoading(true)
        try {
            const res = await axios.put(`${baseUrl}/api/User/changePassword`, {
                email: 'solomonakpas@gmail.com',
                currentPassword: currentPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${value}`
                }
            })

            // Mock password change success
            Alert.alert(
                "Password Changed",
                "Your password has been successfully updated.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setPasswordModalVisible(false);
                            resetPasswordFields();
                        }
                    }
                ]
            );
        } catch (error) {
            setPasswordError(error.response.data.msg);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response.data.msg,
            });
        } finally {
            setLoading(false)
        }
    };

    const resetPasswordFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <LinearGradient
                        colors={['#663399', '#04BEFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.profileHeaderGradient}
                    >
                        <View style={styles.profileImageContainer}>
                            {user?.profilePhoto ? (
                                <Image
                                    source={{ uri: STUDENT_DATA.profileImage }}
                                    style={styles?.profilePhoto}
                                />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Text style={styles.profileImagePlaceholderText}>
                                        {user?.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.profileName}>{user?.name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>

                        <View style={styles.profileBadge}>
                            <Text style={styles.profileBadgeText}>{user?.department}</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Student Information</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Student ID</Text>
                            <Text style={styles.infoValue}>{user?.studentId}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Phone Number</Text>
                            <Text style={styles.infoValue}>{user?.phone}</Text>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Level</Text>
                            <Text style={styles.infoValue}>{user?.level}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setPasswordModalVisible(true)}
                    >
                        <View style={styles.actionButtonContent}>
                            <Ionicons name="lock-closed-outline" size={22} color="#663399" />
                            <Text style={styles.actionButtonText}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#CCCCCC" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonLast]}
                        onPress={handleLogout}
                    >
                        <View style={styles.actionButtonContent}>
                            <Ionicons name="log-out-outline" size={22} color="#F5365C" />
                            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#CCCCCC" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Change Password Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={passwordModalVisible}
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.closeModalButton}
                                onPress={() => {
                                    setPasswordModalVisible(false);
                                    resetPasswordFields();
                                }}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Change Password</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <ScrollView style={styles.modalScrollContent}>
                            <View style={styles.passwordFormContainer}>
                                {passwordError ? (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.errorText}>{passwordError}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Current Password</Text>
                                    <View style={styles.passwordInputWrapper}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            secureTextEntry={secureTextEntry.current}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            placeholder="Enter your current password"
                                            placeholderTextColor="#A0A0A0"
                                        />
                                        <TouchableOpacity
                                            style={styles.visibilityButton}
                                            onPress={() => toggleSecureEntry('current')}
                                        >
                                            <Ionicons
                                                name={secureTextEntry.current ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color="#888"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>New Password</Text>
                                    <View style={styles.passwordInputWrapper}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            secureTextEntry={secureTextEntry.new}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder="Enter your new password"
                                            placeholderTextColor="#A0A0A0"
                                        />
                                        <TouchableOpacity
                                            style={styles.visibilityButton}
                                            onPress={() => toggleSecureEntry('new')}
                                        >
                                            <Ionicons
                                                name={secureTextEntry.new ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color="#888"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                                    <View style={styles.passwordInputWrapper}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            secureTextEntry={secureTextEntry.confirm}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            placeholder="Confirm your new password"
                                            placeholderTextColor="#A0A0A0"
                                        />
                                        <TouchableOpacity
                                            style={styles.visibilityButton}
                                            onPress={() => toggleSecureEntry('confirm')}
                                        >
                                            <Ionicons
                                                name={secureTextEntry.confirm ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color="#888"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.passwordRequirements}>
                                    * Password must be at least 8 characters long
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleChangePassword}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Update Password</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContainer: {
        flex: 1,
    },
    profileHeader: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    profileHeaderGradient: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    profileImageContainer: {
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    profileImagePlaceholderText: {
        fontSize: 36,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
    },
    profileBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    profileBadgeText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoItem: {
        marginBottom: 16,
    },
    infoItem: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    actionsSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    actionButtonLast: {
        marginBottom: 0,
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    logoutText: {
        color: '#F5365C',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    closeModalButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalScrollContent: {
        maxHeight: '70%',
    },
    passwordFormContainer: {
        padding: 20,
    },
    errorContainer: {
        backgroundColor: '#FFEBEB',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        color: '#F5365C',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        height: 48,
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: '#333',
    },
    visibilityButton: {
        padding: 8,
    },
    passwordRequirements: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    saveButton: {
        backgroundColor: '#663399',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#663399',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    // Footer navigation
    footer: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingHorizontal: 10,
    },
    navButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    activeNavLabel: {
        color: '#663399',
        fontWeight: '500',
    },
    toast: {
        zIndex: 9999,
        position: 'absolute',
        top: 100,
        left: 16,
        right: 16,
        backgroundColor: '#F5365C',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    }
});

export default StudentProfileScreen;