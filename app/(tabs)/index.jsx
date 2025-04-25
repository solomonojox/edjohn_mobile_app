import { useAuth } from '../../context/AuthContext';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

const StudentDashboard = () => {
    const { user } = useAuth();
    
    const navigation = useNavigation();
    const semester = "First Semester 2025/2026";

    const handleRegisterCourse = () => {
        navigation.navigate('/courses/CourseRegistration');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <LinearGradient
                    colors={['#663399', '#d3a7ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.nameText}>{user?.name}</Text>
                            <Text style={styles.semesterText}>{user?.email}</Text>
                        </View>

                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('StudentProfile')}>
                            <Image
                                source={require('../../assets/avatar.png')}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.sectionTitle}>Actions</Text>

                <Link href="/courses/CourseRegistration" asChild>
                    <TouchableOpacity
                        style={styles.actionCard}
                        // onPress={handleRegisterCourse}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#FF9190', '#FFCDA5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconContainer}
                        >
                            <Ionicons name="book" size={32} color="#FFF" />
                        </LinearGradient>

                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Register Course</Text>
                            <Text style={styles.actionDescription}>
                                Browse and select courses for the current semester
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={24} color="#C8C8C8" />
                    </TouchableOpacity>
                </Link>

                <View style={styles.dashboardInfo}>
                    <Ionicons name="information-circle-outline" size={20} color="#888" />
                    <Text style={styles.infoText}>
                        Registration for {semester} is open until May 15, 2025
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        height: 180,
        width: '100%',
    },
    headerGradient: {
        flex: 1,
        paddingTop: 40,
    },
    headerContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    welcomeText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    semesterText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    content: {
        flex: 1,
        marginTop: 10,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 15,
    },
    actionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionInfo: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    actionDescription: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18,
    },
    dashboardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(240, 242, 245, 0.8)',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
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
});

export default StudentDashboard;