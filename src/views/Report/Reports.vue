<template>
    <div class="reports-container p-4">
        <!-- En-tête -->
        <div class="reports-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">
                        <i class="bi bi-graph-up-arrow me-2"></i>
                        Rapports et statistiques
                    </h1>
                    <p class="text-muted mb-0">
                        Analysez les performances académiques et générez des rapports détaillés
                    </p>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                        <small class="text-muted d-block">Dernière mise à jour</small>
                        <small class="fw-medium">{{ lastUpdateTime }}</small>
                    </div>
                    <button 
                        class="btn btn-outline-secondary d-flex align-items-center"
                        @click="refreshData"
                        :disabled="loading"
                    >
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Actualiser
                    </button>
                </div>
            </div>
        </div>

        <!-- Filtres de rapport -->
        <div class="card border-0 shadow-sm mb-6">
            <div class="card-header bg-white border-0 py-3">
                <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-funnel text-primary me-2"></i>
                    Paramètres du rapport
                </h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-lg-3 col-md-6">
                        <label class="form-label fw-medium text-gray-700">
                            Type de rapport
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-clipboard-data text-muted"></i>
                            </span>
                            <select v-model="reportType" class="form-select border-start-0">
                                <option value="student">Bulletin individuel</option>
                                <option value="class">Rapport de classe</option>
                                <option value="statistics">Statistiques générales</option>
                                <option value="comparison">Comparaison inter-classes</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6" v-if="reportType === 'student'">
                        <label class="form-label fw-medium text-gray-700">
                            Étudiant
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-person text-muted"></i>
                            </span>
                            <select v-model="selectedStudent" class="form-select border-start-0">
                                <option value="">Sélectionnez un étudiant</option>
                                <option 
                                    v-for="student in filteredStudents" 
                                    :key="student.id" 
                                    :value="student.id"
                                >
                                    {{ student.user.name }} - {{ student.class }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6" v-if="reportType === 'class' || reportType === 'comparison'">
                        <label class="form-label fw-medium text-gray-700">
                            Classe
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-building text-muted"></i>
                            </span>
                            <select v-model="selectedClass" class="form-select border-start-0">
                                <option value="">Toutes les classes</option>
                                <option value="6ème">6ème</option>
                                <option value="5ème">5ème</option>
                                <option value="4ème">4ème</option>
                                <option value="3ème">3ème</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <label class="form-label fw-medium text-gray-700">
                            Période
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-calendar-range text-muted"></i>
                            </span>
                            <select v-model="selectedPeriod" class="form-select border-start-0">
                                <option value="all">Toute l'année</option>
                                <option value="trimester1">1er Trimestre</option>
                                <option value="trimester2">2ème Trimestre</option>
                                <option value="trimester3">3ème Trimestre</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-12">
                        <div class="d-flex justify-content-end gap-3 pt-3 border-top">
                            <button 
                                class="btn btn-outline-secondary px-4"
                                @click="resetFilters"
                                :disabled="loading"
                            >
                                <i class="bi bi-x-circle me-2"></i>
                                Réinitialiser
                            </button>
                            <button 
                                class="btn btn-primary px-4"
                                @click="generateReport"
                                :disabled="loading || !isFormValid"
                                :class="{ 'btn-loading': loading }"
                            >
                                <span v-if="!loading">
                                    <i class="bi bi-file-earmark-bar-graph me-2"></i>
                                    Générer le rapport
                                </span>
                                <span v-else class="d-flex align-items-center">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Génération...
                                </span>
                            </button>
                            <button 
                                v-if="showExportButton" 
                                class="btn btn-success px-4"
                                @click="exportReport"
                                :disabled="!reportData"
                            >
                                <i class="bi bi-download me-2"></i>
                                Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rapport Bulletin Individuel -->
        <div v-if="reportType === 'student' && reportData" class="card border-0 shadow-sm mb-6">
            <div class="card-header bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-semibold">
                        <i class="bi bi-person-badge text-primary me-2"></i>
                        Bulletin individuel
                    </h5>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary me-3">
                            Classe: {{ reportData.student?.class }}
                        </span>
                        <button class="btn btn-sm btn-outline-primary" @click="exportPDF">
                            <i class="bi bi-printer me-1"></i>
                            Imprimer
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <!-- Informations étudiant -->
                <div class="row mb-5">
                    <div class="col-md-8">
                        <div class="student-info-section p-4 border rounded-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="info-item mb-3">
                                        <small class="text-muted d-block">Nom complet</small>
                                        <h5 class="fw-bold">{{ reportData.student?.user?.name }}</h5>
                                    </div>
                                    <div class="info-item mb-3">
                                        <small class="text-muted d-block">Matricule</small>
                                        <code class="bg-light px-2 py-1 rounded">{{ reportData.student?.matricule }}</code>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="info-item mb-3">
                                        <small class="text-muted d-block">Date de naissance</small>
                                        <span class="fw-medium">{{ formatDate(reportData.student?.date_of_birth) }}</span>
                                    </div>
                                    <div class="info-item">
                                        <small class="text-muted d-block">Année scolaire</small>
                                        <span class="fw-medium">2024-2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="average-section text-center p-4 bg-light rounded-3">
                            <small class="text-muted d-block mb-2">Moyenne Générale</small>
                            <h1 class="display-4 fw-bold mb-2" :class="getAverageColor(reportData.generalAverage)">
                                {{ reportData.generalAverage?.toFixed(2) }}
                            </h1>
                            <div class="mb-3">
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar" 
                                         :class="getProgressBarClass(reportData.generalAverage)"
                                         :style="{ width: (reportData.generalAverage / 20 * 100) + '%' }">
                                    </div>
                                </div>
                            </div>
                            <span class="badge" :class="getGradeBadgeClass(reportData.generalAverage)">
                                {{ getMention(reportData.generalAverage) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Résultats par matière -->
                <h6 class="fw-semibold mb-3">
                    <i class="bi bi-journal-text me-2"></i>
                    Résultats par matière
                </h6>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Matière</th>
                                <th>Notes</th>
                                <th>Moyenne</th>
                                <th>Coefficient</th>
                                <th>Moy × Coef</th>
                                <th class="pe-4">Appréciation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="course in reportData.courseAverages" :key="course.course_id">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <div class="subject-icon bg-primary bg-opacity-10 text-primary rounded-2 p-2 me-3">
                                            <i class="bi bi-book"></i>
                                        </div>
                                        <div>
                                            <div class="fw-medium">{{ course.course_name }}</div>
                                            <small class="text-muted">{{ course.teacher || 'Professeur' }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark">
                                        {{ course.grade_count }} notes
                                    </span>
                                </td>
                                <td>
                                    <span :class="'grade-badge ' + getGradeClass(course.average)">
                                        {{ course.average?.toFixed(2) }}/20
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark">
                                        ×{{ course.coefficient }}
                                    </span>
                                </td>
                                <td>
                                    <span class="fw-medium">{{ course.weighted?.toFixed(2) }}</span>
                                </td>
                                <td class="pe-4">
                                    <small :class="getAppreciationColor(course.average)">
                                        {{ getCourseAppreciation(course.average) }}
                                    </small>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="table-secondary">
                            <tr>
                                <th class="ps-4" colspan="2">TOTAUX</th>
                                <th>-</th>
                                <th>
                                    <span class="badge bg-primary">{{ reportData.totalCoefficients }}</span>
                                </th>
                                <th>
                                    <span class="badge bg-success">{{ reportData.totalWeighted?.toFixed(2) }}</span>
                                </th>
                                <th class="pe-4">-</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Appréciation générale -->
                <div class="alert mt-4" :class="getAppreciationAlertClass(reportData.generalAverage)">
                    <div class="d-flex">
                        <i class="bi bi-chat-quote me-3 fs-4"></i>
                        <div>
                            <h6 class="alert-heading mb-2">Appréciation générale</h6>
                            <p class="mb-0">{{ getGeneralAppreciation(reportData.generalAverage) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rapport de Classe -->
        <div v-if="reportType === 'class' && reportData" class="card border-0 shadow-sm mb-6">
            <div class="card-header bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-semibold">
                        <i class="bi bi-people text-primary me-2"></i>
                        Rapport de classe - {{ selectedClass }}
                    </h5>
                    <div class="text-muted">
                        {{ reportData.totalStudents }} étudiants
                    </div>
                </div>
            </div>
            <div class="card-body">
                <!-- Statistiques globales -->
                <div class="row g-4 mb-5">
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                                    <i class="bi bi-people-fill fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Effectif total</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.totalStudents }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                                    <i class="bi bi-graph-up fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Moyenne classe</p>
                                    <h2 class="mb-0 fw-bold" :class="getAverageColor(reportData.classAverage)">
                                        {{ reportData.classAverage?.toFixed(2) }}/20
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-info bg-opacity-10 text-info rounded-2 p-3 me-3">
                                    <i class="bi bi-trophy fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Meilleure moyenne</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.bestAverage?.toFixed(2) }}/20</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-warning bg-opacity-10 text-warning rounded-2 p-3 me-3">
                                    <i class="bi bi-check-circle fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Taux réussite</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.successRate?.toFixed(1) }}%</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Classement -->
                <h6 class="fw-semibold mb-3">
                    <i class="bi bi-trophy me-2"></i>
                    Classement des étudiants
                </h6>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Rang</th>
                                <th>Étudiant</th>
                                <th>Moyenne</th>
                                <th>Évolution</th>
                                <th class="pe-4">Mention</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, index) in reportData.ranking" :key="student.id" 
                                :class="getRankClass(index)">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <span class="rank-badge me-3" :class="getRankBadgeClass(index)">
                                            {{ index + 1 }}
                                        </span>
                                        <div class="rank-medal">
                                            <i v-if="index === 0" class="bi bi-trophy-fill text-warning fs-5"></i>
                                            <i v-else-if="index === 1" class="bi bi-award-fill text-secondary fs-5"></i>
                                            <i v-else-if="index === 2" class="bi bi-award-fill text-danger fs-5"></i>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="student-avatar bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <div>
                                            <div class="fw-medium">{{ student.name }}</div>
                                            <small class="text-muted">{{ student.matricule }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span :class="'grade-badge ' + getGradeClass(student.average)">
                                        {{ student.average?.toFixed(2) }}/20
                                    </span>
                                </td>
                                <td>
                                    <span :class="'small ' + getEvolutionClass(student.evolution)">
                                        <i :class="'bi me-1 ' + getEvolutionIcon(student.evolution)"></i>
                                        {{ student.evolution || 0 }}%
                                    </span>
                                </td>
                                <td class="pe-4">
                                    <span class="badge" :class="getMentionBadgeClass(student.average)">
                                        {{ getMention(student.average) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Distribution des moyennes -->
                <div class="row mt-5">
                    <div class="col-md-12">
                        <h6 class="fw-semibold mb-3">
                            <i class="bi bi-bar-chart me-2"></i>
                            Distribution des moyennes
                        </h6>
                        <div class="chart-container p-4 border rounded-3">
                            <canvas ref="distributionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistiques Générales -->
        <div v-if="reportType === 'statistics' && reportData" class="card border-0 shadow-sm mb-6">
            <div class="card-header bg-white border-0 py-3">
                <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-graph-up-arrow text-primary me-2"></i>
                    Statistiques générales de l'école
                </h5>
            </div>
            <div class="card-body">
                <!-- Métriques principales -->
                <div class="row g-4 mb-5">
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                                    <i class="bi bi-people-fill fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Étudiants</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.totalStudents }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                                    <i class="bi bi-person-badge fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Professeurs</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.totalTeachers }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-info bg-opacity-10 text-info rounded-2 p-3 me-3">
                                    <i class="bi bi-journal-text fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Cours actifs</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.totalCourses }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                            <div class="d-flex align-items-center">
                                <div class="metric-icon bg-warning bg-opacity-10 text-warning rounded-2 p-3 me-3">
                                    <i class="bi bi-clipboard-data fs-4"></i>
                                </div>
                                <div>
                                    <p class="text-muted mb-1">Évaluations</p>
                                    <h2 class="mb-0 fw-bold">{{ reportData.totalGrades }}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="chart-card p-4 border rounded-3">
                            <h6 class="fw-semibold mb-3">Répartition par classe</h6>
                            <canvas ref="classDistributionChart"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="chart-card p-4 border rounded-3">
                            <h6 class="fw-semibold mb-3">Moyennes par classe</h6>
                            <canvas ref="classAveragesChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Performance par matière -->
                <div class="mt-5">
                    <h6 class="fw-semibold mb-3">Performance par matière</h6>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Matière</th>
                                    <th>Étudiants</th>
                                    <th>Moyenne</th>
                                    <th>Taux réussite</th>
                                    <th class="pe-4">Tendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="subject in reportData.subjectStats" :key="subject.name">
                                    <td class="ps-4">
                                        <div class="d-flex align-items-center">
                                            <div class="subject-icon bg-primary bg-opacity-10 text-primary rounded-2 p-2 me-3">
                                                <i class="bi bi-book"></i>
                                            </div>
                                            <span class="fw-medium">{{ subject.name }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark">{{ subject.studentCount }}</span>
                                    </td>
                                    <td>
                                        <span :class="'grade-badge ' + getGradeClass(subject.average)">
                                            {{ subject.average?.toFixed(2) }}/20
                                        </span>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="progress flex-grow-1 me-3" style="height: 8px;">
                                                <div 
                                                    class="progress-bar" 
                                                    :class="subject.successRate >= 80 ? 'bg-success' : 'bg-warning'"
                                                    :style="{ width: subject.successRate + '%' }"
                                                ></div>
                                            </div>
                                            <small class="fw-medium">{{ subject.successRate?.toFixed(0) }}%</small>
                                        </div>
                                    </td>
                                    <td class="pe-4">
                                        <span :class="'badge ' + getTrendBadgeClass(subject.trend)">
                                            <i :class="'bi me-1 ' + getTrendIcon(subject.trend)"></i>
                                            {{ subject.trend || 0 }}%
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comparaison Inter-Classes -->
        <div v-if="reportType === 'comparison' && reportData" class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3">
                <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-bar-chart text-primary me-2"></i>
                    Comparaison des classes
                </h5>
            </div>
            <div class="card-body">
                <div class="row mb-5">
                    <div class="col-md-12">
                        <div class="chart-container p-4 border rounded-3">
                            <canvas ref="comparisonChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Classe</th>
                                <th>Étudiants</th>
                                <th>Moyenne</th>
                                <th>Meilleure note</th>
                                <th>Note la plus basse</th>
                                <th>Taux réussite</th>
                                <th class="pe-4">Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(cls, index) in sortedClasses" :key="cls.name">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <div class="class-badge me-3" :class="getClassBadgeClass(cls.name)">
                                            {{ cls.name }}
                                        </div>
                                        <div>
                                            <div class="fw-medium">Classe {{ cls.name }}</div>
                                            <small class="text-muted">Professeur principal</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark">{{ cls.studentCount }}</span>
                                </td>
                                <td>
                                    <span :class="'grade-badge ' + getGradeClass(cls.average)">
                                        {{ cls.average?.toFixed(2) }}/20
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-success-subtle text-success">
                                        {{ cls.best?.toFixed(2) }}/20
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-danger-subtle text-danger">
                                        {{ cls.lowest?.toFixed(2) }}/20
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="progress flex-grow-1 me-3" style="height: 8px;">
                                            <div 
                                                class="progress-bar" 
                                                :class="cls.successRate >= 80 ? 'bg-success' : cls.successRate >= 60 ? 'bg-warning' : 'bg-danger'"
                                                :style="{ width: cls.successRate + '%' }"
                                            ></div>
                                        </div>
                                        <small class="fw-medium">{{ cls.successRate?.toFixed(1) }}%</small>
                                    </div>
                                </td>
                                <td class="pe-4">
                                    <span class="rank-badge" :class="getRankBadgeClass(index)">
                                        {{ index + 1 }}<sup>{{ getOrdinalSuffix(index + 1) }}</sup>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import Chart from 'chart.js/auto'

const authStore = useAuthStore()

// États
const reportType = ref('student')
const selectedStudent = ref('')
const selectedClass = ref('')
const selectedPeriod = ref('all')
const loading = ref(false)
const reportData = ref(null)
const students = ref([])
const lastUpdateTime = ref('')

// Charts refs
const distributionChart = ref(null)
const classDistributionChart = ref(null)
const classAveragesChart = ref(null)
const comparisonChart = ref(null)

let chartInstances = []

// Computed properties
const showExportButton = computed(() => {
    return reportData.value && (reportType.value === 'student' || reportType.value === 'class')
})

const isFormValid = computed(() => {
    if (reportType.value === 'student' && !selectedStudent.value) return false
    if ((reportType.value === 'class' || reportType.value === 'comparison') && !selectedClass.value) return false
    return true
})

const filteredStudents = computed(() => {
    if (selectedClass.value) {
        return students.value.filter(s => s.class === selectedClass.value)
    }
    return students.value
})

const sortedClasses = computed(() => {
    if (!reportData.value?.classes) return []
    return [...reportData.value.classes].sort((a, b) => b.average - a.average)
})

// Méthodes
const loadStudents = async () => {
    try {
        const { data } = await api.getStudents()
        students.value = data
    } catch (error) {
        console.error('Erreur chargement étudiants:', error)
    }
}

const updateLastUpdateTime = () => {
    const now = new Date()
    lastUpdateTime.value = now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const generateReport = async () => {
    if (!isFormValid.value) {
        alert('Veuillez remplir tous les champs obligatoires')
        return
    }

    loading.value = true
    
    try {
        // Détruire les anciens graphiques
        chartInstances.forEach(chart => chart.destroy())
        chartInstances = []

        // Générer le rapport selon le type
        switch (reportType.value) {
            case 'student':
                await generateStudentReport()
                break
            case 'class':
                await generateClassReport()
                break
            case 'statistics':
                await generateStatisticsReport()
                break
            case 'comparison':
                await generateComparisonReport()
                break
        }

        updateLastUpdateTime()
    } catch (error) {
        console.error('Erreur génération rapport:', error)
        alert('Erreur lors de la génération du rapport')
    } finally {
        loading.value = false
    }
}

const generateStudentReport = async () => {
    const student = students.value.find(s => s.id == selectedStudent.value)
    
    try {
        // Chargement parallèle des données
        const [gradesRes, avgRes] = await Promise.all([
            api.getStudentGrades(selectedStudent.value),
            api.getStudentAverage(selectedStudent.value)
        ])

        const grades = gradesRes.data
        const avgData = avgRes.data

        // Calculer moyennes par cours
        const gradesByCourse = {}
        grades.forEach(grade => {
            if (!gradesByCourse[grade.course_id]) {
                gradesByCourse[grade.course_id] = {
                    course_id: grade.course_id,
                    course_name: grade.course.name,
                    teacher: grade.course.teacher?.user?.name,
                    coefficient: grade.course.coefficient || 1,
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
            generalAverage: avgData.average || 0,
            totalCoefficients,
            totalWeighted
        }
    } catch (error) {
        console.error('Erreur génération rapport étudiant:', error)
        throw error
    }
}

const generateClassReport = async () => {
    try {
        // Charger tous les étudiants
        const { data: allStudents } = await api.getStudents()
        const classStudents = allStudents.filter(s => s.class === selectedClass.value)

        // Calculer les moyennes en parallèle
        const studentsWithAverages = await Promise.all(
            classStudents.map(async (student) => {
                try {
                    const { data } = await api.getStudentAverage(student.id)
                    return {
                        id: student.id,
                        name: student.user.name,
                        matricule: student.matricule,
                        average: data.average || 0,
                        evolution: Math.round(Math.random() * 20 - 10) // Simuler évolution
                    }
                } catch {
                    return {
                        id: student.id,
                        name: student.user.name,
                        matricule: student.matricule,
                        average: 0,
                        evolution: 0
                    }
                }
            })
        )

        const ranking = studentsWithAverages.sort((a, b) => b.average - a.average)
        const classAverage = ranking.length > 0 ? 
            ranking.reduce((sum, s) => sum + s.average, 0) / ranking.length : 0
        const bestAverage = ranking[0]?.average || 0
        const successRate = ranking.length > 0 ? 
            (ranking.filter(s => s.average >= 10).length / ranking.length) * 100 : 0

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
    } catch (error) {
        console.error('Erreur génération rapport classe:', error)
        throw error
    }
}

const generateStatisticsReport = async () => {
    try {
        // Chargement parallèle des données
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

        // Simuler des statistiques par matière (à adapter avec vos données réelles)
        const subjectStats = courses.map(c => ({
            name: c.name,
            studentCount: c.students?.length || Math.floor(Math.random() * 20) + 10,
            average: Math.random() * 10 + 10, // Entre 10 et 20
            successRate: Math.random() * 40 + 60, // Entre 60% et 100%
            trend: Math.round(Math.random() * 20 - 10) // Tendance entre -10% et +10%
        }))

        reportData.value = {
            totalStudents: students.length,
            totalTeachers: 6, // À adapter avec vos données
            totalCourses: courses.length,
            totalGrades: 320, // À adapter avec vos données
            classCounts,
            subjectStats
        }

        await nextTick()
        createClassDistributionChart(classCounts)
    } catch (error) {
        console.error('Erreur génération statistiques:', error)
        throw error
    }
}

const generateComparisonReport = async () => {
    try {
        const classes = ['6ème', '5ème', '4ème', '3ème']
        const classData = []

        // Charger tous les étudiants une seule fois
        const { data: allStudents } = await api.getStudents()

        for (const cls of classes) {
            const classStudents = allStudents.filter(s => s.class === cls)
            
            // Récupérer les moyennes en parallèle
            const averages = await Promise.all(
                classStudents.map(async (s) => {
                    try {
                        const { data } = await api.getStudentAverage(s.id)
                        return data.average || 0
                    } catch {
                        return 0
                    }
                })
            )

            const avg = averages.length > 0 ? 
                averages.reduce((a, b) => a + b, 0) / averages.length : 0
            const best = averages.length > 0 ? Math.max(...averages) : 0
            const lowest = averages.length > 0 ? Math.min(...averages) : 0
            const successRate = averages.length > 0 ? 
                (averages.filter(a => a >= 10).length / averages.length) * 100 : 0

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
    } catch (error) {
        console.error('Erreur génération comparaison:', error)
        throw error
    }
}

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
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Distribution des moyennes',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    })

    chartInstances.push(chart)
}

const createClassDistributionChart = (classCounts) => {
    if (!classDistributionChart.value) return

    const chart = new Chart(classDistributionChart.value, {
        type: 'doughnut',
        data: {
            labels: Object.keys(classCounts),
            datasets: [{
                data: Object.values(classCounts),
                backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Répartition des étudiants',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    })

    chartInstances.push(chart)
}

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
                    backgroundColor: '#0d6efd',
                    borderRadius: 6
                },
                {
                    label: 'Meilleure note',
                    data: classData.map(c => c.best),
                    backgroundColor: '#198754',
                    borderRadius: 6
                },
                {
                    label: 'Note la plus basse',
                    data: classData.map(c => c.lowest),
                    backgroundColor: '#dc3545',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparaison des performances',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    title: {
                        display: true,
                        text: 'Note /20'
                    }
                }
            }
        }
    })

    chartInstances.push(chart)
}

const exportReport = () => {
    if (reportType.value === 'student') {
        exportPDF()
    } else if (reportType.value === 'class') {
        window.open(`http://localhost:8000/api/reports/class/${selectedClass.value}`, '_blank')
    }
}

const exportPDF = () => {
    if (selectedStudent.value) {
        window.open(`http://localhost:8000/api/reports/bulletin/${selectedStudent.value}`, '_blank')
    }
}

const refreshData = async () => {
    await loadStudents()
    updateLastUpdateTime()
}

const resetFilters = () => {
    selectedStudent.value = ''
    selectedClass.value = ''
    selectedPeriod.value = 'all'
    reportData.value = null
}

// Fonctions utilitaires
const getGradeClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

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

const getProgressBarClass = (value) => {
    if (value >= 16) return 'bg-success'
    if (value >= 14) return 'bg-info'
    if (value >= 10) return 'bg-warning'
    return 'bg-danger'
}

const getMention = (avg) => {
    if (avg >= 16) return 'Très Bien'
    if (avg >= 14) return 'Bien'
    if (avg >= 12) return 'Assez Bien'
    if (avg >= 10) return 'Passable'
    return '-'
}

const getMentionBadgeClass = (avg) => {
    if (avg >= 16) return 'bg-success-subtle text-success'
    if (avg >= 14) return 'bg-info-subtle text-info'
    if (avg >= 12) return 'bg-warning-subtle text-warning'
    if (avg >= 10) return 'bg-primary-subtle text-primary'
    return 'bg-secondary-subtle text-secondary'
}

const getCourseAppreciation = (avg) => {
    if (avg >= 16) return 'Excellent'
    if (avg >= 14) return 'Très bien'
    if (avg >= 12) return 'Bien'
    if (avg >= 10) return 'Assez bien'
    return 'Insuffisant'
}

const getAppreciationColor = (avg) => {
    if (avg >= 16) return 'text-success fw-medium'
    if (avg >= 14) return 'text-info fw-medium'
    if (avg >= 12) return 'text-warning fw-medium'
    if (avg >= 10) return 'text-primary fw-medium'
    return 'text-danger fw-medium'
}

const getGeneralAppreciation = (avg) => {
    if (avg >= 16) return 'Excellent travail ! L\'élève fait preuve d\'une grande maîtrise des compétences. Continuez ainsi !'
    if (avg >= 14) return 'Très bon travail ! Des résultats solides et réguliers. Encourager à maintenir cet effort.'
    if (avg >= 12) return 'Bon travail dans l\'ensemble. Quelques progrès restent à faire dans certaines matières.'
    if (avg >= 10) return 'Travail satisfaisant mais peut mieux faire. Des efforts supplémentaires sont encouragés.'
    return 'Résultats insuffisants. Un travail régulier et soutenu est nécessaire pour progresser.'
}

const getAppreciationAlertClass = (avg) => {
    if (avg >= 16) return 'alert-success'
    if (avg >= 14) return 'alert-info'
    if (avg >= 12) return 'alert-warning'
    if (avg >= 10) return 'alert-primary'
    return 'alert-danger'
}

const getRankClass = (index) => {
    if (index === 0) return 'table-warning'
    if (index === 1) return 'table-light'
    if (index === 2) return 'table-light'
    return ''
}

const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-first'
    if (index === 1) return 'rank-second'
    if (index === 2) return 'rank-third'
    return 'rank-other'
}

const getClassBadgeClass = (className) => {
    const classes = {
        '6ème': 'bg-primary-subtle text-primary',
        '5ème': 'bg-success-subtle text-success',
        '4ème': 'bg-info-subtle text-info',
        '3ème': 'bg-warning-subtle text-warning'
    }
    return classes[className] || 'bg-secondary-subtle text-secondary'
}

const getEvolutionClass = (evolution) => {
    if (evolution > 0) return 'text-success'
    if (evolution < 0) return 'text-danger'
    return 'text-muted'
}

const getEvolutionIcon = (evolution) => {
    if (evolution > 0) return 'bi-arrow-up-short'
    if (evolution < 0) return 'bi-arrow-down-short'
    return 'bi-dash'
}

const getTrendBadgeClass = (trend) => {
    if (trend > 0) return 'bg-success-subtle text-success'
    if (trend < 0) return 'bg-danger-subtle text-danger'
    return 'bg-secondary-subtle text-secondary'
}

const getTrendIcon = (trend) => {
    if (trend > 0) return 'bi-arrow-up-short'
    if (trend < 0) return 'bi-arrow-down-short'
    return 'bi-dash'
}

const getOrdinalSuffix = (n) => {
    if (n === 1) return 'er'
    return 'ème'
}

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    return new Date(date).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
    loadStudents()
    updateLastUpdateTime()
})

// Watchers
watch([selectedClass], () => {
    if (selectedClass.value && reportType.value === 'student') {
        selectedStudent.value = ''
    }
})
</script>

<style scoped>
.reports-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.reports-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.metric-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.metric-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.student-info-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.average-section {
    border: 2px solid #e5e7eb;
}

.grade-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
}

.subject-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.student-avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rank-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.875rem;
}

.rank-first {
    background-color: #ffd700;
    color: #000;
}

.rank-second {
    background-color: #c0c0c0;
    color: #000;
}

.rank-third {
    background-color: #cd7f32;
    color: #000;
}

.rank-other {
    background-color: #f1f5f9;
    color: #64748b;
}

.class-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    min-width: 60px;
    text-align: center;
}

.chart-container, .chart-card {
    background: white;
}

.progress {
    background-color: #f1f5f9;
    border-radius: 10px;
}

.progress-bar {
    border-radius: 10px;
}

/* Classes pour les badges de couleurs */
.bg-primary-subtle {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

.bg-success-subtle {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

.bg-warning-subtle {
    background-color: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
}

.bg-danger-subtle {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
}

.bg-info-subtle {
    background-color: rgba(14, 165, 233, 0.1);
    color: #0EA5E9;
}

.btn-primary {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
    opacity: 0.7;
    transform: none !important;
}

.btn-loading {
    position: relative;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.reports-container > * {
    animation: fadeInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .reports-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .reports-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .average-section .display-4 {
        font-size: 2.5rem;
    }
}
</style>