<!-- src/views/Reports/Reports.vue -->
<template>
  <div class="p-4">
    <h2 class="mb-4">📊 Rapports et Statistiques</h2>

    <!-- Filtres et options -->
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">🔍 Filtres</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3">
                <label class="form-label">Type de rapport</label>
                <select v-model="reportType" class="form-select">
                  <option value="student">Bulletin individuel</option>
                  <option value="class">Rapport de classe</option>
                  <option value="statistics">Statistiques générales</option>
                  <option value="comparison">Comparaison inter-classes</option>
                </select>
              </div>

              <div class="col-md-3" v-if="reportType === 'student'">
                <label class="form-label">Étudiant</label>
                <select v-model="selectedStudent" class="form-select">
                  <option value="">-- Sélectionner --</option>
                  <option v-for="student in students" :key="student.id" :value="student.id">
                    {{ student.user.name }} ({{ student.class }})
                  </option>
                </select>
              </div>

              <div class="col-md-3" v-if="reportType === 'class' || reportType === 'comparison'">
                <label class="form-label">Classe</label>
                <select v-model="selectedClass" class="form-select">
                  <option value="">-- Sélectionner --</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                </select>
              </div>

              <div class="col-md-3">
                <label class="form-label">Période</label>
                <select v-model="selectedPeriod" class="form-select">
                  <option value="all">Toute l'année</option>
                  <option value="trimester1">1er Trimestre</option>
                  <option value="trimester2">2ème Trimestre</option>
                  <option value="trimester3">3ème Trimestre</option>
                </select>
              </div>

              <div class="col-md-12 d-flex gap-2">
                <button class="btn btn-primary" @click="generateReport" :disabled="loading">
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Génération...
                  </span>
                  <span v-else>📈 Générer le rapport</span>
                </button>
                <button 
                  v-if="showExportButton" 
                  class="btn btn-success" 
                  @click="exportPDF"
                >
                  📥 Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rapport Bulletin Individuel -->
    <div v-if="reportType === 'student' && reportData" class="card mb-4">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">📄 Bulletin de {{ reportData.student?.user?.name }}</h5>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-6">
            <table class="table table-borderless">
              <tr>
                <th>Matricule:</th>
                <td>{{ reportData.student?.matricule }}</td>
              </tr>
              <tr>
                <th>Classe:</th>
                <td>{{ reportData.student?.class }}</td>
              </tr>
              <tr>
                <th>Date de naissance:</th>
                <td>{{ formatDate(reportData.student?.date_of_birth) }}</td>
              </tr>
            </table>
          </div>
          <div class="col-md-6 text-end">
            <div class="average-display p-4 bg-light rounded">
              <h6 class="text-muted mb-2">Moyenne Générale</h6>
              <h1 :class="'display-4 ' + getAverageColor(reportData.generalAverage)">
                {{ reportData.generalAverage?.toFixed(2) }}/20
              </h1>
              <p class="mb-0">{{ getAverageLabel(reportData.generalAverage) }}</p>
            </div>
          </div>
        </div>

        <h5 class="mb-3">📚 Résultats par matière</h5>
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-primary">
              <tr>
                <th>Matière</th>
                <th>Nombre de notes</th>
                <th>Moyenne</th>
                <th>Coefficient</th>
                <th>Moy × Coef</th>
                <th>Appréciation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in reportData.courseAverages" :key="course.course_id">
                <td><strong>{{ course.course_name }}</strong></td>
                <td>{{ course.grade_count }}</td>
                <td>
                  <span :class="'badge ' + getGradeBadgeClass(course.average)">
                    {{ course.average?.toFixed(2) }}/20
                  </span>
                </td>
                <td>{{ course.coefficient }}</td>
                <td>{{ course.weighted?.toFixed(2) }}</td>
                <td>{{ getCourseAppreciation(course.average) }}</td>
              </tr>
            </tbody>
            <tfoot class="table-secondary">
              <tr>
                <th colspan="2">TOTAL</th>
                <th>-</th>
                <th>{{ reportData.totalCoefficients }}</th>
                <th>{{ reportData.totalWeighted?.toFixed(2) }}</th>
                <th>-</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="alert alert-info mt-4">
          <strong>📝 Appréciation générale:</strong><br>
          {{ getGeneralAppreciation(reportData.generalAverage) }}
        </div>
      </div>
    </div>

    <!-- Rapport de Classe -->
    <div v-if="reportType === 'class' && reportData" class="card mb-4">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0">🏫 Rapport de la classe {{ selectedClass }}</h5>
      </div>
      <div class="card-body">
        <!-- Statistiques globales -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body text-center">
                <h6>Total Étudiants</h6>
                <h2>{{ reportData.totalStudents }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body text-center">
                <h6>Moyenne Classe</h6>
                <h2>{{ reportData.classAverage?.toFixed(2) }}/20</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body text-center">
                <h6>Meilleure Moyenne</h6>
                <h2>{{ reportData.bestAverage?.toFixed(2) }}/20</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body text-center">
                <h6>Taux de Réussite</h6>
                <h2>{{ reportData.successRate?.toFixed(1) }}%</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Classement -->
        <h5 class="mb-3">🏆 Classement des étudiants</h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-success">
              <tr>
                <th>Rang</th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Moyenne</th>
                <th>Mention</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in reportData.ranking" :key="student.id" 
                  :class="getRankClass(index)">
                <td>
                  <strong>{{ index + 1 }}</strong>
                  <span v-if="index === 0">🥇</span>
                  <span v-else-if="index === 1">🥈</span>
                  <span v-else-if="index === 2">🥉</span>
                </td>
                <td>{{ student.matricule }}</td>
                <td><strong>{{ student.name }}</strong></td>
                <td>
                  <span :class="'badge ' + getGradeBadgeClass(student.average)">
                    {{ student.average?.toFixed(2) }}/20
                  </span>
                </td>
                <td>{{ getMention(student.average) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Graphique de distribution -->
        <h5 class="mb-3">📊 Distribution des moyennes</h5>
        <div class="row">
          <div class="col-md-12">
            <canvas ref="distributionChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques Générales -->
    <div v-if="reportType === 'statistics' && reportData" class="card mb-4">
      <div class="card-header bg-warning">
        <h5 class="mb-0">📈 Statistiques Générales de l'École</h5>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-primary">👥</div>
              <div class="stat-content">
                <h3>{{ reportData.totalStudents }}</h3>
                <p>Total Étudiants</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-success">👨‍🏫</div>
              <div class="stat-content">
                <h3>{{ reportData.totalTeachers }}</h3>
                <p>Professeurs</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-info">📚</div>
              <div class="stat-content">
                <h3>{{ reportData.totalCourses }}</h3>
                <p>Cours</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-warning">📝</div>
              <div class="stat-content">
                <h3>{{ reportData.totalGrades }}</h3>
                <p>Notes saisies</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <h5 class="mb-3">📊 Répartition par classe</h5>
            <canvas ref="classDistributionChart"></canvas>
          </div>
          <div class="col-md-6">
            <h5 class="mb-3">📈 Moyennes par classe</h5>
            <canvas ref="classAveragesChart"></canvas>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-md-12">
            <h5 class="mb-3">🎯 Performance par matière</h5>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead class="table-warning">
                  <tr>
                    <th>Matière</th>
                    <th>Nombre d'étudiants</th>
                    <th>Moyenne générale</th>
                    <th>Taux de réussite</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subject in reportData.subjectStats" :key="subject.name">
                    <td><strong>{{ subject.name }}</strong></td>
                    <td>{{ subject.studentCount }}</td>
                    <td>
                      <span :class="'badge ' + getGradeBadgeClass(subject.average)">
                        {{ subject.average?.toFixed(2) }}/20
                      </span>
                    </td>
                    <td>
                      <div class="progress">
                        <div 
                          class="progress-bar" 
                          :class="subject.successRate >= 80 ? 'bg-success' : 'bg-warning'"
                          :style="{ width: subject.successRate + '%' }"
                        >
                          {{ subject.successRate?.toFixed(0) }}%
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparaison Inter-Classes -->
    <div v-if="reportType === 'comparison' && reportData" class="card mb-4">
      <div class="card-header bg-danger text-white">
        <h5 class="mb-0">⚖️ Comparaison des Classes</h5>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-12">
            <canvas ref="comparisonChart"></canvas>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="table-danger">
              <tr>
                <th>Classe</th>
                <th>Étudiants</th>
                <th>Moyenne</th>
                <th>Meilleure note</th>
                <th>Note la plus basse</th>
                <th>Taux réussite</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cls in reportData.classes" :key="cls.name">
                <td><strong>{{ cls.name }}</strong></td>
                <td>{{ cls.studentCount }}</td>
                <td>
                  <span :class="'badge ' + getGradeBadgeClass(cls.average)">
                    {{ cls.average?.toFixed(2) }}/20
                  </span>
                </td>
                <td>{{ cls.best?.toFixed(2) }}/20</td>
                <td>{{ cls.lowest?.toFixed(2) }}/20</td>
                <td>{{ cls.successRate?.toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import Chart from 'chart.js/auto'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

// États
const reportType = ref('student')
const selectedStudent = ref('')
const selectedClass = ref('')
const selectedPeriod = ref('all')
const loading = ref(false)
const reportData = ref(null)
const students = ref([])

// Charts refs
const distributionChart = ref(null)
const classDistributionChart = ref(null)
const classAveragesChart = ref(null)
const comparisonChart = ref(null)

let chartInstances = []

const showExportButton = computed(() => {
  return reportData.value && (reportType.value === 'student' || reportType.value === 'class')
})

// Charger les données
const loadStudents = async () => {
  try {
    const { data } = await api.getStudents()
    students.value = data
  } catch (error) {
    console.error('Erreur chargement étudiants:', error)
  }
}

// Générer le rapport
const generateReport = async () => {
  if (reportType.value === 'student' && !selectedStudent.value) {
    alert('Veuillez sélectionner un étudiant')
    return
  }
  if ((reportType.value === 'class' || reportType.value === 'comparison') && !selectedClass.value) {
    alert('Veuillez sélectionner une classe')
    return
  }

  loading.value = true
  
  try {
    // Détruire les anciens graphiques
    chartInstances.forEach(chart => chart.destroy())
    chartInstances = []

    if (reportType.value === 'student') {
      await generateStudentReport()
    } else if (reportType.value === 'class') {
      await generateClassReport()
    } else if (reportType.value === 'statistics') {
      await generateStatisticsReport()
    } else if (reportType.value === 'comparison') {
      await generateComparisonReport()
    }
  } catch (error) {
    console.error('Erreur génération rapport:', error)
    alert('Erreur lors de la génération du rapport')
  } finally {
    loading.value = false
  }
}

// Rapport individuel étudiant
const generateStudentReport = async () => {
  const student = students.value.find(s => s.id == selectedStudent.value)
  const { data: grades } = await api.getStudentGrades(selectedStudent.value)
  const { data: avgData } = await api.getStudentAverage(selectedStudent.value)

  // Calculer moyennes par cours
  const gradesByCourse = {}
  grades.forEach(grade => {
    if (!gradesByCourse[grade.course_id]) {
      gradesByCourse[grade.course_id] = {
        course_id: grade.course_id,
        course_name: grade.course.name,
        coefficient: grade.course.coefficient,
        grades: []
      }
    }
    gradesByCourse[grade.course_id].grades.push(parseFloat(grade.grade))
  })

  const courseAverages = Object.values(gradesByCourse).map(course => {
    const avg = course.grades.reduce((a, b) => a + b, 0) / course.grades.length
    return {
      ...course,
      average: avg,
      grade_count: course.grades.length,
      weighted: avg * course.coefficient
    }
  })

  const totalCoefficients = courseAverages.reduce((sum, c) => sum + c.coefficient, 0)
  const totalWeighted = courseAverages.reduce((sum, c) => sum + c.weighted, 0)

  reportData.value = {
    student,
    courseAverages,
    generalAverage: avgData.average,
    totalCoefficients,
    totalWeighted
  }
}

// Rapport de classe
const generateClassReport = async () => {
  const { data: allStudents } = await api.getStudents()
  const classStudents = allStudents.filter(s => s.class === selectedClass.value)

  const studentsWithAverages = await Promise.all(
    classStudents.map(async (student) => {
      try {
        const { data } = await api.getStudentAverage(student.id)
        return {
          id: student.id,
          name: student.user.name,
          matricule: student.matricule,
          average: data.average
        }
      } catch {
        return {
          id: student.id,
          name: student.user.name,
          matricule: student.matricule,
          average: 0
        }
      }
    })
  )

  const ranking = studentsWithAverages.sort((a, b) => b.average - a.average)
  const classAverage = ranking.reduce((sum, s) => sum + s.average, 0) / ranking.length
  const bestAverage = ranking[0]?.average || 0
  const successRate = (ranking.filter(s => s.average >= 10).length / ranking.length) * 100

  reportData.value = {
    totalStudents: ranking.length,
    classAverage,
    bestAverage,
    successRate,
    ranking
  }

  // Créer graphique de distribution
  await nextTick()
  createDistributionChart(ranking)
}

// Statistiques générales
const generateStatisticsReport = async () => {
  const [studentsRes, coursesRes] = await Promise.all([
    api.getStudents(),
    api.getCourses()
  ])

  const students = studentsRes.data
  const courses = coursesRes.data

  // Stats par classe
  const classCounts = {}
  students.forEach(s => {
    classCounts[s.class] = (classCounts[s.class] || 0) + 1
  })

  reportData.value = {
    totalStudents: students.length,
    totalTeachers: 6, // À adapter
    totalCourses: courses.length,
    totalGrades: 320, // À adapter
    classCounts,
    subjectStats: courses.map(c => ({
      name: c.name,
      studentCount: c.students?.length || 0,
      average: 14.5, // À calculer
      successRate: 85 // À calculer
    }))
  }

  await nextTick()
  createClassDistributionChart(classCounts)
}

// Comparaison
const generateComparisonReport = async () => {
  const classes = ['6ème', '5ème', '4ème', '3ème']
  const classData = []

  for (const cls of classes) {
    const { data: students } = await api.getStudents()
    const classStudents = students.filter(s => s.class === cls)
    
    const averages = await Promise.all(
      classStudents.map(async (s) => {
        try {
          const { data } = await api.getStudentAverage(s.id)
          return data.average
        } catch {
          return 0
        }
      })
    )

    const avg = averages.reduce((a, b) => a + b, 0) / averages.length
    const best = Math.max(...averages)
    const lowest = Math.min(...averages)
    const successRate = (averages.filter(a => a >= 10).length / averages.length) * 100

    classData.push({
      name: cls,
      studentCount: classStudents.length,
      average: avg,
      best,
      lowest,
      successRate
    })
  }

  reportData.value = { classes: classData }

  await nextTick()
  createComparisonChart(classData)
}

// Créer graphique distribution
const createDistributionChart = (students) => {
  if (!distributionChart.value) return

  const ranges = {
    '0-5': 0,
    '5-10': 0,
    '10-12': 0,
    '12-14': 0,
    '14-16': 0,
    '16-20': 0
  }

  students.forEach(s => {
    const avg = s.average
    if (avg < 5) ranges['0-5']++
    else if (avg < 10) ranges['5-10']++
    else if (avg < 12) ranges['10-12']++
    else if (avg < 14) ranges['12-14']++
    else if (avg < 16) ranges['14-16']++
    else ranges['16-20']++
  })

  const chart = new Chart(distributionChart.value, {
    type: 'bar',
    data: {
      labels: Object.keys(ranges),
      datasets: [{
        label: 'Nombre d\'étudiants',
        data: Object.values(ranges),
        backgroundColor: [
          '#dc3545',
          '#fd7e14',
          '#ffc107',
          '#20c997',
          '#0dcaf0',
          '#198754'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribution des moyennes'
        }
      }
    }
  })

  chartInstances.push(chart)
}

// Créer graphique répartition classes
const createClassDistributionChart = (classCounts) => {
  if (!classDistributionChart.value) return

  const chart = new Chart(classDistributionChart.value, {
    type: 'pie',
    data: {
      labels: Object.keys(classCounts),
      datasets: [{
        data: Object.values(classCounts),
        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Répartition des étudiants par classe'
        }
      }
    }
  })

  chartInstances.push(chart)
}

// Créer graphique comparaison
const createComparisonChart = (classData) => {
  if (!comparisonChart.value) return

  const chart = new Chart(comparisonChart.value, {
    type: 'bar',
    data: {
      labels: classData.map(c => c.name),
      datasets: [
        {
          label: 'Moyenne',
          data: classData.map(c => c.average),
          backgroundColor: '#0d6efd'
        },
        {
          label: 'Meilleure note',
          data: classData.map(c => c.best),
          backgroundColor: '#198754'
        },
        {
          label: 'Note la plus basse',
          data: classData.map(c => c.lowest),
          backgroundColor: '#dc3545'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 20
        }
      }
    }
  })

  chartInstances.push(chart)
}

// Export PDF
const exportPDF = () => {
  if (reportType.value === 'student') {
    window.open(`http://localhost:8000/api/reports/bulletin/${selectedStudent.value}`, '_blank')
  } else if (reportType.value === 'class') {
    window.open(`http://localhost:8000/api/reports/class/${selectedClass.value}`, '_blank')
  }
}

// Fonctions utilitaires
const getGradeBadgeClass = (grade) => {
  if (grade >= 16) return 'bg-success'
  if (grade >= 14) return 'bg-info'
  if (grade >= 10) return 'bg-warning'
  return 'bg-danger'
}

const getAverageColor = (avg) => {
  if (avg >= 16) return 'text-success'
  if (avg >= 14) return 'text-info'
  if (avg >= 10) return 'text-warning'
  return 'text-danger'
}

const getAverageLabel = (avg) => {
  if (avg >= 16) return '🎉 Excellent !'
  if (avg >= 14) return '👏 Très bien !'
  if (avg >= 12) return '👍 Bien'
  if (avg >= 10) return '✔️ Passable'
  return '⚠️ Insuffisant'
}

const getCourseAppreciation = (avg) => {
  if (avg >= 16) return 'Excellent'
  if (avg >= 14) return 'Très bien'
  if (avg >= 12) return 'Bien'
  if (avg >= 10) return 'Assez bien'
  return 'Insuffisant'
}

const getGeneralAppreciation = (avg) => {
  if (avg >= 16) return 'Excellent travail ! L\'élève fait preuve d\'une grande maîtrise des compétences. Continuez ainsi !'
  if (avg >= 14) return 'Très bon travail ! Des résultats solides et réguliers. Encourager à maintenir cet effort.'
  if (avg >= 12) return 'Bon travail dans l\'ensemble. Quelques progrès restent à faire dans certaines matières.'
  if (avg >= 10) return 'Travail satisfaisant mais peut mieux faire. Des efforts supplémentaires sont encouragés.'
  return 'Résultats insuffisants. Un travail régulier et soutenu est nécessaire pour progresser.'
}

const getMention = (avg) => {
  if (avg >= 16) return 'Très Bien'
  if (avg >= 14) return 'Bien'
  if (avg >= 12) return 'Assez Bien'
  if (avg >= 10) return 'Passable'
  return '-'
}

const getRankClass = (index) => {
  if (index === 0) return 'table-warning'
  if (index === 1) return 'table-light'
  if (index === 2) return 'table-light'
  return ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.average-display {
  text-align: center;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  margin-bottom: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(0,0,0,0.025);
}

.progress {
  height: 25px;
}

.progress-bar {
  line-height: 25px;
  font-weight: bold;
}

canvas {
  max-height: 400px;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  border: none;
}

.card-header {
  font-weight: 600;
}
</style>