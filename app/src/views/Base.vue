<template>
  <div class="container">
    <h2>NYC State Test Data</h2>
    <div class="controls">
      <label for="grade-select">Select Grade:</label>
      <div>
        <RouterLink to="/">Line Chart</RouterLink> |
        <RouterLink to="/PieChart">Pie Chart</RouterLink>
      </div>
      <select id="grade-select" v-model="selectedGrade">
        <option v-for="grade in availableGrades" :key="grade" :value="grade">{{ grade }}</option>
      </select>
    </div>
    <Bar v-if="loaded" id="grade-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineOptions({ name: 'BaseView' });

const loaded = ref(false);
const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'NYC State Test: Mean Scale Score Over Years' },
  },
  scales: {
    x: { title: { display: true, text: 'Year' } },
    y: { beginAtZero: true, title: { display: true, text: 'Mean Scale Score' } },
  },
});

const selectedGrade = ref('3');
const availableGrades = ref(['3', '4', '5', '6', '7', '8']);
const allData = ref([]);

function updateChart() {
  if (!allData.value.length || !selectedGrade.value) return;

  const filtered = allData.value.filter((item) => item.grade === selectedGrade.value);
  const byYear = filtered.reduce((acc, item) => {
    const year = item.year;
    const score = parseFloat(item.mean_scale_score);
    if (!Number.isNaN(score)) acc[year] = score;
    return acc;
  }, {});

  const years = Object.keys(byYear).sort();
  const values = years.map((y) => byYear[y]);

  chartData.value = {
    labels: years,
    datasets: [
      {
        label: `Mean Scale Score (Grade ${selectedGrade.value})`,
        backgroundColor: '#FA5B50',
        borderColor: '#FA463A',
        borderWidth: 1,
        data: values,
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
        item.mean_scale_score != null &&
        item.grade !== 'All Grades'
    );

    allData.value = filtered;
    selectedGrade.value = '3'; // default to grade 3

    updateChart();
    loaded.value = true;
  } catch (error) {
    console.error('Error fetching grades:', error);
  }
}

watch(selectedGrade, updateChart);

onMounted(fetchGrades);
</script>

<style scoped>
.container { padding: 1rem; max-width: 900px; margin: 0 auto; }
h2 { margin-bottom: 0.5rem; }
.controls { margin-bottom: 1rem; }
.controls label { margin-right: 0.5rem; }
.controls select { padding: 0.25rem; }
</style>