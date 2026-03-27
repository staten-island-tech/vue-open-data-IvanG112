<template>
  <div class="container">
    <h2>NYC State Test Data</h2>
    <div class="controls">
      <label for="grade-select">Select Grade:</label>
      <select id="grade-select" v-model="selectedGrade">
        <option v-for="grade in availableGrades" :key="grade" :value="grade">{{ grade }}</option>
      </select>
      <label for="year-select">Select Year:</label>
      <select id="year-select" v-model="selectedYear">
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
      <div>
        <RouterLink to="/">Line Chart</RouterLink> |
        <RouterLink to="/PieChart">Pie Chart</RouterLink>
      </div>
    </div>
    <Pie v-if="loaded" id="grade-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement);

defineOptions({ name: 'BaseView' });

const loaded = ref(false);
const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'NYC State Test: Student Performance Level Distribution' },
  },
});

const selectedGrade = ref('3');
const availableGrades = ref(['3', '4', '5', '6', '7', '8']);
const selectedYear = ref('2022');
const availableYears = ref([]);
const allData = ref([]);

function updateChart() {
  if (!allData.value.length || !selectedGrade.value || !selectedYear.value) return;

  const item = allData.value.find((d) => d.grade === selectedGrade.value && d.year === selectedYear.value);
  if (!item) return;

  const levels = [1, 2, 3, 4];
  const labels = levels.map(l => `Level ${l}`);
  const data = levels.map(l => {
    const pct = parseFloat(item[`pct_level_${l}`]);
    return Number.isNaN(pct) ? 0 : pct;
  });

  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: `Percentage of Students (Grade ${selectedGrade.value}, ${selectedYear.value})`,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        data: data,
      },
    ],
  };
}

async function fetchGrades() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/resource/74kb-55u9.json');
    const data = await response.json();

    const filtered = data.filter(
      (item) =>
        item.report_category === 'Citywide' &&
        item.student_category === 'All Students' &&
        item.pct_level_1 != null &&
        item.grade !== 'All Grades'
    );

    allData.value = filtered;
    availableYears.value = [...new Set(filtered.map((item) => item.year))].sort();
    selectedYear.value = availableYears.value[availableYears.value.length - 1] || '2022'; // default to latest year
    selectedGrade.value = '3'; // default to grade 3

    updateChart();
    loaded.value = true;
  } catch (error) {
    console.error('Error fetching grades:', error);
  }
}

watch([selectedGrade, selectedYear], updateChart);

onMounted(fetchGrades);
</script>

<style scoped>
.container { padding: 1rem; max-width: 900px; margin: 0 auto; }
h2 { margin-bottom: 0.5rem; }
.controls { margin-bottom: 1rem; }
.controls label { margin-right: 0.5rem; }
.controls select { padding: 0.25rem; }
</style>