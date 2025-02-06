<script setup>
import { ref } from 'vue';
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
const isExpanded = ref(false);
</script>

<template>
    <v-list-group v-if="item.children && item.children.length" v-model="isExpanded">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" rounded class="mb-1"  
                :disabled="item.disabled"  :target="item.type === 'external' ? '_blank' : ''">
                <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </template>

            <template v-for="(child, index) in item.children" :key="index">
                <v-list-item :to="child.to" rounded class="mb-1"  :disabled="child.disabled"
                    :target="child.type === 'external' ? '_blank' : ''">
                    <template v-slot:prepend>
                        <Icon :item="child.icon" :level="level + 1" />
                    </template>
                    <v-list-item-title>{{ child.title }}</v-list-item-title>
                    <v-list-item-subtitle v-if="child.subCaption" class="text-caption mt-n1 hide-menu">
                        {{ child.subCaption }}
                    </v-list-item-subtitle>
                    <template v-slot:append v-if="child.chip">
                        <v-chip :color="child.chipColor" class="sidebarchip hide-menu" size="small"
                            :variant="child.chipVariant" :prepend-icon="child.chipIcon">
                            {{ child.chip }}
                        </v-chip>
                    </template>
                </v-list-item>
            </template>
    </v-list-group>

    <v-list-item v-else :to="item.to" rounded class="mb-1"  :disabled="item.disabled"
        :target="item.type === 'external' ? '_blank' : ''">
        <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        <template v-slot:append v-if="item.chip">
            <v-chip :color="item.chipColor" class="sidebarchip hide-menu" size="small" :variant="item.chipVariant"
                :prepend-icon="item.chipIcon">
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>
</template>
