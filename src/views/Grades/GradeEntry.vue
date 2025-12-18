<template>
    <div class="grade-entry-container p-4">
        <!-- En-tête -->
        <div class="grades-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">
                        <i class="bi bi-clipboard-data me-2"></i>
                        Saisie des notes
                    </h1>
                    <p class="text-muted mb-0">
                        Enregistrez et gérez les évaluations des étudiants
                    </p>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                        <small class="text-muted d-block">Saisies aujourd'hui</small>
                        <span class="badge bg-primary">{{ todayGradesCount }}</span>
                    </div>
                    <button 
                        class="btn btn-outline-secondary d-flex align-items-center"
                        @click="refreshData"
                        :disabled="loading.submit || loading.grades"
                    >
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Actualiser
                    </button>
                </div>
            </div>
        </div>

        <!-- Formulaire de saisie -->
        <div class="row g-4 mb-6">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">
                            <i class="bi bi-plus-circle text-primary me-2"></i>
                            Nouvelle évaluation
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="handleSubmit" class="grade-form">
                            <div class="row g-4">
                                <!-- Étudiant -->
                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Étudiant
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.student_id" 
                                            class="form-select border-start-0"
                                            required
                                            @change="onStudentChange"
                                            :disabled="loading.students"
                                        >
                                            <option value="">Sélectionnez un étudiant</option>
                                            <option 
                                                v-for="student in filteredStudents" 
                                                :key="student.id" 
                                                :value="student.id"
                                            >
                                                {{ student.user.name }} - {{ student.class }} ({{ student.matricule }})
                                            </option>
                                        </select>
                                    </div>
                                    <div v-if="selectedStudent" class="student-info mt-2">
                                        <small class="text-muted">
                                            Classe: <span class="fw-medium">{{ selectedStudent.class }}</span>
                                            • Moyenne générale: <span class="fw-medium">{{ studentAverage }}/20</span>
                                        </small>
                                    </div>
                                </div>

                                <!-- Cours -->
                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Cours
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-journal-text text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.course_id" 
                                            class="form-select border-start-0"
                                            required
                                            :disabled="!form.student_id || loading.courses"
                                        >
                                            <option value="">Sélectionnez un cours</option>
                                            <option 
                                                v-for="course in availableCourses" 
                                                :key="course.id" 
                                                :value="course.id"
                                            >
                                                {{ course.name }} (Coef. {{ course.coefficient }})
                                            </option>
                                        </select>
                                    </div>
                                    <div v-if="selectedCourse" class="course-info mt-2">
                                        <small class="text-muted">
                                            Professeur: <span class="fw-medium">{{ selectedCourse.teacher?.user?.name || 'Non assigné' }}</span>
                                        </small>
                                    </div>
                                </div>

                                <!-- Type d'examen -->
                                <div class="col-md-4">
                                    <label class="form-label fw-medium text-gray-700">
                                        Type d'évaluation
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-clipboard-check text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.exam_type" 
                                            class="form-select border-start-0"
                                            required
                                        >
                                            <option value="">Type d'examen</option>
                                            <option value="quiz">Quiz</option>
                                            <option value="devoir">Devoir</option>
                                            <option value="controle">Contrôle</option>
                                            <option value="examen">Examen</option>
                                            <option value="oral">Oral</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Note -->
                                <div class="col-md-4">
                                    <label class="form-label fw-medium text-gray-700">
                                        Note /20
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-star text-muted"></i>
                                        </span>
                                        <input 
                                            v-model.number="form.grade" 
                                            type="number" 
                                            class="form-control border-start-0 border-end-0"
                                            min="0"
                                            max="20"
                                            step="0.25"
                                            required
                                            placeholder="15.5"
                                            @input="validateGrade"
                                        >
                                        <span class="input-group-text bg-light border-start-0">/20</span>
                                    </div>
                                    <div class="mt-2">
                                        <div class="grade-indicator">
                                            <div class="progress" style="height: 6px;">
                                                <div 
                                                    class="progress-bar" 
                                                    :class="getProgressBarClass(form.grade)"
                                                    :style="{ width: form.grade ? (form.grade / 20 * 100) + '%' : '0%' }"
                                                ></div>
                                            </div>
                                            <div class="d-flex justify-content-between mt-1">
                                                <small :class="getGradeTextClass(form.grade)">
                                                    {{ form.grade || 0 }}/20
                                                </small>
                                                <small class="text-muted">{{ getGradeStatus(form.grade) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Date -->
                                <div class="col-md-4">
                                    <label class="form-label fw-medium text-gray-700">
                                        Date d'évaluation
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-calendar3 text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.exam_date" 
                                            type="date" 
                                            class="form-control border-start-0"
                                            :max="today"
                                            required
                                        >
                                    </div>
                                </div>

                                <!-- Commentaire -->
                                <div class="col-md-12">
                                    <label class="form-label fw-medium text-gray-700">
                                        Observations
                                    </label>
                                    <textarea 
                                        v-model="form.comment" 
                                        class="form-control" 
                                        rows="3"
                                        placeholder="Remarques sur l'évaluation, points forts, axes d'amélioration..."
                                    ></textarea>
                                </div>

                                <!-- Boutons du formulaire -->
                                <div class="col-md-12">
                                    <div class="d-flex justify-content-end gap-3 pt-3 border-top">
                                        <button 
                                            type="button" 
                                            class="btn btn-outline-secondary px-4"
                                            @click="resetForm"
                                            :disabled="loading.submit"
                                        >
                                            <i class="bi bi-x-circle me-2"></i>
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit" 
                                            class="btn btn-primary px-4"
                                            :disabled="loading.submit || !isFormValid"
                                            :class="{ 'btn-loading': loading.submit }"
                                        >
                                            <span v-if="!loading.submit">
                                                <i class="bi bi-check-lg me-2"></i>
                                                Enregistrer la note
                                            </span>
                                            <span v-else class="d-flex align-items-center">
                                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Enregistrement...
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Messages de retour -->
                            <div v-if="successMessage" class="alert alert-success mt-4 d-flex align-items-center" role="alert">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                <div>{{ successMessage }}</div>
                            </div>

                            <div v-if="errorMessage" class="alert alert-danger mt-4 d-flex align-items-center" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{{ errorMessage }}</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Statistiques et informations -->
            <div class="col-lg-4">
                <!-- Statistiques rapides -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">
                            <i class="bi bi-graph-up text-primary me-2"></i>
                            Statistiques
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid mb-4">
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-primary fw-bold">{{ todayGradesCount }}</div>
                                <div class="stat-label small text-muted">Aujourd'hui</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-success fw-bold">{{ weekGradesCount }}</div>
                                <div class="stat-label small text-muted">Cette semaine</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-info fw-bold">{{ recentAverage.toFixed(1) }}</div>
                                <div class="stat-label small text-muted">Moyenne récente</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-warning fw-bold">{{ monthGradesCount }}</div>
                                <div class="stat-label small text-muted">Ce mois</div>
                            </div>
                        </div>

                        <!-- Distribution des notes -->
                        <div class="grade-distribution">
                            <h6 class="fw-medium text-gray-700 mb-3">Distribution des notes</h6>
                            <div class="distribution-bar mb-2">
                                <div class="d-flex justify-content-between mb-1">
                                    <small class="text-muted">Excellent (16-20)</small>
                                    <small class="fw-medium">{{ excellentGradesCount }}</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-success" :style="{ width: excellentPercentage + '%' }"></div>
                                </div>
                            </div>
                            <div class="distribution-bar mb-2">
                                <div class="d-flex justify-content-between mb-1">
                                    <small class="text-muted">Bon (14-15.9)</small>
                                    <small class="fw-medium">{{ goodGradesCount }}</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-info" :style="{ width: goodPercentage + '%' }"></div>
                                </div>
                            </div>
                            <div class="distribution-bar mb-2">
                                <div class="d-flex justify-content-between mb-1">
                                    <small class="text-muted">Moyen (10-13.9)</small>
                                    <small class="fw-medium">{{ averageGradesCount }}</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-warning" :style="{ width: averagePercentage + '%' }"></div>
                                </div>
                            </div>
                            <div class="distribution-bar">
                                <div class="d-flex justify-content-between mb-1">
                                    <small class="text-muted">À améliorer (0-9.9)</small>
                                    <small class="fw-medium">{{ lowGradesCount }}</small>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-danger" :style="{ width: lowPercentage + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Guide rapide -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">
                            <i class="bi bi-info-circle text-primary me-2"></i>
                            Guide rapide
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="guide-item mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <i class="bi bi-check-circle text-success me-2"></i>
                                <h6 class="mb-0 fw-medium small">Validation automatique</h6>
                            </div>
                            <p class="small text-muted mb-0">Les notes sont validées en temps réel</p>
                        </div>
                        <div class="guide-item mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <i class="bi bi-clock text-warning me-2"></i>
                                <h6 class="mb-0 fw-medium small">Historique complet</h6>
                            </div>
                            <p class="small text-muted mb-0">Consultez les dernières évaluations</p>
                        </div>
                        <div class="guide-item">
                            <div class="d-flex align-items-center mb-1">
                                <i class="bi bi-bar-chart text-info me-2"></i>
                                <h6 class="mb-0 fw-medium small">Statistiques en direct</h6>
                            </div>
                            <p class="small text-muted mb-0">Suivez votre activité de saisie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dernières notes saisies -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-semibold">
                        <i class="bi bi-clock-history text-primary me-2"></i>
                        Journal des saisies
                    </h5>
                    <div class="d-flex align-items-center">
                        <button 
                            class="btn btn-sm btn-outline-secondary me-2"
                            @click="refreshGrades"
                            :disabled="loading.grades"
                        >
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-filter me-1"></i>
                                Filtres
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" @click.prevent="setGradeFilter('all')">Toutes les notes</a></li>
                                <li><a class="dropdown-item" href="#" @click.prevent="setGradeFilter('today')">Aujourd'hui</a></li>
                                <li><a class="dropdown-item" href="#" @click.prevent="setGradeFilter('week')">Cette semaine</a></li>
                                <li><a class="dropdown-item" href="#" @click.prevent="setGradeFilter('month')">Ce mois</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div v-if="loading.grades" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">Chargement des notes...</p>
                </div>
                <div v-else-if="recentGrades.length === 0" class="text-center py-5">
                    <div class="text-muted mb-3">
                        <i class="bi bi-journal-x fs-1"></i>
                    </div>
                    <h6 class="text-muted">Aucune note enregistrée</h6>
                    <p class="text-muted small">Commencez par saisir votre première évaluation</p>
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Étudiant</th>
                                <th>Cours</th>
                                <th>Type</th>
                                <th>Note</th>
                                <th>Date</th>
                                <th>Observations</th>
                                <th class="pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="grade in recentGrades" :key="grade.id">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <div class="student-avatar bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0 fw-medium">{{ grade.student?.matricule || 'N/A' }}</h6>
                                            <small class="text-muted">{{ grade.student?.class || '' }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="course-icon bg-info bg-opacity-10 text-info rounded-2 p-2 me-2">
                                            <i class="bi bi-journal-text"></i>
                                        </div>
                                        <div>
                                            <span class="fw-medium">{{ grade.course?.name || 'N/A' }}</span>
                                            <br>
                                            <small class="text-muted">{{ grade.course?.code || '' }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge" :class="getExamTypeClass(grade.exam_type)">
                                        {{ grade.exam_type }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="'grade-badge ' + getGradeClass(grade.grade)">
                                        {{ Number(grade.grade || 0).toFixed(1) }}/20
                                    </span>
                                </td>
                                <td>
                                    <span class="text-muted">{{ formatDate(grade.exam_date) }}</span>
                                </td>
                                <td>
                                    <span class="text-muted small">{{ grade.comment || '-' }}</span>
                                </td>
                                <td class="pe-4">
                                    <div class="d-flex gap-2">
                                        <button 
                                            class="btn btn-sm btn-outline-info"
                                            @click="viewGradeDetails(grade)"
                                            title="Voir les détails"
                                        >
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button 
                                            class="btn btn-sm btn-outline-danger"
                                            @click="confirmDelete(grade)"
                                            title="Supprimer"
                                        >
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div v-if="recentGrades.length > 0" class="border-top p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="text-muted small">
                            Affichage des {{ Math.min(recentGrades.length, 10) }} dernières notes
                        </div>
                        <div>
                            <button 
                                class="btn btn-sm btn-outline-primary"
                                @click="loadMoreGrades"
                                :disabled="loading.grades || recentGrades.length >= allGrades.length"
                            >
                                <i class="bi bi-arrow-down me-1"></i>
                                Charger plus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Légende des notes -->
        <div class="card border-0 shadow-sm mt-4">
            <div class="card-body">
                <h6 class="fw-semibold mb-3">Légende des notes</h6>
                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-success text-white me-2">16-20</span>
                            <div>
                                <small class="text-muted d-block">Excellent</small>
                                <small class="text-success">{{ excellentPercentage }}%</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-info text-white me-2">14-15.9</span>
                            <div>
                                <small class="text-muted d-block">Très bien</small>
                                <small class="text-info">{{ goodPercentage }}%</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-warning text-dark me-2">10-13.9</span>
                            <div>
                                <small class="text-muted d-block">Satisfaisant</small>
                                <small class="text-warning">{{ averagePercentage }}%</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-danger text-white me-2">0-9.9</span>
                            <div>
                                <small class="text-muted d-block">À améliorer</small>
                                <small class="text-danger">{{ lowPercentage }}%</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails de la note -->
        <div class="modal fade" id="gradeDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de la note</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="selectedGrade">
                        <div class="mb-4">
                            <h6 class="text-muted mb-3">Informations de l'étudiant</h6>
                            <div class="d-flex align-items-center mb-3">
                                <div class="student-avatar bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                                    <i class="bi bi-person fs-4"></i>
                                </div>
                                <div>
                                    <div class="text-muted small">
                                        <span class="me-3">Matricule: {{ selectedGrade.student?.matricule || 'N/A' }}</span>
                                        <span>Classe: {{ selectedGrade.student?.class || 'N/A' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="p-3 border rounded-2 h-100">
                                    <h6 class="text-muted mb-2">Matière</h6>
                                    <div class="d-flex align-items-center">
                                        <div class="course-icon bg-info bg-opacity-10 text-info rounded-2 p-2 me-2">
                                            <i class="bi bi-book"></i>
                                        </div>
                                        <div>
                                            <h5 class="mb-0">{{ selectedGrade.course?.name || 'N/A' }}</h5>
                                            <small class="text-muted">Coef. {{ selectedGrade.course?.coefficient || 'N/A' }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-2 h-100">
                                    <h6 class="text-muted mb-2">Note</h6>
                                    <div class="d-flex align-items-center">
                                        <div class="grade-badge me-3" :class="getGradeClass(selectedGrade.grade)">
                                            {{ parseFloat(selectedGrade.grade).toFixed(2) }}/20
                                        </div>
                                        <div>
                                            <div class="fw-medium">{{ getGradeStatus(selectedGrade.grade) }}</div>
                                            <small class="text-muted">Type: {{ selectedGrade.exam_type || 'N/A' }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h6 class="text-muted mb-3">Détails de l'évaluation</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="p-3 border rounded-2 h-100">
                                        <div class="text-muted small mb-1">Date de l'examen</div>
                                        <div class="fw-medium">{{ formatDate(selectedGrade.exam_date) }}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="p-3 border rounded-2 h-100">
                                        <div class="text-muted small mb-1">Enseignant</div>
                                        <div class="fw-medium">{{ selectedGrade.course?.teacher?.user?.name || 'Non assigné' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedGrade.comment" class="mb-3">
                            <h6 class="text-muted mb-2">Commentaires</h6>
                            <div class="p-3 bg-light rounded-2">
                                {{ selectedGrade.comment }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import { Modal } from 'bootstrap'

const authStore = useAuthStore()
const selectedGrade = ref(null)
let gradeDetailsModal = null

// Form data
const form = ref({
    student_id: '',
    course_id: '',
    grade: '',
    exam_type: '',
    exam_date: '',
    comment: ''
})

// Data states
const students = ref([])
const courses = ref([])
const allGrades = ref([]) // Toutes les notes chargées
const recentGrades = ref([]) // Notes affichées (limitées)
const selectedStudent = ref(null)
const selectedCourse = ref(null)

// UI states
const loading = ref({
    students: false,
    courses: false,
    grades: false,
    submit: false
})
const successMessage = ref('')
const errorMessage = ref('')
const gradeFilter = ref('all')
const displayLimit = ref(10)

// Date du jour
const today = new Date().toISOString().split('T')[0]

// Computed properties
const isFormValid = computed(() => {
    return form.value.student_id && 
           form.value.course_id && 
           form.value.grade !== '' && 
           form.value.exam_type && 
           form.value.exam_date
})

const filteredStudents = computed(() => {
    // Pour optimiser, on pourrait ajouter un champ de recherche ici
    return students.value
})

const availableCourses = computed(() => {
    if (!form.value.student_id) return []
    
    const student = students.value.find(s => s.id === form.value.student_id)
    if (!student) return []
    
    return courses.value.filter(c => c.class === student.class)
})

const studentAverage = computed(() => {
    if (!selectedStudent.value) return 0
    const studentGrades = allGrades.value.filter(g => g.student_id === selectedStudent.value.id)
    if (studentGrades.length === 0) return 0
    
    const sum = studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0)
    return (sum / studentGrades.length).toFixed(1)
})

// Statistiques optimisées
const todayGradesCount = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return allGrades.value.filter(g => g.exam_date === todayStr).length
})

const weekGradesCount = computed(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return allGrades.value.filter(g => new Date(g.exam_date) >= weekAgo).length
})

const monthGradesCount = computed(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    return allGrades.value.filter(g => new Date(g.exam_date) >= firstDay).length
})

const recentAverage = computed(() => {
    if (allGrades.value.length === 0) return 0
    const sum = allGrades.value.reduce((acc, g) => acc + parseFloat(g.grade), 0)
    return sum / allGrades.value.length
})

// Distribution des notes optimisée
const excellentGradesCount = computed(() => 
    allGrades.value.filter(g => g.grade >= 16).length
)

const goodGradesCount = computed(() => 
    allGrades.value.filter(g => g.grade >= 14 && g.grade < 16).length
)

const averageGradesCount = computed(() => 
    allGrades.value.filter(g => g.grade >= 10 && g.grade < 14).length
)

const lowGradesCount = computed(() => 
    allGrades.value.filter(g => g.grade < 10).length
)

const excellentPercentage = computed(() => 
    allGrades.value.length ? Math.round((excellentGradesCount.value / allGrades.value.length) * 100) : 0
)

const goodPercentage = computed(() => 
    allGrades.value.length ? Math.round((goodGradesCount.value / allGrades.value.length) * 100) : 0
)

const averagePercentage = computed(() => 
    allGrades.value.length ? Math.round((averageGradesCount.value / allGrades.value.length) * 100) : 0
)

const lowPercentage = computed(() => 
    allGrades.value.length ? Math.round((lowGradesCount.value / allGrades.value.length) * 100) : 0
)

// Methods
const loadStudents = async () => {
    loading.value.students = true
    try {
        const { data } = await api.getStudents()
        students.value = data
    } catch (error) {
        console.error('Erreur chargement étudiants:', error)
        errorMessage.value = 'Erreur lors du chargement des étudiants'
    } finally {
        loading.value.students = false
    }
}

const loadCourses = async () => {
    loading.value.courses = true
    try {
        const { data } = await api.getCourses()
        courses.value = data
    } catch (error) {
        console.error('Erreur chargement cours:', error)
        errorMessage.value = 'Erreur lors du chargement des cours'
    } finally {
        loading.value.courses = false
    }
}

// Méthode OPTIMISÉE pour charger les notes
const loadGradesOptimized = async () => {
    loading.value.grades = true
    try {
        // Essayer d'abord avec l'API optimisée
        try {
            const { data } = await api.getRecentGrades({ 
                limit: 50,
                teacher_id: user.value.teacher?.id // Si vous voulez filtrer par professeur
            })
            allGrades.value = data
        } catch (e) {
            // Fallback si l'API n'est pas disponible
            console.warn('API récente non disponible, utilisation du fallback')
            await loadGradesFallback()
        }
        
        applyGradeFilters()
    } catch (error) {
        console.error('Erreur chargement notes:', error)
        errorMessage.value = 'Erreur lors du chargement des notes'
    } finally {
        loading.value.grades = false
    }
}

// Fallback si l'API optimisée n'existe pas encore
const loadGradesFallback = async () => {
    try {
        // Charger seulement les 20 premières notes au lieu de toutes
        const { data } = await api.getGrades({ limit: 20 })
        allGrades.value = data
        applyGradeFilters()
    } catch (error) {
        console.error('Erreur fallback chargement notes:', error)
    }
}

const applyGradeFilters = () => {
    let filtered = [...allGrades.value]
    
    // Appliquer le filtre temporel
    if (gradeFilter.value === 'today') {
        const todayStr = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(g => g.exam_date === todayStr)
    } else if (gradeFilter.value === 'week') {
        const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(g => new Date(g.exam_date) >= weekAgo)
    } else if (gradeFilter.value === 'month') {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        filtered = filtered.filter(g => new Date(g.exam_date) >= firstDay)
    }
    
    // Trier par date décroissante et limiter l'affichage
    recentGrades.value = filtered
        .sort((a, b) => new Date(b.exam_date) - new Date(a.exam_date))
        .slice(0, displayLimit.value)
}

const onStudentChange = () => {
    if (!form.value.student_id) {
        selectedStudent.value = null
        form.value.course_id = ''
        return
    }
    
    selectedStudent.value = students.value.find(s => s.id === form.value.student_id)
    form.value.course_id = ''
    
    // Mettre à jour le cours sélectionné si disponible
    if (selectedStudent.value && form.value.course_id) {
        selectedCourse.value = courses.value.find(c => c.id === form.value.course_id)
    }
}

const validateGrade = () => {
    if (form.value.grade > 20) form.value.grade = 20
    if (form.value.grade < 0) form.value.grade = 0
}

const handleSubmit = async () => {
    if (!isFormValid.value) {
        errorMessage.value = 'Veuillez remplir tous les champs obligatoires'
        return
    }
    
    loading.value.submit = true
    successMessage.value = ''
    errorMessage.value = ''
    
    try {
        await api.createGrade(form.value)
        
        successMessage.value = 'Note enregistrée avec succès !'
        
        // Recharger les notes (optimisé)
        await loadGradesOptimized()
        
        // Réinitialiser le formulaire
        resetForm()
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
            successMessage.value = ''
        }, 3000)
        
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'enregistrement de la note'
    } finally {
        loading.value.submit = false
    }
}

const resetForm = () => {
    form.value = {
        student_id: '',
        course_id: '',
        grade: '',
        exam_type: '',
        exam_date: today,
        comment: ''
    }
    selectedStudent.value = null
    selectedCourse.value = null
}

const refreshData = async () => {
    await Promise.all([
        loadStudents(),
        loadCourses(),
        loadGradesOptimized()
    ])
}

const refreshGrades = async () => {
    await loadGradesOptimized()
}

const setGradeFilter = (filter) => {
    gradeFilter.value = filter
    applyGradeFilters()
}

const loadMoreGrades = () => {
    displayLimit.value += 10
    applyGradeFilters()
}

const viewGradeDetails = (grade) => {
    selectedGrade.value = grade
    gradeDetailsModal.show()
}

const confirmDelete = (grade) => {
    if (!confirm(`Supprimer la note de ${grade.student?.user?.name} en ${grade.course?.name} ?`)) {
        return
    }
    deleteGrade(grade.id)
}

const deleteGrade = async (gradeId) => {
    try {
        await api.deleteGrade(gradeId)
        successMessage.value = 'Note supprimée avec succès'
        
        // Mettre à jour les listes
        allGrades.value = allGrades.value.filter(g => g.id !== gradeId)
        applyGradeFilters()
        
        setTimeout(() => {
            successMessage.value = ''
        }, 3000)
        
    } catch (error) {
        console.error('Erreur suppression:', error)
        errorMessage.value = 'Erreur lors de la suppression de la note'
    }
}

// Helper functions
const getGradeClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

const getGradeTextClass = (grade) => {
    if (grade >= 16) return 'text-success fw-bold'
    if (grade >= 14) return 'text-info fw-bold'
    if (grade >= 10) return 'text-warning fw-bold'
    return 'text-danger fw-bold'
}

const getGradeStatus = (grade) => {
    if (!grade) return 'Non noté'
    if (grade >= 16) return 'Excellent'
    if (grade >= 14) return 'Très bien'
    if (grade >= 12) return 'Bien'
    if (grade >= 10) return 'Satisfaisant'
    return 'Insuffisant'
}

const getProgressBarClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

const getExamTypeClass = (type) => {
    const classes = {
        'examen': 'bg-danger-subtle text-danger',
        'devoir': 'bg-warning-subtle text-warning',
        'quiz': 'bg-info-subtle text-info',
        'oral': 'bg-primary-subtle text-primary',
        'controle': 'bg-success-subtle text-success'
    }
    return classes[type] || 'bg-secondary-subtle text-secondary'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Lifecycle
onMounted(async () => {
    form.value.exam_date = today
    
    // Chargement initial optimisé
    await Promise.all([
        loadStudents(),
        loadCourses(),
        loadGradesOptimized()
    ])
    gradeDetailsModal = new Modal(document.getElementById('gradeDetailsModal'))
})
</script>

<style scoped>
.grade-entry-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.grades-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.grade-form .input-group {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.grade-form .input-group:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.grade-form .form-control,
.grade-form .form-select {
    border: none;
    background-color: white;
}

.grade-form .form-control:focus,
.grade-form .form-select:focus {
    box-shadow: none;
    background-color: white;
}

.student-avatar, .course-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.grade-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
}

.grade-indicator .progress {
    background-color: #f1f5f9;
    border-radius: 10px;
}

.grade-indicator .progress-bar {
    border-radius: 10px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.stat-item {
    transition: all 0.2s ease;
    border: 1px solid #e5e7eb;
}

.stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
    font-size: 1.5rem;
    line-height: 1.2;
}

.stat-label {
    margin-top: 0.25rem;
}

.distribution-bar .progress {
    background-color: #f1f5f9;
    border-radius: 4px;
}

.guide-item {
    padding: 0.75rem;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.guide-item:hover {
    background-color: #f8fafc;
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

/* Styles pour la modale */
.modal-content {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 1.25rem 1.5rem;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 1rem 1.5rem;
}

/* Animation de la modale */
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal.fade .modal-dialog {
    animation: modalFadeIn 0.3s ease-out;
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

.grade-entry-container > * {
    animation: fadeInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .grades-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .grades-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>