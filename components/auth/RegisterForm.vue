<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref();
const name = ref('');
const email = ref('');
const password = ref('');
const emailError = ref('');

const nameRules = (value: string) => {
    if (!value) return 'Name is required!';
    if (value.length < 3) return 'Name must be at least 3 characters long!';
    if (value.length > 25) return 'Name must be at most 25 characters long!';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) return 'Name must contain only letters and spaces!';
    return true;
};

const emailRules = (value: string) => {
    emailError.value = '';
    if (!value) return 'Email is required!';
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Invalid email!';
    return true;
};

const passwordRules = (value: string) => {
    if (!value) return 'Password is required!';
    if (value.length < 8) return 'Password must be at least 8 characters long!';
    if (value.length > 24) return 'Password must be at most 24 characters long!';
    return true;
};

const generateUniqueId = () => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const saveUser = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some(user => user.email === email.value);

    if (userExists) {
        emailError.value = 'User with this email already exists!';  
        return; 
    }

    emailError.value = '';

    users.push({
        id: generateUniqueId(),
        name: name.value,
        email: email.value,
        password: password.value
    });

    localStorage.setItem('users', JSON.stringify(users));
    
    router.push('/auth/login');
};

const validateAndSubmit = async () => {
    if (!formRef.value) return;
    const { valid } = await formRef.value.validate();
    if (valid) {
        saveUser(); 
    }
};
</script>

<template>
    <v-form ref="formRef" @submit.prevent="validateAndSubmit" @keypress.enter="validateAndSubmit">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-bold ">Name</v-label>
                <v-text-field v-model="name" variant="outlined" color="success"
                    :rules="[nameRules]"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold ">Email Address</v-label>
                <v-text-field v-model="email" variant="outlined" type="email" color="success"
                    :rules="[emailRules]"></v-text-field>
                <v-label v-if="emailError" class="font-weight-bold text-error">{{ emailError }}</v-label>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold ">Password</v-label>
                <v-text-field v-model="password" variant="outlined" type="password" color="success"
                    :rules="[passwordRules]"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-btn type="submit" color="black" variant="outlined" size="large" block flat>
                    Sign up
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
