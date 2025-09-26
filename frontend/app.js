const API_BASE = window.location.origin + '/api';

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkPasswordStrength(password) {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
  return 'medium';
}

function updatePasswordStrength(password) {
  const strengthDiv = document.getElementById('password-strength');
  if (!strengthDiv) return;
  
  if (!password) {
    strengthDiv.classList.add('hidden');
    return;
  }
  
  const strength = checkPasswordStrength(password);
  strengthDiv.classList.remove('hidden', 'weak', 'medium', 'strong');
  strengthDiv.classList.add(strength);
  
  const messages = {
    weak: 'Password is too weak',
    medium: 'Password is okay',
    strong: 'Password is strong'
  };
  
  strengthDiv.textContent = messages[strength];
}

const els = {
  // Navigation
  navLogin: document.getElementById('nav-login'),
  navRegister: document.getElementById('nav-register'),
  navDashboard: document.getElementById('nav-dashboard'),
  navAppointments: document.getElementById('nav-appointments'),
  navProfile: document.getElementById('nav-profile'),
  navSleepStudy: document.getElementById('nav-sleep-study'),
  navHealth: document.getElementById('nav-health'),
  navAdmin: document.getElementById('nav-admin'),
  navLogout: document.getElementById('nav-logout'),

  // Auth section
  authSection: document.getElementById('auth-section'),
  tabs: document.querySelectorAll('.tabs button'),
  loginEmail: document.getElementById('login-email'),
  loginPassword: document.getElementById('login-password'),
  loginBtn: document.getElementById('login-btn'),
  regName: document.getElementById('reg-name'),
  regPhone: document.getElementById('reg-phone'),
  regEmail: document.getElementById('reg-email'),
  regPassword: document.getElementById('reg-password'),
  regRole: document.getElementById('reg-role'),
  passwordStrength: document.getElementById('password-strength'),
  sendOtpBtn: document.getElementById('send-otp-btn'),
  otpCode: document.getElementById('otp-code'),
  verifyOtpBtn: document.getElementById('verify-otp-btn'),
  registerBtn: document.getElementById('register-btn'),
  authMessage: document.getElementById('auth-message'),
  loginMessage: document.getElementById('login-message'),

  // Dashboard
  userInfo: document.getElementById('user-info'),
  dashboardTab: document.getElementById('dashboard-tab'),
  appointmentsTab: document.getElementById('appointments-tab'),
  profileTab: document.getElementById('profile-tab'),
  sleepStudyTab: document.getElementById('sleep-study-tab'),
  healthTab: document.getElementById('health-tab'),
  
  // Dashboard content
  dashboardContent: document.getElementById('dashboard-content'),
  appointmentsContent: document.getElementById('appointments-content'),
  profileContent: document.getElementById('profile-content'),
  sleepStudyContent: document.getElementById('sleep-study-content'),
  healthContent: document.getElementById('health-content'),
  
  // Quick actions
  bookAppointmentBtn: document.getElementById('book-appointment-btn'),
  requestSleepStudyBtn: document.getElementById('request-sleep-study-btn'),
  updateProfileBtn: document.getElementById('update-profile-btn'),
  
  // Dashboard data
  recentAppointments: document.getElementById('recent-appointments'),
  doctorsList: document.getElementById('doctors-list'),
  
  // Appointments
  appointmentForm: document.getElementById('appointment-form'),
  doctorSelect: document.getElementById('doctor-select'),
  apptDatetime: document.getElementById('appt-datetime'),
  apptReason: document.getElementById('appt-reason'),
  bookBtn: document.getElementById('book-btn'),
  bookMessage: document.getElementById('book-message'),
  appointmentsList: document.getElementById('appointments-list'),
  refreshDoctorsBtn: document.getElementById('refresh-doctors-btn'),
  
  // Profile
  profileForm: document.getElementById('profile-form'),
  profileName: document.getElementById('profile-name'),
  profilePhone: document.getElementById('profile-phone'),
  profileEmail: document.getElementById('profile-email'),
  profileDob: document.getElementById('profile-dob'),
  profileGender: document.getElementById('profile-gender'),
  profileAddress: document.getElementById('profile-address'),
  profileEmergency: document.getElementById('profile-emergency'),
  profileMedical: document.getElementById('profile-medical'),
  profileAllergies: document.getElementById('profile-allergies'),
  profileMedications: document.getElementById('profile-medications'),
  profileSaveBtn: document.getElementById('profile-save-btn'),
  profileMessage: document.getElementById('profile-message'),
  
  // Sleep Study
  sleepStudyForm: document.getElementById('sleep-study-form'),
  studyDoctor: document.getElementById('study-doctor'),
  studyDate: document.getElementById('study-date'),
  studyType: document.getElementById('study-type'),
  studyNotes: document.getElementById('study-notes'),
  studySubmitBtn: document.getElementById('study-submit-btn'),
  studyMessage: document.getElementById('study-message'),
  sleepStudiesList: document.getElementById('sleep-studies-list'),
  refreshSleepDoctorsBtn: document.getElementById('refresh-sleep-doctors-btn'),
  
  // Health
  yogaBtn: document.getElementById('yoga-btn'),
  meditationBtn: document.getElementById('meditation-btn'),
  assessmentBtn: document.getElementById('assessment-btn'),
  yogaContent: document.getElementById('yoga-content'),
  meditationContent: document.getElementById('meditation-content'),
  assessmentContent: document.getElementById('assessment-content'),
  yogaVideos: document.getElementById('yoga-videos'),
  meditationVideos: document.getElementById('meditation-videos'),
  assessmentForm: document.getElementById('assessment-form'),

  // Admin section
  adminSection: document.getElementById('admin-section'),
  userSection: document.getElementById('user-section'),
  adminDoctorsTab: document.getElementById('admin-doctors-tab'),
  adminUsersTab: document.getElementById('admin-users-tab'),
  adminDoctors: document.getElementById('admin-doctors'),
  adminUsers: document.getElementById('admin-users'),
  adminDoctorForm: document.getElementById('admin-doctor-form'),
  adminDoctorName: document.getElementById('admin-doctor-name'),
  adminDoctorEmail: document.getElementById('admin-doctor-email'),
  adminDoctorPhone: document.getElementById('admin-doctor-phone'),
  adminDoctorSpecialty: document.getElementById('admin-doctor-specialty'),
  adminDoctorBio: document.getElementById('admin-doctor-bio'),
  adminDoctorMessage: document.getElementById('admin-doctor-message'),
  adminDoctorsList: document.getElementById('admin-doctors-list'),
  adminUsersList: document.getElementById('admin-users-list'),
  createAdminBtn: document.getElementById('create-admin-btn')
};

let currentSection = 'auth';

// Utility functions
function setToken(token) {
  if (token) localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function clearToken() {
  localStorage.removeItem('token');
}

function setAuthState(isAuthed, user) {
  const hiddenClass = 'hidden';
  
  // Auth buttons (show when not logged in)
  els.navLogin.classList.toggle(hiddenClass, isAuthed);
  els.navRegister.classList.toggle(hiddenClass, isAuthed);
  
  // Dashboard navigation (show when logged in)
  els.navDashboard.classList.toggle(hiddenClass, !isAuthed);
  els.navAppointments.classList.toggle(hiddenClass, !isAuthed);
  els.navProfile.classList.toggle(hiddenClass, !isAuthed);
  els.navSleepStudy.classList.toggle(hiddenClass, !isAuthed);
  els.navHealth.classList.toggle(hiddenClass, !isAuthed);
  
  // Admin and logout (show when logged in)
  els.navAdmin.classList.toggle(hiddenClass, !isAuthed || (user && user.role !== 'admin'));
  els.navLogout.classList.toggle(hiddenClass, !isAuthed);
  
  // Show/hide sections
  if (els.authSection) els.authSection.classList.toggle(hiddenClass, isAuthed && currentSection !== 'auth');
  els.adminSection.classList.toggle(hiddenClass, !isAuthed || currentSection !== 'admin' || (user && user.role !== 'admin'));
  if (els.userSection) els.userSection.classList.toggle(hiddenClass, !isAuthed || currentSection !== 'user');
  
  if (els.userInfo) {
    if (isAuthed && user) {
      els.userInfo.textContent = `Logged in as ${user.name} (${user.role})`;
    } else {
      els.userInfo.textContent = '';
    }
  }
}

function showSection(sectionName) {
  currentSection = sectionName;
  // Only auth or admin
  els.authSection.classList.toggle('hidden', sectionName !== 'auth');
  els.adminSection.classList.toggle('hidden', sectionName !== 'admin');
  els.userSection && els.userSection.classList.toggle('hidden', sectionName !== 'user');
}

function switchDashboardTab(tabName) {
  // Hide all dashboard content
  document.querySelectorAll('.dashboard-content').forEach(content => content.classList.add('hidden'));
  document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
  
  // Show selected content
  const contentMap = {
    'dashboard': els.dashboardContent,
    'appointments': els.appointmentsContent,
    'profile': els.profileContent,
    'sleep-study': els.sleepStudyContent,
    'health': els.healthContent
  };
  
  const tabMap = {
    'dashboard': els.dashboardTab,
    'appointments': els.appointmentsTab,
    'profile': els.profileTab,
    'sleep-study': els.sleepStudyTab,
    'health': els.healthTab
  };
  
  if (contentMap[tabName]) {
    contentMap[tabName].classList.remove('hidden');
  }
  if (tabMap[tabName]) {
    tabMap[tabName].classList.add('active');
  }
  
  // Load data when switching to specific tabs
  if (tabName === 'dashboard') {
    loadDashboardData();
  } else if (tabName === 'appointments') {
    console.log('Loading appointments tab...');
    loadDoctors().then(() => {
      console.log('Doctors loaded, now loading appointments...');
      loadAppointments();
    });
  } else if (tabName === 'profile') {
    loadUserProfile();
  } else if (tabName === 'sleep-study') {
    loadDoctors().then(() => loadSleepStudies());
  } else if (tabName === 'health') {
    loadYogaVideos();
  }
}

async function api(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.status === 204 ? null : res.json();
}

// Navigation
if (els.navLogin) {
  els.navLogin.addEventListener('click', () => {
    showSection('auth');
    // Switch to login tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('login').classList.add('active');
    els.tabs.forEach(b => b.classList.remove('active'));
    els.tabs[0].classList.add('active');
  });
}
if (els.navRegister) {
  els.navRegister.addEventListener('click', () => {
    showSection('auth');
    // Switch to register tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('register').classList.add('active');
    els.tabs.forEach(b => b.classList.remove('active'));
    els.tabs[1].classList.add('active');
  });
}
els.navDashboard.addEventListener('click', () => {
  showSection('user');
  switchDashboardTab('dashboard');
});
els.navAppointments.addEventListener('click', () => {
  showSection('user');
  switchDashboardTab('appointments');
});
els.navProfile.addEventListener('click', () => {
  showSection('user');
  switchDashboardTab('profile');
});
els.navSleepStudy.addEventListener('click', () => {
  showSection('user');
  switchDashboardTab('sleep-study');
});
els.navHealth.addEventListener('click', () => {
  showSection('user');
  switchDashboardTab('health');
});
els.navAdmin.addEventListener('click', () => showSection('admin'));

// Dashboard tab switching
if (els.dashboardTab) els.dashboardTab.addEventListener('click', () => switchDashboardTab('dashboard'));
if (els.appointmentsTab) els.appointmentsTab.addEventListener('click', () => switchDashboardTab('appointments'));
if (els.profileTab) els.profileTab.addEventListener('click', () => switchDashboardTab('profile'));
if (els.sleepStudyTab) els.sleepStudyTab.addEventListener('click', () => switchDashboardTab('sleep-study'));
if (els.healthTab) els.healthTab.addEventListener('click', () => switchDashboardTab('health'));

// Quick action buttons
if (els.bookAppointmentBtn) els.bookAppointmentBtn.addEventListener('click', () => switchDashboardTab('appointments'));
if (els.requestSleepStudyBtn) els.requestSleepStudyBtn.addEventListener('click', () => switchDashboardTab('sleep-study'));
if (els.updateProfileBtn) els.updateProfileBtn.addEventListener('click', () => switchDashboardTab('profile'));

// Refresh doctors button
els.refreshDoctorsBtn.addEventListener('click', async () => {
  try {
    els.refreshDoctorsBtn.disabled = true;
    els.refreshDoctorsBtn.textContent = 'Refreshing...';
    
    await loadDoctors();
    
    els.refreshDoctorsBtn.textContent = 'Refreshed!';
    els.refreshDoctorsBtn.style.background = '#28a745';
    
    setTimeout(() => {
      els.refreshDoctorsBtn.disabled = false;
      els.refreshDoctorsBtn.textContent = 'Refresh Doctors';
      els.refreshDoctorsBtn.style.background = '#6c757d';
    }, 1000);
    
  } catch (e) {
    els.refreshDoctorsBtn.disabled = false;
    els.refreshDoctorsBtn.textContent = 'Refresh Doctors';
    console.error('Error refreshing doctors:', e);
  }
});

// Refresh sleep study doctors button
els.refreshSleepDoctorsBtn.addEventListener('click', async () => {
  try {
    els.refreshSleepDoctorsBtn.disabled = true;
    els.refreshSleepDoctorsBtn.textContent = 'Refreshing...';
    
    await loadDoctors();
    
    els.refreshSleepDoctorsBtn.textContent = 'Refreshed!';
    els.refreshSleepDoctorsBtn.style.background = '#28a745';
    
    setTimeout(() => {
      els.refreshSleepDoctorsBtn.disabled = false;
      els.refreshSleepDoctorsBtn.textContent = 'Refresh Doctors';
      els.refreshSleepDoctorsBtn.style.background = '#6c757d';
    }, 1000);
    
  } catch (e) {
    els.refreshSleepDoctorsBtn.disabled = false;
    els.refreshSleepDoctorsBtn.textContent = 'Refresh Doctors';
    console.error('Error refreshing sleep study doctors:', e);
  }
});

// Tab switching
els.tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    els.tabs.forEach(b => b.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
    btn.classList.add('active');
    
    // Clear messages when switching tabs
    els.loginMessage.textContent = '';
    els.authMessage.textContent = '';
    
    // Reset registration form when switching to login
    if (btn.dataset.tab === 'login') {
      els.regName.value = '';
      els.regPhone.value = '';
      els.regEmail.value = '';
      els.regPassword.value = '';
      els.otpCode.value = '';
      document.getElementById('otp-group').classList.add('hidden');
      els.verifyOtpBtn.classList.add('hidden');
      els.registerBtn.classList.add('hidden');
      els.passwordStrength.classList.add('hidden');
    }
    
    // Reset login form when switching to register
    if (btn.dataset.tab === 'register') {
      els.loginEmail.value = '';
      els.loginPassword.value = '';
    }
  });
});

// Password strength indicator
els.regPassword.addEventListener('input', (e) => {
  updatePasswordStrength(e.target.value);
});

// OTP input formatting
els.otpCode.addEventListener('input', (e) => {
  // Only allow numbers
  e.target.value = e.target.value.replace(/\D/g, '');
  
  // Auto-submit when 6 digits are entered
  if (e.target.value.length === 6) {
    els.verifyOtpBtn.click();
  }
});

// Form event listeners
els.appointmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const doctorName = els.doctorSelect.value.trim();
    const scheduledAt = els.apptDatetime.value;
    const reason = els.apptReason.value.trim();
    
    if (!doctorName) {
      els.bookMessage.textContent = 'Please select a doctor.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    if (!scheduledAt) {
      els.bookMessage.textContent = 'Please select appointment date and time.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    // Check if selected time is in the future
    const selectedTime = new Date(scheduledAt);
    const now = new Date();
    if (selectedTime <= now) {
      els.bookMessage.textContent = 'Please select a future date and time.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during booking
    els.bookBtn.disabled = true;
    els.bookBtn.textContent = 'Booking...';
    els.bookMessage.textContent = '';
    
    // Make API call
    await api('/appointments', { 
      method: 'POST', 
      body: JSON.stringify({ doctorName, scheduledAt: selectedTime.toISOString(), reason }) 
    });
    
    // Success feedback
    els.bookMessage.textContent = 'Appointment booked successfully!';
    els.bookMessage.style.color = '#28a745';
    
    // Clear form
    els.doctorSelect.value = '';
    els.apptDatetime.value = '';
    els.apptReason.value = '';
    
    // Reload data
    await loadAppointments();
    
    // Reset button
    els.bookBtn.disabled = false;
    els.bookBtn.textContent = 'Book Appointment';
    
  } catch (e) {
    els.bookMessage.textContent = `Error: ${e.message}`;
    els.bookMessage.style.color = '#dc3545';
    els.bookBtn.disabled = false;
    els.bookBtn.textContent = 'Book Appointment';
  }
});

els.profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const profileData = {
      name: els.profileName.value,
      phone: els.profilePhone.value,
      email: els.profileEmail.value,
      profile: {
        dateOfBirth: els.profileDob.value ? new Date(els.profileDob.value).toISOString() : undefined,
        gender: els.profileGender.value || undefined,
        address: els.profileAddress.value || undefined,
        emergencyContact: els.profileEmergency.value || undefined,
        medicalHistory: els.profileMedical.value || undefined,
        allergies: els.profileAllergies.value || undefined,
        medications: els.profileMedications.value || undefined
      }
    };
    
    await api('/profile', { 
      method: 'PUT', 
      body: JSON.stringify(profileData) 
    });
    
    els.profileMessage.textContent = 'Profile updated successfully!';
    els.profileMessage.style.color = '#28a745';
  } catch (e) {
    els.profileMessage.textContent = e.message;
    els.profileMessage.style.color = '#dc3545';
  }
});

els.sleepStudyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const doctorName = els.studyDoctor.value.trim();
    const scheduledDate = els.studyDate.value;
    const type = els.studyType.value;
    const notes = els.studyNotes.value.trim();
    
    // Clear previous messages
    els.studyMessage.textContent = '';
    els.studyMessage.style.color = '#555';
    
    // Validate required fields
    if (!doctorName) {
      els.studyMessage.textContent = 'Please select a doctor.';
      els.studyMessage.style.color = '#dc3545';
      return;
    }
    
    if (!scheduledDate) {
      els.studyMessage.textContent = 'Please select a date.';
      els.studyMessage.style.color = '#dc3545';
      return;
    }
    
    if (!type) {
      els.studyMessage.textContent = 'Please select a study type.';
      els.studyMessage.style.color = '#dc3545';
      return;
    }
    
    // Check if selected date is in the future
    const selectedDate = new Date(scheduledDate);
    const now = new Date();
    if (selectedDate <= now) {
      els.studyMessage.textContent = 'Please select a future date.';
      els.studyMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during submission
    els.studySubmitBtn.disabled = true;
    els.studySubmitBtn.textContent = 'Requesting...';
    
    const studyData = {
      doctorName,
      scheduledDate: selectedDate.toISOString(),
      type,
      notes
    };
    
    console.log('Submitting sleep study request:', studyData);
    
    await api('/sleep-study/request', { 
      method: 'POST', 
      body: JSON.stringify(studyData) 
    });
    
    els.studyMessage.textContent = 'Sleep study requested successfully!';
    els.studyMessage.style.color = '#28a745';
    
    // Clear form
    els.studyDoctor.value = '';
    els.studyDate.value = '';
    els.studyType.value = '';
    els.studyNotes.value = '';
    
    await loadSleepStudies();
    
    // Reset button
    els.studySubmitBtn.disabled = false;
    els.studySubmitBtn.textContent = 'Request Sleep Study';
    
  } catch (e) {
    els.studyMessage.textContent = `Error: ${e.message}`;
    els.studyMessage.style.color = '#dc3545';
    els.studySubmitBtn.disabled = false;
    els.studySubmitBtn.textContent = 'Request Sleep Study';
    console.error('Sleep study request error:', e);
  }
});

// Health Features
els.yogaBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.yogaContent.classList.remove('hidden');
  loadYogaVideos();
});

els.meditationBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.meditationContent.classList.remove('hidden');
  loadMeditationVideos();
});

els.assessmentBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.assessmentContent.classList.remove('hidden');
  loadAssessment();
});

// OTP Registration Flow
els.sendOtpBtn.addEventListener('click', async () => {
  try {
    const phone = els.regPhone.value.trim();
    const name = els.regName.value.trim();
    
    // Clear previous messages
    els.authMessage.textContent = '';
    els.authMessage.style.color = '#555';
    
    // Validate required fields
    if (!name) {
      els.authMessage.textContent = 'Full name is required';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    if (!phone) {
      els.authMessage.textContent = 'Phone number is required';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      els.authMessage.textContent = 'Please enter a valid phone number';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during request
    els.sendOtpBtn.disabled = true;
    els.sendOtpBtn.textContent = 'Sending...';
    
    await api('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });
    document.getElementById('otp-group').classList.remove('hidden');
    els.verifyOtpBtn.classList.remove('hidden');
    els.registerBtn.classList.remove('hidden');
    els.authMessage.textContent = 'OTP sent! Check console for code (in development)';
    els.authMessage.style.color = '#28a745';
  } catch (e) {
    if (els.authMessage) {
      els.authMessage.textContent = e.message;
      els.authMessage.style.color = '#dc3545';
      
      // If there's a conflict, suggest switching to login
      if (e.message.includes('already registered') && e.message.includes('try logging in')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
      
      // If phone is already verified, suggest using login
      if (e.message.includes('Phone number already registered')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
    }
  } finally {
    els.sendOtpBtn.disabled = false;
    els.sendOtpBtn.textContent = 'Send OTP';
  }
});

els.verifyOtpBtn.addEventListener('click', async () => {
  try {
    const phone = els.regPhone.value.trim();
    const otp = els.otpCode.value.trim();
    
    // Clear previous messages
    els.authMessage.textContent = '';
    els.authMessage.style.color = '#555';
    
    // Validate OTP
    if (!otp) {
      els.authMessage.textContent = 'Please enter the OTP code';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    if (otp.length !== 6) {
      els.authMessage.textContent = 'OTP must be 6 digits';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during request
    els.verifyOtpBtn.disabled = true;
    els.verifyOtpBtn.textContent = 'Verifying...';
    
    const data = await api('/auth/verify-otp', { 
      method: 'POST', 
      body: JSON.stringify({ phone, otp }) 
    });
    
    setToken(data.token);
    window.currentUser = data.user;
    setAuthState(true, data.user);
    showSection(data.user.role === 'admin' ? 'admin' : 'user');
    
    // Clear form
    els.regName.value = '';
    els.regPhone.value = '';
    els.regEmail.value = '';
    els.regPassword.value = '';
    els.otpCode.value = '';
    document.getElementById('otp-group').classList.add('hidden');
    els.verifyOtpBtn.classList.add('hidden');
    els.registerBtn.classList.add('hidden');
    
  } catch (e) {
    if (els.authMessage) {
      els.authMessage.textContent = e.message;
      els.authMessage.style.color = '#dc3545';
      
      // If there's a conflict, suggest switching to login
      if (e.message.includes('already registered') && e.message.includes('try logging in')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
      
      // If phone is already verified, suggest using login
      if (e.message.includes('Phone number already registered')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
    }
  } finally {
    els.verifyOtpBtn.disabled = false;
    els.verifyOtpBtn.textContent = 'Verify OTP';
  }
});

els.registerBtn.addEventListener('click', async () => {
  try {
    const name = els.regName.value.trim();
    const phone = els.regPhone.value.trim();
    const email = els.regEmail.value.trim();
    const password = els.regPassword.value;
    
    // Clear previous messages
    els.authMessage.textContent = '';
    els.authMessage.style.color = '#555';
    
    // Validate required fields
    if (!name) {
      els.authMessage.textContent = 'Full name is required';
      els.authMessage.style.color = '#dc3545';
      return;
    }

    if (!phone) {
      els.authMessage.textContent = 'Phone number is required';
      els.authMessage.style.color = '#dc3545';
      return;
    }

    if (!email) {
      els.authMessage.textContent = 'Email is required';
      els.authMessage.style.color = '#dc3545';
      return;
    }

    if (!isValidEmail(email)) {
      els.authMessage.textContent = 'Please enter a valid email address';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    // Validate password if provided
    if (password && password.length < 6) {
      els.authMessage.textContent = 'Password must be at least 6 characters long';
      els.authMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during request
    els.registerBtn.disabled = true;
    els.registerBtn.textContent = 'Registering...';
    
    const userData = {
      name,
      phone,
      email: email || undefined,
      password: password || undefined,
      role: els.regRole.value
    };
    
    const data = await api('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(userData) 
    });
    
    els.authMessage.textContent = data.message;
    els.authMessage.style.color = '#28a745';
    
    // If registration was successful, show OTP input
    if (data.message.includes('verify OTP')) {
      document.getElementById('otp-group').classList.remove('hidden');
      els.verifyOtpBtn.classList.remove('hidden');
      els.registerBtn.classList.remove('hidden');
    }
    
    // If there's a conflict, suggest switching to login
    if (data.message.includes('already registered') && data.message.includes('try logging in')) {
      els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
    }
    
    // Clear form after successful registration
    setTimeout(() => {
      els.regName.value = '';
      els.regPhone.value = '';
      els.regEmail.value = '';
      els.regPassword.value = '';
      els.otpCode.value = '';
      document.getElementById('otp-group').classList.add('hidden');
      els.verifyOtpBtn.classList.add('hidden');
      els.registerBtn.classList.add('hidden');
    }, 2000);
    
  } catch (e) {
    if (els.authMessage) {
      els.authMessage.textContent = e.message;
      els.authMessage.style.color = '#dc3545';
      
      // If there's a conflict, suggest switching to login
      if (e.message.includes('already registered') && e.message.includes('try logging in')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
      
      // If phone is already verified, suggest using login
      if (e.message.includes('Phone number already registered')) {
        els.authMessage.textContent += ' You can switch to the Login tab to sign in.';
      }
    }
  } finally {
    els.registerBtn.disabled = false;
    els.registerBtn.textContent = 'Complete Registration';
  }
});

// Login
els.loginBtn && els.loginBtn.addEventListener('click', async () => {
  try {
    const email = els.loginEmail.value.trim();
    const password = els.loginPassword.value;
    
    // Clear previous messages
    els.loginMessage.textContent = '';
    els.loginMessage.style.color = '#555';
    
    // Validate required fields
    if (!email) {
      els.loginMessage.textContent = 'Email is required';
      els.loginMessage.style.color = '#dc3545';
      return;
    }
    
    if (!password) {
      els.loginMessage.textContent = 'Password is required';
      els.loginMessage.style.color = '#dc3545';
      return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      els.loginMessage.textContent = 'Please enter a valid email address';
      els.loginMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during request
    els.loginBtn.disabled = true;
    els.loginBtn.textContent = 'Logging in...';
    
    const data = await api('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({
        email, 
        password
      }) 
    });
    
    setToken(data.token);
    window.currentUser = data.user;
    setAuthState(true, data.user);
    showSection(data.user.role === 'admin' ? 'admin' : 'user');
    
    // Clear form
    els.loginEmail.value = '';
    els.loginPassword.value = '';
    
  } catch (e) {
    els.loginMessage.textContent = e.message;
    els.loginMessage.style.color = '#dc3545';
    
    // If there's a conflict, suggest switching to register
    if (e.message.includes('No password set') && e.message.includes('phone verification')) {
      els.loginMessage.textContent += ' You can switch to the Register tab to sign up with phone verification.';
    }
  } finally {
    els.loginBtn.disabled = false;
    els.loginBtn.textContent = 'Login';
  }
});

els.navLogout && els.navLogout.addEventListener('click', () => {
  clearToken();
  window.currentUser = null;
  setAuthState(false);
  showSection('auth');
});

// Dashboard functions
async function loadDashboardData() {
  try {
    await Promise.all([
      loadDoctors(),
      loadAppointments(),
      loadUserProfile()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

async function loadDoctors() {
  try {
    const doctors = await api('/doctors');
    console.log('Fetched doctors:', doctors);
    
    // Update doctors list display (if element exists)
    if (els.doctorsList) {
      els.doctorsList.innerHTML = doctors.length > 0 ? doctors.map(d => `
        <div class="item">
          <div><strong>Dr. ${d.user.name}</strong></div>
          <div>Specialty: ${d.specialty}</div>
          <div>${d.bio || 'No bio available'}</div>
        </div>
      `).join('') : '<div class="item"><p>No doctors available. Contact admin to add doctors.</p></div>';
    }
    
    // Update doctor select for appointments (if element exists)
    if (els.doctorSelect) {
      els.doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>' + 
        doctors.map(d => `<option value="${d.user.name}">Dr. ${d.user.name} - ${d.specialty}</option>`).join('');
      console.log('Updated doctor select with', doctors.length, 'doctors');
    } else {
      console.log('Doctor select element not found!');
    }
    
    // Update doctor select for sleep studies (if element exists)
    if (els.studyDoctor) {
      els.studyDoctor.innerHTML = '<option value="">Choose a doctor...</option>' + 
        doctors.map(d => `<option value="${d.user.name}">Dr. ${d.user.name} - ${d.specialty}</option>`).join('');
    }
    
    console.log('Loaded doctors:', doctors.length);
    return doctors;
  } catch (error) {
    console.error('Error loading doctors:', error);
    if (els.doctorsList) {
      els.doctorsList.innerHTML = '<div class="item"><p>Error loading doctors. Please try again.</p></div>';
    }
    if (els.doctorSelect) {
      els.doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
    }
    if (els.studyDoctor) {
      els.studyDoctor.innerHTML = '<option value="">Error loading doctors</option>';
    }
    return [];
  }
}

async function loadAppointments() {
  const appts = await api('/appointments');
  els.appointmentsList.innerHTML = appts.map(a => `
    <div class="item">
      <div><strong>${new Date(a.scheduledAt).toLocaleString()}</strong></div>
      <div>Doctor: ${a.doctor?.user?.name || ''}</div>
      <div>Status: ${a.status}</div>
      <div>Reason: ${a.reason || ''}</div>
    </div>
  `).join('');
}

async function loadSleepStudies() {
  const studies = await api('/sleep-study');
  els.sleepStudiesList.innerHTML = studies.map(s => `
    <div class="item">
      <div><strong>${new Date(s.scheduledDate).toLocaleDateString()}</strong></div>
      <div>Doctor: ${s.doctor?.user?.name || ''}</div>
      <div>Type: ${s.type}</div>
      <div>Status: ${s.status}</div>
      <div>${s.notes || ''}</div>
    </div>
  `).join('');
}

// Simplified: no dashboard loaders

// Booking
els.bookBtn.addEventListener('click', async () => {
  try {
    // Validate form inputs
    const doctorName = els.doctorSelect.value.trim();
    const scheduledAt = els.apptDatetime.value;
    const reason = els.apptReason.value.trim();
    
    if (!doctorName) {
      els.bookMessage.textContent = 'Please select a doctor.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    if (!scheduledAt) {
      els.bookMessage.textContent = 'Please select appointment date and time.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    // Check if selected time is in the future
    const selectedTime = new Date(scheduledAt);
    const now = new Date();
    if (selectedTime <= now) {
      els.bookMessage.textContent = 'Please select a future date and time.';
      els.bookMessage.style.color = '#dc3545';
      return;
    }
    
    // Disable button during booking
    els.bookBtn.disabled = true;
    els.bookBtn.textContent = 'Booking...';
    els.bookMessage.textContent = '';
    
    // Make API call
    await api('/appointments', { 
      method: 'POST', 
      body: JSON.stringify({ doctorName, scheduledAt: selectedTime.toISOString(), reason }) 
    });
    
    // Success feedback
    els.bookMessage.textContent = 'Appointment booked successfully!';
    els.bookMessage.style.color = '#28a745';
    
    // Clear form
    els.doctorSelect.value = '';
    els.apptDatetime.value = '';
    els.apptReason.value = '';
    
    // Reload data
    await loadAppointments();
    
    // Reset button
    els.bookBtn.disabled = false;
    els.bookBtn.textContent = 'Book Appointment';
    
  } catch (e) {
    els.bookMessage.textContent = `Error: ${e.message}`;
    els.bookMessage.style.color = '#dc3545';
    els.bookBtn.disabled = false;
    els.bookBtn.textContent = 'Book Appointment';
  }
});

// Create admin user (development only)
els.createAdminBtn && els.createAdminBtn.addEventListener('click', async () => {
  const name = prompt('Enter admin name:');
  const email = prompt('Enter admin email:');
  const password = prompt('Enter admin password:');
  
  if (!name || !email || !password) {
    alert('All fields are required');
    return;
  }
  
  try {
    els.createAdminBtn.disabled = true;
    els.createAdminBtn.textContent = 'Creating...';
    
    const data = await api('/auth/create-admin', { 
      method: 'POST', 
      body: JSON.stringify({ name, email, password }) 
    });
    
    // Auto-login as admin
    setToken(data.token);
    window.currentUser = data.user;
    setAuthState(true, data.user);
    showSection('admin');
    await loadAdminDoctors();
    
    els.createAdminBtn.textContent = 'Admin Created!';
    els.createAdminBtn.style.background = '#28a745';
    
  } catch (e) {
    alert(`Error: ${e.message}`);
    els.createAdminBtn.disabled = false;
    els.createAdminBtn.textContent = 'Create Admin User';
  }
});

// Doctor management
els.seedDoctorsBtn && els.seedDoctorsBtn.addEventListener('click', async () => {
  try {
    els.seedDoctorsBtn.disabled = true;
    els.seedDoctorsBtn.textContent = 'Adding...';
    
    const response = await api('/doctors/seed', { method: 'POST' });
    
    els.seedDoctorsBtn.textContent = 'Sample Doctors Added!';
    els.seedDoctorsBtn.style.background = '#28a745';
    
    // Reload doctors
    await loadDoctors();
    
    setTimeout(() => {
      els.seedDoctorsBtn.disabled = false;
      els.seedDoctorsBtn.textContent = 'Add Sample Doctors';
      els.seedDoctorsBtn.style.background = '#17a2b8';
    }, 2000);
    
  } catch (e) {
    els.seedDoctorsBtn.disabled = false;
    els.seedDoctorsBtn.textContent = 'Add Sample Doctors';
    console.error('Error adding sample doctors:', e);
  }
});

els.refreshDoctorsBtn && els.refreshDoctorsBtn.addEventListener('click', async () => {
  try {
    els.refreshDoctorsBtn.disabled = true;
    els.refreshDoctorsBtn.textContent = 'Refreshing...';
    
    await loadDoctors();
    
    els.refreshDoctorsBtn.textContent = 'Refreshed!';
    els.refreshDoctorsBtn.style.background = '#28a745';
    
    setTimeout(() => {
      els.refreshDoctorsBtn.disabled = false;
      els.refreshDoctorsBtn.textContent = 'Refresh';
      els.refreshDoctorsBtn.style.background = '#6c757d';
    }, 1000);
    
  } catch (e) {
    els.refreshDoctorsBtn.disabled = false;
    els.refreshDoctorsBtn.textContent = 'Refresh';
    console.error('Error refreshing doctors:', e);
  }
});

// Profile Management
async function loadUserProfile() {
  try {
    const profile = await api('/profile');
    
    els.profileName.value = profile.name || '';
    els.profilePhone.value = profile.phone || '';
    els.profileEmail.value = profile.email || '';
    els.profileDob.value = profile.profile?.dateOfBirth ? 
      new Date(profile.profile.dateOfBirth).toISOString().split('T')[0] : '';
    els.profileGender.value = profile.profile?.gender || '';
    els.profileAddress.value = profile.profile?.address || '';
    els.profileEmergency.value = profile.profile?.emergencyContact || '';
    els.profileMedical.value = profile.profile?.medicalHistory || '';
    els.profileAllergies.value = profile.profile?.allergies || '';
    els.profileMedications.value = profile.profile?.medications || '';
  } catch (e) {
    console.error('Failed to load profile:', e);
  }
}

els.profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const profileData = {
      name: els.profileName.value,
      phone: els.profilePhone.value,
      email: els.profileEmail.value,
      profile: {
        dateOfBirth: els.profileDob.value ? new Date(els.profileDob.value).toISOString() : undefined,
        gender: els.profileGender.value || undefined,
        address: els.profileAddress.value || undefined,
        emergencyContact: els.profileEmergency.value || undefined,
        medicalHistory: els.profileMedical.value || undefined,
        allergies: els.profileAllergies.value || undefined,
        medications: els.profileMedications.value || undefined
      }
    };
    
    await api('/profile', { 
      method: 'PUT', 
      body: JSON.stringify(profileData) 
    });
    
    els.profileMessage.textContent = 'Profile updated successfully!';
  } catch (e) {
    els.profileMessage.textContent = e.message;
  }
});

// Sleep Study
els.sleepStudyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const studyData = {
      doctorName: els.studyDoctor.value,
      scheduledDate: new Date(els.studyDate.value).toISOString(),
      type: els.studyType.value,
      notes: els.studyNotes.value
    };
    
    await api('/sleep-study/request', { 
      method: 'POST', 
      body: JSON.stringify(studyData) 
    });
    
    els.studyMessage.textContent = 'Sleep study requested!';
    await loadSleepStudies();
  } catch (e) {
    els.studyMessage.textContent = e.message;
  }
});

// Health Features
els.yogaBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.yogaContent.classList.remove('hidden');
  
  loadYogaVideos();
});

els.meditationBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.meditationContent.classList.remove('hidden');
  
  loadMeditationVideos();
});

els.assessmentBtn.addEventListener('click', () => {
  [els.yogaContent, els.meditationContent, els.assessmentContent].forEach(el => 
    el.classList.add('hidden')
  );
  els.assessmentContent.classList.remove('hidden');
  
  loadAssessment();
});

function loadYogaVideos() {
    const videos = [
    { title: 'Morning Yoga for Better Sleep', duration: '15 min' },
    { title: 'Relaxing Evening Yoga', duration: '20 min' },
    { title: 'Sleep Preparation Yoga', duration: '25 min' }
  ];
  
  els.yogaVideos.innerHTML = videos.map(video => `
    <div class="video-item">
      <h4>${video.title}</h4>
      <p>Duration: ${video.duration}</p>
      <button onclick="watchVideo('${video.title}')">Watch Video</button>
    </div>
  `).join('');
}

function loadMeditationVideos() {
    const videos = [
    { title: 'Guided Sleep Meditation', duration: '10 min' },
    { title: 'Breathing Exercises', duration: '8 min' },
    { title: 'Deep Relaxation', duration: '15 min' }
  ];
  
  els.meditationVideos.innerHTML = videos.map(video => `
    <div class="video-item">
      <h4>${video.title}</h4>
      <p>Duration: ${video.duration}</p>
      <button onclick="watchVideo('${video.title}')">Watch Video</button>
    </div>
  `).join('');
}

function loadAssessment() {
  els.assessmentForm.innerHTML = `
    <form id="health-assessment">
      <div class="question">
        <label>How many hours of sleep do you get per night?</label>
        <input type="number" min="1" max="12" required>
      </div>
      <div class="question">
        <label>Do you snore loudly?</label>
        <select required>
          <option value="">Select</option>
          <option value="never">Never</option>
          <option value="rarely">Rarely</option>
          <option value="sometimes">Sometimes</option>
          <option value="often">Often</option>
        </select>
      </div>
      <div class="question">
        <label>Do you feel tired during the day?</label>
        <select required>
          <option value="">Select</option>
          <option value="never">Never</option>
          <option value="rarely">Rarely</option>
          <option value="sometimes">Sometimes</option>
          <option value="often">Often</option>
        </select>
      </div>
      <button type="submit">Submit Assessment</button>
    </form>
  `;
  
  document.getElementById('health-assessment').addEventListener('submit', async (e) => {
    e.preventDefault();
    els.assessmentForm.innerHTML = '<p>Assessment submitted! Thank you.</p>';
  });
}

// Video watching (without rewards)
window.watchVideo = async function(title) {
  // Simulate video watching
  setTimeout(() => {
    alert(`Video "${title}" completed!`);
  }, 2000);
};

// Admin functionality
els.adminDoctorsTab.addEventListener('click', () => {
  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.admin-content').forEach(content => content.classList.add('hidden'));
  els.adminDoctorsTab.classList.add('active');
  els.adminDoctors.classList.remove('hidden');
  loadAdminDoctors();
});

els.adminUsersTab.addEventListener('click', () => {
  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.admin-content').forEach(content => content.classList.add('hidden'));
  els.adminUsersTab.classList.add('active');
  els.adminUsers.classList.remove('hidden');
  loadAdminUsers();
});

async function loadAdminDoctors() {
  try {
    const doctors = await api('/doctors');
    els.adminDoctorsList.innerHTML = doctors.map(d => `
      <div class="item">
        <div><strong>Dr. ${d.user.name}</strong></div>
        <div>Email: ${d.user.email}</div>
        <div>Phone: ${d.user.phone || 'Not provided'}</div>
        <div>Specialty: ${d.specialty}</div>
        <div>Bio: ${d.bio || 'No bio available'}</div>
      </div>
    `).join('');
  } catch (e) {
    els.adminDoctorsList.innerHTML = '<div class="item"><p>Error loading doctors</p></div>';
  }
}

async function loadAdminUsers() {
  try {
    // This would need a new API endpoint to get all users
    els.adminUsersList.innerHTML = '<div class="item"><p>User management feature coming soon...</p></div>';
  } catch (e) {
    els.adminUsersList.innerHTML = '<div class="item"><p>Error loading users</p></div>';
  }
}

els.adminDoctorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const doctorData = {
      name: els.adminDoctorName.value,
      email: els.adminDoctorEmail.value,
      phone: els.adminDoctorPhone.value || undefined,
      specialty: els.adminDoctorSpecialty.value,
      bio: els.adminDoctorBio.value || ''
    };

    await api('/doctors', { 
      method: 'POST', 
      body: JSON.stringify(doctorData) 
    });

    els.adminDoctorMessage.textContent = 'Doctor added successfully!';
    els.adminDoctorMessage.style.color = '#28a745';

    // Clear form
    els.adminDoctorForm.reset();
    
    // Reload doctors
    await loadAdminDoctors();
    await loadDoctors(); // Also refresh the main doctors list
    
  } catch (e) {
    els.adminDoctorMessage.textContent = `Error: ${e.message}`;
    els.adminDoctorMessage.style.color = '#dc3545';
  }
});

// Initialize app
(async function init() {
  const token = getToken();
  if (token) {
    setAuthState(true, window.currentUser || null);
  } else {
    setAuthState(false);
  }
  showSection('auth');
})();