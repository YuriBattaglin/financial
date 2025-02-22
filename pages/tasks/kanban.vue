<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sortable } from 'sortablejs';

useHead({
    title: "Tasks - Financial Controller",
});

definePageMeta({
    middleware: 'auth',
});

const dialog = ref(false);
const selectedTask = ref({ id: '', name: '', columnIndex: 0 });
const modalTitle = ref('');

const loadStoredData = () => {
    const storedData = localStorage.getItem('taskColumns');
    return storedData ? JSON.parse(storedData) : [];
};

const columns = ref(loadStoredData());

const saveToLocalStorage = () => {
    console.log(columns.value);
    localStorage.setItem('taskColumns', JSON.stringify(columns.value));
};

const editTask = (task: { id: string; name: string }, columnIndex: number) => {
    selectedTask.value = { ...task, columnIndex };
    dialog.value = true;
    modalTitle.value = 'Edit task';
};

const saveTask = () => {
    if (selectedTask.value) {
        const { id, name, columnIndex } = selectedTask.value;

        for (const column of columns.value) {
            column.tasks = column.tasks.filter(task => task.id !== id);
        }
        columns.value[columnIndex].tasks.push({ id, name });

        saveToLocalStorage();
    }

    dialog.value = false;
};

const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const newTask = (columnIndex: number) => {
    selectedTask.value = { id: generateUniqueId(), name: '', columnIndex };
    dialog.value = true;
    modalTitle.value = 'New task';
};

const newColumnDialog = ref(false);
const newColumn = ref({ title: '', color: 'primary' });

const availableColors = ['primary', 'success', 'warning', 'info', 'error', 'secondary', 'accent'];

const selectColor = (color: string) => {
    newColumn.value.color = color;
};

const addColumn = () => {
    if (newColumn.value.title) {
        columns.value.push({
            title: newColumn.value.title,
            color: newColumn.value.color,
            tasks: []
        });

        saveToLocalStorage();

        newColumn.value = { title: '', color: 'primary' };
        newColumnDialog.value = false;
    }
};

onMounted(() => {
    columns.value.forEach((column, index) => {
        const el = document.getElementById(`column-${index}`);
        if (el) {
            new Sortable(el, {
                group: 'tasks',
                animation: 200,
                onEnd(evt) {
                    const movedTask = column.tasks.splice(evt.oldIndex, 1)[0];

                    // Identificar a coluna de origem e destino
                    const sourceColumnIndex = index;
                    const targetColumnIndex = parseInt(evt.to.id.replace('column-', ''));

                    if (sourceColumnIndex !== targetColumnIndex) {
                        // Remover a tarefa da coluna de origem
                        const sourceColumn = columns.value[sourceColumnIndex];
                        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== movedTask.id);

                        // Adicionar a tarefa à coluna de destino
                        const targetColumn = columns.value[targetColumnIndex];
                        targetColumn.tasks.splice(evt.newIndex, 0, movedTask);
                    } else {
                        // Caso contrário, só movemos a tarefa dentro da mesma coluna
                        column.tasks.splice(evt.newIndex, 0, movedTask);
                    }

                    console.log(columns.value);
                    saveToLocalStorage(); // Salvar dados após mover a tarefa
                }
            });
        }
    });
});

</script>
<template>
    <h4 class="text-h4 mb-6">Tasks Kanban</h4>
    <v-row>
        <v-col v-for="(column, index) in columns" :key="index" cols="12" md="4">
            <v-card :color="column.color" variant="tonal" class="pa-3" elevation="3">
                <v-card-title class="text-center">
                    {{ column.title }}
                </v-card-title>

                <div :id="'column-' + index" class="task-list d-flex flex-wrap justify-center">
                    <v-col v-for="task in column.tasks" :key="task?.id" cols="12">
                        <v-card style="cursor: grab;" class="task-card pa-3" elevation="2">
                            <v-card-text>
                                <span class="editable-text" @click="editTask(task, index)">{{ task?.name }}</span>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </div>

                <v-card class="d-flex justify-center" @click="newTask(index)">
                        <v-icon size="50">mdi-plus</v-icon>
                </v-card>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card color="dark " variant="plain" class="pa-3 border text-center task-list" elevation="3"
                @click="newColumnDialog = true">
                <v-card-title>
                    Add new status
                </v-card-title>
                <v-card-text>
                    <v-icon size="64">mdi-plus</v-icon>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>{{ modalTitle }}</v-card-title>
            <v-card-text>
                <v-text-field v-model="selectedTask.name" label="Name"></v-text-field>
                <v-select v-model="selectedTask.columnIndex"
                    :items="columns.map((col, index) => ({ title: col.title, value: index }))"
                    label="Status"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="green" text @click="saveTask">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="newColumnDialog" max-width="500px">
        <v-card>
            <v-card-title>Add new status</v-card-title>
            <v-card-text>
                <v-text-field v-model="newColumn.title" label="Name"></v-text-field>
                <div class="d-flex">
                    <v-btn icon v-for="color in availableColors" :key="color" :color="color" class="ma-2"
                        variant="elevated" @click="selectColor(color)" :size="newColumn.color === color ? 36 : 32">
                    </v-btn>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" text @click="newColumnDialog = false">Cancel</v-btn>
                <v-btn color="green" text @click="addColumn">Add</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.task-list {
    min-height: 130px;
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
</style>
