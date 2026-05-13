### Setup and Development Commands

Source: https://vueuse.org/contributing

Commands for installing dependencies and starting the local development server.

```bash
pnpm install
```

```bash
pnpm dev
```

--------------------------------

### Setup and Usage of useAuth

Source: https://vueuse.org/firebase/useauth

Demonstrates how to initialize Firebase, get the auth instance, and use the useAuth composable to manage authentication state and user information. Includes a button to trigger Google Sign-In.

```vue
<script setup lang="ts">
import { 
useAuth
 } from '@vueuse/firebase/useAuth'
import { 
initializeApp
 } from 'firebase/app'
import { 
getAuth
,
GoogleAuthProvider
,
signInWithPopup
 } from 'firebase/auth'

const 
app
 =
initializeApp
({ /* config */ })
const 
auth
 =
getAuth
(
app
)
const { 
isAuthenticated
,
user
 } =
useAuth
(
auth
)

const 
signIn
 =
() =>
signInWithPopup
(
auth
, new
GoogleAuthProvider
())
</script>

<template>
  <pre v-if="
isAuthenticated
">{{ 
user
 }}</pre>
  <div v-else>
    <button @click="
signIn
">
      Sign In with Google
    </button>
  </div>
</template>
```

--------------------------------

### Installation

Source: https://vueuse.org/electron/README

Install the @vueuse/electron package along with electron itself.

```APIDOC
## Install

```bash
npm i @vueuse/electron electron
```
```

--------------------------------

### useVModel with Options API

Source: https://vueuse.org/core/useVModel

This example shows how to use useVModel within the Options API setup function. It demonstrates accessing and updating the bound value.

```typescript
import {
useVModel
} from '@vueuse/core'

export default {

setup
(
props
, { 
emit
 })
{
    const 
data
 =
useVModel
(
props
, 'data',
emit
)

    
console
.
log
(
data
.
value
) // props.data
    
data
.
value
 = 'foo' // emit('update:data', 'foo')
  },
}

```

--------------------------------

### Basic Usage Example

Source: https://vueuse.org/core/useFileDialog

A simple example demonstrating how to use `useFileDialog` to open a file dialog for image files.

```APIDOC
## Example: Basic File Dialog

### Description
This example shows how to use `useFileDialog` to open a file dialog that accepts only image files and logs the selected files.

### Code
```vue
<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'image/*',
  directory: false, // Set to true to select directories
})

onChange((newFiles) => {
  if (newFiles) {
    console.log('Selected files:', newFiles)
    // Do something with the selected files
  }
})

onCancel(() => {
  console.log('File dialog cancelled')
  // Handle cancellation
})
</script>

<template>
  <button type="button" @click="open()">
    Choose Image File
  </button>
  <button type="button" @click="reset()" :disabled="!files">
    Reset Selection
  </button>

  <div v-if="files">
    <h3>Selected Files:</h3>
    <ul>
      <li v-for="file in files" :key="file.name">{{ file.name }} ({{ file.size }} bytes)</li>
    </ul>
  </div>
</template>
```
```

--------------------------------

### Buffer Input Example

Source: https://vueuse.org/core/useBase64

Example of a buffer input.

```text
new ArrayBuffer(1024)
```

--------------------------------

### Install useQRCode dependency

Source: https://vueuse.org/integrations/useQRCode

Install the required qrcode package before using the integration.

```bash
npm i qrcode@^1
```

--------------------------------

### Install @vueuse/math

Source: https://vueuse.org/math/readme

Use this command to install the math extension along with the core VueUse library.

```bash
npm i @vueuse/math @vueuse/core
```

--------------------------------

### Install Sortable.js

Source: https://vueuse.org/integrations/useSortable

Install the necessary Sortable.js library using npm.

```bash
npm i sortablejs@^1
```

--------------------------------

### Install @vueuse/rxjs

Source: https://vueuse.org/rxjs/readme

Install the package and its peer dependency using npm.

```bash
npm i @vueuse/rxjs rxjs
```

--------------------------------

### Usage Example

Source: https://vueuse.org/math/logicAnd

Example demonstrating how to use the logicAnd function with `whenever`.

```APIDOC
## Usage Example

### Description
This example shows how to use `logicAnd` in conjunction with `whenever` to trigger a callback when multiple conditions become true.

### Method
N/A (Illustrative Example)

### Endpoint
N/A

### Parameters
N/A

### Request Example
```ts
import { ref, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'

const a = ref(true)
const b = ref(false)

whenever(logicAnd(a, b), () => {
  console.log('both a and b are now truthy!')
})

// To make the console.log appear, you would need to set 'a.value = true' and 'b.value = true'
```

### Response
N/A
```

--------------------------------

### Advanced Usage Example

Source: https://vueuse.org/core/useFileDialog

An example demonstrating advanced `useFileDialog` options like multiple file selection and initial files.

```APIDOC
## Example: Advanced File Dialog Options

### Description
This example demonstrates using `useFileDialog` with options for multiple file selection and setting initial files.

### Code
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFileDialog } from '@vueuse/core'

const initialFileList = ref<File[]>([]) // Example: You might fetch this from an API

const { files, open, reset } = useFileDialog({
  multiple: true, // Allow multiple file selection
  accept: '.pdf, .doc, .docx',
  initialFiles: initialFileList.value, // Set initial files
  directory: false,
})

// You can also open with specific options overriding the initial ones
const openSpecific = () => {
  open({
    accept: 'text/plain',
    multiple: false,
  })
}
</script>

<template>
  <button type="button" @click="open()">
    Choose Documents (Multiple)
  </button>
  <button type="button" @click="openSpecific()">
    Choose Text File (Single)
  </button>
  <button type="button" @click="reset()" :disabled="!files">
    Reset Selection
  </button>

  <div v-if="files && files.length > 0">
    <h3>Selected Files:</h3>
    <ul>
      <li v-for="file in files" :key="file.name">{{ file.name }}</li>
    </ul>
  </div>
</template>
```
```

--------------------------------

### Install focus-trap

Source: https://vueuse.org/integrations/useFocusTrap

Install the focus-trap library, which is a peer dependency for useFocusTrap.

```bash
npm i focus-trap@^7
```

--------------------------------

### Install change-case

Source: https://vueuse.org/integrations/useChangeCase

Install the change-case package as a dependency.

```bash
npm i change-case@^5
```

--------------------------------

### Use useWindowSize in Vue Script Setup

Source: https://vueuse.org/core/useWindowSize

Import and use the `useWindowSize` composable in your Vue script setup to get reactive window width and height. No additional setup is required.

```vue
<script setup lang="ts">
import { 
useWindowSize
 } from '@vueuse/core'

const { 
width
,
height
 } = 
useWindowSize
()
</script>

<template>
  <
div
>
    Width: {{ 
width
 }}
    Height: {{ 
height
 }}
  </
div
>
</template>
```

--------------------------------

### Install @vueuse/integrations

Source: https://vueuse.org/integrations/README

Install the @vueuse/integrations package using npm.

```bash
npm i @vueuse/integrations
```

--------------------------------

### Start and Preview Screen Share Stream

Source: https://vueuse.org/core/useDisplayMedia

Demonstrates how to use useDisplayMedia to start a screen share stream and preview it on a video element. Ensure the video element is correctly referenced using useTemplateRef.

```vue
<script setup lang="ts">
import { 
useDisplayMedia
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const { 
stream
,
start
 } = 
useDisplayMedia
()

// start streaming

start
()

const 
videoRef
 = 
useTemplateRef
('video')

watchEffect
(() => {
  // preview on a video element
  
videoRef
.value.srcObject = 
stream
.
value

})
</script>

<template>
  <video 
ref
="
video
" />
</template>
```

--------------------------------

### Install @vueuse/core and @vueuse/components

Source: https://vueuse.org/guide/components

Install the necessary packages for using VueUse core functionalities and its component library.

```bash
npm i @vueuse/core @vueuse/components
```

--------------------------------

### Install NProgress

Source: https://vueuse.org/integrations/useNProgress

Install the required nprogress dependency.

```bash
npm i nprogress@^0
```

--------------------------------

### HTML Output for Custom Configuration

Source: https://vueuse.org/core/useDark

Shows the resulting HTML structure when using the custom configuration example.

```html
<!--light-->
<html>
  <body color-scheme="light">
    ...
  </body>
</html>

<!--dark-->
<html>
  <body color-scheme="dark">
    ...
  </body>
</html>
```

--------------------------------

### Initialize and commit manual ref history

Source: https://vueuse.org/core/useManualRefHistory

Demonstrates basic setup using shallowRef and manual commit to record snapshots.

```typescript
import { 
useManualRefHistory
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
counter
 = 
shallowRef
(0)
const { 
history
, 
commit
, 
undo
, 
redo
 } = 
useManualRefHistory
(
counter
)


counter
.
value
 += 1

commit
()


console
.
log
(
history
.
value
)
/* [
  { snapshot: 1, timestamp: 1601912898062 },
  { snapshot: 0, timestamp: 1601912898061 }
] */
```

--------------------------------

### Install VueUse Core

Source: https://vueuse.org/guide

Install the core package via npm.

```bash
npm i @vueuse/core
```

--------------------------------

### useVModels - Options API Usage

Source: https://vueuse.org/core/usevmodels

Illustrates how to integrate `useVModels` within Vue's Options API. This example shows how to access and modify props using `useVModels` within the `setup` function.

```APIDOC
## useVModels - Options API

### Description
Usage of `useVModels` within the Options API.

### Method
Options API with `setup` function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useVModels } from '@vueuse/core'

export default {
  props: {
    foo: String,
    bar: Number,
  },
  setup(props, { emit }) {
    const { foo, bar } = useVModels(props, emit)

    console.log(foo.value) // props.foo
    foo.value = 'foo' // emit('update:foo', 'foo')
  },
}
```

### Response
#### Success Response (200)
Provides reactive references for props that can be manipulated within the Options API setup.

#### Response Example
```json
{
  "foo": "",
  "bar": 0
}
```
```

--------------------------------

### Provide SSR Width - App Instance Example

Source: https://vueuse.org/core/useSSRWidth

Example of how to provide the SSR width when creating the Vue application instance.

```APIDOC
## Provide SSR Width - App Instance

### Description
This example demonstrates how to use `provideSSRWidth` when initializing your Vue application to set a global SSR viewport width.

### Method
`provideSSRWidth`

### Endpoint
N/A (Composable function)

### Parameters
- **width** (number) - The SSR viewport width (e.g., 500).
- **app** (App) - The Vue application instance.

### Request Example
```ts
import { createApp } from 'vue'
import App from './App.vue'
import { provideSSRWidth } from '@vueuse/core'

const app = createApp(App)

// Provide a global SSR width of 500px
provideSSRWidth(500, app)

app.mount('#app')
```
```

--------------------------------

### useSortable Return Values (TypeScript)

Source: https://vueuse.org/integrations/useSortable

TypeScript example demonstrating the usage of `start`, `stop`, and `option` functions returned by `useSortable` for controlling and querying the Sortable instance.

```typescript
const { 
start
,
stop
,
option
 } = useSortable(el, list)

// Stop sorting

stop
()

// Start sorting again

start
()

// Get/set options

option
('animation', 200) // set
const 
animation
 = 
option
('animation') // get
```

--------------------------------

### useNProgress with Progress Percentage

Source: https://vueuse.org/integrations/useNProgress

This example shows how to initialize and control the progress bar with a specific percentage.

```APIDOC
## useNProgress with Progress Percentage

### Description
Initialize the progress bar to a specific percentage and manually set it to completion.

### Method
`useNProgress`

### Endpoint
N/A (Composable function)

### Parameters
- **currentProgress** (MaybeRefOrGetter<number | null | undefined>) - Optional. The initial progress percentage (0 to 1).

### Request Example
```typescript
import { useNProgress } from '@vueuse/integrations/useNProgress'

const { progress } = useNProgress(0.5)

function done() {
  progress.value = 1.0
}
```

### Response
- **progress** (Ref<number | null | undefined>) - A ref that holds the current progress percentage.

### Response Example
```json
{
  "progress": 1.0
}
```
```

--------------------------------

### Track Document Visibility in Script Setup

Source: https://vueuse.org/core/useDocumentVisibility

Import and use the `useDocumentVisibility` composable in your script setup to get a reactive reference to the document's visibility state. No additional setup is required.

```vue
<script setup lang="ts">
import { 
useDocumentVisibility
 } from '@vueuse/core'

const 
visibility
 = 
useDocumentVisibility
()
</script>
```

--------------------------------

### Install @vueuse/electron

Source: https://vueuse.org/electron/README

Install the @vueuse/electron package along with electron itself to use its features.

```bash
npm i @vueuse/electron electron
```

--------------------------------

### useSortable Return Values (JavaScript)

Source: https://vueuse.org/integrations/useSortable

JavaScript example illustrating how to use the `start`, `stop`, and `option` functions returned by `useSortable` to manage the Sortable.js instance.

```javascript
'use strict'
const { start, stop, option } = useSortable(el, list)
// Stop sorting
stop()
// Start sorting again
start()
// Get/set options
option('animation', 200) // set
const animation = option('animation') // get
```

--------------------------------

### useFuse Usage Example

Source: https://vueuse.org/integrations/useFuse

A basic example demonstrating how to use the useFuse composable with a list of strings and a shallowRef for input.

```APIDOC
## Usage

```ts
import { useFuse } from '@vueuse/integrations/useFuse'
import { shallowRef } from 'vue'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = shallowRef('Jhon D')

const { results } = useFuse(input, data)

/*
 * Results:
 *
 * { "item": "John Doe", "index": 1 }
 * { "item": "John Smith", "index": 0 }
 * { "item": "Jane Doe", "index": 2 }
 *
 */
```
```

--------------------------------

### useTimeout with Controls

Source: https://vueuse.org/shared/useTimeout

This example shows how to use `useTimeout` with the `controls` option enabled, exposing `start`, `stop`, and `isPending` functions.

```APIDOC
## useTimeout with Controls

### Description

This example demonstrates using `useTimeout` with the `controls` option set to `true`. This exposes additional functions to manually control the timeout, such as starting, stopping, and checking its pending state.

### Method

`useTimeout`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```ts
import { useTimeout } from '@vueuse/core'

const { ready, start, stop, isPending } = useTimeout(1000, { controls: true })

// Check if timeout is pending
console.log(isPending.value) // true

// Stop the timeout
stop()

// Start/restart the timeout
start()
```

### Response

#### Success Response (200)

- **ready** (ComputedRef<boolean>) - A computed ref that becomes `true` after the timeout duration.
- **start** (Function) - A function to start or restart the timeout.
- **stop** (Function) - A function to stop the timeout.
- **isPending** (ComputedRef<boolean>) - A computed ref indicating if the timeout is currently active.

#### Response Example

```json
{
  "ready": false,
  "isPending": true
}
```
```

--------------------------------

### Form state example

Source: https://vueuse.org/core/useStepper

Example of the form state object used in the wizard demo.

```json
{
  "firstName": "Jon",
  "lastName": "",
  "billingAddress": "",
  "contractAccepted": false,
  "carbonOffsetting": false,
  "payment": "credit-card"
}
```

--------------------------------

### Basic useSwipe Setup

Source: https://vueuse.org/core/useSwipe

Set up useSwipe to detect swipes on an element. Import useSwipe and useTemplateRef, then bind the element to the ref.

```vue
<script setup lang="ts">
import { 
useSwipe
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')
const { 
isSwiping
, 
direction
 } = 
useSwipe
(
el
)
</script>

<template>
  <
div
 
ref
="
el
">
    Swipe here
  </
div>
</template>

```

--------------------------------

### Basic usePointer Usage

Source: https://vueuse.org/core/usePointer

Import and use the `usePointer` function to get reactive references for pointer coordinates and pressure. No additional setup is required.

```typescript
import {
usePointer
} from '@vueuse/core'

const { 
x
, 
y
, 
pressure
, 
pointerType
 } = 
usePointer
()
```

--------------------------------

### Install universal-cookie

Source: https://vueuse.org/integrations/useCookies

Install the required dependency for useCookies.

```bash
npm i universal-cookie@^7
```

--------------------------------

### More Examples

Source: https://vueuse.org/shared/until

Provides various examples of using `until` with different matching conditions like `toBe`, `toMatch`, `changed`, `toBeTruthy`, `toBeNull`, and negation.

```APIDOC
## More Examples

### Description
Illustrates various use cases for the `until` function, including checking for specific values, value changes, truthiness, nullity, and using negation.

### Method
`until(ref).toBe(true)`
`until(ref).toMatch(v => v > 10 && v < 100)`
`until(ref).changed()`
`until(ref).changedTimes(10)`
`until(ref).toBeTruthy()`
`until(ref).toBeNull()`
`until(ref).not.toBeNull()`
`until(ref).not.toBeTruthy()`

### Endpoint
N/A (Composition API function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
await until(ref).toBe(true)
await until(ref).toMatch(v => v > 10 && v < 100)
await until(ref).changed()
await until(ref).changedTimes(10)
await until(ref).toBeTruthy()
await until(ref).toBeNull()
await until(ref).not.toBeNull()
await until(ref).not.toBeTruthy()
```

### Response
#### Success Response (200)
N/A (This is a client-side composition function)

#### Response Example
N/A
```

--------------------------------

### useCookies API

Source: https://vueuse.org/integrations/useCookies

This section details the useCookies composable, its installation, and various usage examples.

```APIDOC
## useCookies

### Description
Wrapper for `universal-cookie`. Provides a convenient way to access and modify cookies using Vue Composition API.

### Install
```bash
npm i universal-cookie@^7
```

### Usage
#### Common Usage
```vue
<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['locale'])
</script>

<template>
  <div>
    <strong>locale</strong>: {{ cookies.get('locale') }}
    <hr>
    <pre>{{ cookies.getAll() }}</pre>
    <button @click="cookies.set('locale', 'ru-RU')">Russian</button>
    <button @click="cookies.set('locale', 'en-US')">English</button>
  </div>
</template>
```

### Options
Access and modify cookies using vue composition-api.

```typescript
const { get, getAll, set, remove, addChangeListener, removeChangeListener } = useCookies(['cookie-name'], {
  doNotParse: false,
  autoUpdateDependencies: false
})
```

#### `dependencies` (optional)
Let you optionally specify a list of cookie names your component depend on or that should trigger a re-render. If unspecified, it will render on every cookie change.

#### `options` (optional)
* `doNotParse` (boolean = false): do not convert the cookie into an object no matter what. **Passed as default value to`get`/`getAll` methods.**
* `autoUpdateDependencies` (boolean = false): automatically add cookie names ever provided to `get` method. If **true** then you don't need to care about provided `dependencies`.

### `cookies` (optional)
Let you provide a `universal-cookie` instance (creates a new instance by default)
> Info about methods available in the universal-cookie api docs

## `createCookies([req])`
Create a `universal-cookie` instance using request (default is window.document.cookie) and returns `useCookies` function with provided universal-cookie instance
* req (object): Node's http.IncomingMessage request object
```

--------------------------------

### Configuring useAsyncState options

Source: https://vueuse.org/core/useAsyncState

Provides a comprehensive example of available configuration options for useAsyncState.

```ts
const { 
state
 } = useAsyncState(promise, initialState, {
  // Execute immediately on creation (default: true)
  
immediate
: true,
  // Delay before first execution in ms (default: 0)
  
delay
: 0,
  // Reset state to initial before each execution (default: true)
  
resetOnExecute
: true,
  // Use shallowRef for state (default: true)
  
shallow
: true,
  // Throw errors instead of catching them (default: false)
  
throwError
: false,
  // Called when promise resolves
  
onSuccess
(
data
) {
    
console
.
log
('Success:', 
data
)
  },
  // Called when promise rejects
  
onError
(
error
) {
    
console
.
error
('Error:', 
error
)
  },
})
```

```js
'use strict'
const { state } = useAsyncState(promise, initialState, {
  // Execute immediately on creation (default: true)
  immediate: true,
  // Delay before first execution in ms (default: 0)
  delay: 0,
  // Reset state to initial before each execution (default: true)
  resetOnExecute: true,
  // Use shallowRef for state (default: true)
  shallow: true,
  // Throw errors instead of catching them (default: false)
  throwError: false,
  // Called when promise resolves
  onSuccess(data) {
    console.log('Success:', data)
  },
  // Called when promise rejects
  onError(error) {
    console.error('Error:', error)
  },
})
```

--------------------------------

### Basic useDropZone Setup

Source: https://vueuse.org/core/usedropzone

Set up a drop zone element and handle dropped files. Specify accepted data types and whether multiple files are allowed. The `isOverDropZone` ref indicates when the cursor is within the drop zone.

```vue
<script setup lang="ts">
import {
  useDropZone
} from '@vueuse/core'
import {
  useTemplateRef
} from 'vue'

const 
dropZoneRef
 = 
useTemplateRef
('dropZoneRef')

function 
onDrop
(
files
: File[] | null) {
  // called when files are dropped on zone
}

const { 
isOverDropZone
 } = 
useDropZone
(
dropZoneRef
, {
  
onDrop
,
  // specify the types of data to be received.
  
dataTypes
: ['image/jpeg'],
  // control multi-file drop
  
multiple
: true,
  // whether to prevent default behavior for unhandled events
  
preventDefaultForUnhandled
: false,
})
</script>

<template>
  <
div
 
ref
="
dropZoneRef
">
    Drop files here
  </
div
>
</template>

```

--------------------------------

### Install Fuse.js

Source: https://vueuse.org/integrations/usefuse

Install the required peer dependency for the useFuse composable.

```bash
npm install fuse.js@^7
```

```bash
yarn add fuse.js
```

--------------------------------

### Install @vueuse/firebase

Source: https://vueuse.org/firebase/README

Install the package along with the required firebase dependency.

```bash
npm i @vueuse/firebase firebase
```

--------------------------------

### Basic useNow Usage

Source: https://vueuse.org/core/usenow

Import and use the useNow function to get a reactive Date instance. No additional setup is required.

```typescript
import {
useNow
} from '@vueuse/core'

const
now
=
useNow()

```

--------------------------------

### useAxios Basic Usage

Source: https://vueuse.org/integrations/useAxios

Demonstrates the basic setup for useAxios to fetch data from a given URL.

```APIDOC
## useAxios Basic Usage

### Description
This snippet shows the fundamental way to use the `useAxios` composable to fetch data from an API endpoint. It automatically triggers the request when the component is mounted if a URL is provided.

### Method
GET (default)

### Endpoint
`/api/posts`

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { data, isFinished } = useAxios('/api/posts')
```

### Response
#### Success Response (200)
- **data** (Ref<T>) - Response data
- **response** (Ref<AxiosResponse>) - Full axios response
- **isFinished** (Ref<boolean>) - Request has completed (success or error)

#### Response Example
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
```

--------------------------------

### Install jwt-decode dependency

Source: https://vueuse.org/integrations/useJwt

Install the required peer dependency for useJwt.

```bash
npm install jwt-decode@^4
```

--------------------------------

### useBluetooth - Battery Level Example

Source: https://vueuse.org/core/useBluetooth

An advanced example demonstrating how to read the battery level from a Bluetooth device and listen for changes using the useBluetooth composable.

```APIDOC
## useBluetooth with Battery Service

### Description
This example shows how to use `useBluetooth` to connect to a device, access the 'battery_service', read the 'battery_level' characteristic, and set up a listener for value changes.

### Method
N/A (Composable function)

### Endpoint
N/A (Composable function)

### Parameters
#### Options Object
- **acceptAllDevices** (boolean) - Optional - If true, all devices will be accepted. Defaults to false.
- **optionalServices** (string[]) - Required for this example - `['battery_service']` to access battery information.

### Return Values
- **isSupported** (ComputedRef<boolean>) - Whether the Web Bluetooth API is supported.
- **isConnected** (Ref<boolean>) - Whether a device is currently connected.
- **device** (Ref<BluetoothDevice>) - The connected Bluetooth device.
- **server** (Ref<BluetoothRemoteGATTServer>) - The GATT server for the connected device.
- **requestDevice** (() => Promise<void>) - Function to request a Bluetooth device.

### Request Example
```javascript
import { useBluetooth, useEventListener, watchPausable } from '@vueuse/core'
import { ref } from 'vue'

const { isSupported, isConnected, device, requestDevice, server } = useBluetooth({
  acceptAllDevices: true,
  optionalServices: ['battery_service'],
})

const batteryPercent = ref<undefined | number>()
const isGettingBatteryLevels = ref(false)

async function getBatteryLevels() {
  isGettingBatteryLevels.value = true
  const batteryService = await server.getPrimaryService('battery_service')
  const batteryLevelCharacteristic = await batteryService.getCharacteristic('battery_level')

  useEventListener(batteryLevelCharacteristic, 'characteristicvaluechanged', (event) => {
    batteryPercent.value = event.target.value.getUint8(0)
  }, { passive: true })

  const batteryLevel = await batteryLevelCharacteristic.readValue()
  batteryPercent.value = await batteryLevel.getUint8(0)
}

const { stop } = watchPausable(isConnected, (newIsConnected) => {
  if (!newIsConnected || !server.value || isGettingBatteryLevels.value)
    return
  getBatteryLevels()
  stop()
})
```

### Response
#### Success Response (Battery Level Read)
- **batteryPercent** (number | undefined) - The current battery percentage.

#### Response Example
```json
{
  "batteryPercent": 85
}
```
```

--------------------------------

### Create Disposable Directive with useMouse

Source: https://vueuse.org/shared/createdisposabledirective

Example of creating a custom directive using `createDisposableDirective`. Reactive effects like `useMouse` are automatically cleaned up on unmount. Ensure `@vueuse/core` and `@vueuse/shared` are installed.

```typescript
import {
  useMouse
} from '@vueuse/core'
import {
  createDisposableDirective
} from '@vueuse/shared'

export const VDirective = 
createDisposableDirective({
  mounted(el, binding) {
    const value = binding.value

    if (typeof value === 'function') {
      // [`useMouse`](/core/useMouse/) event listener will be removed automatically when directive is unmounted
      const { x, y } = useMouse()
      
      watch(x, val => value(val))
    }
  }
})
```

--------------------------------

### Wizard state example

Source: https://vueuse.org/core/useStepper

Example of the internal state object managed by useStepper.

```json
{
  "steps": {
    "user-information": {
      "title": "User information"
    },
    "billing-address": {
      "title": "Billing address"
    },
    "terms": {
      "title": "Terms"
    },
    "payment": {
      "title": "Payment"
    }
  },
  "stepNames": [
    "user-information",
    "billing-address",
    "terms",
    "payment"
  ],
  "index": 0,
  "current": {
    "title": "User information"
  },
  "next": "billing-address",
  "isFirst": true,
  "isLast": false
}
```

--------------------------------

### Basic Usage of useMousePressed

Source: https://vueuse.org/core/useMousePressed

Import and use the `useMousePressed` function to get the reactive `pressed` state. No additional setup is required for basic mouse tracking.

```typescript
import {
useMousePressed
} from '@vueuse/core'

const { 
pressed
 } = 
useMousePressed
()
```

--------------------------------

### Get Mouse Leave State

Source: https://vueuse.org/core/usepageleave

Import and use the `usePageLeave` function to get a reactive boolean indicating if the mouse has left the page. No additional setup is required.

```typescript
import {
  usePageLeave
} from '@vueuse/core'

const isLeft = 
usePageLeave
()
```

--------------------------------

### Usage Example

Source: https://vueuse.org/shared/createRef

Demonstrates how to use the createRef function in both TypeScript and JavaScript.

```APIDOC
## Usage

### TypeScript
```typescript
import { createRef } from '@vueuse/core'
import { isShallow, ref } from 'vue'

const initialData = 1

const shallowData = createRef(initialData)
const deepData = createRef(initialData, true)

isShallow(shallowData) // true
isShallow(deepData) // false
```

### JavaScript
```javascript
import { createRef } from '@vueuse/core'
import { isShallow } from 'vue'

const initialData = 1
const shallowData = createRef(initialData)
const deepData = createRef(initialData, true)

isShallow(shallowData) // true
isShallow(deepData) // false
```
```

--------------------------------

### Import and Use useOnline Hook

Source: https://vueuse.org/core/useOnline

Import the useOnline hook from '@vueuse/core' and use it to get a reactive online status. No additional setup is required.

```typescript
import {
useOnline
} from '@vueuse/core'

const
online
=
useOnline()

```

--------------------------------

### Install Fuse.js with NPM

Source: https://vueuse.org/integrations/useFuse

Install Fuse.js version 7 or higher as a peer dependency using NPM.

```bash
npm install fuse.js@^7
```

--------------------------------

### Install async-validator

Source: https://vueuse.org/integrations/useAsyncValidator

Install the async-validator package, which is a peer dependency for useAsyncValidator.

```bash
npm i async-validator@^4
```

--------------------------------

### useWindowSize - Basic Usage

Source: https://vueuse.org/core/useWindowSize

This snippet demonstrates the basic usage of the `useWindowSize` composable to get the reactive window width and height.

```APIDOC
## useWindowSize - Basic Usage

### Description
This composable provides reactive window width and height.

### Method
Composition API function

### Endpoint
N/A (Client-side composable)

### Parameters
None for basic usage.

### Request Example
```vue
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <div>
    Width: {{ width }}
    Height: {{ height }}
  </div>
</template>
```

### Response
- **width** (ShallowRef<number>) - Reactive reference to the window's width.
- **height** (ShallowRef<number>) - Reactive reference to the window's height.

### Response Example
```json
{
  "width": 1280,
  "height": 800
}
```
```

--------------------------------

### Initialize useSpeechSynthesis

Source: https://vueuse.org/core/useSpeechSynthesis

Basic setup to access speech synthesis controls and state.

```typescript
import { 
useSpeechSynthesis
 } from '@vueuse/core'

const {
  
isSupported
,
  
isPlaying
,
  
status
,
  
voiceInfo
,
  
utterance
,
  
error
,
  
stop
,
  
toggle
,
  
speak
,
} = 
useSpeechSynthesis
()
```

--------------------------------

### useMin - Basic Usage with Multiple Arguments

Source: https://vueuse.org/math/useMin

Demonstrates how to use `useMin` with multiple reactive number arguments.

```APIDOC
## useMin with Multiple Arguments

### Description
Calculates the minimum value from a list of reactive numbers provided as arguments.

### Method
Composable function

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { ref } from 'vue'
import { useMin } from '@vueuse/math'

const a = ref(1)
const b = ref(3)
const c = ref(2)

const min = useMin(a, b, c)
// min will be a Ref<1>
```

### Response
#### Success Response
- **min** (Ref<number>) - A computed ref containing the minimum value.

#### Response Example
```json
{
  "min": 1
}
```
```

--------------------------------

### Get Device Orientation State

Source: https://vueuse.org/core/useDeviceOrientation

Import and destructure the reactive properties from useDeviceOrientation. This composable requires no additional setup.

```typescript
import {
  useDeviceOrientation
} from '@vueuse/core'

const {
  isAbsolute,
  alpha,
  beta,
  gamma,
} = 
useDeviceOrientation
()
```

--------------------------------

### useWebSocket Basic Usage

Source: https://vueuse.org/core/useWebSocket

Demonstrates the basic setup for useWebSocket, including establishing a connection and accessing core properties like status, data, and control functions.

```APIDOC
## useWebSocket Basic Usage

### Description
Establishes a reactive WebSocket connection and provides access to connection status, received data, and methods to control the connection.

### Method
`useWebSocket(url: string, options?: UseWebSocketOptions)

### Endpoint
N/A (Client-side composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close, ws } = useWebSocket('ws://websocketurl')
```

### Response
#### Success Response (Connection Established)
- **data** (Ref<any>) - Latest received data
- **status** (Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>) - Connection status
- **ws** (Ref<WebSocket>) - WebSocket instance
- **send** (Function) - Function to send data over the WebSocket connection
- **open** (Function) - Function to open or reconnect the connection
- **close** (Function) - Function to close the connection

#### Response Example
```json
{
  "data": "Received message content",
  "status": "OPEN",
  "ws": "WebSocket object",
  "send": "function",
  "open": "function",
  "close": "function"
}
```
```

--------------------------------

### Install @vueuse/router

Source: https://vueuse.org/router/README

Install the @vueuse/router package along with vue-router v5. Ensure you have npm installed.

```bash
npm i @vueuse/router vue-router@5
```

--------------------------------

### Install axios dependency

Source: https://vueuse.org/integrations/useAxios

Install the required axios package before using the integration.

```bash
npm i axios@^1
```

--------------------------------

### Install drauu dependency

Source: https://vueuse.org/integrations/useDrauu

Install the required drauu package before using the integration.

```bash
npm i drauu@^0
```

--------------------------------

### Basic Media Controls Setup

Source: https://vueuse.org/core/useMediaControls

Sets up reactive controls for a video element, including playback, current time, duration, and volume. Initializes volume and current time on component mount.

```vue
<script setup lang="ts">
import {
useMediaControls
} from '@vueuse/core'
import {
onMounted,
useTemplateRef
} from 'vue'

const
video
=
useTemplateRef('video')
const { 
playing
, 
currentTime
, 
duration
, 
volume
 } = 
useMediaControls
(
video
, {

src
: 'video.mp4',
})

// Change initial media properties

onMounted
(() => {
  
volume
.
value
 = 0.5
  
currentTime
.
value
 = 60
})
</script>

<template>
  <
video
 
ref
="
video
" />
  <
button
 @
click
="
playing
 = !
playing
">
    Play / Pause
  </
button
>
  <
span
>{{ 
currentTime
 }} / {{ 
duration
 }}</
span
>
</template>
```

--------------------------------

### Import and Use usePreferredDark

Source: https://vueuse.org/core/usePreferredDark

Import the `usePreferredDark` composable and use it to get a reactive boolean indicating the user's dark theme preference. No additional setup is required.

```typescript
import {
usePreferredDark
} from '@vueuse/core'

const
isDark
=
usePreferredDark
()
```

--------------------------------

### Use useElementBounding in Script Setup

Source: https://vueuse.org/core/useElementBounding

Import and use useElementBounding with useTemplateRef to get reactive bounding box properties of an element. Ensure the element has a ref attribute matching the one passed to useTemplateRef.

```vue
<script setup lang="ts">
import { 
useElementBounding
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')
const { 
x
, 
y
, 
top
, 
right
, 
bottom
, 
left
, 
width
, 
height
 } = 
useElementBounding
(
el
)
</script>

<template>
  <div 
ref
="
el
" />
</template>
```

--------------------------------

### Use useTrunc for Reactive Truncation

Source: https://vueuse.org/math/useTrunc

Import and use the useTrunc function with refs to get reactive truncated numbers. Ensure you have '@vueuse/math' installed.

```typescript
import {
  useTrunc
} from '@vueuse/math'

const value1 = ref(0.95)
const value2 = ref(-2.34)
const result1 = useTrunc(value1) // 0
const result2 = useTrunc(value2) // -2
```

--------------------------------

### Initialize useRefHistory

Source: https://vueuse.org/core/userefhistory

Basic setup for tracking a ref's history.

```typescript
import { 
useRefHistory
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
counter
 = 
shallowRef
(0)
const { 
history
, 
undo
, 
redo
 } = 
useRefHistory
(
counter
)
```

--------------------------------

### Initialize useFileSystemAccess

Source: https://vueuse.org/core/usefilesystemaccess

Demonstrates the import and destructuring of the composable's state and methods.

```ts
import { 
useFileSystemAccess
 } from '@vueuse/core'

const {
  
isSupported
,
  
data
,
  
file
,
  
fileName
,
  
fileMIME
,
  
fileSize
,
  
fileLastModified
,
  
create
,
  
open
,
  
save
,
  
saveAs
,
  
updateData

} = 
useFileSystemAccess
()
```

--------------------------------

### Use native ref in script setup

Source: https://vueuse.org/core/templateRef

When using <script setup>, native Vue ref is preferred as variables are automatically exposed to the template.

```vue
<script setup lang="ts">
import { 
ref
 } from 'vue'

const 
target
 = 
ref
<HTMLElement | null>(null)
</script>

<template>
  <
div
 
ref
="
target
" />
</template>
```

--------------------------------

### Install Fuse.js with Yarn

Source: https://vueuse.org/integrations/useFuse

Install Fuse.js version 7 or higher as a peer dependency using Yarn.

```bash
yarn add fuse.js
```

--------------------------------

### Reactive Math.min Usage

Source: https://vueuse.org/math/usemin

Examples demonstrating how to use useMin with arrays or multiple reactive arguments.

```typescript
import { 
useMin
 } from '@vueuse/math'

const 
array
 = 
ref
([1, 2, 3, 4])
const 
min
 = 
useMin
(
array
) // Ref<1>
```

```typescript
import { 
useMin
 } from '@vueuse/math'

const 
a
 = 
ref
(1)
const 
b
 = 
ref
(3)

const 
min
 = 
useMin
(
a
, 
b
, 2) // Ref<1>
```

--------------------------------

### createReusableTemplate Usage (Options API)

Source: https://vueuse.org/core/createreusabletemplate

Example showing how to integrate createReusableTemplate with Vue's Options API, requiring registration in the `components` option.

```APIDOC
## createReusableTemplate Usage (Options API)

### Description
This example illustrates how to use `createReusableTemplate` within a Vue component using the Options API. The returned template components need to be explicitly registered.

### Method
`createReusableTemplate` function

### Endpoint
N/A (Composable function)

### Parameters
None directly for the function call.

### Request Example
```vue
<script>
import { createReusableTemplate } from '@vueuse/core'
import { defineComponent } from 'vue'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

export default defineComponent({
  components: {
    DefineTemplate,
    ReuseTemplate,
  },
  setup() {
    // ...
  },
})
</script>

<template>
  <DefineTemplate v-slot="{ data, msg, anything ">
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate :data="data" msg="The first usage" />
</template>
```

### Response
- `<DefineTemplate>`: Registers the template and renders nothing.
- `<ReuseTemplate>`: Renders the template provided by `<DefineTemplate>`.

### Response Example
N/A (Component rendering example.)
```

--------------------------------

### useNow - Component Usage

Source: https://vueuse.org/core/useNow

Example of using the `UseNow` renderless component for `useNow`.

```APIDOC
## UseNow Component

### Description
Renderless component version of the `useNow` composable.

### Usage
```vue
<template>
  <UseNow v-slot="{ now, pause, resume }">
    Now: {{ now }}
    <button @click="pause()">
      Pause
    </button>
    <button @click="resume()">
      Resume
    </button>
  </UseNow>
</template>
```
```

--------------------------------

### useUserMedia Basic Usage

Source: https://vueuse.org/core/useusermedia

Demonstrates the basic integration of useUserMedia to start and display a media stream from the user's camera.

```APIDOC
## POST /api/users

### Description
This endpoint allows for the creation of a new user.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address of the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}

### Response
#### Success Response (201)
- **id** (string) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```

--------------------------------

### useDark - Basic Usage

Source: https://vueuse.org/core/useDark

Demonstrates the basic setup of the useDark composable to enable reactive dark mode.

```APIDOC
## useDark - Basic Usage

### Description
This example shows the fundamental way to integrate `useDark` into your Vue application.

### Method
`useDark()`

### Endpoint
N/A (Composable Function)

### Parameters
None for basic usage.

### Request Body
None.

### Request Example
```typescript
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

### Response
- **isDark** (WritableComputedRef<boolean>) - A reactive boolean indicating the current dark mode state.

### Response Example
```json
// The 'isDark' ref will be true or false based on the current mode.
// Example: true
```
```

--------------------------------

### Import and Use VueUse Functions

Source: https://vueuse.org/guide

Import specific functions from @vueuse/core and use them within a setup script.

```vue
<script setup>
import { 
useLocalStorage
, 
useMouse
, 
usePreferredDark
 } from '@vueuse/core'

// tracks mouse position
const { 
x
, 
y
 } = 
useMouse
()

// is user prefers dark theme
const 
isDark
 = 
usePreferredDark
()

// persist state in localStorage
const 
store
 = 
useLocalStorage
(
  'my-storage',
  {
    
name
: 'Apple',
    
color
: 'red',
  },
)
</script>
```

--------------------------------

### useMin - Basic Usage with Array

Source: https://vueuse.org/math/useMin

Demonstrates how to use `useMin` with a reactive array of numbers.

```APIDOC
## useMin with Array

### Description
Calculates the minimum value from a reactive array of numbers.

### Method
Composable function

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { ref } from 'vue'
import { useMin } from '@vueuse/math'

const array = ref([1, 2, 3, 4])
const min = useMin(array)
// min will be a Ref<1>
```

### Response
#### Success Response
- **min** (Ref<number>) - A computed ref containing the minimum value.

#### Response Example
```json
{
  "min": 1
}
```
```

--------------------------------

### Use useAbs for Reactive Absolute Value

Source: https://vueuse.org/math/useAbs

Import and use the `useAbs` function to get the absolute value of a reactive number. Ensure you have `@vueuse/math` installed and `ref` from Vue imported.

```typescript
import {
useAbs
} from '@vueuse/math'

const 
value
 = 
ref
(-23)
const 
absoluteValue
 = 
useAbs
(
value
) // Ref<23>
```

--------------------------------

### Start Promise Execution

Source: https://vueuse.org/core/createtemplatepromise

Invoking the start method to trigger the promise lifecycle.

```ts
const 
result
 = await 
TemplatePromise
.
start
()
```

```js
'use strict'
const result = await TemplatePromise.start()
```

--------------------------------

### Tailwind CSS Configuration Example

Source: https://vueuse.org/core/useDark

Demonstrates the expected HTML structure for Tailwind CSS dark mode.

```html
<!--light-->
<html>
  ...
</html>

<!--dark-->
<html class="dark">
  ...
</html>
```

--------------------------------

### Provide SSR Width - Root Component Example

Source: https://vueuse.org/core/useSSRWidth

Example of how to provide the SSR width within the root component of your Vue application.

```APIDOC
## Provide SSR Width - Root Component

### Description
This example shows how to use `provideSSRWidth` directly in your root Vue component's setup to establish a global SSR viewport width.

### Method
`provideSSRWidth`

### Endpoint
N/A (Composable function)

### Parameters
- **width** (number) - The SSR viewport width (e.g., 500).

### Request Example
```vue
<script setup lang="ts">
import { provideSSRWidth } from '@vueuse/core'

// Provide a global SSR width of 500px in the root component
provideSSRWidth(500)
</script>

<template>
  <!-- Your app content -->
</template>
```
```

--------------------------------

### Initialize useWebWorker

Source: https://vueuse.org/core/useWebWorker

Basic setup for registering a Web Worker using a file path.

```typescript
import { 
useWebWorker
 } from '@vueuse/core'

const { 
data
, 
post
, 
terminate
, 
worker
 } = 
useWebWorker
('/path/to/worker.js')
```

--------------------------------

### useClamp - Basic Usage

Source: https://vueuse.org/math/useclamp

Demonstrates the basic usage of useClamp with shallow refs for min and max values.

```APIDOC
## useClamp 

### Description
Reactively clamp a value between two other values.

### Method
Composition API function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useClamp } from '@vueuse/math'
import { shallowRef } from 'vue'

const min = shallowRef(0)
const max = shallowRef(10)
const value = useClamp(0, min, max)
```

### Response
#### Success Response (200)
Returns a computed ref that clamps the input value.

#### Response Example
```json
{
  "clampedValue": 5 
}
```
```

--------------------------------

### useStepper with Steps as Array

Source: https://vueuse.org/core/usestepper

This example demonstrates how to use the `useStepper` composable with an array of step names. It shows how to import the function and access various state properties and methods like `current`, `next`, `previous`, `goTo`, and `goToNext`.

```APIDOC
## useStepper with Steps as Array

### Description
This example demonstrates how to use the `useStepper` composable with an array of step names. It shows how to import the function and access various state properties and methods like `current`, `next`, `previous`, `goTo`, and `goToNext`.

### Method
`useStepper`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useStepper } from '@vueuse/core'

const { 
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper([
  'billing-address',
  'terms',
  'payment',
])

// Access the step through `current`
console.log(current.value) // 'billing-address'
```

### Response
#### Success Response (200)
This composable does not have a direct success response in the traditional API sense, as it's a client-side utility. The return value is an object containing reactive state and methods for managing the stepper.

- **steps** (Ref<Array<string | number>>) - List of steps.
- **stepNames** (Ref<Array<string | number>>) - List of step names.
- **index** (Ref<number>) - Index of the current step.
- **current** (ComputedRef<string | number>) - Current step.
- **next** (ComputedRef<string | number | undefined>) - Next step, or undefined if the current step is the last one.
- **previous** (ComputedRef<string | number | undefined>) - Previous step, or undefined if the current step is the first one.
- **isFirst** (ComputedRef<boolean>) - Whether the current step is the first one.
- **isLast** (ComputedRef<boolean>) - Whether the current step is the last one.
- **at** (Function) - Get the step at the specified index.
- **get** (Function) - Get a step by the specified name.
- **goTo** (Function) - Go to the specified step.
- **goToNext** (Function) - Go to the next step. Does nothing if the current step is the last one.
- **goToPrevious** (Function) - Go to the previous step. Does nothing if the current step is the previous one.
- **goBackTo** (Function) - Go back to the given step, only if the current step is after.
- **isNext** (Function) - Checks whether the given step is the next step.
- **isPrevious** (Function) - Checks whether the given step is the previous step.
- **isCurrent** (Function) - Checks whether the given step is the current step.
- **isBefore** (Function) - Checks if the current step is before the given step.
- **isAfter** (Function) - Checks if the current step is after the given step.

#### Response Example
```json
{
  "steps": [
    "billing-address",
    "terms",
    "payment"
  ],
  "stepNames": [
    "billing-address",
    "terms",
    "payment"
  ],
  "index": 0,
  "current": "billing-address",
  "next": "terms",
  "previous": undefined,
  "isFirst": true,
  "isLast": false
}
```
```

--------------------------------

### Install Fuse.js

Source: https://vueuse.org/integrations/useFuse

Fuse.js is a peer dependency for useFuse. Install it using npm or yarn.

```APIDOC
## Install Fuse.js

### NPM
```bash
npm install fuse.js@^7
```

### Yarn
```bash
yarn add fuse.js
```
```

--------------------------------

### Track Window Focus in Vue Component

Source: https://vueuse.org/core/useWindowFocus

Import and use `useWindowFocus` in your Vue component's script setup to get a reactive boolean indicating window focus. Display the focus state in the template.

```vue
<script setup lang="ts">
import { 
useWindowFocus
 } from '@vueuse/core'

const 
focused
 = 
useWindowFocus
()
</script>

<template>
  <
div
>{{ 
focused
 }}</
div
>
</template>
```

--------------------------------

### useChangeCase with Options

Source: https://vueuse.org/integrations/useChangeCase

Demonstrates how to use `useChangeCase` with custom options for further customization.

```APIDOC
## useChangeCase with Options

### Description
Example of using `useChangeCase` with a `ref` and custom options.

### Method
`useChangeCase`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { shallowRef } from 'vue'

const input = shallowRef('helloWorld')
const changeCase = useChangeCase(input, 'camelCase', {
  delimiter: '-',
})

changeCase.value // hello-World

input.value = 'vue use'
changeCase.value // vue-Use
```

### Response
#### Success Response (200)
`WritableComputedRef<string>` or `ComputedRef<string>` depending on input.

#### Response Example
```json
{
  "example": "hello-World"
}
```
```

--------------------------------

### useWebNotification Basic Usage

Source: https://vueuse.org/core/usewebnotification

Demonstrates the basic setup and usage of the useWebNotification composable to show a notification if supported and permissions are granted.

```APIDOC
## useWebNotification

### Description
Provides a reactive interface for the Web Notification API to display desktop notifications.

### Method
Composable Function

### Endpoint
N/A (Client-side composable)

### Parameters
#### Request Body (Options for `useWebNotification`)
- **title** (string) - Optional - The title of the notification.
- **body** (string) - Optional - The main content of the notification.
- **dir** ("auto" | "ltr" | "rtl") - Optional - Text direction of the notification.
- **lang** (string) - Optional - Language code for the notification.
- **tag** (string) - Optional - An identifier for the notification.
- **icon** (string) - Optional - URL of an icon for the notification.
- **renotify** (boolean) - Optional - If true, new notifications will replace old ones with the same tag.
- **requireInteraction** (boolean) - Optional - If true, the notification stays until the user interacts with it.
- **silent** (boolean) - Optional - If true, the notification will be silent.
- **vibrate** (number[]) - Optional - Vibration pattern for devices with vibration hardware.
- **requestPermissions** (boolean) - Optional - Request permissions on mount. Defaults to true.

### Request Example
```typescript
import { useWebNotification } from '@vueuse/core'

const { isSupported, notification, permissionGranted, show, close } = useWebNotification({
  title: 'Hello, VueUse world!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
})

if (isSupported.value && permissionGranted.value) {
  show()
}
```

### Response
#### Success Response (Composable Return)
- **isSupported** (ShallowRef<boolean>) - Indicates if the browser supports Web Notifications.
- **notification** (ShallowRef<Notification | null>) - The Notification object.
- **permissionGranted** (ShallowRef<boolean>) - Indicates if notification permissions are granted.
- **show** (function) - Function to display the notification. Accepts optional overrides.
- **close** (function) - Function to close the notification.
- **onClick** (EventHookOn<Event>) - Hook for the 'click' event.
- **onShow** (EventHookOn<Event>) - Hook for the 'show' event.
- **onError** (EventHookOn<Event>) - Hook for the 'error' event.
- **onClose** (EventHookOn<Event>) - Hook for the 'close' event.
- **ensurePermissions** (function) - Function to explicitly request permissions.
```

--------------------------------

### Convert Ref to RxJS Observer in TypeScript

Source: https://vueuse.org/rxjs/toobserver

Use toObserver to subscribe RxJS streams to a Vue ref. Ensure @vueuse/rxjs is installed. The example demonstrates updating a 'count' ref using an RxJS interval, stopping on button click.

```typescript
import { from, fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { map, mapTo, startWith, takeUntil, withLatestFrom } from 'rxjs/operators'
import { shallowRef, useTemplateRef } from 'vue'

const count = shallowRef(0)
const button = useTemplateRef('buttonRef')

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([curr, total]) => curr + total),
    )
    .subscribe(toObserver(count)), // same as ).subscribe(val => (count.value = val))
)
```

--------------------------------

### useBase64 - Basic Usage

Source: https://vueuse.org/core/usebase64

Demonstrates the basic usage of useBase64 with a text input. It shows how to import the function and use it with a shallowRef.

```APIDOC
## useBase64 - Basic Usage

### Description
This snippet shows the fundamental usage of the `useBase64` function with a plain text input.

### Method
`useBase64`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useBase64 } from '@vueuse/core'
import { shallowRef } from 'vue'

const text = shallowRef('')

const { base64, promise, execute } = useBase64(text)
```

### Response
#### Success Response (200)
- `base64` (ShallowRef<string>) - The resulting base64 string.
- `promise` (ShallowRef<Promise<string>>) - The promise of the current transformation.
- `execute` (Function) - Manually trigger the transformation.

#### Response Example
```json
{
  "base64": "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
  "promise": "Promise<string>",
  "execute": "function"
}
```
```

--------------------------------

### Access ref.value with get()

Source: https://vueuse.org/shared/get

Use this utility to get the value of a ref. Ensure you have imported `get` from '@vueuse/core'.

```typescript
import {
get
} from '@vueuse/core'

const a = ref(42)

console.log(get(a)) // 42
```

--------------------------------

### useNow - Basic Usage

Source: https://vueuse.org/core/useNow

This snippet demonstrates the basic usage of the `useNow` composable to get a reactive Date instance.

```APIDOC
## useNow

### Description
Reactive current Date instance.

### Method
`useNow`

### Parameters
#### Options
- **options** (UseNowOptions<false>) - Optional - Configuration options for the composable.
  - **controls** (boolean) - Optional - Expose more controls. Defaults to `false`.
  - **immediate** (boolean) - Optional - Start the clock immediately. Defaults to `true`. Deprecated, use `scheduler` instead.
  - **interval** ("requestAnimationFrame" | number) - Optional - Update interval in milliseconds, or use requestAnimationFrame. Defaults to `requestAnimationFrame`. Deprecated, use `scheduler` instead.

### Returns
- **now** (ShallowRef<Date>) - A shallow reactive reference to the current Date.

### Request Example
```ts
import { useNow } from '@vueuse/core'

const now = useNow()
```
```

--------------------------------

### Install idb-keyval dependency

Source: https://vueuse.org/integrations/useIDBKeyval

Requires idb-keyval as a peer dependency.

```bash
npm install idb-keyval@^6
```

--------------------------------

### Options API usage

Source: https://vueuse.org/core/usevmodel

Implementation within the setup function of an Options API component.

```ts
import { 
useVModel
 } from '@vueuse/core'

export default {
  
setup
(
props
, { 
emit
 }) {
    const 
data
 = 
useVModel
(
props
, 'data', 
emit
)

    
console
.
log
(
data
.
value
) // props.data
    
data
.
value
 = 'foo' // emit('update:data', 'foo')
  },
}
```

--------------------------------

### Usage of injectLocal and provideLocal

Source: https://vueuse.org/shared/injectLocal

Demonstrates how to provide a value locally and immediately inject it within the same component setup.

```vue
<script setup>
import { 
injectLocal
, 
provideLocal
 } from '@vueuse/core'


provideLocal
('MyInjectionKey', 1)
const 
injectedValue
 = 
injectLocal
('MyInjectionKey') // injectedValue === 1
</script>
```

--------------------------------

### useFavicon Basic Usage

Source: https://vueuse.org/core/usefavicon

This example demonstrates the basic usage of `useFavicon` to change the favicon to a static image.

```APIDOC
## useFavicon

### Description

Allows you to reactively control the browser favicon.

### Method

`useFavicon(newIcon?: MaybeRef<string | null | undefined>, options?: UseFaviconOptions): Ref<string | null | undefined>`

### Parameters

#### Request Body

- **newIcon** (Ref<string | null | undefined> | string | null | undefined) - Optional - The new favicon URL or path.
- **options** (UseFaviconOptions) - Optional - Configuration options.
  - **baseUrl** (string) - Optional - Base URL for the favicon.
  - **rel** (string) - Optional - The 'rel' attribute for the favicon link tag.

### Request Example

```typescript
import { useFavicon } from '@vueuse/core'

const icon = useFavicon()

icon.value = 'dark.png' // change current icon
```

### Response

Returns a `Ref` that controls the favicon.

#### Success Response (200)

- **icon** (Ref<string | null | undefined>) - A ref that controls the favicon.

#### Response Example

```json
{
  "icon": "dark.png"
}
```
```

--------------------------------

### Usage Example (TypeScript)

Source: https://vueuse.org/core/usepreferredcolorscheme

Demonstrates how to import and use the `usePreferredColorScheme` composable in a TypeScript Vue component.

```APIDOC
## Usage Example (TypeScript)

### Description
Import and use the `usePreferredColorScheme` composable to get the user's preferred color scheme.

### Method
Composable Function

### Endpoint
N/A

### Parameters
N/A

### Request Body
N/A

### Response
#### Success Response
- **preferredColor** (ComputedRef<ColorSchemeType>) - A computed reference holding the current color scheme.

### Request Example
```typescript
import { usePreferredColorScheme } from '@vueuse/core'

const preferredColor = usePreferredColorScheme()
```

### Response Example
```json
{
  "preferredColor": "dark"
}
```
```

--------------------------------

### useDevicesList - Basic Usage

Source: https://vueuse.org/core/usedeviceslist

Demonstrates the basic reactive enumeration of devices using `useDevicesList`.

```APIDOC
## GET /api/devices

### Description
Retrieves a reactive list of available audio and video input/output devices.

### Method
GET

### Endpoint
/api/devices

### Parameters
#### Query Parameters
- **requestPermissions** (boolean) - Optional - If true, requests permissions immediately.
- **constraints** (object) - Optional - MediaStreamConstraints to specify requested media types (e.g., { audio: true, video: true }).

### Response
#### Success Response (200)
- **devices** (ShallowRef<MediaDeviceInfo[]>) - A shallow reference to an array of all available media devices.
- **videoInputs** (ComputedRef<MediaDeviceInfo[]>) - A computed reference to an array of video input devices (cameras).
- **audioInputs** (ComputedRef<MediaDeviceInfo[]>) - A computed reference to an array of audio input devices (microphones).
- **audioOutputs** (ComputedRef<MediaDeviceInfo[]>) - A computed reference to an array of audio output devices (speakers).
- **permissionGranted** (ShallowRef<boolean>) - A shallow reference indicating if permissions have been granted.
- **ensurePermissions** (function) - A function that returns a Promise resolving to a boolean indicating if permissions were successfully ensured.

### Request Example
```ts
import { useDevicesList } from '@vueuse/core'

const { devices, videoInputs: cameras, audioInputs: microphones, audioOutputs: speakers } = useDevicesList()
```

### Response Example
```json
{
  "devices": [
    {
      "deviceId": "device-id-1",
      "kind": "videoinput",
      "label": "Camera 1",
      "groupId": "group-id-1"
    },
    {
      "deviceId": "device-id-2",
      "kind": "audioinput",
      "label": "Microphone 1",
      "groupId": "group-id-2"
    }
  ],
  "videoInputs": [
    {
      "deviceId": "device-id-1",
      "kind": "videoinput",
      "label": "Camera 1",
      "groupId": "group-id-1"
    }
  ],
  "audioInputs": [
    {
      "deviceId": "device-id-2",
      "kind": "audioinput",
      "label": "Microphone 1",
      "groupId": "group-id-2"
    }
  ],
  "audioOutputs": [],
  "permissionGranted": true,
  "ensurePermissions": "[Function: ensurePermissions]"
}
```
```

--------------------------------

### useAxios with Config Options

Source: https://vueuse.org/integrations/useaxios

Configure the request method and other axios options when using useAxios. This example demonstrates making a POST request.

```typescript
import {
useAxios
} from '@vueuse/integrations/useAxios'
import 
axios
 from 'axios'

const 
instance
 =
axios
.
create
({
 aseURL
: '/api',
})

const { 
data
,
isFinished
 } = 
useAxios
('/posts', { 
method
: 'POST' }, 
instance
)
```

--------------------------------

### useMax - Reactive Maximum

Source: https://vueuse.org/math/usemax

Demonstrates how to use useMax with an array of numbers to get a reactive maximum value.

```APIDOC
## useMax (Array Input)

### Description
Calculates the maximum value from a reactive array of numbers.

### Method
Composable function

### Endpoint
N/A (Vue.js Composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { ref } from 'vue'
import { useMax } from '@vueuse/math'

const array = ref([1, 2, 3, 4])
const max = useMax(array)
// max will be a Ref<4>
```

### Response
#### Success Response
- **max** (Ref<number>) - A Vue ref containing the maximum number from the input array.

#### Response Example
```json
{
  "max": 4
}
```
```

--------------------------------

### Transition with Delay and Callbacks

Source: https://vueuse.org/core/usetransition

Control the transition start time with a delay and execute functions when the transition starts or finishes.

```typescript
useTransition(source, {
  delay: 1000,
  onStarted() {
    // called after the transition starts
  },
  onFinished() {
    // called after the transition ends
  },
})
```

```javascript
'use strict'
useTransition(source, {
  delay: 1000,
  onStarted() {
    // called after the transition starts
  },
  onFinished() {
    // called after the transition ends
  },
})
```

--------------------------------

### VueUse get() Type Declarations

Source: https://vueuse.org/shared/get

These are the type declarations for the get() utility, showing how it handles refs and keys.

```typescript
/**
 * Shorthand for accessing `ref.value`
 */
export declare function get<T>(ref: MaybeRef<T>): T

export declare function get<T, K extends keyof T>(
  ref: MaybeRef<T>,
  key: K,
): T[K]
```

--------------------------------

### Usage of tryOnBeforeUnmount

Source: https://vueuse.org/shared/tryOnBeforeUnmount

Import and execute the function within a component setup context.

```typescript
import { 
tryOnBeforeUnmount
 } from '@vueuse/core'


tryOnBeforeUnmount
(() => {

})
```

--------------------------------

### useAxios with Axios Instance

Source: https://vueuse.org/integrations/useAxios

Shows how to use a pre-configured Axios instance with the useAxios composable.

```APIDOC
## useAxios with Axios Instance

### Description
This snippet illustrates how to integrate `useAxios` with an existing Axios instance, allowing you to leverage custom configurations like `baseURL`.

### Method
GET (default)

### Endpoint
`/posts` (relative to the instance's baseURL)

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

const { data, isFinished } = useAxios('/posts', instance)
```

### Response
#### Success Response (200)
- **data** (Ref<T>) - Response data
- **isFinished** (Ref<boolean>) - Request has completed (success or error)

#### Response Example
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
```

--------------------------------

### Basic usage of useUserMedia

Source: https://vueuse.org/core/useUserMedia

Demonstrates how to initialize a media stream and bind it to a video element using a template reference.

```vue
<script setup lang="ts">
import { 
useUserMedia
 } from '@vueuse/core'
import { 
useTemplateRef
, 
watchEffect
 } from 'vue'

const { 
stream
, 
start
 } = 
useUserMedia
()

start
()

const 
videoRef
 = 
useTemplateRef
('video')

watchEffect
(() => {
  // preview on a video element
  
videoRef
.value.srcObject = 
stream
.
value

})
</script>

<template>
  <
video
 
ref
="
video
" />
</template>
```

--------------------------------

### Initialize useDevicesList

Source: https://vueuse.org/core/useDevicesList

Import and destructure the useDevicesList composable to get reactive lists of devices. Aliases can be used for clarity.

```typescript
import {
  useDevicesList
} from '@vueuse/core'

const {
  devices,
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = 
useDevicesList
()
```

--------------------------------

### onStartTyping Function

Source: https://vueuse.org/core/onStartTyping

Registers a callback that fires when the user starts typing on non-editable elements.

```APIDOC
## onStartTyping

### Description
Fires a callback when users start typing on non-editable elements. The callback only triggers if no editable element is focused, the key is alphanumeric, and no modifier keys are held.

### Parameters
#### Arguments
- **callback** (Function) - Required - A function to execute when typing is detected. Receives the KeyboardEvent as an argument.
- **options** (ConfigurableDocument) - Optional - Configuration object for the document target.

### Request Example
```typescript
import { onStartTyping } from '@vueuse/core'

onStartTyping((event) => {
  console.log('User started typing:', event.key)
})
```

### Response
- **void** - This function does not return a value.
```

--------------------------------

### Display JWT Header

Source: https://vueuse.org/integrations/useJwt

Example of a JWT header structure.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

--------------------------------

### useTimeout with Callback

Source: https://vueuse.org/shared/useTimeout

This example shows how to provide a callback function that executes once the timeout completes.

```APIDOC
## useTimeout with Callback

### Description

This example demonstrates how to provide a `callback` function to `useTimeout`. The provided function will be executed automatically once the timeout duration has elapsed.

### Method

`useTimeout`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```ts
import { useTimeout } from '@vueuse/core'

useTimeout(1000, {
  callback: () => {
    console.log('Timeout completed!')
  },
})
```

### Response

#### Success Response (200)

None (The primary effect is the execution of the callback function).

#### Response Example

```json
// No direct JSON response, but 'Timeout completed!' will be logged to the console.
```

--------------------------------

### useTransition with Delay and Callbacks

Source: https://vueuse.org/core/useTransition

Configures a delay before the transition starts and defines `onStarted` and `onFinished` callbacks.

```APIDOC
## GET /api/products

### Description
Retrieves a list of products.

### Method
GET

### Endpoint
/api/products

### Parameters
#### Query Parameters
- **category** (string) - Optional - Filter products by category.
- **sort** (string) - Optional - Field to sort products by (e.g., 'price', 'name').
- **order** (string) - Optional - Sort order ('asc' or 'desc').

### Response
#### Success Response (200)
- **products** (array) - An array of product objects.
  - **id** (integer) - Product ID.
  - **name** (string) - Product name.
  - **price** (number) - Product price.
  - **category** (string) - Product category.

#### Response Example
```json
{
  "products": [
    {
      "id": 101,
      "name": "Laptop",
      "price": 1200.00,
      "category": "Electronics"
    },
    {
      "id": 102,
      "name": "Keyboard",
      "price": 75.00,
      "category": "Electronics"
    }
  ]
}
```
```

--------------------------------

### useEventSource with Named Events

Source: https://vueuse.org/core/useEventSource

This example shows how to listen for specific named events emitted by the server by providing an array of event names.

```APIDOC
## useEventSource with Named Events

### Description
Allows listening for specific named events from the server by providing an array of event names.

### Method
`useEventSource(url: string | Ref<string>, eventNames: string[])`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
const { event, data } = useEventSource('https://event-source-url', ['notice', 'update'])
```

### Response
#### Success Response (200)
- **event** (Ref<string | null>) - The name of the received event.
- **data** (Ref<string | null>) - The data associated with the received event.

#### Response Example
```json
{
  "event": "update",
  "data": "User profile updated"
}
```
```

--------------------------------

### Install VueUse AI Agent Skills

Source: https://vueuse.org/guide/work-with-ai

Use this command to add the VueUse AI Agent Skills to your project. This is the first step to enable AI assistance for VueUse.

```bash
npx skills add vueuse/skills
```

--------------------------------

### Initialize useSpeechRecognition

Source: https://vueuse.org/core/useSpeechRecognition

Basic setup for accessing speech recognition state and control methods.

```typescript
import { 
useSpeechRecognition
 } from '@vueuse/core'

const {
  
isSupported
,
  
isListening
,
  
isFinal
,
  
result
,
  
start
,
  
stop
,
} = 
useSpeechRecognition
()
```

--------------------------------

### Configure custom clone functions

Source: https://vueuse.org/core/useManualRefHistory

Provides examples for using structuredClone, lodash-es, or klona for deep cloning.

```typescript
import { 
useManualRefHistory
 } from '@vueuse/core'

const 
refHistory
 = 
useManualRefHistory
(target, { 
clone
: 
structuredClone
 })
```

```typescript
import { 
useManualRefHistory
 } from '@vueuse/core'
import { 
cloneDeep
 } from 'lodash-es'

const 
refHistory
 = 
useManualRefHistory
(target, { 
clone
: 
cloneDeep
 })
```

```typescript
import { 
useManualRefHistory
 } from '@vueuse/core'
import { 
klona
 } from 'klona'

const 
refHistory
 = 
useManualRefHistory
(target, { 
clone
: 
klona
 })
```

--------------------------------

### useBase64 - Basic Usage

Source: https://vueuse.org/core/useBase64

Demonstrates the basic usage of the useBase64 composable with a text input.

```APIDOC
## useBase64 - Basic Usage

### Description
This example shows how to use the `useBase64` composable with a reactive string reference.

### Method
`useBase64`

### Parameters
#### Target
- **target** (Ref<string | undefined>) - A reactive reference to the string to be encoded.

#### Options
- **dataUrl** (boolean) - Optional. If true, the output will be in Data URL format. Defaults to true.

### Return Values
- **base64** (Ref<string>) - A reactive reference to the base64 encoded string.
- **promise** (Ref<Promise<string>>) - A reactive reference to the promise of the current transformation.
- **execute** - A function to manually trigger the transformation.

### Request Example
```typescript
import { useBase64 } from '@vueuse/core'
import { shallowRef } from 'vue'

const text = shallowRef('')

const { base64, promise, execute } = useBase64(text)
```

### Response Example
```json
{
  "base64": "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==",
  "promise": "Promise<string>",
  "execute": "() => Promise<string>"
}
```
```

--------------------------------

### Basic usage

Source: https://vueuse.org/integrations/useAxios

Perform a simple GET request using the useAxios hook.

```typescript
import { 
useAxios
 } from '@vueuse/integrations/useAxios'

const { 
data
, 
isFinished
 } = 
useAxios
('/api/posts')
```

--------------------------------

### Lazy Initialization

Source: https://vueuse.org/core/computedasync

Configure `computedAsync` to start resolving only on first access.

```APIDOC
## computedAsync - Lazy Loading

### Description
Defer the execution of the async function until the computed property is first accessed.

### Parameters
#### Options
- `lazy` (boolean): Set to `true` to enable lazy loading.
- `evaluating` (Ref<boolean>): A ref to track the evaluation status (optional).

### Request Example
```typescript
import { computedAsync } from '@vueuse/core'
import { shallowRef } from 'vue'

const evaluating = shallowRef(false)
const userInfo = computedAsync(
  async () => { /* your logic */ },
  null,
  { lazy: true, evaluating } // Options object
)
```
```

--------------------------------

### useNow - With Controls

Source: https://vueuse.org/core/useNow

This snippet shows how to use `useNow` with the `controls` option enabled to get pause and resume functions.

```APIDOC
## useNow with Controls

### Description
Reactive current Date instance with pause and resume controls.

### Method
`useNow`

### Parameters
#### Options
- **options** (UseNowOptions<true>) - Required - Configuration options for the composable.
  - **controls** (boolean) - Required - Expose more controls. Must be `true` for this overload.
  - **immediate** (boolean) - Optional - Start the clock immediately. Defaults to `true`. Deprecated, use `scheduler` instead.
  - **interval** ("requestAnimationFrame" | number) - Optional - Update interval in milliseconds, or use requestAnimationFrame. Defaults to `requestAnimationFrame`. Deprecated, use `scheduler` instead.

### Returns
- **now** (ShallowRef<Date>) - A shallow reactive reference to the current Date.
- **pause** (function) - Function to pause the clock.
- **resume** (function) - Function to resume the clock.

### Request Example
```ts
import { useNow } from '@vueuse/core'

const { now, pause, resume } = useNow({ controls: true })
```

### Response Example
```json
{
  "now": "2023-10-27T10:00:00.000Z",
  "pause": "function",
  "resume": "function"
}
```
```

--------------------------------

### Basic Infinite Scroll Setup

Source: https://vueuse.org/core/useinfinitescroll

Set up infinite scrolling for an element. Ensure `canLoadMore` correctly indicates when no more content is available to prevent unnecessary triggers.

```vue
<script setup lang="ts">
import {
  useInfiniteScroll
} from '@vueuse/core'
import {
  ref,
  useTemplateRef
} from 'vue'

const el = useTemplateRef('el')
const data = ref([1, 2, 3, 4, 5, 6])

const { reset } = useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...moreData)
  },
  {
    distance: 10,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  }
)

function resetList() {
  data.value = []
  reset()
}
</script>

<template>
  <div ref="el">
    <div v-for="item in data">
      {{ item }}
    </div>
  </div>
  <button @click="resetList()">
    Reset
  </button>
</template>
```

--------------------------------

### useBluetooth - Default Usage

Source: https://vueuse.org/core/useBluetooth

Demonstrates the basic setup and usage of the useBluetooth composable to request and connect to a Bluetooth device.

```APIDOC
## useBluetooth

### Description
Provides a reactive interface to the Web Bluetooth API, allowing discovery and communication with Bluetooth Low Energy peripherals.

### Method
N/A (Composable function)

### Endpoint
N/A (Composable function)

### Parameters
#### Options Object
- **acceptAllDevices** (boolean) - Optional - If true, all devices will be accepted. Defaults to false.
- **optionalServices** (string[]) - Optional - An array of service UUIDs to request.

### Return Values
- **isSupported** (ComputedRef<boolean>) - Whether the Web Bluetooth API is supported by the browser.
- **isConnected** (Ref<boolean>) - Whether a Bluetooth device is currently connected.
- **device** (Ref<BluetoothDevice>) - The connected Bluetooth device object.
- **server** (Ref<BluetoothRemoteGATTServer>) - The GATT server object for the connected device.
- **error** (Ref<unknown>) - Any error encountered during the Bluetooth interaction.
- **requestDevice** (() => Promise<void>) - A function that initiates the device discovery and connection process.

### Request Example
```javascript
import { useBluetooth } from '@vueuse/core'

const { isSupported, isConnected, device, requestDevice, server, error } = useBluetooth({
  acceptAllDevices: true,
})
```

### Response
#### Success Response (Connection Established)
- **device** (BluetoothDevice) - The connected device object.
- **server** (BluetoothRemoteGATTServer) - The GATT server for the device.

#### Response Example
```json
{
  "isConnected": true,
  "device": { ...BluetoothDevice object... },
  "server": { ...BluetoothRemoteGATTServer object... }
}
```
```

--------------------------------

### useMath - Basic Usage

Source: https://vueuse.org/math/usemath

Demonstrates how to use the useMath composable with different Math functions like 'pow' and 'sqrt'.

```APIDOC
## useMath

### Description
Reactive `Math` methods.

### Method
`useMath(key: UseMathKeys, ...args: ArgumentsType<Reactified<Math[K], true>>): UseMathReturn<K>

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { ref } from 'vue'
import { useMath } from '@vueuse/math'

const base = ref(2)
const exponent = ref(3)
const result = useMath('pow', base, exponent) // Ref<8>

const num = ref(2)
const root = useMath('sqrt', num) // Ref<1.4142135623730951>

num.value = 4

console.log(root.value) // 2
```

### Response
#### Success Response (200)
Returns a `Ref` containing the result of the Math operation.

#### Response Example
```json
{
  "example": "8" 
}
```

#### Error Handling
N/A
```

--------------------------------

### Basic usage of useNow

Source: https://vueuse.org/core/useNow

Import and initialize the useNow composable to get a reactive Date instance.

```ts
import { 
useNow
 } from '@vueuse/core'

const 
now
 = 
useNow
()
```

--------------------------------

### Equivalent of templateRef with Vue's ref in <script setup>

Source: https://vueuse.org/core/templateref

When using `<script setup>` in Vue, the native `ref` function provides the same functionality as `templateRef` for binding to template elements. All variables declared with `ref` are automatically exposed to the template.

```vue
<script setup lang="ts">
import { 
ref
 } from 'vue'

const 
target
 = 
ref
<HTMLElement | null>(null)
</script>

<template>
  <div 
ref
="
target
" />
</template>
```

--------------------------------

### Handling Initial Load with useStorageAsync

Source: https://vueuse.org/core/usestorageasync

Explains how to manage scenarios where the initial value from async storage might be empty before it's fully loaded. It shows how to wait for the storage to be ready.

```APIDOC
## GET /api/users/{id}

### Description
Retrieves a specific user by their ID.

### Method
GET

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (integer) - Required - The unique identifier of the user to retrieve.

#### Query Parameters
- **fields** (string) - Optional - A comma-separated list of fields to include in the response.

### Response
#### Success Response (200)
- **id** (integer) - The unique identifier for the user.
- **name** (string) - The name of the user.
- **email** (string) - The email address of the user.
- **createdAt** (string) - The timestamp when the user was created.

#### Response Example
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Basic useTransition Setup

Source: https://vueuse.org/core/usetransition

Define a source value and use useTransition to animate its changes over a specified duration with a preset easing function.

```typescript
import {
  TransitionPresets,
  useTransition
} from '@vueuse/core'
import {
  shallowRef
} from 'vue'

const source = shallowRef(0)

const output = useTransition(source, {
  duration: 1000,
  easing: TransitionPresets.easeInOutCubic,
})
```

--------------------------------

### Usage Example

Source: https://vueuse.org/shared/refAutoReset

Demonstrates how to use the refAutoReset function in a Vue component to manage a message that resets after a delay.

```APIDOC
## Usage

```typescript
import { refAutoReset } from '@vueuse/core'

const message = refAutoReset('default message', 1000)

function setMessage() {
  // here the value will change to 'message has set' but after 1000ms, it will change to 'default message'
  message.value = 'message has set'
}
```

**Info:** You can reassign the entire object to trigger updates after making deep mutations to the inner value. Learn more about shallow refs →
```

--------------------------------

### Initialize useCounter with Options

Source: https://vueuse.org/shared/useCounter

Initialize the useCounter composable with a starting value and options for minimum and maximum bounds.

```typescript
import {
useCounter
} from '@vueuse/core'

const { 
count
,
inc
,
dec
,
set
,
reset
} = 
useCounter
(1, { 
min
: 0, 
max
: 16 })
```

--------------------------------

### Install Nuxt Module

Source: https://vueuse.org/guide

Add the VueUse module to a Nuxt project using the CLI or package manager.

```bash
npx nuxt@latest module add vueuse
```

```bash
npm i -D @vueuse/nuxt @vueuse/core
```

--------------------------------

### useWindowSize - Options

Source: https://vueuse.org/core/useWindowSize

This snippet details the available options for configuring the `useWindowSize` composable.

```APIDOC
## useWindowSize - Options

### Description
Configure the behavior of the `useWindowSize` composable with various options.

### Method
Composition API function

### Endpoint
N/A (Client-side composable)

### Parameters
#### Query Parameters
None

#### Request Body
None

#### Options Object (`UseWindowSizeOptions`)
- **initialWidth** (number) - Optional - The initial width value.
- **initialHeight** (number) - Optional - The initial height value.
- **listenOrientation** (boolean) - Optional - Listen to window `orientationchange` event. Defaults to `true`.
- **includeScrollbar** (boolean) - Optional - Whether the scrollbar should be included in the width and height. Only effective when `type` is `'inner'`. Defaults to `true`.
- **type** (string) - Optional - Use `window.innerWidth`, `window.outerWidth`, or `window.visualViewport`. Possible values: `'inner'`, `'outer'`, `'visual'`. Defaults to `'inner'`.

### Request Example
```vue
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize({
  includeScrollbar: false,
  type: 'outer'
})
</script>

<template>
  <div>
    Width: {{ width }}
    Height: {{ height }}
  </div>
</template>
```

### Response
- **width** (ShallowRef<number>) - Reactive reference to the window's width.
- **height** (ShallowRef<number>) - Reactive reference to the window's height.

### Response Example
(Depends on the options and window state)
```json
{
  "width": 1280,
  "height": 800
}
```
```

--------------------------------

### Start Polling with useTimeoutPoll

Source: https://vueuse.org/core/useTimeoutPoll

Use this snippet to initiate a polling mechanism. It takes a fetch function and an interval, ensuring the fetch function completes before the next interval starts. The hook returns controls to manage the polling state.

```typescript
import {
useTimeoutPoll
} from '@vueuse/core'

const
count
=
ref
(0)

async function
fetchData
() {
  await new
Promise
(
resolve
=> 
setTimeout
(
resolve
, 1000))
  
count
.
value
++
}

// Only trigger after last fetch is done
const { 
isActive
, 
pause
, 
resume
 } =
useTimeoutPoll
(
fetchData
, 1000)

```

--------------------------------

### Display JWT Payload

Source: https://vueuse.org/integrations/useJwt

Example of a JWT payload structure.

```json
{
  "sub": "1234567890",
  "iat": 1516239022
}
```

--------------------------------

### transition Manual Execution

Source: https://vueuse.org/core/useTransition

Demonstrates manually triggering a transition using the `transition` function and how to cancel it.

```APIDOC
## POST /api/orders

### Description
Creates a new order.

### Method
POST

### Endpoint
/api/orders

### Parameters
#### Request Body
- **userId** (integer) - Required - The ID of the user placing the order.
- **items** (array) - Required - An array of items in the order.
  - **productId** (integer) - Required - The ID of the product.
  - **quantity** (integer) - Required - The quantity of the product.
- **shippingAddress** (object) - Required - The shipping address for the order.
  - **street** (string) - Required.
  - **city** (string) - Required.
  - **zipCode** (string) - Required.
  - **country** (string) - Required.

### Request Example
```json
{
  "userId": 1,
  "items": [
    {
      "productId": 101,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345",
    "country": "USA"
  }
}
```

### Response
#### Success Response (201)
- **orderId** (integer) - The unique identifier for the newly created order.
- **status** (string) - The status of the order (e.g., 'pending', 'processing').

#### Response Example
```json
{
  "orderId": 5001,
  "status": "pending"
}
```
```

--------------------------------

### Get and Set CSS Variables

Source: https://vueuse.org/core/useCssVar

Demonstrates how to use useCssVar to get and set CSS variables. It shows usage with a direct element reference, a template ref with a dynamic variable name, and with an initial value.

```typescript
import {
  useCssVar
} from '@vueuse/core'
import {
  useTemplateRef
} from 'vue'

const el = 
useTemplateRef('el')
const color1 = 
useCssVar('--color', el)

const elv = 
useTemplateRef('elv')
const key = ref('--color')
const colorVal = 
useCssVar(key, elv)

const someEl = 
useTemplateRef('someEl')
const color2 = 
useCssVar('--color', someEl, { 
initialValue: '#eee' })
```

--------------------------------

### Use usePrecision Hook

Source: https://vueuse.org/math/useprecision

Demonstrates how to use the usePrecision hook with different rounding methods. Ensure you have '@vueuse/math' installed and imported.

```typescript
import {
usePrecision
} from '@vueuse/math'

const value = ref(3.1415)
const result = usePrecision(value, 2) // 3.14

const ceilResult = usePrecision(value, 2,
{
math: 'ceil'
}) // 3.15

const floorResult = usePrecision(value, 3,
{
math: 'floor'
}) // 3.141
```

--------------------------------

### Basic Usage of useRouteQuery

Source: https://vueuse.org/router/useRouteQuery

Demonstrates basic initialization, default values, and type transformation for route query parameters.

```typescript
import { 
useRouteQuery
 } from '@vueuse/router'

const 
search
 = 
useRouteQuery
('search')

const 
search
 = 
useRouteQuery
('search', 'foo') // or with a default value

const 
page
 = 
useRouteQuery
('page', '1', { 
transform
: 
Number
 }) // or transforming value


console
.
log
(
search
.
value
) // route.query.search

search
.
value
 = 'foobar' // router.replace({ query: { search: 'foobar' } })
```

--------------------------------

### useTimestamp - Basic Usage

Source: https://vueuse.org/core/useTimestamp

Import and use the useTimestamp composable to get a reactive timestamp.

```APIDOC
## useTimestamp 

### Description
Reactive current timestamp.

### Method
Composition API function

### Endpoint
N/A (Composable)

### Parameters
#### Query Parameters
- **options** (object) - Optional - Configuration options for useTimestamp.
  - **offset** (number) - Optional - Offset value to add to the timestamp. Defaults to 0.
  - **controls** (boolean) - Optional - If true, exposes pause and resume functions. Defaults to false.
  - **immediate** (boolean) - Optional - Update the timestamp immediately. Defaults to true. (Deprecated, use `scheduler` instead)
  - **interval** ("requestAnimationFrame" | number) - Optional - Update interval. Defaults to `requestAnimationFrame`. (Deprecated, use `scheduler` instead)
  - **callback** ((timestamp: number) => void) - Optional - Callback function executed on each timestamp update.
  - **scheduler** ("requestAnimationFrame" | number | (() => void)) - Optional - Custom scheduler for updates.

### Request Example
```json
{
  "offset": 1000,
  "controls": true
}
```

### Response
- **timestamp** (ShallowRef<number>) - The reactive timestamp.
- **pause** (function) - Function to pause timestamp updates (only if `controls` is true).
- **resume** (function) - Function to resume timestamp updates (only if `controls` is true).

### Response Example
```json
{
  "timestamp": 1776449480915,
  "pause": "function",
  "resume": "function"
}
```
```

--------------------------------

### useCloned - Manual Synchronization

Source: https://vueuse.org/core/usecloned

Illustrates how to use `useCloned` with the `manual: true` option, requiring explicit calls to `sync()` to update the cloned ref.

```APIDOC
## useCloned - Manual Synchronization

### Description
This example shows how to use `useCloned` in manual mode. When `manual` is set to `true`, the `cloned` ref is not automatically updated when the `source` ref changes. You must call the `sync()` function to update the `cloned` ref.

### Method
`useCloned(source: MaybeRefOrGetter<T>, options?: UseClonedOptions<T>): UseClonedReturn<T>

### Parameters
#### Source
- **source** (Ref<T> | T | () => T) - Required - The ref or value to clone.

#### Options
- **clone** (function) - Optional - A custom function to perform the cloning. Defaults to `cloneFnJSON`.
- **manual** (boolean) - Required - Set to `true` to enable manual synchronization.

### Request Example
```typescript
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })
const { cloned, sync } = useCloned(original, { manual: true })

original.value.key = 'manual'
console.log(cloned.value.key) // Output: 'value'

sync()
console.log(cloned.value.key) // Output: 'manual'
```

### Response
#### Success Response
- **cloned** (Ref<T>) - A ref containing the cloned data, updated only when `sync()` is called.
- **isModified** (Ref<boolean>) - A ref indicating if the cloned data has been modified compared to the source.
- **sync** (function) - A function to manually synchronize the cloned data with the source.

#### Response Example
```json
{
  "cloned": {"key": "manual"},
  "isModified": true,
  "sync": "[Function: sync]"
}
```
```

--------------------------------

### useUserMedia with Device Selection

Source: https://vueuse.org/core/useusermedia

Shows how to use useUserMedia in conjunction with useDevicesList to select specific cameras and microphones.

```APIDOC
## GET /api/users/{id}

### Description
Retrieves the details of a specific user by their unique identifier.

### Method
GET

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the user to retrieve.

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the user.
- **username** (string) - The username of the user.
- **email** (string) - The email address of the user.

#### Response Example
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```

--------------------------------

### useInfiniteScroll - Basic Usage

Source: https://vueuse.org/core/useInfiniteScroll

Demonstrates the basic implementation of useInfiniteScroll for loading more data as the user scrolls.

```APIDOC
## POST /api/users

### Description
This endpoint allows you to create a new user in the system.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Request Body
- **name** (string) - Required - The name of the user.
- **email** (string) - Required - The email address of the user.

### Request Example
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Response
#### Success Response (201)
- **id** (string) - The unique identifier of the newly created user.
- **name** (string) - The name of the user.
- **email** (string) - The email address of the user.

#### Response Example
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### useElementBounding - Basic Usage

Source: https://vueuse.org/core/useelementbounding

Demonstrates how to use the useElementBounding composable to get the reactive bounding box of an HTML element.

```APIDOC
## useElementBounding

### Description
Reactive bounding box of an HTML element.

### Method
Composable Function

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)
</script>

<template>
  <div ref="el" />
</template>
```

### Response
#### Success Response (Composable Return)
- **x** (ShallowRef<number>) - The x-coordinate of the element's bounding box.
- **y** (ShallowRef<number>) - The y-coordinate of the element's bounding box.
- **top** (ShallowRef<number>) - The top coordinate of the element's bounding box.
- **right** (ShallowRef<number>) - The right coordinate of the element's bounding box.
- **bottom** (ShallowRef<number>) - The bottom coordinate of the element's bounding box.
- **left** (ShallowRef<number>) - The left coordinate of the element's bounding box.
- **width** (ShallowRef<number>) - The width of the element's bounding box.
- **height** (ShallowRef<number>) - The height of the element's bounding box.
- **update** (() => void) - A function to manually trigger an update of the bounding box.

#### Response Example
```json
{
  "x": 10,
  "y": 20,
  "top": 20,
  "right": 150,
  "bottom": 120,
  "left": 10,
  "width": 140,
  "height": 100
}
```
```

--------------------------------

### Usage of tryOnUnmounted

Source: https://vueuse.org/shared/tryOnUnmounted

Import and execute the function within a component setup.

```typescript
import { 
tryOnUnmounted
 } from '@vueuse/core'


tryOnUnmounted
(() => {

})
```

--------------------------------

### useAxios with Config Options

Source: https://vueuse.org/integrations/useAxios

Demonstrates how to pass custom Axios request configurations to useAxios.

```APIDOC
## useAxios with Config Options

### Description
This snippet shows how to provide specific request configurations, such as the HTTP method, when using `useAxios`.

### Method
POST

### Endpoint
`/posts` (relative to the instance's baseURL)

### Parameters
#### Query Parameters
None

#### Request Body
None (implicitly handled by Axios config if provided)

### Request Example
```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

const { data, isFinished } = useAxios('/posts', { method: 'POST' }, instance)
```

### Response
#### Success Response (200)
- **data** (Ref<T>) - Response data
- **isFinished** (Ref<boolean>) - Request has completed (success or error)

#### Response Example
```json
{
  "message": "Post created successfully"
}
```
```

--------------------------------

### useStorage Options in JavaScript

Source: https://vueuse.org/core/useStorage

Shows the configuration options for useStorage in JavaScript, mirroring the TypeScript example for deep watching, cross-tab synchronization, and error handling.

```javascript
'use strict'
useStorage('key', defaults, storage, {
  // Watch for deep changes in objects/arrays (default: true)
  deep: true,
  // Sync across tabs via storage events (default: true)
  listenToStorageChanges: true,
  // Write default value to storage if not present (default: true)
  writeDefaults: true,
  // Use shallowRef instead of ref (default: false)
  shallow: false,
  // Initialize only after component is mounted (default: false)
  initOnMounted: false,
  // Custom error handler (default: console.error)
  onError: (e) => console.error(e),
  // Watch flush timing (default: 'pre')
  flush: 'pre',
})
```

--------------------------------

### Battery Status Demo Output

Source: https://vueuse.org/core/usebattery

Example output showing the reactive state values returned by the Battery API.

```text
isSupported: true
charging: true
chargingTime: 0
dischargingTime: .inf
level: 1

```

--------------------------------

### Basic Usage of watchIgnorable

Source: https://vueuse.org/shared/watchIgnorable

Demonstrates how to use watchIgnorable to log changes to a source, with examples of ignoring updates and observing subsequent logged changes.

```typescript
import {
  watchIgnorable
} from '@vueuse/core'
import {
  nextTick,
  shallowRef
} from 'vue'

const source = shallowRef('foo')

const { stop, ignoreUpdates } = watchIgnorable(
  source,
  v => console.log(`Changed to ${v}!`),
)


source.value = 'bar'
await nextTick() // logs: Changed to bar!


ignoreUpdates(() => {
  source.value = 'foobar'
})
await nextTick() // (nothing happened)


source.value = 'hello'
await nextTick() // logs: Changed to hello!


ignoreUpdates(() => {
  source.value = 'ignored'
})

source.value = 'logged'

await nextTick() // logs: Changed to logged!
```

--------------------------------

### useDateFormat with Locales

Source: https://vueuse.org/shared/useDateFormat

Illustrates how to use useDateFormat with specific locales to format dates, using 'en-US' as an example for day names.

```APIDOC
## useDateFormat with Locales

### Description
This example demonstrates using `useDateFormat` with the `locales` option to specify the language for date formatting. Here, 'en-US' is used to format the day of the week.

### Method
`useDateFormat(date, formatString, options)`

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import {
useDateFormat,
useNow
} from '@vueuse/core'

const
formatted
=
useDateFormat(
useNow(), 'YYYY-MM-DD (ddd)', { locales: 'en-US' })
</script>

<template>
  <div>{{ formatted }}</div>
</template>
```

### Response
#### Success Response (200)
N/A (Composable Function returns a `ComputedRef<string>`)

#### Response Example
```json
{
  "example": "2023-10-27 (Fri)"
}
```
```

--------------------------------

### useRouteQuery Basic Usage

Source: https://vueuse.org/router/useroutequery

Demonstrates the basic usage of useRouteQuery to get and set URL query parameters. It shows how to initialize with a name, with a default value, and with value transformation.

```APIDOC
## useRouteQuery Basic Usage

### Description
This composable provides a shorthand for a reactive `route.query`. It updates the URL query parameters when the ref changes.

### Method
`useRouteQuery(name: string, defaultValue?: MaybeRefOrGetter<T>, options?: ReactiveRouteOptionsWithTransform<T, K>): Ref<K>
`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **name** (string) - Required - The name of the query parameter.
- **defaultValue** (MaybeRefOrGetter<T>) - Optional - The default value for the query parameter.
- **options** (ReactiveRouteOptionsWithTransform<T, K>) - Optional - Configuration options for the composable.
  - **mode** ('push' | 'replace') - The navigation mode to use ('push' or 'replace'). Defaults to 'replace'.
  - **transform** (object) - An object with `get` and `set` functions for transforming the value.
    - **get** (function) - Function to transform the value when reading from the URL.
    - **set** (function) - Function to transform the value when writing to the URL.

### Request Example
ts
```typescript
import { useRouteQuery } from '@vueuse/router'

const search = useRouteQuery('search')
const searchWithDefault = useRouteQuery('search', 'foo')
const page = useRouteQuery('page', '1', { transform: Number })

console.log(search.value) // route.query.search
search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })
```

### Response
#### Success Response (200)
Returns a `Ref` object that is synchronized with the specified route query parameter.

#### Response Example
```json
{
  "value": "current_query_param_value"
}
```
```

--------------------------------

### useFavicon with a Source Ref

Source: https://vueuse.org/core/usefavicon

This example shows how to pass a `ref` to `useFavicon`. Changes to the source ref will automatically update the favicon.

```APIDOC
## useFavicon with Source Ref

### Description

Pass a `ref` to `useFavicon`. Changes from the source ref will be reflected to your favicon automatically. When a source ref is passed, the return ref will be identical to the source ref.

### Method

`useFavicon(newIcon: ReadonlyRefOrGetter<string | null | undefined>, options?: UseFaviconOptions): ComputedRef<string | null | undefined>`

### Parameters

#### Request Body

- **newIcon** (ReadonlyRefOrGetter<string | null | undefined>) - Required - A ref or getter that provides the favicon URL or path.
- **options** (UseFaviconOptions) - Optional - Configuration options.
  - **baseUrl** (string) - Optional - Base URL for the favicon.
  - **rel** (string) - Optional - The 'rel' attribute for the favicon link tag.

### Request Example

```typescript
import { useFavicon, usePreferredDark } from '@vueuse/core'
import { computed } from 'vue'

const isDark = usePreferredDark()
const favicon = computed(() => isDark.value ? 'dark.png' : 'light.png')

useFavicon(favicon)
```

### Response

Returns a `ComputedRef` that is identical to the source ref.

#### Success Response (200)

- **icon** (ComputedRef<string | null | undefined>) - A computed ref that controls the favicon, identical to the source ref.

#### Response Example

```json
{
  "icon": "light.png"
}
```
```

--------------------------------

### useWindowFocus - Basic Usage

Source: https://vueuse.org/core/usewindowfocus

Demonstrates how to use the `useWindowFocus` composable to track the window's focus state in a Vue component.

```APIDOC
## useWindowFocus

### Description
Reactively track window focus with `window.onfocus` and `window.onblur` events.

### Method
Composable Function

### Endpoint
N/A (Composable Function)

### Parameters
#### Query Parameters
- **options** (ConfigurableWindow) - Optional - Configuration options for the window.

### Request Example
```vue
<script setup lang="ts">
import { useWindowFocus } from '@vueuse/core'

const focused = useWindowFocus()
</script>

<template>
  <div>{{ focused }}</div>
</template>
```

### Response
#### Success Response (200)
- **focused** (ShallowRef<boolean>) - A reactive reference indicating whether the window is currently focused.
```

--------------------------------

### useTimeout Basic Usage

Source: https://vueuse.org/shared/useTimeout

A simple example of using useTimeout to set a timeout of 1000ms. The `ready` ref will become true after the timeout.

```APIDOC
## useTimeout Basic Usage

### Description

This example demonstrates the basic usage of the `useTimeout` composable. After the specified interval, a reactive boolean ref (`ready`) will be set to `true`.

### Method

`useTimeout`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```ts
import { useTimeout } from '@vueuse/core'

const ready = useTimeout(1000)
```

### Response

#### Success Response (200)

- **ready** (ComputedRef<boolean>) - A computed ref that becomes `true` after the timeout duration.

#### Response Example

```json
{
  "ready": true // after 1 second
}
```
```

--------------------------------

### Writable computedInject

Source: https://vueuse.org/core/computedInject

Demonstrates how to create a writable computed property using computedInject with `get` and `set` functions.

```APIDOC
### Writable Computed

You can also create a writable computed property by passing an object with `get` and `set` functions.

```typescript
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(ArrayKey, {
  get(source) {
    return source.value.map(item => item.value)
  },
  set(value) {
    // handle setting the value
    console.log('Setting value:', value)
  },
})
```
```

--------------------------------

### Initialize useRTDB

Source: https://vueuse.org/firebase/usertdb

Basic setup for binding a Firebase Realtime Database reference to a reactive variable.

```typescript
import { 
useRTDB
 } from '@vueuse/firebase/useRTDB'
import { 
initializeApp
 } from 'firebase/app'
import { 
getDatabase
 } from 'firebase/database'

const 
app
 = 
initializeApp
({ /* config */ })
const 
db
 = 
getDatabase
(
app
)

// in setup()
const 
todos
 = 
useRTDB
(
db
.ref('todos'))
```

--------------------------------

### usePreferredColorScheme - Basic Usage

Source: https://vueuse.org/core/usePreferredColorScheme

Demonstrates how to use the usePreferredColorScheme composable in a Vue TypeScript setup.

```APIDOC
## usePreferredColorScheme

### Description
Reactive prefers-color-scheme media query.

### Method
`usePreferredColorScheme()`

### Parameters
None

### Request Example
```typescript
import {
  usePreferredColorScheme
} from '@vueuse/core'

const preferredColor = usePreferredColorScheme()
```

### Response
Returns a `ComputedRef<ColorSchemeType>` which holds the current color scheme.

#### Success Response (200)
- **preferredColor** (ComputedRef<ColorSchemeType>) - The current color scheme ('dark', 'light', or 'no-preference').

#### Response Example
```json
{
  "preferredColor": "light"
}
```
```

--------------------------------

### Import and Initialize useBase64

Source: https://vueuse.org/core/usebase64

Import the useBase64 composable and initialize it with a reactive reference for text. This sets up the reactive base64 transformation.

```typescript
import {
  useBase64
} from '@vueuse/core'
import {
  shallowRef
} from 'vue'

const text = shallowRef('')

const { base64, promise, execute } = useBase64(text)
```

--------------------------------

### get Utility Function

Source: https://vueuse.org/shared/get

The `get` utility function is a shorthand for accessing `ref.value`. It can also be used to access properties of an object referenced by a ref.

```APIDOC
## get

### Description
Shorthand for accessing `ref.value` or properties of a referenced object.

### Method
N/A (Utility Function)

### Endpoint
N/A (Utility Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { get, ref } from '@vueuse/core'

const a = ref(42)
console.log(get(a)) // 42

const obj = ref({ count: 0 })
console.log(get(obj, 'count')) // 0
```

### Response
#### Success Response (200)
- **T** (any) - The value of the ref or the specified property.

#### Response Example
```json
{
  "example": "42"
}
```

#### Type Declarations
```typescript
/**
 * Shorthand for accessing `ref.value`
 */
export declare function get<T>(ref: MaybeRef<T>): T

export declare function get<T, K extends keyof T>(ref: MaybeRef<T>, key: K): T[K]
```
```

--------------------------------

### usePointer - Basic Usage

Source: https://vueuse.org/core/usepointer

Demonstrates how to import and use the `usePointer` function in a Vue component to get reactive pointer coordinates and other states.

```APIDOC
## usePointer - Basic Usage

### Description
This snippet shows the basic import and usage of the `usePointer` composable function to access reactive pointer properties like `x`, `y`, `pressure`, and `pointerType`.

### Method
Composable Function

### Endpoint
N/A (Client-side composable)

### Parameters
#### Query Parameters
- **options** (UsePointerOptions) - Optional - Configuration options for `usePointer`.

### Request Example
```typescript
import { usePointer } from '@vueuse/core'

const { x, y, pressure, pointerType } = usePointer()
```

### Response
#### Success Response (Composable Return)
- **x** (Ref<number>) - The current X coordinate of the pointer.
- **y** (Ref<number>) - The current Y coordinate of the pointer.
- **pressure** (Ref<number>) - The pressure of the pointer (e.g., for stylus).
- **pointerType** (Ref<PointerType | null>) - The type of pointer ('mouse', 'touch', 'pen').
- **pointerId** (Ref<number>) - The ID of the pointer.
- **tiltX** (Ref<number>) - The tilt of the pointer along the X-axis.
- **tiltY** (Ref<number>) - The tilt of the pointer along the Y-axis.
- **width** (Ref<number>) - The width of the pointer.
- **height** (Ref<number>) - The height of the pointer.
- **twist** (Ref<number>) - The twist of the pointer.
- **isInside** (ShallowRef<boolean>) - Whether the pointer is currently inside the target element.

#### Response Example
```json
{
  "x": 150,
  "y": 200,
  "pressure": 0.5,
  "pointerType": "mouse",
  "pointerId": 0,
  "tiltX": 0,
  "tiltY": 0,
  "width": 0,
  "height": 0,
  "twist": 0,
  "isInside": true
}
```
```

--------------------------------

### useCloned - Manual Syncing

Source: https://vueuse.org/core/useCloned

Shows how to use the `manual: true` option with useCloned. This prevents automatic updates to the clone and requires calling the `sync` function to update it.

```APIDOC
## useCloned - Manual Syncing

### Description
Demonstrates using `useCloned` with the `manual: true` option. The clone is not updated automatically; you must call `sync()` to update it.

### Method
`useCloned`

### Parameters
#### Source Ref
- **source** (Ref<T> | MaybeRefOrGetter<T>) - Required - The ref to clone.

#### Options
- **options** (UseClonedOptions) - Optional - Configuration options for cloning.
  - **manual** (boolean) - Required - Set to `true` to enable manual syncing.

### Request Example
```typescript
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })
const { cloned, sync } = useCloned(original, { manual: true })

original.value.key = 'manual'
console.log(cloned.value.key) // 'value'

sync()
console.log(cloned.value.key) // 'manual'
```

### Response
#### Success Response
- **cloned** (Ref<T>) - A reactive ref containing the cloned data.
- **sync** (function) - A function to manually sync the cloned data with the source ref.

#### Response Example
```json
{
  "cloned": {"key": "value"},
  "sync": () => {}
}
```
```

--------------------------------

### Basic usePermission Usage

Source: https://vueuse.org/core/usePermission

Import and use the usePermission composable to get the reactive state for microphone access.

```typescript
import {
usePermission
} from '@vueuse/core'

const microphoneAccess
 = 
usePermission
('microphone')
```

--------------------------------

### Reactive mouse position output

Source: https://vueuse.org/core/usemouseinelement

Example output showing the reactive state properties of the mouse position relative to an element.

```text
x: 0
y: 0
sourceType: null
elementX: -368
elementY: -480
elementPositionX: 368
elementPositionY: 480
elementHeight: 160
elementWidth: 160
isOutside: true

```

```text
x: 0
y: 0
sourceType: null
elementX: -384
elementY: -838
elementPositionX: 384
elementPositionY: 838
elementHeight: 20
elementWidth: 127.859375
isOutside: true

```

--------------------------------

### Using the Custom Fetch Hook in a Vue Component

Source: https://vueuse.org/shared/createeventhook

Demonstrates how to consume the `useMyFetch` composable within a Vue 3 setup script. It shows how to subscribe to `onResult` and `onError` events.

```vue
<script setup lang="ts">
import {
useMyFetch
} from './my-fetch-function'

const { 
onResult
,
onError
} = 
useMyFetch
('my api url')


onResult
((
result
) => {
  
console
.
log
(
result
)
})


onError
((
error
) => {
  
console
.error
(
error
)
})
</script>
```

--------------------------------

### useDevicesList()

Source: https://vueuse.org/core/useDevicesList

A reactive utility to enumerate available media devices and manage permissions.

```APIDOC
## useDevicesList()

### Description
Reactive enumerateDevices listing available input/output devices.

### Parameters
#### Options
- **onUpdated** (function) - Optional - Callback triggered when devices are updated.
- **requestPermissions** (boolean) - Optional - Whether to request permissions immediately if not granted. Default: false.
- **constraints** (MediaStreamConstraints) - Optional - Media types to request permissions for. Default: { audio: true, video: true }.

### Response
- **devices** (ShallowRef<MediaDeviceInfo[]>) - All available devices.
- **videoInputs** (ComputedRef<MediaDeviceInfo[]>) - List of video input devices.
- **audioInputs** (ComputedRef<MediaDeviceInfo[]>) - List of audio input devices.
- **audioOutputs** (ComputedRef<MediaDeviceInfo[]>) - List of audio output devices.
- **permissionGranted** (ShallowRef<boolean>) - Current permission status.
- **ensurePermissions** (function) - Async function to request device permissions.
```

--------------------------------

### injectLocal Usage

Source: https://vueuse.org/shared/injectLocal

Demonstrates how to use provideLocal and injectLocal within a Vue component's script setup.

```APIDOC
## POST /api/users

### Description
This endpoint allows for the creation of a new user in the system.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address of the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (201)
- **id** (string) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
```json
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### Component Usage Example (Vue SFC)

Source: https://vueuse.org/core/usepreferredcolorscheme

Shows how to use the renderless component version of `usePreferredColorScheme` within a Vue Single File Component (SFC).

```APIDOC
## Component Usage Example (Vue SFC)

### Description
Utilize the renderless component `UsePreferredColorScheme` for accessing the color scheme within a Vue template.

### Method
Renderless Component

### Endpoint
N/A

### Parameters
N/A

### Request Body
N/A

### Response
#### Success Response
- **colorScheme** (string) - The detected color scheme ('dark', 'light', or 'no-preference').

### Request Example
```vue
<template>
  <UsePreferredColorScheme v-slot="{ colorScheme }">
    Preferred Color Scheme: {{ colorScheme }}
  </UsePreferredColorScheme>
</template>

<script setup>
import { UsePreferredColorScheme } from '@vueuse/components';
</script>
```

### Response Example
```html
Preferred Color Scheme: light
```
```

--------------------------------

### Get Current Component Element

Source: https://vueuse.org/core/useCurrentElement

Import and use `useCurrentElement` to get the DOM element of the current component. The returned value is a `ComputedRef<Element>` and will be undefined until the component is mounted.

```typescript
import {
useCurrentElement
} from '@vueuse/core'

const el = 
useCurrentElement
() // ComputedRef<Element>
```

--------------------------------

### useCounter - Usage with Options

Source: https://vueuse.org/shared/usecounter

Illustrates how to use the useCounter composable with custom initial values and options like minimum and maximum bounds.

```APIDOC
## useCounter - Usage with Options

### Description
This example demonstrates initializing the `useCounter` composable with a specific starting value and defining constraints using the `min` and `max` options.

### Method
`useCounter(initialValue, options)`

### Parameters
- **initialValue** (number, optional) - The starting value for the counter. Defaults to 0.
- **options** (object, optional) - Configuration options for the counter.
  - **min** (number, optional) - The minimum allowed value for the counter.
  - **max** (number, optional) - The maximum allowed value for the counter.

### Request Example
```typescript
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter(1, { min: 0, max: 16 })
```

### Response
- **count** (Ref<number>) - The current value of the counter, respecting min/max bounds.
- **inc** (function) - Function to increment the counter.
- **dec** (function) - Function to decrement the counter.
- **set** (function) - Function to set the counter to a specific value.
- **reset** (function) - Function to reset the counter to its initial value.

### Response Example
```json
{
  "count": 1,
  "inc": "function",
  "dec": "function",
  "set": "function",
  "reset": "function"
}
```
```

--------------------------------

### Import and Initialize useWakeLock

Source: https://vueuse.org/core/useWakeLock

Import the useWakeLock composable and destructure its reactive properties and methods. This setup is necessary to interact with the Screen Wake Lock API.

```typescript
import {
useWakeLock
} from '@vueuse/core'

const { 
isSupported
,
isActive
,
forceRequest
,
request
,
release
} = 
useWakeLock
()
```

--------------------------------

### Get Parent Element by Template Ref

Source: https://vueuse.org/core/useParentElement

Pass a template ref to `useParentElement` to get the parent element of a specific element within your template. The element must be mounted to have a parent.

```vue
<script setup lang="ts">
import { 
useParentElement
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const tooltip = 
useTemplateRef
('tooltip')

const tooltipWrapper = 
useParentElement
(
tooltip
)

onMounted(() => {
  console.log(tooltipWrapper.value)
})
</script>

<template>
  <div>
    <p ref="tooltip" />
  </div>
</template>
```

--------------------------------

### useConfirmDialog - Basic Usage

Source: https://vueuse.org/core/useConfirmDialog

Demonstrates the basic usage of useConfirmDialog with template-based control.

```APIDOC
## useConfirmDialog - Basic Usage

### Description
This example shows how to use the `useConfirmDialog` composable to manage a modal dialog directly from the template.

### Method
`useConfirmDialog()`

### Parameters
- `revealed` (ShallowRef<boolean>) - Optional: A ref to control the revealed state of the dialog.

### Functions Returned
- `isRevealed` (ComputedRef<boolean>): Indicates if the dialog is currently revealed.
- `reveal` (Function): Triggers the dialog to be revealed and returns a promise.
- `confirm` (Function): Confirms the dialog action and closes it.
- `cancel` (Function): Cancels the dialog action and closes it.
- `onReveal` (EventHookOn): Hook triggered when the dialog is revealed.
- `onConfirm` (EventHookOn): Hook triggered when the dialog is confirmed.
- `onCancel` (EventHookOn): Hook triggered when the dialog is canceled.

### Request Example
```vue
<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } = useConfirmDialog()
</script>

<template>
  <button @click="reveal">Reveal Modal</button>

  <teleport to="body">
    <div v-if="isRevealed" class="modal-bg">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm">Yes</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </teleport>
</template>
```
```

--------------------------------

### Get Battery Status

Source: https://vueuse.org/core/useBattery

Import and use the `useBattery` composable to get reactive battery status. Ensure to check `isSupported` before using the values, as the Battery API has limited browser support.

```typescript
import {
  useBattery
} from '@vueuse/core'

const { 
  isSupported,
  charging,
  chargingTime,
  dischargingTime,
  level
} = 
useBattery
()
```

--------------------------------

### Delaying Animation Start

Source: https://vueuse.org/core/useAnimate

Demonstrates manual control of animation playback by setting immediate to false.

```ts
import { 
useAnimate
 } from '@vueuse/core'

const { 
play
 } = 
useAnimate
(el, keyframes, {
  
duration
: 1000,
  
immediate
: false,
})

// Start the animation manually

play
()
```

--------------------------------

### Get and Set Zoom Factor

Source: https://vueuse.org/electron/useZoomFactor

Import and use the useZoomFactor composable to get the current zoom factor and optionally set a new one. Ensure nodeIntegration is enabled if not explicitly providing a webFrame.

```typescript
import { 
useZoomFactor
 } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const 
factor
 = 
useZoomFactor
()

console
.
log
(
factor
.
value
) // print current zoom factor

factor
.
value
 = 2 // change current zoom factor
```

--------------------------------

### Customizing Cache Key with getKey

Source: https://vueuse.org/core/useMemoize

Demonstrates how to customize the cache key generation using the `getKey` option. This example ignores the `headers` argument when determining the cache key, using only `userId`.

```typescript
const 
getUser
 =
useMemoize
(
  async (userId: number, 
headers
: AxiosRequestHeaders): 
Promise
<UserData>
 =>
    axios.get(`users/${userId}`, { 
headers
 }).then(({ data }) => 
data
),
  {
    // Use only userId to get/set cache and ignore headers
    
getKey
: (userId, 
headers
) => 
userId
,
  },
)
```

```javascript
'use strict'
const getUser = useMemoize(
  async (userId, headers) =>
    axios.get(`users/${userId}`, { headers }).then(({ data }) => data),
  {
    // Use only userId to get/set cache and ignore headers
    getKey: (userId, headers) => userId,
  },
)
```

--------------------------------

### Get Reactive Browser Location

Source: https://vueuse.org/core/usebrowserlocation

Import and use the useBrowserLocation composable to get a reactive reference to the browser's location object. Note: If using Vue Router, prefer its useRoute hook.

```typescript
import {
useBrowserLocation
} from '@vueuse/core'

const location = 
useBrowserLocation
()
```

--------------------------------

### useStyleTag API

Source: https://vueuse.org/core/usestyletag

Documentation for the useStyleTag composable, including its parameters, return values, and usage examples.

```APIDOC
## useStyleTag

### Description
Inject reactive `<style>` element in head.

### Method
`useStyleTag(css: MaybeRef<string>, options?: UseStyleTagOptions): UseStyleTagReturn`

### Parameters
#### Request Body
- **css** (MaybeRef<string>) - The CSS string to inject.
- **options** (UseStyleTagOptions) - Optional configuration for the style tag.
  - **media** (string) - Media query for styles to apply.
  - **immediate** (boolean) - Load the style immediately. Defaults to `true`.
  - **manual** (boolean) - Manually control the timing of loading and unloading. Defaults to `false`.
  - **id** (string) - DOM id of the style tag. Defaults to auto-incremented.
  - **nonce** (string) - Nonce value for CSP (Content Security Policy).

### Return Values
- **id** (string) - The ID of the injected style tag.
- **css** (ShallowRef<string>) - A reactive reference to the CSS string.
- **load** - Function to load the style tag.
- **unload** - Function to unload the style tag.
- **isLoaded** (Readonly<ShallowRef<boolean>>) - A reactive boolean indicating if the style tag is loaded.

### Basic Usage
```typescript
import { useStyleTag } from '@vueuse/core'

const { id, css, load, unload, isLoaded } = useStyleTag('.foo { margin-top: 32px; }')

// Later you can modify styles
css.value = '.foo { margin-top: 64px; }'
```

### Custom ID
```typescript
useStyleTag('.foo { margin-top: 32px; }', { id: 'custom-id' })
```

### Media Query
```typescript
useStyleTag('.foo { margin-top: 32px; }', { media: 'print' })
```
```

--------------------------------

### Basic Gamepad Usage

Source: https://vueuse.org/core/useGamepad

Demonstrates how to access gamepad state and filter for standard-mapped controllers.

```vue
<script setup lang="ts">
import { 
useGamepad
 } from '@vueuse/core'
import { 
computed
 } from 'vue'

const { 
isSupported
, 
gamepads
 } = 
useGamepad
()
const 
gamepad
 = 
computed
(() => 
gamepads
.value.find(g => g.mapping === 'standard'))
</script>

<template>
  <span>
    {{ gamepad.id }}
  </span>
</template>
```

--------------------------------

### Get and Set Route Hash

Source: https://vueuse.org/router/useroutehash

Import and use the useRouteHash composable to get the current route's hash value or set a new one. Setting the value uses router.replace to update the hash.

```typescript
import {
useRouteHash
} from '@vueuse/router'

const
search
=
useRouteHash
()


console
.
log
(
search
.
value
)
// route.hash

search
.
value
=
'foobar'
// router.replace({ hash: 'foobar' })

```

--------------------------------

### Usage of useFloor

Source: https://vueuse.org/math/useFloor

Demonstrates importing and using useFloor with a reactive ref.

```typescript
import { 
useFloor
 } from '@vueuse/math'

const 
value
 = 
ref
(45.95)
const 
result
 = 
useFloor
(
value
) // 45
```

--------------------------------

### Wait for some async data to be ready

Source: https://vueuse.org/shared/until

This example demonstrates how to use `until` to wait for asynchronous data fetched by `useAsyncState` to be ready before accessing its state.

```APIDOC
## Wait for some async data to be ready

### Description
Waits for asynchronous data to be ready before proceeding.

### Method
`until(isReady).toBe(true)`

### Endpoint
N/A (Composition API function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { until, useAsyncState } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async () => {
  await until(isReady).toBe(true)
  console.log(state) // state is now ready!
})()
```

### Response
#### Success Response (200)
N/A (This is a client-side composition function)

#### Response Example
N/A
```

--------------------------------

### useElementVisibility - Basic Usage

Source: https://vueuse.org/core/useelementvisibility

Tracks the visibility of an element within the viewport. This example shows basic usage with a template ref.

```APIDOC
## useElementVisibility

### Description
Tracks the visibility of an element within the viewport.

### Method
Composition API function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const targetIsVisible = useElementVisibility(target)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

### Response
#### Success Response (N/A - Returns a Ref)
- **targetIsVisible** (ShallowRef<boolean>) - A ref that is true when the element is visible, false otherwise.

#### Response Example
```json
{
  "isVisible": true
}
```
```

--------------------------------

### Basic Event Bus Usage (JavaScript)

Source: https://vueuse.org/core/useEventBus

Demonstrates how to create, listen to, emit, and unregister events using the useEventBus utility in plain JavaScript. Listeners registered within a component's setup are automatically cleaned up on unmount.

```javascript
import { useEventBus } from '@vueuse/core'
const bus = useEventBus('news')
function listener(event) {
  console.log(`news: ${event}`)
}
// listen to an event
const unsubscribe = bus.on(listener)
// fire an event
bus.emit('The Tokyo Olympics has begun')
// unregister the listener
unsubscribe()
// or
bus.off(listener)
// clearing all listeners
bus.reset()
```

--------------------------------

### Observe performance metrics

Source: https://vueuse.org/core/usePerformanceObserver

Demonstrates how to initialize the observer to track specific performance entry types.

```typescript
import { 
usePerformanceObserver
 } from '@vueuse/core'

const 
entrys
 = 
ref
<PerformanceEntry[]>([])

usePerformanceObserver
({
  
entryTypes
: ['paint'],
}, (
list
) => {
  
entrys
.
value
 = 
list
.
getEntries
()
})
```

```javascript
import { usePerformanceObserver } from '@vueuse/core'
const entrys = ref([])
usePerformanceObserver(
  {
    entryTypes: ['paint'],
  },
  (list) => {
    entrys.value = list.getEntries()
  },
)
```

--------------------------------

### Promise-based useConfirmDialog

Source: https://vueuse.org/core/useconfirmdialog

This example demonstrates using useConfirmDialog with promises for asynchronous confirmation flows. The `reveal` function returns a promise that resolves when the dialog is confirmed or canceled.

```vue
<script setup lang="ts">
import { 
useConfirmDialog
 } from '@vueuse/core'

const {
  isRevealed
,
  reveal
,
  confirm
,
  cancel
,
} = 
useConfirmDialog
()

async function 
openDialog
() {
  const { data, isCanceled } = await 
reveal
()
  if (!
isCanceled
)
    console.log(
data
)
}
</script>

<template>
  <button @click="
openDialog
">
    Show Modal
  </button>

  <teleport to="body">
    <div v-if="
isRevealed
" class="modal-layout">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="
confirm
(true)">
          Yes
        </button>
        <button @click="
confirm
(false)">
          No
        </button>
      </div>
    </div>
  </teleport>
</template>
```

--------------------------------

### Passing Arguments to Promise

Source: https://vueuse.org/core/createtemplatepromise

Defining and passing arguments to the start method, accessible via the args property in the template.

```ts
import { 
createTemplatePromise
 } from '@vueuse/core'

const 
TemplatePromise
 = 
createTemplatePromise
<boolean, [string, number]>()
```

```js
import { createTemplatePromise } from '@vueuse/core'
const TemplatePromise = createTemplatePromise()
```

```ts
const 
result
 = await 
TemplatePromise
.
start
('hello', 123) // Pr
```

```js
'use strict'
const result = await TemplatePromise.start('hello', 123) // Pr
```

```vue
<template>
  <TemplatePromise v-slot="{ 
args
, 
resolve
 }">
    <
div
>{{ 
args
[0] }}</
div
>
    <!-- hello -->
    <
div
>{{ 
args
[1] }}</
div
>
    <!-- 123 -->
    <
button
 @
click
="
resolve
(true)">
      OK
    </
button
>
  </TemplatePromise>
</template>
```

--------------------------------

### Basic Usage Output

Source: https://vueuse.org/core/useMouse

Displays the initial state of the mouse position variables.

```text
x: 0
y: 0
sourceType: null

```

```text
x: 0
y: 0
sourceType: null

```

--------------------------------

### useAbs - Reactive Absolute Value

Source: https://vueuse.org/math/useabs

Demonstrates how to use the `useAbs` composable to get the reactive absolute value of a number.

```APIDOC
## useAbs

### Description
Reactive `Math.abs`.

### Method
Composable function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { ref } from 'vue'
import { useAbs } from '@vueuse/math'

const value = ref(-23)
const absValue = useAbs(value) // Ref<23>
```

### Response
#### Success Response (Composable Return)
- **absValue** (ComputedRef<number>) - A computed reference containing the absolute value of the input.

#### Response Example
```json
{
  "absValue": 23
}
```

### Type Declarations
```typescript
/**
 * Reactive `Math.abs`.
 *
 * @see https://vueuse.org/useAbs
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useAbs(value: MaybeRefOrGetter<number>): ComputedRef<number>
```
```

--------------------------------

### Use useMin with an array

Source: https://vueuse.org/math/useMin

Import useMin from '@vueuse/math' and pass a ref array to get a reactive minimum value.

```typescript
import {
useMin
} from '@vueuse/math'

const array = ref([1, 2, 3, 4])
const min = useMin(array) // Ref<1>
```

--------------------------------

### useStepper with Steps as Object

Source: https://vueuse.org/core/usestepper

This example shows how to use `useStepper` when steps are defined as an object, allowing for more descriptive step configurations. It illustrates accessing the `title` property of the current step.

```APIDOC
## useStepper with Steps as Object

### Description
This example shows how to use `useStepper` when steps are defined as an object, allowing for more descriptive step configurations. It illustrates accessing the `title` property of the current step.

### Method
`useStepper`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useStepper } from '@vueuse/core'

const { 
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper({
  'user-information': {
    title: 'User information',
  },
  'billing-address': {
    title: 'Billing address',
  },
  'terms': {
    title: 'Terms',
  },
  'payment': {
    title: 'Payment',
  },
})

// Access the step object through `current`
console.log(current.value.title) // 'User information'
```

### Response
#### Success Response (200)
Similar to the array-based approach, this composable returns reactive state and methods. When steps are objects, the `current` computed property will return the full step object.

- **steps** (Ref<Object>) - List of steps.
- **stepNames** (Ref<Array<string>>) - List of step names.
- **index** (Ref<number>) - Index of the current step.
- **current** (ComputedRef<Object>) - Current step object.
- **next** (ComputedRef<string | undefined>) - Name of the next step, or undefined if the current step is the last one.
- **previous** (ComputedRef<string | undefined>) - Name of the previous step, or undefined if the current step is the first one.
- **isFirst** (ComputedRef<boolean>) - Whether the current step is the first one.
- **isLast** (ComputedRef<boolean>) - Whether the current step is the last one.
- **at** (Function) - Get the step object at the specified index.
- **get** (Function) - Get a step object by its name.
- **goTo** (Function) - Go to the specified step by name.
- **goToNext** (Function) - Go to the next step. Does nothing if the current step is the last one.
- **goToPrevious** (Function) - Go to the previous step. Does nothing if the current step is the previous one.
- **goBackTo** (Function) - Go back to the given step, only if the current step is after.
- **isNext** (Function) - Checks whether the given step name is the next step.
- **isPrevious** (Function) - Checks whether the given step name is the previous step.
- **isCurrent** (Function) - Checks whether the given step name is the current step.
- **isBefore** (Function) - Checks if the current step is before the given step name.
- **isAfter** (Function) - Checks if the current step is after the given step name.

#### Response Example
```json
{
  "steps": {
    "user-information": {
      "title": "User information"
    },
    "billing-address": {
      "title": "Billing address"
    },
    "terms": {
      "title": "Terms"
    },
    "payment": {
      "title": "Payment"
    }
  },
  "stepNames": [
    "user-information",
    "billing-address",
    "terms",
    "payment"
  ],
  "index": 0,
  "current": {
    "title": "User information"
  },
  "next": "billing-address",
  "previous": undefined,
  "isFirst": true,
  "isLast": false
}
```
```

--------------------------------

### Initialize useWebNotification

Source: https://vueuse.org/core/useWebNotification

Import and initialize useWebNotification with options. It provides reactive states for support, permission, and methods to show/close notifications. Ensure user grants permission before showing.

```typescript
import {
useWebNotification
} from '@vueuse/core'

const {

isSupported
,

notification
,

permissionGranted
,

show
,

close
,

onClick
,

onShow
,

onError
,

onClose
,} = 
useWebNotification
({

title
: 'Hello, VueUse world!',

dir
: 'auto',

lang
: 'en',

renotify
: true,

tag
: 'test',
})

if (
isSupported
.value && 
permissionGranted
.value)
show()

```

--------------------------------

### Use onStartTyping to Auto-Focus Input

Source: https://vueuse.org/core/onStartTyping

Demonstrates how to use onStartTyping to focus an input field when the user starts typing anywhere on the page. Requires importing onStartTyping and useTemplateRef.

```vue
<script setup lang="ts">
import { 
onStartTyping
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
input
 = 
useTemplateRef
('input')


onStartTyping
(() => {
  if (!
input
.value.active)
    
input
.value.focus()
})
</script>

<template>
  <input 
ref
="
input
" 
type
="text" 
placeholder
="Start typing to focus">
</template>
```

--------------------------------

### useCloned - Custom Clone Function

Source: https://vueuse.org/core/useCloned

Illustrates how to provide a custom cloning function to useCloned, for example, using the `klona` library for deep cloning.

```APIDOC
## useCloned - Custom Clone Function

### Description
Allows providing a custom cloning function via the `clone` option. This example uses `klona` for deep cloning.

### Method
`useCloned`

### Parameters
#### Source Ref
- **source** (Ref<T> | MaybeRefOrGetter<T>) - Required - The ref to clone.

#### Options
- **options** (UseClonedOptions) - Optional - Configuration options for cloning.
  - **clone** (CloneFn<T>) - Required - The custom cloning function to use.

### Request Example
```typescript
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import { klona } from 'klona'

const original = ref({ key: 'value' })
const { cloned, isModified, sync } = useCloned(original, { clone: klona })
```

### Response
#### Success Response
- **cloned** (Ref<T>) - A reactive ref containing the cloned data.
- **isModified** (Ref<boolean>) - A ref indicating if the cloned data has been modified compared to the source.
- **sync** (function) - A function to manually sync the cloned data with the source ref.

#### Response Example
```json
{
  "cloned": {"key": "value"},
  "isModified": false,
  "sync": () => {}
}
```
```

--------------------------------

### Basic usage of useAsyncState

Source: https://vueuse.org/core/useAsyncState

Demonstrates initializing useAsyncState with an axios promise and default state.

```ts
import { 
useAsyncState
 } from '@vueuse/core'
import 
axios
 from 'axios'

const { 
state
, 
isReady
, 
isLoading
, 
error
 } = 
useAsyncState
(
  
axios

    .
get
('https://jsonplaceholder.typicode.com/todos/1')
    .
then
(
t
 => 
t
.
data
),
  { 
id
: null },
)
```

--------------------------------

### Use useVModels in Options API

Source: https://vueuse.org/core/useVModels

Integrate useVModels within the setup function of an Options API component.

```typescript
import { 
useVModels
 } from '@vueuse/core'

export default {
  
props
: {
    
foo
: 
String
,
    
bar
: 
Number
,
  },
  
setup
(
props
, { 
emit
 }) {
    const { 
foo
, 
bar
 } = 
useVModels
(
props
, 
emit
)

    
console
.
log
(
foo
.
value
) // props.foo
    
foo
.
value
 = 'foo' // emit('update:foo', 'foo')
  },
}
```

--------------------------------

### Wait for custom conditions

Source: https://vueuse.org/shared/until

This example shows how to use `until` with `invoke` to wait for a counter to exceed a specific value.

```APIDOC
## Wait for custom conditions

### Description
Waits for a custom condition to be met, such as a counter exceeding a certain value.

### Method
`until(count).toMatch(v => v > 7)`

### Endpoint
N/A (Composition API function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { invoke, until, useCounter } from '@vueuse/core'

const { count } = useCounter()

invoke(async () => {
  await until(count).toMatch(v => v > 7)
  alert('Counter is now larger than 7!')
})
```

### Response
#### Success Response (200)
N/A (This is a client-side composition function)

#### Response Example
N/A
```

--------------------------------

### whenever - With Options

Source: https://vueuse.org/shared/whenever

Shows how to pass options to 'whenever', which are the same as those available for Vue's `watch` function, such as `flush`.

```APIDOC
## whenever - With Options

### Description
Options and defaults are same with `watch`.

### Method
N/A

### Endpoint
N/A

### Parameters
#### Options
- **flush** (sync | pre | post) - The flush strategy for the watcher.
- **immediate** (boolean) - Trigger the callback immediately upon creation.
- **deep** (boolean) - Deeply watch for changes.
- **once** (boolean) - Only trigger the callback once.

### Request Example
```javascript
// this
whenever(
  () => counter.value === 7,
  () => console.log('counter is 7 now!'),
  { flush: 'sync' },
)
```

### Response
N/A
```

--------------------------------

### useTextDirection Composable

Source: https://vueuse.org/core/useTextDirection

A reactive composable to get and set the text direction of an element.

```APIDOC
## useTextDirection

### Description
Reactive reference to the text direction of a DOM element. It allows reading and writing the 'dir' attribute of the target element.

### Parameters
#### Options
- **selector** (string) - Optional - CSS Selector for the target element. Default: 'html'.
- **observe** (boolean) - Optional - Observe changes using MutationObserver. Default: false.
- **initialValue** ('ltr' | 'rtl' | 'auto') - Optional - Initial value. Default: 'ltr'.

### Request Example
```typescript
import { useTextDirection } from '@vueuse/core'

const dir = useTextDirection({
  selector: 'body',
  observe: true
})
```

### Response
- **WritableComputedRef** (Ref<'ltr' | 'rtl' | 'auto'>) - A reactive reference that reflects and controls the text direction.
```

--------------------------------

### useGamepad

Source: https://vueuse.org/core/useGamepad

Reactive gamepad state management hook.

```APIDOC
## useGamepad

### Description
Provides reactive access to connected gamepads and their state.

### Parameters
#### Request Body
- **options** (UseGamepadOptions) - Optional - Configuration object extending ConfigurableWindow and ConfigurableNavigator.

### Response
#### Success Response
- **onConnected** (EventHookOn<number>) - Hook triggered when a gamepad connects.
- **onDisconnected** (EventHookOn<number>) - Hook triggered when a gamepad disconnects.
- **gamepads** (Ref<Gamepad[]>) - Reactive reference to the list of connected gamepads.
```

--------------------------------

### Basic usage of useStorage

Source: https://vueuse.org/core/useStorage

Demonstrates binding objects, primitives, and different storage types to reactive refs.

```ts
import { 
useStorage
 } from '@vueuse/core'

// bind object
const 
state
 = 
useStorage
('my-store', { 
hello
: 'hi', 
greeting
: 'Hello' })

// bind boolean
const 
flag
 = 
useStorage
('my-flag', true) // returns Ref<boolean>

// bind number
const 
count
 = 
useStorage
('my-count', 0) // returns Ref<number>

// bind string with SessionStorage
const 
id
 = 
useStorage
('my-id', 'some-string-id', 
sessionStorage
) // returns Ref<string>

// delete data from storage

state
.
value
 = null
```

--------------------------------

### createReusableTemplate Usage (Composition API)

Source: https://vueuse.org/core/createreusabletemplate

Basic example of using createReusableTemplate with Vue's Composition API to define and reuse a template section.

```APIDOC
## createReusableTemplate Usage (Composition API)

### Description
This example demonstrates the fundamental usage of `createReusableTemplate` to define a reusable template block and then render it in multiple places within a component.

### Method
`createReusableTemplate` function

### Endpoint
N/A (This is a composable function, not an API endpoint)

### Parameters
None directly for the function call, but it returns two components: `<DefineTemplate>` and `<ReuseTemplate>`.

### Request Example
```vue
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate>
    <!-- something complex -->
  </DefineTemplate>

  <dialog v-if="showInDialog">
    <ReuseTemplate />
  </dialog>
  <div v-else>
    <ReuseTemplate />
  </div>
</template>
```

### Response
- `<DefineTemplate>`: Registers the template and renders nothing.
- `<ReuseTemplate>`: Renders the template provided by `<DefineTemplate>`.

### Response Example
N/A (This is a component rendering example, not a direct API response.)
```

--------------------------------

### useCounter - Basic Usage

Source: https://vueuse.org/shared/usecounter

Demonstrates the basic implementation of the useCounter composable with default initial value and utility functions.

```APIDOC
## useCounter - Basic Usage

### Description
This example shows the fundamental usage of the `useCounter` composable, initializing a counter with its default value and accessing its utility functions.

### Method
`useCounter()`

### Parameters
None for basic usage.

### Request Example
```typescript
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter()
```

### Response
- **count** (Ref<number>) - The current value of the counter.
- **inc** (function) - Function to increment the counter.
- **dec** (function) - Function to decrement the counter.
- **set** (function) - Function to set the counter to a specific value.
- **reset** (function) - Function to reset the counter to its initial value.

### Response Example
```json
{
  "count": 0,
  "inc": "function",
  "dec": "function",
  "set": "function",
  "reset": "function"
}
```
```

--------------------------------

### Basic useInterval

Source: https://vueuse.org/shared/useInterval

Use this to create a simple counter that increases every 200ms. No additional setup is required.

```typescript
import {
useInterval
} from '@vueuse/core'

// count will increase every 200ms
const 
counter
 = 
useInterval
(200)
```

--------------------------------

### Type Declaration for injectLocal

Source: https://vueuse.org/shared/injectLocal

The TypeScript definition for the injectLocal function, including an example of its usage.

```ts
/**
 * On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
 *
 * @example
 * ```ts
 * injectLocal('MyInjectionKey', 1)
 * const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare const 
injectLocal
: typeof 
inject
```

--------------------------------

### watchOnce Usage

Source: https://vueuse.org/shared/watchOnce

Demonstrates how to use the watchOnce function to watch a source and execute a callback only once.

```APIDOC
## watchOnce

### Description
Shorthand for watching a value with `{ once: true }`. Once the callback fires once, the watcher will be stopped. See Vue's docs for full details.

### Method
N/A (This is a utility function, not an API endpoint)

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { watchOnce } from '@vueuse/core'

watchOnce(source, () => {
  // triggers only once
  console.log('source changed!')
})
```

### Response
#### Success Response (N/A)
N/A

#### Response Example
N/A
```

--------------------------------

### Use VueUse in Nuxt

Source: https://vueuse.org/guide

Example of using a VueUse function within a Nuxt component.

```vue
<script setup lang="ts">
const { 
x
, 
y
 } = 
useMouse
()
</script>

<template>
  <
div
>pos: {{ 
x
 }}, {{ 
y
 }}</
div
>
</template>
```

--------------------------------

### Use useMath for Power and Square Root

Source: https://vueuse.org/math/useMath

Demonstrates how to use `useMath` to create reactive references for the results of `Math.pow` and `Math.sqrt`. Ensure you import `useMath` and `ref` from their respective modules.

```typescript
import {
useMath
} from '@vueuse/math'

const 
base
 = 
ref
(2)
const 
exponent
 = 
ref
(3)
const 
result
 = 
useMath
('pow',
 
base
,
 
exponent
) // Ref<8>

const 
num
 = 
ref
(2)
const 
root
 = 
useMath
('sqrt',
 
num
) // Ref<1.4142135623730951>


num
.
value
 = 4

console
.
log
(
root
.
value
) // 2
```

--------------------------------

### Track Device Pixel Ratio with useDevicePixelRatio

Source: https://vueuse.org/core/useDevicePixelRatio

Import and use the `useDevicePixelRatio` function to get a reactive reference to the device's pixel ratio. This is useful for adjusting UI elements or rendering based on screen density.

```typescript
import {
useDevicePixelRatio
} from '@vueuse/core'

const { 
pixelRatio
} = 
useDevicePixelRatio
()
```

--------------------------------

### Consume Global State

Source: https://vueuse.org/firebase/usertdb

Example of consuming a global state store in a Vue component.

```vue
<!-- app.vue -->
<script setup lang="ts">
import { 
useTodos
 } from './store'

const 
todos
 = 
useTodos
()
</script>
```

--------------------------------

### Initialize useToggle

Source: https://vueuse.org/shared/useToggle

Import and initialize useToggle to get a boolean value and a toggle function. The initial value defaults to false.

```typescript
import {
useToggle
} from '@vueuse/core'

const [value, toggle] = 
useToggle
()
```

--------------------------------

### useAbs - Reactive Absolute Value

Source: https://vueuse.org/math/useAbs

Demonstrates how to use the useAbs function to get the absolute value of a reactive number.

```APIDOC
## useAbs

### Description
Reactive `Math.abs`.

### Method
Composition Function

### Endpoint
N/A (Client-side Composition Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import {
  useAbs
} from '@vueuse/math'

const value = ref(-23)
const absValue = useAbs(value) // Ref<23>
```

### Response
#### Success Response (200)
N/A (Returns a ComputedRef)

#### Response Example
```json
{
  "example": "Ref<23>"
}
```

### Type Declarations
```typescript
/**
 * Reactive `Math.abs`.
 *
 * @see https://vueuse.org/useAbs
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function
useAbs(
  value: MaybeRefOrGetter<number>,
): ComputedRef<number>
```
```

--------------------------------

### useNProgress with Customization Options

Source: https://vueuse.org/integrations/useNProgress

Demonstrates how to customize the nprogress behavior by passing an options object.

```APIDOC
## useNProgress with Customization Options

### Description
Configure the nprogress behavior by providing an options object to the `useNProgress` composable.

### Method
`useNProgress`

### Endpoint
N/A (Composable function)

### Parameters
- **currentProgress** (MaybeRefOrGetter<number | null | undefined>) - Optional. The initial progress percentage (0 to 1).
- **options** (UseNProgressOptions) - Optional. An object to configure nprogress. See `NProgressOptions` for available properties (e.g., `minimum`).

### Request Example
```typescript
import { useNProgress } from '@vueuse/integrations/useNProgress'

useNProgress(null, {
  minimum: 0.1,
  // other NProgressOptions
})
```

### Response
Returns an object with `isLoading`, `progress`, `start`, `done`, and `remove` functions/refs.
```

--------------------------------

### Setup useInfiniteScroll in Vue

Source: https://vueuse.org/core/useInfiniteScroll

Import and use `useInfiniteScroll` to load more data as the user scrolls. Ensure `canLoadMore` is correctly implemented to stop loading when no more content is available.

```vue
<script setup lang="ts">
import { 
useInfiniteScroll
 } from '@vueuse/core'
import { 
ref
,
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')
const 
data
 = 
ref
([1, 2, 3, 4, 5, 6])

const { 
reset
 } = 
useInfiniteScroll
(
  
el
,
  () => {
    // load more
    
data
.
value
.
push
(...moreData)
  },
  {
    
distance
: 10,
    
canLoadMore
: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  }
)

function 
resetList
() {
  
data
.
value
 = []
  
reset
()
}
</script>

<template>
  <
div
 
ref
="
el
">
    <
div
 v-for="
item
 in 
data
">
      {{ 
item
 }}
    </
div
>
  </
div
>
  <
button
 @
click
="
resetList
()">
    Reset
  </
button
>
</template>
```

--------------------------------

### Usage of watchOnce

Source: https://vueuse.org/shared/watchonce

Demonstrates the basic implementation of watchOnce to trigger a callback only upon the first change of the source.

```typescript
import { 
watchOnce
 } from '@vueuse/core'


watchOnce
(source, () => {
  // triggers only once
  
console
.
log
('source changed!')
})
```

--------------------------------

### Basic useDark Setup

Source: https://vueuse.org/core/usedark

Import and initialize useDark and useToggle for basic dark mode functionality. isDark is a ref that controls the dark mode state, and toggleDark is a function to switch between light and dark modes.

```typescript
import {
useDark,
useToggle
} from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

--------------------------------

### refWithControl Usage

Source: https://vueuse.org/shared/refWithControl

Demonstrates the basic usage of refWithControl, showing how to create a controlled ref and interact with it like a normal ref, as well as using its special methods for controlled reactivity.

```APIDOC
## refWithControl

### Description
Provides fine-grained controls over a ref and its reactivity.

### Method
`refWithControl(initialValue, options?)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { refWithControl } from '@vueuse/core'

const num = refWithControl(0)
const doubled = computed(() => num.value * 2)

// Normal ref behavior
num.value = 42
console.log(num.value) // 42
console.log(doubled.value) // 84

// Set value without triggering reactivity
num.set(30, false)
console.log(num.value) // 30
console.log(doubled.value) // 84 (doesn't update)

// Get value without tracking reactivity
watchEffect(() => {
  console.log(num.peek())
})

num.value = 50 // watch effect wouldn't be triggered since it collected nothing.
console.log(doubled.value) // 100 (updated again since it's a reactive set)
```

### Response
#### Success Response (200)
Returns a controlled ref object with additional methods.

#### Response Example
```json
{
  "value": 50,
  "get": "function",
  "set": "function",
  "untrackedGet": "function",
  "silentSet": "function",
  "peek": "function",
  "lay": "function"
}
```
```

--------------------------------

### Import and Initialize usePointerLock

Source: https://vueuse.org/core/usepointerlock

Import the usePointerLock composable and destructure its reactive properties and methods. This setup is typically done at the beginning of a component or composable.

```typescript
import {
  usePointerLock
} from '@vueuse/core'

const {
  isSupported,
  lock,
  unlock,
  element,
  triggerElement
} = usePointerLock()

```

--------------------------------

### Using the onReady Callback

Source: https://vueuse.org/core/usestorageasync

Shows how to use the `onReady` callback option within `useStorageAsync` to execute logic once the storage value is loaded.

```APIDOC
## DELETE /api/users/{id}

### Description
Deletes a user by their ID.

### Method
DELETE

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (integer) - Required - The unique identifier of the user to delete.

### Response
#### Success Response (204)
No content is returned upon successful deletion.

#### Response Example
(No content)
```

--------------------------------

### useThrottledRefHistory Usage Example

Source: https://vueuse.org/core/useThrottledRefHistory

Demonstrates how to use useThrottledRefHistory with a shallowRef counter. It initializes the history with a throttle of 1000ms and deep tracking.

```typescript
import {
useThrottledRefHistory
} from '@vueuse/core'
import {
shallowRef
} from 'vue'

const
counter
=
shallowRef(0)
const { 
history
, 
undo
, 
redo
 } =
useThrottledRefHistory(
counter
, { 
deep
: true, 
throttle
: 1000 })

```

--------------------------------

### useAverage - Basic Usage with Array

Source: https://vueuse.org/math/useAverage

Demonstrates how to use `useAverage` with a reactive array of numbers.

```APIDOC
## POST /api/users

### Description
This endpoint allows for the creation of new user resources.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address of the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (201 Created)
- **id** (string) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
```json
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### unrefElement Usage

Source: https://vueuse.org/core/unrefelement

Demonstrates how to use the unrefElement function to get DOM elements from template refs.

```APIDOC
## unrefElement

### Description
Retrieves the underlying DOM element from a Vue ref or component instance.

### Method
N/A (Utility function)

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import { unrefElement } from '@vueuse/core'
import { onMounted, useTemplateRef } from 'vue'

const div = useTemplateRef('div') // will be bound to the <div> element
const hello = useTemplateRef('hello') // will be bound to the HelloWorld Component

onMounted(() => {
  console.log(unrefElement(div)) // the <div> element
  console.log(unrefElement(hello)) // the root element of the HelloWorld Component
})
</script>

<template>
  <div ref="div" />
  <HelloWorld ref="hello" />
</template>
```

### Response
#### Success Response (200)
N/A (Utility function, returns the element directly)

#### Response Example
```json
{
  "example": "<div> or Component's root element"
}
```
```

--------------------------------

### Import and Use useMounted

Source: https://vueuse.org/core/useMounted

Import and use the useMounted composable to get a ref indicating the component's mounted state.

```typescript
import {
useMounted
} from '@vueuse/core'

const
isMounted
=
useMounted
()
```

--------------------------------

### Reactive JSON stringify

Source: https://vueuse.org/shared/reactify

Example of making JSON.stringify reactive to track changes in an object ref.

```typescript
import { 
reactify
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
stringify
 = 
reactify
(
JSON
.
stringify
)

const 
obj
 = 
shallowRef
(42)
const 
dumped
 = 
stringify
(
obj
)


console
.
log
(
dumped
.
value
) // '42'


obj
.
value
 = { 
foo
: 'bar' }


console
.
log
(
dumped
.
value
) // '{"foo":"bar"}'
```

--------------------------------

### Initialize useCssVar with Element and Options

Source: https://vueuse.org/core/usecssvar

Demonstrates how to use useCssVar to get and set a CSS variable '--color' on a specific element, with an initial value of '#eee'.

```typescript
import {
  useCssVar
} from '@vueuse/core'
import {
  useTemplateRef
} from 'vue'

const el = useTemplateRef('el')
const color1 = useCssVar('--color', el)

const elv = useTemplateRef('elv')
const key = ref('--color')
const colorVal = useCssVar(key, elv)

const someEl = useTemplateRef('someEl')
const color2 = useCssVar('--color', someEl, { initialValue: '#eee' })
```

--------------------------------

### Basic Event Bus Usage (TypeScript)

Source: https://vueuse.org/core/useEventBus

Demonstrates how to create, listen to, emit, and unregister events using the useEventBus utility in TypeScript. Listeners registered within a component's setup are automatically cleaned up on unmount.

```typescript
import {
useEventBus
} from '@vueuse/core'

const 
bus
 = 
useEventBus<string>('news')

function 
listener
(
event
: string) {
  
console
. 
log
(`news: ${ 
event
}`)
}

// listen to an event
const 
unsubscribe
 = 
bus
. 
on
(
listener
)

// fire an event
bus
. 
emit
('The Tokyo Olympics has begun')

// unregister the listener
unsubscribe()
// or
bus
. 
off
(
listener
)

// clearing all listeners
bus
. 
reset
()
```

--------------------------------

### Selecting specific devices with useUserMedia

Source: https://vueuse.org/core/useUserMedia

Shows how to combine useDevicesList with useUserMedia to request specific camera and microphone inputs.

```ts
import { 
useDevicesList
, 
useUserMedia
 } from '@vueuse/core'
import { 
computed
, 
reactive
 } from 'vue'

const {
  
videoInputs
: 
cameras
,
  
audioInputs
: 
microphones
,
} = 
useDevicesList
({
  
requestPermissions
: true,
})
const 
currentCamera
 = 
computed
(() => 
cameras
.
value
[0]?.
deviceId
)
const 
currentMicrophone
 = 
computed
(() => 
microphones
.
value
[0]?.
deviceId
)

const { 
stream
 } = 
useUserMedia
({
  
constraints
: 
reactive
({
    
video
: { 
deviceId
: 
currentCamera
 },
    
audio
: { 
deviceId
: 
currentMicrophone
, }
  })
})
```

--------------------------------

### Template Duplication Problem

Source: https://vueuse.org/core/createreusabletemplate

Example of redundant template code that often necessitates component extraction.

```vue
<template>
  <dialog v-if="showInDialog">
    <!-- something complex -->
  </dialog>
  <div v-else>
    <!-- something complex -->
  </div>
</template>
```

--------------------------------

### VueUse Storage Implementation

Source: https://vueuse.org/guide/work-with-ai

Demonstrates using useStorage and useLocalStorage for managing reactive state in local storage.

```typescript
import { useLocalStorage, useStorage } from '@vueuse/core'

const state = useStorage('my-key', { hello: 'hi' }) // localStorage by default
const theme = useLocalStorage('theme', 'light')
```

--------------------------------

### useClamp - Reactive Bounds

Source: https://vueuse.org/math/useclamp

Demonstrates how all arguments (value, min, max) can be reactive, allowing the clamped value to update automatically when bounds change.

```APIDOC
## useClamp (Reactive Bounds) 

### Description
All arguments (value, min, max) can be reactive. The clamped value updates automatically when the bounds change.

### Method
Composition API function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useClamp } from '@vueuse/math'
import { shallowRef } from 'vue'

const value = shallowRef(5)
const min = shallowRef(0)
const max = shallowRef(10)

const clamped = useClamp(value, min, max)

max.value = 3 // clamped.value automatically becomes 3
```

### Response
#### Success Response (200)
Returns a computed ref that dynamically adjusts to reactive bounds.

#### Response Example
```json
{
  "clampedValue": 3 
}
```
```

--------------------------------

### Merging defaults in useStorage

Source: https://vueuse.org/core/useStorage

Shows how to handle missing keys in storage by merging default values, with both TypeScript and JavaScript examples.

```ts
localStorage
.
setItem
('my-store', '{"hello": "hello"}')

const 
state
 = 
useStorage
('my-store', { 
hello
: 'hi', 
greeting
: 'hello' }, 
localStorage
)


console
.
log
(
state
.
value
.
greeting
) // undefined, since the value is not presented in storage
```

```js
'use strict'
localStorage.setItem('my-store', '{"hello": "hello"}')
const state = useStorage(
  'my-store',
  { hello: 'hi', greeting: 'hello' },
  localStorage,
)
console.log(state.value.greeting) // undefined, since the value is not presented in storage
```

--------------------------------

### Use useFloor for Reactive Flooring

Source: https://vueuse.org/math/usefloor

Import and use the useFloor function with a ref to get a reactive floored value. The result is a computed ref.

```typescript
import {
  useFloor
} from '@vueuse/math'

const value = ref(45.95)
const result = useFloor(value) // 45
```

--------------------------------

### Basic useImage Usage

Source: https://vueuse.org/core/useImage

Use this composable in your script setup to reactively manage image loading. It requires the image source URL and provides loading state.

```vue
<script setup lang="ts">
import { 
useImage
 } from '@vueuse/core'

const 
avatarUrl
 = 'https://place.dog/300/200'
const { 
isLoading
 } = 
useImage
({
 src
:
 avatarUrl
})
</script>

<template>
  <span v-if="
isLoading">
Loading
</span>
  <img v-else :src="
avatarUrl">
</template>
```

--------------------------------

### useAverage - Basic Usage with Multiple Arguments

Source: https://vueuse.org/math/useAverage

Demonstrates how to use `useAverage` with multiple reactive numbers as arguments.

```APIDOC
## GET /api/users/{userId}

### Description
Retrieves the details of a specific user by their unique identifier.

### Method
GET

### Endpoint
/api/users/{userId}

### Parameters
#### Path Parameters
- **userId** (string) - Required - The unique identifier of the user to retrieve.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200 OK)
- **id** (string) - The unique identifier for the user.
- **username** (string) - The username of the user.
- **email** (string) - The email address of the user.
- **createdAt** (string) - The timestamp when the user was created.

#### Response Example
```json
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Implement ConfigurableWindow in useActiveElement

Source: https://vueuse.org/guidelines

Support `configurableWindow` in options for functions using global variables like `window` to enhance flexibility for multi-window scenarios, testing mocks, and SSR. This example shows `useActiveElement`.

```typescript
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export function useActiveElement<T extends HTMLElement>(
  options: ConfigurableWindow = {},
) {
  const {
    // defaultWindow = isClient ? window : undefined
    window = defaultWindow,
  } = options

  let el: T

  // skip when in Node.js environment (SSR)
  if (window) {
    useEventListener(window, 'blur', () => {
      el = window?.document.activeElement
    }, true)
  }

  /* ... */
}
```

--------------------------------

### Initialize useWebNotification

Source: https://vueuse.org/core/usewebnotification

Import and initialize useWebNotification with options. It provides reactive states for support, permission, and methods to show, close, and handle notification events. Ensure user grants permission before showing notifications.

```typescript
import {
useWebNotification
} from '@vueuse/core'

const {

isSupported
,

notification
,

permissionGranted
,

show
,

close
,

onClick
,

onShow
,

onError
,

onClose,
} = 
useWebNotification
({

title
: 'Hello, VueUse world!',

dir
: 'auto',

lang
: 'en',

renotify
: true,

tag
: 'test',
})

if (
isSupported
.value && 
permissionGranted
.value)

show
()
```

--------------------------------

### useCloned - Basic Usage

Source: https://vueuse.org/core/useCloned

Demonstrates the basic usage of useCloned to create a reactive clone of a ref. Changes to the original ref are reflected in the cloned ref, but not vice-versa by default.

```APIDOC
## useCloned - Basic Usage

### Description
Creates a reactive clone of a ref. By default, it uses `JSON.parse(JSON.stringify())` for cloning.

### Method
`useCloned`

### Parameters
#### Source Ref
- **source** (Ref<T> | MaybeRefOrGetter<T>) - Required - The ref to clone.

#### Options
- **options** (UseClonedOptions) - Optional - Configuration options for cloning.
  - **clone** (CloneFn<T>) - Optional - A custom function to perform the cloning. Defaults to `cloneFnJSON`.
  - **manual** (boolean) - Optional - If true, cloning is not automatic and requires manual syncing. Defaults to `false`.

### Request Example
```typescript
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })
const { cloned } = useCloned(original)

original.value.key = 'some new value'
console.log(cloned.value.key) // 'value'
```

### Response
#### Success Response
- **cloned** (Ref<T>) - A reactive ref containing the cloned data.
- **isModified** (Ref<boolean>) - A ref indicating if the cloned data has been modified compared to the source.
- **sync** (function) - A function to manually sync the cloned data with the source ref.

#### Response Example
```json
{
  "cloned": {"key": "value"},
  "isModified": false,
  "sync": () => {}
}
```
```

--------------------------------

### Getting Values Without Tracking

Source: https://vueuse.org/shared/refWithControl

Demonstrates methods to retrieve values without triggering reactivity tracking.

```typescript
// getting

foo
.
get
(false)

foo
.
untrackedGet
()

foo
.
peek
() // an alias for `untrackedGet`
```

```javascript
'use strict'
// getting
foo.get(false)
foo.untrackedGet()
foo.peek() // an alias for `untrackedGet`
```

--------------------------------

### useWindowFocus - Component Usage

Source: https://vueuse.org/core/usewindowfocus

Shows how to use the renderless component version of `useWindowFocus` provided by `@vueuse/components`.

```APIDOC
## UseWindowFocus Component

### Description
Provides a renderless component version of `useWindowFocus` for tracking window focus.

### Method
Component

### Endpoint
N/A (Component)

### Parameters
#### Slot Props
- **focused** (boolean) - Indicates whether the window is currently focused.

### Request Example
```vue
<template>
  <UseWindowFocus v-slot="{ focused }">
    Document Focus: {{ focused }}
  </UseWindowFocus>
</template>
```

### Response
#### Success Response (200)
- **focused** (boolean) - The focus state of the window.
```

--------------------------------

### Vue Todo App with VueUse Composables

Source: https://vueuse.org/guide/work-with-ai

This script sets up a complete todo application using VueUse. It manages todos with local storage, updates the browser title, handles dark/light mode, copies todo items, and implements infinite scrolling for the list. Ensure Vue and VueUse are installed.

```vue
<script setup lang="ts">
import {
  useClipboard,
  useColorMode,
  useInfiniteScroll,
  useLocalStorage,
  useTitle,
} from '@vueuse/core'
import { computed, ref } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const seedTexts = [
  'Review project goals',
  'Plan the next sprint',
  'Reply to client email',
]

const defaultTodos = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  text:
    seedTexts[index % seedTexts.length]
    + (index >= seedTexts.length ? ` #${index + 1}` : ''),
  done: index % 7 === 0,
}))

const todos = useLocalStorage<Todo[]>('focus-flow-todos', defaultTodos)
const nextId = ref(
  todos.value.reduce((max, todo) => Math.max(max, todo.id), 0) + 1,
)
const newTodo = ref('')

const totalCount = computed(() => todos.value.length)
const remainingCount = computed(() =>
  todos.value.filter(todo => !todo.done).length,
)
const completedCount = computed(
  () => totalCount.value - remainingCount.value,
)

useTitle(computed(() => `Todos (${remainingCount.value})`))

const mode = useColorMode({
  attribute: 'data-theme',
  disableTransition: false,
})
const isDark = computed(() => mode.value === 'dark')

function toggleMode() {
  mode.value = isDark.value ? 'light' : 'dark'
}

const { copy, copied, isSupported } = useClipboard()
const lastCopiedId = ref<number | null>(null)

async function handleCopy(todo: Todo) {
  await copy(todo.text)
  lastCopiedId.value = todo.id
}

const pageSize = 8
const visibleCount = ref(Math.min(pageSize, todos.value.length))
const visibleTodos = computed(() => todos.value.slice(0, visibleCount.value))

const listRef = ref<HTMLElement | null>(null)
const { isLoading } = useInfiniteScroll(
  listRef,
  () => {
    if (visibleCount.value < todos.value.length) {
      visibleCount.value = Math.min(
        visibleCount.value + pageSize,
        todos.value.length,
      )
    }
  },
  {
    distance: 120,
    canLoadMore: () => visibleCount.value < todos.value.length,
  },
)

function syncVisibleCount() {
  if (todos.value.length <= pageSize) {
    visibleCount.value = todos.value.length
    return
  }

  if (visibleCount.value === 0) {
    visibleCount.value = pageSize
    return
  }

  if (visibleCount.value > todos.value.length) {
    visibleCount.value = todos.value.length
  }
}

function addTodo() {
  const value = newTodo.value.trim()
  if (!value)
    return

  todos.value.unshift({
    id: nextId.value++,
    text: value,
    done: false,
  })
  newTodo.value = ''
  syncVisibleCount()
}

function removeTodo(id: number) {
  todos.value = todos.value.filter(todo => todo.id !== id)
  syncVisibleCount()
}
</script>

<template>
  <div class="page">
    <div class="shell">
      <header class="header">
        <div>
          <p class="eyebrow">
            Minimal todo tracker
          </p>
          <h1>Focus Flow</h1>
          <p class="subtitle">
            Keep a lightweight list, copy tasks with a click, and scroll as the
            list grows.
          </p>
        </div>
        <button class="btn ghost mode-toggle" type="button" @click="toggleMode">
          <span class="mode-dot" :class="{ dark: isDark }" />
          <span>{{ isDark ? 'Dark' : 'Light' }} mode</span>
        </button>
      </header>

      <form class="composer" @submit.prevent="addTodo">
        <div class="input-wrap">
          <input
            v-model="newTodo"
            type="text"
            maxlength="120"
            placeholder="Add a new task"
            aria-label="Add a new task"
          >
          <button class="btn primary" type="submit" :disabled="!newTodo.trim()">
            Add task
          </button>
        </div>
        <div class="stats">
          <div class="stat">
            <span>Total</span>
            <strong>{{ totalCount }}</strong>
          </div>
          <div class="stat">
            <span>Remaining</span>
            <strong>{{ remainingCount }}</strong>
          </div>
          <div v-if="completedCount" class="stat">
            <span>Done</span>
            <strong>{{ completedCount }}</strong>
          </div>
        </div>
      </form>

      <section class="list-card">
        <div class="list-head">
          <h2>Todo list</h2>
          <span class="list-hint">
            {{ visibleTodos.length }} / {{ totalCount }} shown
          </span>
        </div>
        <div ref="listRef" class="todo-list" aria-live="polite">
          <article
            v-for="(todo, index) in visibleTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ done: todo.done }"
            :style="{ animationDelay: `${index * 0.03}s` }"
          >

```

--------------------------------

### useCloned - Basic Usage

Source: https://vueuse.org/core/usecloned

Demonstrates the basic usage of useCloned to create a reactive clone of a ref. Changes to the original ref do not affect the cloned ref by default.

```APIDOC
## useCloned - Basic Usage

### Description
Creates a reactive clone of a ref. By default, it uses `JSON.parse(JSON.stringify())` for cloning. Changes to the original ref are not reflected in the clone unless `sync()` is called manually (when `manual: true` is set).

### Method
`useCloned(source: MaybeRefOrGetter<T>, options?: UseClonedOptions<T>): UseClonedReturn<T>

### Parameters
#### Source
- **source** (Ref<T> | T | () => T) - Required - The ref or value to clone.

#### Options
- **clone** (function) - Optional - A custom function to perform the cloning. Defaults to `cloneFnJSON`.
- **manual** (boolean) - Optional - If `true`, the clone will not be updated automatically. You need to call `sync()` manually. Defaults to `false`.

### Request Example
```typescript
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })
const { cloned } = useCloned(original)

original.value.key = 'some new value'
console.log(cloned.value.key) // Output: 'value'
```

### Response
#### Success Response
- **cloned** (Ref<T>) - A ref containing the cloned data.
- **isModified** (Ref<boolean>) - A ref indicating if the cloned data has been modified compared to the source.
- **sync** (function) - A function to manually synchronize the cloned data with the source.

#### Response Example
```json
{
  "cloned": {"key": "value"},
  "isModified": false,
  "sync": "[Function: sync]"
}
```
```

--------------------------------

### Create reactive references with createRef

Source: https://vueuse.org/shared/createRef

Demonstrates how to initialize shallow and deep references using the createRef utility.

```ts
import { 
createRef
 } from '@vueuse/core'
import { 
isShallow
, 
ref
 } from 'vue'

const 
initialData
 = 1

const 
shallowData
 = 
createRef
(
initialData
)
const 
deepData
 = 
createRef
(
initialData
, true)


isShallow
(
shallowData
) // true

isShallow
(
deepData
) // false
```

```js
import { createRef } from '@vueuse/core'
import { isShallow } from 'vue'
const initialData = 1
const shallowData = createRef(initialData)
const deepData = createRef(initialData, true)
isShallow(shallowData) // true
isShallow(deepData) // false
```

--------------------------------

### Shorthands: peek, lay, untrackedGet, silentSet

Source: https://vueuse.org/shared/refWithControl

Explains the shorthand methods available on the controlled ref for getting and setting values without affecting reactivity tracking.

```APIDOC
## Shorthands

### Description
Provides shorthand methods for getting and setting ref values without tracking or triggering reactivity.

### Methods
- `peek()`: Alias for `untrackedGet()`. Gets the current value without tracking reactivity.
- `untrackedGet()`: Gets the current value without tracking reactivity.
- `lay(value)`: Alias for `silentSet(value)`. Sets the ref's value without triggering reactivity.
- `silentSet(value)`: Sets the ref's value without triggering reactivity.

### Usage Examples
```typescript
const foo = refWithControl('foo')

// Getting values without tracking
foo.get(false)       // Equivalent to foo.untrackedGet()
foo.untrackedGet()
foo.peek()           // Alias for untrackedGet()

// Setting values without triggering reactivity
foo.set('bar', false) // Equivalent to foo.silentSet('bar')
foo.silentSet('bar')
foo.lay('bar')       // Alias for silentSet()
```
```

--------------------------------

### Create Writable Computed Property

Source: https://vueuse.org/core/computedInject

Pass an object with get and set functions to enable write operations.

```typescript
import { 
computedInject
 } from '@vueuse/core'

const 
computedArray
 = 
computedInject
(ArrayKey, {
  
get
(
source
) {
    return 
source
.value.map(
item
 => 
item
.value)
  },
  
set
(
value
) {
    // handle setting the value
    
console
.
log
('Setting value:', 
value
)
  },
})
```

--------------------------------

### useTimeout with Reactive Duration

Source: https://vueuse.org/shared/useTimeout

This example illustrates how the timeout duration can be a reactive ref, allowing it to be updated dynamically.

```APIDOC
## useTimeout with Reactive Duration

### Description

This example shows how the `interval` parameter for `useTimeout` can be a reactive ref. This allows the timeout duration to be changed dynamically. Note that changes to the duration only affect future timeouts when controls are enabled.

### Method

`useTimeout`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```ts
import { ref } from 'vue'
import { useTimeout } from '@vueuse/core'

const duration = ref(1000)
const ready = useTimeout(duration)

// Change the duration (only affects future timeouts when using controls)
duration.value = 2000
```

### Response

#### Success Response (200)

- **ready** (ComputedRef<boolean>) - A computed ref that becomes `true` after the timeout duration.

#### Response Example

```json
{
  "ready": true // after the current duration, which can be updated reactively.
}
```
```

--------------------------------

### Selectively passing props to child

Source: https://vueuse.org/shared/reactiveomit

Example of using reactiveOmit to filter props before passing them to a child component.

```vue
<script setup lang="ts">
import { 
reactiveOmit
 } from '@vueuse/core'

const 
props
 = 
defineProps
<{
  
value
: string
  
color
?: string
  
font
?: string
}>()

const 
childProps
 = 
reactiveOmit
(
props
, 'value')
</script>

<template>
  <
div
>
    <!-- only passes "color" and "font" props to child -->
    <ChildComp v-bind="
childProps
" />
  </
div
>
</template>
```

--------------------------------

### useAxios - Basic Usage

Source: https://vueuse.org/integrations/useaxios

This snippet demonstrates the basic usage of the useAxios composable without any configuration, returning a promise that resolves with the Axios response.

```APIDOC
## POST /api/users

### Description
This endpoint is used to create a new user.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Query Parameters
- **limit** (number) - Optional - The maximum number of users to return.

#### Request Body
- **name** (string) - Required - The name of the user.
- **email** (string) - Required - The email address of the user.

### Request Example
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the newly created user.
- **name** (string) - The name of the user.
- **email** (string) - The email address of the user.

#### Response Example
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### Configure useCookies options

Source: https://vueuse.org/integrations/useCookies

Shows initialization with specific configuration options for cookie parsing and dependency tracking.

```typescript
const {
  
get
,
  
getAll
,
  
set
,
  
remove
,
  
addChangeListener
,
  
removeChangeListener

} = 
useCookies
(['cookie-name'], {
  
doNotParse
: false,
  
autoUpdateDependencies
: false
})
```

```javascript
'use strict'
const { get, getAll, set, remove, addChangeListener, removeChangeListener } =
  useCookies(['cookie-name'], {
    doNotParse: false,
    autoUpdateDependencies: false,
  })
```

--------------------------------

### injectLocal Type Declarations

Source: https://vueuse.org/shared/injectLocal

TypeScript type declarations for the injectLocal function, including its purpose and usage examples.

```APIDOC
## GET /api/users/{id}

### Description
Retrieves the details of a specific user based on their unique identifier.

### Method
GET

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the user to retrieve.

#### Query Parameters
None

#### Request Body
None

### Request Example
```http
GET /api/users/user-12345 HTTP/1.1
Host: api.example.com
Accept: application/json
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the user.
- **username** (string) - The username of the user.
- **email** (string) - The email address of the user.
- **createdAt** (string) - The timestamp when the user was created.

#### Response Example
```json
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Use useIpcRendererInvoke in JavaScript

Source: https://vueuse.org/electron/useipcrendererinvoke

Example of using useIpcRendererInvoke in JavaScript. ipcRenderer is automatically obtained. The composable makes asynchronous IPC calls appear synchronous.

```javascript
import { useIpcRendererInvoke } from '@vueuse/electron'
import { computed } from 'vue'
// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const result = useIpcRendererInvoke('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)
```

--------------------------------

### Reactive Math.ceil with useCeil

Source: https://vueuse.org/math/useCeil

Use this snippet to get a reactive ceiling value of a number. Ensure you have imported `useCeil` from `@vueuse/math` and `ref` from `vue`.

```typescript
import {
useCeil
} from '@vueuse/math'

const 
value
 = 
ref
(0.95)
const 
result
 = 
useCeil(
value
) // 1
```

--------------------------------

### useTransition Basic Usage

Source: https://vueuse.org/core/useTransition

Demonstrates the basic usage of `useTransition` with a source ref and default duration/easing.

```APIDOC
## POST /api/users

### Description
Creates a new user in the system.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of users to return.

#### Request Body
- **name** (string) - Required - The name of the user.
- **email** (string) - Required - The email address of the user.

### Request Example
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Response
#### Success Response (200)
- **id** (integer) - The unique identifier for the newly created user.
- **name** (string) - The name of the user.
- **email** (string) - The email address of the user.

#### Response Example
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### HTML structure for text direction

Source: https://vueuse.org/core/usetextdirection

Example of how the 'dir' attribute on the html tag influences the detected direction.

```html
<!--ltr-->
<html>
  ...
</html>

<!--rtl-->
<html dir="rtl">
  ...
</html>
```

--------------------------------

### useVModel - Options

Source: https://vueuse.org/core/useVModel

Explains the various options available for customizing the behavior of useVModel.

```APIDOC
## Options 

### Passive Mode 
By default, `useVModel` returns a computed ref. In passive mode, it creates a local ref that syncs with the prop via `watch`, allowing deep reactivity tracking.

TypeScript
```typescript
const data = useVModel(props, 'modelValue', emit, { passive: true })
```

JavaScript
```javascript
const data = useVModel(props, 'modelValue', emit, { passive: true })
```

### Deep Watching 
When using `passive: true`, you can enable deep watching for nested object changes:

TypeScript
```typescript
const data = useVModel(props, 'modelValue', emit, {
  passive: true,
  deep: true,
})
```

JavaScript
```javascript
const data = useVModel(props, 'modelValue', emit, {
  passive: true,
  deep: true,
})
```

### Clone Values 
Clone the prop value to avoid mutating the original object. Set to `true` to use `JSON.parse(JSON.stringify())` or provide a custom clone function.

TypeScript
```typescript
const data = useVModel(props, 'modelValue', emit, {
  clone: true,
  // or provide custom clone function
  // clone: (val) => structuredClone(val),
})
```

JavaScript
```javascript
const data = useVModel(props, 'modelValue', emit, {
  clone: true,
  // or provide custom clone function
  // clone: (val) => structuredClone(val),
})
```

### Default Value 
Provide a default value when the prop is undefined:

TypeScript
```typescript
const data = useVModel(props, 'modelValue', emit, {
  defaultValue: 'default',
})
```

JavaScript
```javascript
const data = useVModel(props, 'modelValue', emit, {
  defaultValue: 'default',
})
```

### Custom Event Name 
Override the default `update:propName` event name:

TypeScript
```typescript
const data = useVModel(props, 'value', emit, {
  eventName: 'change',
})
```

JavaScript
```javascript
const data = useVModel(props, 'value', emit, {
  eventName: 'change',
})
```

### Emit Validation 
Use `shouldEmit` to validate before emitting. Return `false` to prevent the emit:

TypeScript
```typescript
const data = useVModel(props, 'modelValue', emit, {
  shouldEmit: (value) => {
    // Only emit if value is valid
    return value.length > 0
  },
})
```

JavaScript
```javascript
const data = useVModel(props, 'modelValue', emit, {
  shouldEmit: (value) => {
    // Only emit if value is valid
    return value.length > 0
  },
})
```
```

--------------------------------

### usePreferredDark - Basic Usage

Source: https://vueuse.org/core/usepreferreddark

Demonstrates how to import and use the usePreferredDark composable in a Vue component to get the user's dark theme preference.

```APIDOC
## usePreferredDark

### Description
Reactive dark theme preference.

### Method
Composable function

### Endpoint
N/A (Composable function)

### Parameters
#### Query Parameters
- **options** (ConfigurableWindow) - Optional - Configuration options for the window.

### Request Example
```typescript
import {
  usePreferredDark
} from '@vueuse/core'

const isDark = usePreferredDark()
```

### Response
#### Success Response (ComputedRef<boolean>)
- **isDark** (boolean) - Reactive boolean indicating if the user prefers dark theme.

#### Response Example
```json
{
  "isDark": true
}
```
```

--------------------------------

### useIpcRenderer Basic Usage

Source: https://vueuse.org/electron/useipcrenderer

Demonstrates how to use useIpcRenderer to invoke a channel and listen for events. It automatically handles listener cleanup on unmount.

```APIDOC
## useIpcRenderer

### Description
Provides ipcRenderer and all of its APIs with Vue reactivity. Available in the @vueuse/electron add-on.

### Method
`useIpcRenderer([ipcRendererInstance])`

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useIpcRenderer } from '@vueuse/electron'
import { computed } from 'vue'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
const ipcRenderer = useIpcRenderer()

// Ref result will return
const result = ipcRenderer.invoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)

// remove listener automatically on unmounted

ipcRenderer.on('custom-event', (event, ...args) => {
  console.log(args)
})
```

### Response
#### Success Response (200)
N/A (Composable function, returns reactive refs)

#### Response Example
N/A
```

--------------------------------

### usePreferredContrast - Basic Usage

Source: https://vueuse.org/core/usepreferredcontrast

Demonstrates how to import and use the usePreferredContrast composable in a Vue component to get the user's preferred contrast setting.

```APIDOC
## usePreferredContrast

### Description
Reactive prefers-contrast media query.

### Method
Composable function

### Endpoint
N/A (Composable function)

### Parameters
#### Query Parameters
- **options** (ConfigurableWindow) - Optional - Configuration options for the window.

### Request Example
```typescript
import { usePreferredContrast } from '@vueuse/core'

const preferredContrast = usePreferredContrast()
```

### Response
#### Success Response (ComputedRef<ContrastType>)
- **contrast** (ContrastType) - The user's preferred contrast setting.

### Response Example
```json
{
  "contrast": "no-preference" 
}
```

### Type Declarations
```typescript
export type ContrastType = "more" | "less" | "custom" | "no-preference"
```
```

--------------------------------

### useWindowSize - Component Usage

Source: https://vueuse.org/core/useWindowSize

This snippet shows how to use the renderless component version of `useWindowSize` from the `@vueuse/components` package.

```APIDOC
## UseWindowSize Component

### Description
This is a renderless component version of `useWindowSize` that exposes width and height via v-slot.

### Method
Component

### Endpoint
N/A (Client-side component)

### Parameters
None directly on the component, options are passed to the underlying composable if needed.

### Request Example
```vue
<template>
  <UseWindowSize v-slot="{ width, height }">
    Width: {{ width }}
    Height: {{ height }}
  </UseWindowSize>
</template>
```

### Response
Exposed via v-slot:
- **width** (ShallowRef<number>) - Reactive reference to the window's width.
- **height** (ShallowRef<number>) - Reactive reference to the window's height.

### Response Example
(Values are reactive and updated in real-time)
```json
{
  "width": 1280,
  "height": 800
}
```
```

--------------------------------

### Basic Key Monitoring with useMagicKeys

Source: https://vueuse.org/core/useMagicKeys

Import and destructure keys to monitor. Use `watch` or `watchEffect` to react to key presses. Ensure correct type handling if `noUncheckedIndexedAccess` is enabled.

```typescript
import {
  useMagicKeys
} from '@vueuse/core'

const { 
  shift
, 
  space
, 
  a
 /* keys you want to monitor */ } = 
useMagicKeys
()


watch
(
  space, (v) => {
  if (v)
    console.log('space has been pressed')
})


watchEffect
(() => {
  if (
    shift.value && 
    a.value)
    console.log('Shift + A have been pressed')
})
```

```typescript
const { 
  shift
, 
  space
, 
  a
 } = useMagicKeys()


watch
(
  () => 
  space?.value,
  (v) => {
    if (v)
      console.log('space has been pressed')
  },
)


watchEffect
(() => {
  if (
    shift?.value && 
    a?.value)
    console.log('Shift + A have been pressed')
})
```

--------------------------------

### useIpcRendererOn

Source: https://vueuse.org/electron/README

Use ipcRenderer.on with ease and ipcRenderer.removeListener automatically on unmount.

```APIDOC
* `useIpcRendererOn` — use ipcRenderer.on with ease and ipcRenderer.removeListener automatically on unmounted
```

--------------------------------

### watchPausable Usage

Source: https://vueuse.org/shared/watchPausable

Demonstrates how to use the watchPausable function to create a pausable watcher. It shows how to pause, resume, and stop the watcher, and includes an example of its behavior with asynchronous updates.

```APIDOC
## watchPausable 

### Description
Creates a pausable watcher. This function is deprecated and will be removed in a future version. It is recommended to use Vue's built-in `watch` instead.

### Method
`watchPausable` (Function)

### Endpoint
N/A (This is a utility function, not an API endpoint)

### Parameters

#### Source
- **source** (WatchSource<T> | MultiWatchSources | T) - The source to watch. Can be a ref, reactive object, getter function, or an array of these.
- **cb** (WatchCallback<T, Immediate> | WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>) - The callback function to execute when the source changes.
- **options** (WatchPausableOptions<Immediate>) - Optional configuration options.

### Request Example
```typescript
import { watchPausable } from '@vueuse/core'
import { nextTick, shallowRef } from 'vue'

const source = shallowRef('foo')

const { stop, pause, resume } = watchPausable(
  source,
  (v) => console.log(`Changed to ${v}!`),
)

source.value = 'bar'
await nextTick() // Changed to bar!

pause()

source.value = 'foobar'
await nextTick() // (nothing happend)

resume()

source.value = 'hello'
await nextTick() // Changed to hello!
```

### Response
#### Success Response
Returns an object with the following properties:
- **stop**: (WatchStopHandle) - A function to stop the watcher.
- **pause**: () => void - A function to pause the watcher.
- **resume**: () => void - A function to resume the watcher.

#### Response Example
```json
{
  "stop": "function",
  "pause": "function",
  "resume": "function"
}
```

### Type Declarations
```typescript
export interface WatchPausableReturn extends Pausable {
  stop: WatchStopHandle
}
export type WatchPausableOptions<Immediate> = WatchWithFilterOptions<Immediate> & PausableFilterOptions

/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export declare function watchPausable<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchPausableOptions<Immediate>
): WatchPausableReturn
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export declare function watchPausable<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(
  sources: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchPausableOptions<Immediate>
): WatchPausableReturn
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export declare function watchPausable<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchPausableOptions<Immediate>
): WatchPausableReturn

export declare const pausableWatch: typeof watchPausable
```
```

--------------------------------

### createReusableTemplate with Options API

Source: https://vueuse.org/core/createReusableTemplate

When using the Options API, define createReusableTemplate outside the component setup and register it in the `components` option to use in the template.

```vue
<script>
import { 
createReusableTemplate
 } from '@vueuse/core'
import { 
defineComponent
 } from 'vue'

const [
DefineTemplate
, 
ReuseTemplate
] = 
createReusableTemplate
()

export default 
defineComponent
({
  
components
: {
    
DefineTemplate
,
    
ReuseTemplate
,
  },
  
setup
() {
    // ...
  },
})
</script>

<template>
  <DefineTemplate 
v-slot
="{ 
data
, 
msg
, 
anything
 }">
    <div >{{ 
data
 }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate 
:data
="data" 
msg
="The first usage" />
</template>
```

--------------------------------

### Basic Usage of whenever

Source: https://vueuse.org/shared/whenever

Demonstrates using whenever to trigger a callback when an async state becomes ready.

```javascript
import { useAsyncState, whenever } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

whenever(isReady, () => console.log(state))
```

--------------------------------

### Media query configuration

Source: https://vueuse.org/core/useStyleTag

Demonstrates applying media attributes to the style tag.

```typescript

useStyleTag
('.foo { margin-top: 32px; }', { 
media
: 'print' })
```

```javascript
'use strict'
useStyleTag('.foo { margin-top: 32px; }', { media: 'print' })
```

```html
<!-- injected to <head> -->
<style id="vueuse_styletag_1" media="print">
  .foo {
    margin-top: 32px;
  }
</style>
```

--------------------------------

### computedInject Usage

Source: https://vueuse.org/core/computedinject

Demonstrates how to use computedInject to combine computed properties with injected values. It shows the provider component setup and the receiver component usage.

```APIDOC
## computedInject

### Description
Combines `computed` and `inject`. Useful for creating a computed property based on an injected value.

### Method
`computedInject(key, getter, defaultValue?, treatDefaultAsFactory?)
computedInject(key, options, defaultValue?, treatDefaultAsFactory?)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage Example

**In Provider Component:**
```typescript
import type { InjectionKey, Ref } from 'vue'
import { provide, ref } from 'vue'

interface Item {
  key: number
  value: string
}

export const ArrayKey: InjectionKey<Ref<Item[]>> = Symbol('symbol-key')

const array = ref([
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
])

provide(ArrayKey, array)
```

**In Receiver Component:**
```typescript
import { computedInject } from '@vueuse/core'
import { ArrayKey } from './provider'

const computedArray = computedInject(ArrayKey, (source) => {
  const arr = [...source.value]
  arr.unshift({ key: 0, value: 'all' })
  return arr
})
```

### Default Value
Provides a default value if the injection key is not found.

```typescript
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(
  ArrayKey,
  (source) => {
    return source.value.map(item => item.value)
  },
  ref([]), // default source value
)
```

### Factory Default
Treats the default value as a factory function when `true` is passed as the fourth argument.

```typescript
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(
  ArrayKey,
  (source) => {
    return source.value.map(item => item.value)
  },
  () => ref([]), // factory function for default
  true, // treat default as factory
)
```

### Writable Computed
Creates a writable computed property using `get` and `set` functions.

```typescript
import { computedInject } from '@vueuse/core'

const computedArray = computedInject(ArrayKey, {
  get(source) {
    return source.value.map(item => item.value)
  },
  set(value) {
    console.log('Setting value:', value)
  },
})
```

### Response
#### Success Response (200)
Returns a `ComputedRef` based on the provided getter or options.

#### Response Example
```json
{
  "example": "ComputedRef<K | undefined> or ComputedRef<K>"
}
```
```

--------------------------------

### useDateFormat with Custom Meridiem

Source: https://vueuse.org/shared/useDateFormat

Shows how to provide a custom function to `useDateFormat` to redefine the meridiem (AM/PM) display, using Greek characters as an example.

```APIDOC
## useDateFormat with Custom Meridiem

### Description
This example illustrates how to use the `customMeridiem` option in `useDateFormat` to define a custom display for AM/PM. The example uses Greek characters 'πμ'/'μ' for AM and 'ΠΜ'/'Μ' for PM.

### Method
`useDateFormat(date, formatString, options)`

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import {
useDateFormat
}
from '@vueuse/core'

function
customMeridiem(
hours
: number,
minutes
: number,
isLowercase
?: boolean,
hasPeriod
?: boolean) {
  const
m
=
hours
> 11 ? (
isLowercase
? 'μμ' : 'ΜΜ') : (
isLowercase
? 'πμ' : 'ΠΜ')
  return
hasPeriod
? 
m
.split('')
.reduce((acc,
current
) => acc += `${current}.`, '') : m

}

const
am
=
useDateFormat('2022-01-01 05:05:05', 'hh:mm:ss A', { customMeridiem })
// am.value = '05:05:05 ΠΜ'
const
pm
=
useDateFormat('2022-01-01 17:05:05', 'hh:mm:ss AA', { customMeridiem })
// pm.value = '05:05:05 Μ.Μ.'
</script>
```

### Response
#### Success Response (200)
N/A (Composable Function returns a `ComputedRef<string>`)

#### Response Example
```json
{
  "example_am": "05:05:05 ΠΜ",
  "example_pm": "05:05:05 Μ.Μ."
}
```
```

--------------------------------

### useQRCode - Generate QR Code

Source: https://vueuse.org/integrations/useqrcode

This snippet demonstrates how to use the `useQRCode` composable to generate a QR code from a given text string. The generated QR code is returned as a data URL.

```APIDOC
## useQRCode

### Description
Generates a QR code from a given text string. It can be used with static text or a reactive reference, and the generated QR code updates automatically when the source text changes.

### Method
`useQRCode(text: MaybeRefOrGetter<string>, options?: QRCodeToDataURLOptions): ShallowRef<string>
`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useQRCode } from '@vueuse/integrations/useQRCode'

// Static text
const qrcode = useQRCode('text-to-encode')

// Reactive text
import { shallowRef } from 'vue'
const text = shallowRef('text-to-encode')
const qrcodeReactive = useQRCode(text)
```

### Response
#### Success Response (200)
- **qrcode** (ShallowRef<string>) - A shallow reference containing the data URL of the generated QR code.

#### Response Example
```html
<input v-model="text" type="text" />
<img :src="qrcode" alt="QR Code" />
```

### Type Declarations
```typescript
/**
 * Wrapper for qrcode.
 *
 * @see https://vueuse.org/useQRCode
 * @param text
 * @param options
 */
export declare function useQRCode(
  text: MaybeRefOrGetter<string>,
  options?: QRCode.QRCodeToDataURLOptions
): ShallowRef<string>
```
```

--------------------------------

### Configure useTextDirection with Options

Source: https://vueuse.org/core/useTextDirection

Customize the behavior of useTextDirection by providing an options object. This example targets the 'body' element instead of the default 'html'.

```typescript
import {
useTextDirection
} from '@vueuse/core'

const
mode
=
useTextDirection
({
  
selector
: 'body'
})

```

--------------------------------

### Awaiting useAsyncState result

Source: https://vueuse.org/core/useAsyncState

Shows how to await the result of useAsyncState directly in async functions or script setup.

```ts
const { 
state
, 
isReady
 } = await useAsyncState(fetchData, null)
// `state` is now populated, `isReady` is true
```

```js
'use strict'
const { state, isReady } = await useAsyncState(fetchData, null)
// `state` is now populated, `isReady` is true
```

--------------------------------

### Use useMin with multiple arguments

Source: https://vueuse.org/math/useMin

Import useMin from '@vueuse/math' and pass multiple refs or numbers to find the minimum among them.

```typescript
import {
useMin
} from '@vueuse/math'

const a = ref(1)
const b = ref(3)

const min = useMin(a, b, 2) // Ref<1>
```

--------------------------------

### Provide Array in Provider Component

Source: https://vueuse.org/core/computedInject

Setup the injection key and provide the reactive array to child components.

```typescript
import type { 
InjectionKey
, 
Ref
 } from 'vue'
import { 
provide
, 
ref
 } from 'vue'

interface Item {
  
key
: number
  
value
: string
}

export const 
ArrayKey
: 
InjectionKey
<
Ref
<Item[]>> = 
Symbol
('symbol-key')

const 
array
 = 
ref
([{ 
key
: 1, 
value
: '1' }, { 
key
: 2, 
value
: '2' }, { 
key
: 3, 
value
: '3' }])


provide
(
ArrayKey
, 
array
)
```

```javascript
import { provide, ref } from 'vue'
export const ArrayKey = Symbol('symbol-key')
const array = ref([
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
])
provide(ArrayKey, array)
```

--------------------------------

### Using Controls

Source: https://vueuse.org/shared/useTimeout

Enables manual control over the timeout process by exposing start, stop, and isPending methods.

```typescript
import { 
useTimeout
 } from '@vueuse/core'

const { 
ready
, 
start
, 
stop
, 
isPending
 } = 
useTimeout
(1000, { 
controls
: true })

// Check if timeout is pending

console
.
log
(
isPending
.
value
) // true

// Stop the timeout

stop
()

// Start/restart the timeout

start
()
```

--------------------------------

### Implement Token Refreshing with afterFetch

Source: https://vueuse.org/core/usefetch

Handle token expiration and refreshing by implementing logic within the `afterFetch` hook. This example shows how to detect the need for a refresh, initiate the refresh process, and re-execute the original request with the new token.

```typescript
let 
isRefreshing
 = false
const 
refreshSubscribers
: 
Array
<() => void> = []

const 
useMyFetch
 = 
createFetch
({
  
baseUrl
: 'https://my-api.com',
  
options
: {
    async 
beforeFetch
({ 
options
 }) {
      const 
myToken
 = await getMyToken()
      
options
. 
headers
.Authorization = `Bearer ${ 
myToken
}`

      return { 
options
 }
    },
    
afterFetch
({ 
data
 , 
response
 , 
context
 , 
execute
 }) {
      if (needRefreshToken) {
        if (!
isRefreshing
) {
          
isRefreshing
 = true
          
refreshToken
().
then
(( 
newToken
) => {
            if (
newToken
.value) {
              
isRefreshing
 = false
              setMyToken(
newToken
.value)
              
onRefreshed
()
            }
            else {
              
refreshSubscribers
.
length
 = 0
              // handle refresh token error
            }
          })
        }

        return new 
Promise
(( 
resolve
) => {
          
addRefreshSubscriber
(() => {
            
execute
().
then
(( 
response
) => {
              
resolve
({ 
data
 , 
response
 })
            })
          })
        })
      }

      return { 
data
 , 
response
 }
    },
    // or use onFetchError with updateDataOnError
    
updateDataOnError
: true,
    
onFetchError
({ 
error
 , 
data
 , 
response
 , 
context
 , 
execute
 }) {
      // same as afterFetch
      return { 
error
 , 
data
 }
    },
  },
  
fetchOptions
: {
    
mode
: 'cors',
  },
})

async function 
refreshToken
() {
  const { 
data
 , 
execute
 } = useFetch<string>('refresh-token', {
    
immediate
: false,
  })

  await 
execute
()
  return 
data

}

function 
onRefreshed
() {
  
refreshSubscribers
.
forEach
(
callback
 => 
callback
())
  
refreshSubscribers
.
length
 = 0
}

function 
addRefreshSubscriber
(
callback

```

--------------------------------

### Initialize and Log useTitle

Source: https://vueuse.org/core/useTitle

Import and use the useTitle composable to get and set the document's title. The initial value is the current document title. Not compatible with SSR.

```typescript
import {
  useTitle
} from '@vueuse/core'

const title = 
useTitle
()

console.log(title.value) // print current title

title.value = 'Hello' // change current title
```

--------------------------------

### Basic useInterval Usage

Source: https://vueuse.org/shared/useinterval

Import and use useInterval to create a counter that increments every 200ms. No additional setup is required for basic functionality.

```typescript
import {
useInterval
} from '@vueuse/core'

// count will increase every 200ms
const
counter
=
useInterval(200)

```

--------------------------------

### Implement BroadcastChannel communication

Source: https://vueuse.org/core/useBroadcastChannel

Demonstrates initializing a channel, posting a message, and manually closing the connection.

```ts
import { 
useBroadcastChannel
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const {
  
isSupported
,
  
channel
,
  
post
,
  
close
,
  
error
,
  
isClosed
,
} = 
useBroadcastChannel
({ 
name
: 'vueuse-demo-channel' })

const 
message
 = 
shallowRef
('')


message
.
value
 = 'Hello, VueUse World!'

// Post the message to the broadcast channel:

post
(
message
.
value
)

// Option to close the channel if you wish:

close
()
```

--------------------------------

### Destructure Props with toRefs and useVModel

Source: https://vueuse.org/shared/torefs

This example demonstrates how to use toRefs in conjunction with useVModel to easily destructure and manage props within a Vue component, allowing for two-way binding.

```vue
<script lang="ts">
import { 
  toRefs,
  useVModel
} from '@vueuse/core'

export default {
  
setup
(props) {
    const refs = toRefs(useVModel(props, 'data'))

    console.log(refs.a.value) // props.data.a
    refs.a.value = 'a' // emit('update:data', { ...props.data, a: 'a' })

    return { ...refs }
  }
}
</script>

<template>
  <div >
    <input v-model="a" type="text">
    <input v-model="b" type="text">
  </div>
</template>
```

--------------------------------

### useTimestamp with Controls

Source: https://vueuse.org/core/usetimestamp

Enable controls for useTimestamp to get pause and resume functions, allowing you to control the timestamp updates.

```APIDOC
## useTimestamp with Controls

### Description
Reactive current timestamp with controls for pausing and resuming updates.

### Method
useTimestamp

### Parameters
#### Query Parameters
- **options** (UseTimestampOptions<true>) - Optional - Configuration options for useTimestamp.
  - **controls** (boolean) - Required - Expose more controls. Must be `true` for this overload.
  - **offset** (number) - Optional - Offset value adding to the value. Defaults to `0`.
  - **immediate** (boolean) - Optional - Update the timestamp immediately. Defaults to `true`. Deprecated, use `scheduler` instead.
  - **interval** ("requestAnimationFrame" | number) - Optional - Update interval, or use requestAnimationFrame. Defaults to `requestAnimationFrame`. Deprecated, use `scheduler` instead.
  - **callback** ((timestamp: number) => void) - Optional - Callback on each update.

### Return Value
- **timestamp** (ShallowRef<number>) - A reactive reference to the current timestamp.
- **pause** (() => void) - Function to pause timestamp updates.
- **resume** (() => void) - Function to resume timestamp updates.

### Request Example
```typescript
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```

### JavaScript Example
```javascript
'use strict'
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```
```

--------------------------------

### Create Global State with Computed and Actions

Source: https://vueuse.org/shared/createGlobalState

This example demonstrates creating a more complex global state including computed properties and actions (methods) to modify the state. It uses shallowRef for state and computed for derived values.

```typescript
import {
  createGlobalState
} from '@vueuse/core'
import {
  computed,
  shallowRef
} from 'vue'

export const
  useGlobalState
  =
  createGlobalState(
    () => {
      // state
      const
        count
        =
        shallowRef(0)

      // getters
      const
        doubleCount
        =
        computed(() => 
          count
          .value
          * 2)

      // actions
      function
        increment() {
          
count
          .value++
        }

      return { count, doubleCount, increment }
    }
  )

```

--------------------------------

### Component Usage

Source: https://vueuse.org/core/useidle

Shows how to use `useIdle` as a renderless component via the `@vueuse/components` package.

```APIDOC
## Component Usage 

### Description
Provides a renderless component version of `useIdle` for easier integration in templates.

### Method
UseIdle (Component)

### Endpoint
N/A (Component)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
vue
```vue
<template>
  <UseIdle v-slot="{ idle }">
    Is Idle: {{ idle }}
  </UseIdle>
</template>
```

### Response
#### Success Response (200)
N/A (Component renders based on slot props)

#### Response Example
```html
Is Idle: true
```
```

--------------------------------

### useCurrentElement - Basic Usage

Source: https://vueuse.org/core/usecurrentelement

This snippet demonstrates the basic usage of `useCurrentElement` to get the DOM element of the current component.

```APIDOC
## GET /useCurrentElement

### Description
Retrieves the DOM element of the current component as a ref. The value will be undefined until the component is mounted.

### Method
GET (Conceptual - this is a composable function, not a direct HTTP endpoint)

### Endpoint
N/A (Composable function)

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useCurrentElement } from '@vueuse/core'

const el = useCurrentElement() // ComputedRef<Element>
```

### Response
#### Success Response (ComputedRef<Element>)
- **el** (ComputedRef<Element>) - A computed ref that holds the DOM element of the current component.

#### Response Example
```json
{
  "el": "<div id=\"app\">...</div>" 
}
```
```

--------------------------------

### whenever - Basic Usage

Source: https://vueuse.org/shared/whenever

Demonstrates the basic usage of 'whenever' to execute a callback when a watched source becomes truthy. It shows how 'whenever' can be a more concise alternative to a standard 'watch' for this specific use case.

```APIDOC
## whenever - Basic Usage

### Description
Shorthand for watching value to be truthy.

### Method
N/A (This is a utility function, not an HTTP endpoint)

### Endpoint
N/A

### Parameters
#### Source
- **source** (WatchSource<T>) - The value or getter to watch.

#### Callback Function
- **cb** (WatchCallback<Truthy<T>, T | undefined> or WatchCallback<Truthy<T>, T>) - The function to execute when the source becomes truthy.

#### Options
- **options** (WheneverOptions) - Optional configuration object, similar to `watch` options.

### Request Example
```javascript
import { useAsyncState, whenever } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

whenever(isReady, () => console.log(state))
```

### Response
#### Success Response
N/A (This function triggers a callback, it does not return a direct response)

#### Response Example
N/A
```

--------------------------------

### Debounce an Object Ref

Source: https://vueuse.org/shared/refDebounced

This example demonstrates debouncing an object ref. Updates to the object are debounced, and the debounced value reflects the state before the update until the delay passes.

```javascript
import { refDebounced } from '@vueuse/core'
import { shallowRef } from 'vue'

const data = shallowRef({
  name: 'foo',
  age: 18,
})
const debounced = refDebounced(data, 1000)

function update() {
  data.value = {
    ...data.value,
    name: 'bar',
  }
}

console.log(debounced.value) // { name: 'foo', age: 18 }
update()
await sleep(1100)

console.log(debounced.value) // { name: 'bar', age: 18 }
```

--------------------------------

### useWebSocket with Callbacks

Source: https://vueuse.org/core/useWebSocket

Shows how to configure callbacks for connection events such as connected, disconnected, errors, and received messages.

```APIDOC
## useWebSocket with Callbacks

### Description
Configures event handlers for WebSocket connection lifecycle events, including connection establishment, disconnection, errors, and message reception.

### Method
`useWebSocket(url: string, options: UseWebSocketOptions)

### Endpoint
N/A (Client-side composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
const { data } = useWebSocket('ws://websocketurl', {
  onConnected(ws) {
    console.log('Connected!')
  },
  onDisconnected(ws, event) {
    console.log('Disconnected!', event.code)
  },
  onError(ws, event) {
    console.error('Error:', event)
  },
  onMessage(ws, event) {
    console.log('Message:', event.data)
  },
})
```

### Response
#### Success Response (Callbacks executed on events)
- **data** (Ref<any>) - Latest received data

#### Response Example
```json
{
  "data": "Latest message data"
}
```
```

--------------------------------

### Writable computedInject (TypeScript)

Source: https://vueuse.org/core/computedinject

Creates a writable computed property using computedInject with custom get and set logic.

```typescript
import { 
computedInject
 }
 from '@vueuse/core'

const 
computedArray
 = 
computedInject
(ArrayKey, {
  
get
( 
source
) {
    return 
source
. 
value
. 
map
(
item
 => 
item
. 
value)
  },
  
set
( 
value
) {
    // handle setting the value
    
console
. 
log
('Setting value:', 
value
)
  },
})
```

--------------------------------

### makeDestructurable API

Source: https://vueuse.org/shared/makedestructurable

This section details the makeDestructurable function, its type declarations, and provides usage examples in TypeScript and JavaScript.

```APIDOC
## makeDestructurable

### Description
Make isomorphic destructurable for object and array at the same time.

### Method
Utility Function

### Endpoint
`@vueuse/core`

### Parameters
#### Function Signature
```typescript
export declare function makeDestructurable<T extends Record<string, unknown>, A extends readonly any[]>(obj: T, arr: A): T & A
```

### Usage Examples
#### TypeScript
```typescript
import { makeDestructurable } from '@vueuse/core'

const foo = { name: 'foo' }
const bar = 1024

const obj = makeDestructurable(
  { foo, bar } as const,
  [foo, bar] as const,
)

let { foo, bar } = obj
let [foo, bar] = obj
```

#### JavaScript
```javascript
import { makeDestructurable } from '@vueuse/core'

const foo = { name: 'foo' }
const bar = 1024

const obj = makeDestructurable({ foo, bar }, [foo, bar])

'use strict'
let { foo, bar } = obj
let [foo, bar] = obj
```

### Type Declarations
```typescript
export declare function makeDestructurable<T extends Record<string, unknown>, A extends readonly any[]>(obj: T, arr: A): T & A
```
```

--------------------------------

### useWindowSize Function

Source: https://vueuse.org/core/usewindowsize

Reactive window size tracking utility.

```APIDOC
## useWindowSize

### Description
Reactive window size tracking utility that returns the current width and height of the window.

### Parameters
#### Options
- **initialWidth** (number) - Optional - Initial width value.
- **initialHeight** (number) - Optional - Initial height value.
- **listenOrientation** (boolean) - Optional - Listen to window orientationchange event. Default: true.
- **includeScrollbar** (boolean) - Optional - Whether the scrollbar should be included in the width and height. Default: true.
- **type** ("inner" | "outer" | "visual") - Optional - Use window.innerWidth, outerWidth, or visualViewport. Default: 'inner'.

### Response
- **width** (ShallowRef<number>) - The reactive width of the window.
- **height** (ShallowRef<number>) - The reactive height of the window.
```

--------------------------------

### useDisplayMedia API

Source: https://vueuse.org/core/usedisplaymedia

The useDisplayMedia composable allows you to capture and stream the user's display (screen, window, or tab). It provides reactive references to the media stream and controls to start and stop the stream.

```APIDOC
## useDisplayMedia

### Description
Reactive `mediaDevices.getDisplayMedia` streaming.

### Method
Composable function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```javascript
import { useDisplayMedia } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const { stream, start } = useDisplayMedia()

// start streaming
start()

const videoRef = useTemplateRef('video')

watchEffect(() => {
  // preview on a video element
  videoRef.value.srcObject = stream.value
})
```

### Response
#### Success Response (Composable Return)
- **stream** (ShallowRef<MediaStream | undefined>) - The media stream object.
- **start** (() => Promise<MediaStream | undefined>) - Function to start the display media stream.
- **stop** (() => void) - Function to stop the display media stream.
- **enabled** (ShallowRef<boolean>) - Reactive boolean indicating if the stream is enabled.

#### Response Example
```json
{
  "stream": "<MediaStream object>",
  "start": "<function>",
  "stop": "<function>",
  "enabled": "<boolean>"
}
```

### Type Declarations
```typescript
export interface UseDisplayMediaOptions extends ConfigurableNavigator {
  /**
   * If the stream is enabled
   * @default false
   */
  enabled?: MaybeRef<boolean>
  /**
   * If the stream video media constraints
   */
  video?: boolean | MediaTrackConstraints | undefined
  /**
   * If the stream audio media constraints
   */
  audio?: boolean | MediaTrackConstraints | undefined
}

export interface UseDisplayMediaReturn extends Supportable {
  stream: ShallowRef<MediaStream | undefined>
  start: () => Promise<MediaStream | undefined>
  stop: () => void
  enabled: ShallowRef<boolean>
}

export declare function useDisplayMedia(
  options?: UseDisplayMediaOptions,
): UseDisplayMediaReturn
```
```

--------------------------------

### useExtractedObservable with Watch Options

Source: https://vueuse.org/rxjs/useExtractedObservable

This example shows how to pass standard Vue `watch` options as the last argument to `useExtractedObservable`.

```APIDOC
## useExtractedObservable with Watch Options

### Description
Passes standard Vue `watch` options as the last argument to `useExtractedObservable`.

### Parameters
#### Watch Options
- **immediate** (boolean) - Whether to call the getter immediately.

### Request Example
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef<number>()

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {},
  {
    immediate: false
  }
)
```
```

--------------------------------

### useFetch

Source: https://vueuse.org/core/useFetch

A reactive wrapper for the native fetch API.

```APIDOC
## useFetch

### Description
Performs a reactive fetch request. It returns a state object containing the response data, loading status, and error information.

### Parameters
#### Path Parameters
- **url** (MaybeRefOrGetter<string>) - Required - The URL to fetch.

#### Request Body
- **useFetchOptions** (UseFetchOptions) - Optional - Configuration for the fetch lifecycle.
- **options** (RequestInit) - Optional - Standard fetch request options.
```

--------------------------------

### useExtractedObservable with Error Handling

Source: https://vueuse.org/rxjs/useExtractedObservable

This example shows how to provide custom error handling for an Observable using the `onError` option.

```APIDOC
## useExtractedObservable with Error Handling

### Description
Handles errors emitted by the Observable by providing an `onError` callback.

### Parameters
#### Options
- **onError** ((err: any) => void) - Error handler for Observable errors.

### Request Example
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, tap } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      tap((n) => {
        if (n === 10)
          throw new Error('oops')
      })
    )
  },
  {
    onError: (err) => {
      console.log(err.message) // "oops"
    },
  }
)
```
```

--------------------------------

### Basic Usage of useClipboard

Source: https://vueuse.org/core/useClipboard

Demonstrates how to use the useClipboard function to copy text to the clipboard and display the current copied text. It checks for browser support and provides feedback to the user.

```vue
<script setup lang="ts">
import { 
useClipboard
 } from '@vueuse/core'

const 
source
 = 
ref
('Hello')
const { 
text
, 
copy
, 
copied
, 
isSupported
 } = 
useClipboard
({
 source
 })
</script>

<template>
  <
div
 v-if="
isSupported
">
    <
button
 @
click
="
copy
(
source
)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <
span
 v-if="! 
copied
">Copy</
span
>
      <
span
 v-else>Copied!</
span
>
    </
button
>
    <
p
>Current copied: <
code
>{{ 
text
 || 'none' }}</
code
></
p
>
  </
div
>
  <
p
 v-else>
    Your browser does not support Clipboard API
  </
p
>
</template>
```

--------------------------------

### Custom Easing with Function

Source: https://vueuse.org/core/usetransition

For more complex easing, provide a custom easing function. This example uses an easeOutElastic function.

```typescript
function easeOutElastic(n) {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

useTransition(source, {
  easing: easeOutElastic,
})
```

```javascript
'use strict'
function easeOutElastic(n) {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : 2 ** (-10 * n) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}
useTransition(source, {
  easing: easeOutElastic,
})
```

--------------------------------

### Basic Usage of useTitle

Source: https://vueuse.org/core/usetitle

Import and use the useTitle composable to get and set the document's title. The current title can be logged, and new titles can be assigned to the returned ref.

```typescript
import {
useTitle
} from '@vueuse/core'

const
title
 = 
useTitle
()

console
. 
log
(
title
. 
value
) // print current title

title
. 
value
 = 'Hello' // change current title
```

--------------------------------

### Custom key predicate

Source: https://vueuse.org/core/onKeyStroke

Use a custom function to determine which keys should trigger the handler. This example listens for 'Shift+A'.

```typescript
import {
  onKeyStroke
} from '@vueuse/core'


onKeyStroke
(
  
e => 
  e.key === 'A' && 
  e.shiftKey,
  (e) => {
    
    console
    .log('Shift+A pressed')
  },
)
```

--------------------------------

### HTML Example for Text Direction

Source: https://vueuse.org/core/useTextDirection

Demonstrates how applying the 'dir="rtl"' attribute to the html tag affects text direction. This is useful for right-to-left languages.

```html
<!--ltr-->
<html>
  ...
</html>

<!--rtl-->
<html dir="rtl">
  ...
</html>

```

--------------------------------

### Use with configuration options

Source: https://vueuse.org/integrations/useAxios

Provide an axios configuration object alongside an instance.

```typescript
import { 
useAxios
 } from '@vueuse/integrations/useAxios'
import 
axios
 from 'axios'

const 
instance
 = 
axios
.
create
({
  
baseURL
: '/api',
})

const { 
data
, 
isFinished
 } = 
useAxios
('/posts', { 
method
: 'POST' }, 
instance
)
```

--------------------------------

### useTimeoutFn Type Declarations

Source: https://vueuse.org/shared/usetimeoutfn

Defines the options and return types for useTimeoutFn, including immediate start and callback execution.

```typescript
export interface UseTimeoutFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  
immediate
?: boolean
  /**
   * Execute the callback immediately after calling `start`
   *
   * @default false
   */
  
immediateCallback
?: boolean
}
export type 
UseTimeoutFnReturn
< 
CallbackFn
 extends 
AnyFn
 > = 
Stoppable
< 
Parameters
< 
CallbackFn
 > | []
>
/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param options
 */
export declare function 
useTimeoutFn
< 
CallbackFn
 extends 
AnyFn
>(
  
cb
: 
CallbackFn
,
  
interval
: 
MaybeRefOrGetter
<number>,
  
options
?: UseTimeoutFnOptions,
): 
UseTimeoutFnReturn
< 
CallbackFn
>

```

--------------------------------

### Programmatically Reset useIdle Timer

Source: https://vueuse.org/core/useidle

This example shows how to programmatically reset the idle timer using the 'reset' function returned by useIdle. It also demonstrates watching the 'idle' state and triggering an action, like incrementing a counter, when the user becomes idle.

```typescript
import {
useCounter
,
useIdle
} from '@vueuse/core'
import {
watch
} from 'vue'

const { 
inc
, 
count
 } = 
useCounter
()

const { 
idle
, 
lastActive
, 
reset
 } = 
useIdle
(5 * 60 * 1000) // 5 min


watch
(
idle
, (idleValue) => {
  if (
idleValue
) {
    
inc
()
    
console
.
log
(`Triggered ${ 
count
.value
} times`)
    
reset
() // restarts the idle timer. Does not change lastActive value
  }
})
```

--------------------------------

### useDark - Configuration Options

Source: https://vueuse.org/core/usedark

Illustrates how to configure useDark with custom selectors, attributes, and values for dark and light modes.

```APIDOC
## useDark - Configuration Options

### Description
This section details how to customize `useDark`'s behavior, including the target element, attribute to modify, and the values for dark and light modes. It also shows how to use a custom `onChanged` handler.

### Method
`useDark(options?: UseDarkOptions)`

### Endpoint
N/A (Composable function)

### Parameters
#### Configuration Object (`UseDarkOptions`)
- **selector** (string) - Optional - The CSS selector for the target element. Defaults to `'html'`.
- **attribute** (string) - Optional - The attribute to apply to the target element. Defaults to `'class'`.
- **valueDark** (string) - Optional - The value to apply when dark mode is enabled. Defaults to `'dark'`.
- **valueLight** (string) - Optional - The value to apply when dark mode is disabled. Defaults to `''`.
- **onChanged** (function) - Optional - A custom handler function that is called when the dark mode state changes. It receives `isDark` (boolean), `defaultHandler` (function), and `mode` (BasicColorSchema) as arguments.

### Request Example (TypeScript)
```typescript
const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})
```

### Request Example (JavaScript)
```javascript
'use strict'
const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})
```

### Request Example (Custom onChanged)
```typescript
const isDark = useDark({
  onChanged(dark) {
    // update the dom, call the API or something
  },
})
```

### Response
- **isDark** (WritableComputedRef<boolean>) - A reactive boolean indicating the current dark mode state.
- **toggleDark** (function) - A function to toggle the `isDark` state.
```

--------------------------------

### Use useElementSize with Template Refs

Source: https://vueuse.org/core/useelementsize

Import and use useElementSize with a template ref to get reactive width and height. Ensure the element has a ref attribute pointing to the template ref.

```vue
<script setup lang="ts">
import { 
useElementSize
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')
const { 
width
, 
height
 } = 
useElementSize
(
el
)
</script>

<template>
  <
div
 
ref
="
el
">
    Height: {{ 
height
 }}
    Width: {{ 
width
 }}
  </
div>
</template>
```

--------------------------------

### useVModel - Basic Usage

Source: https://vueuse.org/core/useVModel

Demonstrates the basic usage of useVModel with Vue's Composition API (TypeScript and JavaScript).

```APIDOC
## useVModel

### Description
Shorthand for v-model binding, props + emit -> ref. It's recommended to use Vue's `defineModel` unless specific edge cases like `TSX` or `deep: true` are required.

### Usage

#### TypeScript
```typescript
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const data = useVModel(props, 'modelValue', emit)
```

#### JavaScript
```javascript
import { useVModel } from '@vueuse/core'

const props = defineProps()
const emit = defineEmits(['update:modelValue'])

const data = useVModel(props, 'modelValue', emit)
```

### Options API
```typescript
import { useVModel } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const data = useVModel(props, 'data', emit)

    console.log(data.value) // props.data
    data.value = 'foo' // emit('update:data', 'foo')
  }
}
```
```

--------------------------------

### Bidirectional Transform

Source: https://vueuse.org/router/useRouteQuery

Provides separate get and set functions to handle complex data types like arrays in the URL.

```typescript
import { 
useRouteQuery
 } from '@vueuse/router'

const 
filters
 = 
useRouteQuery
('filters', [], {
  
transform
: {
    
get
: 
v
 => 
v
 ? 
v
.split(',') : [],
    
set
: 
v
 => 
v
.join(','),
  },
})

// Reading: 'a,b,c' -> ['a', 'b', 'c']
// Writing: ['a', 'b', 'c'] -> 'a,b,c'
```

--------------------------------

### Use useVibrate Hook

Source: https://vueuse.org/core/useVibrate

Demonstrates how to use the useVibrate hook to create a vibration pattern. The pattern is defined as an array of milliseconds for vibration and pause durations. The `vibrate()` function starts the pattern, and `stop()` can be used to halt it prematurely. `isSupported` indicates if the device supports vibration.

```typescript
import {
  useVibrate
} from '@vueuse/core'

// This vibrates the device for 300 ms
// then pauses for 100 ms before vibrating the device again for another 300 ms:
const { 
  vibrate,
  stop,
  isSupported
} = 
useVibrate
({ 
  pattern: [300, 100, 300] })

// Start the vibration, it will automatically stop when the pattern is complete:
vibrate
()

// But if you want to stop it, you can:
stop
()
```

--------------------------------

### Initialize Template Promise

Source: https://vueuse.org/core/createtemplatepromise

Shows how to initialize the component in TypeScript and JavaScript, including optional generic type definitions.

```ts
import { 
createTemplatePromise
 } from '@vueuse/core'

const 
TemplatePromise
 = 
createTemplatePromise
()
const 
MyPromise
 = 
createTemplatePromise
<boolean>() // with generic type
```

```js
import { createTemplatePromise } from '@vueuse/core'
const TemplatePromise = createTemplatePromise()
const MyPromise = createTemplatePromise() // with generic type
```

--------------------------------

### useImage - Component Usage

Source: https://vueuse.org/core/useImage

Shows how to use the renderless component version of `useImage` from the `@vueuse/components` package, providing slots for loading and error states.

```APIDOC
## UseImage Component

### Description
This example demonstrates using the `UseImage` component, a renderless component provided by `@vueuse/components`. It allows you to define template slots for loading, error, and the image itself.

### Method
`<UseImage>` Component

### Endpoint
N/A (Component Usage)

### Parameters
#### Props
- **src** (string) - Required - The URL of the image to load.
- **srcset** (string) - Optional - Images to use in different situations.
- **sizes** (string) - Optional - Image sizes for different page layouts.
- **alt** (string) - Optional - Image alternative information.
- **class** (string) - Optional - Image classes.
- **loading** (HTMLImageElement["loading"]) - Optional - Image loading attribute.
- **crossorigin** (string) - Optional - Image CORS settings.
- **referrerPolicy** (HTMLImageElement["referrerPolicy"]) - Optional - Referrer policy for fetch.
- **width** (HTMLImageElement["width"]) - Optional - Image width.
- **height** (HTMLImageElement["height"]) - Optional - Image height.
- **decoding** (HTMLImageElement["decoding"]) - Optional - Hint for image decoding.
- **fetchPriority** (HTMLImageElement["fetchPriority"]) - Optional - Hint for fetching priority.
- **ismap** (HTMLImageElement["ismap"]) - Optional - Indicates if the image is a server-side image map.
- **usemap** (HTMLImageElement["usemap"]) - Optional - The partial URL of an image map.

### Slots
- **#loading**: Content to display while the image is loading.
- **#error**: Content to display if the image fails to load.
- **default**: Content to display when the image is successfully loaded (receives image props).

### Request Example
```vue
<template>
  <UseImage src="https://place.dog/300/200">
    <template #loading>
      Loading..
    </template>

    <template #error>
      Failed
    </template>
  </UseImage>
</template>
```

### Response
(Handled via slots)
```

--------------------------------

### usePreferredLanguages - Composable Usage

Source: https://vueuse.org/core/usePreferredLanguages

Demonstrates how to use the usePreferredLanguages composable in a Vue.js application to get the user's preferred languages.

```APIDOC
## usePreferredLanguages

### Description
Reactive Navigator Languages. It provides web developers with information about the user's preferred languages. For example, this may be useful to adjust the language of the user interface based on the user's preferred languages in order to provide better experience.

### Method
Composable Function

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()
```

### Response
#### Success Response
- **languages** (ShallowRef<readonly string[]>) - A reactive reference containing an array of the user's preferred languages, ordered by preference.

#### Response Example
```json
{
  "languages": ["en-US", "en"]
}
```
```

--------------------------------

### useArrayReduce Basic Usage

Source: https://vueuse.org/shared/usearrayreduce

Demonstrates the basic usage of useArrayReduce with a static array of refs.

```APIDOC
## useArrayReduce

### Description
Reactive `Array.reduce`.

### Method
`useArrayReduce`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useArrayReduce } from '@vueuse/core'

const sum = useArrayReduce([
  ref(1),
  ref(2),
  ref(3)
], (sum, val) => sum + val)
// sum.value: 6
```

### Response
#### Success Response (200)
- **sum** (ComputedRef<T>) - The computed value of the array reduction.

#### Response Example
```json
{
  "value": 6
}
```
```

--------------------------------

### Import and Use usePreferredLanguages

Source: https://vueuse.org/core/usePreferredLanguages

Import the composable from '@vueuse/core' and call it to get a reactive ref of the user's preferred languages.

```typescript
import {
usePreferredLanguages
} from '@vueuse/core'

const
languages
=
usePreferredLanguages
()
```

--------------------------------

### useDevicesList - Requesting Permissions

Source: https://vueuse.org/core/usedeviceslist

Shows how to explicitly request permissions for accessing devices using the `ensurePermissions` method.

```APIDOC
## POST /api/devices/permissions

### Description
Requests permissions to access media devices. This is typically used when `requestPermissions` is not set to true initially.

### Method
POST

### Endpoint
/api/devices/permissions

### Parameters
#### Request Body
- **constraints** (object) - Optional - MediaStreamConstraints to specify requested media types (e.g., { audio: true, video: true }).

### Request Example
```ts
import { useDevicesList } from '@vueuse/core'

const { ensurePermissions, permissionGranted } = useDevicesList()

await ensurePermissions()

console.log(permissionGranted.value)
```

### Response
#### Success Response (200)
- **permissionGranted** (boolean) - Indicates if permissions were successfully granted.

### Response Example
```json
{
  "permissionGranted": true
}
```
```

--------------------------------

### onClickOutside with Controls

Source: https://vueuse.org/core/onClickOutside

This snippet shows how to use the `controls` option to get `stop`, `cancel`, and `trigger` functions for more control over the handler.

```APIDOC
## onClickOutside with Controls

### Description
Provides more control over triggering the handler using `stop`, `cancel`, and `trigger` functions.

### Method
Function Call with Options

### Endpoint
N/A (Composable Function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **modalRef** (Ref) - Required - The ref for the modal element.
- **handler** (Function) - Required - The function to call when a click outside occurs.
- **options** (Object) - Optional - Configuration options.
  - **controls** (Boolean) - Set to `true` to enable control functions.

### Request Example
```typescript
const { stop, cancel, trigger } = onClickOutside(
  modalRef,
  (event) => {
    modal.value = false
  },
  { controls: true },
)

// cancel prevents the next click from triggering the handler
cancel()

// trigger manually fires the handler
trigger(event)

// stop removes all event listeners
stop()
```

### Response
#### Success Response (200)
Returns an object with `stop`, `cancel`, and `trigger` functions.
```

--------------------------------

### Implement file selection with useFileDialog

Source: https://vueuse.org/core/usefiledialog

Demonstrates how to import and use the useFileDialog composable within a Vue component to handle file selection and cancellation.

```vue
<script setup lang="ts">
import { 
useFileDialog
 } from '@vueuse/core'

const { 
files
, 
open
, 
reset
, 
onCancel
, 
onChange
 } = 
useFileDialog
({
  
accept
: 'image/*', // Set to accept only image files
  
directory
: true, // Select directories instead of files if set true
})


onChange
((
files
) => {
  /** do something with files */
})


onCancel
(() => {
  /** do something on cancel */
})
</script>

<template>
  <
button
 
type
="button" @
click
="
open
">
    Choose file
  </
button
>
</template>
```

--------------------------------

### useExtractedObservable with Completion Handling

Source: https://vueuse.org/rxjs/useExtractedObservable

This example demonstrates how to attach special behavior when the watched Observable completes using the `onComplete` option.

```APIDOC
## useExtractedObservable with Completion Handling

### Description
Attaches custom behavior when the Observable completes using the `onComplete` callback.

### Parameters
#### Options
- **onComplete** (() => void) - Called when the Observable completes.

### Request Example
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {
    onComplete: () => {
      console.log('Done!')
    },
  }
)
```
```

--------------------------------

### useCached Utility

Source: https://vueuse.org/core/useCached

Demonstrates how to use the useCached utility with a custom data structure and comparator.

```APIDOC
## useCached

### Description
Cache a ref with a custom comparator.

### Method
Composition API function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useCached } from '@vueuse/core'
import { shallowRef } from 'vue'

interface Data {
  value: number
  extra: number
}

const source = shallowRef<Data>({ value: 42, extra: 0 })
const cached = useCached(source, (a, b) => a.value === b.value)

// Example updates
source.value = {
  value: 42,
  extra: 1,
}
console.log(cached.value) // Output: { value: 42, extra: 0 }

source.value = {
  value: 43,
  extra: 1,
}
console.log(cached.value) // Output: { value: 43, extra: 1 }
```

### Response
#### Success Response (200)
Returns a cached ref that updates only when the comparator function returns false.

#### Response Example
```json
{
  "value": 42, 
  "extra": 0 
}
```

### Type Declarations
```typescript
export interface UseCachedOptions<D extends boolean = true> extends ConfigurableDeepRefs<D>, WatchOptions {}

export declare function useCached<T, D extends boolean = true>(
  refValue: Ref<T>,
  comparator?: (a: T, b: T) => boolean,
  options?: UseCachedOptions<D>
): UseCachedReturn<T, D>

export type UseCachedReturn<T = any, D extends boolean = true> = ShallowOrDeepRef<T, D>
```
```

--------------------------------

### Create a custom useFetch instance

Source: https://vueuse.org/core/useFetch

Configures a reusable fetch instance with a base URL and authorization headers.

```typescript
const 
useMyFetch
 = 
createFetch
({
  
baseUrl
: 'https://my-api.com',
  
options
: {
    async 
beforeFetch
({ 
options
 }) {
      const 
myToken
 = await getMyToken()
      
options
.
headers
.Authorization = `Bearer ${
myToken
}`

      return { 
options
 }
    },
  },
  
fetchOptions
: {
    
mode
: 'cors',
  },
})

const { 
isFetching
, 
error
, 
data
 } = 
useMyFetch
('users')
```

```javascript
'use strict'
const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  options: {
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
const { isFetching, error, data } = useMyFetch('users')
```

--------------------------------

### Basic Usage of useClipboard

Source: https://vueuse.org/core/useclipboard

Demonstrates how to use the `useClipboard` composable to copy text to the clipboard and display the copied status. Ensure your browser supports the Clipboard API.

```vue
<script setup lang="ts">
import { 
useClipboard
 } from '@vueuse/core'

const 
source
 = 
ref
('Hello')
const { 
text
, 
copy
, 
copied
, 
isSupported
 } = 
useClipboard
({ 
source
 })
</script>

<template>
  <
div
 v-if="
isSupported
">
    <
button
 @
click
="
copy
(
source
)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <
span
 v-if="! 
copied
">Copy</
span
>
      <
span
 v-else>Copied!</
span
>
    </
button
>
    <
p
>Current copied: <
code
>{{ 
text
 || 'none' }}</
code
></
p
>
  </
div
>
  <
p
 v-else>
    Your browser does not support Clipboard API
  </
p
>
</template>
```

--------------------------------

### useWebSocket Basic Usage

Source: https://vueuse.org/core/useWebSocket

Demonstrates the basic usage of the useWebSocket composable with a WebSocket URL and optional protocols.

```APIDOC
## useWebSocket Basic Usage

### Description
This example shows how to initialize the `useWebSocket` composable with a URL and specify sub-protocols.

### Method
N/A (Composable function)

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
const { status, data, send, open, close } = useWebSocket('ws://websocketurl', {
  protocols: ['soap'], // Example: ['soap', 'wamp']
})
```

### Response
#### Success Response (200)
N/A (Composable function returns reactive references)

#### Response Example
N/A
```

--------------------------------

### Bidirectional Transform

Source: https://vueuse.org/router/useroutequery

Allows defining separate `get` and `set` transformation functions for reading and writing values to the URL query parameter.

```APIDOC
## Bidirectional Transform 

### Description
You can provide separate `get` and `set` transforms for reading and writing values.

### Method
`useRouteQuery(name: string, defaultValue?: MaybeRefOrGetter<T>, options?: ReactiveRouteOptionsWithTransform<T, K>): Ref<K>
`

### Parameters
#### Query Parameters
- **transform** (object) - Optional - An object with `get` and `set` functions for transforming the value.
  - **get** (function) - Function to transform the value when reading from the URL.
  - **set** (function) - Function to transform the value when writing to the URL.

### Request Example
ts
```typescript
import { useRouteQuery } from '@vueuse/router'

const filters = useRouteQuery('filters', [], {
  transform: {
    get: v => v ? v.split(',') : [],
    set: v => v.join(','),
  },
})

// Reading: 'a,b,c' -> ['a', 'b', 'c']
// Writing: ['a', 'b', 'c'] -> 'a,b,c'
```
```

--------------------------------

### Calculate Average of an Array

Source: https://vueuse.org/math/useaverage

Use this snippet to get the reactive average of a list of numbers. Ensure the `list` ref is imported from `vue`.

```typescript
import {
useAverage
} from '@vueuse/math'

const 
list
 = 
ref
([1, 2, 3])
const 
averageValue
 = 
useAverage
(
list
) // Ref<2>
```

--------------------------------

### Initialize useWebSocket

Source: https://vueuse.org/core/useWebSocket

Import and initialize the useWebSocket composable with a WebSocket URL. This sets up the connection and provides reactive references for status, data, and control functions.

```typescript
import {
useWebSocket
} from '@vueuse/core'

const { 
status
, 
data
, 
send
, 
open
, 
close
, 
ws
 } = 
useWebSocket
('ws://websocketurl')
```

--------------------------------

### useTitle Composable

Source: https://vueuse.org/core/usetitle

The useTitle function provides a reactive way to get or set the document title. It is not compatible with Server-Side Rendering (SSR).

```APIDOC
## useTitle(newTitle?, options?)

### Description
Reactive document title management. Updates the document.title when the provided ref or value changes.

### Parameters
#### Arguments
- **newTitle** (MaybeRef<string | null | undefined>) - Optional - The initial title or a reactive reference to the title.
- **options** (UseTitleOptions) - Optional - Configuration object for title behavior.

### Options
- **restoreOnUnmount** (false | (originalTitle, currentTitle) => string) - Optional - Restore the original title when the component is unmounted.
- **observe** (boolean) - Optional - Observe document.title changes using MutationObserver (incompatible with titleTemplate).
- **titleTemplate** (MaybeRef<string> | (title) => string) - Optional - Template string to parse the title (e.g., '%s | My Website').

### Request Example
```ts
import { useTitle } from '@vueuse/core'

// Basic usage
const title = useTitle('New Title', {
  titleTemplate: '%s | My Awesome Website'
})
```

### Response
- **Return** (Ref<string | null | undefined> | ComputedRef<string | null | undefined>) - A reactive reference that reflects and controls the document title.
```

--------------------------------

### Usage of useClipboardItems

Source: https://vueuse.org/core/useClipboardItems

Demonstrates how to initialize and use the useClipboardItems composable to copy ClipboardItem data to the system clipboard.

```vue
<script setup lang="ts">
import { 
useClipboardItems
 } from '@vueuse/core'

const 
mime
 = 'text/plain'
const 
source
 = 
ref
([
  new 
ClipboardItem
({
    [
mime
]: new 
Blob
(['plain text'], { 
type
: 
mime
 }),
  })
])

const { 
content
, 
copy
, 
copied
, 
isSupported
 } = 
useClipboardItems
({ 
source
 })
</script>

<template>
  <
div
 v-if="
isSupported
">
    <
button
 @
click
="
copy
(
source
)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <
span
 v-if="!
copied
">Copy</
span
>
      <
span
 v-else>Copied!</
span
>
    </
button
>
    <
p
>
      Current copied: <
code
>{{ 
content
 || 'none' }}</
code
>
    </
p
>
  </
div
>
  <
p
 v-else>
    Your browser does not support Clipboard API
  </
p
>
</template>
```

--------------------------------

### useStorage Configuration and Serializers

Source: https://vueuse.org/core/usestorage

Details on how to configure useStorage with custom serializers and various options for reactivity and synchronization.

```APIDOC
## useStorage Configuration

### Description
Configures the behavior of the useStorage reactive storage utility, including serialization and synchronization settings.

### Parameters
#### Options
- **deep** (boolean) - Optional - Watch for deep changes in objects/arrays (default: true)
- **listenToStorageChanges** (boolean) - Optional - Sync across tabs via storage events (default: true)
- **writeDefaults** (boolean) - Optional - Write default value to storage if not present (default: true)
- **shallow** (boolean) - Optional - Use shallowRef instead of ref (default: false)
- **initOnMounted** (boolean) - Optional - Initialize only after component is mounted (default: false)
- **onError** (function) - Optional - Custom error handler (default: console.error)
- **flush** (string) - Optional - Watch flush timing (default: 'pre')

### Built-in Serializers
- **string**: Plain string
- **number**: Number (via parseFloat)
- **boolean**: Boolean
- **object**: JSON object/array
- **map**: JavaScript Map
- **set**: JavaScript Set
- **date**: JavaScript Date (via toISOString)
- **any**: Raw string passthrough
```

--------------------------------

### Use useScreenSafeArea Hook

Source: https://vueuse.org/core/usescreensafearea

Import and use the `useScreenSafeArea` hook in your Vue component to get reactive safe area inset values.

```typescript
import {
 useScreenSafeArea
} from '@vueuse/core'

const { 
 top,
 right,
 bottom,
 left,
} = 
useScreenSafeArea
()
```

--------------------------------

### Basic File Dialog Usage

Source: https://vueuse.org/core/useFileDialog

Demonstrates how to use useFileDialog to open a file dialog for image files and handle file changes. Set the 'accept' option to filter file types and 'directory' to true to select directories.

```vue
<script setup lang="ts">
import {
useFileDialog
} from '@vueuse/core'

const { 
files
,
open
,
reset
,
onCancel
,
onChange
} = 
useFileDialog
({
  
accept
: 'image/*',
  
directory
: true,
})


onChange
((files) => {
  /** do something with files */
})


onCancel
(() => {
  /** do something on cancel */
})
</script>

<template>
  <
button
 
type
="button" @
click
="
open
">
    Choose file
  </
button>
</template>
```

--------------------------------

### Import and Use useOnline Composable

Source: https://vueuse.org/core/useonline

Import the useOnline composable from '@vueuse/core' and use it to get a reactive boolean indicating the online status.

```typescript
import {
useOnline
} from '@vueuse/core'

const
online
=
useOnline
()
```

--------------------------------

### Import and Use useTextDirection

Source: https://vueuse.org/core/useTextDirection

Import the composable and call it to get a reactive reference to the text direction. By default, it returns 'ltr' or 'rtl'.

```typescript
import {
useTextDirection
} from '@vueuse/core'

const
dir
=
useTextDirection
()

```

--------------------------------

### Basic Usage of useAnimate

Source: https://vueuse.org/core/useAnimate

Demonstrates how to bind an animation to a template reference and access control functions and state.

```vue
<script setup lang="ts">
import { 
useAnimate
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')
const {
  
isSupported
,
  
animate
,

  // actions
  
play
,
  
pause
,
  
reverse
,
  
finish
,
  
cancel
,

  // states
  
pending
,
  
playState
,
  
replaceState
,
  
startTime
,
  
currentTime
,
  
timeline
,
  
playbackRate
,
} = 
useAnimate
(
el
, { 
transform
: 'rotate(360deg)' }, 1000)
</script>

<template>
  <
span
 
ref
="
el
" 
style
="display:inline-block">useAnimate</
span
>
</template>
```

--------------------------------

### Date Formatting with Locales

Source: https://vueuse.org/shared/usedateformat

Formats the current date and time using a specified locale, for example, 'en-US', to display the day of the week.

```vue
<script setup lang="ts">
import {
useDateFormat,
useNow
} from '@vueuse/core'

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD (ddd)', { locales: 'en-US' })
</script>

<template>
  <div>{{ formatted }}</div>
</template>
```

--------------------------------

### usePrevious Utility

Source: https://vueuse.org/core/useprevious

Demonstrates how to use the usePrevious utility to store and retrieve the prior value of a ref.

```APIDOC
## usePrevious

### Description
Holds the previous value of a ref.

### Method
Composition API function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { usePrevious } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef('Hello')
const previous = usePrevious(counter)

console.log(previous.value) // undefined

counter.value = 'World'

console.log(previous.value) // Hello
```

### Response
#### Success Response (200)
N/A (This is a utility function, not an API endpoint)

#### Response Example
N/A

### Type Declarations
```typescript
/**
 * Holds the previous value of a ref.
 *
 * @see   {@link https://vueuse.org/usePrevious}
 */
export declare function usePrevious<T>(value: MaybeRefOrGetter<T>): Readonly<ShallowRef<T | undefined>>
export declare function usePrevious<T>(value: MaybeRefOrGetter<T>, initialValue: T): Readonly<ShallowRef<T>>
```
```

--------------------------------

### useExtractedObservable Basic Usage

Source: https://vueuse.org/rxjs/useExtractedObservable

This example demonstrates the basic usage of `useExtractedObservable` to extract values from an RxJS Observable and expose them as a Vue ref.

```APIDOC
## useExtractedObservable 

### Description
Use an RxJS `Observable` as extracted from one or more composables, return a `ref`, and automatically unsubscribe from it when the component is unmounted.

### Method
`useExtractedObservable`

### Parameters
#### Source
- **source** (Ref | State | Function) - The source to watch.
- **observableFactory** (Function) - A function that returns an Observable.
- **options** (Object) - Optional configuration object for error and completion handlers.
  - **initialValue** (T) - Value to use before the Observable emits.
  - **onError** ((err: any) => void) - Error handler for Observable errors.
  - **onComplete** (() => void) - Called when the Observable completes.
- **watchOptions** (Object) - Optional options to pass to the underlying `watch` function.
  - **immediate** (boolean) - Whether to call the getter immediately.

### Return Value
Returns a readonly `ShallowRef` containing the latest value emitted by the extracted Observable.

### Request Example
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import ObservableSocket from 'observable-socket'
import { computed } from 'vue'
import { makeSocket, useUser } from '../some/lib/func'

// setup()
const user = useUser()
const lastMessage = useExtractedObservable(user, u => ObservableSocket.create(makeSocket(u.id)).down)
```

### Response Example
```json
{
  "latestObservableValue": "any"
}
```
```

--------------------------------

### useAxios with Options (JavaScript)

Source: https://vueuse.org/integrations/useaxios

Configure advanced options for useAxios in JavaScript, including immediate execution, shallow refs, aborting previous requests, and callbacks.

```javascript
'use strict'
const { data } = useAxios('/api/posts', config, instance, {
  // Execute immediately (default: true if url provided)
  immediate: true,
  // Use shallowRef for data (default: true)
  shallow: true,
  // Abort previous request on new execute (default: true)
  abortPrevious: true,
  // Reset data before executing (default: false)
  resetOnExecute: false,
  // Initial data value
  initialData: [],
  // Callbacks
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
  onFinish: () => console.log('Finished'),
})
```

--------------------------------

### Basic Date Formatting

Source: https://vueuse.org/shared/usedateformat

Formats the current date and time to 'YYYY-MM-DD HH:mm:ss'. Requires `useNow` to get the current date.

```vue
<script setup lang="ts">
import {
useDateFormat,
useNow
} from '@vueuse/core'

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
</script>

<template>
  <div>{{ formatted }}</div>
</template>
```

--------------------------------

### useRouteHash API

Source: https://vueuse.org/router/useRouteHash

The useRouteHash composable provides a reactive reference to the current route's hash. It can be used to get or set the hash value.

```APIDOC
## useRouteHash 

### Description
Shorthand for a reactive `route.hash`. Available in the `@vueuse/router` add-on.

### Method
Composable function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage Example
```typescript
import { useRouteHash } from '@vueuse/router'

const hash = useRouteHash()

console.log(hash.value) // route.hash

hash.value = 'foobar' // router.replace({ hash: 'foobar' })
```

### Type Declarations
```typescript
export declare function useRouteHash(
  defaultValue?: MaybeRefOrGetter<RouteHashValueRaw>,
  { mode, route, router }?: ReactiveRouteOptions,
): Ref<RouteHashValueRaw, RouteHashValueRaw>
```

### Response
#### Success Response (200)
Returns a `Ref` object that holds the route's hash value.

#### Response Example
```json
{
  "example": "#section1"
}
```
```

--------------------------------

### Basic Media Controls Usage

Source: https://vueuse.org/core/usemediacontrols

Demonstrates binding a video element to reactive state variables for playback control and property management.

```vue
<script setup lang="ts">
import { 
useMediaControls
 } from '@vueuse/core'
import { 
onMounted
, 
useTemplateRef
 } from 'vue'

const 
video
 = 
useTemplateRef
('video')
const { 
playing
, 
currentTime
, 
duration
, 
volume
 } = 
useMediaControls
(
video
, {
  
src
: 'video.mp4',
})

// Change initial media properties

onMounted
(() => {
  
volume
.
value
 = 0.5
  
currentTime
.
value
 = 60
})
</script>

<template>
  <
video
 
ref
="
video
" />
  <
button
 @
click
="
playing
 = !
playing
">
    Play / Pause
  </
button
>
  <
span
>{{ 
currentTime
 }} / {{ 
duration
 }}</
span
>
</template>
```

--------------------------------

### createFetch

Source: https://vueuse.org/core/useFetch

Creates a configured instance of the useFetch composable with global defaults.

```APIDOC
## createFetch

### Description
Creates a configured instance of the useFetch composable, allowing you to set a base URL and default fetch options for all requests made by the returned instance.

### Parameters
#### Request Body
- **config** (CreateFetchOptions) - Optional - Configuration object containing baseUrl, combination, options, and fetchOptions.
```

--------------------------------

### Calculate sum from an array

Source: https://vueuse.org/math/useSum

Use `useSum` with a ref containing an array of numbers to get a reactive sum. Ensure the array is imported from `@vueuse/math`.

```typescript
import {
useSum
} from '@vueuse/math'

const
array
=
ref
([1, 2, 3, 4])
const
sum
=
useSum(
array
) // Ref<10>
```

--------------------------------

### Basic useMediaQuery Usage

Source: https://vueuse.org/core/useMediaQuery

Import and use the `useMediaQuery` composable to reactively track media query states like screen size or color scheme preference. The returned value is a computed property.

```typescript
import {
  useMediaQuery
} from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
```

--------------------------------

### useTimestamp Basic Usage

Source: https://vueuse.org/core/usetimestamp

Import and use the useTimestamp composable to get a reactive timestamp. The offset option can be used to add a value to the timestamp.

```APIDOC
## useTimestamp

### Description
Reactive current timestamp.

### Method
useTimestamp

### Parameters
#### Query Parameters
- **options** (UseTimestampOptions<false>) - Optional - Configuration options for useTimestamp.
  - **controls** (boolean) - Optional - Expose more controls. Defaults to `false`.
  - **offset** (number) - Optional - Offset value adding to the value. Defaults to `0`.
  - **immediate** (boolean) - Optional - Update the timestamp immediately. Defaults to `true`. Deprecated, use `scheduler` instead.
  - **interval** ("requestAnimationFrame" | number) - Optional - Update interval, or use requestAnimationFrame. Defaults to `requestAnimationFrame`. Deprecated, use `scheduler` instead.
  - **callback** ((timestamp: number) => void) - Optional - Callback on each update.

### Return Value
- **timestamp** (ShallowRef<number>) - A reactive reference to the current timestamp.

### Request Example
```typescript
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp({ offset: 0 })
```
```

--------------------------------

### CreateFetchOptions

Source: https://vueuse.org/core/usefetch

Configuration options for the createFetch factory function.

```APIDOC
## CreateFetchOptions

### Description
Defines the configuration object for the `createFetch` function.

### Method
N/A

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **baseUrl** (MaybeRefOrGetter<string>) - Optional. The base URL to prefix to all relative URLs.
- **combination** (Combination) - Optional. Determines the inheritance behavior for fetch hooks (`beforeFetch`, `afterFetch`, `onFetchError`). Defaults to 'chain'.
- **options** (UseFetchOptions) - Optional. Default options to be applied to all `useFetch` calls made with this instance.
- **fetchOptions** (RequestInit) - Optional. Default options for the underlying fetch request.

### Request Example
```json
{
  "example": "// Example of CreateFetchOptions object\n{\n  baseUrl: 'https://api.example.com/v1',\n  combination: 'overwrite',\n  options: {\n    refetch: true\n  },\n  fetchOptions: {\n    mode: 'cors'\n  }\n}"
}
```

### Response
N/A

#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### Import and Use usePreferredReducedMotion

Source: https://vueuse.org/core/usepreferredreducedmotion

Import the composable from `@vueuse/core` and use it to get a reactive computed property for the user's reduced motion preference.

```typescript
import {
usePreferredReducedMotion
} from '@vueuse/core'

const
preferredMotion
=
usePreferredReducedMotion
()
```

--------------------------------

### Initialization of refWithControl

Source: https://vueuse.org/shared/refWithControl

Shows the basic initialization syntax for refWithControl.

```typescript
const 
foo
 = 
refWithControl
('foo')
```

```javascript
'use strict'
const foo = refWithControl('foo')
```

--------------------------------

### Import and Use usePreferredContrast

Source: https://vueuse.org/core/usePreferredContrast

Import the usePreferredContrast hook from '@vueuse/core' to get a reactive computed property reflecting the user's contrast preference.

```typescript
import {
 usePreferredContrast
} from '@vueuse/core'

const
 preferredContrast
 = 
usePreferredContrast
()
```

--------------------------------

### useFetch - Prevent Request Firing Immediately

Source: https://vueuse.org/core/usefetch

Demonstrates how to prevent useFetch from making a request immediately upon initialization, requiring an explicit call to `execute()`.

```APIDOC
## useFetch - Prevent Request Firing Immediately

### Description
Setting the `immediate` option to false will prevent the request from firing until the `execute` function is called.

### Method
GET (implicitly)

### Endpoint
`[URL provided]`

### Parameters
#### Query Parameters
- **url** (string | Ref<string>) - Required - The URL to fetch data from.
- **options** (object) - Optional - Configuration options.
  - **immediate** (boolean) - Optional - If set to `false`, the fetch will not fire immediately.

#### Request Body
None

### Response
#### Success Response (200)
- **data** (any) - The data returned from the fetch request.

### Request Example
```typescript
const { execute } = useFetch(url, { immediate: false })
execute()
```
```

--------------------------------

### Track Element Hover State with useElementHover

Source: https://vueuse.org/core/useElementHover

Use this sensor to get the reactive hover state of an element. Requires importing `useElementHover` and `useTemplateRef`.

```vue
<script setup lang="ts">
import { 
useElementHover
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
myHoverableElement
 = 
useTemplateRef
('myHoverableElement')
const 
isHovered
 = 
useElementHover
(
myHoverableElement
)
</script>

<template>
  <button 
ref
="
myHoverableElement
">
    {{ 
isHovered
 }}
  </button>
</template>
```

--------------------------------

### useShare with Source Ref

Source: https://vueuse.org/core/useshare

Shows how to pass a ref to useShare. Changes to the source ref will automatically update the sharing options.

```APIDOC
## useShare with Source Ref

### Description
Allows passing a `ref` for sharing options. Changes to the source ref will be reflected in the sharing options.

### Method
useShare

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { ref } from 'vue'

const shareOptions = ref<ShareOptions>({ text: 'foo' })
const { share, isSupported } = useShare(shareOptions)

shareOptions.value.text = 'bar'
share()
```

### Response
#### Success Response (200)
N/A (The `share` function returns a Promise that resolves to void upon successful sharing.)

#### Response Example
None
```

--------------------------------

### Basic usage of useStyleTag

Source: https://vueuse.org/core/useStyleTag

Demonstrates how to inject a style tag and update its content reactively.

```typescript
import { 
useStyleTag
 } from '@vueuse/core'

const {
  
id
,
  
css
,
  
load
,
  
unload
,
  
isLoaded
,
} = 
useStyleTag
('.foo { margin-top: 32px; }')

// Later you can modify styles

css
.
value
 = '.foo { margin-top: 64px; }'
```

```html
<style id="vueuse_styletag_1">
  .foo {
    margin-top: 64px;
  }
</style>
```

--------------------------------

### Create and Use a Projection

Source: https://vueuse.org/math/createProjection

Demonstrates how to create a projector function that maps values from an input domain [0, 10] to an output domain [0, 100]. The projected value updates reactively as the input ref changes.

```typescript
import {
  createProjection
} from '@vueuse/math'

const 
useProjector
 = 
createProjection
([0, 1],
 [0, 100])
const 
input
 = 
ref
(0)
const 
projected
 = 
useProjector(
input
)

input
.value = 0.5 // projected.value === 50
input
.value = 1 // projected.value === 100
```

--------------------------------

### Undo ref value (JavaScript)

Source: https://vueuse.org/core/usemanualrefhistory

The undo functionality works similarly in JavaScript. This example shows undoing a change to the counter in a JS context.

```javascript
'use strict'
console.log(counter.value) // 1
undo()
console.log(counter.value) // 0
```

--------------------------------

### Basic Usage of useBase64

Source: https://vueuse.org/core/useBase64

Initialize the useBase64 hook with a reactive text reference.

```ts
import { 
useBase64
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
text
 = 
shallowRef
('')

const { 
base64
, 
promise
, 
execute
 } = 
useBase64
(
text
)
```

--------------------------------

### Reactive Storage Key

Source: https://vueuse.org/core/usestorage

Demonstrates how to use a ref or getter as a storage key to dynamically update data when the key changes.

```APIDOC
## Reactive Key Usage

### Description
The storage key can be a ref or getter. When the key changes, the data will automatically update to reflect the new storage location.

### Request Example
```ts
import { useStorage, ref } from '@vueuse/core'

const userId = ref('user-1')
const userData = useStorage(
  () => `user-data-${userId.value}`,
  { name: '' },
)

// Changing the key will read from the new storage location
userId.value = 'user-2'
```
```

--------------------------------

### Reactive API usage with Vue Chemistry

Source: https://vueuse.org/ecosystem

Demonstrates using reactive math and console utilities from the Vue Chemistry library.

```javascript
import * as console from 'vue-chemistry/console'
import { set } from 'vue-chemistry/core'
import { sum } from 'vue-chemistry/math'

const a = ref(1)
const b = ref(2)

const c = sum(a, b) // c = a + b = 3

set(a, 2) // shorthand for a.value = 2

console.log(c) // it's 4 (2 + 2)!
```

--------------------------------

### useDevicesList - Component Usage

Source: https://vueuse.org/core/usedeviceslist

Illustrates the usage of the renderless component version of `useDevicesList` from `@vueuse/components`.

```APIDOC
## UseDevicesList Component

### Description
A renderless Vue component that provides the functionality of `useDevicesList` through its slot props.

### Usage
```vue
<template>
  <UseDevicesList v-slot="{ videoInputs, audioInputs, audioOutputs }">
    Cameras: {{ videoInputs }}
    Microphones: {{ audioInputs }}
    Speakers: {{ audioOutputs }}
  </UseDevicesList>
</template>

<script setup>
import { UseDevicesList } from '@vueuse/components'
</script>
```

### Slot Props
- **videoInputs** (MediaDeviceInfo[]) - List of video input devices.
- **audioInputs** (MediaDeviceInfo[]) - List of audio input devices.
- **audioOutputs** (MediaDeviceInfo[]) - List of audio output devices.
```

--------------------------------

### Basic Usage

Source: https://vueuse.org/core/useBrowserLocation

Import and initialize the hook to track browser location state.

```typescript
import { 
useBrowserLocation
 } from '@vueuse/core'

const 
location
 = 
useBrowserLocation
()
```

--------------------------------

### useMax - Multiple Arguments

Source: https://vueuse.org/math/usemax

Shows how to use useMax with multiple reactive number arguments to find the maximum among them.

```APIDOC
## useMax (Multiple Arguments)

### Description
Calculates the maximum value from a list of reactive numbers and/or static numbers.

### Method
Composable function

### Endpoint
N/A (Vue.js Composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { ref } from 'vue'
import { useMax } from '@vueuse/math'

const a = ref(1)
const b = ref(3)

const max = useMax(a, b, 2)
// max will be a Ref<3>
```

### Response
#### Success Response
- **max** (Ref<number>) - A Vue ref containing the maximum number from the input arguments.

#### Response Example
```json
{
  "max": 3
}
```
```

--------------------------------

### Bind template ref in Options API

Source: https://vueuse.org/core/templateRef

Use templateRef to bind a ref to a template element within the Options API setup function.

```vue
<script lang="ts">
import { 
templateRef
 } from '@vueuse/core'

export default {
  
setup
() {
    const 
target
 = 
templateRef
('target')

    // no need to return the `target`, it will bind to the ref magically
  },
}
</script>

<template>
  <
div
 
ref
="
target
" />
</template>
```

--------------------------------

### Declare Transition Function

Source: https://vueuse.org/core/useTransition

Declares the signature for the `transition` function, which animates a source ref from a starting value to an ending value with customizable options.

```typescript
export declare function transition<T>(
  source: Ref<T>,
  from: MaybeRefOrGetter<T>,
  to: MaybeRefOrGetter<T>,
  options?: TransitionOptions<T>,
): PromiseLike<void>
```

--------------------------------

### Bidirectional Transform with useRouteQuery

Source: https://vueuse.org/router/useroutequery

Define separate 'get' and 'set' transformation functions for useRouteQuery to handle complex data types in URL query parameters.

```typescript
import {
  useRouteQuery
} from '@vueuse/router'

const filters = 
useRouteQuery
('filters', [], {
  
  transform: {
    
    get: v => 
      v ? 
        v.split(',') : [],
    
    set: v => 
      v.join(','),
  },
})

// Reading: 'a,b,c' -> ['a', 'b', 'c']
// Writing: ['a', 'b', 'c'] -> 'a,b,c'

```

--------------------------------

### Basic Usage Implementation

Source: https://vueuse.org/core/useMouse

Initializes the useMouse hook to track mouse coordinates.

```typescript
import { 
useMouse
 } from '@vueuse/core'

const { 
x
, 
y
, 
sourceType
 } = 
useMouse
()
```

--------------------------------

### Get Previous Value of a Ref

Source: https://vueuse.org/core/useprevious

Import and use `usePrevious` with a shallowRef. The previous value is initially undefined and updates after the ref's value changes.

```typescript
import {
usePrevious
} from '@vueuse/core'
import {
shallowRef
} from 'vue'

const counter = 
shallowRef('Hello')
const previous = 
usePrevious(counter)


console.log(previous.value) // undefined

counter.value = 'World'


console.log(previous.value) // Hello
```

--------------------------------

### Transition Presets

Source: https://vueuse.org/core/usetransition

Provides common easing functions and cubic bezier points for transitions.

```APIDOC
## Transition Presets

Provides common easing functions and cubic bezier points for transitions.

### Interface

```typescript
export declare const TransitionPresets: Record<
  keyof typeof _TransitionPresets,
  CubicBezierPoints
> & {
  linear: EasingFunction
}
```

### Usage Example

```typescript
import { transition, TransitionPresets } from '@vueuse/core'

const isVisible = ref(false)

transition(isVisible, {
  from: false,
  to: true,
  duration: 500,
  easing: TransitionPresets.easeInOutCubic,
})
```
```

--------------------------------

### Enable Reactive Mode for useMagicKeys

Source: https://vueuse.org/core/usemagickeys

Set `reactive: true` in the options to get a reactive object instead of refs. This is useful for direct use in templates.

```typescript
const keys = useMagicKeys({ reactive: true })
```

```javascript
const keys = useMagicKeys({ reactive: true })
```

--------------------------------

### useCached Utility

Source: https://vueuse.org/core/usecached

Demonstrates how to use the useCached utility to cache a ref with a custom comparison function.

```APIDOC
## useCached

### Description
Cache a ref with a custom comparator.

### Method
Composable function (no direct HTTP method)

### Endpoint
N/A (Client-side composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage Example (TypeScript)
```typescript
import { useCached } from '@vueuse/core'
import { shallowRef } from 'vue'

interface Data {
  value: number
  extra: number
}

const source = shallowRef<Data>({ value: 42, extra: 0 })
const cached = useCached(source, (a, b) => a.value === b.value)

// Example updates
source.value = {
  value: 42,
  extra: 1,
}
console.log(cached.value) // Output: { value: 42, extra: 0 } (not updated due to comparator)

source.value = {
  value: 43,
  extra: 1,
}
console.log(cached.value) // Output: { value: 43, extra: 1 } (updated as value changed)
```

### Type Declarations
```typescript
export interface UseCachedOptions<D extends boolean = true> extends ConfigurableDeepRefs<D>, WatchOptions {}

export declare function useCached<T, D extends boolean = true>(
  refValue: Ref<T>,
  comparator?: (a: T, b: T) => boolean,
  options?: UseCachedOptions<D>
): UseCachedReturn<T, D>

export type UseCachedReturn<T = any, D extends boolean = true> = ShallowOrDeepRef<T, D>
```
```

--------------------------------

### Basic Usage of useColorMode

Source: https://vueuse.org/core/useColorMode

Initialize useColorMode to get a reactive ref for the current color mode. It defaults to 'auto' mode, matching browser preferences.

```typescript
import {
useColorMode
} from '@vueuse/core'

const mode = useColorMode() // Ref<'dark' | 'light'>

```

--------------------------------

### createDisposableDirective Usage

Source: https://vueuse.org/shared/createDisposableDirective

Example of creating a custom Vue directive using createDisposableDirective. This directive utilizes `useMouse` and ensures its effects are cleaned up when the directive is unmounted.

```APIDOC
## createDisposableDirective

### Description
Utility for authoring disposable directives. Reactive effects created within `mounted` directive hook will be tracked and automatically disposed when directive is unmounted.

### Method
Utility function

### Endpoint
N/A (This is a utility function, not an API endpoint)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import {
  useMouse
} from '@vueuse/core'
import {
  createDisposableDirective
} from '@vueuse/shared'

export const VDirective = 
createDisposableDirective
({
  mounted(el, binding) {
    const value = binding.value

    if (typeof value === 'function') {
      // [`useMouse`](/core/useMouse/) event listener will be removed automatically when directive is unmounted
      const { x, y } = useMouse()
      
      watch(x, val => value(val))
    }
  }
})
```

### Response
#### Success Response (200)
N/A (This is a utility function, not an API endpoint)

#### Response Example
N/A
```

--------------------------------

### useDevicePixelRatio Composable

Source: https://vueuse.org/core/useDevicePixelRatio

A reactive hook to track the current device pixel ratio.

```APIDOC
## useDevicePixelRatio()

### Description
Reactively track `window.devicePixelRatio`. Since there is no native event listener for this property, this function uses `window.matchMedia` to detect changes.

### Parameters
#### Options
- **options** (UseDevicePixelRatioOptions) - Optional - Configuration object extending ConfigurableWindow.

### Response
- **pixelRatio** (Readonly<ShallowRef<number>>) - The current device pixel ratio.
- **stop** (WatchStopHandle) - Function to stop the reactive tracking.

### Request Example
```ts
import { useDevicePixelRatio } from '@vueuse/core'

const { pixelRatio } = useDevicePixelRatio()
```
```

--------------------------------

### reactiveOmit - Basic Usage

Source: https://vueuse.org/shared/reactiveomit

Demonstrates how to use reactiveOmit to exclude specific keys from a reactive object.

```APIDOC
## reactiveOmit - Basic Usage

### Description
Reactively omit fields from a reactive object by providing the keys to exclude.

### Method
```ts
reactiveOmit(obj: T, ...keys: K[]): ReactiveOmitReturn<T, K>
```

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { reactiveOmit } from '@vueuse/core'

const obj = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0,
})

const picked = reactiveOmit(obj, 'x', 'elementX') // { y: number, elementY: number }
```

### Response
#### Success Response (200)
Returns a new reactive object with the specified keys omitted.

#### Response Example
```json
{
  "y": 0,
  "elementY": 0
}
```
```

--------------------------------

### Undo ref value

Source: https://vueuse.org/core/usemanualrefhistory

Use the undo function to reset the ref value to the last history point. This example demonstrates undoing a change to the counter.

```typescript
console.log(counter.value) // 1

undo()

console.log(counter.value) // 0
```

--------------------------------

### Implement reactive window scroll

Source: https://vueuse.org/core/usewindowscroll

Demonstrates how to import and use the useWindowScroll hook to track and update scroll coordinates.

```vue
<script setup lang="ts">
import { 
useWindowScroll
 } from '@vueuse/core'

const { 
x
, 
y
 } = 
useWindowScroll
()
</script>

<template>
  <
div
>
    read current x, y scroll: {{ 
x
 }}, {{ 
y
 }}
  </
div
>
  <
button
 @
click
="
x
 = 100">
    scroll X to 100
  </
button
>
  <
button
 @
click
="
y
 = 100">
    scroll Y to 100
  </
button
>
</template>
```

--------------------------------

### Use useNavigatorLanguage hook

Source: https://vueuse.org/core/useNavigatorLanguage

Demonstrates how to import and use the hook to track the current language and react to its changes.

```typescript
import { 
useNavigatorLanguage
 } from '@vueuse/core'

const { 
language
 } = 
useNavigatorLanguage
()


watch
(
language
, () => {
  // Listen to the value changing
})
```

--------------------------------

### Basic usage of useIntervalFn

Source: https://vueuse.org/shared/useIntervalFn

Demonstrates how to import and initialize the interval function with pause, resume, and active state controls.

```typescript
import { 
useIntervalFn
 } from '@vueuse/core'

const { 
pause
, 
resume
, 
isActive
 } = 
useIntervalFn
(() => {
  /* your function */
}, 1000)
```

--------------------------------

### Use useParallax in Vue Component

Source: https://vueuse.org/core/useParallax

Import and use the useParallax composable within a Vue component's setup. It requires a target element reference.

```vue
<script setup lang="ts">
import { 
useParallax
 } from '@vueuse/core'

const 
container
 = 
ref
(null)
const { 
tilt
, 
roll
, 
source
 } = 
useParallax
(
container
)
</script>

<template>
  <
div
 
ref
="
container
" />
</template>
```

--------------------------------

### Usage of useFps

Source: https://vueuse.org/core/useFps

Import and initialize the useFps reactive reference.

```typescript
import { 
useFps
 } from '@vueuse/core'

const 
fps
 = 
useFps
()
```

--------------------------------

### Basic Dialog Opening with useDialog

Source: https://vueuse.org/core/createTemplatePromise

Illustrates a straightforward way to open a dialog using the `useDialog` composable and awaiting its result. This is a common pattern for programmatic dialog interaction.

```typescript
const dialog = useDialog()
const result = await dialog.open({
  title: 'Hello',
  content: 'World',
})
```

```javascript
'use strict'
const dialog = useDialog()
const result = await dialog.open({
  title: 'Hello',
  content: 'World',
})
```

--------------------------------

### useAxios with Options (TypeScript)

Source: https://vueuse.org/integrations/useaxios

Configure advanced options for useAxios, including immediate execution, shallow refs, aborting previous requests, and callbacks like onSuccess, onError, and onFinish.

```typescript
const { 
data
 } = useAxios('/api/posts', config, instance, {
  // Execute immediately (default: true if url provided)
  
immediate
: true,
  // Use shallowRef for data (default: true)
  
shallow
: true,
  // Abort previous request on new execute (default: true)
  
abortPrevious
: true,
  // Reset data before executing (default: false)
  
resetOnExecute
: false,
  // Initial data value
  
initialData
: [],
  // Callbacks
  
onSuccess
: 
data
 => 
console
.
log
('Success:', 
data
),
  
onError
: 
error
 => 
console
.
error
('Error:', 
error
),
  
onFinish
: () => 
console
.
log
('Finished'),
})
```

--------------------------------

### useTimeoutFn API

Source: https://vueuse.org/shared/usetimeoutfn

The useTimeoutFn composable provides a reactive way to manage setTimeout, offering control over starting, stopping, and checking the pending state of the timer.

```APIDOC
## useTimeoutFn

### Description
Wrapper for `setTimeout` with controls.

### Method
Composition API function

### Endpoint
N/A (Composable function)

### Parameters
#### Function Parameters
- **cb** (Function) - Required - The callback function to execute after the delay.
- **interval** (number | Ref<number> | Getter<number>) - Required - The delay in milliseconds before executing the callback.
- **options** (UseTimeoutFnOptions) - Optional - Configuration options for the timer.

#### UseTimeoutFnOptions Interface
- **immediate** (boolean) - Optional - Start the timer immediately. Defaults to `true`.
- **immediateCallback** (boolean) - Optional - Execute the callback immediately after calling `start`. Defaults to `false`.

### Return Value
- **isPending** (Ref<boolean>) - A ref indicating if the timer is currently active.
- **start** (Function) - A function to start or restart the timer.
- **stop** (Function) - A function to clear the timer.

### Request Example
```typescript
import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(() => {
  console.log('Timer finished!')
}, 3000, {
  immediate: true,
  immediateCallback: false
})

// To stop the timer
// stop()

// To restart the timer
// start()
```

### Response
#### Success Response (Implicit)
This composable does not have a direct HTTP response. Its effects are managed within the Vue application's state.

#### Response Example (State)
```json
{
  "isPending": false
}
```
```

--------------------------------

### Dynamic Countdown with Refs

Source: https://vueuse.org/core/useCountdown

Use a `shallowRef` for the countdown value to allow dynamic updates. The `start` and `reset` functions can accept new countdown values.

```typescript
import {
useCountdown
} from '@vueuse/core'
import {
shallowRef
} from 'vue'

const
countdown
 = 
shallowRef
(5)
const { 
start
, 
reset
 } = 
useCountdown
(
countdown
, {
})

// change the countdown value

countdown
.
value
 = 10

// start a new countdown with 2 seconds

start
(2)

// reset the countdown to 4, but do not start it

reset
(4)

// start the countdown with the current value of `countdown`

start
()

```

--------------------------------

### useAxios Options

Source: https://vueuse.org/integrations/useAxios

Details the available configuration options for the useAxios composable.

```APIDOC
## useAxios Options

### Description
This section outlines the various configuration options that can be passed to the `useAxios` composable to customize its behavior, including immediate execution, shallow refs, callbacks, and initial data.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { data } = useAxios('/api/posts', config, instance, {
  // Execute immediately (default: true if url provided)
  immediate: true,
  // Use shallowRef for data (default: true)
  shallow: true,
  // Abort previous request on new execute (default: true)
  abortPrevious: true,
  // Reset data before executing (default: false)
  resetOnExecute: false,
  // Initial data value
  initialData: [],
  // Callbacks
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
  onFinish: () => console.log('Finished'),
})
```

### Response
#### Success Response (200)
- **data** (Ref<T>) - Response data

#### Response Example
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
```

--------------------------------

### Lazy Initialization with computedAsync

Source: https://vueuse.org/core/computedAsync

Set `lazy: true` in the options object to prevent `computedAsync` from resolving immediately. The async operation will only start on its first access.

```typescript
import {
  computedAsync
} from '@vueuse/core'
import {
  shallowRef
} from 'vue'

const evaluating = shallowRef(false)

const userInfo = computedAsync(
  async () => { /* your logic */ },
  null,
  {
    lazy: true,
    evaluating
  },
)
```

--------------------------------

### Use useWindowScroll in Vue Component

Source: https://vueuse.org/core/useWindowScroll

Import and use `useWindowScroll` to get reactive scroll values. You can also programmatically scroll by updating the returned x and y values.

```vue
<script setup lang="ts">
import { 
useWindowScroll
 } from '@vueuse/core'

const { 
x
, 
y
 } = 
useWindowScroll
()
</script>

<template>
  <
div
>
    read current x, y scroll: {{ 
x
 }}, {{ 
y
 }}
  </
div>
  <
button
 @
click
="
x
 = 100">
    scroll X to 100
  </
button>
  <
button
 @
click
="
y
 = 100">
    scroll Y to 100
  </
button>
</template>
```

--------------------------------

### Basic Usage of onClickOutside

Source: https://vueuse.org/core/onClickOutside

Demonstrates the standard implementation using a template reference to target an element.

```vue
<script setup lang="ts">
import { 
onClickOutside
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
target
 = 
useTemplateRef
('target')


onClickOutside
(
target
, 
event
 => 
console
.
log
(
event
))
</script>

<template>
  <
div
 
ref
="
target
">
    Hello world
  </
div
>
  <
div
>Outside element</
div
>
</template>
```

--------------------------------

### useKeyModifier with Custom Events

Source: https://vueuse.org/core/usekeymodifier

Customize the events that trigger state updates for `useKeyModifier`. This example shows tracking 'CapsLock' state using only 'mouseup' and 'mousedown' events.

```APIDOC
## useKeyModifier with Custom Events

### Description
Allows customization of the events that trigger updates to the modifier key's state.

### Method
`useKeyModifier(modifier: KeyModifier, options?: UseModifierOptions<Initial>): UseKeyModifierReturn<Initial>`

### Parameters
#### Path Parameters
- **modifier** (KeyModifier) - Required - The keyboard modifier to track.

#### Query Parameters
- **options** (UseModifierOptions) - Optional - Configuration options.
  - **events** (WindowEventName[]) - Required - An array of window event names to listen for. Example: `['mouseup', 'mousedown']`.
  - **initial** (Initial) - Optional - The initial value for the returned ref.

### Request Example
```typescript
import { useKeyModifier } from '@vueuse/core'

const capsLockState = useKeyModifier('CapsLock', { events: ['mouseup', 'mousedown'] })

console.log(capsLockState)
```

### Response
#### Success Response (200)
- **value** (boolean | null) - The reactive state of the modifier key, updated based on the specified events.
```

--------------------------------

### provideLocal and injectLocal Usage

Source: https://vueuse.org/shared/provideLocal

Demonstrates how to use provideLocal to set a value and injectLocal to retrieve it within the same component.

```APIDOC
## provideLocal and injectLocal

### Description
Provides a value that can be directly injected within the same component using `injectLocal`. This is useful for managing component-local state.

### Method
`provideLocal(key, value)`
`injectLocal(key)`

### Parameters
#### `provideLocal` Parameters
- **key** (InjectionKey<T> | string) - The key to identify the provided value.
- **value** (T) - The value to provide.

#### `injectLocal` Parameters
- **key** (InjectionKey<T> | string) - The key of the value to inject.

### Request Example
```vue
<script setup>
import { provideLocal, injectLocal } from '@vueuse/core'

provideLocal('MyInjectionKey', 1)
const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
</script>
```

### Response
#### Success Response (provideLocal)
- **void**: The `provideLocal` function does not return a value.

#### Success Response (injectLocal)
- **T**: The type of the injected value.

#### Response Example (injectLocal)
```json
{
  "injectedValue": 1
}
```
```

--------------------------------

### onLongPress with Modifiers

Source: https://vueuse.org/core/onLongPress

Apply modifiers like `prevent`, `stop`, `once`, `capture`, and `self` to control event propagation and behavior. This example demonstrates using `prevent` and `stop`.

```typescript
onLongPress(
target, handler, {
  
modifiers
: {
    
prevent
: true,
    
stop
: true,
  },
})
```

```javascript
'use strict'
onLongPress(
target, handler, {
  modifiers: {
    prevent: true,
    stop: true,
  },
})
```

--------------------------------

### useMouse

Source: https://vueuse.org/core/useMouse

Reactive mouse position tracking utility.

```APIDOC
## useMouse

### Description
Tracks the mouse or touch position reactively. Returns the current x and y coordinates along with the source type.

### Parameters
#### Options
- **type** (UseMouseCoordType | UseMouseEventExtractor) - Optional - Mouse position based by page, client, screen, or relative to previous position. Default: 'page'.
- **target** (MaybeRefOrGetter) - Optional - Listen events on target element. Default: 'Window'.
- **touch** (boolean) - Optional - Listen to touchmove events. Default: true.
- **scroll** (boolean) - Optional - Listen to scroll events on window. Default: true.
- **resetOnTouchEnds** (boolean) - Optional - Reset to initial value when touchend event fired. Default: false.
- **initialValue** (Position) - Optional - Initial values.

### Response
- **x** (ShallowRef<number>) - Current X coordinate.
- **y** (ShallowRef<number>) - Current Y coordinate.
- **sourceType** (ShallowRef<UseMouseSourceType>) - The source of the event (mouse, touch, or null).
```

--------------------------------

### Initialize useWakeLock

Source: https://vueuse.org/core/usewakelock

Basic implementation of the useWakeLock hook to manage screen wake lock state.

```typescript
import { 
useWakeLock
 } from '@vueuse/core'

const { 
isSupported
, 
isActive
, 
forceRequest
, 
request
, 
release
 } = 
useWakeLock
()
```

--------------------------------

### Listen To Multiple Keys

Source: https://vueuse.org/core/onKeyStroke

Configure `onKeyStroke` to listen for an array of keys or all keys.

```APIDOC
## Listen To Multiple Keys

### Usage
```typescript
import { onKeyStroke } from '@vueuse/core'

// Listen to specific multiple keys
onKeyStroke(['s', 'S', 'ArrowDown'], (e) => {
  e.preventDefault()
})

// Listen to all keys by passing `true` or skipping the key parameter
onKeyStroke(true, (e) => {
  e.preventDefault()
})

onKeyStroke((e) => {
  e.preventDefault()
})
```
```

--------------------------------

### useDark - Configuration Options

Source: https://vueuse.org/core/useDark

Illustrates how to configure useDark with custom selectors, attributes, and values for dark mode.

```APIDOC
## useDark - Configuration Options

### Description
Customize the behavior of `useDark` by providing configuration options, such as the target element, attribute to modify, and specific values for light and dark modes.

### Method
`useDark(options)`

### Endpoint
N/A (Composable Function)

### Parameters
#### Request Body
- **options** (object) - Optional configuration object.
  - **selector** (string) - The CSS selector for the target element. Defaults to `'html'`.
  - **attribute** (string) - The attribute to modify on the target element. Defaults to `'class'`.
  - **valueDark** (string) - The value to apply when dark mode is enabled. Defaults to `'dark'`.
  - **valueLight** (string) - The value to apply when dark mode is disabled. Defaults to `''`.
  - **onChanged** (function) - A custom handler for updates. Overrides default behavior.

### Request Example
```typescript
// Example using 'body' element and 'color-scheme' attribute
const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
})

// Example with a custom onChanged handler
const isDarkCustom = useDark({
  onChanged(dark) {
    // Custom logic to handle dark mode changes
    console.log('Dark mode is now:', dark)
  },
})
```

### Response
- **isDark** (WritableComputedRef<boolean>) - A reactive boolean indicating the current dark mode state.

### Response Example
```json
// The 'isDark' ref will be true or false based on the current mode and configuration.
// Example: false
```
```

--------------------------------

### useDevicePixelRatio API

Source: https://vueuse.org/core/usedevicepixelratio

This section details the `useDevicePixelRatio` composable, its usage, options, and return values.

```APIDOC
## useDevicePixelRatio 

### Description
Reactively track `window.devicePixelRatio`.

> NOTE: there is no event listener for `window.devicePixelRatio` change. So this function uses `Testing media queries programmatically (window.matchMedia)` applying the same mechanism as described in this example.

### Method
Composable Function

### Endpoint
N/A (Client-side composable)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage
```typescript
import { useDevicePixelRatio } from '@vueuse/core'

const { pixelRatio } = useDevicePixelRatio()
```

### Component Usage
```vue
<template>
  <UseDevicePixelRatio v-slot="{ pixelRatio }">
    Pixel Ratio: {{ pixelRatio }}
  </UseDevicePixelRatio>
</template>
```

### Type Declarations
```typescript
export interface UseDevicePixelRatioOptions extends ConfigurableWindow {}
export interface UseDevicePixelRatioReturn {
  pixelRatio: Readonly<ShallowRef<number>>
  stop: WatchStopHandle
}

/**
 * Reactively track `window.devicePixelRatio`.
 *
 * @see https://vueuse.org/useDevicePixelRatio
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useDevicePixelRatio(
  options?: UseDevicePixelRatioOptions,
): UseDevicePixelRatioReturn
```

### Response
#### Success Response (N/A - Composable)
- **pixelRatio** (Readonly<ShallowRef<number>>) - The current device pixel ratio.
- **stop** (WatchStopHandle) - A function to stop the reactivity.

#### Response Example
```json
{
  "pixelRatio": 1
}
```
```

--------------------------------

### useEventBus Basic Usage

Source: https://vueuse.org/core/useeventbus

Demonstrates how to create an event bus, listen for events, emit events, and unregister listeners using the `useEventBus` composable.

```APIDOC
## POST /api/users

### Description
This endpoint allows for the creation of a new user in the system.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of users to return.

#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address for the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (201)
- **id** (integer) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### MemoizeCache Interface

Source: https://vueuse.org/core/useMemoize

Defines the interface for a custom cache mechanism that can be passed to useMemoize. It includes methods for getting, setting, checking existence, deleting, and clearing cache entries.

```typescript
export interface MemoizeCache<Key, Value> {
  /**
   * Get value for key
   */
  get: (key: Key) => Value | undefined
  /**
   * Set value for key
   */
  set: (key: Key, value: Value) => void
  /**
   * Return flag if key exists
   */
  has: (key: Key) => boolean
  /**
   * Delete value for key
   */
  delete: (key: Key) => void
  /**
   * Clear cache
   */
  clear: () => void
}
```

```javascript
export {}
```

--------------------------------

### useIpcRenderer Available Methods

Source: https://vueuse.org/electron/useipcrenderer

Lists the available methods exposed by the ipcRenderer object through the useIpcRenderer composable.

```APIDOC
## Available Methods 

### Description
These methods are available on the `ipcRenderer` object returned by `useIpcRenderer`.

### Methods
| Method                      | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `on(channel, listener)`     | Listen to channel. Auto-removes listener on unmount. |
| `once(channel, listener)`   | Listen to channel once                            |
| `removeListener(channel, listener)` | Remove specific listener                          |
| `removeAllListeners(channel)` | Remove all listeners for channel                  |
| `send(channel, ...args)`    | Send async message to main process                |
| `invoke(channel, ...args)`  | Send message and get response as `ShallowRef`     |
| `sendSync(channel, ...args)`| Send sync message and get response as `ShallowRef`|
| `postMessage(channel, message, transfer?)` | Send message with transferable objects            |
| `sendTo(webContentsId, channel, ...args)` | Send to specific webContents                      |
| `sendToHost(channel, ...args)` | Send to webview host                              |
```

--------------------------------

### Enable Reactive Mode for useMagicKeys

Source: https://vueuse.org/core/useMagicKeys

Set `reactive: true` in the options to get a reactive object instead of an object of refs. This is useful for direct use in Vue templates.

```typescript
const keys = useMagicKeys({ reactive: true })
```

```javascript
'use strict'
const keys = useMagicKeys({ reactive: true })
```

--------------------------------

### Manual Ref Management for Mounted State (JavaScript)

Source: https://vueuse.org/core/useMounted

This is the equivalent manual implementation of useMounted in JavaScript, using a ref and onMounted hook to track the mounted state.

```javascript
'use strict'
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
```

--------------------------------

### Track Caps Lock State

Source: https://vueuse.org/core/useKeyModifier

Import and use useKeyModifier to get a reactive ref for the Caps Lock key state. The initial value is null until the first event.

```typescript
import {
useKeyModifier
} from '@vueuse/core'

const capsLockState = 
useKeyModifier
('CapsLock')


console
.
log
(
capsLockState
.value
)

```

--------------------------------

### Use useIpcRendererInvoke in TypeScript

Source: https://vueuse.org/electron/useipcrendererinvoke

Example of using useIpcRendererInvoke with TypeScript. Ensure nodeIntegration is enabled if ipcRenderer is not explicitly provided. The result is a Ref that holds the response from the main process.

```typescript
import {
  useIpcRendererInvoke
} from '@vueuse/electron'
import {
  computed
} from 'vue'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const
result
=
useIpcRendererInvoke<string>('custom-channel', 'some data')
const
msg
=
computed(() =>
result.value?.msg)
```

--------------------------------

### Configure options

Source: https://vueuse.org/integrations/useAxios

Customize behavior such as immediate execution, shallow refs, and lifecycle callbacks.

```typescript
const { 
data
 } = useAxios('/api/posts', config, instance, {
  // Execute immediately (default: true if url provided)
  
immediate
: true,
  // Use shallowRef for data (default: true)
  
shallow
: true,
  // Abort previous request on new execute (default: true)
  
abortPrevious
: true,
  // Reset data before executing (default: false)
  
resetOnExecute
: false,
  // Initial data value
  
initialData
: [],
  // Callbacks
  
onSuccess
: 
data
 => 
console
.
log
('Success:', 
data
),
  
onError
: 
error
 => 
console
.
error
('Error:', 
error
),
  
onFinish
: () => 
console
.
log
('Finished'),
})
```

```javascript
'use strict'
const { data } = useAxios('/api/posts', config, instance, {
  // Execute immediately (default: true if url provided)
  immediate: true,
  // Use shallowRef for data (default: true)
  shallow: true,
  // Abort previous request on new execute (default: true)
  abortPrevious: true,
  // Reset data before executing (default: false)
  resetOnExecute: false,
  // Initial data value
  initialData: [],
  // Callbacks
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
  onFinish: () => console.log('Finished'),
})
```

--------------------------------

### Configurations: onBeforeChange and onChanged

Source: https://vueuse.org/shared/refWithControl

Details the configuration options `onBeforeChange` and `onChanged` for controlling value changes and reacting to them.

```APIDOC
## Configurations

### `onBeforeChange(value, oldValue)`

#### Description
A callback function executed before the ref's value changes. Returning `false` from this callback will prevent the change.

#### Parameters
- `value` (T): The new value being proposed.
- `oldValue` (T): The current value before the change.

#### Example
```typescript
const num = refWithControl(0, {
  onBeforeChange(value, oldValue) {
    // Disallow changes larger than ±5 in one operation
    if (Math.abs(value - oldValue) > 5)
      return false; // Dismiss the change
  },
})

num.value += 1
console.log(num.value) // 1

num.value += 6
console.log(num.value) // 1 (change dismissed)
```

### `onChanged(value, oldValue)`

#### Description
A callback function executed after the ref's value has changed. This provides a synchronous way to react to changes with less overhead than a standard watcher.

#### Parameters
- `value` (T): The new value after the change.
- `oldValue` (T): The previous value before the change.

#### Example
```typescript
const num = refWithControl(0, {
  onChanged(value, oldValue) {
    console.log(`Value changed from ${oldValue} to ${value}`);
  },
})

num.value = 10;
// Output: Value changed from 0 to 10
```
```

--------------------------------

### useCountdown Type Declarations

Source: https://vueuse.org/core/useCountdown

Examines the type definitions for `useCountdownOptions` and `useCountdownReturn`, including parameters like `interval`, `onComplete`, `onTick`, `immediate`, `remaining`, `reset`, `stop`, and `start`.

```typescript
export interface UseCountdownOptions extends ConfigurableScheduler {
  /**
   *  Interval for the countdown in milliseconds. Default is 1000ms.
   *
   * @deprecated Please use `scheduler` option instead
   */
  
interval
?: 
MaybeRefOrGetter
<number>
  /**
   * Callback function called when the countdown reaches 0.
   */
  
onComplete
?: () => void
  /**
   * Callback function called on each tick of the countdown.
   */
  
onTick
?: () => void
  /**
   * Start the countdown immediately
   *
   * @deprecated Please use `scheduler` option instead
   * @default false
   */
  
immediate
?: boolean
}
export interface UseCountdownReturn extends Pausable {
  /**
   * Current countdown value.
   */
  
remaining
: 
ShallowRef
<number>
  /**
   * Resets the countdown and repeatsLeft to their initial values.
   */
  
reset
: (
countdown
?: 
MaybeRefOrGetter
<number>) => void
  /**
   * Stops the countdown and resets its state.
   */
  
stop
: () => void
  /**
   * Reset the countdown and start it again.
   */
  
start
: (
countdown
?: 
MaybeRefOrGetter
<number>) => void
}
/**
 * Reactive countdown timer in seconds.
 *
 * @param initialCountdown
 * @param options
 *
 * @see https://vueuse.org/useCountdown
 */
export declare function 
useCountdown
(
  
initialCountdown
: 
MaybeRefOrGetter
<number>,
  
options
?: UseCountdownOptions,
): UseCountdownReturn

```

--------------------------------

### Basic usage of reactify

Source: https://vueuse.org/shared/reactify

Demonstrates converting a simple addition function into a reactive version that accepts shallowRefs.

```typescript
import { 
reactify
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

// a plain function
function 
add
(
a
: number, 
b
: number): number {
  return 
a
 + 
b

}

// now it accept refs and returns a computed ref
// (a: number | Ref<number>, b: number | Ref<number>) => ComputedRef<number>
const 
reactiveAdd
 = 
reactify
(
add
)

const 
a
 = 
shallowRef
(1)
const 
b
 = 
shallowRef
(2)
const 
sum
 = 
reactiveAdd
(
a
, 
b
)


console
.
log
(
sum
.
value
) // 3


a
.
value
 = 5


console
.
log
(
sum
.
value
) // 7
```

```javascript
import { reactify } from '@vueuse/core'
import { shallowRef } from 'vue'
// a plain function
function add(a, b) {
  return a + b
}
// now it accept refs and returns a computed ref
// (a: number | Ref<number>, b: number | Ref<number>) => ComputedRef<number>
const reactiveAdd = reactify(add)
const a = shallowRef(1)
const b = shallowRef(2)
const sum = reactiveAdd(a, b)
console.log(sum.value) // 3
a.value = 5
console.log(sum.value) // 7
```

--------------------------------

### useMediaQuery API

Source: https://vueuse.org/core/useMediaQuery

Documentation for the useMediaQuery composable.

```APIDOC
## useMediaQuery

### Description
Reactive Media Query. Once you've created a MediaQueryList object, you can check the result of the query or receive notifications when the result changes.

### Method
useMediaQuery

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage
```typescript
import { useMediaQuery } from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
```

### Server Side Rendering and Nuxt
If you are using `useMediaQuery` with SSR enabled, then you need to specify which screen size you would like to render on the server and before hydration to avoid an hydration mismatch.

```typescript
import { useMediaQuery } from '@vueuse/core'

const isLarge = useMediaQuery('(min-width: 1024px)', {
  ssrWidth: 768 // Will enable SSR mode and render like if the screen was 768px wide
})

console.log(isLarge.value) // always false because ssrWidth of 768px is smaller than 1024px

onMounted(() => {
  console.log(isLarge.value) // false if screen is smaller than 1024px, true if larger than 1024px
})
```

Alternatively you can set this up globally for your app using `provideSSRWidth`.

### Type Declarations
```typescript
/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export declare function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  options?: ConfigurableWindow & {
    ssrWidth?: number
  }
): ComputedRef<boolean>
```

### Response
#### Success Response (200)
Returns a `ComputedRef<boolean>` which is `true` if the media query matches, `false` otherwise.

#### Response Example
```json
{
  "isLargeScreen": true,
  "prefersDark": false
}
```
```

--------------------------------

### Configuring Animation Options

Source: https://vueuse.org/core/useAnimate

Illustrates how to pass an options object to control duration, lifecycle callbacks, and persistence.

```ts
import { 
useAnimate
 } from '@vueuse/core'


useAnimate
(el, keyframes, {
  
duration
: 1000,
  // Start playing immediately (default: true)
  
immediate
: true,
  // Commit the end styling state to the element (default: false)
  
commitStyles
: false,
  // Persist the animation (default: false)
  
persist
: false,
  // Callback when animation is initialized
  
onReady
(
animate
) {
    
console
.
log
('Animation ready', 
animate
)
  },
  // Callback when an error occurs
  
onError
(
e
) {
    
console
.
error
('Animation error', 
e
)
  },
})
```

--------------------------------

### Track Element Hover State with useElementHover

Source: https://vueuse.org/core/useelementhover

Use this composable to get a reactive boolean indicating if the mouse is currently hovering over the specified element. Requires importing `useElementHover` and `useTemplateRef`.

```vue
<script setup lang="ts">
import { 
useElementHover
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
myHoverableElement
 = 
useTemplateRef
('myHoverableElement')
const 
isHovered
 = 
useElementHover
(
myHoverableElement
)
</script>

<template>
  <
button
 
ref
="
myHoverableElement
">
    {{ 
isHovered
 }}
  </
button
>
</template>
```

--------------------------------

### Using flush: 'pre' option

Source: https://vueuse.org/shared/syncrefs

Demonstrates how setting the flush option to 'pre' delays the target update until the next tick.

```typescript
import { 
syncRefs
 } from '@vueuse/core'
import { 
nextTick
, 
shallowRef
 } from 'vue'

const 
source
 = 
shallowRef
('hello')
const 
target
 = 
shallowRef
('target')


syncRefs
( 
source
, 
target
, { 
flush
: 'pre' })


console
.
log
( 
target
.
value
) // hello


source
.
value
 = 'foo'


console
.
log
( 
target
.
value
) // hello <- still unchanged, because of flush 'pre'

await 
nextTick
()


console
.
log
( 
target
.
value
) // foo <- changed!
```

--------------------------------

### JavaScript Basic Key Monitoring

Source: https://vueuse.org/core/useMagicKeys

JavaScript equivalent for basic key monitoring. Use `watch` or `watchEffect` to react to key presses.

```javascript
'use strict'
const { shift, space, a } = useMagicKeys()
watch(
  () => space?.value,
  (v) => {
    if (v) console.log('space has been pressed')
  },
)
watchEffect(() => {
  if (shift?.value && a?.value) console.log('Shift + A have been pressed')
})
```

--------------------------------

### useExtractedObservable Basic Usage

Source: https://vueuse.org/rxjs/useextractedobservable

This example demonstrates the basic usage of `useExtractedObservable` to extract values from an RxJS Observable and expose them as a Vue ref. It automatically handles unsubscription when the component unmounts.

```APIDOC
## useExtractedObservable 

### Description
Use an RxJS `Observable` as extracted from one or more composables, return a `ref`, and automatically unsubscribe from it when the component is unmounted.

### Method
`useExtractedObservable`

### Parameters
#### Source
- **source** (Ref<any> | `any`) - The source to watch. When it changes, the observable will be re-created.

#### Observable Factory
- **observableFactory** (`(state: any) => Observable<T>`) - A function that returns an RxJS Observable.

#### Options
- **options** (`{ initialValue?: T, onError?: (err: any) => void, onComplete?: () => void }`) - Optional configuration object.
  - **initialValue** (`T`) - Value to use before the Observable emits.
  - **onError** (`(err: any) => void`) - Error handler for Observable errors.
  - **onComplete** (`() => void`) - Called when the Observable completes.

#### Watch Options
- **watchOptions** (`WatchOptions`) - Optional Vue `watch` options.

### Return Value
Returns a readonly `ShallowRef` containing the latest value emitted by the extracted Observable.

### Usage Examples

#### Basic Usage (TypeScript)
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import ObservableSocket from 'observable-socket'
import { computed } from 'vue'
import { makeSocket, useUser } from '../some/lib/func'

// setup()
const user = useUser()
const lastMessage = useExtractedObservable(user, u => ObservableSocket.create(makeSocket(u.id)).down)
```

#### Basic Usage (JavaScript)
```javascript
import { useExtractedObservable } from '@vueuse/rxjs'
import ObservableSocket from 'observable-socket'
import { makeSocket, useUser } from '../some/lib/func'

// setup()
const user = useUser()
const lastMessage = useExtractedObservable(
  user,
  (u) => ObservableSocket.create(makeSocket(u.id)).down,
)
```

#### Custom Error Handling (TypeScript)
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, tap } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      tap((n) => {
        if (n === 10)
          throw new Error('oops')
      })
    )
  },
  {
    onError: (err) => {
      console.log(err.message) // "oops"
    },
  }
)
```

#### Custom Completion Handling (TypeScript)
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {
    onComplete: () => {
      console.log('Done!')
    },
  }
)
```

#### Passing Watch Options (TypeScript)
```typescript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef<number>()

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {},
  {
    immediate: false
  }
)
```

#### Passing Watch Options (JavaScript)
```javascript
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'
import { shallowRef } from 'vue'

// setup()
const start = shallowRef()
const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile((num) => num < 10),
    )
  },
  {},
  {
    immediate: false,
  },
)
```
```

--------------------------------

### useWebSocket Configuration Options

Source: https://vueuse.org/core/useWebSocket

Details various configuration options for useWebSocket, including immediate connection, auto-connect, auto-close, auto-reconnect, and heartbeat.

```APIDOC
## useWebSocket Configuration Options

### Description
Provides details on advanced configuration options for `useWebSocket`, including `immediate`, `autoConnect`, `autoClose`, `autoReconnect`, and `heartbeat`.

### Options
- **immediate** (boolean): Establish the connection immediately when the composable is called. Enabled by default.
- **autoConnect** (boolean): If the URL is a ref, automatically reconnect when the URL changes. Enabled by default.
- **autoClose** (boolean): Automatically call `close()` when the `beforeunload` event is triggered or the effect scope is stopped. Enabled by default.

### autoReconnect
- **autoReconnect** (boolean | object): Reconnect on errors automatically (disabled by default).
  - If `true`, uses default reconnection settings.
  - If an object, allows customization:
    - **retries** (number): The number of retries before giving up.
    - **delay** (number | function): The delay in milliseconds before the next retry. Can be a function that accepts the retry count and returns the delay.
    - **onFailed** (function): A callback function executed when all retries have failed.

### heartbeat
- **heartbeat** (boolean | object): Send a heartbeat message periodically to keep the connection active.
  - If `true`, uses default heartbeat settings.
  - If an object, allows customization:
    - **message** (string): The message to send as a heartbeat.
    - **scheduler** (function): A function that takes a callback and a delay, and schedules the callback to be called repeatedly (e.g., `useIntervalFn`).
    - **pongTimeout** (number): The timeout in milliseconds to wait for a pong response after sending a heartbeat.

### Request Example (autoReconnect enabled)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: true,
})
```

### Request Example (custom autoReconnect)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert('Failed to connect WebSocket after 3 retries')
    },
  },
})
```

### Request Example (exponential backoff delay)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 5,
    delay: retries => Math.min(1000 * 2 ** (retries - 1), 30000),
  },
})
```

### Request Example (linear backoff delay)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 5,
    delay: retries => retries * 1000,
  },
})
```

### Request Example (heartbeat enabled)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: true,
})
```

### Request Example (custom heartbeat)
```typescript
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: {
    message: 'ping',
    scheduler: cb => useIntervalFn(cb, 2000),
    pongTimeout: 1000,
  },
})
```

### Response
#### Success Response (Connection with options)
- **status** (Ref<'OPEN' | 'CONNECTING' | 'CLOSED'>) - Connection status
- **data** (Ref<any>) - Latest received data
- **close** (Function) - Function to close the connection

#### Response Example
```json
{
  "status": "OPEN",
  "data": "Latest message data",
  "close": "function"
}
```
```

--------------------------------

### Initialize and Use Firestore Bindings

Source: https://vueuse.org/firebase/usefirestore

Import necessary functions from Firebase and VueUse. Initialize Firebase app and Firestore. Use `useFirestore` with collection or document references. Supports reactive queries using computed properties and refs.

```typescript
import {
  useFirestore
} from '@vueuse/firebase/useFirestore'
import {
  initializeApp
} from 'firebase/app'
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query
} from 'firebase/firestore'
import {
  computed,
  shallowRef
} from 'vue'

const app = initializeApp({
  projectId: 'MY PROJECT ID'
})
const db = getFirestore(app)

const todos = useFirestore(collection(db, 'todos'))

// or for doc reference
const user = useFirestore(doc(db, 'users', 'my-user-id'))

// you can also use ref value for reactive query
const postsLimit = shallowRef(10)
const postsQuery = computed(() =>
  query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(postsLimit.value)
  )
)
const posts = useFirestore(postsQuery)

// you can use the boolean value to tell a query when it is ready to run
// when it gets falsy value, return the initial value
const userId = shallowRef('')
const userQuery = computed(() =>
  userId.value &&
  doc(db, 'users', userId.value)
)
const userData = useFirestore(userQuery, null)
```

--------------------------------

### Get Parent Element of Current Component

Source: https://vueuse.org/core/useParentElement

When no argument is passed, `useParentElement` returns the parent element of the current component. Ensure the component is mounted before accessing the parent element's value.

```vue
<script setup lang="ts">
import {
  useParentElement
} from '@vueuse/core'

const parentEl = 
useParentElement
()

onMounted(() => {
  console.log(parentEl.value)
})
</script>
```

--------------------------------

### useQRCode Composable

Source: https://vueuse.org/integrations/useQRCode

Documentation for the useQRCode function which generates a reactive QR code data URL.

```APIDOC
## useQRCode

### Description
Wrapper for the qrcode library to generate QR codes as reactive data URLs.

### Parameters
- **text** (MaybeRefOrGetter<string>) - Required - The text content to encode into the QR code.
- **options** (QRCode.QRCodeToDataURLOptions) - Optional - Configuration options for the QR code generation.

### Returns
- **ShallowRef<string, string>** - A reactive reference containing the QR code data URL.

### Usage Example
```ts
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { shallowRef } from 'vue'

const text = shallowRef('text-to-encode')
const qrcode = useQRCode(text)
```
```

--------------------------------

### Conditionally Disabling Magic Keys with `useActiveElement` and `logicAnd`

Source: https://vueuse.org/core/useMagicKeys

Prevent magic keys from triggering when focus is on input elements. This example uses `useActiveElement` and `logicAnd` from `@vueuse/math` to create a conditional watcher.

```typescript
import {
  useActiveElement,
  useMagicKeys,
  whenever
} from '@vueuse/core'
import { logicAnd } from '@vueuse/math'

const activeElement = 
useActiveElement
()
const notUsingInput = 
computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA')

const { tab } = 
useMagicKeys
()


whenever(
  logicAnd(
    tab,
    notUsingInput
  ), () => {
  console.log('Tab has been pressed outside of inputs!')
})
```

--------------------------------

### useAxios with Axios Instance

Source: https://vueuse.org/integrations/useaxios

Use useAxios with a pre-configured axios instance. This is useful for setting base URLs or other instance-specific configurations.

```typescript
import {
useAxios
} from '@vueuse/integrations/useAxios'
import 
axios
 from 'axios'

const 
instance
 =
axios
.
create
({
 aseURL
: '/api',
})

const { 
data
,
isFinished
 } = 
useAxios
('/posts', 
instance
)
```

--------------------------------

### Define Breakpoints with Tailwind Presets

Source: https://vueuse.org/core/usebreakpoints

Import and use the `breakpointsTailwind` preset to define breakpoints based on Tailwind CSS conventions. This setup is useful for creating responsive logic in your Vue application.

```typescript
import {
  breakpointsTailwind,
  useBreakpoints
} from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const largerThanSm = breakpoints.greater('sm') // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
```

--------------------------------

### Basic Usage of refWithControl

Source: https://vueuse.org/shared/refWithControl

Demonstrates how to use refWithControl to manually control reactivity tracking and triggering.

```typescript
import { 
refWithControl
 } from '@vueuse/core'

const 
num
 = 
refWithControl
(0)
const 
doubled
 = 
computed
(() => 
num
.
value
 * 2)

// just like normal ref

num
.
value
 = 42

console
.
log
(
num
.
value
) // 42

console
.
log
(
doubled
.
value
) // 84

// set value without triggering the reactivity

num
.
set
(30, false)

console
.
log
(
num
.
value
) // 30

console
.
log
(
doubled
.
value
) // 84 (doesn't update)

// get value without tracking the reactivity

watchEffect
(() => {
  
console
.
log
(
num
.
peek
())
}) // 30


num
.
value
 = 50 // watch effect wouldn't be triggered since it collected nothing.

console
.
log
(
doubled
.
value
) // 100 (updated again since it's a reactive set)
```

--------------------------------

### watchIgnorable Usage

Source: https://vueuse.org/shared/watchignorable

Demonstrates the basic usage of watchIgnorable, showing how to watch a source, log changes, and use ignoreUpdates to prevent certain updates from triggering the callback.

```APIDOC
## POST /watchIgnorable

### Description
Extended `watch` that returns extra `ignoreUpdates(updater)` and `ignorePrevAsyncUpdates()` to ignore particular updates to the source.

### Method
POST

### Endpoint
/watchIgnorable

### Parameters
#### Query Parameters
- **source** (Ref<T> | MultiWatchSources<T> | T) - Required - The source to watch.
- **cb** (WatchCallback<T, Immediate extends true ? T | undefined : T>) - Required - The callback function to execute when the source changes.
- **options** (WatchWithFilterOptions<Immediate>) - Optional - Options for the watcher, similar to Vue's native watch options.

### Request Body
```json
{
  "source": "foo",
  "cb": "v => console.log(`Changed to ${v}!")"
}
```

### Response
#### Success Response (200)
- **stop** (WatchStopHandle) - A function to stop the watcher.
- **ignoreUpdates** (IgnoredUpdater) - A function to ignore subsequent updates.
- **ignorePrevAsyncUpdates** (IgnoredPrevAsyncUpdates) - A function to ignore previous asynchronous updates.

#### Response Example
```json
{
  "stop": "() => void",
  "ignoreUpdates": "(updater: () => void) => void",
  "ignorePrevAsyncUpdates": "() => void"
}
```
```

--------------------------------

### Basic useFetch Usage

Source: https://vueuse.org/core/useFetch

Import and use useFetch by providing a URL. It returns fetching status, error, and data.

```typescript
import {
useFetch
} from '@vueuse/core'

const { 
isFetching
, 
error
, 
data
 } = 
useFetch
(url)
```

--------------------------------

### Access Sortable Instance Methods via Component Slot

Source: https://vueuse.org/integrations/usesortable

Access `start`, `stop`, and `option` methods from the `UseSortable` component's slot scope to programmatically control the sorting behavior.

```vue
<template>
  <UseSortable v-slot="{ 
stop
, 
start
 }"
 

v-model
="list">
    <
button
 @
click
="
stop
()">
      Stop Sorting
    </
button
>
    <
button
 @
click
="
start
()">
      Start Sorting
    </
button
>
    <
div
 v-for="
item
 in list"
 :key="
item
.id">
      {{ 
item
.name }}
    </
div
>
  </UseSortable>
</template>
```

--------------------------------

### Sortable Component Slot Scope

Source: https://vueuse.org/integrations/useSortable

Access helper functions like `start`, `stop`, and `option` directly from the `UseSortable` component's slot scope to control sorting behavior programmatically.

```vue
<template>
  <UseSortable v-slot="{ 
stop
,
start
 }"
 v-model
="list">
    <
button
 @
click
="
stop
()">
      Stop Sorting
    </
button
>
    <
button
 @
click
="
start
()">
      Start Sorting
    </
button
>
    <
div
 v-for="
item
 in list"
 :key="
item
.id">
      {{ 
item
.name }}
    </
div
>
  </UseSortable>
</template>
```

--------------------------------

### Import useAxios from Submodule

Source: https://vueuse.org/integrations/README

For optimal tree-shaking, import composables like useAxios directly from their respective submodules.

```typescript
import { useAxios } from '@vueuse/integrations/useAxios'
```

--------------------------------

### Sync Two Refs Unidirectionally (Right to Left)

Source: https://vueuse.org/shared/syncref

This example demonstrates one-directional synchronization from the right ref to the left ref ('rtl' direction). Changes in 'b' will update 'a', but changes in 'a' will not affect 'b'.

```typescript
import {
  syncRef
} from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = syncRef(a, b, { direction: 'rtl' })

```

--------------------------------

### useAsyncQueue Options

Source: https://vueuse.org/core/useAsyncQueue

Explains the various options available for configuring useAsyncQueue, including interrupt on failure, callbacks, and abort signals.

```APIDOC
## useAsyncQueue Options

### Description
Configures the behavior of the asynchronous task queue.

### Method
`useAsyncQueue`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Options
- **interrupt** (boolean) - Optional - If `true`, tasks will stop executing when a task fails. Defaults to `true`.
- **onError** (function) - Optional - A callback function executed when any task in the queue fails.
- **onFinished** (function) - Optional - A callback function executed when all tasks in the queue have completed or been interrupted.
- **signal** (AbortSignal) - Optional - An `AbortSignal` that can be used to cancel the queue execution.

### Request Example (Interrupt on Failure)
```typescript
const { result } = useAsyncQueue([p1, p2], {
  interrupt: false, // continue even if p1 fails
})
```

### Request Example (Callbacks)
```typescript
const { result } = useAsyncQueue([p1, p2], {
  onError() {
    console.log('A task failed')
  },
  onFinished() {
    console.log('All tasks completed (or interrupted)')
  },
})
```

### Request Example (Abort Signal)
```typescript
const controller = new AbortController()

const { result } = useAsyncQueue([p1, p2], {
  signal: controller.signal,
})

// Later, abort the queue
controller.abort()
```

### Response
#### Success Response (200)
- **result** (Array<UseAsyncQueueResult<any>>) - An array containing the state and data of each task.

#### Response Example
```json
{
  "result": [
    { "state": "fulfilled", "data": 1000 },
    { "state": "fulfilled", "data": 2000 }
  ]
}
```
```

--------------------------------

### Apply reactify to an object

Source: https://vueuse.org/shared/reactifyobject

Use `reactifyObject` to make object properties reactive. This example shows how to reactify the `console` object, allowing you to use its methods with reactive references without needing `.value`.

```typescript
import {
 reactifyObject
} from '@vueuse/core'

const reactifiedConsole =
 reactifyObject(console)

const a = ref('42')

reactifiedConsole.log(a) // no longer need .value
```

--------------------------------

### Testing Commands

Source: https://vueuse.org/contributing

Commands for running unit tests and browser-based tests.

```bash
pnpm test:unit # to run unit tests
```

```bash
npx playwright install --with-deps
```

```bash
pnpm test:browser
```

--------------------------------

### Extend Watch Options with Debounce in watchDebounced

Source: https://vueuse.org/guidelines

When using `watch` or `watchEffect` internally, make options like `immediate` and `flush` configurable. This example shows `watchDebounced` extending `WatchOptions` with a `debounce` property.

```typescript
import type { WatchOptions } from 'vue'

// extend the watch options
export interface WatchDebouncedOptions extends WatchOptions {
  debounce?: number
}

export function watchDebounced(
  source: any,
  cb: any,
  options: WatchDebouncedOptions = {},
): WatchHandle {
  return watch(
    source,
    () => { /* ... */ },
    options, // pass watch options
  )
}
```

--------------------------------

### Initialize useThrottledRefHistory

Source: https://vueuse.org/core/usethrottledrefhistory

Import and use useThrottledRefHistory with a ref and options. The history will be updated with a throttle of 1000ms.

```typescript
import {
useThrottledRefHistory
} from '@vueuse/core'
import {
shallowRef
} from 'vue'

const counter = shallowRef(0)
const { history, undo, redo } = useThrottledRefHistory(counter, { deep: true, throttle: 1000 })

```

--------------------------------

### Trigger device vibration with useVibrate

Source: https://vueuse.org/core/usevibrate

Demonstrates how to initialize the vibration pattern and manually control the vibration state.

```typescript
import { 
useVibrate
 } from '@vueuse/core'

// This vibrates the device for 300 ms
// then pauses for 100 ms before vibrating the device again for another 300 ms:
const { 
vibrate
, 
stop
, 
isSupported
 } = 
useVibrate
({ 
pattern
: [300, 100, 300] })

// Start the vibration, it will automatically stop when the pattern is complete:

vibrate
()

// But if you want to stop it, you can:

stop
()
```

--------------------------------

### Programmatically change focus state

Source: https://vueuse.org/core/usefocus

Control the focus state of an input element by updating the `focused` ref. This example uses a button click to set `focused` to `true`, which in turn focuses the input.

```vue
<script setup lang="ts">
import { 
useFocus
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
input
 = 
shallowRef
()
const { 
focused
 } = 
useFocus
(
input
)
< 
/script>

<template>
  <
div
>
    <
button
 
type
="button" @
click
="
focused
 = true">
      Click me to focus input below
    </
button
>
    <
input
 
ref
="
input
" 
type
="text">
  </
div
>
</template>

```

--------------------------------

### Control focus state with a button click

Source: https://vueuse.org/core/useFocus

This example demonstrates how to change the focus state of an input element by clicking a button. It utilizes the `focused` ref returned by `useFocus` to programmatically set focus.

```vue
<script setup lang="ts">
import { 
useFocus
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
input
 =
shallowRef()
const { 
focused
 } =
useFocus(
input
)
</script>

<template>
  <div >
    <button 
type="button" @
click
="
focused
 = true">
      Click me to focus input below
    </button>
    <input 
ref
="
input
" 
type="text">
  </div>
</template>

```

--------------------------------

### Using Global State in a Vue Component

Source: https://vueuse.org/shared/createGlobalState

This snippet shows how to consume the global state defined by useGlobalState within a Vue component's setup function. The state is directly accessible and reactive.

```typescript
import {
  useGlobalState
} from './store'

export default
  defineComponent({
    
setup
() {
      const
        state
        =
        useGlobalState()
      return { state }
    },
  })

```

--------------------------------

### Basic Usage of useDraggable

Source: https://vueuse.org/core/useDraggable

Demonstrates how to initialize useDraggable with a template reference and apply the resulting style to an element.

```vue
<script setup lang="ts">
import { 
useDraggable
 } from '@vueuse/core'
import { 
useTemplateRef
 } from 'vue'

const 
el
 = 
useTemplateRef
('el')

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { 
x
, 
y
, 
style
 } = 
useDraggable
(
el
, {
  
initialValue
: { 
x
: 40, 
y
: 40 },
})
</script>

<template>
  <
div
 
ref
="
el
" 
:style
="
style
" 
style
="position: fixed">
    Drag me! I am at {{ 
x
 }}, {{ 
y
 }}
  </
div
>
</template>
```

--------------------------------

### Transitioning Non-numeric Values with Custom Interpolation

Source: https://vueuse.org/core/usetransition

Use a custom interpolation function for transitioning complex values like Three.js Quaternions. The interpolation function receives the start, end, and progress values.

```typescript
import { Quaternion } from 'three'

const source = ref(new Quaternion())

const output = useTransition(source, {
  interpolation: (q1, q2, t) => new Quaternion().slerpQuaternions(q1, q2, t)
})
```

--------------------------------

### Configure Breakpoint Strategy

Source: https://vueuse.org/core/useBreakpoints

Control how shortcut properties behave by setting the `strategy` option. 'min-width' (default) is mobile-first, while 'max-width' is desktop-first.

```ts
const 
breakpoints
 = useBreakpoints(breakpointsTailwind, {
  
strategy
: 'max-width', // desktop-first
})
```

```js
'use strict'
const breakpoints = useBreakpoints(breakpointsTailwind, {
  strategy: 'max-width', // desktop-first
})
```

--------------------------------

### Use RxJS Subscription with Auto-Unsubscribe

Source: https://vueuse.org/rxjs/usesubscription

Use this composable to manage RxJS subscriptions. It automatically calls the `unsubscribe` method before the component unmounts, preventing memory leaks. Ensure you have `@vueuse/rxjs` installed and RxJS imported.

```typescript
import { useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'

const count = ref(0)

// useSubscription call unsubscribe method before unmount the component
useSubscription(
  interval(1000)
    .subscribe(() => {
      count.value++
      console.log(count)
    }),
)
```

--------------------------------

### Throttle Function Execution

Source: https://vueuse.org/shared/useThrottleFn

Import and use `useThrottleFn` to create a throttled version of your function. The throttled function will be called at most once per the specified millisecond delay. This example shows how to throttle a resize event handler.

```typescript
import {
useThrottleFn
} from '@vueuse/core'

const
throttledFn
 = 
useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

useEventListener(
window
, 'resize',
throttledFn
)
```

--------------------------------

### Usage of toObserver with VueUse

Source: https://vueuse.org/rxjs/toObserver

Demonstrates converting a ref into an RxJS observer within a subscription.

```typescript
import { from, fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { map, mapTo, startWith, takeUntil, withLatestFrom } from 'rxjs/operators'
import { shallowRef, useTemplateRef } from 'vue'

const count = shallowRef(0)
const button = useTemplateRef('buttonRef')

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([curr, total]) => curr + total),
    )
    .subscribe(toObserver(count)), // same as ).subscribe(val => (count.value = val))
)
```

```javascript
import { from, fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import {
  map,
  mapTo,
  startWith,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { shallowRef, useTemplateRef } from 'vue'
const count = shallowRef(0)
const button = useTemplateRef('buttonRef')
useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([curr, total]) => curr + total),
    )
    .subscribe(toObserver(count)),
)
```

--------------------------------

### Implement a simple virtual list

Source: https://vueuse.org/core/useVirtualList

Initializes a virtual list with a fixed item height. Ensure the itemHeight matches the actual rendered row height to prevent layout issues.

```ts
import { 
useVirtualList
 } from '@vueuse/core'

const { 
list
, 
containerProps
, 
wrapperProps
 } = 
useVirtualList
(
  
Array
.
from
(
Array
.
from
({ 
length
: 99999 }).
keys
()),
  {
    // Keep `itemHeight` in sync with the item's row.
    
itemHeight
: 22,
  },
)
```

--------------------------------

### Define Custom Breakpoints with useBreakpoints

Source: https://vueuse.org/core/useBreakpoints

Define custom breakpoints for your application using an object mapping breakpoint names to pixel values. This example shows how to create breakpoints for mobile, tablet, laptop, and desktop.

```vue
<script setup lang="ts">
import { 
useBreakpoints
 } from '@vueuse/core'

const 
breakpoints
 = 
useBreakpoints
({
  
mobile
: 0, // optional
  
tablet
: 640,
  
laptop
: 1024,
  
desktop
: 1280,
})

// Can be 'mobile' or 'tablet' or 'laptop' or 'desktop'
const 
activeBreakpoint
 = 
breakpoints
.
active
()

// true or false
const 
laptop
 = 
breakpoints
.
between
('laptop', 'desktop')
</script>

<template>
  <
div
 
:class
="
activeBreakpoint
">
    ...
  </
div>
</template>
```

--------------------------------

### Provide SSR Width in Root Component

Source: https://vueuse.org/core/useSSRWidth

Alternatively, provide the SSR width directly within your root component's setup. This method is simpler if you don't need to pass the app instance explicitly.

```vue
<script setup lang="ts">
import { 
provideSSRWidth
 } from '@vueuse/core'


provideSSRWidth
(500)
</script>

```

--------------------------------

### useElementVisibility - Options (rootMargin, threshold)

Source: https://vueuse.org/core/useelementvisibility

Customize the visibility tracking with `rootMargin` to trigger callbacks sooner and `threshold` to control the visibility percentage required.

```APIDOC
## useElementVisibility with Options

### Description
Customize the visibility tracking using `rootMargin` and `threshold` options.

### Method
Composition API function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
// With rootMargin
const targetIsVisible = useElementVisibility(target, {
  rootMargin: '0px 0px 100px 0px',
})

// With threshold
const targetIsVisible = useElementVisibility(target, {
  threshold: 1.0, // 100% visible
})
```

### Response
#### Success Response (N/A - Returns a Ref)
- **targetIsVisible** (ShallowRef<boolean>) - A ref that is true when the element is visible based on the provided options, false otherwise.

#### Response Example
```json
{
  "isVisible": true
}
```
```

--------------------------------

### Configure useStorage Options

Source: https://vueuse.org/core/usestorage

Provides the available configuration options for useStorage, including deep watching, storage event listening, and error handling.

```typescript
useStorage('key', defaults, storage, {
  // Watch for deep changes in objects/arrays (default: true)
  
deep
: true,
  // Sync across tabs via storage events (default: true)
  
listenToStorageChanges
: true,
  // Write default value to storage if not present (default: true)
  
writeDefaults
: true,
  // Use shallowRef instead of ref (default: false)
  
shallow
: false,
  // Initialize only after component is mounted (default: false)
  
initOnMounted
: false,
  // Custom error handler (default: console.error)
  
onError
: 
e
 => 
console
.
error
(
e
),
  // Watch flush timing (default: 'pre')
  
flush
: 'pre',
})
```

```javascript
'use strict'
useStorage('key', defaults, storage, {
  // Watch for deep changes in objects/arrays (default: true)
  deep: true,
  // Sync across tabs via storage events (default: true)
  listenToStorageChanges: true,
  // Write default value to storage if not present (default: true)
  writeDefaults: true,
  // Use shallowRef instead of ref (default: false)
  shallow: false,
  // Initialize only after component is mounted (default: false)
  initOnMounted: false,
  // Custom error handler (default: console.error)
  onError: (e) => console.error(e),
  // Watch flush timing (default: 'pre')
  flush: 'pre',
})
```

--------------------------------

### Initialize useRouteQuery

Source: https://vueuse.org/router/useroutequery

Import and use useRouteQuery to create a reactive reference linked to a URL query parameter. You can provide an initial value or a default value.

```typescript
import {
  useRouteQuery
} from '@vueuse/router'

const search = 
useRouteQuery
('search')

const search = 
useRouteQuery
('search', 'foo') // or with a default value

const page = 
useRouteQuery
('page', '1', { 
  transform: 
Number
 })

console.log(search.value) // route.query.search

search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })

```

--------------------------------

### Use Tailwind Breakpoints with useBreakpoints

Source: https://vueuse.org/core/useBreakpoints

Utilize the predefined Tailwind CSS breakpoints with the useBreakpoints composable. This example demonstrates creating reactive refs for various breakpoint conditions like 'sm and larger' or 'larger than sm'.

```ts
import { 
breakpointsTailwind
,
useBreakpoints
 } from '@vueuse/core'

const 
breakpoints
 = 
useBreakpoints
(
breakpointsTailwind
)

const 
smAndLarger
 = 
breakpoints
.
greaterOrEqual
('sm') // sm and larger
const 
largerThanSm
 = 
breakpoints
.
greater
('sm') // only larger than sm
const 
lgAndSmaller
 = 
breakpoints
.
smallerOrEqual
('lg') // lg and smaller
const 
smallerThanLg
 = 
breakpoints
.
smaller
('lg') // only smaller than lg
```

--------------------------------

### Handling Cancellation with computedAsync

Source: https://vueuse.org/core/computedAsync

Implement cancellation logic for previous async operations when the computed source changes. This example uses AbortController with the fetch API. The `onCancel` function is provided by `computedAsync` to register cleanup callbacks.

```typescript
import {
  computedAsync
} from '@vueuse/core'
import {
  shallowRef
} from 'vue'

const packageName = shallowRef('@vueuse/core')

const downloads = computedAsync(async (onCancel) => {
  const abortController = new AbortController()

  onCancel(() => abortController.abort())

  return await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${packageName.value}`,
    { signal: abortController.signal },
  )
    .then(response => response.ok ? response.json() : { downloads: '—' })
    .then(result => result.downloads)
}, 0)
```

--------------------------------

### useAxios Manual Execution

Source: https://vueuse.org/integrations/useAxios

Explains how to manually trigger requests using the `execute` function returned by useAxios.

```APIDOC
## useAxios Manual Execution

### Description
This section covers how to use the `execute` function to control when the HTTP request is made, useful for scenarios where the request should not fire immediately upon component mount.

### Method
GET (or as specified in config)

### Endpoint
`/api/posts` (or any specified URL)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { execute } = useAxios()

// To execute the request:
execute('/api/posts')

// Or with config:
execute('/api/posts', { method: 'POST' })

// Execute with params:
execute({ params: { key: 1 } })

// Execute with config and options:
const { execute } = useAxios(url1, { method: 'GET' }, { immediate: false })
execute({ params: { key: 1 } })
```

### Response
#### Success Response (200)
- **data** (Ref<T>) - Response data
- **isFinished** (Ref<boolean>) - Request has completed (success or error)

#### Response Example
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
```

--------------------------------

### Waiting for Multiple Storages

Source: https://vueuse.org/core/usestorageasync

Demonstrates how to use `Promise.allSettled` to wait for multiple `useStorageAsync` instances to be ready before proceeding.

```APIDOC
## PUT /api/users/{id}

### Description
Updates an existing user.

### Method
PUT

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (integer) - Required - The unique identifier of the user to update.

#### Request Body
- **name** (string) - Optional - The updated name of the user.
- **email** (string) - Optional - The updated email address of the user.

### Request Example
```json
{
  "name": "Jane Doe"
}
```

### Response
#### Success Response (200)
- **id** (integer) - The unique identifier for the user.
- **name** (string) - The updated name of the user.
- **email** (string) - The updated email address of the user.
- **updatedAt** (string) - The timestamp when the user was last updated.

#### Response Example
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "john.doe@example.com",
  "updatedAt": "2023-10-27T11:00:00Z"
}
```
```

--------------------------------

### useNProgress Basic Usage

Source: https://vueuse.org/integrations/useNProgress

This snippet demonstrates the basic usage of the useNProgress composable to control the progress bar's loading state.

```APIDOC
## useNProgress Basic Usage

### Description
This example shows how to use the `useNProgress` composable to toggle the loading state of the progress bar.

### Method
`useNProgress`

### Endpoint
N/A (Composable function)

### Parameters
None for basic usage.

### Request Example
```typescript
import { useNProgress } from '@vueuse/integrations/useNProgress'

const { isLoading } = useNProgress()

function toggle() {
  isLoading.value = !isLoading.value
}
```

### Response
- **isLoading** (WritableComputedRef<boolean, boolean>) - A computed ref that controls the visibility and state of the progress bar.

### Response Example
```json
{
  "isLoading": true
}
```
```

--------------------------------

### useEyeDropper API

Source: https://vueuse.org/core/useeyedropper

The useEyeDropper composable provides a reactive interface to the browser's EyeDropper API. It allows you to open the color picker and get the selected color in sRGBHex format. It also includes a check for browser support.

```APIDOC
## useEyeDropper

### Description
Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API) for selecting colors.

### Method
`useEyeDropper`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Usage
```ts
import { useEyeDropper } from '@vueuse/core'

const { isSupported, open, sRGBHex } = useEyeDropper()
```

### Component Usage
```vue
<template>
  <UseEyeDropper v-slot="{ isSupported, sRGBHex, open ">
    <button :disabled="!isSupported" @click="() => open()">
      sRGBHex: {{ sRGBHex }}
    </button>
  </UseEyeDropper>
</template>
```

### Type Declarations
```ts
export interface EyeDropperOpenOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

export interface EyeDropper {
  new (): EyeDropper
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: "EyeDropper"
}

export interface UseEyeDropperOptions {
  /**
   * Initial sRGBHex.
   *
   * @default ''
   */
  initialValue?: string
}

export interface UseEyeDropperReturn extends Supportable {
  sRGBHex: ShallowRef<string>
  open: (openOptions?: EyeDropperOpenOptions) => Promise<
    | {
        sRGBHex: string
      }
    | undefined
  >
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useEyeDropper(
  options?: UseEyeDropperOptions,
): UseEyeDropperReturn
```

### Response
#### Success Response (200)
- **sRGBHex** (string) - The selected color in sRGBHex format.

#### Response Example
```json
{
  "sRGBHex": "#ff0000"
}
```
```

--------------------------------

### Setting Request Method and Return Type

Source: https://vueuse.org/core/useFetch

You can explicitly set the HTTP request method (e.g., GET, POST) and the expected data type of the response (e.g., JSON, text, blob) by chaining methods to the `useFetch` composable.

```APIDOC
## Setting the request method and return type 

The request method and return type can be set by adding the appropriate methods to the end of `useFetch`

### TypeScript Examples
```typescript
// Request will be sent with GET method and data will be parsed as JSON
const { data } = useFetch(url).get().json()

// Request will be sent with POST method and data will be parsed as text
const { data } = useFetch(url).post().text()

// Or set the method using the options

// Request will be sent with GET method and data will be parsed as blob
const { data } = useFetch(url, { method: 'GET' }, { refetch: true }).blob()
```

### JavaScript Examples
```javascript
'use strict'
// Request will be sent with GET method and data will be parsed as JSON
const { data } = useFetch(url).get().json()
// Request will be sent with POST method and data will be parsed as text
const { data } = useFetch(url).post().text()
// Or set the method using the options
// Request will be sent with GET method and data will be parsed as blob
const { data } = useFetch(url, { method: 'GET' }, { refetch: true }).blob()
```
```

--------------------------------

### Reactive Rounding Usage

Source: https://vueuse.org/math/useRound

Demonstrates how to import and apply useRound to a reactive ref.

```typescript
import { 
useRound
 } from '@vueuse/math'

const 
value
 = 
ref
(20.49)
const 
result
 = 
useRound
(
value
) // 20
```

--------------------------------

### useConfirmDialog - Promise Usage

Source: https://vueuse.org/core/useConfirmDialog

Illustrates using useConfirmDialog with promises for asynchronous operations.

```APIDOC
## useConfirmDialog - Promise Usage

### Description
This example demonstrates how to use the promise returned by the `reveal` function for handling dialog confirmations asynchronously.

### Method
`useConfirmDialog()`

### Parameters
- `revealed` (ShallowRef<boolean>) - Optional: A ref to control the revealed state of the dialog.

### Functions Returned
- `isRevealed` (ComputedRef<boolean>): Indicates if the dialog is currently revealed.
- `reveal` (Function): Triggers the dialog to be revealed and returns a promise that resolves with the dialog result.
- `confirm` (Function): Confirms the dialog action and closes it.
- `cancel` (Function): Cancels the dialog action and closes it.

### Request Example
```vue
<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog()

async function openDialog() {
  const { data, isCanceled } = await reveal()
  if (!isCanceled)
    console.log(data)
}
</script>

<template>
  <button @click="openDialog">Show Modal</button>

  <teleport to="body">
    <div v-if="isRevealed" class="modal-layout">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm(true)">Yes</button>
        <button @click="confirm(false)">No</button>
      </div>
    </div>
  </teleport>
</template>
```
```

--------------------------------

### Observe Performance Metrics with JavaScript

Source: https://vueuse.org/core/useperformanceobserver

This JavaScript snippet demonstrates how to use `usePerformanceObserver` to track performance metrics. It initializes an empty array for entries and updates it when new entries are observed. The observer is configured to watch for 'paint' entry types.

```javascript
import { usePerformanceObserver } from '@vueuse/core'
const entrys = ref([])
usePerformanceObserver(
  {
    entryTypes: ['paint'],
  },
  (list) => {
    entrys.value = list.getEntries()
  },
)
```

--------------------------------

### Type Declarations for usePerformanceObserver

Source: https://vueuse.org/core/useperformanceobserver

This TypeScript code defines the types for `usePerformanceObserver`, including options like `immediate` and `entryTypes`, and the return type which includes `isSupported`, `start`, and `stop` functions. It also provides the function signature for the composable.

```typescript
export type 
UsePerformanceObserverOptions
 = PerformanceObserverInit &
  
ConfigurableWindow
 &
 {
    /**
     * Start the observer immediate.
     *
     * @default true
     */
    
immediate
?: boolean
  }
/**
 * Observe performance metrics.
 *
 * @see https://vueuse.org/usePerformanceObserver
 * @param options
 */
export declare function 
usePerformanceObserver
(
  
options
: 
UsePerformanceObserverOptions
,
  
callback
: PerformanceObserverCallback,
): {
  
isSupported
: 
UseSupportedReturn

  
start
: () => void
  
stop
: () => void
}
```

--------------------------------

### Configure Window in useActiveElement Usage

Source: https://vueuse.org/guidelines

Demonstrates how to configure the `window` option for `useActiveElement` when working within an iframe to bind to the parent window.

```typescript
// in iframe and bind to the parent window
useActiveElement({ window: window.parent })
```

--------------------------------

### Apply Default Value to a Ref

Source: https://vueuse.org/shared/refdefault

Use refDefault to provide a fallback value for a ref. If the source ref's value becomes undefined or null, refDefault will return the specified default value. This example demonstrates its usage with useStorage.

```typescript
import {
 refDefault
, 
useStorage
 } from '@vueuse/core'

const 
raw
 = 
useStorage
('key')
const 
state
 = 
refDefault
(
raw
, 'default')


raw
.
value
 = 'hello'

console
.
log
(
state
.
value
) // hello


raw
.
value
 = 
undefined


console
.
log
(
state
.
value
) // default
```

--------------------------------

### useMediaControls

Source: https://vueuse.org/core/useMediaControls

A reactive composable to control HTML media elements.

```APIDOC
## useMediaControls

### Description
Provides reactive controls for an HTMLMediaElement, allowing management of playback, volume, and text tracks.

### Parameters
#### Arguments
- **target** (MaybeRef<HTMLMediaElement | null | undefined>) - Required - The media element to control.
- **options** (UseMediaControlsOptions) - Optional - Configuration object for media source and tracks.

### Request Example
```javascript
const video = ref<HTMLVideoElement | null>(null);
const { playing, volume } = useMediaControls(video, {
  src: 'video.mp4',
  tracks: [{ kind: 'subtitles', label: 'English', src: 'en.vtt', srcLang: 'en' }]
});
```

### Response
#### Return Value (UseMediaControlsReturn)
- **currentTime** (ShallowRef<number>) - Current playback time.
- **duration** (ShallowRef<number>) - Total media duration.
- **playing** (ShallowRef<boolean>) - Playback status.
- **volume** (ShallowRef<number>) - Current volume level.
- **muted** (ShallowRef<boolean>) - Mute status.
- **tracks** (ShallowRef<UseMediaTextTrack[]>) - List of available text tracks.
- **enableTrack** (Function) - Method to enable a specific track.
- **disableTrack** (Function) - Method to disable a specific track.
- **togglePictureInPicture** (Function) - Toggles PiP mode.
```

--------------------------------

### Consume counter state in a component

Source: https://vueuse.org/shared/createinjectionstate

This Vue component shows how to consume the counter state using `useCounterStore`. It displays the current count and its double. The example uses the non-null assertion operator `!` for simplicity, assuming the store is always provided.

```vue
<!-- CountComponent.vue -->
<script setup lang="ts">
import {
  useCounterStore
} from './useCounterStore'

// use non-null assertion operator to ignore the case that store is not provided.
const { count, double } = useCounterStore()!
// if you want to allow component to working without providing store, you can use follow code instead:
// const { count, double } = useCounterStore() ?? { count: shallowRef(0), double: shallowRef(0) }
// also, you can use another hook to provide default value
// const { count, double } = useCounterStoreWithDefaultValue()
// or throw error
// const { count, double } = useCounterStoreOrThrow()
</script>

<template>
  <
    ul
  >
    <li >
      count: {{ count }}
    </li >
    <li >
      double: {{ double }}
    </li >
  </
    ul
  >
</template>

```

--------------------------------

### useObservable Basic Usage

Source: https://vueuse.org/rxjs/useObservable

Demonstrates the basic usage of `useObservable` to integrate an RxJS observable with Vue's reactivity system.

```APIDOC
## useObservable Basic Usage

### Description

Use an RxJS `Observable`, return a `ref`, and automatically unsubscribe from it when the component is unmounted.

### Method

`useObservable`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```typescript
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith } from 'rxjs/operators'

// setup()
const count = useObservable(
  interval(1000).pipe(
    mapTo(1),
    startWith(0),
    scan((total, next) => next + total),
  ),
)
```

### Response

#### Success Response (200)

- **count** (Ref<number>) - A Vue ref that holds the latest value emitted by the observable.

#### Response Example

```json
{
  "value": 0 // or subsequent emitted values
}
```
```

--------------------------------

### useArrayReduce with Initial Value

Source: https://vueuse.org/shared/usearrayreduce

Illustrates using useArrayReduce with an initial value for the reduction.

```APIDOC
## useArrayReduce with Initial Value

### Description
Shows how to provide an initial value to `useArrayReduce`.

### Method
`useArrayReduce`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useArrayReduce } from '@vueuse/core'

const list = reactive([{ num: 1 }, { num: 2 }])
const sum = useArrayReduce(list, (sum, val) => sum + val.num, 0)
// sum.value: 3
```

### Response
#### Success Response (200)
- **sum** (ComputedRef<U>) - The computed value of the array reduction with an initial value.

#### Response Example
```json
{
  "value": 3
}
```
```

--------------------------------

### Convert Ref to RxJS Observer in JavaScript

Source: https://vueuse.org/rxjs/toobserver

This JavaScript example shows how to use toObserver to pipe RxJS stream values into a Vue ref. It requires the @vueuse/rxjs package. The stream updates a 'count' ref and stops when a button is clicked.

```javascript
import { from, fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import {
  map,
  mapTo,
  startWith,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { shallowRef, useTemplateRef } from 'vue'
const count = shallowRef(0)
const button = useTemplateRef('buttonRef')
useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([curr, total]) => curr + total),
    )
    .subscribe(toObserver(count)),
)
```

--------------------------------

### useDropZone API

Source: https://vueuse.org/core/usedropzone

Documentation for the `useDropZone` composable function.

```APIDOC
## useDropZone

### Description
Creates a zone where files can be dropped.

### Warning
Due to Safari browser limitations, file type validation is only possible during the drop event, not during drag events. As a result, the `isOverDropZone` value will always be `true` during drag operations in Safari, regardless of file type.

### Method
`useDropZone(target, options?)

### Parameters
#### Path Parameters
- **target** (MaybeRefOrGetter<HTMLElement | Document | null | undefined>) - Required - The target element or document to attach the drop zone to.
- **options** (UseDropZoneOptions | UseDropZoneOptions["onDrop"]) - Optional - Configuration options for the drop zone.

#### Options Object (`UseDropZoneOptions`)
- **dataTypes** (MaybeRef<readonly string[]> | ((types: readonly string[]) => boolean)) - Optional - Allowed data types for dropped files. If not set, all data types are allowed. Can also be a function to check the data types.
- **checkValidity** ((items: DataTransferItemList) => boolean) - Optional - A function that takes `DataTransferItemList` and returns a boolean indicating validity. This function takes precedence over `dataTypes`.
- **onDrop** ((files: File[] | null, event: DragEvent) => void) - Optional - Callback function executed when files are dropped.
- **onEnter** ((files: File[] | null, event: DragEvent) => void) - Optional - Callback function executed when a drag enters the drop zone.
- **onLeave** ((files: File[] | null, event: DragEvent) => void) - Optional - Callback function executed when a drag leaves the drop zone.
- **onOver** ((files: File[] | null, event: DragEvent) => void) - Optional - Callback function executed when a drag is over the drop zone.
- **multiple** (boolean) - Optional - Allow multiple files to be dropped. Defaults to `true`.
- **preventDefaultForUnhandled** (boolean) - Optional - Prevent default behavior for unhandled events. Defaults to `false`.

### Return Value
- **files** (ShallowRef<File[] | null>) - A reactive reference to the array of dropped files, or null if no files were dropped.
- **isOverDropZone** (ShallowRef<boolean>) - A reactive boolean indicating whether the drag is currently over the drop zone.

### Usage Example
```vue
<script setup lang="ts">
import { useDropZone, useTemplateRef } from '@vueuse/core'

const dropZoneRef = useTemplateRef('dropZoneRef')

function onDrop(files: File[] | null) {
  // called when files are dropped on zone
  console.log(files)
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/jpeg'],
  multiple: true,
  preventDefaultForUnhandled: false,
})
</script>

<template>
  <div ref="dropZoneRef">
    Drop files here
  </div>
</template>
```
```

--------------------------------

### Read Battery Level from Bluetooth Device

Source: https://vueuse.org/core/usebluetooth

This example demonstrates how to read the battery level from a Bluetooth LE device and listen for changes. It requires the 'battery_service' to be available on the device. Event listeners are used to handle updates after the initial read.

```vue
<script setup lang="ts">
import {
  useBluetooth,
  useEventListener,
  watchPausable
} from '@vueuse/core'

const {
  isSupported,
  isConnected,
  device,
  requestDevice,
  server,
} = useBluetooth({
  acceptAllDevices: true,
  optionalServices: [
    'battery_service',
  ],
})

const batteryPercent = ref<undefined | number>()

const isGettingBatteryLevels = ref(false)

async function getBatteryLevels() {
  isGettingBatteryLevels.value = true

  // Get the battery service:
  const batteryService = await server.getPrimaryService('battery_service')

  // Get the current battery level
  const batteryLevelCharacteristic = await batteryService.getCharacteristic(
    'battery_level',
  )

  // Listen to when characteristic value changes on `characteristicvaluechanged` event:
  useEventListener(
    batteryLevelCharacteristic, 'characteristicvaluechanged', (event) => {
      batteryPercent.value = event.target.value.getUint8(0)
    }, { passive: true })

  // Convert received buffer to number:
  const batteryLevel = await batteryLevelCharacteristic.readValue()

  batteryPercent.value = await batteryLevel.getUint8(0)
}

const { stop } = watchPausable(isConnected, (newIsConnected) => {
  if (!newIsConnected || !server.value || isGettingBatteryLevels.value)
    return
  // Attempt to get the battery levels of the device:
  getBatteryLevels()
  // We only want to run this on the initial connection, as we will use an event listener to handle updates:
  stop()
})
</script>

<template>
  <button @click="requestDevice()">
    Request Bluetooth Device
  </button>
</template>
```

--------------------------------

### whenever - Using a Computed Getter

Source: https://vueuse.org/shared/whenever

Illustrates how to use 'whenever' with a computed getter function as the source, allowing it to react to changes in derived state.

```APIDOC
## whenever - Using a Computed Getter

### Description
Same as `watch`, you can pass a getter function to calculate on each change.

### Method
N/A

### Endpoint
N/A

### Parameters
See 'whenever - Basic Usage' for general parameters.

### Request Example
```javascript
// this
whenever(
  () => counter.value === 7,
  () => console.log('counter is 7 now!'),
)
```

### Response
N/A
```

--------------------------------

### Controlling onClickOutside with Controls Option (JavaScript)

Source: https://vueuse.org/core/onclickoutside

Use the `controls` option to get `stop`, `cancel`, and `trigger` functions for manual control over the handler. `cancel` prevents the next click, `trigger` fires the handler manually, and `stop` removes listeners.

```javascript
'use strict'
const { stop, cancel, trigger } = onClickOutside(
  modalRef,
  (event) => {
    modal.value = false
  },
  { controls: true },
)
// cancel prevents the next click from triggering the handler
cancel()
// trigger manually fires the handler
trigger(event)
// stop removes all event listeners
stop()
```

--------------------------------

### Basic usage of useFavicon

Source: https://vueuse.org/core/useFavicon

Initialize the favicon utility and update the icon by modifying the returned ref value.

```ts
import { 
useFavicon
 } from '@vueuse/core'

const 
icon
 = 
useFavicon
()


icon
.
value
 = 'dark.png' // change current icon
```

--------------------------------

### Controlling onClickOutside with Controls Option (TypeScript)

Source: https://vueuse.org/core/onclickoutside

Use the `controls` option to get `stop`, `cancel`, and `trigger` functions for manual control over the handler. `cancel` prevents the next click, `trigger` fires the handler manually, and `stop` removes listeners.

```typescript
const { 
stop
, 
cancel
, 
trigger
 } = onClickOutside(
  modalRef,
  (
event
) => {
    modal.value = false
  },
  { 
controls
: true },
)

// cancel prevents the next click from triggering the handler

cancel
()

// trigger manually fires the handler

trigger
(
event
)

// stop removes all event listeners

stop
()
```

--------------------------------

### useSubscription - Basic Usage

Source: https://vueuse.org/rxjs/useSubscription

Demonstrates how to use the `useSubscription` composable with an RxJS observable to automatically handle subscription unmounting.

```APIDOC
## POST /api/users

### Description
This endpoint allows you to create a new user in the system. Provide the necessary user details in the request body.

### Method
POST

### Endpoint
/api/users

### Parameters
#### Request Body
- **username** (string) - Required - The desired username for the new user.
- **email** (string) - Required - The email address of the new user.
- **password** (string) - Required - The password for the new user.

### Request Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (201)
- **id** (string) - The unique identifier for the newly created user.
- **username** (string) - The username of the created user.
- **email** (string) - The email address of the created user.

#### Response Example
```json
{
  "id": "user-12345",
  "username": "johndoe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### Track User Text Selection with useTextSelection

Source: https://vueuse.org/core/usetextselection

Import and use the `useTextSelection` composable in your Vue component's setup. It returns an object containing reactive properties for the selected text, its bounding rectangles, and ranges. Display the selected text in your template.

```vue
<script setup lang="ts">
import { 
useTextSelection
 } from '@vueuse/core'

const 
state
 = 
useTextSelection
()
</script>

<template>
  <p>{{ 
state
.text }}
</p>
</template>
```

--------------------------------

### useArrayFind Basic Usage

Source: https://vueuse.org/shared/useArrayFind

Demonstrates the basic usage of `useArrayFind` with a static array of refs. The `positive` ref will hold the first element that satisfies the condition `val > 0`.

```APIDOC
## useArrayFind

### Description
Reactive `Array.find`.

### Usage
```ts
import {
useArrayFind
} from '@vueuse/core'

const
list
= [
ref
(1),
ref
(-1),
ref
(2)]
const
positive
=
useArrayFind(
list
,
val
=>
val
>
0)
// positive.value: 1
```

### Type Declarations
```ts
export type
UseArrayFindReturn
<T = any> = ComputedRef<T | undefined>
/**
 * Reactive `Array.find`
 *
 * @see https://vueuse.org/useArrayFind
 * @param list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function
useArrayFind
<T>(
list
: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, 
fn
: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => boolean,
): UseArrayFindReturn<T>
```
```

--------------------------------

### useInfiniteScroll - Options

Source: https://vueuse.org/core/useInfiniteScroll

Explains the available options for configuring useInfiniteScroll, such as distance, direction, and canLoadMore.

```APIDOC
## PUT /api/users/{id}

### Description
Updates the details of an existing user.

### Method
PUT

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the user to update.

#### Request Body
- **name** (string) - Optional - The updated name of the user.
- **email** (string) - Optional - The updated email address of the user.

### Request Example
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier of the updated user.
- **name** (string) - The updated name of the user.
- **email** (string) - The updated email address of the user.

#### Response Example
```json
{
  "id": "user-123",
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```
```

--------------------------------

### Consume counter state in a child component

Source: https://vueuse.org/shared/createInjectionState

This Vue component shows how to consume the counter state injected by `useProvideCounterStore`. It retrieves `count` and `double` values using `useCounterStore` and displays them in a list. It also includes commented-out examples for handling cases where the store might not be provided.

```vue
<!-- CountComponent.vue -->
<script setup lang="ts">
import { 
useCounterStore
 } from './useCounterStore'

// use non-null assertion operator to ignore the case that store is not provided.
const { 
count
,
double
 }
=
useCounterStore
()!
// if you want to allow component to working without providing store, you can use follow code instead:
// const { count, double } = useCounterStore() ?? { count: shallowRef(0), double: shallowRef(0) }
// also, you can use another hook to provide default value
// const { count, double } = useCounterStoreWithDefaultValue()
// or throw error
// const { count, double } = useCounterStoreOrThrow()
</script>

<template>
  <
ul
>
    <
li
>
      count: {{ 
count
 }}
    </
li
>
    <
li
>
      double: {{ 
double
 }}
    </
li
>
  </
ul
>
</template>
```

--------------------------------

### Basic usage of useZoomLevel

Source: https://vueuse.org/electron/useZoomLevel

Initializes the zoom level and demonstrates how to read and modify it.

```typescript
import { 
useZoomLevel
 } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const 
level
 = 
useZoomLevel
()

console
.
log
(
level
.
value
) // print current zoom level

level
.
value
 = 2 // change current zoom level
```

--------------------------------

### Get Element from Specific Vue Component

Source: https://vueuse.org/core/useCurrentElement

Pass a specific Vue component reference to `useCurrentElement` to obtain its DOM element. This is useful when dealing with child components or when you need to target a particular component's element. Ensure the component has a single root element for predictable results.

```vue
<script setup lang="ts">
import { 
useCurrentElement
, 
VueInstance
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const componentRef = 
shallowRef
<VueInstance>(null as unknown as VueInstance)

const el = 
useCurrentElement
(
componentRef
) // ComputedRef<Element>
</script>

<template>
  <div>
    <OtherVueComponent 
ref
="componentRef" />
    <p>Hello world</p>
  </div>
</template>
```

--------------------------------

### useImage - Basic Usage

Source: https://vueuse.org/core/useImage

Demonstrates the basic usage of the `useImage` composable in a Vue.js component to reactively load an image and display a loading state.

```APIDOC
## useImage - Basic Usage

### Description
This example shows how to use the `useImage` composable to load an image. It displays 'Loading' while the image is being fetched and renders the image once loaded.

### Method
`useImage`

### Parameters
#### Options
- **src** (string) - Required - The URL of the image to load.
- **srcset** (string) - Optional - Images to use in different situations.
- **sizes** (string) - Optional - Image sizes for different page layouts.
- **alt** (string) - Optional - Image alternative information.
- **class** (string) - Optional - Image classes.
- **loading** (HTMLImageElement["loading"]) - Optional - Image loading attribute.
- **crossorigin** (string) - Optional - Image CORS settings.
- **referrerPolicy** (HTMLImageElement["referrerPolicy"]) - Optional - Referrer policy for fetch.
- **width** (HTMLImageElement["width"]) - Optional - Image width.
- **height** (HTMLImageElement["height"]) - Optional - Image height.
- **decoding** (HTMLImageElement["decoding"]) - Optional - Hint for image decoding.
- **fetchPriority** (HTMLImageElement["fetchPriority"]) - Optional - Hint for fetching priority.
- **ismap** (HTMLImageElement["ismap"]) - Optional - Indicates if the image is a server-side image map.
- **usemap** (HTMLImageElement["usemap"]) - Optional - The partial URL of an image map.

### Request Example
```vue
<script setup lang="ts">
import { useImage } from '@vueuse/core'

const avatarUrl = 'https://place.dog/300/200'
const { isLoading } = useImage({ src: avatarUrl })
</script>

<template>
  <span v-if="isLoading">Loading</span>
  <img v-else :src="avatarUrl">
</template>
```

### Response
#### Success Response (Image Loaded)
- **isLoading** (boolean) - True if the image is currently loading, false otherwise.
- **isError** (boolean) - True if there was an error loading the image.
- **data** (HTMLImageElement | undefined) - The loaded HTMLImageElement or undefined.

#### Response Example
(Implicitly handled by the template logic showing the image or loading state)
```

--------------------------------

### Create and use injection state in TypeScript

Source: https://vueuse.org/shared/createInjectionState

Defines a composable function `useCounterStore` using `createInjectionState` for managing a counter. It includes state (`count`), getters (`double`), and actions (`increment`). The example also shows how to provide the state using `useProvideCounterStore` and consume it in other components using `useCounterStore`, with options for default values or error handling.

```typescript
// useCounterStore.ts
import {
createInjectionState
} from '@vueuse/core'
import {
computed,
shallowRef
} from 'vue'

const [
useProvideCounterStore,
useCounterStore
] =
createInjectionState
((
initialValue
: number) => {
  // state
  const
count
 =
shallowRef(
initialValue
)

  // getters
  const
double
 =
computed(() =>
count
.value *
2)

  // actions
  function
increment
() {
    
count
.value++
  }

  return { 
count
, 
double
, 
increment
 }
})

export { 
useProvideCounterStore
 }

// If you want to hide `useCounterStore` and wrap it in default value logic or throw error logic, please don't export `useCounterStore`
export { 
useCounterStore
 }

export function 
useCounterStoreWithDefaultValue
() {
  return 
useCounterStore
() ?? {
    
count
:
shallowRef(0),
    
double
:
shallowRef(0),
    
increment
: () => {},
  }
}

export function 
useCounterStoreOrThrow
() {
  const
counterStore
 =
useCounterStore
()
  if (
counterStore
 == null)
    throw new 
Error
('Please call `useProvideCounterStore` on the appropriate parent component')
  return 
counterStore

}
```

--------------------------------

### Manual Render Function Pattern

Source: https://vueuse.org/core/createtemplatepromise

Demonstrates using render functions to achieve more flexibility, which can feel like reinventing a DSL.

```typescript
const 
result
 = await dialog.open({
  
contentSlot
: () => 
h
(MyComponent, { 
content
 }),
})
```

```javascript
'use strict'
const result = await dialog.open({
  title: 'Hello',
  contentSlot: () => h(MyComponent, { content }),
})
```

--------------------------------

### Basic Usage with Vue Template

Source: https://vueuse.org/core/createtemplatepromise

Demonstrates defining a template promise and using it within a Vue component script and template.

```vue
<script setup lang="ts">
import { 
createTemplatePromise
 } from '@vueuse/core'

const 
TemplatePromise
 = 
createTemplatePromise
<
ReturnType
>()

async function 
open
() {
  const 
result
 = await 
TemplatePromise
.
start
()
  // button is clicked, result is 'ok'
}
</script>

<template>
  <
TemplatePromise
 
v-slot
="{ 
promise
, 
resolve
, 
reject
, 
args
 }">
    <!-- your UI -->
    <
button
 @
click
="
resolve
('ok')">
      OK
    </
button
>
  </TemplatePromise>
</template>
```

--------------------------------

### Create and use injection state in JavaScript

Source: https://vueuse.org/shared/createInjectionState

Defines a composable function `useCounterStore` using `createInjectionState` for managing a counter in JavaScript. It includes state (`count`), getters (`double`), and actions (`increment`). The example also shows how to provide the state using `useProvideCounterStore` and consume it in other components using `useCounterStore`, with options for default values or error handling.

```javascript
// useCounterStore.ts
import { createInjectionState } from '@vueuse/core'
import { computed, shallowRef } from 'vue'
const [useProvideCounterStore, useCounterStore] = createInjectionState(
  (initialValue) => {
    // state
    const count = shallowRef(initialValue)
    // getters
    const double = computed(() => count.value * 2)
    // actions
    function increment() {
      count.value++
    }
    return { count, double, increment }
  },
)
export { useProvideCounterStore }
// If you want to hide `useCounterStore` and wrap it in default value logic or throw error logic, please don't export `useCounterStore`
export { useCounterStore }
export function useCounterStoreWithDefaultValue() {
  return (
    useCounterStore() ?? {
      count: shallowRef(0),
      double: shallowRef(0),
      increment: () => {},
    }
  )
}
export function useCounterStoreOrThrow() {
  const counterStore = useCounterStore()
  if (counterStore == null)
    throw new Error(
      'Please call `useProvideCounterStore` on the appropriate parent component',
    )
  return counterStore
}

```

--------------------------------

### Create Custom Fetch Instance with Base URL and Auth

Source: https://vueuse.org/core/usefetch

Use `createFetch` to set a base URL and automatically add authorization headers to all requests made with the custom instance. This is useful for interacting with APIs that require consistent authentication.

```typescript
const 
useMyFetch
 = 
createFetch
({
  
baseUrl
: 'https://my-api.com',
  
options
: {
    async 
beforeFetch
({ 
options
 }) {
      const 
myToken
 = await getMyToken()
      
options
. 
headers
.Authorization = `Bearer ${ 
myToken
}`

      return { 
options
 }
    },
  },
  
fetchOptions
: {
    
mode
: 'cors',
  },
})

const { 
isFetching
 , 
error
 , 
data
 } = 
useMyFetch
('users')
```

```javascript
'use strict'
const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  options: {
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
const { isFetching, error, data } = useMyFetch('users')
```

--------------------------------

### useIpcRendererInvoke Usage

Source: https://vueuse.org/electron/useipcrendererinvoke

Demonstrates how to use the useIpcRendererInvoke composable to interact with the main process in an Electron application. It shows how to handle the result reactively using computed properties.

```APIDOC
## POST /ipcRenderer/invoke

### Description
This endpoint represents the invocation of a channel to the Electron main process using `ipcRenderer.invoke`. The `useIpcRendererInvoke` composable wraps this functionality, providing a reactive result that mirrors the asynchronous response from the main process.

### Method
POST (Implicitly via `ipcRenderer.invoke`)

### Endpoint
`custom-channel` (This is the channel name passed to the function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **channel** (string) - Required - The name of the channel to send the message to.
- **args** (any[]) - Optional - Arguments to send with the message.

### Request Example
```json
{
  "channel": "custom-channel",
  "args": ["some data"]
}
```

### Response
#### Success Response (200)
- **result** (ShallowRef<T | null>) - A reactive reference containing the data returned from the main process. It will be `null` initially and updated when the main process responds.

#### Response Example
```json
{
  "msg": "Data received from main process"
}
```

### Type Declarations
```typescript
/**
 * Returns Promise<any> - Resolves with the response from the main process.
 *
 * Send a message to the main process via channel and expect a result ~~asynchronously~~. As composition-api, it makes asynchronous operations look like synchronous.
 *
 * You need to provide `ipcRenderer` to this function.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
 * @see https://vueuse.org/useIpcRendererInvoke
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useIpcRendererInvoke<T>(
  ipcRenderer: IpcRenderer,
  channel: string,
  ...args: any[]
): ShallowRef<T | null>

/**
 * Returns Promise<any> - Resolves with the response from the main process.
 *
 * Send a message to the main process via channel and expect a result ~~asynchronously~~. As composition-api, it makes asynchronous operations look like synchronous.
 *
 * `ipcRenderer` will be automatically gotten.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
 * @see https://vueuse.org/useIpcRendererInvoke
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function useIpcRendererInvoke<T>(
  channel: string,
  ...args: any[]
): ShallowRef<T | null>
```
```

--------------------------------

### useIpcRendererInvoke Usage

Source: https://vueuse.org/electron/useIpcRendererInvoke

Demonstrates how to use the useIpcRendererInvoke composable to interact with the main process in an Electron application. It shows how to handle the result reactively using computed properties.

```APIDOC
## POST /ipcRenderer/invoke

### Description
This endpoint represents the interaction with the Electron main process using `ipcRenderer.invoke`. The `useIpcRendererInvoke` composable allows you to send a channel and arguments to the main process and receive a response reactively.

### Method
POST (conceptual, as it's a function call within the Electron context)

### Endpoint
N/A (This is a client-side composable interacting with the Electron main process)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **channel** (string) - Required - The channel name to send the message to.
- **args** (any[]) - Optional - Arguments to send with the message.

### Request Example
```json
{
  "channel": "custom-channel",
  "args": ["some data"]
}
```

### Response
#### Success Response (200)
- **result** (ShallowRef<T | null>) - A reactive reference containing the response from the main process, or null if not yet received or an error occurred.

#### Response Example
```json
{
  "msg": "Hello from main process"
}
```
```

--------------------------------

### Type Declarations for useDevicePixelRatio

Source: https://vueuse.org/core/useDevicePixelRatio

Examine the type declarations for `useDevicePixelRatio`, including options for window configuration and the return type which provides a readonly shallow ref for the pixel ratio and a stop function for the watcher.

```typescript
export interface UseDevicePixelRatioOptions extends ConfigurableWindow {}
export interface UseDevicePixelRatioReturn {

pixelRatio
: 
Readonly
<
ShallowRef
<number>>
  
stop
: 
WatchStopHandle

}
/**
 * Reactively track `window.devicePixelRatio`.
 *
 * @see https://vueuse.org/useDevicePixelRatio
 *
 * @__NO_SIDE_EFFECTS__
 */
export declare function 
useDevicePixelRatio
(
  
options
?: UseDevicePixelRatioOptions,
): UseDevicePixelRatioReturn
```

--------------------------------

### useObservable with Initial Value

Source: https://vueuse.org/rxjs/useObservable

Shows how to provide an initial value to `useObservable` which is used before the observable emits its first value.

```APIDOC
## useObservable with Initial Value

### Description

You can provide an initial value that will be used before the Observable emits its first value.

### Method

`useObservable`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```typescript
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'

const count = useObservable(
  interval(1000),
  { initialValue: 0 },
)
// count.value is 0 until the first emission
```

### Response

#### Success Response (200)

- **count** (Ref<number>) - A Vue ref that holds the latest value emitted by the observable, or the initial value if no emission has occurred.

#### Response Example

```json
{
  "value": 0 // initial value until first emission
}
```
```

--------------------------------

### Programmatic Resetting

Source: https://vueuse.org/core/useidle

Demonstrates how to programmatically reset the idle timer using the `reset` function returned by `useIdle`.

```APIDOC
## Programmatic Resetting 

### Description
Allows programmatically resetting the idle timer. The `reset` function restarts the idle timer without changing the `lastActive` value.

### Method
useIdle

### Endpoint
N/A (Composable function)

### Parameters
None

### Request Example
ts
```typescript
import { useCounter, useIdle } from '@vueuse/core'
import { watch } from 'vue'

const { inc, count } = useCounter()
const { idle, lastActive, reset } = useIdle(5 * 60 * 1000) // 5 min

watch(idle, (idleValue) => {
  if (idleValue) {
    inc()
    console.log(`Triggered ${count.value} times`)
    reset() // restarts the idle timer. Does not change lastActive value
  }
})
```

### Response
#### Success Response (200)
N/A (Composable function returns refs and functions)

#### Response Example
N/A
```

--------------------------------

### Usage of useElementByPoint

Source: https://vueuse.org/core/useElementByPoint

Demonstrates how to integrate useElementByPoint with useMouse to track the element under the cursor.

```typescript
import { 
useElementByPoint
, 
useMouse
 } from '@vueuse/core'

const { 
x
, 
y
 } = 
useMouse
({ 
type
: 'client' })
const { 
element
 } = 
useElementByPoint
({ 
x
, 
y
 })
```

--------------------------------

### createFetch

Source: https://vueuse.org/core/usefetch

A factory function to create a customized instance of useFetch with predefined configurations.

```APIDOC
## createFetch

### Description
Creates a reusable fetch instance with custom configurations like base URL, default options, and error handling strategies.

### Method
Factory function

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```json
{
  "example": "// Create a fetch instance with a base URL\nconst myFetch = createFetch({ baseUrl: 'https://api.example.com' })\n// Use the instance\nconst { data } = myFetch('/users').json()"
}
```

### Response
Returns a customized `useFetch` function.

#### Success Response (200)
N/A

#### Response Example
```json
{
  "example": "// The returned value is a function, not a direct response\n// Example of using the returned function:\n// const { data } = myFetch('/data')"
}
```
```

--------------------------------

### Cycle through a list of items with useCycleList

Source: https://vueuse.org/core/useCycleList

Demonstrates basic usage of useCycleList to navigate through an array of strings using state, next, prev, and go methods.

```typescript
import { 
useCycleList
 } from '@vueuse/core'

const { 
state
, 
next
, 
prev
, 
go
 } = 
useCycleList
([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])


console
.
log
(
state
.
value
) // 'Dog'


prev
()


console
.
log
(
state
.
value
) // 'Seal'


go
(3)


console
.
log
(
state
.
value
) // 'Shark'
```

--------------------------------

### useWebSocket Options and Type Declarations

Source: https://vueuse.org/core/usewebsocket

Provides detailed type declarations for the UseWebSocketOptions and UseWebSocketReturn interfaces, outlining all available configuration options and return values.

```APIDOC
## GET /api/users/{id}

### Description
Retrieves the details of a specific user by their ID.

### Method
GET

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (integer) - Required - The unique identifier of the user to retrieve.

#### Query Parameters
- **fields** (string) - Optional - A comma-separated list of fields to include in the response.

### Response
#### Success Response (200)
- **id** (integer) - The unique identifier of the user.
- **username** (string) - The username of the user.
- **email** (string) - The email address of the user.
- **createdAt** (string) - The timestamp when the user account was created.

#### Response Example
```json
{
  "id": 123,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "createdAt": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Basic useAxios Usage

Source: https://vueuse.org/integrations/useaxios

Import and use the useAxios composable to fetch data from a given URL. The composable automatically handles the request when a URL is provided.

```typescript
import {
useAxios
} from '@vueuse/integrations/useAxios'

const { 
data
,
isFinished
 } = 
useAxios
('/api/posts')
```

--------------------------------

### Handle readiness with onReady callback

Source: https://vueuse.org/core/useStorageAsync

Use the onReady option to execute logic once the storage value is available.

```typescript
import { 
useStorageAsync
 } from '@vueuse/core'

// Use ES2024 Promise.withResolvers, you may use any Deferred object or EventBus to do same thing.
const { 
promise
, 
resolve
 } = 
Promise
.
withResolvers
()

const 
accessToken
 = 
useStorageAsync
('access.token', '', SomeAsyncStorage, {
  
onReady
(
value
) {
    
resolve
(
value
)
  }
})

// At main.ts
router.onReady(async () => {
  // Let's wait accessToken loaded
  await 
promise


  // Now accessToken has loaded, we can safely mount our app

  app.mount('app')
})
```

--------------------------------

### Basic usage of useMediaQuery

Source: https://vueuse.org/core/usemediaquery

Tracks media query states reactively using the useMediaQuery hook.

```typescript
import { 
useMediaQuery
 } from '@vueuse/core'

const 
isLargeScreen
 = 
useMediaQuery
('(min-width: 1024px)')
const 
isPreferredDark
 = 
useMediaQuery
('(prefers-color-scheme: dark)')
```

--------------------------------

### useShare Basic Usage

Source: https://vueuse.org/core/useshare

Demonstrates the basic usage of the useShare composable to share title, text, and URL. The share method must be called in response to a user gesture.

```APIDOC
## useShare

### Description
Reactive Web Share API. The Browser provides features that can share content in text or file. The `share` method has to be called following a user gesture like a button click. It can’t simply be called on page load for example. That’s in place to help prevent abuse.

### Method
useShare

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useShare } from '@vueuse/core'

const { share, isSupported } = useShare()

function startShare() {
  share({
    title: 'Hello',
    text: 'Hello my friend!',
    url: location.href,
  })
}
```

### Response
#### Success Response (200)
N/A (The `share` function returns a Promise that resolves to void upon successful sharing.)

#### Response Example
None
```

--------------------------------

### useIpcRendererOn

Source: https://vueuse.org/electron/useIpcRendererOn

Listens to a channel for messages from the main process. The listener is automatically removed when the component unmounts. This function is part of the `@vueuse/electron` add-on.

```APIDOC
## useIpcRendererOn

### Description
Listens to channel, when a new message arrives listener would be called with listener(event, args...). `ipcRenderer.removeListener` is called automatically on unmount.

### Method
`useIpcRendererOn`

### Parameters
#### Overload 1: Explicit `ipcRenderer`
- **ipcRenderer** (IpcRenderer) - Required - The `ipcRenderer` instance.
- **channel** (string) - Required - The name of the channel to listen on.
- **listener** (IpcRendererListener) - Required - The callback function to execute when a message is received.

#### Overload 2: Automatic `ipcRenderer`
- **channel** (string) - Required - The name of the channel to listen on.
- **listener** (IpcRendererListener) - Required - The callback function to execute when a message is received.

### Request Example
```typescript
import { useIpcRendererOn } from '@vueuse/electron'

// With explicit ipcRenderer
useIpcRendererOn(ipcRenderer, 'custom-event', (event, ...args) => {
  console.log(args)
})

// With automatic ipcRenderer
useIpcRendererOn('custom-event', (event, ...args) => {
  console.log(args)
})
```

### Response
Returns the `IpcRenderer` instance.

### Notes
- Ensure `nodeIntegration` is enabled in your `webview` tag if you don't provide `ipcRenderer` explicitly.
- Refer to Electron's documentation for `ipcRenderer.on` and `ipcRenderer.removeListener` for more details.
```

--------------------------------

### useSubject - Basic Usage

Source: https://vueuse.org/rxjs/usesubject

Demonstrates the basic usage of `useSubject` to bind an RxJS Subject to a Vue ref.

```APIDOC
## useSubject 

### Description
Bind an RxJS `Subject` to a `ref` and propagate value changes both ways.

### Method
`useSubject(subject, options?)`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useSubject } from '@vueuse/rxjs'
import { Subject } from 'rxjs'

const subject = new Subject()

// setup()
const subjectRef = useSubject(subject)

// Changes to subjectRef.value will be pushed to the subject
subjectRef.value = 'new value'

// Values emitted by the subject will update subjectRef
subject.next('from subject')
```

### Response
#### Success Response (200)
Returns a `Ref` that is bound to the RxJS Subject.

#### Response Example
```json
{
  "example": "Ref<string | undefined>"
}
```
```

--------------------------------

### Basic useFuse Implementation

Source: https://vueuse.org/integrations/useFuse

Import and use the useFuse composable with a search input and data array. The results will contain items that approximately match the input.

```typescript
import {
  useFuse
} from '@vueuse/integrations/useFuse'
import {
  shallowRef
} from 'vue'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = shallowRef('Jhon D')

const { results } = useFuse(input, data)

/*
 * Results:
 *
 * { "item": "John Doe", "index": 1 }
 * { "item": "John Smith", "index": 0 }
 * { "item": "Jane Doe", "index": 2 }
 *
 */
```

--------------------------------

### onStartTyping Type Declarations

Source: https://vueuse.org/core/onStartTyping

Provides the TypeScript type declarations for the onStartTyping function, including its callback and options. It specifies that the callback receives a KeyboardEvent.

```typescript
/**
 * Fires when users start typing on non-editable elements.
 *
 * @see https://vueuse.org/onStartTyping
 * @param callback
 * @param options
 */
export declare function 
onStartTyping
(
  
callback
: (event: KeyboardEvent) => void,
  
options
?: 
ConfigurableDocument
,
): void
```

--------------------------------

### Set Initial Title with useTitle

Source: https://vueuse.org/core/usetitle

Initialize the document title immediately by passing the desired title string as an argument to the useTitle composable.

```typescript
const
title
 = 
useTitle
('New Title')
```

```javascript
'use strict'
const title = useTitle('New Title')
```

--------------------------------

### Advanced useColorMode with System and Storage Access

Source: https://vueuse.org/core/useColorMode

Access system preference and stored override mode separately. Combine them to determine the effective color mode.

```typescript
import {
useColorMode
} from '@vueuse/core'

const { system, store } = useColorMode()


system.value // 'dark' | 'light'

store.value // 'dark' | 'light' | 'auto'

const myColorMode = computed(() =>
  store.value === 'auto' ? system.value : store.value
)

```

--------------------------------

### Basic Usage of useAsyncQueue

Source: https://vueuse.org/core/useasyncqueue

Demonstrates how to use useAsyncQueue to execute a series of asynchronous functions sequentially. The result of each task is passed to the next.

```typescript
import {
useAsyncQueue
} from '@vueuse/core'

function 
p1
() {
  return new 
Promise
(( 
resolve
) => {
    
setTimeout
(() => {
      
resolve
(1000)
    }, 10)
  })
}

function 
p2
(
result
: number) {
  return new 
Promise
(( 
resolve
) => {
    
setTimeout
(() => {
      
resolve
(1000 + 
result
)
    }, 20)
  })
}

const { 
activeIndex
,
result
 } = 
useAsyncQueue
([
p1
,
p2
])


console
.
log
(
activeIndex
. 
value
) // current pending task index


console
.
log
(
result
) // the tasks result
```

```javascript
import { useAsyncQueue } from '@vueuse/core'
function p1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000)
    }, 10)
  })
}
function p2(result) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000 + result)
    }, 20)
  })
}
const { activeIndex, result } = useAsyncQueue([p1, p2])
console.log(activeIndex.value) // current pending task index
console.log(result) // the tasks result
```

--------------------------------

### useTransition with Custom Easing (Cubic Bezier)

Source: https://vueuse.org/core/useTransition

Shows how to customize the transition's easing using a cubic bezier curve array.

```APIDOC
## GET /api/users/{id}

### Description
Retrieves a specific user by their ID.

### Method
GET

### Endpoint
/api/users/{id}

### Parameters
#### Path Parameters
- **id** (integer) - Required - The unique identifier of the user to retrieve.

#### Query Parameters
- **fields** (string) - Optional - A comma-separated list of fields to include in the response.

### Response
#### Success Response (200)
- **id** (integer) - The unique identifier for the user.
- **name** (string) - The name of the user.
- **email** (string) - The email address of the user.

#### Response Example
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```
```

--------------------------------

### reactiveOmit - Scenarios (Selectively passing props to child)

Source: https://vueuse.org/shared/reactiveomit

Illustrates a common use case for reactiveOmit: selectively passing props to a child component.

```APIDOC
## reactiveOmit - Scenarios: Selectively passing props to child

### Description
This scenario demonstrates how `reactiveOmit` can be used within a Vue component's setup function to filter props before passing them down to a child component.

### Method
```vue
<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'

const props = defineProps({
  value: String,
  color: String,
  font: String
})

const childProps = reactiveOmit(props, 'value')
</script>

<template>
  <div>
    <!-- only passes "color" and "font" props to child -->
    <ChildComp v-bind="childProps" />
  </div>
</template>
```

### Parameters
None for the `reactiveOmit` function itself in this context, as it operates on the `props` object.

### Request Example
See the `<script setup>` block in the Method section above.

### Response
#### Success Response (200)
The `childProps` object will contain all properties from the parent's `props` except for 'value'.

#### Response Example
If parent props are `{ value: 'someValue', color: 'red', font: 'Arial' }`,
then `childProps` will be `{ color: 'red', font: 'Arial' }`.
```

--------------------------------

### Basic Usage of reactivePick

Source: https://vueuse.org/shared/reactivePick

Demonstrates picking specific keys from a reactive object to create a new reactive subset.

```typescript
import { 
reactivePick
 } from '@vueuse/core'

const 
obj
 = 
reactive
({
  
x
: 0,
  
y
: 0,
  
elementX
: 0,
  
elementY
: 0,
})

const 
picked
 = 
reactivePick
(
obj
, 'x', 'elementX') // { x: number, elementX: number }
```

--------------------------------

### Basic Date Formatting

Source: https://vueuse.org/shared/useDateFormat

Formats the current date and time using a predefined token string. Ensure `useNow` and `useDateFormat` are imported.

```vue
<script setup lang="ts">
import { 
useDateFormat
, 
useNow
 } from '@vueuse/core'

const 
formatted
 = 
useDateFormat
(
useNow
(), 'YYYY-MM-DD HH:mm:ss')
</script>

<template>
  <
div
>{{ 
formatted
 }}</
div
>
</template>
```

--------------------------------

### Initialize useDeviceOrientation

Source: https://vueuse.org/core/usedeviceorientation

Import and destructure the reactive orientation properties from the composable.

```ts
import { 
useDeviceOrientation
 } from '@vueuse/core'

const {
  
isAbsolute
,
  
alpha
,
  
beta
,
  
gamma
,
} = 
useDeviceOrientation
()
```

--------------------------------

### Basic Usage of useRafFn

Source: https://vueuse.org/core/useRafFn

Demonstrates how to import and initialize the useRafFn hook to increment a counter on every animation frame.

```typescript
import { 
useRafFn
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
count
 = 
shallowRef
(0)

const { 
pause
, 
resume
 } = 
useRafFn
(() => {
  
count
.
value
++
  
console
.
log
(
count
.
value
)
})
```

--------------------------------

### useElementBounding - Component Usage

Source: https://vueuse.org/core/useelementbounding

Shows how to use the renderless component version of useElementBounding from `@vueuse/components`.

```APIDOC
## UseElementBounding Component

### Description
Provides a renderless component for useElementBounding.

### Method
Component

### Endpoint
N/A (Component)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<template>
  <UseElementBounding v-slot="{ width, height }">
    Width: {{ width }} Height: {{ height }}
  </UseElementBounding>
</template>
```

### Response
#### Success Response (v-slot props)
- **width** (number) - The width of the observed element.
- **height** (number) - The height of the observed element.

#### Response Example
```json
{
  "width": 140,
  "height": 100
}
```
```

--------------------------------

### Initialize useStorageAsync

Source: https://vueuse.org/core/useStorageAsync

Basic initialization of useStorageAsync. Note that the value may be the initial value before the async storage resolves.

```typescript
import { 
useStorageAsync
 } from '@vueuse/core'

const 
accessToken
 = 
useStorageAsync
('access.token', '', SomeAsyncStorage)

// accessToken.value may be empty before the async storage is ready

console
.
log
(
accessToken
.
value
) // ""


setTimeout
(() => {
  // After some time, the async storage is ready
  
console
.
log
(
accessToken
.
value
) // "the real value stored in storage"
}, 500)
```

--------------------------------

### useObservable Options

Source: https://vueuse.org/rxjs/useObservable

Details the available options for `useObservable`, including `initialValue` and `onError`.

```APIDOC
## useObservable Options

### Description

Configuration options for the `useObservable` function.

### Method

`useObservable`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```typescript
// Example demonstrating options
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'

const count = useObservable(
  interval(1000),
  {
    initialValue: 0,
    onError: (err) => {
      console.error('Observable error:', err)
    },
  },
)
```

### Response

#### Success Response (200)

- **count** (Ref<H | I>) - A Vue ref holding the observable's value.

#### Response Example

```json
{
  "value": "latest_emitted_value_or_initial_value"
}
```

### Options Table

| Option | Type | Description |
|---|---|---|
| `initialValue` | `T` | Value to use before the Observable emits |
| `onError` | `(err: any) => void` | Error handler for Observable errors |
```

--------------------------------

### Import useSpeechRecognition

Source: https://vueuse.org/core/usespeechrecognition

Import the useSpeechRecognition composable from VueUse. This sets up the reactive properties for speech recognition.

```typescript
import {
  useSpeechRecognition
} from '@vueuse/core'

const { 
  isSupported,
  isListening,
  isFinal,
  result,
  start,
  stop,
} = 
useSpeechRecognition
()
```

--------------------------------

### Basic usage of watchDebounced

Source: https://vueuse.org/shared/watchDebounced

Demonstrates the standard implementation of watchDebounced with debounce and maxWait options.

```typescript
import { 
watchDebounced
 } from '@vueuse/core'


watchDebounced
(
  source,
  () => { 
console
.
log
('changed!') },
  { 
debounce
: 500, 
maxWait
: 1000 },
)
```

--------------------------------

### useAsyncQueue Basic Usage

Source: https://vueuse.org/core/useAsyncQueue

Demonstrates the basic usage of useAsyncQueue to execute a series of asynchronous tasks sequentially and access their results.

```APIDOC
## useAsyncQueue Basic Usage

### Description
Executes each asynchronous task sequentially and passes the current task result to the next task.

### Method
`useAsyncQueue`

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import {
  useAsyncQueue
} from '@vueuse/core'

function p1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000)
    }, 10)
  })
}

function p2(result: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000 + result)
    }, 20)
  })
}

const { activeIndex, result } = useAsyncQueue([
  p1,
  p2
])

console.log(activeIndex.value) // current pending task index
console.log(result) // the tasks result
```

### Response
#### Success Response (200)
- **activeIndex** (ShallowRef<number>) - The index of the currently pending task.
- **result** (Array<UseAsyncQueueResult<any>>) - An array containing the state and data of each completed task.

#### Response Example
```json
{
  "activeIndex": 1,
  "result": [
    { "state": "fulfilled", "data": 1000 },
    { "state": "fulfilled", "data": 2000 }
  ]
}
```
```

--------------------------------

### Component Usage

Source: https://vueuse.org/core/onLongPress

Demonstrates how to use `onLongPress` as a renderless component from `@vueuse/components`.

```APIDOC
## OnLongPress Component

### Description
Provides a renderless component version of `onLongPress` for easier integration within Vue templates.

### Method
Component

### Endpoint
N/A (Component Usage)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```vue
<script setup lang="ts">
import { OnLongPress } from '@vueuse/components'
import { shallowRef } from 'vue'

const longPressedComponent = shallowRef(false)

function onLongPressCallbackComponent(e: PointerEvent) {
  longPressedComponent.value = true
}
function resetComponent() {
  longPressedComponent.value = false
}
</script>

<template>
  <p>Long Pressed: {{ longPressedComponent }}</p>
  <OnLongPress
    as="button"
    class="ml-2 button small"
    @trigger="onLongPressCallbackComponent"
  >
    Press long
  </OnLongPress>
  <button class="ml-2 button small" @click="resetComponent">
    Reset
  </button>
</template>
```

### Response
#### Success Response (200)
Emits a `trigger` event when a long press is detected.

#### Response Example
Event Payload: `PointerEvent`
```

--------------------------------

### useEyeDropper - Basic Usage

Source: https://vueuse.org/core/useEyeDropper

Demonstrates how to import and use the `useEyeDropper` composable in a Vue component.

```APIDOC
## useEyeDropper - Basic Usage

### Description
This snippet shows the basic import and usage of the `useEyeDropper` composable function.

### Method
`useEyeDropper`

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import {
  useEyeDropper
} from '@vueuse/core'

const { 
  isSupported,
  open,
  sRGBHex
} = 
useEyeDropper
()
```

### Response
#### Success Response (N/A - Returns reactive properties)
- **isSupported** (boolean) - Indicates if the EyeDropper API is supported by the browser.
- **sRGBHex** (ShallowRef<string>) - A reactive reference holding the selected color in sRGB hex format.
- **open** (function) - A function to open the Eye Dropper.

#### Response Example
```json
{
  "isSupported": true,
  "sRGBHex": "#ff0000",
  "open": () => Promise<{ sRGBHex: string } | undefined>
}
```
```

--------------------------------

### Usage of logicAnd

Source: https://vueuse.org/math/logicAnd

Demonstrates how to use logicAnd to trigger a callback whenever multiple refs evaluate to true.

```typescript
import { 
whenever
 } from '@vueuse/core'
import { 
logicAnd
 } from '@vueuse/math'

const 
a
 = 
ref
(true)
const 
b
 = 
ref
(false)


whenever
(
logicAnd
(
a
, 
b
), () => {
  
console
.
log
('both a and b are now truthy!')
})
```

--------------------------------

### Usage of useAbs

Source: https://vueuse.org/math/useabs

Demonstrates how to import and use useAbs with a reactive ref to obtain the absolute value.

```typescript
import { 
useAbs
 } from '@vueuse/math'

const 
value
 = 
ref
(-23)
const 
absValue
 = 
useAbs
(
value
) // Ref<23>
```

--------------------------------

### useFileSystemAccess Composable

Source: https://vueuse.org/core/useFileSystemAccess

Provides methods and reactive state to interact with local files via the File System Access API.

```APIDOC
## useFileSystemAccess

### Description
A Vue composable that provides a reactive interface for the browser's File System Access API, enabling file creation, reading, and writing.

### Return Values
- **isSupported** (boolean) - Indicates if the browser supports the File System Access API.
- **data** (any) - The current content of the file.
- **file** (File) - The underlying File object.
- **fileName** (string) - The name of the currently opened file.
- **fileMIME** (string) - The MIME type of the file.
- **fileSize** (number) - The size of the file in bytes.
- **fileLastModified** (number) - The last modified timestamp.
- **create** (function) - Method to create a new file.
- **open** (function) - Method to open an existing file.
- **save** (function) - Method to save changes to the current file.
- **saveAs** (function) - Method to save the file as a new file.
- **updateData** (function) - Method to update the file data.

### Usage Example
```ts
import { useFileSystemAccess } from '@vueuse/core'

const { data, open, save } = useFileSystemAccess()
```
```

--------------------------------

### Implement useDebouncedRefHistory

Source: https://vueuse.org/core/useDebouncedRefHistory

Demonstrates how to initialize the function with a shallowRef and configure the debounce delay.

```typescript
import { 
useDebouncedRefHistory
 } from '@vueuse/core'
import { 
shallowRef
 } from 'vue'

const 
counter
 = 
shallowRef
(0)
const { 
history
, 
undo
, 
redo
 } = 
useDebouncedRefHistory
(
counter
, { 
deep
: true, 
debounce
: 1000 })
```

--------------------------------

### Passing Data with createReusableTemplate

Source: https://vueuse.org/core/createreusabletemplate

Demonstrates how to pass data to the reusable template using slots and props.

```APIDOC
## Passing Data with createReusableTemplate

### Description
This example shows how to pass data into the reusable template. Data can be accessed within `<DefineTemplate>` using `v-slot` and passed to `<ReuseTemplate>` via props.

### Method
`createReusableTemplate` function

### Endpoint
N/A (Composable function)

### Parameters
None directly for the function call.

### Request Example
```vue
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
</script>

<template>
  <DefineTemplate v-slot="{ data, msg, anything ">
    <div>{{ data }} passed from usage</div>
  </DefineTemplate>

  <ReuseTemplate :data="data" msg="The first usage" />
  <ReuseTemplate :data="anotherData" msg="The second usage" />
  <ReuseTemplate v-bind="{ data: something, msg: 'The third' }" />
</template>
```

### Response
- Data passed via props to `<ReuseTemplate>` is available within the template defined in `<DefineTemplate>` via the `v-slot`.

### Response Example
N/A (Component rendering example.)
```

--------------------------------

### useIpcRenderer

Source: https://vueuse.org/electron/README

Provides ipcRenderer and all of its APIs with Vue reactivity.

```APIDOC
## Functions

`@vueuse/electron` provides the following functions

* `useIpcRenderer` — provides ipcRenderer and all of its APIs with Vue reactivity
```

--------------------------------

### useCycleList

Source: https://vueuse.org/core/useCycleList

The useCycleList function accepts a list of items and optional configuration, returning reactive state and navigation methods.

```APIDOC
## useCycleList

### Description
Cycle through a list of items reactively.

### Parameters
#### Arguments
- **list** (MaybeRefOrGetter<T[]>) - Required - The list of items to cycle through.
- **options** (UseCycleListOptions<T>) - Optional - Configuration object.

#### Options
- **initialValue** (MaybeRef<T>) - Optional - The initial value of the state.
- **fallbackIndex** (number) - Optional - The default index when no match is found.
- **getIndexOf** (function) - Optional - Custom function to get the index of the current value.

### Response
#### Return Object
- **state** (ShallowRef<T>) - The current active item.
- **index** (WritableComputedRef<number>) - The current index in the list.
- **next** (function) - Function to move to the next item.
- **prev** (function) - Function to move to the previous item.
- **go** (function) - Function to jump to a specific index.

### Request Example
import { useCycleList } from '@vueuse/core'

const { state, next, prev, go } = useCycleList(['Dog', 'Cat', 'Lizard'])

console.log(state.value) // 'Dog'
prev() // 'Lizard'
go(1) // 'Cat'
```

--------------------------------

### Usage of useRouteParams

Source: https://vueuse.org/router/userouteparams

Demonstrates basic usage, default values, and value transformation for route parameters.

```typescript
import { 
useRouteParams
 } from '@vueuse/router'

const 
userId
 = 
useRouteParams
('userId')

const 
userId
 = 
useRouteParams
('userId', '-1') // or with a default value

const 
userId
 = 
useRouteParams
('page', '1', { 
transform
: 
Number
 }) // or transforming value


console
.
log
(
userId
.
value
) // route.params.userId

userId
.
value
 = '100' // router.replace({ params: { userId: '100' } })
```

--------------------------------

### useFetch

Source: https://vueuse.org/core/usefetch

The core composable for making HTTP requests. It can be used with various overloads depending on the arguments provided.

```APIDOC
## useFetch

### Description
Provides a composable function for making HTTP requests with Vue. It supports various overloads for different use cases.

### Method
GET (implicitly, but used for any HTTP method)

### Endpoint
`/url` (dynamic based on input)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None (for the basic `useFetch` signature)

### Request Example
```json
{
  "example": "// Basic usage\nconst { data } = useFetch('/api/users').json()\n
// With options\nconst { data } = useFetch('/api/posts', { method: 'POST' }, { refetch: true })"
}
```

### Response
#### Success Response (200)
- **data** (any) - The data returned from the fetch request.
- **error** (Ref<Error | null>) - A ref containing any error that occurred during the fetch.
- **isFetching** (Ref<boolean>) - A ref indicating if the request is currently in progress.
- **isFinished** (Ref<boolean>) - A ref indicating if the request has completed.

#### Response Example
```json
{
  "example": "// Example success response structure depends on the API\n{\"id\": 1, \"title\": \"Example Post\" }"
}
```
```

--------------------------------

### useVModels - Composition API Usage

Source: https://vueuse.org/core/usevmodels

Demonstrates how to use the `useVModels` composable with Vue's Composition API. It takes props and emit functions as arguments and returns reactive references for each prop that can be directly used with v-model.

```APIDOC
## useVModels - Composition API

### Description
Shorthand for props v-model binding. Think it like `toRefs(props)` but changes will also trigger emit.

### Method
Composition API function

### Endpoint
N/A (Composable function)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
```typescript
import { useVModels } from '@vueuse/core'

const props = defineProps({
  foo: String,
  bar: Number,
})

const emit = defineEmits(['update:foo', 'update:bar'])

const { foo, bar } = useVModels(props, emit)
```

### Response
#### Success Response (200)
Returns reactive references for each prop that can be used with v-model.

#### Response Example
```json
{
  "foo": "",
  "bar": 0
}
```
```