<template>
    <div class="users-management-container p-4">
        <!-- En-tête -->
        <div class="users-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">
                        <i class="bi bi-people-fill me-2"></i>
                        Gestion des utilisateurs
                    </h1>
                    <p class="text-muted mb-0">
                        Gérez les comptes, rôles et permissions de tous les utilisateurs du système
                    </p>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                        <small class="text-muted d-block">Total utilisateurs</small>
                        <span class="badge bg-primary">{{ totalUsers }}</span>
                    </div>
                    <button 
                        class="btn btn-primary d-flex align-items-center"
                        @click="openCreateModal"
                    >
                        <i class="bi bi-person-plus me-2"></i>
                        Nouvel utilisateur
                    </button>
                </div>
            </div>
        </div>

        <!-- Filtres et statistiques -->
        <div class="row g-4 mb-6">
            <div class="col-xl-9">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">
                            <i class="bi bi-funnel text-primary me-2"></i>
                            Filtres et recherche
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label fw-medium text-gray-700">Rôle</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-person-badge text-muted"></i>
                                    </span>
                                    <select v-model="filterRole" class="form-select border-start-0">
                                        <option value="">Tous les rôles</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="teacher">Enseignant</option>
                                        <option value="student">Étudiant</option>
                                        <option value="parent">Parent</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label fw-medium text-gray-700">Recherche</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-search text-muted"></i>
                                    </span>
                                    <input 
                                        v-model="searchQuery" 
                                        type="text" 
                                        class="form-control border-start-0"
                                        placeholder="Rechercher par nom, email ou matricule..."
                                        @input="debounceSearch"
                                    >
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-medium text-gray-700">Statut</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-circle-fill text-muted"></i>
                                    </span>
                                    <select v-model="filterStatus" class="form-select border-start-0">
                                        <option value="">Tous les statuts</option>
                                        <option value="active">Actif</option>
                                        <option value="inactive">Inactif</option>
                                        <option value="pending">En attente</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body d-flex flex-column justify-content-center">
                        <div class="stats-summary">
                            <div class="stat-item d-flex justify-content-between mb-2">
                                <span class="text-muted">Administrateurs</span>
                                <span class="badge bg-danger">{{ adminCount }}</span>
                            </div>
                            <div class="stat-item d-flex justify-content-between mb-2">
                                <span class="text-muted">Enseignants</span>
                                <span class="badge bg-primary">{{ teacherCount }}</span>
                            </div>
                            <div class="stat-item d-flex justify-content-between mb-2">
                                <span class="text-muted">Étudiants</span>
                                <span class="badge bg-success">{{ studentCount }}</span>
                            </div>
                            <div class="stat-item d-flex justify-content-between">
                                <span class="text-muted">Parents</span>
                                <span class="badge bg-info">{{ parentCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="card border-0 shadow-sm mb-6">
            <div class="card-header bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-semibold">Liste des utilisateurs</h5>
                    <div class="text-muted small">
                        Affichage de {{ filteredUsers.length }} utilisateur(s)
                    </div>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Utilisateur</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Informations spécifiques</th>
                                <th>Date d'inscription</th>
                                <th class="pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in paginatedUsers" :key="user.id">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <div class="user-avatar bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0 fw-medium">{{ user.name }}</h6>
                                            <small class="text-muted">ID: {{ user.id }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="text-muted">{{ user.email }}</span>
                                </td>
                                <td>
                                    <span class="badge" :class="getRoleBadgeClass(user.role)">
                                        {{ getRoleLabel(user.role) }}
                                    </span>
                                </td>
                                <td>
                                    <div v-if="user.student" class="specific-info">
                                        <small class="text-muted d-block">Étudiant</small>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="badge bg-light text-dark">{{ user.student.matricule }}</span>
                                            <span class="badge bg-info-subtle text-info">{{ user.student.class }}</span>
                                        </div>
                                    </div>
                                    <div v-else-if="user.teacher" class="specific-info">
                                        <small class="text-muted d-block">Enseignant</small>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="badge bg-light text-dark">{{ user.teacher.subject }}</span>
                                            <span class="badge bg-primary-subtle text-primary">{{ user.teacher.phone }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-muted small">
                                        Aucune information spécifique
                                    </div>
                                </td>
                                <td>
                                    <span class="text-muted">{{ formatDate(user.created_at) }}</span>
                                </td>
                                <td class="pe-4">
                                    <div class="d-flex gap-2">
                                        <button 
                                            class="btn btn-sm btn-outline-info"
                                            @click="viewUserDetails(user)"
                                            title="Voir les détails"
                                        >
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button 
                                            class="btn btn-sm btn-outline-warning"
                                            @click="editUser(user)"
                                            title="Modifier"
                                        >
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            class="btn btn-sm btn-outline-primary"
                                            @click="changeUserRole(user)"
                                            title="Changer le rôle"
                                            :disabled="user.id === currentUserId"
                                        >
                                            <i class="bi bi-arrow-left-right"></i>
                                        </button>
                                        <button 
                                            class="btn btn-sm btn-outline-danger"
                                            @click="confirmDeleteUser(user)"
                                            title="Supprimer"
                                            :disabled="user.id === currentUserId"
                                        >
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Message si aucun résultat -->
                <div v-if="filteredUsers.length === 0" class="text-center py-5">
                    <div class="text-muted mb-3">
                        <i class="bi bi-people fs-1"></i>
                    </div>
                    <h6 class="text-muted">Aucun utilisateur trouvé</h6>
                    <p class="text-muted small">Essayez de modifier vos critères de recherche</p>
                </div>

                <!-- Pagination -->
                <div v-if="filteredUsers.length > itemsPerPage" class="border-top p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="text-muted small">
                            Page {{ currentPage }} sur {{ totalPages }} - 
                            Affichage de {{ startIndex + 1 }} à {{ endIndex }} 
                            sur {{ filteredUsers.length }} utilisateurs
                        </div>
                        <nav aria-label="Pagination des utilisateurs">
                            <ul class="pagination mb-0">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page in Math.ceil(filteredUsers.length / itemsPerPage)" 
                                    :key="page" 
                                    class="page-item" 
                                    :class="{ active: currentPage === page }">
                                    <button class="page-link" @click="currentPage = page">
                                        {{ page }}
                                    </button>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage >= Math.ceil(filteredUsers.length / itemsPerPage) }">
                                    <button 
                                        class="page-link" 
                                        @click="currentPage++" 
                                        :disabled="currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal d'ajout/modification d'utilisateur -->
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-white border-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi me-2" :class="editing ? 'bi-pencil-square text-warning' : 'bi-person-plus text-primary'"></i>
                            {{ editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="handleSubmit" class="user-form">
                            <div class="row g-4">
                                <div class="col-md-12">
                                    <h6 class="fw-semibold mb-3 text-primary">
                                        <i class="bi bi-person-circle me-2"></i>
                                        Informations personnelles
                                    </h6>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Nom complet
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.name" 
                                            type="text" 
                                            class="form-control border-start-0"
                                            placeholder="Jean Dupont"
                                            required
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Adresse email
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-envelope text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.email" 
                                            type="email" 
                                            class="form-control border-start-0"
                                            placeholder="jean.dupont@ecole.fr"
                                            required
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        {{ editing ? 'Nouveau mot de passe' : 'Mot de passe' }}
                                        <span class="text-danger" v-if="!editing">*</span>
                                        <small class="text-muted ms-1" v-else>(laisser vide pour ne pas changer)</small>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-lock text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.password" 
                                            :type="showPassword ? 'text' : 'password'"
                                            class="form-control border-start-0 border-end-0"
                                            :placeholder="editing ? 'Nouveau mot de passe...' : '••••••••'"
                                            :required="!editing"
                                            minlength="8"
                                        >
                                        <button 
                                            type="button" 
                                            class="input-group-text bg-light border-start-0"
                                            @click="showPassword = !showPassword"
                                        >
                                            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                        </button>
                                    </div>
                                    <small class="text-muted">Minimum 8 caractères</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Rôle
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-person-badge text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.role" 
                                            class="form-select border-start-0"
                                            required
                                            @change="onRoleChange"
                                        >
                                            <option value="">Sélectionnez un rôle</option>
                                            <option value="admin">Administrateur</option>
                                            <option value="teacher">Enseignant</option>
                                            <option value="student">Étudiant</option>
                                            <option value="parent">Parent</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Informations spécifiques selon le rôle -->
                                <div v-if="form.role === 'teacher'" class="col-md-12">
                                    <h6 class="fw-semibold mb-3 text-primary mt-3">
                                        <i class="bi bi-mortarboard me-2"></i>
                                        Informations enseignant
                                    </h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Matière enseignée
                                                <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-book text-muted"></i>
                                                </span>
                                                <input 
                                                    v-model="form.subject" 
                                                    type="text" 
                                                    class="form-control border-start-0"
                                                    placeholder="Mathématiques"
                                                    required
                                                >
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Numéro de téléphone
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-telephone text-muted"></i>
                                                </span>
                                                <input 
                                                    v-model="form.phone" 
                                                    type="tel" 
                                                    class="form-control border-start-0"
                                                    placeholder="034 XX XXX XX"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="form.role === 'student'" class="col-md-12">
                                    <h6 class="fw-semibold mb-3 text-primary mt-3">
                                        <i class="bi bi-mortarboard-fill me-2"></i>
                                        Informations étudiant
                                    </h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Classe
                                                <span class="text-danger">*</span>
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-building text-muted"></i>
                                                </span>
                                                <select 
                                                    v-model="form.class" 
                                                    class="form-select border-start-0"
                                                    required
                                                >
                                                    <option value="">Sélectionnez une classe</option>
                                                    <option value="6ème">6ème</option>
                                                    <option value="5ème">5ème</option>
                                                    <option value="4ème">4ème</option>
                                                    <option value="3ème">3ème</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Date de naissance
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-calendar3 text-muted"></i>
                                                </span>
                                                <input 
                                                    v-model="form.date_of_birth" 
                                                    type="date" 
                                                    class="form-control border-start-0"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations parents -->
                                <div v-if="form.role === 'parent'" class="col-md-12">
                                    <h6 class="fw-semibold mb-3 text-primary mt-3">
                                        <i class="bi bi-people-fill me-2"></i>
                                        Informations parent
                                    </h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Relation avec l'étudiant
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-person-heart text-muted"></i>
                                                </span>
                                                <select v-model="form.relation" class="form-select border-start-0">
                                                    <option value="">Sélectionnez la relation</option>
                                                    <option value="mother">Mère</option>
                                                    <option value="father">Père</option>
                                                    <option value="guardian">Tuteur légal</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-medium text-gray-700">
                                                Étudiant lié
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-end-0">
                                                    <i class="bi bi-person-plus text-muted"></i>
                                                </span>
                                                <select v-model="form.student_id" class="form-select border-start-0">
                                                    <option value="">Sélectionnez un étudiant</option>
                                                    <option 
                                                        v-for="student in students" 
                                                        :key="student.id" 
                                                        :value="student.id"
                                                    >
                                                        {{ student.user.name }} - {{ student.class }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Statut -->
                                <div class="col-md-12 mt-3">
                                    <label class="form-label fw-medium text-gray-700">Statut du compte</label>
                                    <div class="d-flex gap-4">
                                        <div class="form-check">
                                            <input 
                                                v-model="form.status" 
                                                value="active" 
                                                type="radio" 
                                                class="form-check-input" 
                                                id="statusActive"
                                            >
                                            <label class="form-check-label" for="statusActive">
                                                <span class="badge bg-success">Actif</span>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input 
                                                v-model="form.status" 
                                                value="inactive" 
                                                type="radio" 
                                                class="form-check-input" 
                                                id="statusInactive"
                                            >
                                            <label class="form-check-label" for="statusInactive">
                                                <span class="badge bg-secondary">Inactif</span>
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input 
                                                v-model="form.status" 
                                                value="pending" 
                                                type="radio" 
                                                class="form-check-input" 
                                                id="statusPending"
                                            >
                                            <label class="form-check-label" for="statusPending">
                                                <span class="badge bg-warning">En attente</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer border-0 pt-4">
                                <button 
                                    type="button" 
                                    class="btn btn-outline-secondary"
                                    @click="closeModal"
                                >
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
                                        {{ editing ? 'Mettre à jour' : 'Créer l\'utilisateur' }}
                                    </span>
                                    <span v-else class="d-flex align-items-center">
                                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Enregistrement...
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de changement de rôle -->
        <div v-if="showRoleModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-white border-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-arrow-left-right text-primary me-2"></i>
                            Changer le rôle
                        </h5>
                        <button type="button" class="btn-close" @click="showRoleModal = false"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="user-info mb-4">
                            <div class="d-flex align-items-center">
                                <div class="user-avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                                    <i class="bi bi-person fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-1">{{ selectedUser?.name }}</h6>
                                    <p class="text-muted mb-0">{{ selectedUser?.email }}</p>
                                    <span class="badge" :class="getRoleBadgeClass(selectedUser?.role)">
                                        {{ getRoleLabel(selectedUser?.role) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-medium text-gray-700 mb-3">
                                Nouveau rôle
                            </label>
                            <div class="role-options">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="role-option p-3 border rounded-3 text-center" 
                                             :class="{ 'border-primary': newRole === 'admin' }"
                                             @click="newRole = 'admin'">
                                            <i class="bi bi-shield-fill text-danger fs-3 mb-2"></i>
                                            <h6 class="mb-1">Administrateur</h6>
                                            <small class="text-muted">Accès complet</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="role-option p-3 border rounded-3 text-center" 
                                             :class="{ 'border-primary': newRole === 'teacher' }"
                                             @click="newRole = 'teacher'">
                                            <i class="bi bi-mortarboard-fill text-primary fs-3 mb-2"></i>
                                            <h6 class="mb-1">Enseignant</h6>
                                            <small class="text-muted">Gestion des cours</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="role-option p-3 border rounded-3 text-center" 
                                             :class="{ 'border-primary': newRole === 'student' }"
                                             @click="newRole = 'student'">
                                            <i class="bi bi-person-fill text-success fs-3 mb-2"></i>
                                            <h6 class="mb-1">Étudiant</h6>
                                            <small class="text-muted">Accès aux cours</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="role-option p-3 border rounded-3 text-center" 
                                             :class="{ 'border-primary': newRole === 'parent' }"
                                             @click="newRole = 'parent'">
                                            <i class="bi bi-people-fill text-info fs-3 mb-2"></i>
                                            <h6 class="mb-1">Parent</h6>
                                            <small class="text-muted">Suivi des enfants</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Le changement de rôle peut affecter les permissions et accès de l'utilisateur.
                        </div>

                        <div class="modal-footer border-0 pt-3">
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary"
                                @click="showRoleModal = false"
                            >
                                Annuler
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-primary"
                                @click="confirmRoleChange"
                                :disabled="loading.roleChange || !newRole || newRole === selectedUser?.role"
                            >
                                <span v-if="!loading.roleChange">
                                    Confirmer le changement
                                </span>
                                <span v-else class="d-flex align-items-center">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Modification...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import { debounce } from 'lodash'

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

// États
const users = ref([])
const students = ref([])
const showModal = ref(false)
const showRoleModal = ref(false)
const editing = ref(null)
const loading = ref({
    users: false,
    students: false,
    submit: false,
    roleChange: false
})
const filterRole = ref('')
const filterStatus = ref('')
const searchQuery = ref('')
const selectedUser = ref(null)
const newRole = ref('')
const showPassword = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(15)

// Form data
const form = ref({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'active',
    // Teacher specific
    subject: '',
    phone: '',
    // Student specific
    class: '',
    date_of_birth: '',
    // Parent specific
    relation: '',
    student_id: ''
})

// Computed properties
const totalUsers = computed(() => users.value.length)

const adminCount = computed(() => 
    users.value.filter(u => u.role === 'admin').length
)

const teacherCount = computed(() => 
    users.value.filter(u => u.role === 'teacher').length
)

const studentCount = computed(() => 
    users.value.filter(u => u.role === 'student').length
)

const parentCount = computed(() => 
    users.value.filter(u => u.role === 'parent').length
)

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const matchRole = !filterRole.value || user.role === filterRole.value
        const matchStatus = !filterStatus.value || user.status === filterStatus.value
        
        const matchSearch = !searchQuery.value || 
            user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (user.student?.matricule && user.student.matricule.toLowerCase().includes(searchQuery.value.toLowerCase()))
        
        return matchRole && matchStatus && matchSearch
    })
})

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredUsers.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => 
    Math.ceil(filteredUsers.value.length / itemsPerPage.value)
)

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length))

const isFormValid = computed(() => {
    const baseValid = form.value.name && form.value.email && form.value.role
    
    if (!editing.value && !form.value.password) return false
    if (form.value.password && form.value.password.length < 8) return false
    
    if (form.value.role === 'teacher' && !form.value.subject) return false
    if (form.value.role === 'student' && !form.value.class) return false
    
    return baseValid
})

// Méthodes
const loadUsers = async () => {
    loading.value.users = true
    try {
        const { data } = await api.getUsers()
        users.value = data
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error)
    } finally {
        loading.value.users = false
    }
}

const loadStudents = async () => {
    loading.value.students = true
    try {
        const { data } = await api.getStudents()
        students.value = data
    } catch (error) {
        console.error('Erreur chargement étudiants:', error)
    } finally {
        loading.value.students = false
    }
}

const debounceSearch = debounce(() => {
    currentPage.value = 1
}, 300)

const openCreateModal = () => {
    editing.value = null
    resetForm()
    showModal.value = true
}

const editUser = (user) => {
    editing.value = user.id
    form.value = {
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status || 'active',
        subject: user.teacher?.subject || '',
        phone: user.teacher?.phone || '',
        class: user.student?.class || '',
        date_of_birth: user.student?.date_of_birth || '',
        relation: '',
        student_id: user.parent?.student_id || ''
    }
    showModal.value = true
}

const viewUserDetails = (user) => {
    // Navigation vers la page de détail de l'utilisateur
    console.log('Voir détails de l\'utilisateur:', user)
}

const changeUserRole = (user) => {
    selectedUser.value = user
    newRole.value = user.role
    showRoleModal.value = true
}

const confirmDeleteUser = (user) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ? Cette action est irréversible.`)) {
        return
    }
    deleteUser(user.id)
}

const deleteUser = async (id) => {
    if (id === currentUserId.value) {
        alert('Vous ne pouvez pas supprimer votre propre compte')
        return
    }
    
    try {
        await api.deleteUser(id)
        await loadUsers()
    } catch (error) {
        console.error('Erreur suppression:', error)
        alert('Erreur lors de la suppression de l\'utilisateur')
    }
}

const confirmRoleChange = async () => {
    if (!selectedUser.value || !newRole.value || newRole.value === selectedUser.value.role) {
        return
    }
    
    loading.value.roleChange = true
    try {
        await api.changeUserRole(selectedUser.value.id, { role: newRole.value })
        await loadUsers()
        showRoleModal.value = false
    } catch (error) {
        console.error('Erreur changement rôle:', error)
        alert('Erreur lors du changement de rôle')
    } finally {
        loading.value.roleChange = false
    }
}

const handleSubmit = async () => {
    if (!isFormValid.value) {
        alert('Veuillez remplir tous les champs obligatoires')
        return
    }
    
    loading.value.submit = true
    try {
        // Préparer les données selon le rôle
        const userData = { ...form.value }
        
        // Retirer les champs vides pour la mise à jour
        if (editing.value && !userData.password) {
            delete userData.password
        }
        
        if (editing.value) {
            await api.updateUser(editing.value, userData)
        } else {
            await api.createUser(userData)
        }
        
        await loadUsers()
        closeModal()
    } catch (error) {
        console.error('Erreur enregistrement:', error)
        alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    } finally {
        loading.value.submit = false
    }
}

const closeModal = () => {
    showModal.value = false
    editing.value = null
    resetForm()
}

const resetForm = () => {
    form.value = {
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'active',
        subject: '',
        phone: '',
        class: '',
        date_of_birth: '',
        relation: '',
        student_id: ''
    }
    showPassword.value = false
}

const onRoleChange = () => {
    // Réinitialiser les champs spécifiques au rôle
    form.value.subject = ''
    form.value.phone = ''
    form.value.class = ''
    form.value.date_of_birth = ''
    form.value.relation = ''
    form.value.student_id = ''
}

// Fonctions utilitaires
const getRoleBadgeClass = (role) => {
    const classes = {
        admin: 'bg-danger text-white',
        teacher: 'bg-primary text-white',
        student: 'bg-success text-white',
        parent: 'bg-info text-white'
    }
    return classes[role] || 'bg-secondary text-white'
}

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Administrateur',
        teacher: 'Enseignant',
        student: 'Étudiant',
        parent: 'Parent'
    }
    return labels[role] || role
}

const formatDate = (date) => {
    if (!date) return 'Non disponible'
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Lifecycle
onMounted(async () => {
    await Promise.all([
        loadUsers(),
        loadStudents()
    ])
})

// Watchers
watch([filterRole, filterStatus, searchQuery], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.users-management-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.users-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.user-avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-avatar-lg {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.specific-info {
    min-width: 150px;
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

.bg-info-subtle {
    background-color: rgba(14, 165, 233, 0.1);
    color: #0EA5E9;
}

.bg-danger-subtle {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
}

/* Formulaire */
.user-form .input-group {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.user-form .input-group:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.user-form .form-control,
.user-form .form-select {
    border: none;
    background-color: white;
}

.user-form .form-control:focus,
.user-form .form-select:focus {
    box-shadow: none;
    background-color: white;
}

/* Options de rôle */
.role-option {
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.role-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.role-option.border-primary {
    border-color: #3B82F6 !important;
    background-color: rgba(59, 130, 246, 0.05);
}

/* Boutons */
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

/* Modal */
.modal-content {
    animation: modalFadeIn 0.3s ease-out;
}

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

.users-management-container > * {
    animation: fadeInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .users-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .users-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .role-options .col-6 {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>