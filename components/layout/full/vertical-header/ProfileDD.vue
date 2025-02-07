<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { logout } = useAuth();

const loggedUser = process.client
  ? JSON.parse(localStorage.getItem('loggedUser') || 'null')
  : null;
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- User DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-label>{{ loggedUser.name || 'User' }}</v-label>
            <v-btn class="profileBtn custom-hover-success" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img 
                :src="['yuribattaglin@hotmail.com', 'yurinunesbatt@gmail.com', 'yuri@bruningsistemas.com.br'].includes(loggedUser.email) ? '/images/users/avatar-2.jpg' : '/images/users/avatar-1.jpg'" 
                height="35" 
                alt="user" 
            />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
                <v-list-item value="item1" active-color="success" >
                    <template v-slot:prepend>
                        <UserIcon stroke-width="1.5" size="20"/>
                    </template>
                    <v-list-item-title class="pl-4 text-body-1">My Profile (Soon)</v-list-item-title>
                </v-list-item>
                <v-list-item value="item3" active-color="success"> 
                    <template v-slot:prepend>
                        <ListCheckIcon stroke-width="1.5"  size="20"/>
                    </template>
                    <v-list-item-title class="pl-4 text-body-1">My Task (Soon)</v-list-item-title>
                </v-list-item> 
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn @click="logout" color="dark" variant="outlined" block>Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
