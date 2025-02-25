<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Sortable } from 'sortablejs';

useHead({
    title: "Tasks - Financial Controller",
});

definePageMeta({
    middleware: 'auth',
});

const dialog = ref(false);
const selectedTask = ref({ id: '', name: '', description: '', columnIndex: 0 });
const modalTitle = ref('');
const newColumnForm = ref(null);
const newTaskForm = ref(null);
const selectedColumn = ref({ id: '', title: '', color: 'primary' });

const loadStoredData = () => {
    const storedData = localStorage.getItem('taskColumns');
    return storedData ? JSON.parse(storedData) : [];
};

const columns = ref(loadStoredData());

const saveToLocalStorage = () => {
    console.log(columns.value);
    localStorage.setItem('taskColumns', JSON.stringify(columns.value));
};

const editTask = (task: { id: string; name: string, description: string }, columnIndex: number) => {
    selectedTask.value = { ...task, columnIndex };
    dialog.value = true;
    modalTitle.value = 'Edit task';
};

const deleteDialog = ref(false);
const columnToDeleteIndex = ref(null);

const openDeleteDialog = (index) => {
    columnToDeleteIndex.value = index;
    deleteDialog.value = true;
};

const editStatus = (index: number) => {
    selectedColumn.value = { ...columns.value[index] };
    newColumnDialog.value = true;
    modalTitle.value = 'Edit Status';
};

const moveStatusRight = (index: number) => {
    if (index < columns.value.length - 1) {
        const column = columns.value.splice(index, 1)[0];
        columns.value.splice(index + 1, 0, column); 
        saveToLocalStorage();
    }
};

const moveStatusLeft = (index: number) => {
    if (index > 0) {
        const column = columns.value.splice(index, 1)[0]; 
        columns.value.splice(index - 1, 0, column); 
        saveToLocalStorage();
    }
};

const cancelDelete = () => {
    deleteDialog.value = false;
    columnToDeleteIndex.value = null;
};

const cancelEdit = () => {
    newColumnDialog.value = false;
    selectedColumn.value = { id: '', title: '', color: 'primary' };
};

const deleteStatus = () => {
    if (columnToDeleteIndex.value !== null) {
        columns.value.splice(columnToDeleteIndex.value, 1);
        saveToLocalStorage();
    }
    cancelDelete();
};

const deleteTask = () => {
    const column = columns.value[selectedTask.value.columnIndex];
    column.tasks = column.tasks.filter(t => t.id !== selectedTask.value.id);
    saveToLocalStorage();
    dialog.value = false;
};

const saveTask = async () => {
    const { valid } = await newTaskForm.value.validate();
    if (!valid) return;
    const { id, name, description, columnIndex } = selectedTask.value;

    for (const column of columns.value) {
        column.tasks = column.tasks.filter(task => task.id !== id);
    }
    columns.value[columnIndex].tasks.push({ id, name, description });

    saveToLocalStorage();

    dialog.value = false;
};

const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const newTask = (columnIndex: number) => {
    selectedTask.value = { id: generateUniqueId(), name: '', description: '', columnIndex };
    dialog.value = true;
    modalTitle.value = 'New task';
};


const newStatus = () => {
    selectedColumn.value = {id: '', title: '', color: 'primary' };
    newColumnDialog.value = true;
    modalTitle.value = 'New Status';
};

const newColumnDialog = ref(false);

const availableColors = ['primary', 'success', 'warning', 'info', 'error', 'secondary', 'accent'];

const selectColor = (color: string) => {
    selectedColumn.value.color = color;
};

const newStatusRules = (value) => {
    if (!value) return 'Name is required!';
    return true;
};
const newTaskRules = (value) => {
    if (!value) return 'Name is required!';
    return true;
};


const saveStatus = async () => {
    const { valid } = await newColumnForm.value.validate();
    if (!valid) return;

    const index = columns.value.findIndex(col => col.id === selectedColumn.value.id);

    if (index !== -1) {
        columns.value[index] = { ...selectedColumn.value };
    } else {
        columns.value.push({
            id: generateUniqueId(),
            title: selectedColumn.value.title,
            color: selectedColumn.value.color,
            tasks: []
        });
    }

    saveToLocalStorage();
    await nextTick();

    if (index === -1) {
        initializeSortable(columns.value.length - 1);
    }

    newColumnDialog.value = false;
};

const initializeSortable = (index: number) => {
    const el = document.getElementById(`column-${index}`);
    if (el) {
        new Sortable(el, {
            group: 'tasks',
            animation: 200,
            onEnd(evt) {
                const movedTask = columns.value[index].tasks.splice(evt.oldIndex, 1)[0];
                const sourceColumnIndex = index;
                const targetColumnIndex = parseInt(evt.to.id.replace('column-', ''));

                if (sourceColumnIndex !== targetColumnIndex) {
                    const sourceColumn = columns.value[sourceColumnIndex];
                    sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== movedTask.id);

                    const targetColumn = columns.value[targetColumnIndex];
                    targetColumn.tasks.splice(evt.newIndex, 0, movedTask);
                } else {
                    columns.value[sourceColumnIndex].tasks.splice(evt.newIndex, 0, movedTask);
                }

                saveToLocalStorage();
            }
        });
    }
};

onMounted(() => {
    columns.value.forEach((column, index) => {
        initializeSortable(index);
    });
});

</script>

<template>
    <h4 class="text-h4 mb-6">Tasks Kanban</h4>
    <v-row class="d-flex flex-nowrap overflow-x-auto">
        <v-col v-for="(column, index) in columns" :key="index" cols="8" md="3" class="d-flex">
            <v-card :color="column.color" variant="tonal" class="pa-3 task-list" elevation="3">

                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="title-ellipsis">{{ column.title }}</span>

                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon v-bind="props">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="newTask(index)">
                                <v-list-item-title>
                                    <v-icon left>mdi-plus</v-icon> Add Task
                                </v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title>Move Status</v-list-item-title>
                                <template v-slot:append>
                                    <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
                                </template>

                                <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
                                    <v-list>
                                        <v-list-item @click="moveStatusRight(index)">
                                            <v-list-item-title>Right <v-icon
                                                    right>mdi-arrow-right</v-icon></v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="moveStatusLeft(index)">
                                            <v-list-item-title><v-icon left>mdi-arrow-left</v-icon>
                                                Left</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title>Edit Status</v-list-item-title>
                                <template v-slot:append>
                                    <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
                                </template>

                                <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
                                    <v-list>
                                        <v-list-item @click="editStatus(index)">
                                            <v-list-item-title><v-icon right>mdi-pencil</v-icon>
                                                Edit</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="openDeleteDialog(index)">
                                            <v-list-item-title><v-icon left>mdi-trash-can-outline</v-icon>
                                                Delete</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-card-title>

                <div :id="'column-' + index" class="d-flex flex-wrap justify-center"
                    :style="{ minHeight: column.tasks.length === 0 ? '60vh' : 'auto' }">
                    <v-col v-for="task in column.tasks" :key="task?.id" cols="12">
                        <v-card style="cursor: all-scroll;" class="task-card pa-2" elevation="2">
                            <v-card-title>
                                <span class="editable-text h6" @click="editTask(task, index)">
                                    {{ task?.name }}
                                </span>
                            </v-card-title>
                            <v-card-text>
                                <span class="title-ellipsis-3 text-subtitle-1 text-muted editable-text"
                                    @click="editTask(task, index)">
                                    {{ task?.description }}
                                </span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </div>

            </v-card>
        </v-col>

        <v-col cols="8" md="3" class="d-flex">
            <v-card color="dark" variant="plain" class="pa-3 border text-center task-list" elevation="3"
                @click="newStatus">
                <v-card-title>
                    Add new status
                </v-card-title>
                <v-card-text>
                    <v-icon size="64">mdi-plus</v-icon>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-form ref="newTaskForm">
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>{{ modalTitle }}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="selectedTask.name" label="Name" :rules="[newTaskRules]"
                        required></v-text-field>
                    <v-textarea label="Description" v-model="selectedTask.description" rows="4" outlined
                        maxlength="100"></v-textarea>
                    <v-select v-model="selectedTask.columnIndex"
                        :items="columns.map((col, index) => ({ title: col.title, value: index }))"
                        label="Status"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="dialog = false">Cancel</v-btn>
                    <v-btn v-if="modalTitle === 'Edit task'" text color="error" @click="deleteTask">Delete</v-btn>
                    <v-btn color="success" text @click="saveTask">{{ modalTitle === 'Edit task' ? 'Save' :
                        'Add' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>

    <v-form ref="newColumnForm">

        <v-dialog v-model="newColumnDialog" max-width="500px">
            <v-card>
                <v-card-title>{{ modalTitle }}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="selectedColumn.title" :rules="[newStatusRules]" required
                        label="Name"></v-text-field>

                    <div class="d-flex flex-wrap justify-center">
                        <v-btn icon v-for="color in availableColors" :key="color" :color="color" class="ma-2"
                            variant="elevated" @click="selectColor(color)"
                            :size="selectedColumn.color === color ? 40 : 32"
                            :style="{ minWidth: '36px', minHeight: '36px' }"></v-btn>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn text @click="cancelEdit">Cancel</v-btn>
                    <v-btn color="success" text @click="saveStatus">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>

    <v-dialog v-model="deleteDialog" max-width="400px">q
        <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>
                Are you sure you want to delete this status?
            </v-card-text>
            <v-card-actions>
                <v-btn color="grey" text @click="cancelDelete">Cancel</v-btn>
                <v-btn color="error" text @click="deleteStatus">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<style scoped>
.task-list {
    min-height: 80vh;
    padding: 10px;
    border-radius: 8px;
}

.task-card {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.editable-text {
    cursor: pointer;
    user-select: none;
    transition: text-decoration 0.2s ease-in-out;
}

.editable-text:hover {
    text-decoration: underline;
}

.title-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
}

.title-ellipsis-3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
}
</style>
