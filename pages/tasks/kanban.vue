<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sortable } from 'sortablejs';
import UiParentCard from '~/components/shared/UiParentCard.vue';

useHead({
    title: "Tasks - Financial Controller",
});

definePageMeta({
    middleware: 'auth',
});

// Estrutura inicial das colunas do Kanban
const columns = ref([
    { title: 'To Do', color: 'warning', tasks: [{ id: 1, name: 'Criar estrutura do projeto' }, { id: 2, name: 'Definir escopo' }] },
    { title: 'In Progress', color: 'primary', tasks: [{ id: 3, name: 'Desenvolver API' }] },
    { title: 'Done', color: 'success', tasks: [{ id: 4, name: 'Setup do ambiente' }] }
]);

// Inicializa o sortablejs nas colunas
onMounted(() => {
    columns.value.forEach((column, index) => {
        const el = document.getElementById(`column-${index}`);
        if (el) {
            new Sortable(el, {
                group: 'tasks', 
                animation: 200,
                onEnd(evt) {
                    const movedTask = column.tasks.splice(evt.oldIndex, 1)[0];
                    column.tasks.splice(evt.newIndex, 0, movedTask);
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
                <v-card-title>
                    {{ column.title }}
                </v-card-title>
                <v-divider></v-divider>

                <div :id="'column-' + index" class="task-list">
                    <v-card v-for="task in column.tasks" :key="task.id" class="task-card ma-2 pa-3" elevation="2">
                        <v-card-text>{{ task.name }}</v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-col>
    </v-row>
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
    cursor: grab
}

.task-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
