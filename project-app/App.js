import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';

export default function App() {
  const [calendarId, setCalendarId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tripAdded, setTripAdded] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    title: 'My Trip',
    startDate: new Date(),
    endDate: new Date(),
    allDay: true, // Set allDay to true for an all-day event
    location: 'Destination City',
    description: 'Trip description',
    timeZone: 'America/New_York',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        setCalendarId(calendars[0].id);
      }
    })();
  }, []);

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    setTripDetails({
      ...tripDetails,
      startDate: selectedDate || tripDetails.startDate,
    });
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    setTripDetails({
      ...tripDetails,
      endDate: selectedDate || tripDetails.endDate,
    });
  };

  const handleTitleChange = (text) => {
    setTripDetails({
      ...tripDetails,
      title: text,
    });
  };

  const handleLocationChange = (text) => {
    setTripDetails({
      ...tripDetails,
      location: text,
    });
  };

  const handleDescriptionChange = (text) => {
    setTripDetails({
      ...tripDetails,
      description: text,
    });
  };

  const addTripToCalendar = async () => {
    if (!calendarId) {
      console.error('Calendar not found');
      return;
    }

    try {
      const eventId = await Calendar.createEventAsync(calendarId, tripDetails);
      console.log(`Event added to calendar with ID: ${eventId}`);
      setTripAdded(true);
      setTimeout(() => {
        setTripAdded(false);
      }, 3000); // Reset the "Added to Calendar" message after 3 seconds
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  const handleImagePick = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else {
        console.log('ImagePicker Response:', response);
        setSelectedImage(response.uri);
        setImageModalVisible(true);
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text>Start Date: {tripDetails.startDate.toDateString()}</Text>
        <Button title="Select Start Date" onPress={showStartDatePickerModal} />

        <Text>End Date: {tripDetails.endDate.toDateString()}</Text>
        <Button title="Select End Date" onPress={showEndDatePickerModal} />

        <Text>Title:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
          onChangeText={handleTitleChange}
          value={tripDetails.title}
        />

        <Text>Location:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
          onChangeText={handleLocationChange}
          value={tripDetails.location}
        />

        <Text>Description:</Text>
        <TextInput
          style={{ height: 80, borderColor: 'gray',
