<template>
  <div class="container">
    <h2>NYC State Test Data - Proficiency Distribution</h2>
    <div class="controls">
      <label for="grade-select">Select Grade:</label>
      <select id="grade-select" v-model="selectedGrade">
        <option v-for="grade in availableGrades" :key="grade" :value="grade">{{ grade }}</option>
      </select>
      <div class="navigation">
        <RouterLink to="/">Line Chart</RouterLink> |
        <RouterLink to="/PieChart">Pie Chart</RouterLink>
      </div>
    </div>
    <div class="chart-container" v-if="loaded">
      <Pie :data="PieChartData" :options="PieChartOptions" />
    </div>
    <div v-else class="loading">Loading data...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { RouterLink } from 'vue-router';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const loaded = ref(false);
const selectedGrade = ref('All Grades');
const availableGrades = ref(['All Grades']);
const rawData = ref([]);

const PieChartData = ref({ labels: [], datasets: [] });
const PieChartOptions = ref({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'NYC State Test: Proficiency Level Distribution' },
    },
});

const colors = {
    'Level 1': '#FF6384',
    'Level 2': '#FFA726',
    'Level 3': '#66BB6A',
    'Level 4': '#42A5F5',
};

async function fetchData() {
    try {
        const response = await fetch('https://data.cityofnewyork.us/resource/74kb-55u9.json?$limit=50000');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


</script>

<style scoped>
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

label {
    font-weight: 600;
    color: #555;
}

select {
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    transition: border-color 0.3s;
}

select:hover {
    border-color: #42a5f5;
}

select:focus {
    outline: none;
    border-color: #42a5f5;
    box-shadow: 0 0 5px rgba(66, 165, 245, 0.3);
}

.navigation {
    margin-top: 10px;
    font-size: 14px;
}

a {
    color: #42a5f5;
    text-decoration: none;
    margin: 0 5px;
    transition: color 0.3s;
}

a:hover {
    color: #1976d2;
    text-decoration: underline;
}

.chart-container {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    height: 500px;
}

.loading {
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 40px;
}
</style>