import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Mouse Control Component
export const MouseControl = ({ onMouseMove, onLeftClick, onRightClick }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  
  const handleTouchStart = (e) => {
    setStartX(e.nativeEvent.pageX);
    setStartY(e.nativeEvent.pageY);
  };
  
  const handleTouchMove = (e) => {
    const deltaX = e.nativeEvent.pageX - startX;
    const deltaY = e.nativeEvent.pageY - startY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      onMouseMove(deltaX, deltaY);
      setStartX(e.nativeEvent.pageX);
      setStartY(e.nativeEvent.pageY);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mouse Control</Text>
      
      <View 
        style={styles.touchpad}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <Text style={styles.touchpadText}>Touchpad Area</Text>
        <Text style={styles.touchpadSubtext}>Slide your finger to move the cursor</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.leftClickButton]} 
          onPress={onLeftClick}
        >
          <MaterialIcons name="touch-app" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Left Click</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.rightClickButton]} 
          onPress={onRightClick}
        >
          <MaterialIcons name="more-vert" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Right Click</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Keyboard Control Component
export const KeyboardControl = ({ onKeyPress }) => {
  const keyRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
  ];
  
  const specialKeys = [
    { key: 'space', label: 'Space', icon: 'space-bar' },
    { key: 'backspace', label: 'Backspace', icon: 'backspace' },
    { key: 'enter', label: 'Enter', icon: 'keyboard-return' },
    { key: 'tab', label: 'Tab', icon: 'keyboard-tab' }
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyboard Control</Text>
      
      <View style={styles.keyboard}>
        {keyRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.keyRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => onKeyPress(key)}
              >
                <Text style={styles.keyText}>{key.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <View style={styles.specialKeysRow}>
          {specialKeys.map(({ key, label, icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.key, styles.specialKey]}
              onPress={() => onKeyPress(key)}
            >
              <MaterialIcons name={icon} size={18} color="#ffffff" />
              <Text style={styles.keyText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Media Controls Component
export const MediaControls = ({ onMediaCommand }) => {
  const mediaCommands = [
    { command: 'play_pause', icon: 'play-pause', label: 'Play/Pause' },
    { command: 'stop', icon: 'stop', label: 'Stop' },
    { command: 'previous', icon: 'skip-previous', label: 'Previous' },
    { command: 'next', icon: 'skip-next', label: 'Next' },
    { command: 'volume_up', icon: 'volume-up', label: 'Volume Up' },
    { command: 'volume_down', icon: 'volume-down', label: 'Volume Down' },
    { command: 'mute', icon: 'volume-mute', label: 'Mute' },
    { command: 'fullscreen', icon: 'fullscreen', label: 'Fullscreen' }
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Controls</Text>
      
      <View style={styles.mediaControlsGrid}>
        {mediaCommands.map(({ command, icon, label }) => (
          <TouchableOpacity
            key={command}
            style={styles.mediaButton}
            onPress={() => onMediaCommand(command)}
          >
            <MaterialIcons name={icon} size={28} color="#ffffff" />
            <Text style={styles.mediaButtonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B3E',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  touchpad: {
    height: 250,
    backgroundColor: '#3D2B4E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  touchpadText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchpadSubtext: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    backgroundColor: '#6A3E94',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftClickButton: {
    backgroundColor: '#6A3E94',
  },
  rightClickButton: {
    backgroundColor: '#562B82',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  keyboard: {
    backgroundColor: '#3D2B4E',
    borderRadius: 12,
    padding: 10,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    backgroundColor: '#562B82',
    width: width / 12,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  keyText: {
    color: '#ffffff',
    fontSize: 14,
  },
  specialKeysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  specialKey: {
    width: width / 5,
    height: 50,
    backgroundColor: '#4A2694',
  },
  mediaControlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaButton: {
    width: '48%',
    backgroundColor: '#562B82',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaButtonText: {
    color: '#ffffff',
    marginTop: 8,
  },
});
