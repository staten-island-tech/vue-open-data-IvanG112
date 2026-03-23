<template>
  <div class="container">
    <h2>NYC State Test Grades by Grade Level</h2>
    <p>Data source: NYC Open Data (state test performance, Citywide, All Students)</p>
    <Bar v-if="loaded" id="grade-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
    title: { display: true, text: 'NYC State Test: % Level 3+4 by Grade Level' },
  },
  scales: {
    x: { title: { display: true, text: 'Grade Level' } },
    y: { beginAtZero: true, max: 100, title: { display: true, text: '% Level 3+4' } },
  },
});

async function fetchGrades() {
  try {
    const response = await fetch('https://data.cityofnewyork.us/resource/74kb-55u9.json');
    const data = await response.json();

    const filtered = data.filter(
      (item) =>
        item.report_category === 'Citywide' &&
        item.student_category === 'All Students' &&
        item.pct_level_3_and_4 != null
    );

    const years = [...new Set(filtered.map((item) => item.year))].sort();
    const latestYear = years[years.length - 1];
    const byGrade = filtered
      .filter((item) => item.year === latestYear)
      .reduce((acc, item) => {
        const grade = item.grade;
        const pct = parseFloat(item.pct_level_3_and_4);
        if (!Number.isNaN(pct)) acc[grade] = pct;
        return acc;
      }, {});

    const gradeOrder = ['3', '4', '5', '6', '7', '8'];
    const labels = gradeOrder.filter((g) => byGrade[g] !== undefined);
    const values = labels.map((g) => byGrade[g]);

    chartData.value = {
      labels,
      datasets: [
        {
          label: `% Level 3 + 4 (${latestYear})`,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          data: values,
        },
      ],
    };

    loaded.value = true;
  } catch (error) {
    console.error('Error fetching grades:', error);
  }
}

onMounted(fetchGrades);
</script>

<style scoped>
.container { padding: 1rem; max-width: 900px; margin: 0 auto; }
h2 { margin-bottom: 0.5rem; }
</style>