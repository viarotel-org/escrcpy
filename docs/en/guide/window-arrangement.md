---
title: Window Arrangement
---

# Device Window Arrangement Feature Guide

Device Window Arrangement is one of Escrcpy's advanced features, designed specifically for multi-device management and screen space optimization. Through a visual drag-and-drop interface, you can precisely control the position, size, and layout of each device window, enabling efficient multi-device collaborative operations.

## Feature Overview

The Window Arrangement feature provides a fullscreen visual editing interface that allows you to:

- Simultaneously manage the layout of multiple device windows
- Adjust window positions and sizes through drag-and-drop
- Set global default configurations and device-specific configurations
- Preview window layout effects in real-time
- Save and load custom layout schemes

## Core Components

### Global Configuration Component
The global configuration component is used to set default window parameters for all devices, including:
- Default window width and height
- Default window position coordinates
- Other common window properties

### Device Window Component
Each connected device can be added as an independent window component, supporting:
- Independent position and size settings
- Device-specific window configurations
- Inheritance or override of global configurations

## Detailed Operation Guide

### Starting Window Arrangement

1. **Launch from Main Interface**
   - Find the "Arrange" button in the top-right corner of the main interface
   - Click the button to enter window arrangement interface
   - The system will open a fullscreen window arrangement interface

### Adding and Managing Components

#### Adding Global Configuration Component

1. Click the "Add Widget" dropdown button
2. Select "Global Configuration" option
3. The global configuration component will appear in the arrangement area
4. This component is used to set default parameters for all devices

**Note**: Each arrangement scheme can only have one global configuration component.

#### Adding Device Window Components

1. Click the "Add Widget" dropdown button
2. Select the device you want to add from the device list
3. The device window component will be added to the arrangement area
4. Each device can only be added once

**Device Display Rules**:
- Only currently connected devices are displayed
- Already added devices will not appear repeatedly in the dropdown list
- Device names prioritize custom names, followed by device models

### Window Layout Adjustment

#### Moving Window Position

1. **Select Target Window**: Click the window component you want to move
2. **Drag to Move**: Hold down the left mouse button and drag the window to the target position
3. **Real-time Feedback**: You can see real-time position changes during dragging
4. **Release to Position**: Release the mouse to complete position adjustment

#### Adjusting Window Size

1. **Locate Adjustment Point**: Move the mouse to the corner position of the window
2. **Drag to Adjust**: Hold down the left mouse button and drag to change window size
3. **Proportion Constraints**: The system automatically maintains reasonable window proportions
4. **Minimum Size Limit**: Windows cannot be smaller than the preset minimum size

#### Size Limitation Description

- **Minimum Width**: 1/6 of container width
- **Minimum Height**: 1/4 of container height
- **Boundary Constraints**: Windows cannot be dragged outside the arrangement area
- **Overlap Handling**: Windows are allowed to overlap, but complete occlusion should be avoided

### Layout Management Operations

#### Reset Layout

1. Click the "Reset Layout" button in the control panel
2. The system will clear all current components
3. Reload saved layout configurations
4. If no saved configuration exists, an empty arrangement area will be displayed

#### Clear All Components

1. Click the "Clear All" button
2. The system will display a confirmation dialog
3. After confirmation, all window components will be removed
4. The arrangement area will become blank

#### Delete Individual Component

1. Hover the mouse over the target window component
2. Click the delete button (×) in the top-right corner of the window
3. The component will be immediately removed from the arrangement area
4. The corresponding device will reappear in the addable list

## Configuration Saving and Application

### Saving Layout Configuration

1. **Complete Layout Adjustment**: Ensure all window components are adjusted to satisfactory positions and sizes
2. **Click Save Button**: Click the "Save Layout" button at the bottom of the interface
3. **Configuration Writing**: The system will write current layout information to configuration files
4. **Success Feedback**: Display a successful save message prompt

### Configuration Storage Mechanism

- **Global Configuration**: Stored in `scrcpy.global` configuration node
- **Device Configuration**: Stored in `scrcpy.[DeviceID]` configuration node
- **Parameter Format**:
  - `--window-width`: Window width
  - `--window-height`: Window height
  - `--window-x`: Window X coordinate
  - `--window-y`: Window Y coordinate

### Configuration Application Timing

- **When Starting Mirroring**: Automatically apply corresponding window configuration when device starts mirroring
- **Configuration Inheritance**: Device-specific configuration takes priority, unset parameters inherit global configuration
- **Dynamic Updates**: Configuration takes effect immediately after saving, no application restart required

## Troubleshooting

### Common Issues

**Issue 1: Device not showing in add list**
- Confirm device is properly connected
- Check if device is already added to arrangement
- Try refreshing device list

**Issue 2: Window dragging not responsive**
- Confirm mouse click is in draggable area of window
- Check if other programs are occupying mouse events
- Try reopening arrangement interface

**Issue 3: Saved layout not taking effect**
- Confirm "Save Layout" button was clicked
- Check if configuration file has write permissions
- Try restarting application and testing again

**Issue 4: Abnormal window size**
- Check if minimum size limits are exceeded
- Confirm monitor resolution settings are correct
- Try resetting layout and reconfiguring

By properly using the Window Arrangement feature, you can significantly improve multi-device management efficiency and create a personalized operating environment suitable for your workflow.
