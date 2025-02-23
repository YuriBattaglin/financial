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

const addColumn = async () => {
    if (newColumn.value.title) {
        columns.value.push({
            title: newColumn.value.title,
            color: newColumn.value.color,
            tasks: []
        });

        saveToLocalStorage();

        // Espera a reatividade e DOM serem atualizados antes de inicializar o Sortable
        await nextTick();

        // Após adicionar a coluna, inicialize o Sortable nela
        initializeSortable(columns.value.length - 1);

        newColumn.value = { title: '', color: 'primary' };
        newColumnDialog.value = false;
    }
};

// Função para inicializar o Sortable para uma coluna
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

                console.log(columns.value);
                saveToLocalStorage();
            }
        });
    }
};

onMounted(() => {
    // Inicializa o Sortable para as colunas existentes assim que a página for carregada
    columns.value.forEach((column, index) => {
        initializeSortable(index); // Inicializa o sortable para as colunas existentes
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
                <v-btn  text @click="dialog = false">Cancel</v-btn>
                <v-btn color="success" text @click="saveTask">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="newColumnDialog" max-width="500px">
        <v-card>
            <v-card-title>Add new status</v-card-title>
            <v-card-text>
                <v-text-field v-model="newColumn.title" label="Name"></v-text-field>

                <div class="d-flex flex-wrap justify-center">
                <v-btn 
                    icon 
                    v-for="color in availableColors" 
                    :key="color" 
                    :color="color" 
                    class="ma-2" 
                    variant="elevated" 
                    @click="selectColor(color)" 
                    :size="newColumn.color === color ? 36 : 32"
                    :style="{ minWidth: '36px', minHeight: '36px' }"
                ></v-btn>
            </div>
        </v-card-text>

        <v-card-actions>
            <!-- Ajuste para os botões de ações -->
            <v-btn  text @click="newColumnDialog = false">Cancel</v-btn>
            <v-btn color="success" text @click="addColumn">Add</v-btn>
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
