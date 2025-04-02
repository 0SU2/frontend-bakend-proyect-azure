<template>
    <patients-all/>
</template>

<script>
import patientsAll from '@/components/patients/patientsAll.vue'
export default {
    comments: {
        patientsAll
    }, 
    layout: 'principal',
    middleware: 'auth'
    
}
</script>

<style scoped>

</style>