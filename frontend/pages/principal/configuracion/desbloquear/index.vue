<template>
    <v-container>
        <h1 class="text-h4 mb-4">
            Desbloquear Usuarios
        </h1>
        <!-- Tabla de Usuarios Bloqueados -->
        <v-data-table
            :headers="headers"
            :items="usuariosBloqueados"
            :items-per-page="10"
            class="mt-4"
            dense
        >
            <template #[`item.acciones`]="{ item }">
                <v-btn
                    small
                    color="success"
                    title="Desbloquear"
                    @click="desbloquearUsuario(item.id)"
                >
                    <v-icon left>
                        mdi-account-check
                    </v-icon>
                    Desbloquear
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
export default {
    layout: 'principal',
    middleware: 'auth',
    data() {
        return {
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'A. Paterno', value: 'apaterno' },
                { text: 'A. Materno', value: 'amaterno' },
                { text: 'Usuario', value: 'usuario' },
                { text: 'Intentos', value: 'intentos' },
                { text: 'Acciones', value: 'acciones', sortable: false }
            ],
            usuariosBloqueados: []
        };
    },
    mounted() {
        this.fetchUsuariosBloqueados();
    },
    methods: {
        async fetchUsuariosBloqueados() {
            try {
                const response = await this.$axios.get('/users');
                this.usuariosBloqueados = response.data.filter(user => user.bloqueado);
            } catch (error) {
                const errorMessage = error.message || 'Error al obtener usuarios';
                this.$store.dispatch('alert/triggerAlert', {
                    message: errorMessage,
                    type: 'error'
                });
            }
        },
        async desbloquearUsuario(id) {
            try {
                await this.$axios.post(`/users/unlock/${id}`);
                this.fetchUsuariosBloqueados();
                this.$store.dispatch('alert/triggerAlert', {
                    message: 'Usuario desbloqueado con éxito',
                    type: 'success'
                });
            } catch (error) {
                const errorMessage = error.message || 'Error al desbloquear Usuario';
                this.$store.dispatch('alert/triggerAlert', {
                    message: errorMessage,
                    type: 'error'
                });
            }
        }
    }
};
</script>

<style scoped>
</style>