### Bootstrap Project Dependencies

Source: https://element-plus.org/en-US/guide/dev-guide

Installs all necessary project dependencies using pnpm. This is the first step required before starting development.

```shell
pnpm i
```

--------------------------------

### Install Element Plus via Package Manager

Source: https://element-plus.org/en-US/guide/installation

Commands to install the library using common Node.js package managers.

```shell
$ npm install element-plus --save
```

```shell
$ yarn add element-plus
```

```shell
$ pnpm install element-plus
```

--------------------------------

### Install @element-plus/icons-vue with npm

Source: https://element-plus.org/en-US/component/icon

Use this command to install the icons package using npm.

```shell
$ npm install @element-plus/icons-vue
```

--------------------------------

### Install @element-plus/icons-vue with pnpm

Source: https://element-plus.org/en-US/component/icon

Use this command to install the icons package using pnpm.

```shell
$ pnpm install @element-plus/icons-vue
```

--------------------------------

### Page Header - Complete Example

Source: https://element-plus.org/en-US/component/page-header.html

A comprehensive example demonstrating the full capabilities of the Page Header component, including breadcrumbs, content slots, extra actions, and descriptions.

```APIDOC
## Page Header - Complete Example

### Description
This example showcases a fully featured Page Header with breadcrumbs, custom content, action buttons, and detailed descriptions.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
N/A (Component Usage)

### Request Example
```vue
<template>
  <div aria-label="A complete example of page header">
    <el-page-header @back="onBack">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: './page-header.html' }">
            homepage
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="./page-header.html">route 1</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>route 2</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="flex items-center">
          <el-avatar
            class="mr-3"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="text-large font-600 mr-3"> Title </span>
          <span
            class="text-sm mr-2"
            style="color: var(--el-text-color-regular)"
          >
            Sub title
          </span>
          <el-tag>Default</el-tag>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </template>

      <el-descriptions :column="3" size="small" class="mt-4">
        <el-descriptions-item label="Username">
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item label="Telephone">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
        <el-descriptions-item label="Remarks">
          <el-tag size="small">School</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Address">
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </el-descriptions-item>
      </el-descriptions>
      <p class="mt-4 text-sm">
        Element Plus team uses <b>weekly</b> release strategy under normal
        circumstance, but critical bug fixes would require hotfix so the actual
        release number <b>could be</b> more than 1 per week.
      </p>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'

const onBack = () => {
  notify('Back')
}
</script>
```

### Response
N/A (Component Usage)
```

--------------------------------

### Install Auto Import Dependencies

Source: https://element-plus.org/en-US/guide/quickstart

Install necessary packages for automatic component and API imports in your project.

```shell
$ npm install -D unplugin-vue-components unplugin-auto-import
```

```shell
$ yarn add -D unplugin-vue-components unplugin-auto-import
```

```shell
$ pnpm install -D unplugin-vue-components unplugin-auto-import
```

--------------------------------

### Launch Documentation Preview

Source: https://element-plus.org/en-US/guide/dev-guide

Starts the documentation development server to preview existing components in the browser.

```shell
pnpm docs:dev
```

--------------------------------

### Hello World with CDN

Source: https://element-plus.org/en-US/guide/installation

A complete HTML example demonstrating how to initialize Element Plus with Vue 3 via CDN.

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <script src="https://unpkg.com/vue@3"></script>
    <!-- import CSS -->
    <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
    <!-- import JavaScript -->
    <script src="https://unpkg.com/element-plus"></script>
    <title>Element Plus demo</title>
  </head>
  <body>
    <div id="app">
      <el-button>{{ message }}</el-button>
    </div>
    <script>
      const App = {
        data() {
          return {
            message: "Hello Element Plus",
          };
        },
      };
      const app = Vue.createApp(App);
      app.use(ElementPlus);
      app.mount("#app");
    </script>
  </body>
</html>
```

--------------------------------

### Install @element-plus/icons-vue with yarn

Source: https://element-plus.org/en-US/component/icon

Use this command to install the icons package using yarn.

```shell
$ yarn add @element-plus/icons-vue
```

--------------------------------

### Basic Timeline Example

Source: https://element-plus.org/en-US/component/timeline

A basic example of the el-timeline component displaying a list of events with timestamps and card content.

```vue
<template>
  <el-timeline>
    <el-timeline-item center timestamp="2018/4/12" placement="top">
      <el-card>
        <h4>Update Github template</h4>
        <p>Tom committed 2018/4/12 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/3" placement="top">
      <el-card>
        <h4>Update Github template</h4>
        <p>Tom committed 2018/4/3 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item center timestamp="2018/4/2" placement="top">
      Event start
    </el-timeline-item>
    <el-timeline-item timestamp="2018/4/2" placement="top">
      Event end
    </el-timeline-item>
  </el-timeline>
</template>
```

--------------------------------

### Install Nuxt.js Module

Source: https://element-plus.org/en-US/guide/quickstart

Install the official Element Plus Nuxt.js module for seamless integration.

```shell
$ npm install -D @element-plus/nuxt
```

```shell
$ yarn add -D @element-plus/nuxt
```

```shell
$ pnpm install -D @element-plus/nuxt
```

--------------------------------

### Element Plus Descriptions with Sizes and Borders in Vue

Source: https://element-plus.org/en-US/component/descriptions

Illustrates advanced configurations of the Element Plus Descriptions component, including different size options (large, default, small) and bordered layouts. It also shows how to integrate icons and custom content within description items. This example utilizes Vue.js and its script setup syntax.

```vue
<template>
  <el-radio-group v-model="size">
    <el-radio value="large">Large</el-radio>
    <el-radio value="default">Default</el-radio>
    <el-radio value="small">Small</el-radio>
  </el-radio-group>

  <el-descriptions
    class="margin-top"
    title="With border"
    :column="3"
    :size="size"
    border
  >
    <template #extra>
      <el-button type="primary">Operation</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          Username
        </div>
      </template>
      kooriookami
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          Telephone
        </div>
      </template>
      18100000000
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <location />
          </el-icon>
          Place
        </div>
      </template>
      Suzhou
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          Remarks
        </div>
      </template>
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          Address
        </div>
      </template>
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    class="margin-top"
    title="Without border"
    :column="3"
    :size="size"
    :style="blockMargin"
  >
    <template #extra>
      <el-button type="primary">Operation</el-button>
    </template>
    <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
    <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from '@element-plus/icons-vue'

import type { ComponentSize } from 'element-plus'

const size = ref<ComponentSize>('default')

const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})
</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
```

--------------------------------

### Start Local Development Environment

Source: https://element-plus.org/en-US/guide/dev-guide

Initializes the local development environment for active component work. Requires manual registration of components in App.vue.

```shell
pnpm dev
```

--------------------------------

### Animated Tooltip Example

Source: https://element-plus.org/en-US/component/tooltip.html

Customize tooltip animations using the `transition` prop. This example uses a 'slide-fade' transition, with custom enter and leave animations defined in the CSS.

```vue
<template>
  <el-tooltip content="I am an el-tooltip" transition="slide-fade">
    <el-button>trigger me</el-button>
  </el-tooltip>
</template>

<script lang="ts" setup></script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(120px);
  opacity: 0;
}
</style>
```

--------------------------------

### Skeleton Component Usage

Source: https://element-plus.org/en-US/component/skeleton

Example of using the ElSkeleton component with throttle for smooth loading transitions. It demonstrates how to toggle the loading state and provides a template for the skeleton and the actual content.

```APIDOC
## Skeleton Component Usage Example

### Description
This example demonstrates how to use the `el-skeleton` component to create a smooth loading experience. It utilizes the `throttle` attribute to control the delay of the skeleton's appearance and disappearance, preventing UI bouncing. The example includes a switch to toggle the loading state and shows both the skeleton template and the actual content.

### Method
N/A (This is a UI component example, not an API endpoint)

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <el-space direction="vertical" alignment="flex-start">
    <div>
      <label style="margin-right: 16px">Switch Loading</label>
      <el-switch v-model="loading" />
    </div>
    <el-skeleton
      style="width: 240px"
      :loading="loading"
      animated
      :throttle="{ leading: 500, trailing: 500, initVal: true }"
    >
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 265px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom card-header">
              <div class="time">{{ currentDate }}</div>
              <el-button text class="button">operation button</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(false)
const currentDate = new Date().toDateString()
</script>
```

### Response
N/A
```

--------------------------------

### Implement Complete PageHeader with Metadata

Source: https://element-plus.org/en-US/component/page-header.html

A complex example demonstrating the use of breadcrumbs, custom content, action buttons, and a descriptions component within a PageHeader.

```vue
<template>
  <div aria-label="A complete example of page header">
    <el-page-header @back="onBack">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: './page-header.html' }">
            homepage
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="./page-header.html">route 1</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>route 2</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="flex items-center">
          <el-avatar
            class="mr-3"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="text-large font-600 mr-3"> Title </span>
          <span
            class="text-sm mr-2"
            style="color: var(--el-text-color-regular)"
          >
            Sub title
          </span>
          <el-tag>Default</el-tag>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </template>

      <el-descriptions :column="3" size="small" class="mt-4">
        <el-descriptions-item label="Username">
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item label="Telephone">
          18100000000
        </el-descriptions-item>
        <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
        <el-descriptions-item label="Remarks">
          <el-tag size="small">School</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Address">
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </el-descriptions-item>
      </el-descriptions>
      <p class="mt-4 text-sm">
        Element Plus team uses <b>weekly</b> release strategy under normal
        circumstance, but critical bug fixes would require hotfix so the actual
        release number <b>could be</b> more than 1 per week.
      </p>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { ElNotification as notify } from 'element-plus'

const onBack = () => {
  notify('Back')
}
</script>
```

--------------------------------

### Create Grouped Table Headers in Element Plus

Source: https://element-plus.org/en-US/component/table

This example demonstrates how to nest el-table-column components to create a multi-level header structure. It uses a Vue 3 setup script to define the table data and the template to render the hierarchical columns.

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="150" />
    <el-table-column label="Delivery Info">
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column label="Address Info">
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="zip" label="Zip" width="120" />
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]
</script>
```

--------------------------------

### Striped Progress Example

Source: https://element-plus.org/en-US/component/progress

Example of using the striped attribute for progress bars, with options for flowing stripes and custom durations.

```APIDOC
## Striped progress 

Use `striped` attribute to set striped progress. You can use `striped-flow` to get the stripes to flow, with `duration` to control the animation duration.

```vue
<template>
  <div class="demo-progress">
    <el-progress :percentage="50" :stroke-width="15" striped />
    <el-progress
      :percentage="30"
      :stroke-width="15"
      status="warning"
      striped
      striped-flow
    />
    <el-progress
      :percentage="100"
      :stroke-width="15"
      status="success"
      striped
      striped-flow
      :duration="10"
    />
    <el-progress
      :percentage="percentage"
      :stroke-width="15"
      status="exception"
      striped
      striped-flow
      :duration="duration"
    />
    <el-button-group>
      <el-button :icon="Minus" @click="decrease" />
      <el-button :icon="Plus" @click="increase" />
    </el-button-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref<number>(70)
const duration = computed(() => Math.floor(percentage.value / 10))

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
```
```

--------------------------------

### Tree Node Filtering Example

Source: https://element-plus.org/en-US/component/tree-v2

This example demonstrates how to use the `filter-method` prop with the `filter` method to filter tree nodes based on user input.

```APIDOC
## Tree node filtering

The `filter-method` prop allows you to customize the filtering logic for tree nodes. The `filter` method on the Tree instance can be invoked to trigger the filtering process.

### Usage
1. Define a `filter-method` function that takes a query string and a node object, returning `true` if the node should be visible, `false` otherwise.
2. Set the `filter-method` prop on the `el-tree-v2` component to your custom filtering function.
3. Call the `filter` method on the tree instance (e.g., `treeRef.value.filter(query)`) when the filter criteria changes (e.g., on input).

### Example Code
```vue
<template>
  <el-input
    v-model="query"
    style="width: 240px"
    placeholder="Please enter keyword"
    @input="onQueryChanged"
  />
  <el-tree-v2
    ref="treeRef"
    style="max-width: 600px"
    :data="data"
    :props="props"
    :filter-method="filterMethod"
    :height="200"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TreeNodeData, TreeV2Instance } from 'element-plus'

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const getKey = (prefix: string, id: number) => `${prefix}-${id}`

const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = 'node'
): Tree[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber = 
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const query = ref('')
const treeRef = ref<TreeV2Instance>()
const data = createData(4, 30, 5)
const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}

const onQueryChanged = (query: string) => {
  treeRef.value!.filter(query)
}
const filterMethod = (query: string, node: TreeNodeData) =>
  node.label!.includes(query)
</script>
```
```

--------------------------------

### Image Preview in Table

Source: https://element-plus.org/en-US/component/table

Example demonstrating how to integrate an image preview within a table column using the scoped slot.

```APIDOC
## Usage: Image Preview

### Description
Use the `el-image` component inside an `el-table-column` template to enable image previews.

### Example
```vue
<template>
  <el-table-column width="180">
    <template #default="scope">
      <el-image preview-teleported :preview-src-list="srcList" />
    </template>
  </el-table-column>
</template>
```
```

--------------------------------

### Form Size Control Example

Source: https://element-plus.org/en-US/component/form

This example demonstrates how to control the size of form components. It shows how to use radio buttons to change the global size of the form and the label position. The form includes various input fields, select dropdowns, date and time pickers, and radio/checkbox groups.

```vue
<template>
  <div>
    <el-radio-group v-model="size" aria-label="size control">
      <el-radio-button value="large">large</el-radio-button>
      <el-radio-button value="default">default</el-radio-button>
      <el-radio-button value="small">small</el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="labelPosition" aria-label="position control">
      <el-radio-button value="left">Left</el-radio-button>
      <el-radio-button value="right">Right</el-radio-button>
      <el-radio-button value="top">Top</el-radio-button>
    </el-radio-group>
  </div>
  <br />
  <el-form
    style="max-width: 600px"
    :model="sizeForm"
    label-width="auto"
    :label-position="labelPosition"
    :size="size"
  >
    <el-form-item label="Activity name">
      <el-input v-model="sizeForm.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select
        v-model="sizeForm.region"
        placeholder="please select your zone"
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="sizeForm.date1"
          type="date"
          aria-label="Pick a date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="sizeForm.date2"
          aria-label="Pick a time"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="sizeForm.type">
        <el-checkbox-button value="Online activities" name="type">
          Online activities
        </el-checkbox-button>
        <el-checkbox-button value="Promotion activities" name="type">
          Promotion activities
        </el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="sizeForm.resource">
        <el-radio border value="Sponsor">Sponsor</el-radio>
        <el-radio border value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { ComponentSize, FormProps } from 'element-plus'

const size = ref<ComponentSize>('default')
const labelPosition = ref<FormProps['labelPosition']>('right')

const sizeForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

function onSubmit() {
  console.log('submit!')
}
</script>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
```

--------------------------------

### Local Import and Custom Icon

Source: https://element-plus.org/en-US/component/notification

Example of importing the ElNotification component and using a custom icon for the close action.

```javascript
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

ElNotification({
  title: 'Title',
  message: 'This is a message',
  closeIcon: CloseBold,
})
```

--------------------------------

### Create a Basic Form with Element Plus

Source: https://element-plus.org/en-US/component/form

A comprehensive example demonstrating a form with various input types including text, select, date/time pickers, switches, checkboxes, and radio buttons.

```vue
<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox value="Online activities" name="type">
          Online activities
        </el-checkbox>
        <el-checkbox value="Promotion activities" name="type">
          Promotion activities
        </el-checkbox>
        <el-checkbox value="Offline activities" name="type">
          Offline activities
        </el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type">
          Simple brand exposure
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>
```

--------------------------------

### Pagination Examples

Source: https://element-plus.org/en-US/component/pagination

Demonstrates different configurations of the ElPagination component, including total item count, page size selection, jump to page functionality, and combined layouts. It also shows how to handle size change and current page change events.

```APIDOC
## ElPagination Component Examples

### Description
This section showcases various use cases for the Element Plus Pagination component, demonstrating its flexibility in handling different display and interaction requirements.

### Method
N/A (This is a UI component example)

### Endpoint
N/A (This is a UI component example)

### Parameters

#### Component Props
- **v-model:current-page** (number) - The current active page.
- **page-size** (number) - Items per page. Default is 10.
- **total** (number) - Total number of data items.
- **page-sizes** (array of numbers) - Options for the number of items per page. Example: `[100, 200, 300, 400]`.
- **layout** (string) - Which parts of the pagination component to display. Possible values: `total`, `sizes`, `prev`, `pager`, `next`, `jumper`.
- **size** (ComponentSize) - Size of the pagination component. Options: `default`, `large`, `small`.
- **background** (boolean) - Whether the pagination component has a background color.
- **disabled** (boolean) - Whether the pagination component is disabled.

### Events
- **@size-change** (val: number) - Triggered when the number of items per page changes.
- **@current-change** (val: number) - Triggered when the current page changes.

### Request Example
```vue
<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[100, 200, 300, 400]"
    :size="size"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const currentPage = ref(4)
const pageSize = ref(100)
const size = ref('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`$ {val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: $ {val}`)
}
</script>
```

### Response
N/A (This is a UI component example)

#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### File List with Thumbnails

Source: https://element-plus.org/en-US/component/upload

Displays a list of uploaded files with thumbnails. This example uses the `picture` list type and configures `on-preview` and `on-remove` handlers.

```vue
<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    list-type="picture"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}
</script>
```

--------------------------------

### Virtual Triggering Example

Source: https://element-plus.org/en-US/component/dropdown

This example demonstrates how to use the `virtual-triggering` and `virtual-ref` props to attach a dropdown to a separate trigger element. The dropdown is shown on a right-click event on a card component.

```APIDOC
## Virtual triggering 2.11.3

Sometimes we want to render the dropdown on some other trigger element, we can separate the trigger and the content.
Right click 

```vue
<template>
  <el-card
    class="content"
    body-class="card-body"
    @click="handleClick"
    @contextmenu="handleContextmenu"
  >
    Right click
  </el-card>
  <el-dropdown
    ref="dropdownRef"
    :virtual-ref="triggerRef"
    :show-arrow="false"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
    }"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom-start"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
        <el-dropdown-item :icon="CirclePlusFilled"> Action 2 </el-dropdown-item>
        <el-dropdown-item :icon="CirclePlus">Action 3</el-dropdown-item>
        <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
        <el-dropdown-item :icon="CircleCheck">Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from '@element-plus/icons-vue'

import type { DropdownInstance } from 'element-plus'

const dropdownRef = ref<DropdownInstance>()
const position = ref({ 
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value,
})

const handleClick = () => {
  dropdownRef.value?.handleClose()
}

const handleContextmenu = (event: MouseEvent) => {
  const { clientX, clientY } = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropdownRef.value?.handleOpen()
}
</script>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.content :deep(.card-body) {
  flex-grow: 0;
}
</style>
```
```

--------------------------------

### Basic Virtualized Table Usage

Source: https://element-plus.org/en-US/component/table-v2

Demonstrates rendering a table with 10 columns and 1000 rows using the `el-table-v2` component. Ensure the `columns` and `data` props are correctly defined. This example uses Vue.js.

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script lang="ts" setup>
const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 1000)
</script>
```

--------------------------------

### Singleton Tooltip Example

Source: https://element-plus.org/en-US/component/tooltip.html

Implement a singleton tooltip using virtual triggering. This allows multiple triggers to share a single tooltip instance. Note the known issue with bouncing out from unexpected places.

```vue
<template>
  <div>
    <el-button
      v-for="i in 3"
      :key="i"
      @mouseover="(e) => (buttonRef = e.currentTarget)"
      @click="visible = !visible"
      >Click to open tooltip</el-button
    >
  </div>

  <el-tooltip
    ref="tooltipRef"
    :visible="visible"
    :popper-options="{
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            enabled: false,
          },
        },
      ],
    }"
    :virtual-ref="buttonRef"
    virtual-triggering
    popper-class="singleton-tooltip"
  >
    <template #content>
      <span> Some content </span>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const buttonRef = ref()
const tooltipRef = ref()

const visible = ref(false)
</script>

<style>
.singleton-tooltip {
  transition: transform 0.3s var(--el-transition-function-fast-bezier);
}
</style>
```

--------------------------------

### Form Accessibility Example

Source: https://element-plus.org/en-US/component/form

Demonstrates how to manage form accessibility, particularly label association with inputs and ARIA roles for grouped inputs.

```APIDOC
## Accessibility 
When only a single input (or related control such as select or checkbox) is inside of a `el-form-item`, the form item's label will automatically be attached to that input. However, if multiple inputs are inside of the `el-form-item`, the form item will be assigned the WAI-ARIA role of group instead. In this case, it is your responsibility to assign assistive labels to the individual inputs. 
__
"Full Name" label is automatically attached to the input:
Full Name
 __
"Your Information" serves as a label for the group of inputs.  
You must specify labels on the individal inputs. Placeholders are not replacements for using the "label" attribute. 
Your Information
TS
JS
 ________
```vue
<template>
  <el-form label-position="left" label-width="auto" style="max-width: 600px">
    <el-space fill>
      <el-alert type="info" show-icon :closable="false">
        <p>"Full Name" label is automatically attached to the input:</p>
      </el-alert>
      <el-form-item label="Full Name">
        <el-input v-model="formAccessibility.fullName" />
      </el-form-item>
    </el-space>
    <el-space fill>
      <el-alert type="info" show-icon :closable="false">
        <p>
          "Your Information" serves as a label for the group of inputs. <br />
          You must specify labels on the individal inputs. Placeholders are not
          replacements for using the "label" attribute.
        </p>
      </el-alert>
      <el-form-item label="Your Information">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="formAccessibility.firstName"
              aria-label="First Name"
              placeholder="First Name"
            />
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="formAccessibility.lastName"
              aria-label="Last Name"
              placeholder="Last Name"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-space>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formAccessibility = reactive({
  fullName: '',
  firstName: '',
  lastName: '',
})
</script>
```
```

--------------------------------

### Full Import in Vue.js

Source: https://element-plus.org/en-US/guide/quickstart

Use this method for convenient setup when bundle size is not a primary concern. Ensure Element Plus CSS is imported.

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

--------------------------------

### Checkable Tag Examples

Source: https://element-plus.org/en-US/component/tag

Illustrates how to use the `el-check-tag` component for creating checkbox-like tags, including toggling states and disabled options.

```APIDOC
## Checkable Tag

Sometimes because of the business needs, we might need checkbox like tag, but **button like checkbox** cannot meet our needs, here comes `check-tag`. You can use `type` prop in 2.5.4.

### Basic Usage

```vue
<template>
  <div class="flex gap-2">
    <el-check-tag checked>Checked</el-check-tag>
    <el-check-tag :checked="checked" @change="onChange">Toggle me</el-check-tag>
    <el-check-tag disabled>Disabled</el-check-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-check-tag :checked="checked1" type="primary" @change="onChange1">
      Tag 1
    </el-check-tag>
    <el-check-tag :checked="checked2" type="success" @change="onChange2">
      Tag 2
    </el-check-tag>
    <el-check-tag :checked="checked3" type="info" @change="onChange3">
      Tag 3
    </el-check-tag>
    <el-check-tag :checked="checked4" type="warning" @change="onChange4">
      Tag 4
    </el-check-tag>
    <el-check-tag :checked="checked5" type="danger" @change="onChange5">
      Tag 5
    </el-check-tag>
    <el-check-tag
      :checked="checked6"
      disabled
      type="success"
      @change="onChange6"
    >
      Tag 6
    </el-check-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const checked = ref(false)
const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)
const checked5 = ref(true)
const checked6 = ref(true)

const onChange = (status: boolean) => {
  checked.value = status
}

const onChange1 = (status: boolean) => {
  checked1.value = status
}

const onChange2 = (status: boolean) => {
  checked2.value = status
}

const onChange3 = (status: boolean) => {
  checked3.value = status
}

const onChange4 = (status: boolean) => {
  checked4.value = status
}

const onChange5 = (status: boolean) => {
  checked5.value = status
}

const onChange6 = (status: boolean) => {
  checked6.value = status
}
</script>
```
```

--------------------------------

### Element Plus Avatar Group - Default and Collapse Examples

Source: https://element-plus.org/en-US/component/avatar

Demonstrates the default usage of the el-avatar-group component, as well as examples using collapse-avatars, collapse-class, collapse-style, max-collapse-avatars, and collapse-avatars-tooltip. These examples showcase different ways to manage and display avatars within a group.

```vue
<template>
  <div class="m-4">
    <p>default</p>
    <el-avatar-group>
      <el-avatar v-for="number in 5" :key="number" :src="circleUrl" />
    </el-avatar-group>
  </div>
  <div class="m-4">
    <p>use collapse-avatars</p>
    <el-avatar-group collapse-avatars>
      <el-avatar v-for="number in 5" :key="number" :src="circleUrl" />
    </el-avatar-group>
  </div>
  <div class="m-4">
    <p>use collapse-class and collapse-style</p>
    <el-avatar-group
      collapse-avatars
      :collapse-style="{ 'background-color': '#d9ecff' }"
      collapse-class="my-collapse-avatar"
    >
      <el-avatar v-for="number in 5" :key="number" :src="circleUrl" />
    </el-avatar-group>
  </div>
  <div class="m-4">
    <p>use max-collapse-avatars</p>
    <el-avatar-group collapse-avatars :max-collapse-avatars="3">
      <el-avatar v-for="number in 5" :key="number" :src="circleUrl" />
    </el-avatar-group>
  </div>
  <div class="m-4">
    <p>use collapse-avatars-tooltip</p>
    <el-avatar-group
      collapse-avatars
      :max-collapse-avatars="3"
      collapse-avatars-tooltip
    >
      <el-avatar v-for="number in 5" :key="number" :src="circleUrl" />
    </el-avatar-group>
  </div>
</template>

<script lang="ts" setup>
const circleUrl =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
</script>

<style>
.my-collapse-avatar {
  color: #409eff;
}
</style>
```

--------------------------------

### Implement Table Summary Rows with Element Plus

Source: https://element-plus.org/en-US/component/table

Demonstrates how to enable default summary rows and how to provide a custom summary-method for advanced calculations. The example includes both a standard auto-summing table and a customized table with specific formatting.

```vue
<template>
  <el-table :data="tableData" border show-summary style="width: 100%">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="amount1" sortable label="Amount 1" />
    <el-table-column prop="amount2" sortable label="Amount 2" />
    <el-table-column prop="amount3" sortable label="Amount 3" />
  </el-table>

  <el-table
    :data="tableData"
    border
    height="200"
    :summary-method="getSummaries"
    show-summary
    style="width: 100%; margin-top: 20px"
  >
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="amount1" label="Cost 1 ($)" />
    <el-table-column prop="amount2" label="Cost 2 ($)" />
    <el-table-column prop="amount3" label="Cost 3 ($)" />
  </el-table>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import type { VNode } from 'vue'
import type { TableColumnCtx } from 'element-plus'

interface Product {
  id: string
  name: string
  amount1: string
  amount2: string
  amount3: number
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', { style: { textDecoration: 'underline' } }, [
        'Total Cost',
      ])
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = 'N/A'
    }
  })

  return sums
}

const tableData: Product[] = [
  { id: '12987122', name: 'Tom', amount1: '234', amount2: '3.2', amount3: 10 },
  { id: '12987123', name: 'Tom', amount1: '165', amount2: '4.43', amount3: 12 },
  { id: '12987124', name: 'Tom', amount1: '324', amount2: '1.9', amount3: 9 },
  { id: '12987125', name: 'Tom', amount1: '621', amount2: '2.2', amount3: 17 },
  { id: '12987126', name: 'Tom', amount1: '539', amount2: '4.1', amount3: 15 },
]
</script>
```

--------------------------------

### Basic TreeSelect Usage

Source: https://element-plus.org/en-US/component/tree-select

Demonstrates the basic setup of the TreeSelect component with hierarchical data. Use this for simple tree-based selections.

```vue
<template>
  <el-tree-select
    v-model="value"
    :data="data"
    :render-after-expand="false"
    style="width: 240px"
  />
  <el-divider />
  show checkbox:
  <el-tree-select
    v-model="value"
    :data="data"
    :render-after-expand="false"
    show-checkbox
    style="width: 240px"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref()

const data = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
</script>
```

--------------------------------

### Prevent Switching

Source: https://element-plus.org/en-US/component/switch

Demonstrates how to use the `before-change` property to control whether a switch can be toggled. It shows examples of both successful and failed state changes using Promises.

```APIDOC
## Prevent switching

Set the `before-change` property. If `false` is returned or a `Promise` is returned and then is rejected, the switch will stop.

### Example Usage

```vue
<template>
  <el-switch
    v-model="value1"
    :loading="loading1"
    :before-change="beforeChange1"
  />
  <el-switch
    v-model="value2"
    class="ml-2"
    :loading="loading2"
    :before-change="beforeChange2"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const value1 = ref(false)
const value2 = ref(false)
const loading1 = ref(false)
const loading2 = ref(false)

const beforeChange1 = (): Promise<boolean> => {
  loading1.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      loading1.value = false
      ElMessage.success('Switch success')
      return resolve(true)
    }, 1000)
  })
}

const beforeChange2 = (): Promise<boolean> => {
  loading2.value = true
  return new Promise((_, reject) => {
    setTimeout(() => {
      loading2.value = false
      ElMessage.error('Switch failed')
      return reject(new Error('Error'))
    }, 1000)
  })
}
</script>
```
```

--------------------------------

### Rounded Tag Examples

Source: https://element-plus.org/en-US/component/tag

Demonstrates how to create rounded tags with different effects (dark, light, plain) using the `round` attribute.

```APIDOC
## Rounded Tag

Tag can also be rounded like button.

### Usage

```vue
<template>
  <div class="flex gap-2">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="dark"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="light"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="plain"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TagProps } from 'element-plus'

type Item = { type: TagProps['type']; label: string }

const items = ref<Array<Item>>([
  { type: 'primary', label: 'Tag 1' },
  { type: 'success', label: 'Tag 2' },
  { type: 'info', label: 'Tag 3' },
  { type: 'warning', label: 'Tag 4' },
  { type: 'danger', label: 'Tag 5' },
])
</script>
```
```

--------------------------------

### Register Component in App.vue

Source: https://element-plus.org/en-US/guide/dev-guide

Example of how to import and register a component within the play/src/App.vue file for testing during development.

```vue
<template>
  <ComponentYouAreDeveloping />
</template>

<script setup lang="ts">
// make sure this component is registered in @element-plus/components
</script>
```

--------------------------------

### Element Plus Space Size Control Example

Source: https://element-plus.org/en-US/component/space

Illustrates how to control the spacing size between elements using the `size` attribute of the `el-space` component. It supports predefined sizes ('small', 'default', 'large') and dynamic adjustment via a radio group. This example is implemented in Vue.js.

```vue
<template>
  <el-space direction="vertical" alignment="start" :size="30">
    <el-radio-group v-model="size">
      <el-radio value="large">Large</el-radio>
      <el-radio value="default">Default</el-radio>
      <el-radio value="small">Small</el-radio>
    </el-radio-group>

    <el-space wrap :size="size">
      <el-card v-for="i in 3" :key="i" class="box-card" style="width: 250px">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { ComponentSize } from 'element-plus'

const size = ref<ComponentSize>('default')
</script>
```

--------------------------------

### Implement a fixed time picker

Source: https://element-plus.org/en-US/component/time-select

Configures a time selection dropdown with a defined start, end, and step interval.

```vue
<template>
  <el-time-select
    v-model="value"
    style="width: 240px"
    start="08:30"
    step="00:15"
    end="18:30"
    placeholder="Select time"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>
```

--------------------------------

### Linear Progress Bar Examples

Source: https://element-plus.org/en-US/component/progress

Use the `percentage` attribute to set the progress, which is required and must be between 0-100. The `format` attribute can be used to customize the displayed text.

```vue
<template>
  <div class="demo-progress">
    <el-progress :percentage="50" />
    <el-progress :percentage="100" :format="format" />
    <el-progress :percentage="100" status="success" />
    <el-progress :percentage="100" status="warning" />
    <el-progress :percentage="50" status="exception" />
  </div>
</template>

<script lang="ts" setup>
const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`)
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
```

--------------------------------

### Element Plus Image Placeholder Customization

Source: https://element-plus.org/en-US/component/image

Shows how to customize the placeholder content for the Element Plus Image component using the 'placeholder' slot. It includes examples for both the default placeholder and a custom one with loading text. This example uses Vue.js.

```vue
<template>
  <div class="demo-image__placeholder">
    <div class="block">
      <span class="demonstration">Default</span>
      <el-image :src="src" />
    </div>
    <div class="block">
      <span class="demonstration">Custom</span>
      <el-image :src="src">
        <template #placeholder>
          <div class="image-slot">Loading<span class="dot">...</span></div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script lang="ts" setup>
const src =
  'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg';
</script>

<style scoped>
.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__placeholder .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.demo-image__placeholder .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
</style>
```

--------------------------------

### Element Plus Tree Draggable Example

Source: https://element-plus.org/en-US/component/tree

Enable node dragging and dropping by adding the `draggable` attribute. This example includes custom logic for `allowDrop` and `allowDrag` to control drag behavior. It also logs various drag events.

```vue
<template>
  <el-tree
    style="max-width: 600px"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    :data="data"
    draggable
    default-expand-all
    node-key="id"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
  />
</template>

<script lang="ts" setup>
import type {
  AllowDropType,
  NodeDropType,
  RenderContentContext,
} from 'element-plus'

type Node = RenderContentContext['node']

const handleDragStart = (node: Node, ev: DragEvent) => {
  console.log('drag start', node)
}
const handleDragEnter = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node | null,
  dropType: NodeDropType,
  ev: DragEvent
) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: Exclude<NodeDropType, 'none'>,
  ev: DragEvent
) => {
  console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  }
  else {
    return true
  }
}
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}

const data = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
</script>
```

--------------------------------

### Drawer with Nested Table and Form

Source: https://element-plus.org/en-US/component/drawer

Demonstrates how to open a drawer containing either a nested table or a nested form. Includes examples for handling form submission and closing the drawer.

```APIDOC
## Drawer with Nested Table and Form

### Description
This example shows how to use the `el-drawer` component to display either a nested table or a nested form. It includes functionality for opening the drawers, handling form input, and closing the drawers with confirmation.

### Method
N/A (This is a UI component example)

### Endpoint
N/A

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```vue
<template>
  <el-button text @click="table = true">
    Open Drawer with nested table
  </el-button>
  <el-button text @click="dialog = true">
    Open Drawer with nested form
  </el-button>
  <el-drawer
    v-model="table"
    title="I have a nested table inside!"
    direction="rtl"
    size="50%"
  >
    <el-table :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-drawer>

  <el-drawer
    v-model="dialog"
    title="I have a nested form inside!"
    :before-close="handleClose"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Area" :label-width="formLabelWidth">
          <el-select
            v-model="form.region"
            placeholder="Please select activity area"
          >
            <el-option label="Area1" value="shanghai" />
            <el-option label="Area2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="onClick">
          {{ loading ? 'Submitting ...' : 'Submit' }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const formLabelWidth = '80px'
let timer

const table = ref(false)
const dialog = ref(false)
const loading = ref(false)

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const gridData = [
  {
    date: '2016-05-02',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-04',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-01',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-03',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
]

const onClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    dialog.value = false
  }, 400)
}

const handleClose = (done) => {
  if (loading.value) {
    return
  }
  ElMessageBox.confirm('Do you want to submit?')
    .then(() => {
      loading.value = true
      timer = setTimeout(() => {
        done()
        setTimeout(() => {
          loading.value = false
        }, 400)
      }, 2000)
    })
    .catch(() => {
      // catch error
    })
}

const cancelForm = () => {
  loading.value = false
  dialog.value = false
  clearTimeout(timer)
}
</script>
```
```

--------------------------------

### Element Plus Tree Accordion Example

Source: https://element-plus.org/en-US/component/tree

Use the `accordion` attribute to ensure only one node among the same level can be expanded at one time. This example demonstrates a basic tree structure with accordion enabled.

```vue
<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    accordion
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>
```

--------------------------------

### Inject App Context to Message in Vue

Source: https://element-plus.org/en-US/component/message

Illustrates how to inject the current application context into an Element Plus message instance. This is useful for ensuring messages inherit app properties. The example shows how to get the `appContext` using `getCurrentInstance` and pass it as the second argument to the `ElMessage` constructor.

```typescript
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

// in your setup method
const { appContext } = getCurrentInstance()!
ElMessage({}, appContext)

```

--------------------------------

### Implement Remote Search in Autocomplete

Source: https://element-plus.org/en-US/component/autocomplete

This example demonstrates how to perform asynchronous searches from a server. It uses a debouncing mechanism with `setTimeout` to limit the number of requests made while the user is typing.

```vue
<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="Please input"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const state = ref('')

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 3000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
})
</script>
```

--------------------------------

### Implement Basic Tooltip Placements

Source: https://element-plus.org/en-US/component/tooltip.html

Demonstrates various tooltip placement options using the placement attribute and custom content templates.

```vue
<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Left prompts info"
        placement="top-start"
      >
        <el-button>top-start</el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Center prompts info"
        placement="top"
      >
        <el-button>top</el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Right prompts info"
        placement="top-end"
      >
        <el-button>top-end</el-button>
      </el-tooltip>
    </div>
    <div class="row">
      <el-tooltip class="box-item" effect="dark" placement="left-start">
        <template #content>
          Left Top
          <br />
          prompts info
        </template>
        <el-button>left-start</el-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" placement="right-start">
        <template #content>
          Right Top
          <br />
          prompts info
        </template>
        <el-button>right-start</el-button>
      </el-tooltip>
    </div>
    <div class="row">
      <el-tooltip class="box-item" effect="dark" placement="left">
        <template #content>
          Left Center
          <br />
          prompts info
        </template>
        <el-button class="mt-3 mb-3">left</el-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" placement="right">
        <template #content>
          Right Center
          <br />
          prompts info
        </template>
        <el-button>right</el-button>
      </el-tooltip>
    </div>
    <div class="row">
      <el-tooltip class="box-item" effect="dark" placement="left-end">
        <template #content>
          Left Bottom
          <br />
          prompts info
        </template>
        <el-button>left-end</el-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" placement="right-end">
        <template #content>
          Right Bottom
          <br />
          prompts info
        </template>
        <el-button>right-end</el-button>
      </el-tooltip>
    </div>
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <el-button>bottom-start</el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <el-button>bottom</el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <el-button>bottom-end</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
```

--------------------------------

### Implementing Advanced Pagination with Element Plus

Source: https://element-plus.org/en-US/component/pagination

A complete Vue 3 example showing how to configure multiple pagination layouts using the el-pagination component. It includes reactive state management for page sizes, current pages, and component styling.

```vue
<template>
  <div class="flex items-center mb-4">
    <el-radio-group v-model="size" class="mr-4">
      <el-radio-button value="default">default</el-radio-button>
      <el-radio-button value="large">large</el-radio-button>
      <el-radio-button value="small">small</el-radio-button>
    </el-radio-group>
    <div>
      background:
      <el-switch v-model="background" class="ml-2" />
    </div>
    <div class="ml-4">
      disabled: <el-switch v-model="disabled" class="ml-2" />
    </div>
  </div>

  <hr class="my-4" />

  <div class="demo-pagination-block">
    <div class="demonstration">Total item count</div>
    <el-pagination
      v-model:current-page="currentPage1"
      :page-size="100"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">Change page size</div>
    <el-pagination
      v-model:current-page="currentPage2"
      v-model:page-size="pageSize2"
      :page-sizes="[100, 200, 300, 400]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="sizes, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">Jump to</div>
    <el-pagination
      v-model:current-page="currentPage3"
      v-model:page-size="pageSize3"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <div class="demo-pagination-block">
    <div class="demonstration">All combined</div>
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ComponentSize } from 'element-plus'

const currentPage1 = ref(5)
const currentPage2 = ref(5)
const currentPage3 = ref(5)
const currentPage4 = ref(4)
const pageSize2 = ref(100)
const pageSize3 = ref(100)
const pageSize4 = ref(100)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>
```

--------------------------------

### Basic Tree Structure - Vue

Source: https://element-plus.org/en-US/component/tree-v2

Demonstrates the basic setup for the Tree V2 component with virtual scrolling. Ensure the data and props are correctly defined for your tree structure.

```vue
<template>
  <el-tree-v2
    style="max-width: 600px"
    :data="data"
    :props="props"
    :height="200"
  />
</template>

<script lang="ts" setup>
interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const getKey = (prefix: string, id: number) => {
  return `${prefix}-${id}`
}

const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = 'node'
): Tree[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const props = {
  value: 'id',
  label: 'label',
  children: 'children',
}
const data = createData(4, 30, 40)
</script>
```

--------------------------------

### Nested Dialog

Source: https://element-plus.org/en-US/component/dialog

Explains the necessity of `append-to-body` when nesting dialogs and provides an example of how to implement it.

```APIDOC
## Nested Dialog 

If a Dialog is nested in another Dialog, `append-to-body` is required. Normally we do not recommend using nested Dialog. If you need multiple Dialogs rendered on the page, you can simply flat them so that they're siblings to each other. If you must nest a Dialog inside another Dialog, set `append-to-body` of the nested Dialog to true, and it will append to body instead of its parent node, so both Dialogs can be correctly rendered.

### Code Example

```vue
<template>
  <el-button plain @click="outerVisible = true">
    Open the outer Dialog
  </el-button>

  <el-dialog v-model="outerVisible" title="Outer Dialog" width="800">
    <span>This is the outer Dialog</span>
    <el-dialog
      v-model="innerVisible"
      width="500"
      title="Inner Dialog"
      append-to-body
    >
      <span>This is the inner Dialog</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="innerVisible = true">
          Open the inner Dialog
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const outerVisible = ref(false)
const innerVisible = ref(false)
</script>
```
```

--------------------------------

### Implement Image Preview with el-image

Source: https://element-plus.org/en-US/component/image

Demonstrates how to enable a large image preview gallery using the preview-src-list prop. It includes configuration for zoom rates, scale limits, and setting the initial index of the previewed image.

```vue
<template>
  <div class="demo-image__preview">
    <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="srcList"
      show-progress
      :initial-index="4"
      fit="cover"
    />
  </div>
</template>

<script lang="ts" setup>
const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
</script>
```

--------------------------------

### Basic Usage of Steps

Source: https://element-plus.org/en-US/component/steps

Demonstrates a standard step bar with an active index and a button to navigate through steps.

```vue
<template>
  <el-steps style="max-width: 600px" :active="active" finish-status="success">
    <el-step title="Step 1" />
    <el-step title="Step 2" />
    <el-step title="Step 3" />
  </el-steps>

  <el-button style="margin-top: 12px" @click="next">Next step</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(0)

const next = () => {
  if (active.value++ > 2) active.value = 0
}
</script>
```

--------------------------------

### Table Configurations

Source: https://element-plus.org/en-US/component/config-provider

Demonstrates how to configure table properties like `showOverflowTooltip` and `tooltipEffect` using `el-config-provider`.

```APIDOC
## Table Configurations

This section details the configuration options for the `el-table` component, particularly focusing on `showOverflowTooltip` and `tooltipEffect` which can be managed globally via `el-config-provider`.

### Endpoint
N/A (Component Configuration)

### Parameters
#### Request Body (for `el-config-provider`)
- **showOverflowTooltip** (boolean) - Optional - Controls whether to show overflow tooltips for table cells. Defaults to `true`.
- **tooltipEffect** (enum: 'dark', 'light') - Optional - Sets the effect of the tooltip. Defaults to `'dark'`.

### Request Example
```json
{
  "showOverflowTooltip": true,
  "tooltipEffect": "dark"
}
```

### Response
N/A (Configuration applied to component)

### Example Usage (Vue SFC)
```vue
<template>
  <div>
    <div>
      <el-checkbox v-model="config.showOverflowTooltip">
        showOverflowTooltip
      </el-checkbox>
      <el-select
        v-model="config.tooltipEffect"
        class="ml-5"
        style="max-width: 150px"
      >
        <el-option value="dark" label="dark" />
        <el-option value="light" label="light" />
      </el-select>
    </div>
    <el-divider />
    <el-config-provider :table="config">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column
          property="address"
          label="Address (inherited from config-provider)"
          width="300"
        />
        <el-table-column
          property="address"
          label="Address (explicit false)"
          :show-overflow-tooltip="false"
        />
      </el-table>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import type { TableConfigContext } from 'element-plus'

const config = reactive<TableConfigContext>({
  showOverflowTooltip: true,
  tooltipEffect: 'dark',
})

interface User {
  date: string
  name: string
  address: string
}

const tableData: User[] = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]
</script>

```

--------------------------------

### Basic PageHeader Usage

Source: https://element-plus.org/en-US/component/page-header.html

Demonstrates the standard implementation of a PageHeader for simple navigation scenarios.

```vue
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script lang="ts" setup>
const goBack = () => {
  console.log('go back')
}
</script>
```

--------------------------------

### Custom Watermark Configuration

Source: https://element-plus.org/en-US/component/watermark

Provides a comprehensive example of customizing watermark parameters such as z-index, rotation, gap, and offset using reactive data and form controls.

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { isDark } from '~/composables/dark'

const config = reactive({
  content: 'Element Plus',
  font: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.15)',
  },
  zIndex: -1,
  rotate: -22,
  gap: [100, 100] as [number, number],
  offset: [] as unknown as [number, number],
})

watch(
  isDark,
  (value) => {
    config.font.color = value
      ? 'rgba(255, 255, 255, .15)'
      : 'rgba(0, 0, 0, .15)'
  },
  { immediate: true }
)
</script>

<template>
  <div class="wrapper">
    <el-watermark
      class="watermark"
      :content="config.content"
      :font="config.font"
      :z-index="config.zIndex"
      :rotate="config.rotate"
      :gap="config.gap"
      :offset="config.offset"
    >
      <div class="watermark-container">
        <h1>Element Plus</h1>
        <h2>A Vue 3 based component library for designers and developers</h2>
        <img src="/images/hamburger.png" alt="示例图片" />
      </div>
    </el-watermark>
    <el-form class="form" :model="config" label-position="top" label-width="50px">
      <el-form-item label="Content"><el-input v-model="config.content" /></el-form-item>
      <el-form-item label="Color"><el-color-picker v-model="config.font.color" show-alpha /></el-form-item>
      <el-form-item label="FontSize"><el-slider v-model="config.font.fontSize" /></el-form-item>
      <el-form-item label="zIndex"><el-slider v-model="config.zIndex" /></el-form-item>
      <el-form-item label="Rotate"><el-slider v-model="config.rotate" :min="-180" :max="180" /></el-form-item>
    </el-form>
  </div>
</template>
```

--------------------------------

### Element Plus Mention with Remote Options Loading

Source: https://element-plus.org/en-US/component/mention

Provides an example of asynchronously loading mention options from a remote source. It uses the `@search` event and a `loading` state to handle user input and display suggestions after a delay, improving performance for large datasets.

```vue
<template>
  <el-mention
    v-model="value"
    :options="options"
    :loading="loading"
    style="width: 320px"
    placeholder="Please input"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import type { MentionOption } from 'element-plus'

const value = ref('')
const loading = ref(false)
const options = ref<MentionOption[]>([])

let timer: ReturnType<typeof setTimeout>
const handleSearch = (pattern: string) => {
  if (timer) clearTimeout(timer)

  loading.value = true
  timer = setTimeout(() => {
    options.value = ['Fuphoenixes', 'kooriookami', 'Jeremy', 'btea'].map(
      (item) => ({
        label: pattern + item,
        value: pattern + item,
      })
    )
    loading.value = false
  }, 1500)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>
```

--------------------------------

### Custom Clear Icon Example

Source: https://element-plus.org/en-US/component/cascader

Demonstrates how to set a custom clear icon for the `el-cascader` component using the `clear-icon` attribute and importing an icon from `@element-plus/icons-vue`.

```APIDOC
## Custom Clear Icon

You can customize the clear icon by setting the `clear-icon` attribute.

### Method
Not applicable (this is a configuration example, not an API endpoint).

### Endpoint
Not applicable.

### Parameters
#### Component Attribute
- **clear-icon** (Component) - Required - The custom icon component to use for clearing the input.

### Request Example
```vue
<template>
  <el-cascader
    :options="options"
    clearable
    :clear-icon="CloseBold"
    placeholder="Custom clear icon"
  />
</template>

<script lang="ts" setup>
import { CloseBold } from '@element-plus/icons-vue'

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
      },
    ],
  },
]
</script>
```

### Response
#### Success Response (200)
Not applicable (this is a UI component example).

#### Response Example
Not applicable.
```

--------------------------------

### Simple Card without Header - Vue

Source: https://element-plus.org/en-US/component/card

A simplified Element Plus card example where the header is omitted, showing only the body content.

```vue
<template>
  <el-card style="max-width: 480px">
    <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
  </el-card>
</template>
```

--------------------------------

### Link Button Examples - Element Plus

Source: https://element-plus.org/en-US/component/button.html

Demonstrates basic and disabled link buttons. The `link` prop is used to style buttons as links. The `type` prop controls the color theme.

```vue
<template>
  <p>Basic link button</p>
  <div class="mb-4">
    <el-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type"
      link
    >
      {{ button.text }}
    </el-button>
  </div>

  <p>Disabled link button</p>
  <div>
    <el-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type"
      link
      disabled
    >
      {{ button.text }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
const buttons = [
  { type: '', text: 'plain' },
  { type: 'primary', text: 'primary' },
  { type: 'success', text: 'success' },
  { type: 'info', text: 'info' },
  { type: 'warning', text: 'warning' },
  { type: 'danger', text: 'danger' },
] as const
</script>
```

--------------------------------

### Icon Button Examples - Element Plus

Source: https://element-plus.org/en-US/component/button.html

Demonstrates using icons with buttons. Icons can be used alone or with text. The `icon` attribute is used for icons, and `el-icon` component can be used for custom icon placement.

```vue
<template>
  <div>
    <el-button type="primary" :icon="Edit" />
    <el-button type="primary" :icon="Share" />
    <el-button type="primary" :icon="Delete" />
    <el-button type="primary" :icon="Search">Search</el-button>
    <el-button type="primary">
      Upload<el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
</script>
```

--------------------------------

### Element Plus Statistic Card Example

Source: https://element-plus.org/en-US/component/statistic

Demonstrates the usage of ElStatistic components within ElRow and ElCol for displaying daily, monthly, and transactional user data. Includes tooltips for clarification and icons for trend indication.

```vue
<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="98500">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Daily active users
              <el-tooltip
                effect="dark"
                content="Number of users who logged into the product in one day"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>than yesterday</span>
            <span class="green">
              24%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="693700">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Monthly Active Users
              <el-tooltip
                effect="dark"
                content="Number of users who logged into the product in one month"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>month on month</span>
            <span class="red">
              12%
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="72000" title="New transactions today">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              New transactions today
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>than yesterday</span>
            <span class="green">
              16%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
          <div class="footer-item">
            <el-icon :size="14">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from '@element-plus/icons-vue'
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
```

--------------------------------

### Implement before-collapse hook in Element Plus Collapse

Source: https://element-plus.org/en-US/component/collapse

Demonstrates how to use the before-collapse property to intercept collapse actions. The example uses a Promise to simulate an asynchronous operation that determines whether the collapse should proceed.

```vue
<template>
  <div v-loading="loading" class="demo-collapse">
    <div class="flex items-center mb-4">
      <span class="mr-4">before collapse return: </span>
      <el-switch
        v-model="before"
        :inactive-value="false"
        :active-value="true"
        inactive-text="false"
        active-text="true"
      />
    </div>

    <el-collapse v-model="activeNames" :before-collapse="beforeCollapse">
      <el-collapse-item title="Consistency" name="1">
        <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const before = ref(true)
const activeNames = ref(['1'])
const loading = ref(false)

const beforeCollapse = (): Promise<boolean> => {
  loading.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      loading.value = false
      return resolve(before.value)
    }, 1000)
  })
}
</script>
```

--------------------------------

### Autocomplete with Custom Header and Footer

Source: https://element-plus.org/en-US/component/autocomplete

This example demonstrates how to customize the header and footer of the Autocomplete component using the provided slots. It includes a custom header with text and a custom footer with a clear button.

```APIDOC
## Autocomplete Component API

### Description
Provides suggestions for input. It supports remote search and custom templates for suggestions, headers, and footers.

### Attributes

#### Basic Attributes
- **model-value / v-model** (string) - Binding value
- **placeholder** (string) - The placeholder of Autocomplete
- **clearable** (boolean) - Whether to show a clear button. Default: `false`
- **disabled** (boolean) - Whether Autocomplete is disabled. Default: `false`
- **value-key** (string) - Key name of the input suggestion object for display. Default: `value`
- **debounce** (number) - Debounce delay when typing, in milliseconds. Default: `300`
- **placement** (enum) - Placement of the popup menu. Options: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`. Default: `bottom-start`
- **fetch-suggestions** (Array | Function) - A method to fetch input suggestions. When suggestions are ready, invoke `callback(data:[])` to return them to Autocomplete. Default: `—`
- **trigger-on-focus** (boolean) - Whether to show suggestions when input focuses. Default: `true`
- **select-when-unmatched** (boolean) - Whether to emit a `select` event on Enter when there is no autocomplete match. Default: `false`
- **name** (string) - Same as `name` in native input. Default: `—`
- **aria-label** (string) - Native `aria-label` attribute. Default: `—`
- **hide-loading** (boolean) - Whether to hide the loading icon in remote search. Default: `false`
- **popper-class** (string | object) - Custom class name for Autocomplete's dropdown. Default: `''`
- **popper-style** (string | object) - Custom style for Autocomplete's dropdown. Default: `—`
- **teleported** (boolean) - Whether the select dropdown is teleported to the body. Default: `true`
- **append-to** (CSSSelector | HTMLElement) - Which select dropdown appends to. Default: `—`
- **highlight-first-item** (boolean) - Whether to highlight the first item in remote search suggestions by default. Default: `false`
- **fit-input-width** (boolean) - Whether the width of the dropdown is the same as the input. Default: `false`
- **popper-append-to-body** (boolean) - Deprecated: Whether to append the dropdown to body. If the positioning of the dropdown is wrong, you can try to set this prop to `false`. Default: `false`
- **loop-navigation** (boolean) - Whether keyboard navigation loops from end to start. Default: `true`

#### Input Props
- (Specific input props are not detailed in the provided text, but are mentioned as a category.)

### Slots

- **header**: Customizes the header content of the dropdown.
- **footer**: Customizes the footer content of the dropdown.

### Example Usage (Vue SFC)

```vue
<template>
  <div class="autocomplete-custom-header-footer">
    <div>
      <p>Custom header content</p>
      <el-autocomplete
        v-model="headerSlotState"
        :fetch-suggestions="querySearchAsync"
        placeholder="Please input"
        @select="handleSelect"
      >
        <template #header>header content</template>
      </el-autocomplete>
    </div>
    <div>
      <p>Custom footer content</p>
      <el-autocomplete
        ref="footerAutocompleteRef"
        v-model="footerSlotstate"
        :fetch-suggestions="querySearchAsync"
        placeholder="Please input"
        @select="handleSelect"
      >
        <template #footer>
          <el-button link size="small" @click="handleClear"> Clear </el-button>
        </template>
      </el-autocomplete>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const headerSlotState = ref('')
const footerSlotstate = ref('')

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 3000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
})

const footerAutocompleteRef = ref()
const handleClear = () => {
  footerSlotstate.value = ''
  footerAutocompleteRef.value.getData()
}
</script>

<style scoped>
.autocomplete-custom-header-footer {
  display: flex;
}

.autocomplete-custom-header-footer > div {
  flex: 1;
  text-align: center;
}
.autocomplete-custom-header-footer > div > :deep(.el-autocomplete) {
  width: 50%;
}

.autocomplete-custom-header-footer > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
</style>

```

--------------------------------

### Create a fixed time range

Source: https://element-plus.org/en-US/component/time-select

Links two time pickers using max-time and min-time properties to ensure the end time is always after the start time.

```vue
<template>
  <div class="demo-time-range flex flex-wrap gap-4">
    <el-time-select
      v-model="startTime"
      style="width: 240px"
      :max-time="endTime"
      placeholder="Start time"
      start="08:30"
      step="00:15"
      end="18:30"
    />
    <el-time-select
      v-model="endTime"
      style="width: 240px"
      :min-time="startTime"
      placeholder="End time"
      start="08:30"
      step="00:15"
      end="18:30"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const startTime = ref('')
const endTime = ref('')
</script>
```

--------------------------------

### Disable Checkboxes for Specific Nodes in Element Plus Tree

Source: https://element-plus.org/en-US/component/tree

The checkbox of a node can be set as disabled. In the example, 'disabled' property is declared in defaultProps, and some nodes are set as 'disabled:true'. The corresponding checkboxes are disabled and can't be clicked. This example uses Vue.

```vue
<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    show-checkbox
  />
</template>

<script lang="ts" setup>
const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled',
}

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 3,
        label: 'Level two 2-1',
        children: [
          {
            id: 4,
            label: 'Level three 3-1-1',
          },
          {
            id: 5,
            label: 'Level three 3-1-2',
            disabled: true,
          },
        ],
      },
      {
        id: 2,
        label: 'Level two 2-2',
        disabled: true,
        children: [
          {
            id: 6,
            label: 'Level three 3-2-1',
          },
          {
            id: 7,
            label: 'Level three 3-2-2',
            disabled: true,
          },
        ],
      },
    ],
  },
]
</script>
```

--------------------------------

### Custom SVG Loading Icon

Source: https://element-plus.org/en-US/component/autocomplete

Use a custom SVG to replace the default loading spinner. This example uses a circular path animation.

```vue
<template>
  <div class="demo-autocomplete">
    <div class="demo-block">
      <div class="demo-title">loading icon1</div>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        class="w-50"
        placeholder="Please input"
        @select="handleSelect"
      >
        <template #loading>
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </template>
      </el-autocomplete>
    </div>
    <div class="demo-block">
      <div class="demo-title">loading icon2</div>
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        class="w-50"
        placeholder="Please input"
        @select="handleSelect"
      >
        <template #loading>
          <el-icon class="is-loading">
            <svg class="circular" viewBox="0 0 20 20">
              <g
                class="path2 loading-path"
                stroke-width="0"
                style="animation: none; stroke: none"
              >
                <circle r="3.375" class="dot1" rx="0" ry="0" />
                <circle r="3.375" class="dot2" rx="0" ry="0" />
                <circle r="3.375" class="dot4" rx="0" ry="0" />
                <circle r="3.375" class="dot3" rx="0" ry="0" />
              </g>
            </svg>
          </el-icon>
        </template>
      </el-autocomplete>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const state = ref('')

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 5000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
})
</script>

<style scoped>
.demo-autocomplete {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.demo-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-title {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  min-height: 2.5em;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .demo-autocomplete {
    gap: 1rem;
  }
  .demo-block {
    width: 100%;
  }
}
</style>

<style>
.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}
.loading-path .dot1 {
  transform: translate(3.75px, 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
}
.loading-path .dot2 {
  transform: translate(calc(100% - 3.75px), 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.4s;
}
.loading-path .dot3 {
  transform: translate(3.75px, calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 1.2s;
}
.loading-path .dot4 {
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.8s;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
```

--------------------------------

### Set Default Time for Date Range Picker

Source: https://element-plus.org/en-US/component/date-picker

Configure the default time for the start and end dates in a daterange picker. The `default-time` prop accepts an array of two Date objects to set the start and end times respectively. By default, it's '00:00:00'.

```vue
<template>
  <div class="demo-date-picker">
    <div class="block">
      <p>Component value：{{ value }}</p>
      <el-date-picker
        v-model="value"
        type="daterange"
        start-placeholder="Start date"
        end-placeholder="End date"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
</style>
```

--------------------------------

### Global Configuration with Element Plus

Source: https://element-plus.org/en-US/guide/i18n

Configure Element Plus to use a specific locale globally during application setup. This involves importing the desired locale file and passing it to the ElementPlus plugin.

```typescript
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

app.use(ElementPlus, {
  locale: zhCn,
})
```

--------------------------------

### Basic Virtualized Select Usage

Source: https://element-plus.org/en-US/component/select-v2

Demonstrates the simplest implementation of the virtualized select component. Ensure the `options` prop is correctly formatted with `value` and `label` for each item. This is suitable for single selection scenarios.

```vue
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="Please select"
    style="width: 240px"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const value = ref()
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))
</script>
```

--------------------------------

### File List Control with on-change Hook

Source: https://element-plus.org/en-US/component/upload

Controls the upload file list using the `on-change` hook. This example limits the file list to the last 3 uploaded files.

```vue
<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :on-change="handleChange"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.slice(-3)
}
</script>
```

--------------------------------

### Basic Pagination Usage - Vue

Source: https://element-plus.org/en-US/component/pagination

Demonstrates the basic usage of the ElPagination component in Vue. It shows how to set the layout with different pagination elements like prev, pager, and next buttons, and how to configure the total number of items. This example illustrates how the pagination adapts to having few or many pages.

```vue
<template>
  <div class="example-pagination-block">
    <div class="example-demonstration">When you have few pages</div>
    <el-pagination layout="prev, pager, next" :total="50" />
  </div>
  <div class="example-pagination-block">
    <div class="example-demonstration">When you have more than 7 pages</div>
    <el-pagination layout="prev, pager, next" :total="1000" />
  </div>
</template>

<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>
```

--------------------------------

### Implement Loading via Directive and Service

Source: https://element-plus.org/en-US/component/loading

Demonstrates how to trigger a full-screen loading state using the v-loading directive with modifiers and the ElLoading service programmatically.

```vue
<template>
  <el-button
    v-loading.fullscreen.lock="fullscreenLoading"
    type="primary"
    @click="openFullScreen1"
  >
    As a directive
  </el-button>
  <el-button type="primary" @click="openFullScreen2"> As a service </el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElLoading } from 'element-plus'

const fullscreenLoading = ref(false)
const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 2000)
}

const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 2000)
}
</script>
```

--------------------------------

### Common Layout: Header, Main, and Footer

Source: https://element-plus.org/en-US/component/container

Illustrates a layout including header, main content, and footer.

```APIDOC
## Common Layout: Header, Main, and Footer

### Description
This layout features a header, a main content area, and a footer, all arranged vertically.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Form Accessibility Example

Source: https://element-plus.org/en-US/component/form

Demonstrates automatic label attachment for single inputs and manual ARIA label assignment for grouped inputs within `el-form-item`. Use this when you need to ensure proper accessibility for form elements.

```vue
<template>
  <el-form label-position="left" label-width="auto" style="max-width: 600px">
    <el-space fill>
      <el-alert type="info" show-icon :closable="false">
        <p>"Full Name" label is automatically attached to the input:</p>
      </el-alert>
      <el-form-item label="Full Name">
        <el-input v-model="formAccessibility.fullName" />
      </el-form-item>
    </el-space>
    <el-space fill>
      <el-alert type="info" show-icon :closable="false">
        <p>
          "Your Information" serves as a label for the group of inputs. <br />
          You must specify labels on the individal inputs. Placeholders are not
          replacements for using the "label" attribute.
        </p>
      </el-alert>
      <el-form-item label="Your Information">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              v-model="formAccessibility.firstName"
              aria-label="First Name"
              placeholder="First Name"
            />
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="formAccessibility.lastName"
              aria-label="Last Name"
              placeholder="Last Name"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-space>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formAccessibility = reactive({
  fullName: '',
  firstName: '',
  lastName: '',
})
</script>
```

--------------------------------

### Global MessageBox Methods

Source: https://element-plus.org/en-US/component/message-box

Explains how to use MessageBox via global properties like `$msgbox`, `$alert`, `$confirm`, and `$prompt` when Element Plus is fully imported.

```APIDOC
## Global method 

If Element Plus is fully imported, the following global methods are added to `app.config.globalProperties`:

- `$msgbox(options)`
- `$alert(message, title, options)` or `$alert(message, options)`
- `$confirm(message, title, options)` or `$confirm(message, options)`
- `$prompt(message, title, options)` or `$prompt(message, options)`

These methods allow you to invoke MessageBox functionalities directly from any Vue instance.
```

--------------------------------

### Element Plus Rate: Size Variations

Source: https://element-plus.org/en-US/component/rate

Illustrates how to control the size of the Element Plus Rate component using the `size` attribute. It shows examples for 'large', default, and 'small' sizes.

```vue
<template>
  <el-rate v-model="value" size="large" />
  <br />
  <el-rate v-model="value" />
  <br />
  <el-rate v-model="value" size="small" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(0)
</script>
```

--------------------------------

### Configure Table Rowspan and Colspan in Element Plus

Source: https://element-plus.org/en-US/component/table

Demonstrates how to use the span-method attribute to merge table cells. The example provides two approaches: returning an array for simple spans and an object for explicit rowspan/colspan definitions.

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="amount1" sortable label="Amount 1" />
      <el-table-column prop="amount2" sortable label="Amount 2" />
      <el-table-column prop="amount3" sortable label="Amount 3" />
    </el-table>

    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="amount1" label="Amount 1" />
      <el-table-column prop="amount2" label="Amount 2" />
      <el-table-column prop="amount3" label="Amount 3" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus'

interface User {
  id: string
  name: string
  amount1: string
  amount2: string
  amount3: number
}

interface SpanMethodProps {
  row: User
  column: TableColumnCtx<User>
  rowIndex: number
  columnIndex: number
}

const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

const tableData: User[] = [
  {
    id: '12987122',
    name: 'Tom',
    amount1: '234',
    amount2: '3.2',
    amount3: 10,
  },
  {
    id: '12987123',
    name: 'Tom',
    amount1: '165',
    amount2: '4.43',
    amount3: 12,
  },
  {
    id: '12987124',
    name: 'Tom',
    amount1: '324',
    amount2: '1.9',
    amount3: 9,
  },
  {
    id: '12987125',
    name: 'Tom',
    amount1: '621',
    amount2: '2.2',
    amount3: 17,
  },
  {
    id: '12987126',
    name: 'Tom',
    amount1: '539',
    amount2: '4.1',
    amount3: 15,
  },
]
</script>
```

--------------------------------

### Implement Checkable Tags in Element Plus

Source: https://element-plus.org/en-US/component/tag

Shows how to use the el-check-tag component for toggleable selection states. It includes examples of basic usage, disabled states, and typed check tags.

```vue
<template>
  <div class="flex gap-2">
    <el-check-tag checked>Checked</el-check-tag>
    <el-check-tag :checked="checked" @change="onChange">Toggle me</el-check-tag>
    <el-check-tag disabled>Disabled</el-check-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-check-tag :checked="checked1" type="primary" @change="onChange1">
      Tag 1
    </el-check-tag>
    <el-check-tag :checked="checked2" type="success" @change="onChange2">
      Tag 2
    </el-check-tag>
    <el-check-tag :checked="checked3" type="info" @change="onChange3">
      Tag 3
    </el-check-tag>
    <el-check-tag :checked="checked4" type="warning" @change="onChange4">
      Tag 4
    </el-check-tag>
    <el-check-tag :checked="checked5" type="danger" @change="onChange5">
      Tag 5
    </el-check-tag>
    <el-check-tag
      :checked="checked6"
      disabled
      type="success"
      @change="onChange6"
    >
      Tag 6
    </el-check-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const checked = ref(false)
const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)
const checked5 = ref(true)
const checked6 = ref(true)

const onChange = (status: boolean) => {
  checked.value = status
}

const onChange1 = (status: boolean) => {
  checked1.value = status
}

const onChange2 = (status: boolean) => {
  checked2.value = status
}

const onChange3 = (status: boolean) => {
  checked3.value = status
}

const onChange4 = (status: boolean) => {
  checked4.value = status
}

const onChange5 = (status: boolean) => {
  checked5.value = status
}

const onChange6 = (status: boolean) => {
  checked6.value = status
}
</script>
```

--------------------------------

### Button Group Examples - Element Plus

Source: https://element-plus.org/en-US/component/button.html

Illustrates how to group buttons using `<el-button-group>`. Supports horizontal and vertical layouts via the `direction` attribute. Icons can be included within grouped buttons.

```vue
<template>
  <el-button-group class="mb-4">
    <el-button type="primary" :icon="ArrowLeft">Previous Page</el-button>
    <el-button type="primary">
      Next Page<el-icon class="el-icon--right"><ArrowRight /></el-icon>
    </el-button>
  </el-button-group>
  <br />
  <el-radio-group v-model="direction" class="mb-2">
    <el-radio value="horizontal">Horizontal</el-radio>
    <el-radio value="vertical">Vertical</el-radio>
  </el-radio-group>
  <br />

  <el-button-group :direction="direction">
    <el-button type="primary" :icon="House" />
    <el-button type="primary" :icon="Operation" />
    <el-button type="primary" :icon="Notification" />
  </el-button-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  House,
  Notification,
  Operation,
} from '@element-plus/icons-vue'

const direction = ref<'horizontal' | 'vertical'>('horizontal')
</script>
```

--------------------------------

### Steps with Description

Source: https://element-plus.org/en-US/component/steps

Includes a description field for each step to provide additional context.

```vue
<template>
  <el-steps style="max-width: 600px" :active="1">
    <el-step title="Step 1" description="Some description" />
    <el-step title="Step 2" description="Some description" />
    <el-step title="Step 3" description="Some description" />
  </el-steps>
</template>
```

--------------------------------

### Implement Resizable Drawer with Direction Control

Source: https://element-plus.org/en-US/component/drawer

Demonstrates how to create a resizable drawer using the resizable attribute. It allows users to toggle drawer direction via radio buttons and adjust the size dynamically.

```vue
<template>
  <el-radio-group v-model="direction" @change="drawer = true">
    <el-radio-button value="ttb">top</el-radio-button>
    <el-radio-button value="rtl">right</el-radio-button>
    <el-radio-button value="btt">bottom</el-radio-button>
    <el-radio-button value="ltr">left</el-radio-button>
  </el-radio-group>

  <el-drawer v-model="drawer" :direction="direction" resizable>
    This is drawer content.
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { DrawerProps } from 'element-plus'

const direction = ref<DrawerProps['direction']>()
const drawer = ref(false)
</script>
```

--------------------------------

### Integrate Mention Component with el-form

Source: https://element-plus.org/en-US/component/mention

Shows how to incorporate the el-mention component within an el-form for data entry and validation. This example includes form submission and reset functionality using the form instance.

```vue
<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
  >
    <el-form-item label="name" prop="name">
      <el-mention v-model="ruleForm.name" :options="options" />
    </el-form-item>
    <el-form-item label="desc" prop="desc">
      <el-mention v-model="ruleForm.desc" type="textarea" :options="options" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Submit
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  name: string
  desc: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  desc: '',
})

const options = ref([
  { label: 'Fuphoenixes', value: 'Fuphoenixes' },
  { label: 'kooriookami', value: 'kooriookami' },
  { label: 'Jeremy', value: 'Jeremy' },
  { label: 'btea', value: 'btea' },
])

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
  desc: [{ required: true, message: 'Please input desc', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
```

--------------------------------

### Implement Rounded Tags in Element Plus

Source: https://element-plus.org/en-US/component/tag

Demonstrates how to create rounded tags using the 'round' attribute. It showcases different effects including dark, light, and plain styles using a Vue setup script.

```vue
<template>
  <div class="flex gap-2">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="dark"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="light"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
  <div class="flex gap-2 mt-4">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="plain"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TagProps } from 'element-plus'

type Item = { type: TagProps['type']; label: string }

const items = ref<Array<Item>>([
  { type: 'primary', label: 'Tag 1' },
  { type: 'success', label: 'Tag 2' },
  { type: 'info', label: 'Tag 3' },
  { type: 'warning', label: 'Tag 4' },
  { type: 'danger', label: 'Tag 5' },
])
</script>
```

--------------------------------

### Basic Select Usage

Source: https://element-plus.org/en-US/component/select

Demonstrates the fundamental implementation of the Select component using v-model for data binding and v-for for rendering options.

```vue
<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  { value: 'Option1', label: 'Option1' },
  { value: 'Option2', label: 'Option2' },
  { value: 'Option3', label: 'Option3' },
  { value: 'Option4', label: 'Option4' },
  { value: 'Option5', label: 'Option5' },
]
</script>
```

--------------------------------

### Element Plus Space Vertical Layout Example

Source: https://element-plus.org/en-US/component/space

Shows how to implement a vertical layout using the `el-space` component by setting the `direction` attribute to 'vertical'. This is useful for stacking elements one below another. The code is in Vue.js.

```vue
<template>
  <el-space direction="vertical">
    <el-card v-for="i in 2" :key="i" class="box-card" style="width: 250px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
    </el-card>
  </el-space>
</template>
```

--------------------------------

### Basic Usage

Source: https://element-plus.org/en-US/component/popover

Demonstrates the basic usage of the Popover component with different trigger types (hover, click, focus, contextmenu) and manual control.

```APIDOC
## Basic Usage 

Popover is built with `ElTooltip`. So for some duplicated attributes, please refer to the documentation of Tooltip.
The `trigger` attribute is used to define how popover is triggered: `hover`, `click`, `focus` or `contextmenu` . If you want to manually control it, you can set `:visible`.

### Request Example
```vue
<template>
  <el-popover
    placement="top-start"
    title="Title"
    :width="200"
    trigger="hover"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2">Hover to activate</el-button>
    </template>
  </el-popover>

  <el-popover
    placement="bottom"
    title="Title"
    :width="200"
    trigger="click"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2">Click to activate</el-button>
    </template>
  </el-popover>

  <el-popover
    ref="popover"
    placement="right"
    title="Title"
    :width="200"
    trigger="focus"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2">Focus to activate</el-button>
    </template>
  </el-popover>

  <el-popover
    ref="popover"
    title="Title"
    :width="200"
    trigger="contextmenu"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2">contextmenu to activate</el-button>
    </template>
  </el-popover>

  <el-popover
    :visible="visible"
    placement="bottom"
    title="Title"
    :width="200"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2" @click="visible = !visible">
        Manual to activate
      </el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 8px;
}
</style>
```
```

--------------------------------

### Vue: Affix Mode Anchor Link

Source: https://element-plus.org/en-US/component/anchor

Demonstrates integrating the El-Anchor component with the El-Affix component to create a fixed anchor point on the page. This example includes setting offsets for both components and managing locale data.

```vue
<template>
  <el-affix :offset="60">
    <el-anchor :offset="70" style="width: 300px">
      <el-anchor-link :href="`#${locale['basic-usage']}`">
        {{ locale['Basic Usage'] }}
      </el-anchor-link>
      <el-anchor-link :href="`#${locale['horizontal-mode']}`">
        {{ locale['Horizontal Mode'] }}
      </el-anchor-link>
      <el-anchor-link :href="`#${locale['scroll-container']}`">
        {{ locale['Scroll Container'] }}
      </el-anchor-link>
      <el-anchor-link :href="`#${locale['anchor-api']}`">
        {{ locale['Anchor API'] }}
        <template #sub-link>
          <el-anchor-link :href="`#${locale['anchor-attributes']}`">
            {{ locale['Anchor Attributes'] }}
          </el-anchor-link>
          <el-anchor-link :href="`#${locale['anchor-events']}`">
            {{ locale['Anchor Events'] }}
          </el-anchor-link>
        </template>
      </el-anchor-link>
    </el-anchor>
  </el-affix>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import anchorLocale from '../../.vitepress/i18n/component/anchor.json'
import { useLang } from '~/composables/lang'

const lang = useLang()
const locale = computed(() => anchorLocale[lang.value])
</script>
```

--------------------------------

### Element Plus Link Component: Icon Integration

Source: https://element-plus.org/en-US/component/link

Demonstrates how to add icons to the Element Plus Link component. It shows examples of using icons before or after the link text, utilizing Element Plus icons.

```vue
<template>
  <div>
    <el-link :icon="Edit">Edit</el-link>
    <el-link>
      Check<el-icon class="el-icon--right"><icon-view /></el-icon>
    </el-link>
  </div>
</template>

<script setup lang="ts">
import { Edit, View as IconView } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-link {
  margin-right: 8px;
}
</style>
```

--------------------------------

### Input Exposes

Source: https://element-plus.org/en-US/component/input

This section outlines the methods and properties exposed by the Input component's instance, allowing for programmatic control and access to internal states.

```APIDOC
## Input Exposes

### Description
Methods and properties exposed by the Input component instance.

### Exposes
- **blur** (Function) - Blur the input element.
- **clear** (Function) - Clear input value.
- **focus** (Function) - Focus the input element.
- **input** (object) - HTML input element.
- **ref** (object) - HTML element, input or textarea.
- **resizeTextarea** (Function) - Resize textarea.
- **select** (Function) - Select the text in input element.
- **textarea** (object) - HTML textarea element.
- **textareaStyle** (object) - Style of textarea.
- **isComposing** (object) - Is input composing.
- **passwordVisible** (object) - Whether the password is visible.
```

--------------------------------

### Element Plus Slider Sizes (Vue)

Source: https://element-plus.org/en-US/component/slider

Illustrates how to apply different sizes ('large', 'default', 'small') to the Element Plus slider component, including when used with an input box. This example is written in Vue.js.

```vue
<template>
  <div class="slider-demo-block">
    <el-slider v-model="value" show-input size="large" />
    <el-slider v-model="value" show-input />
    <el-slider v-model="value" show-input size="small" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<style scoped>
.slider-demo-block {
  max-width: 600px;
}

.el-slider {
  margin-top: 20px;
}

.el-slider:first-child {
  margin-top: 0;
}
</style>
```

--------------------------------

### Implement Colspan in Virtualized Table

Source: https://element-plus.org/en-US/component/table-v2

Use a custom row renderer to implement colspan. This example shows how to dynamically adjust cell widths and merge cells based on row index. Requires Vue and Element Plus.

```vue
<template>
  <el-table-v2 fixed :columns="columns" :data="data" :width="700" :height="400">
    <template #row="props">
      <Row v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="ts" setup>
import { cloneVNode } from 'vue'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 200)

const colSpanIndex = 1
columns[colSpanIndex].colSpan = ({ rowIndex }) => (rowIndex % 4) + 1
columns[colSpanIndex].align = 'center'

const Row = ({ rowData, rowIndex, cells, columns }) => {
  const colSpan = columns[colSpanIndex].colSpan({ rowData, rowIndex })
  if (colSpan > 1) {
    let width = Number.parseInt(cells[colSpanIndex].props.style.width)
    for (let i = 1; i < colSpan; i++) {
      width += Number.parseInt(cells[colSpanIndex + i].props.style.width)
      cells[colSpanIndex + i] = null
    }
    const style = {
      ...cells[colSpanIndex].props.style,
      width: `${width}px`,
      backgroundColor: 'var(--el-color-primary-light-3)',
    }
    cells[colSpanIndex] = cloneVNode(cells[colSpanIndex], { style })
  }

  return cells
}
</script>
```

--------------------------------

### Basic InputTag Implementation

Source: https://element-plus.org/en-US/component/input-tag

Demonstrates the standard usage of the InputTag component where users can add tags by pressing the Enter key.

```vue
<template>
  <el-input-tag
    v-model="input"
    placeholder="Please input"
    aria-label="Please click the Enter key after input"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref<string[]>()
</script>
```

--------------------------------

### Custom Thumbnail Template with Scoped Slot

Source: https://element-plus.org/en-US/component/upload

Use the scoped slot to customize the thumbnail template for uploaded files. This example shows how to display a thumbnail, preview, download, and delete actions.

```vue
<template>
  <el-upload action="#" list-type="picture-card" :auto-upload="false">
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}
</script>
```

--------------------------------

### Element Plus Image Basic Usage with Fit Modes

Source: https://element-plus.org/en-US/component/image

Demonstrates how to use the Element Plus Image component with different 'fit' modes (fill, contain, cover, none, scale-down) to control how the image is resized within its container. This example uses Vue.js.

```vue
<template>
  <div class="demo-image">
    <div v-for="fit in fits" :key="fit" class="block">
      <span class="demonstration">{{ fit }}</span>
      <el-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ImageProps } from 'element-plus'

const fits = [
  'fill',
  'contain',
  'cover',
  'none',
  'scale-down',
] as ImageProps['fit'][];
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
</script>

<style scoped>
.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  min-width: 100px;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image .block:last-child {
  border-right: none;
}
.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
```

--------------------------------

### Customize Table Tooltip Content with Formatter

Source: https://element-plus.org/en-US/component/table

This example shows how to use the tooltip-formatter property on el-table and el-table-column components. It demonstrates three approaches: a custom function, an inline arrow function, and a VNode renderer.

```vue
<template>
  <el-table
    :data="tableData"
    show-overflow-tooltip
    :tooltip-formatter="tableRowFormatter"
    style="width: 100%"
  >
    <el-table-column
      prop="address"
      label="extends table formatter"
      width="240"
    />
    <el-table-column
      prop="tags"
      label="formatter object"
      width="240"
      :tooltip-formatter="({ row }) => row.tags.join(', ')"
    >
      <template #default="{ row }">
        <el-tag
          v-for="tag in row.tags"
          :key="tag"
          class="tag-item"
          type="primary"
        >
          {{ tag }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="url"
      label="with vnode"
      width="240"
      :tooltip-formatter="withVNode"
    />
  </el-table>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { ElLink, type TableTooltipData } from 'element-plus'

type TableData = {
  address: string
  tags: string[]
  url: string
}

const tableData: TableData[] = [
  {
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
    tags: ['Office', 'Home', 'Park', 'Garden'],
    url: 'https://github.com/element-plus/element-plus/issues',
  },
  {
    address: '760 A Street, South Frankfield, Illinois',
    tags: ['error', 'warning', 'success', 'info'],
    url: 'https://github.com/element-plus/element-plus/pulls',
  },
  {
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
    tags: ['one', 'two', 'three', 'four', 'five'],
    url: 'https://github.com/element-plus/element-plus/discussions',
  },
  {
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
    tags: ['blue', 'white', 'dark', 'gray', 'red', 'bright'],
    url: 'https://github.com/element-plus/element-plus/actions',
  },
]

const tableRowFormatter = (data: TableTooltipData<TableData>) => {
  return `${data.cellValue}: table formatter`
}

const withVNode = (data: TableTooltipData<TableData>) => {
  return h(ElLink, { type: 'primary', href: data.cellValue }, () =>
    h('span', null, data.cellValue)
  )
}
</script>
```

--------------------------------

### Show Checked Strategy

Source: https://element-plus.org/en-US/component/cascader

Demonstrates how to use the `show-checked-strategy` attribute in the ElCascader component to control the display of selected values in multiple selection mode. It shows examples for both 'child' and 'parent' strategies.

```APIDOC
## Show Checked Strategy

Control how selected values are displayed in multiple selection mode.

In multiple selection mode, you can use `show-checked-strategy` to control how selected values are displayed. The default strategy is `child`, which shows all selected child nodes. The `parent` strategy only shows parent nodes when all their children are selected.

### Example 1: Child Strategy (Default)

This example uses the `child` strategy, which displays all selected child nodes.

```vue
<template>
  <div class="m-4">
    <p>Strategy: child (default, show all selected child nodes)</p>
    <el-cascader
      v-model="value1"
      :options="options"
      :props="props"
      show-checked-strategy="child"
      clearable
      @change="handleChange1"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref([])
const props = {
  multiple: true,
}

const handleChange1 = (value) => {
  console.log('Child strategy:', value)
}

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
        ],
      },
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
    ],
  },
]
</script>
```

### Example 2: Parent Strategy

This example uses the `parent` strategy, which only shows parent nodes when all their children are selected.

```vue
<template>
  <div class="m-4">
    <p>
      Strategy: parent (show only parent nodes when all children are selected)
    </p>
    <el-cascader
      v-model="value2"
      :options="options"
      :props="props"
      show-checked-strategy="parent"
      clearable
      @change="handleChange2"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value2 = ref([])
const props = {
  multiple: true,
}

const handleChange2 = (value) => {
  console.log('Parent strategy:', value)
}

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
        ],
      },
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
    ],
  },
]
</script>
```

### Component Properties

- **show-checked-strategy** (string) - Optional - Controls how selected values are displayed in multiple selection mode. Can be 'child' (default) or 'parent'.
```

--------------------------------

### Basic Tour Usage in Vue

Source: https://element-plus.org/en-US/component/tour

Demonstrates the fundamental implementation of the ElTour component with multiple steps targeting different elements. Ensure all referenced elements are correctly defined and available.

```vue
<template>
  <el-button type="primary" @click="open = true">Begin Tour</el-button>

  <el-divider />

  <el-space>
    <el-button ref="ref1">Upload</el-button>
    <el-button ref="ref2" type="primary">Save</el-button>
    <el-button ref="ref3" :icon="MoreFilled" />
  </el-space>

  <el-tour v-model="open">
    <el-tour-step :target="ref1?.$el" title="Upload File">
      <img
        style="width: 240px"
        src="https://element-plus.org/images/element-plus-logo.svg"
        alt="tour.png"
      />
      <div>Put you files here.</div>
    </el-tour-step>
    <el-tour-step
      :target="ref2?.$el"
      title="Save"
      description="Save your changes"
    />
    <el-tour-step
      :target="ref3?.$el"
      title="Other Actions"
      description="Click to see other"
    />
  </el-tour>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'

import type { ButtonInstance } from 'element-plus'

const ref1 = ref<ButtonInstance>()
const ref2 = ref<ButtonInstance>()
const ref3 = ref<ButtonInstance>()

const open = ref(false)
</script>
```

--------------------------------

### Import Icons via CDN (unpkg)

Source: https://element-plus.org/en-US/component/icon

Import Element Plus Icons directly into your HTML using a CDN link. This method makes icons available globally via the `ElementPlusIconsVue` variable.

```html
<script src="//unpkg.com/@element-plus/icons-vue"></script>
```

--------------------------------

### Configure Popover Placements in Vue

Source: https://element-plus.org/en-US/component/popover

This example demonstrates how to implement various Popover placements using the el-popover component. It utilizes the placement attribute to define the orientation and alignment of the popover relative to the trigger button.

```vue
<template>
  <div class="popover-base-box">
    <div class="row center">
      <el-popover
        title="Title"
        content="Top Left prompts info"
        placement="top-start"
      >
        <template #reference>
          <el-button>top-start</el-button>
        </template>
      </el-popover>
      <el-popover
        title="Title"
        content="Top Center prompts info"
        placement="top"
      >
        <template #reference>
          <el-button>top</el-button>
        </template>
      </el-popover>
      <el-popover
        title="Title"
        content="Top Right prompts info"
        placement="top-end"
      >
        <template #reference>
          <el-button>top-end</el-button>
        </template>
      </el-popover>
    </div>
    <div class="row">
      <el-popover
        title="Title"
        content="Left Top prompts info"
        placement="left-start"
      >
        <template #reference>
          <el-button>left-start</el-button>
        </template>
      </el-popover>
      <el-popover
        title="Title"
        content="Right Top prompts info"
        placement="right-start"
      >
        <template #reference>
          <el-button>right-start</el-button>
        </template>
      </el-popover>
    </div>
    <div class="row">
      <el-popover
        title="Title"
        content="Left Center prompts info"
        placement="left"
      >
        <template #reference>
          <el-button class="mt-3 mb-3">left</el-button>
        </template>
      </el-popover>
      <el-popover
        title="Title"
        content="Right Center prompts info"
        placement="right"
      >
        <template #reference>
          <el-button>right</el-button>
        </template>
      </el-popover>
    </div>
    <div class="row">
      <el-popover
        title="Title"
        content="Left Bottom prompts info"
        placement="left-end"
      >
        <template #reference>
          <el-button>left-end</el-button>
        </template>
      </el-popover>
      <el-popover
        title="Title"
        content="Right Bottom prompts info"
        placement="right-end"
      >
        <template #reference>
          <el-button>right-end</el-button>
        </template>
      </el-popover>
    </div>
    <div class="row center">
      <el-popover
        title="Title"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <template #reference> <el-button>bottom-start</el-button></template>
      </el-popover>
      <el-popover
        title="Title"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <template #reference> <el-button>bottom</el-button></template>
      </el-popover>
      <el-popover
        title="Title"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <template #reference>
          <el-button>bottom-end</el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style>
.popover-base-box {
  width: 600px;
}

.popover-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popover-base-box .center {
  justify-content: center;
}
</style>
```

--------------------------------

### Element Plus Space Basic Usage Example

Source: https://element-plus.org/en-US/component/space

Demonstrates the basic usage of the `el-space` component to provide unified spacing between card elements. It utilizes the `wrap` attribute to allow elements to wrap to the next line if necessary. This snippet is written in Vue.js.

```vue
<template>
  <el-space wrap>
    <el-card v-for="i in 3" :key="i" class="box-card" style="width: 250px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
    </el-card>
  </el-space>
</template>
```

--------------------------------

### Select Component Configuration

Source: https://element-plus.org/en-US/component/select-v2

Documentation for the Select component attributes, including accessibility, data mapping, and tooltip configuration.

```APIDOC
## Select Component Props

### Accessibility & Configuration
- **aria-label** (string) - Optional - Same as aria-label in native input (2.5.0)
- **empty-values** (array) - Optional - Empty values of component (2.7.0)
- **value-on-clear** (string/number/boolean/Function) - Optional - Clear return value (2.7.0)
- **tabindex** (string/number) - Optional - Tabindex for input (2.9.0)

### Data Mapping
- **value** (string) - Optional - Specify which key of node object is used as the node's value
- **label** (string) - Optional - Specify which key of node object is used as the node's label
- **options** (string) - Optional - Specify which key of node object is used as the node's children
- **disabled** (string) - Optional - Specify which key of node object is used as the node's disabled
```

--------------------------------

### Circular Progress Bar Examples

Source: https://element-plus.org/en-US/component/progress

Set the `type` attribute to `circle` for a circular progress bar. The `width` attribute can be used to adjust the size of the circle.

```vue
<template>
  <div class="demo-progress">
    <el-progress type="circle" :percentage="0" />
    <el-progress type="circle" :percentage="25" />
    <el-progress type="circle" :percentage="100" status="success" />
    <el-progress type="circle" :percentage="70" status="warning" />
    <el-progress type="circle" :percentage="50" status="exception" />
  </div>
</template>

<style scoped>
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>
```

--------------------------------

### Customize Transfer with render-content

Source: https://element-plus.org/en-US/component/transfer

Use the `render-content` prop to customize how data items are rendered in the transfer list. This example also shows customization of titles, button texts, and footer content, along with the `change` event.

```vue
<template>
  <p style="text-align: center; margin: 0 0 20px">
    Customize data items using render-content
  </p>
  <div style="text-align: center">
    <el-transfer
      v-model="leftValue"
      style="text-align: left; display: inline-block"
      filterable
      :left-default-checked="[2, 3]"
      :right-default-checked="[1]"
      :render-content="renderFunc"
      :titles="['Source', 'Target']"
      :button-texts="['To left', 'To right']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
      :data="data"
      @change="handleChange"
    >
      <template #left-footer>
        <el-button class="transfer-footer" size="small">Operation</el-button>
      </template>
      <template #right-footer>
        <el-button class="transfer-footer" size="small">Operation</el-button>
      </template>
    </el-transfer>
    <p style="text-align: center; margin: 50px 0 20px">
      Customize data items using scoped slot
    </p>
    <div style="text-align: center">
      <el-transfer
        v-model="rightValue"
        style="text-align: left; display: inline-block"
        filterable
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :titles="['Source', 'Target']"
        :button-texts="['To left', 'To right']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="data"
        @change="handleChange"
      >
        <template #default="{ option }">
          <span>{{ option.key }} - {{ option.label }}</span>
        </template>
        <template #left-footer>
          <el-button class="transfer-footer" size="small">Operation</el-button>
        </template>
        <template #right-footer>
          <el-button class="transfer-footer" size="small">Operation</el-button>
        </template>
      </el-transfer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type {
  TransferDirection,
  TransferKey,
  renderContent,
} from 'element-plus'

interface Option {
  key: number
  label: string
  disabled: boolean
}

const generateData = (): Option[] => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref(generateData())
const rightValue = ref([1])
const leftValue = ref([1])

const renderFunc: renderContent = (h, option) => h('span', null, option.label)

const handleChange = (
  value: TransferKey[],
  direction: TransferDirection,
  movedKeys: TransferKey[]
) => {
  console.log(value, direction, movedKeys)
}
</script>

<style>
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}
</style>
```

--------------------------------

### Add and Remove Tabs in Element Plus Tabs

Source: https://element-plus.org/en-US/component/tabs

Demonstrates how to dynamically add and remove tabs in the Element Plus Tabs component. Includes setup for tab management and event handling for closing tabs.

```vue
<template>
  <div style="margin-bottom: 20px">
    <el-button size="small" @click="addTab(editableTabsValue)">
      add tab
    </el-button>
  </div>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TabPaneName } from 'element-plus'

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
```

--------------------------------

### Implement Virtual Triggering for Context Menu

Source: https://element-plus.org/en-US/component/dropdown

This example demonstrates how to use the virtual-triggering property to display an Element Plus dropdown at the location of a right-click event. It uses a custom virtual reference object that provides a getBoundingClientRect method to position the popper correctly.

```vue
<template>
  <el-card
    class="content"
    body-class="card-body"
    @click="handleClick"
    @contextmenu="handleContextmenu"
  >
    Right click
  </el-card>
  <el-dropdown
    ref="dropdownRef"
    :virtual-ref="triggerRef"
    :show-arrow="false"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
    }"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom-start"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Plus">Action 1</el-dropdown-item>
        <el-dropdown-item :icon="CirclePlusFilled"> Action 2 </el-dropdown-item>
        <el-dropdown-item :icon="CirclePlus">Action 3</el-dropdown-item>
        <el-dropdown-item :icon="Check">Action 4</el-dropdown-item>
        <el-dropdown-item :icon="CircleCheck">Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from '@element-plus/icons-vue'

import type { DropdownInstance } from 'element-plus'

const dropdownRef = ref<DropdownInstance>()
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value,
})

const handleClick = () => {
  dropdownRef.value?.handleClose()
}

const handleContextmenu = (event: MouseEvent) => {
  const { clientX, clientY } = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropdownRef.value?.handleOpen()
}
</script>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.content :deep(.card-body) {
  flex-grow: 0;
}
</style>
```

--------------------------------

### Import via CDN

Source: https://element-plus.org/en-US/guide/installation

Include Element Plus directly in HTML using unpkg or jsDelivr.

```html
<head>
  <!-- Import style -->
  <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
  <!-- Import Vue 3 -->
  <script src="//unpkg.com/vue@3"></script>
  <!-- Import component library -->
  <script src="//unpkg.com/element-plus"></script>
</head>
```

```html
<head>
  <!-- Import style -->
  <link
    rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/element-plus/dist/index.css"
  />
  <!-- Import Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@3"></script>
  <!-- Import component library -->
  <script src="//cdn.jsdelivr.net/npm/element-plus"></script>
</head>
```

--------------------------------

### Basic Link Usage

Source: https://element-plus.org/en-US/component/link

Demonstrates the basic usage of the Link component with various type options.

```APIDOC
## Basic Link Usage

### Description
Displays basic text links with different type styles: default, primary, success, warning, danger, and info.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```vue
<template>
  <div>
    <el-link href="https://element-plus.org" target="_blank">default</el-link>
    <el-link type="primary">primary</el-link>
    <el-link type="success">success</el-link>
    <el-link type="warning">warning</el-link>
    <el-link type="danger">danger</el-link>
    <el-link type="info">info</el-link>
  </div>
</template>

<style scoped>
.el-link {
  margin-right: 8px;
}
</style>
```

### Response
#### Success Response (200)
N/A (Component Rendering)

#### Response Example
N/A (Component Rendering)
```

--------------------------------

### Customize Select Dropdown Footer

Source: https://element-plus.org/en-US/component/select

Shows how to implement a custom footer in a Select component using the #footer slot. This example allows users to dynamically add new options to the list via an input field.

```vue
<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in cities"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <template #footer>
      <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
        Add an option
      </el-button>
      <template v-else>
        <el-input
          v-model="optionName"
          class="option-input"
          placeholder="input option name"
          size="small"
        />
        <el-button type="primary" size="small" @click="onConfirm">
          confirm
        </el-button>
        <el-button size="small" @click="clear">cancel</el-button>
      </template>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { CheckboxValueType } from 'element-plus'

const isAdding = ref(false)
const value = ref<CheckboxValueType[]>([])
const optionName = ref('')
const cities = ref([
  { value: 'Beijing', label: 'Beijing' },
  { value: 'Shanghai', label: 'Shanghai' },
  { value: 'Nanjing', label: 'Nanjing' },
  { value: 'Chengdu', label: 'Chengdu' },
  { value: 'Shenzhen', label: 'Shenzhen' },
  { value: 'Guangzhou', label: 'Guangzhou' },
])

const onAddOption = () => { isAdding.value = true }
const onConfirm = () => {
  if (optionName.value) {
    cities.value.push({ label: optionName.value, value: optionName.value })
    clear()
  }
}
const clear = () => {
  optionName.value = ''
  isAdding.value = false
}
</script>

<style>
.option-input { width: 100%; margin-bottom: 8px; }
</style>
```

--------------------------------

### Element Plus Dropdown Placement Options (Vue)

Source: https://element-plus.org/en-US/component/dropdown

Illustrates how to control the placement of an Element Plus dropdown menu using the `placement` property. This example shows six different positioning options: top-start, top, top-end, bottom-start, bottom, and bottom-end, relative to the trigger button.

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <el-dropdown placement="top-start">
      <el-button> topStart </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown placement="top">
      <el-button> top </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown placement="top-end">
      <el-button> topEnd </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown placement="bottom-start">
      <el-button> bottomStart </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown placement="bottom">
      <el-button> bottom </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown placement="bottom-end">
      <el-button> bottomEnd </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2nd</el-dropdown-item>
          <el-dropdown-item>The Action 3rd</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
```

--------------------------------

### Manually Open Preview

Source: https://element-plus.org/en-US/component/image

Demonstrates how to trigger the image previewer manually using the component instance method or by controlling the visibility of the el-image-viewer component.

```APIDOC
## Method: showPreview

### Description
Allows developers to trigger the image previewer programmatically via the component reference or by toggling the visibility of the standalone el-image-viewer component.

### Methods
- **showPreview()** - Invoked on the el-image instance to open the previewer.

### Component: el-image-viewer
- **url-list** (Array<string>) - Required - List of images to display.
- **show-progress** (boolean) - Optional - Show progress indicator.
- **@close** (event) - Required - Callback triggered when the viewer is closed.

### Usage Example
const imageRef = ref<ImageInstance>();
imageRef.value!.showPreview();
```

--------------------------------

### Implement Tree Data and Lazy Loading in Element Plus Table

Source: https://element-plus.org/en-US/component/table

This example demonstrates two table configurations: one with static nested tree data and another with asynchronous lazy loading. It utilizes the 'row-key' property for identification and 'tree-props' to define the structure.

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="date" label="Date" sortable />
      <el-table-column prop="name" label="Name" sortable />
      <el-table-column prop="address" label="Address" sortable />
    </el-table>

    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const load = (
  row: User,
  treeNode: unknown,
  resolve: (data: User[]) => void
) => {
  setTimeout(() => {
    resolve([
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
  }, 1000)
}

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const tableData1: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    hasChildren: true,
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
```

--------------------------------

### Custom SVG Loading Icon for Select

Source: https://element-plus.org/en-US/component/select-v2

Use the #loading slot to replace the default loading indicator with a custom SVG. This example shows a circular progress indicator.

```vue
<template>
  <div class="flex flex-wrap">
    <div class="m-4">
      <p>loading icon1</p>
      <el-select-v2
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
        :loading="loading"
        :options="options"
        style="width: 240px"
      >
        <template #loading>
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </template>
      </el-select-v2>
    </div>
    <div class="m-4">
      <p>loading icon2</p>
      <el-select-v2
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
        :loading="loading"
        :options="options"
        style="width: 240px"
      >
        <template #loading>
          <el-icon class="is-loading">
            <svg class="circular" viewBox="0 0 20 20">
              <g
                class="path2 loading-path"
                stroke-width="0"
                style="animation: none; stroke: none"
              >
                <circle r="3.375" class="dot1" rx="0" ry="0" />
                <circle r="3.375" class="dot2" rx="0" ry="0" />
                <circle r="3.375" class="dot4" rx="0" ry="0" />
                <circle r="3.375" class="dot3" rx="0" ry="0" />
              </g>
            </svg>
          </el-icon>
        </template>
      </el-select-v2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 3000)
  } else {
    options.value = []
  }
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]
</script>

<style>
.el-select-dropdown__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 20px;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}
.loading-path .dot1 {
  transform: translate(3.75px, 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
}
.loading-path .dot2 {
  transform: translate(calc(100% - 3.75px), 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.4s;
}
.loading-path .dot3 {
  transform: translate(3.75px, calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 1.2s;
}
.loading-path .dot4 {
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.8s;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
```

--------------------------------

### CDN Usage for Element Plus Localization

Source: https://element-plus.org/en-US/guide/i18n

When using Element Plus via CDN, load the locale file separately and then configure the application to use it. This example demonstrates using unpkg to load the Chinese locale.

```html
<script src="//unpkg.com/element-plus/dist/locale/zh-cn"></script>
<script>
  app.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn,
  })
</script>
```

--------------------------------

### Global Configuration with Full Import

Source: https://element-plus.org/en-US/guide/quickstart

Configure global settings like size and zIndex when using the full import method in your main application file.

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
```

--------------------------------

### Implement Vertical Sidebar Menu with Element Plus

Source: https://element-plus.org/en-US/component/menu

This example demonstrates a vertical navigation menu with nested sub-menus and item groups. It includes both default styling and a custom color scheme using the el-menu component.

```vue
<template>
  <el-row class="tac">
    <el-col :span="12">
      <h5 class="mb-2">Default colors</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>Navigator Four</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="12">
      <h5 class="mb-2">Custom colors</h5>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <span>Navigator Three</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>Navigator Four</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
```

--------------------------------

### Text Button Examples - Element Plus

Source: https://element-plus.org/en-US/component/button.html

Showcases basic, background-on, and disabled text buttons. The `text` prop is used for text button styling. The `bg` prop keeps the background color always on.

```vue
<template>
  <p>Basic text button</p>
  <div class="mb-4">
    <el-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type"
      text
    >
      {{ button.text }}
    </el-button>
  </div>

  <p>Background color always on</p>
  <div class="mb-4">
    <el-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type"
      text
      bg
    >
      {{ button.text }}
    </el-button>
  </div>

  <p>Disabled text button</p>
  <div>
    <el-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type"
      text
      disabled
    >
      {{ button.text }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
const buttons = [
  { type: '', text: 'plain' },
  { type: 'primary', text: 'primary' },
  { type: 'success', text: 'success' },
  { type: 'info', text: 'info' },
  { type: 'warning', text: 'warning' },
  { type: 'danger', text: 'danger' },
] as const
</script>
```

--------------------------------

### Customize Cascader Header and Footer with Slots

Source: https://element-plus.org/en-US/component/cascader

This example shows how to use the #header and #footer slots in an Element Plus Cascader. It implements a 'Select All' checkbox in the header and a 'Clear' button in the footer to manage cascader values.

```vue
<template>
  <div class="cascader-custom-header-footer">
    <div>
      <p>Custom header content</p>
      <el-cascader
        v-model="value"
        popper-class="cascader-custom-header"
        :options="options"
        :props="props"
        clearable
      >
        <template #header>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            @change="handleCheckAll"
          >
            All
          </el-checkbox>
        </template>
      </el-cascader>
    </div>
    <div>
      <p>Custom footer content</p>
      <el-cascader v-model="value" :options="options" :props="props" clearable>
        <template #footer>
          <el-button link size="small" @click="handleClear"> Clear </el-button>
        </template>
      </el-cascader>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import type { CascaderOption, CheckboxValueType } from 'element-plus'

const props = { multiple: true }
const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref<string[][]>([])
const options = ref([
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          { value: 'consistency', label: 'Consistency' },
          { value: 'feedback', label: 'Feedback' },
          { value: 'efficiency', label: 'Efficiency' },
          { value: 'controllability', label: 'Controllability' },
        ],
      },
    ],
  },
])

const getAllValuePaths = computed(() => {
  const result: string[][] = []
  const queue: { node: CascaderOption; path: string[] }[] = options.value.map(
    (node) => ({ node, path: [node.value] })
  )

  while (queue.length > 0) {
    const { node, path } = queue.shift()!
    if (node.children?.length) {
      node.children.forEach((child) => {
        queue.push({ node: child, path: [...path, child.value as string] })
      })
    } else {
      result.push(path)
    }
  }
  return result
})

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === getAllValuePaths.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  value.value = val ? getAllValuePaths.value : []
}

const handleClear = () => {
  value.value = []
}
</script>

<style scoped>
.cascader-custom-header-footer {
  display: flex;
}

.cascader-custom-header-footer > div {
  flex: 1;
  text-align: center;
}

.cascader-custom-header-footer > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}

.cascader-custom-header .el-checkbox {
  display: flex;
  height: unset;
}
</style>
```

--------------------------------

### Implement Dialog Lifecycle Events

Source: https://element-plus.org/en-US/component/dialog

Demonstrates how to hook into various Dialog lifecycle events like open, opened, close, and closed using Vue 3. The example uses the el-dialog component with event listeners to log status changes to the console.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Open the event Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    modal-class="overide-animation"
    :before-close="
      (doneFn) => {
        ;(console.log('before-close'), doneFn())
      }
    "
    @open="console.log('open')"
    @open-auto-focus="console.log('open-auto-focus')"
    @opened="console.log('opened')"
    @close="console.log('close')"
    @close-auto-focus="console.log('close-auto-focus')"
    @closed="console.log('closed')"
  >
    <span>It's a event Dialog</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
</script>
```

--------------------------------

### Customizing Suggestion Item

Source: https://element-plus.org/en-US/component/cascader

This example demonstrates how to use the `suggestion-item` slot to customize the display of suggestion items in the `el-cascader` component. The `item` object is available in the scope, allowing access to properties like `pathLabels` for display.

```APIDOC
## Custom Suggestion Item

### Description
Allows customization of the filter suggestion item using the `suggestion-item` slot. The `item` object, representing the suggestion item, is accessible within the slot scope.

### Method
N/A (Component Slot)

### Endpoint
N/A (Component Slot)

### Parameters
#### Slot Scope
- **item** (object) - The suggestion item object. Contains properties like `pathLabels`.

### Request Example
```html
<template>
  <el-cascader :options="options" filterable placeholder="Try searching: Guide">
    <template #suggestion-item="{ item }">
      <span>🔍 {{ item.pathLabels.join(' > ') }}</span>
    </template>
  </el-cascader>
</template>
```

### Response
N/A (Component Rendering)

#### Success Response (200)
N/A

#### Response Example
N/A
```

--------------------------------

### Input Number Sizes

Source: https://element-plus.org/en-US/component/input-number

Demonstrates different component sizes including large, default, and small.

```vue
<template>
  <div class="flex flex-wrap items-center gap-4">
    <el-input-number v-model="num1" size="large" />
    <el-input-number v-model="num2" />
    <el-input-number v-model="num3" size="small" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(2)
const num3 = ref(3)
</script>
```

--------------------------------

### Configure Button Global Styles

Source: https://element-plus.org/en-US/component/config-provider

Shows how to apply global button configurations like auto-insert space, plain, round, and type settings using the Config Provider.

```vue
<template>
  <div>
    <div>
      <el-checkbox v-model="config.autoInsertSpace">
        autoInsertSpace
      </el-checkbox>
      <el-checkbox v-model="config.plain"> plain </el-checkbox>
      <el-checkbox v-model="config.round"> round </el-checkbox>
      <el-checkbox v-model="config.dashed"> dashed </el-checkbox>
      <el-checkbox v-model="config.text"> text </el-checkbox>
      <el-select v-model="config.type" class="ml-5" style="max-width: 150px">
        <el-option
          v-for="type in buttonTypes.filter(Boolean)"
          :key="type"
          :value="type"
        />
      </el-select>
    </div>
    <el-divider />
    <el-config-provider :button="config">
      <el-button>中文</el-button>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { buttonTypes } from 'element-plus'

import type { ButtonConfigContext } from 'element-plus'

const config = reactive<ButtonConfigContext>({
  autoInsertSpace: true,
  type: 'default',
  plain: true,
  round: true,
  text: false,
  dashed: false,
})
</script>
```

--------------------------------

### Configure On-demand Imports for Transitions

Source: https://element-plus.org/en-US/guide/transitions

Shows how to import the CollapseTransition component and base CSS styles for transitions in a main entry file.

```typescript
import { ElCollapseTransition } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import App from './App.vue'

const app = createApp(App)
app.component(ElCollapseTransition.name, ElCollapseTransition)
```

--------------------------------

### Controlled Tooltip Example

Source: https://element-plus.org/en-US/component/tooltip.html

Control the tooltip's visibility from the parent component using the `:visible` prop for two-way binding. The tooltip appears on hover and disappears when the mouse leaves.

```vue
<template>
  <el-tooltip :visible="visible">
    <template #content>
      <span>Content</span>
    </template>
    <el-button @mouseenter="visible = true" @mouseleave="visible = false">
      Hover me
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
```

--------------------------------

### Element Plus Dialog with Modal Disabled

Source: https://element-plus.org/en-US/component/dialog

This example demonstrates how to disable the modal overlay for the Element Plus Dialog component by setting the `modal` attribute to `false`. It also shows how to enable modal penetration using `modal-penetrable`.

```APIDOC
## Dialog Component with Modal Disabled

### Description
This section details how to configure the Element Plus Dialog component to disable its modal overlay and enable penetration. The `modal` attribute controls the overlay, and `modal-penetrable` allows interaction with elements behind the dialog.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Component Attributes
- **`v-model`** (boolean) - Controls the visibility of the dialog.
- **`modal`** (boolean) - Optional. Defaults to `true`. Setting to `false` hides the modal overlay.
- **`modal-penetrable`** (boolean) - Optional. Added in version 2.10.5. Allows the modal to be penetrable.

### Request Example
```html
<template>
  <el-button plain @click="dialogVisible = true">
    Open the modal Dialog
  </el-button>

  <el-dialog v-model="dialogVisible" :modal="false" modal-penetrable>
    <span>It's a modal Dialog</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
</script>
```

### Response
#### Success Response (Component Render)
- The dialog will render without a modal overlay, and interactions behind the dialog will be possible if `modal-penetrable` is also set.
```

--------------------------------

### Basic Usage of Backtop Component

Source: https://element-plus.org/en-US/component/backtop

Demonstrates the simplest implementation of the Backtop component. It uses the default icon and positioning properties to trigger a scroll-to-top action.

```vue
<template>
  Scroll down to see the bottom-right button.
  <el-backtop :right="100" :bottom="100" />
</template>
```

--------------------------------

### Customize ColorPickerPanel Border

Source: https://element-plus.org/en-US/component/color-picker-panel

Shows how to remove the default border from the ColorPickerPanel by setting the border attribute to false. This example also demonstrates responsive layout handling using VueUse.

```vue
<template>
  <div ref="containerRef">
    <div class="text-center">No border:</div>
    <el-divider />
    <div class="flex flex-wrap justify-center gap-4">
      <div class="p-5">
        <el-color-picker-panel v-model="value" :border="false" />
      </div>
      <el-divider
        class="h-auto"
        :direction="isNarrow ? 'horizontal' : 'vertical'"
      />
      <el-card>
        <el-color-picker-panel v-model="value" :border="false" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const value = ref('#ff6900')
const containerRef = ref<HTMLElement>()

const { width } = useElementSize(containerRef)

const isNarrow = computed(() => width.value < 815)
</script>
```

--------------------------------

### Generate Component Template

Source: https://element-plus.org/en-US/guide/dev-guide

Scaffolds a new component directory structure based on the provided name. It creates the necessary files in the packages/components directory.

```shell
pnpm gen <component-name>
```

--------------------------------

### Vue Table with Fixed Columns and Sorting

Source: https://element-plus.org/en-US/component/table-v2

Use this Vue component to create a table with fixed columns on the left and right, and enable column sorting. Ensure `element-plus` is installed and imported.

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :sort-by="sortBy"
    :width="700"
    :height="400"
    fixed
    @column-sort="onSort"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TableV2FixedDir, TableV2SortOrder } from 'element-plus'

import type { SortBy } from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
let data = generateData(columns, 200)

columns[0].fixed = true
columns[1].fixed = TableV2FixedDir.LEFT
columns[9].fixed = TableV2FixedDir.RIGHT

for (let i = 0; i < 3; i++) columns[i].sortable = true

const sortBy = ref<SortBy>({
  key: 'column-0',
  order: TableV2SortOrder.ASC,
})

const onSort = (_sortBy: SortBy) => {
  data = data.reverse()
  sortBy.value = _sortBy
}
</script>
```

--------------------------------

### Responsive Layout API

Source: https://element-plus.org/en-US/component/layout

Configuring responsive column spans based on preset breakpoints.

```APIDOC
## Component: el-col

### Description
Responsive layout configuration based on Bootstrap-style breakpoints.

### Attributes
- **xs** (number) - Optional - Column span for extra small viewports.
- **sm** (number) - Optional - Column span for small viewports.
- **md** (number) - Optional - Column span for medium viewports.
- **lg** (number) - Optional - Column span for large viewports.
- **xl** (number) - Optional - Column span for extra large viewports.
```

--------------------------------

### Equivalent ElButton Usage After Default Customization

Source: https://element-plus.org/en-US/guide/custom-defaults

This example shows two equivalent ways to use the `el-button` component in a Vue template after the default props have been customized. The first usage relies on the globally set defaults, while the second explicitly declares the same props.

```vue
<template>
  <el-button>Hello</el-button>
  <el-button type="primary" size="small">Hello</el-button>
</template>
```

--------------------------------

### Basic Cascader Panel Usage in Vue

Source: https://element-plus.org/en-US/component/cascader

Demonstrates the basic implementation of the ElCascaderPanel component in a Vue.js application. It shows how to bind options to the component for displaying hierarchical data. This snippet requires the Element Plus library to be installed and configured.

```vue
<template>
  <el-cascader-panel :options="options" />
</template>

<script lang="ts" setup>
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
          {
            value: 'checkbox',
            label: 'Checkbox',
          },
          {
            value: 'input',
            label: 'Input',
          },
          {
            value: 'input-number',
            label: 'InputNumber',
          },
          {
            value: 'select',
            label: 'Select',
          },
          {
            value: 'cascader',
            label: 'Cascader',
          },
          {
            value: 'switch',
            label: 'Switch',
          },
          {
            value: 'slider',
            label: 'Slider',
          },
          {
            value: 'time-picker',
            label: 'TimePicker',
          },
          {
            value: 'date-picker',
            label: 'DatePicker',
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker',
          },
          {
            value: 'upload',
            label: 'Upload',
          },
          {
            value: 'rate',
            label: 'Rate',
          },
          {
            value: 'form',
            label: 'Form',
          },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table',
          },
          {
            value: 'tag',
            label: 'Tag',
          },
          {
            value: 'progress',
            label: 'Progress',
          },
          {
            value: 'tree',
            label: 'Tree',
          },
          {
            value: 'pagination',
            label: 'Pagination',
          },
          {
            value: 'badge',
            label: 'Badge',
          },
        ],
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert',
          },
          {
            value: 'loading',
            label: 'Loading',
          },
          {
            value: 'message',
            label: 'Message',
          },
          {
            value: 'message-box',
            label: 'MessageBox',
          },
          {
            value: 'notification',
            label: 'Notification',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb',
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
          },
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog',
          },
          {

```

--------------------------------

### Page Header - Basic Usage

Source: https://element-plus.org/en-US/component/page-header.html

Demonstrates the basic implementation of the Page Header component for standard page navigation.

```APIDOC
## Page Header - Basic Usage

### Description
This example shows the standard Page Header component, suitable for simple navigation scenarios.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
N/A (Component Usage)

### Request Example
```vue
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script lang="ts" setup>
const goBack = () => {
  console.log('go back')
}
</script>
```

### Response
N/A (Component Usage)
```

--------------------------------

### Element Plus Link Component: Disabled State

Source: https://element-plus.org/en-US/component/link

Illustrates how to disable the Element Plus Link component. This example shows disabled links for all available types, preventing user interaction.

```vue
<template>
  <div>
    <el-link disabled>default</el-link>
    <el-link type="primary" disabled>primary</el-link>
    <el-link type="success" disabled>success</el-link>
    <el-link type="warning" disabled>warning</el-link>
    <el-link type="danger" disabled>danger</el-link>
    <el-link type="info" disabled>info</el-link>
  </div>
</template>

<style scoped>
.el-link {
  margin-right: 8px;
}
</style>
```

--------------------------------

### Element Plus Anchor Basic Usage

Source: https://element-plus.org/en-US/component/anchor

Demonstrates the fundamental implementation of the Element Plus Anchor component. It showcases how to create anchor links that navigate to different sections of the page, including nested sub-links. The example utilizes Vue's composition API and locale management for dynamic text.

```vue
<template>
  <el-anchor :offset="70">
    <el-anchor-link :href="`#${locale['basic-usage']}`">
      {{ locale['Basic Usage'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['horizontal-mode']}`">
      {{ locale['Horizontal Mode'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['scroll-container']}`">
      {{ locale['Scroll Container'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['anchor-api']}`">
      {{ locale['Anchor API'] }}
      <template #sub-link>
        <el-anchor-link :href="`#${locale['anchor-attributes']}`">
          {{ locale['Anchor Attributes'] }}
        </el-anchor-link>
        <el-anchor-link :href="`#${locale['anchor-events']}`">
          {{ locale['Anchor Events'] }}
        </el-anchor-link>
      </template>
    </el-anchor-link>
  </el-anchor>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import anchorLocale from '../../.vitepress/i18n/component/anchor.json'
import { useLang } from '~/composables/lang'

const lang = useLang()
const locale = computed(() => anchorLocale[lang.value])
</script>
```

--------------------------------

### Local Import of MessageBox

Source: https://element-plus.org/en-US/component/message-box

Shows how to import and use MessageBox components locally on demand.

```APIDOC
## Local import 

If you prefer importing `MessageBox` on demand:

```typescript
import { ElMessageBox } from 'element-plus'
```

The corresponding methods are: `ElMessageBox`, `ElMessageBox.alert`, `ElMessageBox.confirm` and `ElMessageBox.prompt`. The parameters are the same as described for the global methods.
```

--------------------------------

### Remove and Reinstall Dependencies

Source: https://element-plus.org/en-US/guide/dev-faq

Use this command to resolve dependency-related issues by clearing the node_modules folder and reinstalling packages with pnpm.

```shell
rm -rf node_modules
pnpm i
```

--------------------------------

### Implement Table Filtering in Element Plus

Source: https://element-plus.org/en-US/component/table

This example demonstrates how to add filterable columns to an el-table. It uses the filters property to define filter options and a filter-method function to determine which rows should be visible based on the selected filter value.

```vue
<template>
  <el-button @click="resetDateFilter">reset date filter</el-button>
  <el-button @click="clearFilter">reset all filters</el-button>
  <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 100%">
    <el-table-column
      prop="date"
      label="Date"
      sortable
      width="180"
      column-key="date"
      :filters="[
        { text: '2016-05-01', value: '2016-05-01' },
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' },
      ]"
      :filter-method="filterHandler"
    />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" :formatter="formatter" />

    <el-table-column
      prop="tag"
      label="Tag"
      width="100"
      :filters="[
        { text: 'Home', value: 'Home' },
        { text: 'Office', value: 'Office' },
      ]"
      :filter-method="filterTag"
      filter-placement="bottom-end"
    >
      <template #default="scope">
        <el-tag
          :type="scope.row.tag === 'Home' ? 'primary' : 'success'"
          disable-transitions
          >{{ scope.row.tag }}</el-tag
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'

interface User {
  date: string
  name: string
  address: string
  tag: string
}

const tableRef = ref<TableInstance>()

const resetDateFilter = () => {
  tableRef.value!.clearFilter(['date'])
}
const clearFilter = () => {
  tableRef.value!.clearFilter()
}
const formatter = (row: User, column: TableColumnCtx<User>) => {
  return row.address
}
const filterTag = (value: string, row: User) => {
  return row.tag === value
}
const filterHandler = (
  value: string,
  row: User,
  column: TableColumnCtx<User>
) => {
  const property = column['property']
  return row[property] === value
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
]
</script>
```

--------------------------------

### Vue: Column Alignment with ElRow Justify

Source: https://element-plus.org/en-US/component/layout

Shows how to align columns within an `el-row` using the `justify` attribute. Supported values include 'start', 'center', 'end', 'space-between', 'space-around', and 'space-evenly', leveraging flex layout for flexible alignment.

```vue
<template>
  <el-row class="row-bg">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row class="row-bg" justify="end">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-between">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-around">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-evenly">
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
```

--------------------------------

### Implement Multiple Row Selection in Element Plus Table

Source: https://element-plus.org/en-US/component/table

This example demonstrates how to configure an el-table for multiple selection. It includes a custom selectable function to restrict selection and buttons to programmatically toggle or clear row selections.

```vue
<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    row-key="id"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" :selectable="selectable" width="55" />
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" />
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">
      Toggle selection status of second and third rows
    </el-button>
    <el-button @click="toggleSelection([tableData[1], tableData[2]], false)">
      Toggle selection status based on selectable
    </el-button>
    <el-button @click="toggleSelection()">Clear selection</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'

interface User {
  id: number
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])

const selectable = (row: User) => ![1, 2].includes(row.id)
const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(
        row,
        undefined,
        ignoreSelectable
      )
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  { id: 1, date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 2, date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 3, date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 4, date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 5, date: '2016-05-08', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 6, date: '2016-05-06', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { id: 7, date: '2016-05-07', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
]
</script>
```

--------------------------------

### Customize Table V2 Cell Rendering

Source: https://element-plus.org/en-US/component/table-v2

Customize table cell content using the cellRenderer prop. This example demonstrates rendering dates with tooltips and icons, names with tags, and operation buttons.

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  ElButton,
  ElIcon,
  ElTag,
  ElTooltip,
  TableV2FixedDir,
} from 'element-plus'
import { Timer } from '@element-plus/icons-vue'

import type { Column } from 'element-plus'

let id = 0

const dataGenerator = () => ({
  id: `random-id-${++id}`,
  name: 'Tom',
  date: '2020-10-1',
})

const columns: Column<any>[] = [
  {
    key: 'date',
    title: 'Date',
    dataKey: 'date',
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData: date }) => (
      <ElTooltip content={dayjs(date).format('YYYY/MM/DD')}>
        {
          <span class="flex items-center">
            <ElIcon class="mr-3">
              <Timer />
            </ElIcon>
            {dayjs(date).format('YYYY/MM/DD')}
          </span>
        }
      </ElTooltip>
    ),
  },
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150,
    align: 'center',
    cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>,
  },
  {
    key: 'operations',
    title: 'Operations',
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
    width: 150,
    align: 'center',
  },
]

const data = ref(Array.from({ length: 200 }).map(dataGenerator))
</script>
```

--------------------------------

### Basic Button Usage

Source: https://element-plus.org/en-US/component/button.html

Demonstrates how to use type, plain, round, dashed, and circle attributes to style buttons.

```vue
<template>
  <div class="button-example">
    <div class="button-row">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </div>

    <div class="button-row">
      <el-button plain>Plain</el-button>
      <el-button type="primary" plain>Primary</el-button>
      <el-button type="success" plain>Success</el-button>
      <el-button type="info" plain>Info</el-button>
      <el-button type="warning" plain>Warning</el-button>
      <el-button type="danger" plain>Danger</el-button>
    </div>

    <div class="button-row">
      <el-button round>Round</el-button>
      <el-button type="primary" round>Primary</el-button>
      <el-button type="success" round>Success</el-button>
      <el-button type="info" round>Info</el-button>
      <el-button type="warning" round>Warning</el-button>
      <el-button type="danger" round>Danger</el-button>
    </div>

    <div class="button-row">
      <el-button dashed>Dashed</el-button>
      <el-button type="primary" dashed>Primary</el-button>
      <el-button type="success" dashed>Success</el-button>
      <el-button type="info" dashed>Info</el-button>
      <el-button type="warning" dashed>Warning</el-button>
      <el-button type="danger" dashed>Danger</el-button>
    </div>

    <div class="button-row">
      <el-button :icon="Search" circle />
      <el-button type="primary" :icon="Edit" circle />
      <el-button type="success" :icon="Check" circle />
      <el-button type="info" :icon="Message" circle />
      <el-button type="warning" :icon="Star" circle />
      <el-button type="danger" :icon="Delete" circle />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
</script>

<style scoped>
.button-example {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.button-row > * {
  margin: 0;
}
</style>
```

--------------------------------

### Basic ColorPicker Usage

Source: https://element-plus.org/en-US/component/color-picker

Demonstrates the fundamental implementation of the ColorPicker component using v-model for data binding. It shows both initialized and uninitialized states.

```vue
<template>
  <div class="demo-color-block">
    <span class="demonstration">With default value</span>
    <el-color-picker v-model="color1" />
  </div>
  <div class="demo-color-block">
    <span class="demonstration">With no default value</span>
    <el-color-picker v-model="color2" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color1 = ref('#409EFF')
const color2 = ref()
</script>

<style>
.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.demo-color-block .demonstration {
  margin-right: 16px;
}
</style>
```

--------------------------------

### Element Plus Slider Tooltip Placement (Vue)

Source: https://element-plus.org/en-US/component/slider

Demonstrates how to customize the placement of the tooltip in the Element Plus slider component using the 'placement' attribute. Available options include 'top', 'bottom', 'left', and 'right'. This example uses Vue.js.

```vue
<template>
  <div class="slider-demo-block">
    <el-slider v-model="value1" />
  </div>
  <div class="slider-demo-block">
    <el-slider v-model="value2" placement="bottom" />
  </div>
  <div class="slider-demo-block">
    <el-slider v-model="value3" placement="right" />
  </div>
  <div class="slider-demo-block">
    <el-slider v-model="value4" placement="left" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
const value4 = ref(0)
</script>

<style scoped>
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
```

--------------------------------

### Programmatic Loading Service Usage

Source: https://element-plus.org/en-US/component/loading

Shows how to invoke the Loading service, manage instances, and ensure proper asynchronous closing of the loading overlay.

```typescript
import { ElLoading } from 'element-plus'

// Basic invocation
const loadingInstance = ElLoading.service(options)

// Closing the instance
nextTick(() => {
  loadingInstance.close()
})

// Singleton behavior check
const loadingInstance1 = ElLoading.service({ fullscreen: true })
const loadingInstance2 = ElLoading.service({ fullscreen: true })
console.log(loadingInstance1 === loadingInstance2) // true
```

--------------------------------

### Customize Tree Node Class with Vue

Source: https://element-plus.org/en-US/component/tree

Use `props.class` to define custom class names for tree nodes. This example demonstrates how to apply a class to nodes based on their properties, affecting their styling.

```vue
<template>
  <div class="custom-tree-node-container">
    <el-tree
      style="max-width: 600px"
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :props="{ class: customNodeClass }"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TreeNodeData } from 'element-plus'

interface Tree {
  id: number
  label: string
  isPenultimate?: boolean
  children?: Tree[]
}

const customNodeClass = ({ isPenultimate }: TreeNodeData) =>
  isPenultimate ? 'is-penultimate' : ''

const data: Tree[] = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        isPenultimate: true,
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    isPenultimate: true,
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    isPenultimate: true,
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>

<style>
.is-penultimate > .el-tree-node__content .el-tree-node__label {
  color: #626aef;
}
.is-penultimate > .el-tree-node__children > div {
  display: inline-block;
  margin-right: 4px;

  &:not(:first-child) .el-tree-node__content {
    padding-left: 0px !important;
  }
  .el-tree-node__content {
    padding-right: 16px;
  }
}
</style>
```

--------------------------------

### Vue InputNumber with Prefix/Suffix Slots

Source: https://element-plus.org/en-US/component/input-number

Demonstrates how to use the prefix and suffix named slots in the ElInputNumber component to display currency symbols or units. This example uses Vue 3 with the Composition API and Element Plus UI library. The input number is bound to a ref and has min/max constraints.

```vue
<template>
  <el-space>
    <el-input-number v-model="num" :min="1" :max="10">
      <template #prefix>
        <span>￥</span>
      </template>
    </el-input-number>
    <el-input-number v-model="num" :min="1" :max="10">
      <template #suffix>
        <span>RMB</span>
      </template>
    </el-input-number>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const num = ref(1)
</script>
```

--------------------------------

### Card Configurations

Source: https://element-plus.org/en-US/component/config-provider

Configure global card properties, specifically the shadow effect.

```APIDOC
## Card Configurations 

Configure global card properties, specifically the shadow effect.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Request Body
- **card** (Object) - Required - Configuration object for cards.
  - **shadow** (String) - Optional - The shadow effect of the card ('always', 'hover', 'never').

### Request Example
```vue
<script lang="ts" setup>
import { reactive } from 'vue'

import type { CardConfigContext } from 'element-plus'

const config = reactive<CardConfigContext>({
  shadow: 'always',
})
</script>

<template>
  Shadow:
  <div class="flex flex-col justify-center">
    <el-radio-group v-model="config.shadow">
      <el-radio value="always">always</el-radio>
      <el-radio value="hover">hover</el-radio>
      <el-radio value="never">never</el-radio>
    </el-radio-group>
    <el-divider />
    <el-config-provider :card="config">
      <el-card>Card desu!</el-card>
    </el-config-provider>
  </div>
</template>
```

### Response
#### Success Response (200)
N/A (Component Usage)

#### Response Example
N/A (Component Usage)
```

--------------------------------

### Element Plus Space: Alignment Control

Source: https://element-plus.org/en-US/component/space

Demonstrates how to control the alignment of child nodes within the ElSpace component using the 'alignment' attribute. It shows examples of default, 'flex-start', and 'flex-end' alignments.

```vue
<template>
  <div class="alignment-container">
    <el-space>
      string
      <el-button> button </el-button>
      <el-card>
        <template #header> header </template>
        body
      </el-card>
    </el-space>
  </div>
  <div class="alignment-container">
    <el-space alignment="flex-start">
      string
      <el-button> button </el-button>
      <el-card>
        <template #header> header </template>
        body
      </el-card>
    </el-space>
  </div>
  <div class="alignment-container">
    <el-space alignment="flex-end">
      string
      <el-button> button </el-button>
      <el-card>
        <template #header> header </template>
        body
      </el-card>
    </el-space>
  </div>
</template>

<style>
.alignment-container {
  width: 240px;
  margin-bottom: 20px;
  padding: 8px;
  border: 1px solid var(--el-border-color);
}
</style>
```

--------------------------------

### Input with Icons using Attributes and Slots

Source: https://element-plus.org/en-US/component/input

Demonstrates adding icons to the Input component using either the `prefix-icon` and `suffix-icon` attributes or by using the `prefix` and `suffix` named slots. Requires importing icon components.

```vue
<template>
  <div class="demo-input-with-icon">
    <div class="input-group">
      <span class="label">Using attributes</span>
      <div class="input-container">
        <el-input
          v-model="input1"
          class="responsive-input"
          placeholder="Pick a date"
          :suffix-icon="Calendar"
        />
        <el-input
          v-model="input2"
          class="responsive-input"
          placeholder="Type something"
          :prefix-icon="Search"
        />
      </div>
    </div>
    <div class="input-group">
      <span class="label">Using slots</span>
      <div class="input-container">
        <el-input
          v-model="input3"
          class="responsive-input"
          placeholder="Pick a date"
        >
          <template #suffix>
            <el-icon class="el-input__icon"><calendar /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="input4"
          class="responsive-input"
          placeholder="Type something"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Search } from '@element-plus/icons-vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
</script>

<style scoped>
.demo-input-with-icon {
  width: 100%;
}

.input-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 1rem;
  color: var(--el-text-color-regular);
}

.input-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.responsive-input {
  width: 240px;
}

@media (max-width: 768px) {
  .input-container {
    flex-direction: column;
    gap: 1rem;
  }

  .responsive-input {
    width: 100%;
  }
}
</style>
```

--------------------------------

### Element Plus Splitter: Managing Panel Size with v-model:size

Source: https://element-plus.org/en-US/component/splitter

Demonstrates how to control the size of an Element Plus splitter panel using the `v-model:size` directive. It shows how to bind a reactive variable to the panel's size and includes event handlers for resize actions. The example utilizes Vue's Composition API with TypeScript.

```vue
<template>
  <div
    style="height: 250px; box-shadow: var(--el-border-color-light) 0px 0px 10px"
  >
    <el-splitter
      @resize-start="handleResizeStart"
      @resize-end="handleResizeEnd"
      @resize="handleResize"
    >
      <el-splitter-panel>
        <div class="demo-panel">1</div>
      </el-splitter-panel>
      <el-splitter-panel v-model:size="size" :max="200" :min="50">
        <div class="demo-panel">{{ size }}px</div>
      </el-splitter-panel>
      <el-splitter-panel>
        <div class="demo-panel">3</div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref(100)

const handleResizeStart = (index: number, sizes: number[]) => {
  console.log('resizeStart', index, sizes)
}

const handleResize = (index: number, sizes: number[]) => {
  console.log('resize', index, sizes)
}

const handleResizeEnd = (index: number, sizes: number[]) => {
  console.log('resizeEnd', index, sizes)
}
</script>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
```

--------------------------------

### Trigger Popconfirm Events (Vue)

Source: https://element-plus.org/en-US/component/popconfirm

This example shows how to trigger and handle confirm and cancel events from the Element Plus Popconfirm component in Vue.js. It includes custom button text for confirmation and cancellation.

```vue
<template>
  <el-popconfirm
    confirm-button-text="Yes"
    cancel-button-text="No"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="Are you sure to delete this?"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

const confirmEvent = () => {
  console.log('confirm!')
}
const cancelEvent = () => {
  console.log('cancel!')
}
</script>
```

--------------------------------

### Drawer Exposes

Source: https://element-plus.org/en-US/component/drawer

Methods exposed by the Drawer component.

```APIDOC
## Drawer Exposes

### Description
Methods exposed by the Drawer component.

### Exposes
- **handleClose**: In order to close Drawer, this method will call `before-close`.
```

--------------------------------

### Implement Infinite Scroll with Element Plus Scrollbar

Source: https://element-plus.org/en-US/component/scrollbar

This example demonstrates how to use the el-scrollbar component with the @end-reached event to dynamically load more content when the user reaches the bottom of the scroll container. It uses Vue 3 Composition API with TypeScript.

```vue
<template>
  <el-scrollbar height="400px" @end-reached="loadMore">
    <p v-for="item in num" :key="item" class="scrollbar-demo-item">
      {{ item }}
    </p>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ScrollbarDirection } from 'element-plus'

const num = ref(30)

const loadMore = (direction: ScrollbarDirection) => {
  if (direction === 'bottom') {
    num.value += 5
  }
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
```

--------------------------------

### Import Icons via CDN (jsDelivr)

Source: https://element-plus.org/en-US/component/icon

Import Element Plus Icons directly into your HTML using a CDN link. This method makes icons available globally via the `ElementPlusIconsVue` variable.

```html
<script src="//cdn.jsdelivr.net/npm/@element-plus/icons-vue"></script>
```

--------------------------------

### Year Range Picker with Custom Navigation

Source: https://element-plus.org/en-US/component/date-picker

Configure a year range picker with custom placeholders and a range separator. This example also demonstrates using custom SVG icons for year navigation.

```vue
<template>
  <div class="container">
    <div class="line" />
    <div class="block">
      <div class="demonstration">year range</div>
      <el-date-picker
        v-model="value4"
        type="yearrange"
        range-separator="To"
        start-placeholder="Start Year"
        end-placeholder="End Year"
      >
        <template #prev-year>
          <el-icon>
            <svg
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke-width="1" fill-rule="evenodd">
                <g fill="currentColor">
                  <path
                    d="M8.73171,16.7949 C9.03264,17.0795 9.50733,17.0663 9.79196,16.7654 C10.0766,16.4644 10.0634,15.9897 9.76243,15.7051 L4.52339,10.75 L17.2471,10.75 C17.6613,10.75 17.9971,10.4142 17.9971,10 C17.9971,9.58579 17.6613,9.25 17.2471,9.25 L4.52112,9.25 L9.76243,4.29275 C10.0634,4.00812 10.0766,3.53343 9.79196,3.2325 C9.50733,2.93156 9.03264,2.91834 8.73171,3.20297 L2.31449,9.27241 C2.14819,9.4297 2.04819,9.62981 2.01448,9.8386 C2.00308,9.89058 1.99707,9.94459 1.99707,10 C1.99707,10.0576 2.00356,10.1137 2.01585,10.1675 C2.05084,10.3733 2.15039,10.5702 2.31449,10.7254 L8.73171,16.7949 Z"
                  />
                </g>
              </g>
            </svg>
          </el-icon>
        </template>
        <template #next-year>
          <el-icon>
            <svg
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke-width="1" fill-rule="evenodd">
                <g fill="currentColor">
                  <path
                    d="M11.2654,3.20511 C10.9644,2.92049 10.4897,2.93371 10.2051,3.23464 C9.92049,3.53558 9.93371,4.01027 10.2346,4.29489 L15.4737,9.25 L2.75,9.25 C2.33579,9.25 2,9.58579 2,10.0000012 C2,10.4142 2.33579,10.75 2.75,10.75 L15.476,10.75 L10.2346,15.7073 C9.93371,15.9919 9.92049,16.4666 10.2051,16.7675 C10.4897,17.0684 10.9644,17.0817 11.2654,16.797 L17.6826,10.7276 C17.8489,10.5703 17.9489,10.3702 17.9826,10.1614 C17.994,10.1094 18,10.0554 18,10.0000012 C18,9.94241 17.9935,9.88633 17.9812,9.83246 C17.9462,9.62667 17.8467,9.42976 17.6826,9.27455 L11.2654,3.20511 Z"
                  />
                </g>
              </g>
            </svg>
          </el-icon>
        </template>
      </el-date-picker>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value4 = ref('')
</script>

```

--------------------------------

### Basic Usage of Space

Source: https://element-plus.org/en-US/component/space

Demonstrates the basic usage of the `el-space` component to provide unified spacing between elements, with a wrap-around behavior.

```APIDOC
## Basic Usage of Space

### Description
This section shows how to use the `el-space` component for basic horizontal spacing with wrapping.

### Method
N/A (Component usage)

### Endpoint
N/A (Component usage)

### Parameters
#### Props
- **wrap** (boolean) - Optional - Whether the space can wrap to the next line.

### Request Example
```vue
<template>
  <el-space wrap>
    <el-card v-for="i in 3" :key="i" class="box-card" style="width: 250px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
    </el-card>
  </el-space>
</template>
```

### Response
N/A (Component usage)
```

--------------------------------

### Configure default time values for date range

Source: https://element-plus.org/en-US/component/datetime-picker

Uses the 'default-time' attribute to set specific start and end times for the date range picker. Accepts an array of up to two Date objects.

```vue
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">Start and end date time 12:00:00</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        :default-time="defaultTime1"
      />
    </div>
    <div class="block">
      <span class="demonstration">
        Start date time 12:00:00, end date time 08:00:00
      </span>
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        :default-time="defaultTime2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')

const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0) // '12:00:00'
const defaultTime2: [Date, Date] = [
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
] // '12:00:00', '08:00:00'
</script>

<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
  min-width: 300px;
}

.block:last-child {
  border-right: none;
}

.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .block {
    flex: 100%;
    border-right: none;
    border-bottom: solid 1px var(--el-border-color);
  }

  .block:last-child {
    border-bottom: none;
  }

  :deep(.el-date-editor.el-input) {
    width: 100%;
  }

  :deep(.el-date-editor.el-input__wrapper) {
    width: 100%;
    max-width: 300px;
  }
}
</style>
```

--------------------------------

### Link Local Element Plus Dependencies

Source: https://element-plus.org/en-US/guide/dev-faq

Commands to build Element Plus locally and link it globally to your project's node_modules, useful for development and testing local changes. Ensure you are in the correct directories before running.

```shell
# get dist
pnpm build
cd dist/element-plus
# set cur element-plus to global `node_modules`
pnpm link --global
# for esm we also need link element-plus for dist
pnpm link --global element-plus

# go to your project, link to `element-plus`
cd your-project
pnpm link --global element-plus
```

--------------------------------

### Simple Steps

Source: https://element-plus.org/en-US/component/steps

A simplified version of the step bar where certain layout attributes are ignored.

```vue
<template>
  <el-steps
    class="mb-4"
    style="max-width: 600px"
    :space="200"
    :active="1"
    simple
  >
    <el-step title="Step 1" :icon="Edit" />
    <el-step title="Step 2" :icon="UploadFilled" />
    <el-step title="Step 3" :icon="Picture" />
  </el-steps>

  <el-steps style="max-width: 600px" :active="1" finish-status="success" simple>
    <el-step title="Step 1" />
    <el-step title="Step 2" />
    <el-step title="Step 3" />
  </el-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
</script>
```

--------------------------------

### Customize Select Dropdown Header

Source: https://element-plus.org/en-US/component/select

Demonstrates how to add a custom header to an Element Plus Select component using the #header slot. This example includes a 'Select All' checkbox functionality to manage multiple selections.

```vue
<template>
  <el-select
    v-model="value"
    multiple
    clearable
    collapse-tags
    placeholder="Select"
    popper-class="custom-header"
    :max-collapse-tags="1"
    style="width: 240px"
  >
    <template #header>
      <el-checkbox
        v-model="checkAll"
        :indeterminate="indeterminate"
        @change="handleCheckAll"
      >
        All
      </el-checkbox>
    </template>
    <el-option
      v-for="item in cities"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'

const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref<CheckboxValueType[]>([])
const cities = ref([
  { value: 'Beijing', label: 'Beijing' },
  { value: 'Shanghai', label: 'Shanghai' },
  { value: 'Nanjing', label: 'Nanjing' },
  { value: 'Chengdu', label: 'Chengdu' },
  { value: 'Shenzhen', label: 'Shenzhen' },
  { value: 'Guangzhou', label: 'Guangzhou' },
])

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === cities.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    value.value = cities.value.map((_) => _.value)
  } else {
    value.value = []
  }
}
</script>

<style>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>
```

--------------------------------

### Global Configuration with On-demand Import

Source: https://element-plus.org/en-US/guide/quickstart

Apply global configuration for size and zIndex using ElConfigProvider when using on-demand component imports.

```vue
<template>
  <el-config-provider :size="size" :z-index="zIndex">
    <app />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'

const zIndex = 3000
const size = 'small'
</script>
```

--------------------------------

### Configure DateTime Input and Binding Formats

Source: https://element-plus.org/en-US/component/datetime-picker

Demonstrates using 'format' for display and 'value-format' for binding data, including support for timestamps.

```vue
<template>
  <div class="demo-datetime-picker">
    <div class="block">
      <span class="demonstration">Emits Date object</span>
      <div class="demonstration">Value: {{ value1 }}</div>
      <el-date-picker
        v-model="value1"
        type="datetime"
        placeholder="Pick a Date"
        format="YYYY/MM/DD HH:mm:ss"
      />
    </div>
    <div class="block">
      <span class="demonstration">Use value-format</span>
      <div class="demonstration">Value：{{ value2 }}</div>
      <el-date-picker
        v-model="value2"
        type="datetime"
        placeholder="Pick a Date"
        format="YYYY/MM/DD hh:mm:ss"
        value-format="YYYY-MM-DD h:m:s a"
      />
    </div>
    <div class="block">
      <span class="demonstration">Timestamp</span>
      <div class="demonstration">Value：{{ value3 }}</div>
      <el-date-picker
        v-model="value3"
        type="datetime"
        placeholder="Pick a Date"
        format="YYYY/MM/DD hh:mm:ss"
        value-format="x"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>

<style scoped>
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
  min-width: 300px;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .demo-datetime-picker .block {
    flex: 100%;
    border-right: none;
    border-bottom: solid 1px var(--el-border-color);
  }

  .demo-datetime-picker .block:last-child {
    border-bottom: none;
  }

  :deep(.el-date-editor.el-input) {
    width: 100%;
  }

  :deep(.el-date-editor.el-input__wrapper) {
    width: 100%;
    max-width: 300px;
  }
}
</style>
```

--------------------------------

### Implement Rowspan in Element Plus Table V2

Source: https://element-plus.org/en-US/component/table-v2

This example shows how to use the `rowSpan` property on columns and a custom `Row` component to achieve row spanning. Ensure the `rowSpan` function returns the correct span value and the custom `Row` component correctly adjusts cell styles.

```vue
<template>
  <el-table-v2 fixed :columns="columns" :data="data" :width="700" :height="400">
    <template #row="props">
      <Row v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="ts" setup>
import { cloneVNode } from 'vue'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 200)

const rowSpanIndex = 0
columns[rowSpanIndex].rowSpan = ({ rowIndex }) =>
  rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1

const Row = ({ rowData, rowIndex, cells, columns }) => {
  const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex })
  if (rowSpan > 1) {
    const cell = cells[rowSpanIndex]
    const style = {
      ...cell.props.style,
      backgroundColor: 'var(--el-color-primary-light-3)',
      height: `${rowSpan * 50 - 1}px`,
      alignSelf: 'flex-start',
      zIndex: 1,
    }
    cells[rowSpanIndex] = cloneVNode(cell, { style })
  }
  return cells
}
</script>
```

--------------------------------

### Common Layout: Nested Container (Header, Aside, Main)

Source: https://element-plus.org/en-US/component/container

Demonstrates a nested container structure with a header, followed by a container holding an aside and main content.

```APIDOC
## Common Layout: Nested Container (Header, Aside, Main)

### Description
This layout uses a nested container. The outer container has a header, and the inner container holds an aside section and the main content.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Vue: Underline Type Anchor Link

Source: https://element-plus.org/en-US/component/anchor

Shows how to configure the El-Anchor component to use an underline type by setting the 'type' attribute to 'underline'. This example also includes nested links and locale management.

```vue
<template>
  <el-anchor type="underline" :offset="70">
    <el-anchor-link :href="`#${locale['basic-usage']}`">
      {{ locale['Basic Usage'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['horizontal-mode']}`">
      {{ locale['Horizontal Mode'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['scroll-container']}`">
      {{ locale['Scroll Container'] }}
    </el-anchor-link>
    <el-anchor-link :href="`#${locale['anchor-api']}`">
      {{ locale['Anchor API'] }}
      <template #sub-link>
        <el-anchor-link :href="`#${locale['anchor-attributes']}`">
          {{ locale['Anchor Attributes'] }}
        </el-anchor-link>
        <el-anchor-link :href="`#${locale['anchor-events']}`">
          {{ locale['Anchor Events'] }}
        </el-anchor-link>
      </template>
    </el-anchor-link>
  </el-anchor>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import anchorLocale from '../../.vitepress/i18n/component/anchor.json'
import { useLang } from '~/composables/lang'

const lang = useLang()
const locale = computed(() => anchorLocale[lang.value])
</script>
```

--------------------------------

### Steps with Icons

Source: https://element-plus.org/en-US/component/steps

Uses the icon property to display custom icons for each step.

```vue
<template>
  <el-steps style="max-width: 600px" :active="1">
    <el-step title="Step 1" :icon="Edit" />
    <el-step title="Step 2" :icon="Upload" />
    <el-step title="Step 3" :icon="Picture" />
  </el-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, Upload } from '@element-plus/icons-vue'
</script>
```

--------------------------------

### Displaying Alerts with Icons and Descriptions

Source: https://element-plus.org/en-US/component/alert

Shows how to combine the 'show-icon' attribute with the 'description' attribute to create visually distinct alerts for different severity levels like primary, success, info, warning, and error.

```vue
<template>
  <div style="max-width: 600px">
    <el-alert
      title="Primary alert"
      type="primary"
      description="More text description"
      show-icon
    />
    <el-alert
      title="Success alert"
      type="success"
      description="More text description"
      show-icon
    />
    <el-alert
      title="Info alert"
      type="info"
      description="More text description"
      show-icon
    />
    <el-alert
      title="Warning alert"
      type="warning"
      description="More text description"
      show-icon
    />
    <el-alert
      title="Error alert"
      type="error"
      description="More text description"
      show-icon
    />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
```

--------------------------------

### Configure Skeleton Throttle with Object for Initial Loading

Source: https://element-plus.org/en-US/component/skeleton

Use the `throttle` attribute with an object including `initVal: true` to display the initial skeleton screen immediately without throttling. Other properties like `leading` can still be configured.

```vue
<template>
  <el-space direction="vertical" alignment="flex-start">
    <div>
      <label style="margin-right: 16px">Switch Loading</label>
      <el-switch v-model="loading" />
    </div>
    <el-skeleton
      style="width: 240px"
      :loading="loading"
      animated
      :throttle="{ leading: 500, initVal: true }"
    >
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 265px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom card-header">
              <div class="time">{{ currentDate }}</div>
              <el-button text class="button">operation button</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)
const currentDate = new Date().toDateString()
</script>
```

--------------------------------

### Configure Empty Values for Select Components

Source: https://element-plus.org/en-US/component/config-provider

This snippet illustrates how to configure empty value handling for ElSelect and ElSelectV2 components using ElConfigProvider. It demonstrates setting custom empty values and defining the return value when a component is cleared. The example includes a change handler to display the cleared value.

```vue
<template>
  <el-config-provider :value-on-clear="null" :empty-values="[undefined, null]">
    <div class="flex flex-wrap gap-4 items-center">
      <el-select
        v-model="value1"
        clearable
        placeholder="Select"
        style="width: 240px"
        @change="handleChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select-v2
        v-model="value2"
        clearable
        placeholder="Select"
        style="width: 240px"
        :options="options"
        :value-on-clear="() => undefined"
        @change="handleChange"
      />
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const value1 = ref('')
const value2 = ref('')
const options = [
  {
    value: '',
    label: 'All',
  },
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const handleChange = (value) => {
  if ([undefined, null].includes(value)) {
    ElMessage.info(`The clear value is: ${value}`)
  }
}
</script>
```

--------------------------------

### Striped Progress Bar with Flow Animation

Source: https://element-plus.org/en-US/component/progress

Use the `striped` attribute for a striped effect and `striped-flow` for animating the stripes. Control animation duration with the `duration` prop. This example showcases different statuses and interactive controls.

```vue
<template>
  <div class="demo-progress">
    <el-progress :percentage="50" :stroke-width="15" striped />
    <el-progress
      :percentage="30"
      :stroke-width="15"
      status="warning"
      striped
      striped-flow
    />
    <el-progress
      :percentage="100"
      :stroke-width="15"
      status="success"
      striped
      striped-flow
      :duration="10"
    />
    <el-progress
      :percentage="percentage"
      :stroke-width="15"
      status="exception"
      striped
      striped-flow
      :duration="duration"
    />
    <el-button-group>
      <el-button :icon="Minus" @click="decrease" />
      <el-button :icon="Plus" @click="increase" />
    </el-button-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref<number>(70)
const duration = computed(() => Math.floor(percentage.value / 10))

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
```

--------------------------------

### Common Layout: Header and Main

Source: https://element-plus.org/en-US/component/container

Demonstrates a common layout with a header and main content area.

```APIDOC
## Common Layout: Header and Main

### Description
This layout includes a header and a main content area, arranged vertically.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Using VNode as Spacer

Source: https://element-plus.org/en-US/component/space

Illustrates how to use a Vue VNode (e.g., ElDivider) as a spacer for more complex spacing.

```APIDOC
## Spacer can also be VNode 

### Description
Allows using a Vue VNode, such as `ElDivider`, as a spacer for custom visual separation.

### Example
```vue
<template>
  <el-space :size="size" :spacer="spacer">
    <div v-for="i in 2" :key="i">
      <el-button> button {{ i }} </el-button>
    </div>
  </el-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { ElDivider } from 'element-plus'

const size = ref(10)
const spacer = h(ElDivider, { direction: 'vertical' })
</script>
```
```

--------------------------------

### Autocomplete Basic Usage

Source: https://element-plus.org/en-US/component/autocomplete

Demonstrates two ways to use the Autocomplete component: listing suggestions when activated and listing suggestions as the user types. The `fetch-suggestions` attribute is a method that returns suggested inputs, and it uses a callback function `cb(data)` to provide these suggestions.

```vue
<template>
  <div class="demo-autocomplete">
    <div class="demo-block">
      <div class="demo-title">list suggestions when activated</div>
      <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearch"
        clearable
        class="w-50"
        placeholder="Please Input"
        @select="handleSelect"
      />
    </div>
    <div class="demo-block">
      <div class="demo-title">list suggestions on input</div>
      <el-autocomplete
        v-model="state2"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        class="w-50"
        placeholder="Please Input"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

interface RestaurantItem {
  value: string
  link: string
}

const state1 = ref('')
const state2 = ref('')

const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  restaurants.value = loadAll()
})
</script>

<style scoped>
.demo-autocomplete {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.demo-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-title {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  min-height: 2.5em;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .demo-autocomplete {
    gap: 1rem;
  }

  .demo-block {
    width: 100%;
  }
}
</style>
```

--------------------------------

### Form API Exposes

Source: https://element-plus.org/en-US/component/form

Lists and describes the methods that can be called on the Element Plus Form component instance.

```APIDOC
### Form Exposes 
Name| Description| Type  
---|---|---
validate| Validate the whole form. Receives a callback or returns `Promise`.| `Function`__  
validateField|  Validate specified fields.| `Function`__  
resetFields|  Reset specified fields and remove validation result.| `Function`__  
scrollToField|  Scroll to the specified fields.| `Function`__  
clearValidate|  Clear validation messages for all or specified fields.| `Function`__  
fields 2.7.3| Get all fields context.| `array`__  
getField 2.10.2| Get a field context.| `Function`__  
setInitialValues 2.13.1| Set initial values for form fields. When `resetFields` is called, fields will reset to these values.| `Function`__
```

--------------------------------

### Hiding Pagination on Single Page - Vue

Source: https://element-plus.org/en-US/component/pagination

Explains how to automatically hide the pagination component when there is only one page of data available. This is achieved by setting the `hide-on-single-page` attribute to `true`. The example uses a switch to toggle this behavior.

```vue
<template>
  <div>
    <el-switch v-model="value" />
    <hr class="my-4" />
    <el-pagination
      :hide-on-single-page="value"
      :total="5"
      layout="prev, pager, next"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(false)
</script>
```

--------------------------------

### Implement Responsive Layout with Element Plus

Source: https://element-plus.org/en-US/component/container

This component demonstrates a complex layout using el-container, el-aside, and el-main. It features a nested navigation menu, a header with a dropdown menu, and a scrollable table populated with mock data.

```vue
<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>Navigator One
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="1-1">Option 1</el-menu-item>
              <el-menu-item index="1-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="1-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>Option4</template>
              <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>Navigator Two
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Navigator Three
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
}
```

--------------------------------

### Popover Placement Configuration

Source: https://element-plus.org/en-US/component/popover

Configuring the position of the popover using the placement attribute.

```APIDOC
## Component: el-popover

### Description
The Popover component displays content relative to a reference element. The 'placement' attribute controls the positioning using a combination of orientation (top, left, right, bottom) and alignment (start, end, null).

### Attributes
- **content** (string) - Required - The text content to display inside the popover.
- **title** (string) - Optional - The title of the popover.
- **placement** (string) - Optional - Determines the position. Options: top, top-start, top-end, left, left-start, left-end, right, right-start, right-end, bottom, bottom-start, bottom-end. Default: bottom.

### Usage Example
```vue
<el-popover
  title="Title"
  content="This is the content"
  placement="top-start"
>
  <template #reference>
    <el-button>Hover me</el-button>
  </template>
</el-popover>
```
```

--------------------------------

### Small Pagination Variants - Vue

Source: https://element-plus.org/en-US/component/pagination

Illustrates how to use a smaller version of the pagination component for space-constrained interfaces by setting the `size` attribute to `small`. This example shows both a standard small pagination and one with a background color.

```vue
<template>
  <el-pagination size="small" layout="prev, pager, next" :total="50" />
  <el-pagination
    size="small"
    background
    layout="prev, pager, next"
    :total="50"
    class="mt-4"
  />
</template>
```

--------------------------------

### Switch Exposes

Source: https://element-plus.org/en-US/component/switch

Describes the methods that are exposed by the Switch component, allowing for programmatic control.

```APIDOC
### Exposes

| Method | Description | Type |
|---|---|---|
| focus | manual focus to the switch component | `Function` |
```

--------------------------------

### Input Component Exposes

Source: https://element-plus.org/en-US/component/autocomplete

This section details the methods and properties exposed by the Input component for programmatic control and access.

```APIDOC
## Input Component Exposes

### Description
This section details the methods and properties exposed by the Input component for programmatic control and access.

### Exposes

Name| Description| Type
---|---|---
activated| if autocomplete activated| `object`
blur| blur the input element| `Function`
close| collapse suggestion list| `Function`
focus| focus the input element| `Function`
handleSelect| triggers when a suggestion is clicked| `Function`
handleKeyEnter| handle keyboard enter event| `Function`
highlightedIndex| the index of the currently highlighted item| `object`
highlight| highlight an item in a suggestion| `Function`
inputRef| el-input component instance| `object`
loading| remote search loading indicator| `object`
popperRef| el-tooltip component instance| `object`
suggestions| fetch suggestions result| `object`
getData 2.8.4| loading suggestion list| `Function`
```

--------------------------------

### Controlling Space Size

Source: https://element-plus.org/en-US/component/space

Explains how to control the spacing size using the `size` prop, including built-in options and custom values.

```APIDOC
## Control the Size of the Space

### Description
This section covers controlling the spacing size between elements using the `size` prop. It supports predefined sizes (`small`, `default`, `large`) and custom numeric values.

### Method
N/A (Component usage)

### Endpoint
N/A (Component usage)

### Parameters
#### Props
- **size** (string | number) - Optional - Sets the spacing size. Can be `small`, `default`, `large`, or a custom number (in pixels). Defaults to `small`.
- **alignment** (string) - Optional - Controls the alignment of items within the space. Example: `start`.

### Request Example
```vue
<template>
  <el-space direction="vertical" alignment="start" :size="30">
    <el-radio-group v-model="size">
      <el-radio value="large">Large</el-radio>
      <el-radio value="default">Default</el-radio>
      <el-radio value="small">Small</el-radio>
    </el-radio-group>

    <el-space wrap :size="size">
      <el-card v-for="i in 3" :key="i" class="box-card" style="width: 250px">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { ComponentSize } from 'element-plus'

const size = ref<ComponentSize>('default')
</script>
```

### Response
N/A (Component usage)
```

--------------------------------

### Configure Card Shadow Settings

Source: https://element-plus.org/en-US/component/config-provider

Configures the global shadow behavior for cards using the Config Provider.

```vue
<script lang="ts" setup>
import { reactive } from 'vue'

import type { CardConfigContext } from 'element-plus'

const config = reactive<CardConfigContext>({
  shadow: 'always',
})
</script>

<template>
  Shadow:
  <div class="flex flex-col justify-center">
    <el-radio-group v-model="config.shadow">
      <el-radio value="always">always</el-radio>
      <el-radio value="hover">hover</el-radio>
      <el-radio value="never">never</el-radio>
    </el-radio-group>
    <el-divider />
    <el-config-provider :card="config">
      <el-card>Card desu!</el-card>
    </el-config-provider>
  </div>
</template>
```

--------------------------------

### Customize ElCascader Tags with Slots (Vue)

Source: https://element-plus.org/en-US/component/cascader

This snippet shows how to use the #tag slot in ElCascader to customize the appearance of selected tags. It includes examples for rendering all tags with custom styling and for displaying only the top-level tags.

```vue
<template>
  <div class="m-4">
    <p>Using slots allows for more flexible control over the display.</p>
    <el-cascader :options="options" :props="props" clearable>
      <template #tag="{ data }">
        <el-tag
          v-for="(item, index) in getTags(data)"
          :key="item"
          :color="index % 2 === 0 ? '#FFDE0A' : ''"
        >
          {{ item }}
        </el-tag>
      </template>
    </el-cascader>
    <p>Display top-level tags only</p>
    <el-cascader :options="options" :props="props" clearable>
      <template #tag="{ data }">
        <el-tag v-for="item in getTopLevelTags(data)" :key="item">
          {{ item }}
        </el-tag>
      </template>
    </el-cascader>
  </div>
</template>

<script lang="ts" setup>
import type { Tag } from 'element-plus'

const props = { multiple: true }
const options = [
  {
    value: 1,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' },
        ],
      },
      {
        value: 6,
        label: 'Japan',
        children: [
          { value: 7, label: 'Tokyo' },
          { value: 8, label: 'Osaka' },
          { value: 9, label: 'Kyoto' },
        ],
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' },
        ],
      },
    ],
  },
  {
    value: 14,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' },
        ],
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' },
        ],
      },
    ],
  },
  {
    value: 23,
    label: 'North America',
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' },
        ],
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' },
        ],
      },
    ],
  },
]
const getTags = (data: Tag[]) => {
  return data.map((item) => item.text)
}
const getTopLevelTags = (data: Tag[]) => {
  const set: Set<string> = new Set()
  for (const datum of data) {
    let parent = datum.node?.parent
    while (parent && parent.level !== 1) {
      parent = parent.parent
    }
    const label = parent?.data?.label
    label && set.add(label)
  }
  return [...set]
}
</script>
```

--------------------------------

### el-image Preview Configuration

Source: https://element-plus.org/en-US/component/image

Configures the el-image component to support a list of images for previewing, including zoom settings and initial index selection.

```APIDOC
## Component: el-image

### Description
The el-image component supports image previews by providing a list of source URLs. Users can interact with the previewer to zoom and navigate through images.

### Parameters
#### Props
- **preview-src-list** (Array<string>) - Optional - List of image URLs to be previewed.
- **initial-index** (number) - Optional - The index of the image to show first in the previewer. Defaults to 0.
- **zoom-rate** (number) - Optional - The zoom ratio for the image preview.
- **max-scale** (number) - Optional - Maximum zoom scale.
- **min-scale** (number) - Optional - Minimum zoom scale.
- **show-progress** (boolean) - Optional - Whether to show the loading progress bar.

### Request Example
<el-image :preview-src-list="['url1', 'url2']" :initial-index="4" />
```

--------------------------------

### Implement Filterable Cascader in Vue

Source: https://element-plus.org/en-US/component/cascader

This example demonstrates how to enable filtering in an el-cascader component for both single and multiple selection modes. It uses a hierarchical data structure for options and the filterable attribute to activate the search functionality.

```vue
<template>
  <div class="m-4">
    <p>Filterable (Single selection)</p>
    <el-cascader
      placeholder="Try searching Guide"
      :options="options"
      filterable
    />
  </div>
  <div class="m-4">
    <p>Filterable (Multiple selection)</p>
    <el-cascader
      placeholder="Try searching Guide"
      :options="options"
      :props="props"
      filterable
    />
  </div>
</template>

<script lang="ts" setup>
const props = {
  multiple: true,
}

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          { value: 'consistency', label: 'Consistency' },
          { value: 'feedback', label: 'Feedback' },
          { value: 'efficiency', label: 'Efficiency' },
          { value: 'controllability', label: 'Controllability' },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          { value: 'side nav', label: 'Side Navigation' },
          { value: 'top nav', label: 'Top Navigation' },
        ],
      },
    ],
  }
]
```

--------------------------------

### Element Plus Mention Basic Usage

Source: https://element-plus.org/en-US/component/mention

Demonstrates the fundamental implementation of the Element Plus Mention component. It shows how to bind a value, provide options for suggestions, and set a placeholder. This snippet is suitable for quickly integrating a basic mention functionality.

```vue
<template>
  <el-mention
    v-model="value"
    :options="options"
    style="width: 320px"
    placeholder="Please input"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('@')

const options = ref([
  {
    label: 'Fuphoenixes',
    value: 'Fuphoenixes',
  },
  {
    label: 'kooriookami',
    value: 'kooriookami',
  },
  {
    label: 'Jeremy',
    value: 'Jeremy',
  },
  {
    label: 'btea',
    value: 'btea',
  },
])
</script>
```

--------------------------------

### Month Range Picker with Custom Navigation

Source: https://element-plus.org/en-US/component/date-picker

Use this snippet to configure a month range picker. It supports custom placeholders for start and end dates and allows for custom icons for previous and next month navigation.

```vue
<template>
  <div class="container">
    <div class="line" />
    <div class="block">
      <div class="demonstration">month range</div>
      <el-date-picker
        v-model="value3"
        type="monthrange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        unlink-panels
      >
        <template #prev-month>
          <el-icon><CaretLeft /></el-icon>
        </template>
        <template #next-month>
          <el-icon><CaretRight /></el-icon>
        </template>
        <template #prev-year>
          <el-icon>
            <svg
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke-width="1" fill-rule="evenodd">
                <g fill="currentColor">
                  <path
                    d="M8.73171,16.7949 C9.03264,17.0795 9.50733,17.0663 9.79196,16.7654 C10.0766,16.4644 10.0634,15.9897 9.76243,15.7051 L4.52339,10.75 L17.2471,10.75 C17.6613,10.75 17.9971,10.4142 17.9971,10 C17.9971,9.58579 17.6613,9.25 17.2471,9.25 L4.52112,9.25 L9.76243,4.29275 C10.0634,4.00812 10.0766,3.53343 9.79196,3.2325 C9.50733,2.93156 9.03264,2.91834 8.73171,3.20297 L2.31449,9.27241 C2.14819,9.4297 2.04819,9.62981 2.01448,9.8386 C2.00308,9.89058 1.99707,9.94459 1.99707,10 C1.99707,10.0576 2.00356,10.1137 2.01585,10.1675 C2.05084,10.3733 2.15039,10.5702 2.31449,10.7254 L8.73171,16.7949 Z"
                  />
                </g>
              </g>
            </svg>
          </el-icon>
        </template>
        <template #next-year>
          <el-icon>
            <svg
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke-width="1" fill-rule="evenodd">
                <g fill="currentColor">
                  <path
                    d="M11.2654,3.20511 C10.9644,2.92049 10.4897,2.93371 10.2051,3.23464 C9.92049,3.53558 9.93371,4.01027 10.2346,4.29489 L15.4737,9.25 L2.75,9.25 C2.33579,9.25 2,9.58579 2,10.0000012 C2,10.4142 2.33579,10.75 2.75,10.75 L15.476,10.75 L10.2346,15.7073 C9.93371,15.9919 9.92049,16.4666 10.2051,16.7675 C10.4897,17.0684 10.9644,17.0817 11.2654,16.797 L17.6826,10.7276 C17.8489,10.5703 17.9489,10.3702 17.9826,10.1614 C17.994,10.1094 18,10.0554 18,10.0000012 C18,9.94241 17.9935,9.88633 17.9812,9.83246 C17.9462,9.62667 17.8467,9.42976 17.6826,9.27455 L11.2654,3.20511 Z"
                  />
                </g>
              </g>
            </svg>
          </el-icon>
        </template>
      </el-date-picker>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CaretLeft, CaretRight } from '@element-plus/icons-vue'

const value3 = ref('')
</script>

```

--------------------------------

### Select Component Configuration

Source: https://element-plus.org/en-US/component/select

Configuration properties for the Select component, including key mapping for node objects and tag-tooltip behavior.

```APIDOC
## Select Props

### Description
Defines the data mapping for the Select component options.

### Parameters
- **value** (string) - Optional - Specify which key of node object is used as the node's value. Default: 'value'
- **label** (string) - Optional - Specify which key of node object is used as the node's label. Default: 'label'
- **options** (string) - Optional - Specify which key of node object is used as the node's children. Default: 'options'
- **disabled** (string) - Optional - Specify which key of node object is used as the node's disabled. Default: 'disabled'
```

--------------------------------

### Common Layout: Nested Container (Aside, Header, Main, Footer)

Source: https://element-plus.org/en-US/component/container

Shows a nested layout with an aside, followed by a container with header, main, and footer.

```APIDOC
## Common Layout: Nested Container (Aside, Header, Main, Footer)

### Description
This layout features an aside section, followed by a nested container that includes a header, the main content, and a footer.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Implement Controlled Sorting in Table V2

Source: https://element-plus.org/en-US/component/table-v2

Use `v-model:sort-state` to bind the sort state and `@column-sort` to handle sorting events. Define sortable columns and manage the sort order programmatically. This example uses Vue.js.

```vue
<template>
  <el-table-v2
    v-model:sort-state="sortState"
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
    @column-sort="onSort"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TableV2SortOrder } from 'element-plus'

import type { SortBy, SortState } from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
const data = ref(generateData(columns, 200))

columns[0].sortable = true
columns[1].sortable = true

const sortState = ref<SortState>({
  'column-0': TableV2SortOrder.DESC,
  'column-1': TableV2SortOrder.ASC,
})

const onSort = ({ key, order }: SortBy) => {
  sortState.value[key] = order
  data.value = data.value.reverse()
}
</script>
```

--------------------------------

### Linear Progress Bar with Custom Colors

Source: https://element-plus.org/en-US/component/progress

The `color` attribute accepts a string, function, or array to define custom progress bar colors. The example demonstrates dynamic color changes based on percentage and user interaction.

```vue
<template>
  <div class="demo-progress">
    <el-progress :percentage="percentage" :color="customColor" />

    <el-progress :percentage="percentage" :color="customColorMethod" />

    <el-progress :percentage="percentage" :color="customColors" />
    <el-progress :percentage="percentage" :color="customColors" />
    <div>
      <el-button-group>
        <el-button :icon="Minus" @click="decrease" />
        <el-button :icon="Plus" @click="increase" />
      </el-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref(20)
const customColor = ref('#409eff')

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const customColorMethod = (percentage: number) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}
const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
```

--------------------------------

### Implement basic TimePicker

Source: https://element-plus.org/en-US/component/time-picker

Displays standard time pickers with optional arrow controls for navigation.

```vue
<template>
  <div class="example-basic">
    <el-time-picker v-model="value1" placeholder="Arbitrary time" />
    <el-time-picker
      v-model="value2"
      arrow-control
      placeholder="Arbitrary time"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref()
const value2 = ref()
</script>

<style>
.example-basic .el-date-editor {
  margin: 8px;
}
</style>
```

--------------------------------

### Element Plus Rate: Custom Icons and Void Icon

Source: https://element-plus.org/en-US/component/rate

Demonstrates how to use custom icons for the Element Plus Rate component with the `icons` attribute and how to set a specific icon for unselected states using `void-icon`. It also shows how to combine custom icons with color thresholds.

```vue
<template>
  <el-rate
    v-model="value"
    :icons="icons"
    :void-icon="ChatRound"
    :colors="['#409eff', '#67c23a', '#FF9900']"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ChatDotRound, ChatLineRound, ChatRound } from '@element-plus/icons-vue'

const value = ref()
const icons = [ChatRound, ChatLineRound, ChatDotRound] // same as { 2: ChatRound, 4: { value: ChatLineRound, excluded: true }, 5: ChatDotRound }
</script>
```

--------------------------------

### Build Hybrid Grid Layouts

Source: https://element-plus.org/en-US/component/layout

Illustrates how to combine columns of different spans to create complex, non-uniform grid layouts. This is useful for dashboards or side-bar based content structures.

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="16"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="8"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="8"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
</template>
```

--------------------------------

### Configure Selectable Tree with checkStrictly in Vue

Source: https://element-plus.org/en-US/component/table

This example demonstrates how to toggle the checkStrictly property to control node selection association in an Element Plus table. It includes a custom selectable function to restrict selection for specific rows.

```vue
<template>
  <el-radio-group v-model="treeProps.checkStrictly" class="mb-2">
    <el-radio-button :value="true" label="true" />
    <el-radio-button :value="false" label="false" />
  </el-radio-group>
  <el-table
    :data="tableData"
    :tree-props="treeProps"
    row-key="id"
    default-expand-all
  >
    <el-table-column type="selection" width="55" :selectable="selectable" />
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const treeProps = reactive({
  checkStrictly: false,
})

const selectable = (row: User) => ![1, 31].includes(row.id)

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
```

--------------------------------

### Statistic Component Usage

Source: https://element-plus.org/en-US/component/statistic

Demonstrates how to use the Statistic component to display daily active users, monthly active users, and new transactions.

```APIDOC
## Card usage 
Card usage display, can be freely combined
Daily active users __
98,500
than yesterday 24% __
Monthly Active Users __
693,700
month on month 12% __
New transactions today
72,000
than yesterday 16% __
__
TS
JS
 ________
vue```
<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="98500">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Daily active users
              <el-tooltip
                effect="dark"
                content="Number of users who logged into the product in one day"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>than yesterday</span>
            <span class="green">
              24%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="693700">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Monthly Active Users
              <el-tooltip
                effect="dark"
                content="Number of users who logged into the product in one month"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>month on month</span>
            <span class="red">
              12%
              <el-icon>
                <CaretBottom />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" class="mb-4">
      <div class="statistic-card">
        <el-statistic :value="72000" title="New transactions today">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              New transactions today
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>than yesterday</span>
            <span class="green">
              16%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
          <div class="footer-item">
            <el-icon :size="14">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from '@element-plus/icons-vue'
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
```
```

--------------------------------

### Element Plus Slider Discrete Values (Vue)

Source: https://element-plus.org/en-US/component/slider

Shows how to configure the Element Plus slider to display discrete values using the 'step' attribute and control the visibility of breakpoints with the 'show-stops' attribute. This example is implemented in Vue.js.

```vue
<template>
  <div class="slider-demo-block">
    <span class="demonstration">Breakpoints not displayed</span>
    <el-slider v-model="value1" :step="10" />
  </div>
  <div class="slider-demo-block">
    <span class="demonstration">Breakpoints displayed</span>
    <el-slider v-model="value2" :step="10" show-stops />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
</script>

<style scoped>
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
```

--------------------------------

### Customize Cascader Suggestion Item via Slot

Source: https://element-plus.org/en-US/component/cascader

This example demonstrates how to use the #suggestion-item slot in an Element Plus Cascader to prepend a search icon to the filtered path labels. It requires the component to be set to filterable mode.

```vue
<template>
  <el-cascader :options="options" filterable placeholder="Try searching: Guide">
    <template #suggestion-item="{ item }">
      <span>🔍 {{ item.pathLabels.join(' > ') }}</span>
    </template>
  </el-cascader>
</template>

<script lang="ts" setup>
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          { value: 'consistency', label: 'Consistency' },
          { value: 'feedback', label: 'Feedback' },
          { value: 'efficiency', label: 'Efficiency' },
          { value: 'controllability', label: 'Controllability' }
        ]
      }
    ]
  }
];
</script>
```

--------------------------------

### Basic Affix Usage with Offset

Source: https://element-plus.org/en-US/component/affix

Demonstrates how to use the Affix component to fix an element at a specified offset from the top of the page. The default behavior is to affix at the top.

```vue
<template>
  <el-affix :offset="120">
    <el-button type="primary">Offset top 120px</el-button>
  </el-affix>
</template>
```

--------------------------------

### Basic Input Number Usage

Source: https://element-plus.org/en-US/component/input-number

Demonstrates the basic implementation of the Input Number component with min/max constraints and a change event handler.

```vue
<template>
  <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const num = ref(1)
const handleChange = (value: number | undefined) => {
  console.log(value)
}
</script>
```

--------------------------------

### Scroll Table V2 by Pixels or Rows

Source: https://element-plus.org/en-US/component/table-v2

Use `scrollToTop` to scroll by pixels or `scrollToRow` to scroll by row count. The `scrollToRow` method accepts an optional scrolling strategy like 'auto', 'center', 'end', 'start', or 'smart'.

```vue
<template>
  <div class="mb-4 flex items-center">
    <el-form-item label="Scroll pixels" class="mr-4">
      <el-input v-model="scrollDelta" />
    </el-form-item>
    <el-form-item label="Scroll rows">
      <el-input v-model="scrollRows" />
    </el-form-item>
  </div>
  <div class="mb-4 flex items-center">
    <el-button @click="scrollByPixels"> Scroll by pixels </el-button>
    <el-button @click="scrollByRows"> Scroll by rows </el-button>
  </div>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          ref="tableRef"
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TableV2Instance } from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
const data = generateData(columns, 200)
const tableRef = ref<TableV2Instance>()
const scrollDelta = ref(200)
const scrollRows = ref(10)

function scrollByPixels() {
  tableRef.value?.scrollToTop(scrollDelta.value)
}

function scrollByRows() {
  tableRef.value?.scrollToRow(scrollRows.value)
}
</script>
```

--------------------------------

### Basic Timeline Usage

Source: https://element-plus.org/en-US/component/timeline

Displays a simple list of activities with timestamps using the el-timeline component.

```vue
<template>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp"
    >
      {{ activity.content }}
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="ts" setup>
const activities = [
  {
    content: 'Event start',
    timestamp: '2018-04-15',
  },
  {
    content: 'Approved',
    timestamp: '2018-04-13',
  },
  {
    content: 'Success',
    timestamp: '2018-04-11',
  },
]
</script>
```

--------------------------------

### Set Table Layout in Element Plus Table

Source: https://element-plus.org/en-US/component/table

Explains how to control the table layout algorithm using the `table-layout` property in `el-table`. It can be set to 'fixed' or 'auto', affecting how column widths are calculated. This example uses Vue.js and TypeScript.

```vue
<template>
  <el-radio-group v-model="tableLayout" class="mb-2">
    <el-radio-button value="fixed">fixed</el-radio-button>
    <el-radio-button value="auto">auto</el-radio-button>
  </el-radio-group>
  <el-table :data="tableData" :table-layout="tableLayout">
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TableInstance } from 'element-plus'

const tableLayout = ref<TableInstance['tableLayout']>('fixed')

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
```

--------------------------------

### Configure Link Global Properties

Source: https://element-plus.org/en-US/component/config-provider

Demonstrates setting global link properties such as type and underline behavior via the Config Provider.

```vue
<template>
  <div>
    <div class="flex gap-4">
      <div class="flex flex-col basis-150px gap-1">
        <span>Type:</span>
        <el-select v-model="config.type">
          <el-option v-for="type in linkTypes" :key="type" :value="type" />
        </el-select>
      </div>
      <div class="flex flex-col basis-150px gap-1">
        <span>Underline:</span>
        <el-select v-model="config.underline">
          <el-option
            v-for="type in underlineOptions"
            :key="type"
            :value="type"
          />
        </el-select>
      </div>
    </div>
    <el-divider />
    <el-config-provider :link="config">
      <el-link>Link desu!</el-link>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import type { LinkConfigContext } from 'element-plus'

const linkTypes = ['primary', 'success', 'warning', 'info', 'danger', 'default']
const underlineOptions = ['always', 'never', 'hover']

const config = reactive<LinkConfigContext>({
  type: 'success',
  underline: 'always',
})
</script>
```

--------------------------------

### Common Layout: Nested Container (Aside, Header, Main)

Source: https://element-plus.org/en-US/component/container

Demonstrates a layout where an aside section is followed by a nested container holding a header and main content.

```APIDOC
## Common Layout: Nested Container (Aside, Header, Main)

### Description
This layout starts with an aside section, followed by a nested container that includes a header and the main content area.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Set Custom Prefix Icon for Date Picker

Source: https://element-plus.org/en-US/component/date-picker

Customize the prefix icon of a date picker component by providing a custom component or a render function to the `prefix-icon` prop. This example uses a render function to display 'pre' as the prefix.

```vue
<template>
  <div class="demo-date-picker">
    <div class="block">
      <span class="demonstration">set prefix-icon</span>
      <el-date-picker
        v-model="value1"
        type="date"
        placeholder="Pick a day"
        :prefix-icon="customPrefix"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, shallowRef } from 'vue'

const value1 = ref('')

const customPrefix = shallowRef({
  render() {
    return h('p', 'pre')
  },
})
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
```

--------------------------------

### Button Configurations

Source: https://element-plus.org/en-US/component/config-provider

Configure global button properties like type, plain, round, dashed, and text appearance.

```APIDOC
## Button Configurations 

Configure global button properties.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Request Body
- **button** (Object) - Required - Configuration object for buttons.
  - **autoInsertSpace** (Boolean) - Optional - Whether to automatically insert space.
  - **type** (String) - Optional - The type of the button (e.g., 'default', 'primary').
  - **plain** (Boolean) - Optional - Whether the button is plain.
  - **round** (Boolean) - Optional - Whether the button is round.
  - **dashed** (Boolean) - Optional - Whether the button is dashed.
  - **text** (Boolean) - Optional - Whether the button is text-only.

### Request Example
```vue
<template>
  <div>
    <div>
      <el-checkbox v-model="config.autoInsertSpace">
        autoInsertSpace
      </el-checkbox>
      <el-checkbox v-model="config.plain"> plain </el-checkbox>
      <el-checkbox v-model="config.round"> round </el-checkbox>
      <el-checkbox v-model="config.dashed"> dashed </el-checkbox>
      <el-checkbox v-model="config.text"> text </el-checkbox>
      <el-select v-model="config.type" class="ml-5" style="max-width: 150px">
        <el-option
          v-for="type in buttonTypes.filter(Boolean)"
          :key="type"
          :value="type"
        />
      </el-select>
    </div>
    <el-divider />
    <el-config-provider :button="config">
      <el-button>中文</el-button>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { buttonTypes } from 'element-plus'

import type { ButtonConfigContext } from 'element-plus'

const config = reactive<ButtonConfigContext>({
  autoInsertSpace: true,
  type: 'default',
  plain: true,
  round: true,
  text: false,
  dashed: false,
})
</script>
```

### Response
#### Success Response (200)
N/A (Component Usage)

#### Response Example
N/A (Component Usage)
```

--------------------------------

### Element Plus Checkbox Group with Value and Disabled Options (Vue)

Source: https://element-plus.org/en-US/component/checkbox

Demonstrates the usage of el-checkbox-group for multiple selections. It binds an array to v-model and uses the 'value' attribute for each checkbox. Includes examples of disabled and pre-selected disabled checkboxes.

```vue
<template>
  <el-checkbox-group v-model="checkList">
    <el-checkbox label="Option A" value="Value A" />
    <el-checkbox label="Option B" value="Value B" />
    <el-checkbox label="Option C" value="Value C" />
    <el-checkbox label="disabled" value="Value disabled" disabled />
    <el-checkbox
      label="selected and disabled"
      value="Value selected and disabled"
      disabled
    />
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const checkList = ref(['Value selected and disabled', 'Value A'])
</script>
```

--------------------------------

### Vue Table V2 with Custom Filter Header

Source: https://element-plus.org/en-US/component/table-v2

This snippet shows how to configure a Table V2 component with a custom header renderer for filtering. It includes setup for data generation, locale handling, and the logic for applying and resetting filters.

```vue
<template>
  <el-table-v2
    fixed
    :columns="fixedColumns"
    :data="data"
    :width="700"
    :height="400"
  />
</template>

<script lang="tsx" setup>
import { computed, ref } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElIcon,
  ElPopover,
  TableV2FixedDir,
  useLocale,
} from 'element-plus'
import { Filter } from '@element-plus/icons-vue'

import type { HeaderCellSlotProps } from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })
const columns = generateColumns(10)
const data = ref(generateData(columns, 200))

const { t } = useLocale()
const shouldFilter = ref(false)
const popoverRef = ref()

const ariaLabel = computed(() => {
  return t('el.table.filterLabel', { column: columns[0].title })
})

const onFilter = () => {
  popoverRef.value.hide()
  if (shouldFilter.value) {
    data.value = generateData(columns, 100, 'filtered-')
  } else {
    data.value = generateData(columns, 200)
  }
}

const onReset = () => {
  shouldFilter.value = false
  onFilter()
}

const handleShowPopover = () => {
  const button = document.querySelector('.el-table-v2__demo-filter button')
  ;(button as HTMLElement)?.focus()
}

columns[0].headerCellRenderer = (props: HeaderCellSlotProps) => {
  return (
    <div class="flex items-center justify-center">
      <span class="mr-2 text-xs">{props.column.title}</span>
      <ElPopover
        ref={popoverRef}
        trigger="click"
        width={200}
        onAfter-enter={handleShowPopover}
      >
        {{ 
          default: () => (
            <div class="filter-wrapper">
              <div class="filter-group">
                <ElCheckbox v-model={shouldFilter.value}> 
                  Filter Text
                </ElCheckbox>
              </div>
              <div class="el-table-v2__demo-filter">
                <ElButton text onClick={onFilter}>
                  Confirm
                </ElButton>
                <ElButton text onClick={onReset}>
                  Reset
                </ElButton>
              </div>
            </div>
          ),
          reference: () => (
            <button
              type="button"
              aria-label={ariaLabel.value}
              class="el-table-v2__demo-filter-btn"
            >
              <ElIcon size={14}>
                <Filter />
              </ElIcon>
            </button>
          ),
        }}
      </ElPopover>
    </div>
  )
}

const fixedColumns = columns.map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined = undefined
  if (columnIndex < 2) fixed = TableV2FixedDir.LEFT
  if (columnIndex > 9) fixed = TableV2FixedDir.RIGHT
  return { ...column, fixed, width: 100 }
})
</script>

<style>
.el-table-v2__demo-filter {
  border-top: var(--el-border);
  margin: 12px -12px -12px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;

```

--------------------------------

### FormItem Exposes

Source: https://element-plus.org/en-US/component/form

Methods and properties exposed by the FormItem component instance.

```APIDOC
## FormItem Exposes

### Methods
- **validate** (Function) - Validate form item.
- **resetField** (Function) - Reset current field and remove validation result.
- **clearValidate** (Function) - Remove validation status of the field.
- **setInitialValue** (Function) - Set initial value for this field.
```

--------------------------------

### Dropdown Sizes

Source: https://element-plus.org/en-US/component/dropdown

Configuring the size of the dropdown component.

```APIDOC
## Dropdown Size Attribute

### Description
Sets the display size of the dropdown component.

### Parameters
- **size** (string) - Optional - Options: 'large', 'default', 'small'. Defaults to 'default'.
```

--------------------------------

### MessageBox Options Configuration

Source: https://element-plus.org/en-US/component/message-box

A comprehensive list of configuration properties for the MessageBox component.

```APIDOC
## MessageBox Configuration Options

### Description
This configuration object defines the behavior and appearance of the MessageBox component in Element Plus.

### Parameters
#### Request Body
- **autofocus** (boolean) - Optional - Auto focus when open MessageBox. Default: true
- **title** (string) - Optional - Title of the MessageBox. Default: ''
- **message** (string/VNode/Function) - Optional - Content of the MessageBox.
- **dangerouslyUseHTMLString** (boolean) - Optional - Whether message is treated as HTML string. Default: false
- **type** (enum) - Optional - Message type, used for icon display.
- **modal** (boolean) - Optional - Whether a mask is displayed. Default: true
- **showClose** (boolean) - Optional - Whether to show close icon. Default: true
- **showCancelButton** (boolean) - Optional - Whether to show a cancel button. Default: false
- **showConfirmButton** (boolean) - Optional - Whether to show a confirm button. Default: true
- **cancelButtonText** (string) - Optional - Text content of cancel button. Default: 'Cancel'
- **confirmButtonText** (string) - Optional - Text content of confirm button. Default: 'OK'
- **showInput** (boolean) - Optional - Whether to show an input. Default: false
- **inputPlaceholder** (string) - Optional - Placeholder of input. Default: ''
- **center** (boolean) - Optional - Whether to align the content in center. Default: false
- **draggable** (boolean) - Optional - Whether MessageBox is draggable. Default: false

### Request Example
{
  "title": "Confirm Action",
  "message": "Are you sure you want to proceed?",
  "showCancelButton": true,
  "confirmButtonText": "Confirm",
  "cancelButtonText": "Cancel"
}
```

--------------------------------

### Element Plus Splitter Basic Usage (Vue)

Source: https://element-plus.org/en-US/component/splitter

Demonstrates the fundamental implementation of the ElSplitter component. When no default size is provided, the splitter panels are automatically divided equally. It includes basic styling for visual representation.

```vue
<template>
  <div
    style="height: 250px; box-shadow: var(--el-border-color-light) 0px 0px 10px"
  >
    <el-splitter>
      <el-splitter-panel size="30%">
        <div class="demo-panel">1</div>
      </el-splitter-panel>
      <el-splitter-panel :min="200">
        <div class="demo-panel">2</div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
```

--------------------------------

### Element Plus Carousel Vertical Direction Configuration

Source: https://element-plus.org/en-US/component/carousel

Demonstrates how to display the Element Plus carousel in a vertical direction by setting the `direction` attribute to 'vertical'. This example shows both normal and card vertical layouts. Requires Vue and Element Plus.

```vue
<template>
  <p class="text-center demonstration">normal vertical layout</p>
  <el-carousel height="200px" direction="vertical" :autoplay="false">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
  <p class="text-center demonstration">card vertical layout</p>
  <el-carousel
    height="400px"
    direction="vertical"
    type="card"
    :autoplay="false"
  >
    <el-carousel-item v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

--------------------------------

### Steps Component API

Source: https://element-plus.org/en-US/component/steps

Configuration attributes, events, and slots for the main Steps container.

```APIDOC
## Steps Attributes

- **space** (number/string) - Optional - The spacing of each step, will be responsive if omitted. Supports percentage.
- **direction** (enum) - Optional - Display direction. Default: horizontal.
- **active** (number) - Optional - Current activation step. Default: 0.
- **process-status** (enum) - Optional - Status of current step. Default: process.
- **finish-status** (enum) - Optional - Status of end step. Default: finish.
- **align-center** (boolean) - Optional - Center title and description.
- **simple** (boolean) - Optional - Whether to apply simple theme.

### Steps Events
- **change** - Triggers when the active step changes. Parameters: Function.

### Steps Slots
- **default** - Customize default content. Subtags: Step.
```

--------------------------------

### Create Basic Grid Layouts with Element Plus

Source: https://element-plus.org/en-US/component/layout

Demonstrates how to use 'el-row' and 'el-col' components to create basic grid structures. The 'span' attribute defines the width of each column based on a 24-column scale.

```vue
<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content ep-bg-purple-dark" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple-light" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple" />
    </el-col>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple-light" />
    </el-col>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple" />
    </el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
```

--------------------------------

### Element Plus Tabs with Default Active Tab

Source: https://element-plus.org/en-US/component/tabs

Configures the Element Plus Tabs component to display a specific tab as active on initial render using the `default-value` prop. Includes setup for tab data and click event handling.

```vue
<template>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    default-value="third"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
    >
      default-value: third
      <br />
      active: {{ activeName }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TabsPaneContext } from 'element-plus'

const tabs = ref([
  { label: 'User', name: 'first' },
  { label: 'Config', name: 'second' },
  { label: 'Role', name: 'third' },
  { label: 'Task', name: 'fourth' },
])

const activeName = ref()

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
```

--------------------------------

### Customize Autocomplete Suggestions with Scoped Slot

Source: https://element-plus.org/en-US/component/autocomplete

Use the scoped slot to customize how suggestion items are displayed. Access suggestion data via the 'item' key within the slot scope. This example also includes a suffix icon for triggering an action.

```vue
<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="Please input"
    @select="handleSelect"
  >
    <template #suffix>
      <el-icon class="el-input__icon" @click="handleIconClick">
        <edit />
      </el-icon>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
      <span class="link">{{ item.link }}</span>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'

interface LinkItem {
  value: string
  link: string
}

const state = ref('')
const links = ref<LinkItem[]>([])

const querySearch = (queryString: string, cb) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value
  // call callback function to return suggestion objects
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}
const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

const handleIconClick = (ev: Event) => {
  console.log(ev)
}

onMounted(() => {
  links.value = loadAll()
})
</script>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
```

--------------------------------

### Configure Predefined Colors

Source: https://element-plus.org/en-US/component/color-picker-panel

Demonstrates how to provide a list of predefined color options to the ColorPickerPanel using the predefine attribute. This is useful for offering quick-select color swatches to the user.

```vue
<template>
  <el-color-picker-panel
    v-model="color"
    show-alpha
    :predefine="predefineColors"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]
</script>
```

--------------------------------

### Customize Dropdown Footer with Slot

Source: https://element-plus.org/en-US/component/select-v2

Use the `#footer` slot to add custom content, such as buttons for adding options, to the dropdown's footer. This example shows how to conditionally display an 'Add an option' button or an input field for creating new options.

```vue
<template>
  <el-select-v2
    ref="select"
    v-model="value"
    :options="options"
    placeholder="Select"
    style="width: 240px"
  >
    <template #footer>
      <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
        Add an option
      </el-button>
      <div v-else class="select-footer">
        <el-input
          v-model="optionName"
          class="option-input"
          placeholder="input option name"
          size="small"
        />
        <div>
          <el-button type="primary" size="small" @click="onConfirm">
            confirm
          </el-button>
          <el-button size="small" @click="clear">cancel</el-button>
        </div>
      </div>
    </template>
  </el-select-v2>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'

import type { CheckboxValueType, SelectV2Instance } from 'element-plus'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const select = ref<SelectV2Instance>()
const isAdding = ref(false)
const value = ref<CheckboxValueType[]>([])
const optionName = ref('')
const options = ref(
  Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`,
  }))
)

const onAddOption = () => {
  isAdding.value = true
}

const onConfirm = () => {
  if (optionName.value) {
    options.value.push({
      label: optionName.value,
      value: optionName.value,
    })
    clear()
    nextTick(() => {
      select.value?.scrollTo(options.value.length - 1)
    })
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
}
</script>

<style>
.select-footer {
  display: flex;
  flex-direction: column;

  .option-input {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
```

--------------------------------

### Basic Usage of Empty Component

Source: https://element-plus.org/en-US/component/empty

Displays a standard empty state with a custom description text. This is the simplest implementation of the component.

```vue
<template>
  <el-empty description="description" />
</template>
```

--------------------------------

### Common Layout: Aside, Main, and Aside

Source: https://element-plus.org/en-US/component/container

Shows a layout with sidebars on both the left and right of the main content.

```APIDOC
## Common Layout: Aside, Main, and Aside

### Description
This layout includes two sidebars (left and right) flanking a central main content area.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
      <el-aside width="200px">Aside</el-aside>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Menu Exposes API

Source: https://element-plus.org/en-US/component/menu

This section details the methods that can be exposed and called on the Menu component instance.

```APIDOC
## Menu Exposes API

### Description
Details the methods that can be exposed and called on the Menu component instance.

### Exposes
- **open** - Open a specific sub-menu. The parameter is the index of the sub-menu to open. Type: `Function`.
- **close** - Close a specific sub-menu. The parameter is the index of the sub-menu to close. Type: `Function`.
- **handleResize** - Manually trigger menu width recalculation. Type: `Function`.
- **updateActiveIndex** - Set index of active menu. Available since 2.9.8. Type: `Function`.
```

--------------------------------

### Inherit App Context in Loading Service

Source: https://element-plus.org/en-US/component/loading

Demonstrates how to inject the current application context into the Loading service to ensure access to global properties and plugins.

```typescript
import { getCurrentInstance } from 'vue'
import { ElLoading } from 'element-plus'

// in your setup method
const { appContext } = getCurrentInstance()!
ElLoading.service({}, appContext)
```

--------------------------------

### Controlling Dropdown Visibility via Methods

Source: https://element-plus.org/en-US/component/dropdown

Shows how to manually open or close a dropdown menu using the handleOpen and handleClose methods accessed through a template ref. This is useful for synchronizing multiple dropdown states.

```vue
<template>
  <el-button @click="showClick">show</el-button>
  <el-dropdown ref="dropdown1" trigger="contextmenu">
    <span class="el-dropdown-link"> Dropdown List1 </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownInstance } from 'element-plus'

const dropdown1 = ref<DropdownInstance>()
function showClick() {
  if (!dropdown1.value) return
  dropdown1.value.handleOpen()
}
</script>
```

--------------------------------

### Customize Date Picker Cell Content

Source: https://element-plus.org/en-US/component/date-picker

Use the default scoped slot to access cell data and customize the appearance of each date cell. Ensure the custom structure matches the default to avoid style issues. This example shows how to highlight holidays.

```vue
<template>
  <div class="demo-date-picker">
    <el-date-picker
      v-model="value"
      type="date"
      placeholder="Pick a day"
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
    >
      <template #default="cell">
        <div class="cell" :class="{ current: cell.isCurrent }">
          <span class="text">{{ cell.text }}</span>
          <span v-if="isHoliday(cell)" class="holiday" />
        </div>
      </template>
    </el-date-picker>
    <el-date-picker v-model="month" type="month" placeholder="Pick a month">
      <template #default="cell">
        <div class="el-date-table-cell" :class="{ current: cell.isCurrent }">
          <span class="el-date-table-cell__text">{{ cell.text + 1 }}期</span>
        </div>
      </template>
    </el-date-picker>
    <el-date-picker v-model="year" type="year" placeholder="Pick a year">
      <template #default="cell">
        <div class="el-date-table-cell" :class="{ current: cell.isCurrent }">
          <span class="el-date-table-cell__text">{{ cell.text + 1 }}y</span>
        </div>
      </template>
    </el-date-picker>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('2021-10-29')
const month = ref('')
const year = ref('')
const holidays = [
  '2021-10-01',
  '2021-10-02',
  '2021-10-03',
  '2021-10-04',
  '2021-10-05',
  '2021-10-06',
  '2021-10-07',
]

const isHoliday = ({ dayjs }) => {
  return holidays.includes(dayjs.format('YYYY-MM-DD'))
}
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.demo-date-picker > * {
  margin: 0 !important;
}

.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}

.cell .text {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}

.cell.current .text {
  background: #626aef;
  color: #fff;
}

.cell .holiday {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--el-color-danger);
  border-radius: 50%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}

@media screen and (max-width: 768px) {
  .demo-date-picker {
    gap: 1.5rem;
  }
}
</style>
```

--------------------------------

### Customize Table Row Classes with row-class-name

Source: https://element-plus.org/en-US/component/table-v2

Use the `row-class` prop to dynamically assign CSS classes to table rows. This example highlights every 5th row with 'bg-red-100' and every 10th row with 'bg-blue-200'. Ensure the CSS classes are defined in your project.

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :row-class="rowClass"
    :width="700"
    :height="400"
  />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  ElButton,
  ElIcon,
  ElTag,
  ElTooltip,
  TableV2FixedDir,
} from 'element-plus'
import { Timer } from '@element-plus/icons-vue'

import type { Column, RowClassNameGetter } from 'element-plus'

let id = 0

const dataGenerator = () => ({
  id: `random-id-${++id}`,
  name: 'Tom',
  date: '2020-10-1',
})

const columns: Column<any>[] = [
  {
    key: 'date',
    title: 'Date',
    dataKey: 'date',
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData: date }) => (
      <ElTooltip content={dayjs(date).format('YYYY/MM/DD')}>
        {
          <span class="flex items-center">
            <ElIcon class="mr-3">
              <Timer />
            </ElIcon>
            {dayjs(date).format('YYYY/MM/DD')}
          </span>
        }
      </ElTooltip>
    ),
  },
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150,
    align: 'center',
    cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>,
  },
  {
    key: 'operations',
    title: 'Operations',
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
    width: 150,
    align: 'center',
    flexGrow: 1,
  },
]

const data = ref(Array.from({ length: 200 }).map(dataGenerator))

const rowClass = ({ rowIndex }: Parameters<RowClassNameGetter<any>>[0]) => {
  if (rowIndex % 10 === 5) {
    return 'bg-red-100'
  } else if (rowIndex % 10 === 0) {
    return 'bg-blue-200'
  }
  return ''
}
</script>
```

--------------------------------

### Link with Icon

Source: https://element-plus.org/en-US/component/link

Demonstrates how to add icons to the Link component, either before or after the text.

```APIDOC
## Link with Icon

### Description
Adds icons to the Link component. Icons can be placed before or after the link text using the `icon` attribute or by placing an `el-icon` component within the slot.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
N/A

### Request Example
```vue
<template>
  <div>
    <el-link :icon="Edit">Edit</el-link>
    <el-link>
      Check<el-icon class="el-icon--right"><icon-view /></el-icon>
    </el-link>
  </div>
</template>

<script setup lang="ts">
import { Edit, View as IconView } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-link {
  margin-right: 8px;
}
</style>
```

### Response
#### Success Response (200)
N/A (Component Rendering)

#### Response Example
N/A (Component Rendering)
```

--------------------------------

### Implement Basic Dialog with Close Confirmation

Source: https://element-plus.org/en-US/component/dialog

Demonstrates the basic implementation of a Dialog using v-model for visibility control. It includes a custom title, a footer slot for action buttons, and a before-close hook to trigger a confirmation message.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open the Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

--------------------------------

### Basic Radio Usage and API Migration

Source: https://element-plus.org/en-US/component/radio

Demonstrates the basic implementation of the Radio component and highlights the migration from the deprecated label attribute to the new value attribute.

```vue
<template>
  <el-radio-group v-model="radio1">
    <el-radio value="Value 1">Option 1</el-radio>
    <el-radio label="Label 2 & Value 2">Option 2</el-radio>
  </el-radio-group>
</template>
```

--------------------------------

### Common Layout: Nested Container (Header, Aside, Main, Footer)

Source: https://element-plus.org/en-US/component/container

Shows a complex nested layout with a header, an aside, main content, and a footer.

```APIDOC
## Common Layout: Nested Container (Header, Aside, Main, Footer)

### Description
This layout features a nested container structure. It includes a header, an aside section, the main content area, and a footer.

### Method
Component Usage

### Endpoint
N/A

### Request Body
N/A

### Request Example
```vue
<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
```

### Response
N/A
```

--------------------------------

### Set Default Expanded and Checked Nodes in Element Plus Tree

Source: https://element-plus.org/en-US/component/tree

Tree nodes can be initially expanded or checked using `default-expanded-keys` and `default-checked-keys`. Note that for these properties to work, `node-key` is required and its value must be unique across the whole tree. This example uses Vue.

```vue
<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[2, 3]"
    :default-checked-keys="[5]"
    :props="defaultProps"
  />
</template>

<script lang="ts" setup>
const defaultProps = {
  children: 'children',
  label: 'label',
}
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>
```

--------------------------------

### Inject Teleport Markup into HTML

Source: https://element-plus.org/en-US/guide/ssr

Prepare your final HTML structure to include a placeholder for teleported content, typically placed near the `<body>` tag.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Element Plus</title>
    <!--preload-links-->
  </head>
  <body>
    <!--app-teleports-->
    <div id="app"><!--app-html--></div>
    <script type="module" src="/src/entry-client.js"></script>
  </body>
</html>
```

--------------------------------

### Customizing Select Tags in Vue

Source: https://element-plus.org/en-US/component/select

Allows for custom rendering of selected tags within the Element Plus Select component. This example shows how to use slots to display custom tag elements, including color swatches and labels, overriding default tag behavior.

```vue
<template>
  <el-select v-model="value" multiple placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in colors"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <div class="flex items-center">
        <el-tag :color="item.value" style="margin-right: 8px" size="small" />
        <span :style="{ color: item.value }">{{ item.label }}</span>
      </div>
    </el-option>
    <template #tag>
      <el-tag v-for="color in value" :key="color" :color="color" />
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref<string[]>([])
const colors = [
  {
    value: '#E63415',
    label: 'red',
  },
  {
    value: '#FF6600',
    label: 'orange',
  },
  {
    value: '#FFDE0A',
    label: 'yellow',
  },
  {
    value: '#1EC79D',
    label: 'green',
  },
  {
    value: '#14CCCC',
    label: 'cyan',
  },
  {
    value: '#4167F0',
    label: 'blue',
  },
  {
    value: '#6222C9',
    label: 'purple',
  },
]
colors.forEach((color) => {
  value.value.push(color.value)
})
</script>

<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
```

--------------------------------

### Date Picker Exposes

Source: https://element-plus.org/en-US/component/datetime-picker

Methods exposed by the Date Picker component.

```APIDOC
## Date Picker Exposes

### Description
Methods exposed by the Date Picker component.

### Exposes
- **focus** (`Function`) - focus the DatePicker component.
- **blur** (2.8.7) (`Function`) - blur the DatePicker component.
```

--------------------------------

### Element Plus Slider: Range Selection Example

Source: https://element-plus.org/en-US/component/slider

Demonstrates how to use the `el-slider` component in range mode. The `range` attribute enables selection of a value range, with the bound value being an array of two boundary values. The `max` attribute sets the maximum selectable value.

```vue
<template>
  <div class="slider-demo-block">
    <el-slider v-model="value" range show-stops :max="10" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([4, 8])
</script>

<style scoped>
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>
```

--------------------------------

### Element Plus Space: Customize Fill Ratio with 'fillRatio' Prop (Vue)

Source: https://element-plus.org/en-US/component/space

Illustrates how to use the `fillRatio` attribute in the `el-space` component to customize the filling proportion of child elements. It allows for fine-grained control over how much space each item occupies, with examples for both horizontal and vertical directions.

```vue
<template>
  <div>
    <div style="margin-bottom: 15px">
      direction:
      <el-radio v-model="direction" value="horizontal">horizontal</el-radio>
      <el-radio v-model="direction" value="vertical">vertical</el-radio>
    </div>
    <div style="margin-bottom: 15px">
      fillRatio:<el-slider v-model="fillRatio" />
    </div>
    <el-space
      fill
      wrap
      :fill-ratio="fillRatio"
      :direction="direction"
      style="width: 100%"
    >
      <el-card v-for="i in 5" :key="i" class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { SpaceInstance } from 'element-plus'

const direction = ref<SpaceInstance['direction']>('horizontal')
const fillRatio = ref(30)
</script>
```

--------------------------------

### Basic Usage of Anchor Component

Source: https://element-plus.org/en-US/component/anchor

Demonstrates the fundamental usage of the el-anchor component to create navigation links that point to different sections of a page. It includes nested links for hierarchical navigation.

```APIDOC
## Basic Usage of Anchor Component

### Description
This section showcases the most basic implementation of the Anchor component, allowing users to navigate to different sections of the current page. It supports nested links for creating hierarchical navigation structures.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Anchor Attributes
- **offset** (number) - Optional - Sets the scroll offset for the anchor.

#### Anchor Link Attributes
- **href** (string) - Required - The URL or fragment identifier the link points to.
- **title** (string) - Optional - The title displayed for the anchor link.

### Request Example
```html
<template>
  <el-anchor :offset="70">
    <el-anchor-link href="#basic-usage">
      Basic Usage
    </el-anchor-link>
    <el-anchor-link href="#horizontal-mode">
      Horizontal Mode
    </el-anchor-link>
    <el-anchor-link href="#scroll-container">
      Scroll Container
    </el-anchor-link>
    <el-anchor-link href="#anchor-api">
      Anchor API
      <template #sub-link>
        <el-anchor-link href="#anchor-attributes">
          Anchor Attributes
        </el-anchor-link>
        <el-anchor-link href="#anchor-events">
          Anchor Events
        </el-anchor-link>
      </template>
    </el-anchor-link>
  </el-anchor>
</template>
```

### Response
#### Success Response (200)
N/A (Component Rendering)

#### Response Example
N/A (Component Rendering)
```

--------------------------------

### Element Plus Space Customized Size Example

Source: https://element-plus.org/en-US/component/space

Demonstrates how to use a custom numerical value for the `size` attribute in the `el-space` component to define precise spacing between elements, overriding the default or predefined sizes. This Vue.js snippet includes a slider to dynamically adjust the custom size.

```vue
<template>
  <el-slider v-model="size" />
  <el-space wrap :size="size">
    <el-card v-for="i in 2" :key="i" class="box-card" style="width: 250px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
    </el-card>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const size = ref(20)
</script>
```

--------------------------------

### Local Import of MessageBox

Source: https://element-plus.org/en-US/component/message-box

Demonstrates the on-demand import syntax for the MessageBox component and its variants.

```typescript
import { ElMessageBox } from 'element-plus'
```

--------------------------------

### Countdown Component Exposes

Source: https://element-plus.org/en-US/component/statistic

Properties exposed by the Countdown component instance.

```APIDOC
## Countdown Exposes 

### Description
Properties exposed by the Countdown component instance.

### Exposes
- **displayValue** (`object`) - The current display value of the countdown.
```

--------------------------------

### Vue Popover for Nested Confirmation Dialog

Source: https://element-plus.org/en-US/component/popover

Illustrates how to use the Element Plus Popover component to create a nested confirmation dialog for actions like deletion. It manages the visibility of the popover and provides cancel and confirm buttons. This example uses Vue.js with TypeScript and the Composition API.

```vue
<template>
  <el-popover :visible="visible" placement="top" :width="180">
    <p>Are you sure to delete this?</p>
    <div style="text-align: right; margin: 0">
      <el-button size="small" text @click="visible = false">cancel</el-button>
      <el-button size="small" type="primary" @click="visible = false">
        confirm
      </el-button>
    </div>
    <template #reference>
      <el-button @click="visible = true">Delete</el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
</script>
```

--------------------------------

### Vue Popover with Nested Table and Rich Content

Source: https://element-plus.org/en-US/component/popover

Demonstrates using the Element Plus Popover component to display a nested table and rich content including an avatar and user details. The popover is triggered by a button or an avatar. This example uses Vue.js with TypeScript and the Composition API.

```vue
<template>
  <div style="display: flex; align-items: center">
    <el-popover placement="right" :width="400" trigger="click">
      <template #reference>
        <el-button style="margin-right: 16px">Click to activate</el-button>
      </template>
      <el-table :data="gridData">
        <el-table-column width="150" property="date" label="date" />
        <el-table-column width="100" property="name" label="name" />
        <el-table-column width="300" property="address" label="address" />
      </el-table>
    </el-popover>

    <el-popover
      :width="300"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
      <template #reference>
        <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
      </template>
      <template #default>
        <div
          class="demo-rich-conent"
          style="display: flex; gap: 16px; flex-direction: column"
        >
          <el-avatar
            :size="60"
            src="https://avatars.githubusercontent.com/u/72015883?v=4"
            style="margin-bottom: 8px"
          />
          <div>
            <p
              class="demo-rich-content__name"
              style="margin: 0; font-weight: 500"
            >
              Element Plus
            </p>
            <p
              class="demo-rich-content__mention"
              style="margin: 0; font-size: 14px; color: var(--el-color-info)"
            >
              @element-plus
            </p>
          </div>

          <p class="demo-rich-content__desc" style="margin: 0">
            Element Plus, a Vue 3 based component library for developers,
            designers and product managers
          </p>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
const gridData = [
  {
    date: '2016-05-02',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-01',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-03',
    name: 'Jack',
    address: 'New York City',
  },
]
</script>
```

--------------------------------

### Implement Basic ColorPickerPanel

Source: https://element-plus.org/en-US/component/color-picker-panel

Demonstrates the basic usage of the ColorPickerPanel component by binding a string variable to v-model. This requires the component to be imported and used within a Vue template.

```vue
<template>
  <el-color-picker-panel v-model="color" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('#409EFF')
</script>
```

--------------------------------

### Customizing Pager Count - Vue

Source: https://element-plus.org/en-US/component/pagination

Shows how to customize the number of visible pager buttons in the Element Plus Pagination component using the `pager-count` attribute. This is useful when you need to display more or fewer page numbers directly. The example sets `pager-count` to 11 for a total of 1000 items.

```vue
<template>
  <el-pagination
    :page-size="20"
    :pager-count="11"
    layout="prev, pager, next"
    :total="1000"
  />
</template>
```

--------------------------------

### Link Configurations

Source: https://element-plus.org/en-US/component/config-provider

Configure global link properties such as type and underline behavior.

```APIDOC
## Link Configurations 

Configure global link properties.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Request Body
- **link** (Object) - Required - Configuration object for links.
  - **type** (String) - Optional - The type of the link (e.g., 'primary', 'success').
  - **underline** (String) - Optional - The underline behavior ('always', 'never', 'hover').

### Request Example
```vue
<template>
  <div>
    <div class="flex gap-4">
      <div class="flex flex-col basis-150px gap-1">
        <span>Type:</span>
        <el-select v-model="config.type">
          <el-option v-for="type in linkTypes" :key="type" :value="type" />
        </el-select>
      </div>
      <div class="flex flex-col basis-150px gap-1">
        <span>Underline:</span>
        <el-select v-model="config.underline">
          <el-option
            v-for="type in underlineOptions"
            :key="type"
            :value="type"
          />
        </el-select>
      </div>
    </div>
    <el-divider />
    <el-config-provider :link="config">
      <el-link>Link desu!</el-link>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import type { LinkConfigContext } from 'element-plus'

const linkTypes = ['primary', 'success', 'warning', 'info', 'danger', 'default']
const underlineOptions = ['always', 'never', 'hover']

const config = reactive<LinkConfigContext>({
  type: 'success',
  underline: 'always',
})
</script>
```

### Response
#### Success Response (200)
N/A (Component Usage)

#### Response Example
N/A (Component Usage)
```

--------------------------------

### Vue Tree Component for Node Checking

Source: https://element-plus.org/en-US/component/tree

This component utilizes the Element Plus tree component to manage checked nodes. It provides buttons to get nodes by object or key, set nodes by object or key, and reset selections. Ensure `node-key` is configured for key-based operations.

```vue
<template>
  <el-tree
    ref="treeRef"
    style="max-width: 600px"
    :data="data"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
  />

  <div class="flex flex-wrap gap-1 mt-2">
    <el-button class="!ml-0" @click="getCheckedNodes">get by node</el-button>
    <el-button class="!ml-0" @click="getCheckedKeys">get by key</el-button>
    <el-button class="!ml-0" @click="setCheckedNodes">set by node</el-button>
    <el-button class="!ml-0" @click="setCheckedKeys">set by key</el-button>
    <el-button class="!ml-0" @click="resetChecked">reset</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { RenderContentContext, TreeInstance } from 'element-plus'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}
type Node = RenderContentContext['node']

const treeRef = ref<TreeInstance>()

const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}
const setCheckedNodes = () => {
  treeRef.value!.setCheckedNodes(
    [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 9,
        label: 'Level three 1-1-1',
      },
    ] as Node[],
    false
  )
}
const setCheckedKeys = () => {
  treeRef.value!.setCheckedKeys([3], false)
}
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}

const defaultProps = {
  children: 'children',
  label: 'label',
}

const data: Tree[] = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>
```

--------------------------------

### Handling Dropdown Command Events

Source: https://element-plus.org/en-US/component/dropdown

Demonstrates how to capture selection events from dropdown items using the @command listener. Each item is assigned a command value which is passed to the handler function when clicked.

```vue
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">Action 1</el-dropdown-item>
        <el-dropdown-item command="b">Action 2</el-dropdown-item>
        <el-dropdown-item command="c">Action 3</el-dropdown-item>
        <el-dropdown-item command="d" disabled>Action 4</el-dropdown-item>
        <el-dropdown-item command="e" divided>Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command: string | number | object) => {
  ElMessage(`click on item ${command}`)
}
</script>
```

--------------------------------

### Vue Table with Row Selection

Source: https://element-plus.org/en-US/component/table-v2

This component renders a table with selectable rows using Element Plus's `el-auto-resizer` and `el-table-v2`. It includes custom cell renderers for row selection checkboxes and a header cell renderer for a 'select all' option. Ensure you have Vue.js and Element Plus installed.

```vue
<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="tsx" setup>
import { ref, unref } from 'vue'
import { ElCheckbox, useLocale } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  ariaLabel?: string
  onChange: (value: CheckboxValueType) => void
}

const { t } = useLocale()

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  ariaLabel,
  onChange,
}) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      ariaLabel={ariaLabel}
      indeterminate={intermediate}
    />
  )
}

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        checked: false,
        parentId: null,
      }
    )
  })

const columns: Column<any>[] = generateColumns(10)
columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value: CheckboxValueType) => (rowData.checked = value)
    return (
      <SelectionCell
        value={rowData.checked}
        ariaLabel={t('el.table.selectRowLabel')}
        onChange={onChange}
      />
    )
  },

  headerCellRenderer: () => {
    const _data = unref(data)
    const onChange = (value: CheckboxValueType) =>
      (data.value = _data.map((row) => {
        row.checked = value
        return row
      }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)

    return (
      <SelectionCell
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        ariaLabel={t('el.table.selectAllLabel')}
        onChange={onChange}
      />
    )
  },
})

const data = ref(generateData(columns, 200))
</script>
```

--------------------------------

### Manually Trigger Image Preview

Source: https://element-plus.org/en-US/component/image

Shows how to trigger the image preview programmatically using the showPreview method on the el-image instance or by manually controlling the el-image-viewer component visibility.

```vue
<template>
  <div class="flex gap-12">
    <div class="grid gap-3">
      <el-button @click="handleClick">
        openPreview with showPreview method
      </el-button>
      <el-image
        ref="imageRef"
        style="width: 100px; height: 100px"
        :src="url"
        show-progress
        :preview-src-list="srcList"
        fit="cover"
      />
    </div>
    <div>
      <el-button @click="showPreview = true"> preview controlled </el-button>
      <el-image-viewer
        v-if="showPreview"
        :url-list="srcList"
        show-progress
        :initial-index="4"
        @close="showPreview = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ImageInstance } from 'element-plus'

const url = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const imageRef = ref<ImageInstance>()
const showPreview = ref(false)

const handleClick = () => {
  imageRef.value!.showPreview()
}
</script>
```

--------------------------------

### Configure Vite for Auto Import

Source: https://element-plus.org/en-US/guide/quickstart

Set up Vite configuration to enable automatic importing of Element Plus components and APIs using ElementPlusResolver.

```typescript
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

--------------------------------

### Handle Lazy Loading Failures in Element Plus Tree

Source: https://element-plus.org/en-US/component/tree

When lazily loading node data remotely, lazy loading may sometimes fail. In this case, you can call reject to keep the node status as is and allow remote loading to continue. This example shows how to implement this with a Vue component.

```vue
<template>
  <el-tree style="max-width: 600px" :props="props" :load="loadNode" lazy />
</template>

<script lang="ts" setup>
import type { LoadFunction } from 'element-plus'

const props = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
}

let time = 0
const loadNode: LoadFunction = (node, resolve, reject) => {
  if (node.level === 0) {
    return resolve([{ name: 'region' }])
  }
  time++
  if (node.level >= 1) {
    setTimeout(() => {
      if (time > 3) {
        return resolve([
          { name: 'zone1', leaf: true },
          { name: 'zone2', leaf: true },
          { name: 'zone3', leaf: true },
        ])
      } else {
        return reject()
      }
    }, 3000)
  }
}
</script>
```

--------------------------------

### Element Plus Table Overflow Tooltip with show-overflow-tooltip

Source: https://element-plus.org/en-US/component/table

This snippet demonstrates how to enable tooltips for overflowing content in `el-table` cells using the `show-overflow-tooltip` attribute. When set to `true`, any text that exceeds the cell's width will be displayed in a tooltip upon hovering. This example is implemented in Vue with TypeScript.

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column
      property="address"
      label="use show-overflow-tooltip"
      width="240"
      show-overflow-tooltip
    />
    <el-table-column property="address" label="address" />
  </el-table>
</template>

<script lang="ts" setup>
interface User {
  date: string
  name: string
  address: string
}
const tableData: User[] = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]
</script>
```

--------------------------------

### Vue: Configure Table Overflow Tooltip with Element Plus

Source: https://element-plus.org/en-US/component/config-provider

This Vue.js snippet demonstrates how to configure the `showOverflowTooltip` property for `el-table-column` in Element Plus. It shows how to enable/disable the tooltip globally via `el-config-provider` and individually for columns. The example includes a table with data and controls to toggle the tooltip behavior.

```vue
<template>
  <div>
    <div>
      <el-checkbox v-model="config.showOverflowTooltip">
        showOverflowTooltip
      </el-checkbox>
      <el-select
        v-model="config.tooltipEffect"
        class="ml-5"
        style="max-width: 150px"
      >
        <el-option value="dark" label="dark" />
        <el-option value="light" label="light" />
      </el-select>
    </div>
    <el-divider />
    <el-config-provider :table="config">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column
          property="address"
          label="Address (inherited from config-provider)"
          width="300"
        />
        <el-table-column
          property="address"
          label="Address (explicit false)"
          :show-overflow-tooltip="false"
        />
      </el-table>
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import type { TableConfigContext } from 'element-plus'

const config = reactive<TableConfigContext>({
  showOverflowTooltip: true,
  tooltipEffect: 'dark',
})

interface User {
  date: string
  name: string
  address: string
}

const tableData: User[] = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]
</script>
```

--------------------------------

### Prop Aliases for Data Source

Source: https://element-plus.org/en-US/component/transfer

Explains how to use the `props` attribute to define aliases for `key`, `label`, and `disabled` when data items have different key names.

```APIDOC
## Prop aliases

By default, Transfer looks for `key`, `label` and `disabled` in a data item. If your data items have different key names, you can use the `props` attribute to define aliases.

```vue
<template>
  <el-transfer
    v-model="value"
    :props="{
      key: 'value',
      label: 'desc',
    }"
    :data="data"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Option {
  value: number
  desc: string
  disabled: boolean
}

const generateData = () => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      value: i,
      desc: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref<Option[]>(generateData())
const value = ref([])
</script>
```
```

--------------------------------

### Vue Popover with Directive and Virtual Triggering

Source: https://element-plus.org/en-US/component/popover

Shows how to use the Element Plus Popover component with a directive (`v-popover`) and virtual triggering. This method is less recommended but useful for specific scenarios. It also includes a `v-click-outside` directive to close the popover when clicking outside. This example uses Vue.js with TypeScript.

```vue
<template>
  <el-button v-popover="popoverRef" v-click-outside="onClickOutside">
    Click me
  </el-button>

  <el-popover
    ref="popoverRef"
    trigger="click"
    title="With title"
    virtual-triggering
    persistent
  >
    <span> Some content </span>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

import type { PopoverInstance } from 'element-plus'

const popoverRef = ref<PopoverInstance>()
const onClickOutside = () => {
  popoverRef.value?.hide()
}
</script>
```

--------------------------------

### Basic Collapse Usage with Vue

Source: https://element-plus.org/en-US/component/collapse

Demonstrates the basic implementation of the Element Plus Collapse component in a Vue.js application. It shows how to define collapsible items, manage active panels, and handle change events. This snippet requires Vue.js and Element Plus.

```vue
<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advice about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { CollapseModelValue } from 'element-plus'

const activeNames = ref(['1'])
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}
</script>
```

--------------------------------

### Vue Table V2 with Grouped Headers

Source: https://element-plus.org/en-US/component/table-v2

This Vue component demonstrates how to implement grouped headers in Element Plus Table V2. It utilizes a custom header renderer defined in JSX and configures fixed columns for left and right sides. Ensure you have Element Plus installed and configured in your Vue project.

```vue
<template>
  <el-table-v2
    fixed
    :columns="fixedColumns"
    :data="data"
    :header-height="[50, 40, 50]"
    :header-class="headerClass"
    :width="700"
    :height="400"
  >
    <template #header="props">
      <customized-header v-bind="props" />
    </template>
  </el-table-v2>
</template>

<script lang="tsx" setup>
import { TableV2FixedDir, TableV2Placeholder } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type {
  HeaderClassNameGetter,
  TableV2CustomizedHeaderSlotParam,
} from 'element-plus'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })
const columns = generateColumns(15)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined = undefined
  if (columnIndex < 3) fixed = TableV2FixedDir.LEFT
  if (columnIndex > 12) fixed = TableV2FixedDir.RIGHT
  return { ...column, fixed, width: 100 }
})

const CustomizedHeader: FunctionalComponent<
  TableV2CustomizedHeaderSlotParam
> = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 2) return cells

  const groupCells = [] as typeof cells
  let width = 0
  let idx = 0

  columns.forEach((column, columnIndex) => {
    if (column.placeholderSign === TableV2Placeholder)
      groupCells.push(cells[columnIndex])
    else {
      width += cells[columnIndex].props!.column.width
      idx++

      const nextColumn = columns[columnIndex + 1]
      if (
        columnIndex === columns.length - 1 ||
        nextColumn.placeholderSign === TableV2Placeholder ||
        idx === (headerIndex === 0 ? 4 : 2)
      ) {
        groupCells.push(
          <div
            class="flex items-center justify-center custom-header-cell"
            role="columnheader"
            style={{ ...cells[columnIndex].props!.style,
              width: `${width}px`,
            }}
          >
            {cells[columnIndex].children}
          </div>
        )
        width = 0
        idx = 0
      }
    }
  })

  return groupCells
}
</script>

```

--------------------------------

### Element Plus Splitter: Enabling Lazy Resizing Mode

Source: https://element-plus.org/en-US/component/splitter

Illustrates the 'lazy' mode for the Element Plus splitter component. When enabled, panel sizes are updated only after the drag operation ends, providing a smoother experience for complex layouts. This example uses Vue's template syntax and scoped CSS.

```vue
<template>
  <div
    style="height: 250px; box-shadow: var(--el-border-color-light) 0px 0px 10px"
  >
    <el-splitter lazy>
      <el-splitter-panel collapsible min="50">
        <div class="demo-panel">1</div>
      </el-splitter-panel>
      <el-splitter-panel collapsible>
        <div class="demo-panel">2</div>
      </el-splitter-panel>
      <el-splitter-panel collapsible>
        <div class="demo-panel">3</div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
```

--------------------------------

### Element Plus Table Row Styling with row-class-name

Source: https://element-plus.org/en-US/component/table

This snippet demonstrates how to dynamically assign CSS classes to table rows based on conditions using the `row-class-name` prop in `el-table`. It allows for visual highlighting of rows, such as 'warning-row' and 'success-row', by returning specific class names from a function. The provided example uses TypeScript and Vue.

```vue
<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
interface User {
  date: string
  name: string
  address: string
}

const tableRowClassName = ({ 
  row,
  rowIndex,
}: { 
  row: User
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
```

--------------------------------

### InputTag Sizes

Source: https://element-plus.org/en-US/component/input-tag

Demonstrates how to change the size of the InputTag component using the `size` attribute. Available sizes are `large`, `default`, and `small`.

```APIDOC
## Sizes 

Add `size` attribute to change the size of InputTag. In addition to the default size, there are two other options: `large`, `small`.

```vue
<template>
  <el-input-tag v-model="input" size="large" placeholder="Please input" />
  <br />
  <el-input-tag v-model="input" placeholder="Please input" />
  <br />
  <el-input-tag v-model="input" size="small" placeholder="Please input" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref<string[]>()
</script>
```
```

--------------------------------

### Element Plus Slider: Restricting Values with Marks

Source: https://element-plus.org/en-US/component/slider

Demonstrates how to restrict slider values to specific marks using `step="mark"`. This example shows multiple sliders: a vertical range slider with temperature marks, a horizontal slider with distance marks, and another horizontal range slider with numerical marks.

```vue
<template>
  <div class="slider-demo-block">
    <el-slider
      v-model="value1"
      vertical
      height="200px"
      :marks="marks1"
      placement="right"
      :format-tooltip="(v) => `${v}°C`"
      step="mark"
    />
  </div>
  <div class="slider-demo-block">
    <el-slider v-model="value2" :marks="marks2" step="mark" />
  </div>
  <div class="slider-demo-block">
    <el-slider v-model="value3" range :marks="marks3" step="mark" />
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'

import type { CSSProperties } from 'vue'

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const value1 = ref(37)
const marks1 = shallowReactive<Marks>({
  0: '0°C',
  37: '37°C',
  100: '100°C',
})

const value2 = ref(50)
const marks2 = shallowReactive<Marks>({
  0: '0cm',
  10: '10cm',
  25: '25cm',
  50: '50cm',
  75: '75cm',
  100: '100cm',
})
const value3 = ref([13, 42])
const marks3 = shallowReactive<Marks>({
  0: '0',
  13: '13',
  42: '42',
  58: '58',
  89: '89',
  100: '100',
})
</script>

<style scoped>
.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block + .slider-demo-block {
  margin-top: 20px;
}
</style>
```

--------------------------------

### i18n Configurations

Source: https://element-plus.org/en-US/component/config-provider

Configure i18n related properties via Config Provider for language switching.

```APIDOC
## i18n Configurations 

Configure i18n related properties via Config Provider, to get language switching feature. Use two attributes to provide i18n related config.

### Method
N/A (Component Usage)

### Endpoint
N/A (Component Usage)

### Parameters
#### Request Body
- **locale** (Object) - Required - The locale object for the current language.

### Request Example
```vue
<template>
  <div>
    <el-button mb-2 @click="toggle">Switch Language</el-button>
    <br />

    <el-config-provider :locale="locale">
      <el-table mb-1 :data="[]" />
      <el-pagination :total="100" />
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}
</script>
```

### Response
#### Success Response (200)
N/A (Component Usage)

#### Response Example
N/A (Component Usage)
```

--------------------------------

### Align Center Dialog

Source: https://element-plus.org/en-US/component/dialog

Demonstrates how to center the dialog both horizontally and vertically on the screen using the `align-center` prop.

```APIDOC
## Align Center dialog 

Open dialog from the center of the screen. Setting `align-center` to `true` will center the dialog both horizontally and vertically. The prop `top` will not work at the same time because the dialog is vertically centered in a flexbox.

### Code Example

```vue
<template>
  <el-button plain @click="centerDialogVisible = true">
    Click to open the Dialog
  </el-button>

  <el-dialog
    v-model="centerDialogVisible"
    title="Warning"
    width="500"
    align-center
  >
    <span>Open the dialog from the center from the screen</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const centerDialogVisible = ref(false)
</script>
```
```

--------------------------------

### Element Plus Cascader: Click and Hover Expansion (Vue)

Source: https://element-plus.org/en-US/component/cascader

This snippet showcases two ways to use the Element Plus Cascader component in Vue. The first example uses the default click-to-expand behavior, while the second configures the `expandTrigger` prop to expand child options on hover. It includes template and script sections for a complete Vue component.

```vue
<template>
  <div class="m-4">
    <p>Child options expand when clicked (default)</p>
    <el-cascader v-model="value" :options="options" @change="handleChange" />
  </div>
  <div class="m-4">
    <p>Child options expand when hovered</p>
    <el-cascader
      v-model="value"
      :options="options"
      :props="props"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([])

const props = {
  expandTrigger: 'hover' as const,
}

const handleChange = (value) => {
  console.log(value)
}

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
          {
            value: 'checkbox',
            label: 'Checkbox',
          },
          {
            value: 'input',
            label: 'Input',
          },
          {
            value: 'input-number',
            label: 'InputNumber',
          },
          {
            value: 'select',
            label: 'Select',
          },
          {
            value: 'cascader',
            label: 'Cascader',
          },
          {
            value: 'switch',
            label: 'Switch',
          },
          {
            value: 'slider',
            label: 'Slider',
          },
          {
            value: 'time-picker',
            label: 'TimePicker',
          },
          {
            value: 'date-picker',
            label: 'DatePicker',
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker',
          },
          {
            value: 'upload',
            label: 'Upload',
          },
          {
            value: 'rate',
            label: 'Rate',
          },
          {
            value: 'form',
            label: 'Form',
          },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table',
          },
          {
            value: 'tag',
            label: 'Tag',
          },
          {
            value: 'progress',
            label: 'Progress',
          },
          {
            value: 'tree',
            label: 'Tree',
          },
          {
            value: 'pagination',
            label: 'Pagination',
          },
          {
            value: 'badge',
            label: 'Badge',
          },
        ],
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert',
          },
          {
            value: 'loading',
            label: 'Loading',
          },
          {
            value: 'message',
            label: 'Message',
          },
          {
            value: 'message-box',
            label: 'MessageBox',
          },
          {
            value: 'notification',
            label: 'Notification',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          }
        ]
      }
    ]
  }
]
</script>
```

--------------------------------

### Component API: el-color-picker-panel

Source: https://element-plus.org/en-US/component/color-picker-panel

Detailed API reference for the el-color-picker-panel component attributes and configuration.

```APIDOC
## Component: el-color-picker-panel

### Description
The ColorPickerPanel is the core component used for selecting colors within the Element Plus framework.

### Attributes
- **model-value / v-model** (string) - Required - Binding value for the selected color.
- **border** (boolean) - Optional - Whether the panel has a border (Default: true).
- **disabled** (boolean) - Optional - Whether the color picker is disabled (Default: false).
- **show-alpha** (boolean) - Optional - Whether to display the alpha slider (Default: false).
- **color-format** (enum) - Optional - The color format for the v-model.
- **predefine** (array) - Optional - List of predefined color options.
- **validate-event** (boolean) - Optional - Whether to trigger form validation (Default: true).
- **hue-slider-class** (object) - Optional - Custom class names for the hue slider.
- **hue-slider-style** (string/object) - Optional - Custom styles for the hue slider.

### Slots
- **footer** - Content to append after the input area.

### Exposes
- **color** (object) - The current color object instance.
- **inputRef** (object) - Reference to the custom input element.
- **update** (Function) - Method to manually update sub-components.
```

--------------------------------

### Customize Collapse Expand Icon Position with Vue

Source: https://element-plus.org/en-US/component/collapse

This snippet shows how to dynamically change the expand icon's position in an Element Plus Collapse component using a Vue.js setup. It utilizes `el-switch` to toggle between 'left' and 'right' positions, controlled by a ref variable. The `expand-icon-position` attribute on the `el-collapse` component accepts 'left' or 'right' as values.

```vue
<template>
  <div class="demo-collapse-position">
    <div class="flex items-center mb-4">
      <span class="mr-4">expand icon position: </span>
      <el-switch
        v-model="position"
        inactive-value="left"
        active-value="right"
        inactive-text="left"
        active-text="right"
        style="--el-switch-off-color: #88b8fe"
      />
    </div>

    <el-collapse :expand-icon-position="position">
      <el-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { CollapseIconPositionType } from 'element-plus'

const position = ref<CollapseIconPositionType>('left')
</script>
```

--------------------------------

### Toggle Skeleton Loading with Throttle

Source: https://element-plus.org/en-US/component/skeleton

Demonstrates how to use the `el-skeleton` component with throttle options to control the loading state and smooth transitions. The `throttle` attribute is configured with `leading`, `trailing`, and `initVal` to manage the display delay and initial state.

```vue
<template>
  <el-space direction="vertical" alignment="flex-start">
    <div>
      <label style="margin-right: 16px">Switch Loading</label>
      <el-switch v-model="loading" />
    </div>
    <el-skeleton
      style="width: 240px"
      :loading="loading"
      animated
      :throttle="{ leading: 500, trailing: 500, initVal: true }"
    >
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 265px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom card-header">
              <div class="time">{{ currentDate }}</div>
              <el-button text class="button">operation button</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </el-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(false)
const currentDate = new Date().toDateString()
</script>

```

--------------------------------

### Configure Modal-less Drawer with Penetrable Overlay

Source: https://element-plus.org/en-US/component/drawer

Configures a drawer without a modal overlay using the modal attribute and enables interaction through the overlay using modal-penetrable.

```vue
<template>
  <el-button plain @click="drawerVisible = true">
    Open the modal Drawer
  </el-button>

  <el-drawer v-model="drawerVisible" :modal="false" modal-penetrable>
    <span>It's a modal Drawer</span>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="drawerVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawerVisible = ref(false)
</script>
```

--------------------------------

### Implement Cross Hovering in Element Plus Table V2

Source: https://element-plus.org/en-US/component/table-v2

Use el-auto-resizer to get table dimensions and el-table-v2 for rendering. The cellProps function is crucial for attaching mouse event listeners to each cell to manage the hovering effect. The kls ref stores the class name for the currently hovered column, which is then used in CSS to apply the background color.

```vue
<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :cell-props="cellProps"
          :class="kls"
          :data="data"
          :width="width"
          :height="height"
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(10)
columns.unshift({
  key: 'column-n-1',
  width: 50,
  title: 'Row No.',
  cellRenderer: ({ rowIndex }) => `${rowIndex + 1}`,
  align: 'center',
})
const data = generateData(columns, 200)

const cellProps = ({ columnIndex }) => {
  const key = `hovering-col-${columnIndex}`
  return {
    ['data-key']: key,
    onMouseenter: () => {
      kls.value = key
    },
    onMouseleave: () => {
      kls.value = ''
    },
  }
}

const kls = ref<string>('')
</script>

<style>
.hovering-col-0 [data-key='hovering-col-0'],
.hovering-col-1 [data-key='hovering-col-1'],
.hovering-col-2 [data-key='hovering-col-2'],
.hovering-col-3 [data-key='hovering-col-3'],
.hovering-col-4 [data-key='hovering-col-4'],
.hovering-col-5 [data-key='hovering-col-5'],
.hovering-col-6 [data-key='hovering-col-6'],
.hovering-col-7 [data-key='hovering-col-7'],
.hovering-col-8 [data-key='hovering-col-8'],
.hovering-col-9 [data-key='hovering-col-9'],
.hovering-col-10 [data-key='hovering-col-10'] {
  background: var(--el-table-row-hover-bg-color);
}

[data-key='hovering-col-0'] {
  font-weight: bold;
  user-select: none;
  pointer-events: none;
}
</style>
```

--------------------------------

### SplitterPanel Component API

Source: https://element-plus.org/en-US/component/splitter

Configuration and event documentation for individual el-splitter-panel components.

```APIDOC
## SplitterPanel Attributes

- **size / v-model:size** (string/number) - Optional - Size of the panel
- **min** (string/number) - Optional - Minimum size of the panel
- **max** (string/number) - Optional - Maximum size of the panel
- **resizable** (boolean) - Optional - Whether the panel can be resized (default: true)
- **collapsible** (boolean) - Optional - Whether the panel can be collapsed (default: false)

## SplitterPanel Events

- **update:size** (Function) - Triggered when panel size changes

## SplitterPanel Slots

- **default** - Default content of the panel
- **start-collapsible** - Custom content for the start collapsible button
- **end-collapsible** - Custom content for the end collapsible button
```