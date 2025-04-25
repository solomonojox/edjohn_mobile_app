import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Calendar, Agenda, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment-timezone';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

LocaleConfig.locales['en'] = {
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const CalendarScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    );
    const [events, setEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day', 'agenda'

    // Fetch events from your API
    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            // Replace with your actual API call
            const response = await fetch(
                `YOUR_API_ENDPOINT?date=${selectedDate}`,
            );
            const data = await response.json();

            // Process events into the required format
            const processedEvents = {};
            data.forEach(event => {
                const date = moment(event.startTime).format('YYYY-MM-DD');
                if (!processedEvents[date]) {
                    processedEvents[date] = [];
                }
                processedEvents[date].push(event);
            });

            setEvents(processedEvents);
        } catch (error) {
            // console.error('Error fetching events:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [fetchEvents]),
    );

    // Handle date selection
    const handleDayPress = day => {
        setSelectedDate(day.dateString);
        if (viewMode === 'day') {
            // Refresh day view
            fetchEvents();
        }
    };

    // Mark dates with events
    const getMarkedDates = () => {
        const marked = {};
        Object.keys(events).forEach(date => {
            marked[date] = { marked: true, dotColor: colors.primary };
        });
        marked[selectedDate] = {
            ...marked[selectedDate],
            selected: true,
            selectedColor: colors.primary,
        };
        return marked;
    };

    // Render agenda item
    const renderAgendaItem = item => {
        return (
            <TouchableOpacity
                style={[styles.agendaItem, { backgroundColor: colors.card }]}
                onPress={() =>
                    navigation.navigate('EventDetail', { eventId: item.id })
                }>
                <Text style={[styles.agendaItemTitle, { color: colors.text }]}>
                    {item.title}
                </Text>
                <Text style={[styles.agendaItemTime, { color: colors.text }]}>
                    {moment(item.startTime).format('h:mm A')} -{' '}
                    {moment(item.endTime).format('h:mm A')}
                </Text>
            </TouchableOpacity>
        );
    };

    // Render empty date in agenda
    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={{ color: colors.text }}>No events</Text>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}>
            {/* View Mode Selector */}
            <View style={styles.viewModeContainer}>
                {['month', 'week', 'day', 'agenda'].map(mode => (
                    <TouchableOpacity
                        key={mode}
                        style={[
                            styles.viewModeButton,
                            viewMode === mode && {
                                backgroundColor: colors.primary,
                            },
                        ]}
                        onPress={() => setViewMode(mode)}>
                        <Text
                            style={[
                                styles.viewModeText,
                                viewMode === mode && { color: 'white' },
                                { color: colors.text },
                            ]}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <>
                    {viewMode === 'month' && (
                        <Calendar
                            current={selectedDate}
                            onDayPress={handleDayPress}
                            markedDates={getMarkedDates()}
                            theme={{
                                calendarBackground: colors.background,
                                textSectionTitleColor: colors.text,
                                dayTextColor: colors.text,
                                todayTextColor: colors.primary,
                                selectedDayBackgroundColor: colors.primary,
                                selectedDayTextColor: 'white',
                                monthTextColor: colors.text,
                                arrowColor: colors.primary,
                                textDisabledColor: colors.border,
                            }}
                            style={styles.calendar}
                        />
                    )}

                    {viewMode === 'week' && (
                        <Calendar
                            current={selectedDate}
                            onDayPress={handleDayPress}
                            markedDates={getMarkedDates()}
                            theme={{
                                calendarBackground: colors.background,
                                textSectionTitleColor: colors.text,
                                dayTextColor: colors.text,
                                todayTextColor: colors.primary,
                                selectedDayBackgroundColor: colors.primary,
                                selectedDayTextColor: 'white',
                                monthTextColor: colors.text,
                                arrowColor: colors.primary,
                                textDisabledColor: colors.border,
                            }}
                            style={styles.calendar}
                            hideExtraDays={false}
                            enableSwipeMonths={true}
                        />
                    )}

                    {viewMode === 'day' && (
                        <View style={styles.dayViewContainer}>
                            <Text style={[styles.dayViewTitle, { color: colors.text }]}>
                                {moment(selectedDate).format('dddd, MMMM D, YYYY')}
                            </Text>
                            {events[selectedDate] ? (
                                events[selectedDate].map(event => (
                                    <TouchableOpacity
                                        key={event.id}
                                        style={[styles.eventItem, { backgroundColor: colors.card }]}
                                        onPress={() =>
                                            navigation.navigate('EventDetail', { eventId: event.id })
                                        }>
                                        <Text style={[styles.eventTime, { color: colors.text }]}>
                                            {moment(event.startTime).format('h:mm A')} -{' '}
                                            {moment(event.endTime).format('h:mm A')}
                                        </Text>
                                        <Text style={[styles.eventTitle, { color: colors.text }]}>
                                            {event.title}
                                        </Text>
                                        {event.location && (
                                            <Text style={[styles.eventLocation, { color: colors.text }]}>
                                                {event.location}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={[styles.noEventsText, { color: colors.text }]}>
                                    No events scheduled
                                </Text>
                            )}
                        </View>
                    )}

                    {viewMode === 'agenda' && (
                        <Agenda
                            items={events}
                            selected={selectedDate}
                            renderItem={renderAgendaItem}
                            renderEmptyDate={renderEmptyDate}
                            onDayPress={handleDayPress}
                            pastScrollRange={12}
                            futureScrollRange={12}
                            theme={{
                                backgroundColor: colors.background,
                                calendarBackground: colors.background,
                                agendaKnobColor: colors.border,
                                agendaDayTextColor: colors.text,
                                agendaDayNumColor: colors.text,
                                agendaTodayColor: colors.primary,
                                selectedDayBackgroundColor: colors.primary,
                                dotColor: colors.primary,
                            }}
                        />
                    )}
                </>
            )}

            {/* Add Event Button */}
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                // onPress={() => navigation.navigate('AddEvent', { selectedDate })}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewModeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    viewModeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    calendar: {
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayViewContainer: {
        flex: 1,
        padding: 15,
    },
    dayViewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    eventItem: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    eventLocation: {
        fontSize: 14,
        color: '#666',
    },
    noEventsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
    agendaItem: {
        borderRadius: 5,
        padding: 15,
        marginRight: 10,
        marginTop: 17,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    agendaItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    agendaItemTime: {
        fontSize: 14,
        marginTop: 5,
        color: '#666',
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 30,
        color: 'white',
        lineHeight: 32,
    },
});

export default CalendarScreen;