<template>
    <div>
        <Pie
            :data="PieChartData"
            :options="PieChartOptions"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const loaded = ref(false);
const PieChartData = ref({ labels: [], datasets: [] });
const PieChartOptions = ref({
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'NYC State Test: Proficiency Distribution' },
    },
});

async function fetchData() {
    try {
        const response = await fetch('https://data.cityofnewyork.us/resource/74kb-55u9.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
</script>

<style scoped>

</style>