<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const checkbox = ref(true);
const email = ref('');
const formRef = ref();
const password = ref('');
const loginError = ref(''); 

const emailRules = (value: string) => {
    loginError.value = '';
    if (!value) return 'Email is required!';
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Invalid email!';
    return true;
};

const passwordRules = (value: string) => {
    loginError.value = '';
    if (!value) return 'Password is required!';
    if (value.length < 8) return 'Password must be at least 8 characters long!';
    if (value.length > 24) return 'Password must be at most 24 characters long!';
    return true;
};

const validateAndSubmit = async () => {
    if (!formRef.value) return;
    const { valid } = await formRef.value.validate();
    if (valid) {
        loginError.value = ''; 

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const user = users.find((user: any) => user.email === email.value);

        if (user && user.password === password.value) {
            const expirationTime = Date.now() + 60 * 60 * 1000; 
            const loggedUser = { ...user, expirationTime };

            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

            router.push('/dashboard'); 
        } else {
            loginError.value = 'Invalid email or password!'; 
        }
    }
};
</script>

<template>
    <v-form ref="formRef" @submit.prevent="validateAndSubmit" @keypress.enter="validateAndSubmit">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Email</v-label>
                <v-text-field v-model="email" variant="outlined" color="success" :rules="[emailRules]"
                    type="email"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Password</v-label>
                <v-text-field v-model="password" variant="outlined" type="password" color="success"
                    :rules="[passwordRules]"></v-text-field>
                <v-label v-if="loginError" class="font-weight-bold mb-1 text-error">{{ loginError }}</v-label>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="d-flex flex-wrap align-center ml-n2">
                    <v-checkbox v-model="checkbox" color="success">
                        <template v-slot:label>Remember this Device</template>
                    </v-checkbox>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <v-btn type="submit" color="dark" variant="outlined" size="large" block flat>Sign
                    in</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
