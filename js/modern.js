// Modern JavaScript for SkinX Professional Platform

class SkinXModern {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeComponents();
    }

    init() {
        console.log('SkinX Modern Platform Initializing...');
        
        // State management
        this.state = {
            currentTab: 'image',
            uploadedImage: null,
            analysisInProgress: false,
            currentAnalysis: null,
            sidebarOpen: false,
            selectedSymptoms: new Set(),
            selectedBodyRegions: new Set()
        };
        
        // Configuration
        this.config = {
            maxFileSize: 50 * 1024 * 1024, // 50MB
            supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'dcm'],
            apiEndpoints: {
                imageAnalysis: '/predict_image',
                textAnalysis: '/predict_text',
                health: '/health'
            }
        };
    }

    setupEventListeners() {
        // Sidebar toggle
        this.setupSidebar();
        
        // Tab switching
        this.setupTabs();
        
        // Upload functionality
        this.setupImageUpload();
        
        // Text analysis
        this.setupTextAnalysis();
        
        // Quick actions
        this.setupQuickActions();
        
        // Toast notifications
        this.setupNotifications();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    initializeComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize character counter
        this.initializeCharacterCounter();
        
        // Initialize drag and drop
        this.initializeDragDrop();
        
        // Initialize body map
        this.initializeBodyMap();
        
        // Initialize symptom tags
        this.initializeSymptomTags();
        
        // Initialize templates
        this.initializeTemplates();
    }

    // ===== SIDEBAR FUNCTIONALITY =====
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (sidebar && !sidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            this.state.sidebarOpen = !this.state.sidebarOpen;
            sidebar.classList.toggle('open', this.state.sidebarOpen);
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            this.state.sidebarOpen = false;
            sidebar.classList.remove('open');
        }
    }

    // ===== TAB FUNCTIONALITY =====
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const analysisPanels = document.querySelectorAll('.analysis-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        // Update panels
        const panels = document.querySelectorAll('.analysis-panel');
        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}Panel`);
        });

        this.state.currentTab = tabName;
    }

    // ===== IMAGE UPLOAD FUNCTIONALITY =====
    setupImageUpload() {
        const uploadArea = document.getElementById('modernUploadArea');
        const imageInput = document.getElementById('imageInput');
        const analyzeBtn = document.getElementById('analyzeImageBtn');

        if (uploadArea && imageInput) {
            // Click to upload
            uploadArea.addEventListener('click', () => {
                imageInput.click();
            });

            // File input change
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageUpload(file);
                }
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeImage();
            });
        }

        // Preview tools
        this.setupPreviewTools();
    }

    handleImageUpload(file) {
        // Validate file
        if (!this.validateImageFile(file)) {
            return;
        }

        // Show loading
        this.showLoading('Uploading image...');

        // Read and display image
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImage(e.target.result, file);
            this.hideLoading();
            this.showToast('Image uploaded successfully', 'success');
        };
        reader.onerror = () => {
            this.hideLoading();
            this.showToast('Failed to upload image', 'error');
        };
        reader.readAsDataURL(file);
    }

    validateImageFile(file) {
        // Check file size
        if (file.size > this.config.maxFileSize) {
            this.showToast('File size exceeds 50MB limit', 'error');
            return false;
        }

        // Check file type
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.config.supportedFormats.includes(extension)) {
            this.showToast('Unsupported file format', 'error');
            return false;
        }

        return true;
    }

    displayImage(imageSrc, file) {
        const uploadArea = document.getElementById('modernUploadArea');
        const previewSection = document.getElementById('imagePreviewSection');
        const previewImage = document.getElementById('previewImage');
        const analyzeBtn = document.getElementById('analyzeImageBtn');

        if (uploadArea && previewSection && previewImage) {
            // Hide upload area, show preview
            uploadArea.style.display = 'none';
            previewSection.style.display = 'block';

            // Set image source
            previewImage.src = imageSrc;

            // Store file reference
            this.state.uploadedImage = file;

            // Enable analyze button
            if (analyzeBtn) {
                analyzeBtn.disabled = false;
            }

            // Initialize zoom controls
            this.initializeImageViewer();
        }
    }

    setupPreviewTools() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetZoom = document.getElementById('resetZoom');
        const annotate = document.getElementById('annotate');

        if (zoomIn) {
            zoomIn.addEventListener('click', () => this.zoomImage(1.2));
        }
        if (zoomOut) {
            zoomOut.addEventListener('click', () => this.zoomImage(0.8));
        }
        if (resetZoom) {
            resetZoom.addEventListener('click', () => this.resetImageZoom());
        }
        if (annotate) {
            annotate.addEventListener('click', () => this.toggleAnnotationMode());
        }
    }

    initializeImageViewer() {
        const viewer = document.getElementById('imageViewer');
        const image = document.getElementById('previewImage');
        
        if (viewer && image) {
            this.imageZoom = 1;
            this.imagePanX = 0;
            this.imagePanY = 0;
            
            // Mouse wheel zoom
            viewer.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.zoomImage(delta);
            });
        }
    }

    zoomImage(factor) {
        const image = document.getElementById('previewImage');
        if (image) {
            this.imageZoom = Math.max(0.5, Math.min(3, this.imageZoom * factor));
            this.updateImageTransform();
        }
    }

    resetImageZoom() {
        this.imageZoom = 1;
        this.imagePanX = 0;
        this.imagePanY = 0;
        this.updateImageTransform();
    }

    updateImageTransform() {
        const image = document.getElementById('previewImage');
        if (image) {
            image.style.transform = `scale(${this.imageZoom}) translate(${this.imagePanX}px, ${this.imagePanY}px)`;
        }
    }

    toggleAnnotationMode() {
        // Toggle annotation mode
        const annotateBtn = document.getElementById('annotate');
        const overlay = document.getElementById('annotationOverlay');
        
        if (overlay) {
            overlay.style.pointerEvents = overlay.style.pointerEvents === 'none' ? 'auto' : 'none';
            overlay.style.cursor = overlay.style.pointerEvents === 'none' ? 'default' : 'crosshair';
            
            if (annotateBtn) {
                annotateBtn.classList.toggle('active');
            }
        }
    }

    // ===== TEXT ANALYSIS FUNCTIONALITY =====
    setupTextAnalysis() {
        const symptomEditor = document.getElementById('symptomEditor');
        const analyzeBtn = document.getElementById('analyzeTextBtn');
        const voiceInput = document.getElementById('voiceInput');
        const clearText = document.getElementById('clearText');

        if (symptomEditor) {
            // Handle content changes
            symptomEditor.addEventListener('input', () => {
                this.updateCharacterCount();
                this.autoSaveText();
            });

            // Handle focus/blur
            symptomEditor.addEventListener('focus', () => {
                if (symptomEditor.textContent === 'Describe patient symptoms in detail...') {
                    symptomEditor.textContent = '';
                }
            });

            symptomEditor.addEventListener('blur', () => {
                if (symptomEditor.textContent.trim() === '') {
                    symptomEditor.textContent = 'Describe patient symptoms in detail...';
                }
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeText();
            });
        }

        if (voiceInput) {
            voiceInput.addEventListener('click', () => {
                this.startVoiceInput();
            });
        }

        if (clearText) {
            clearText.addEventListener('click', () => {
                this.clearSymptomText();
            });
        }

        // Setup toolbar
        this.setupTextToolbar();
    }

    setupTextToolbar() {
        const toolbarButtons = document.querySelectorAll('.toolbar-btn');
        
        toolbarButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                this.executeTextCommand(command);
            });
        });
    }

    executeTextCommand(command) {
        const editor = document.getElementById('symptomEditor');
        if (editor) {
            document.execCommand(command, false, null);
            editor.focus();
        }
    }

    updateCharacterCount() {
        const editor = document.getElementById('symptomEditor');
        const charCount = document.getElementById('charCount');
        
        if (editor && charCount) {
            const text = editor.textContent;
            const count = text.length;
            charCount.textContent = count;
            
            // Update color based on count
            if (count > 900) {
                charCount.style.color = 'var(--error)';
            } else if (count > 800) {
                charCount.style.color = 'var(--warning)';
            } else {
                charCount.style.color = 'var(--gray-500)';
            }
        }
    }

    autoSaveText() {
        // Auto-save to localStorage
        const editor = document.getElementById('symptomEditor');
        if (editor) {
            localStorage.setItem('symptomDraft', editor.textContent);
        }
    }

    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            this.showToast('Voice input not supported in this browser', 'warning');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            this.showToast('Voice input started', 'info');
            const voiceBtn = document.getElementById('voiceInput');
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
            }
        };

        recognition.onresult = (event) => {
            const editor = document.getElementById('symptomEditor');
            if (editor) {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                editor.textContent = transcript;
                this.updateCharacterCount();
            }
        };

        recognition.onerror = (event) => {
            this.showToast('Voice input error: ' + event.error, 'error');
            const voiceBtn = document.getElementById('voiceInput');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
            }
        };

        recognition.onend = () => {
            this.showToast('Voice input ended', 'info');
            const voiceBtn = document.getElementById('voiceInput');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
            }
        };

        recognition.start();
    }

    clearSymptomText() {
        const editor = document.getElementById('symptomEditor');
        if (editor) {
            editor.textContent = 'Describe patient symptoms in detail...';
            this.updateCharacterCount();
            this.showToast('Text cleared', 'info');
        }
    }

    // ===== BODY MAP =====
    initializeBodyMap() {
        const bodyRegions = document.querySelectorAll('.body-region');
        
        bodyRegions.forEach(region => {
            region.addEventListener('click', () => {
                const regionName = region.dataset.region;
                this.toggleBodyRegion(regionName, region);
            });
        });
    }

    toggleBodyRegion(regionName, element) {
        if (this.state.selectedBodyRegions.has(regionName)) {
            this.state.selectedBodyRegions.delete(regionName);
            element.classList.remove('selected');
        } else {
            this.state.selectedBodyRegions.add(regionName);
            element.classList.add('selected');
        }
        
        this.updateSymptomText();
    }

    // ===== SYMPTOM TAGS =====
    initializeSymptomTags() {
        const symptomTags = document.querySelectorAll('.symptom-tag');
        
        symptomTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const symptom = tag.dataset.symptom;
                this.toggleSymptomTag(symptom, tag);
            });
        });
    }

    toggleSymptomTag(symptom, element) {
        if (this.state.selectedSymptoms.has(symptom)) {
            this.state.selectedSymptoms.delete(symptom);
            element.classList.remove('selected');
        } else {
            this.state.selectedSymptoms.add(symptom);
            element.classList.add('selected');
        }
        
        this.updateSymptomText();
    }

    updateSymptomText() {
        const editor = document.getElementById('symptomEditor');
        if (!editor) return;

        let text = '';
        
        // Add body regions
        if (this.state.selectedBodyRegions.size > 0) {
            text += `Affected areas: ${Array.from(this.state.selectedBodyRegions).join(', ')}. `;
        }
        
        // Add symptoms
        if (this.state.selectedSymptoms.size > 0) {
            text += `Symptoms: ${Array.from(this.state.selectedSymptoms).join(', ')}. `;
        }
        
        // Don't override existing text if there's content
        if (editor.textContent === 'Describe patient symptoms in detail...') {
            editor.textContent = text || 'Describe patient symptoms in detail...';
        } else if (text) {
            editor.textContent = text + ' ' + editor.textContent;
        }
        
        this.updateCharacterCount();
    }

    // ===== TEMPLATES =====
    initializeTemplates() {
        const templates = document.querySelectorAll('.template-item');
        
        templates.forEach(template => {
            template.addEventListener('click', () => {
                const templateName = template.dataset.template;
                this.applyTemplate(templateName);
            });
        });
    }

    applyTemplate(templateName) {
        const templates = {
            general: 'Patient presents with skin concerns requiring evaluation. On examination, findings include [describe findings]. Patient reports [duration] of symptoms. No significant medical history relevant to skin condition.',
            rash: 'Patient presents with rash characterized by [appearance, distribution, duration]. Associated symptoms include [itching, pain, fever]. Rash is [localized/distributed] on [body areas]. No previous similar episodes reported.',
            lesion: 'Patient presents with [single/multiple] lesion(s) on [location]. Lesion measures [size] and appears [color, texture, borders]. Patient reports [symptoms]. Duration: [time period]. No discharge or bleeding noted.'
        };

        const editor = document.getElementById('symptomEditor');
        if (editor && templates[templateName]) {
            editor.textContent = templates[templateName];
            this.updateCharacterCount();
            this.showToast(`Template "${templateName}" applied`, 'success');
        }
    }

    // ===== QUICK ACTIONS =====
    setupQuickActions() {
        const newImageAnalysis = document.getElementById('newImageAnalysis');
        const newTextAnalysis = document.getElementById('newTextAnalysis');
        const patientManagement = document.getElementById('patientManagement');

        if (newImageAnalysis) {
            newImageAnalysis.addEventListener('click', () => {
                this.startImageAnalysis();
            });
        }

        if (newTextAnalysis) {
            newTextAnalysis.addEventListener('click', () => {
                this.startTextAnalysis();
            });
        }

        if (patientManagement) {
            patientManagement.addEventListener('click', () => {
                this.showPatientManagement();
            });
        }
    }

    startImageAnalysis() {
        console.log('startImageAnalysis called');
        
        // Scroll to analysis section and switch to image tab
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            console.log('Showing analysis section');
            analysisSection.style.display = 'block';
            analysisSection.scrollIntoView({ behavior: 'smooth' });
            this.switchTab('image');
            
            // Focus on upload area
            setTimeout(() => {
                const uploadArea = document.getElementById('modernUploadArea');
                if (uploadArea) {
                    uploadArea.classList.add('highlight');
                    setTimeout(() => {
                        uploadArea.classList.remove('highlight');
                    }, 2000);
                }
            }, 500);
        } else {
            console.error('Analysis section not found');
            this.showToast('Analysis section not available', 'error');
        }
    }

    startTextAnalysis() {
        console.log('startTextAnalysis called');
        
        // Scroll to analysis section and switch to text tab
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            console.log('Showing analysis section for text');
            analysisSection.style.display = 'block';
            analysisSection.scrollIntoView({ behavior: 'smooth' });
            this.switchTab('text');
            
            // Focus on text editor
            setTimeout(() => {
                const editor = document.getElementById('symptomEditor');
                if (editor) {
                    editor.focus();
                }
            }, 500);
        } else {
            console.error('Analysis section not found');
            this.showToast('Analysis section not available', 'error');
        }
    }

    showPatientManagement() {
        this.showToast('Patient management feature coming soon', 'info');
    }

    // ===== ANALYSIS FUNCTIONS =====
    async analyzeImage() {
        console.log('analyzeImage called');
        
        if (!this.state.uploadedImage) {
            console.log('No image uploaded');
            this.showToast('Please upload an image first', 'warning');
            return;
        }

        if (this.state.analysisInProgress) {
            console.log('Analysis already in progress');
            return;
        }

        try {
            this.state.analysisInProgress = true;
            console.log('Starting image analysis...');
            this.showLoading('Analyzing image with AI...');

            // Create form data
            const formData = new FormData();
            formData.append('image', this.state.uploadedImage);

            // Get preprocessing options
            const enhanceContrast = document.getElementById('enhanceContrast');
            const removeHair = document.getElementById('removeHair');
            const noiseReduction = document.getElementById('noiseReduction');
            
            console.log('Preprocessing options:', {
                enhanceContrast: enhanceContrast?.checked,
                removeHair: removeHair?.checked,
                noiseReduction: noiseReduction?.checked
            });
            
            if (enhanceContrast && enhanceContrast.checked) {
                formData.append('enhance_contrast', 'true');
            }
            if (removeHair && removeHair.checked) {
                formData.append('remove_hair', 'true');
            }
            if (noiseReduction && noiseReduction.checked) {
                formData.append('noise_reduction', 'true');
            }

            console.log('Making API call to:', this.config.apiEndpoints.imageAnalysis);

            // Make API call
            const response = await fetch(this.config.apiEndpoints.imageAnalysis, {
                method: 'POST',
                body: formData
            });

            console.log('API response status:', response.status);
            const result = await response.json();
            console.log('API response:', result);

            if (result.success) {
                this.displayImageResults(result.result);
                this.showToast('Analysis completed successfully', 'success');
            } else {
                throw new Error(result.error || 'Analysis failed');
            }

        } catch (error) {
            console.error('Image analysis error:', error);
            this.showToast('Analysis failed: ' + error.message, 'error');
        } finally {
            this.state.analysisInProgress = false;
            this.hideLoading();
        }
    }

    async analyzeText() {
        console.log('analyzeText called');
        
        const editor = document.getElementById('symptomEditor');
        if (!editor) {
            console.log('Symptom editor not found');
            this.showToast('Symptom editor not available', 'error');
            return;
        }
        
        const text = editor.textContent.trim();
        if (!text || text === 'Describe patient symptoms in detail...') {
            console.log('No symptoms text provided');
            this.showToast('Please describe symptoms first', 'warning');
            return;
        }

        if (this.state.analysisInProgress) {
            console.log('Analysis already in progress');
            return;
        }

        try {
            this.state.analysisInProgress = true;
            console.log('Starting text analysis...');
            console.log('Symptom text:', text.substring(0, 100) + '...');
            this.showLoading('Analyzing symptoms with AI...');

            const response = await fetch(this.config.apiEndpoints.textAnalysis, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symptoms: text
                })
            });

            console.log('Text API response status:', response.status);
            const result = await response.json();
            console.log('Text API response:', result);

            if (result.success) {
                this.displayTextResults(result.result);
                this.showToast('Analysis completed successfully', 'success');
            } else {
                throw new Error(result.error || 'Analysis failed');
            }

        } catch (error) {
            console.error('Text analysis error:', error);
            this.showToast('Analysis failed: ' + error.message, 'error');
        } finally {
            this.state.analysisInProgress = false;
            this.hideLoading();
        }
    }

    displayImageResults(result) {
        console.log('displayImageResults called with:', result);
        
        const resultsSection = document.getElementById('imageResults');
        const resultsContent = document.getElementById('imageResultsContent');
        
        if (!resultsSection || !resultsContent) {
            console.error('Results elements not found');
            this.showToast('Results display area not available', 'error');
            return;
        }
        
        resultsSection.style.display = 'block';
        
        const confidence = result.confidence || 0;
        const disease = result.disease || 'Unknown';
        const processingTime = result.processing_time_ms || 0;
        
        console.log('Displaying results:', { disease, confidence, processingTime });
        
        let html = `
            <div class="result-summary">
                <div class="primary-result">
                    <div class="disease-info">
                        <h4 class="disease-name">${disease}</h4>
                        <div class="confidence-display">
                            <div class="confidence-meter">
                                <div class="confidence-fill" style="width: ${confidence * 100}%"></div>
                            </div>
                            <span class="confidence-text">${(confidence * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="result-meta">
                        <span class="processing-time">Processed in ${processingTime}ms</span>
                        <span class="model-used">${result.model_used || 'AI Model'}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add disease info if available
        if (result.disease_info) {
            html += `
                <div class="disease-details">
                    <h5>Disease Information</h5>
                    <div class="disease-grid">
                        <div class="detail-item">
                            <label>Category:</label>
                            <span>${result.disease_info.category || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Severity:</label>
                            <span>${result.disease_info.severity || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Contagious:</label>
                            <span>${result.disease_info.contagious ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="detail-item">
                            <label>ICD-10:</label>
                            <span>${result.disease_info.icd10 || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="treatment-info">
                        <label>Treatment:</label>
                        <span>${result.disease_info.treatment || 'Consult dermatologist'}</span>
                    </div>
                </div>
            `;
        }
        
        // Add prediction chart if available
        if (result.all_predictions) {
            html += this.generatePredictionChart(result.all_predictions);
        }
        
        // Add action buttons
        html += `
            <div class="result-actions">
                <button class="btn btn-primary" onclick="window.sxModern.exportResults('image')">
                    <i class="fas fa-download"></i> Export Results
                </button>
                <button class="btn btn-outline-secondary" onclick="window.sxModern.shareResults('image')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
        
        resultsContent.innerHTML = html;
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        console.log('Results displayed successfully');
    }

    displayTextResults(result) {
        console.log('displayTextResults called with:', result);
        
        const resultsSection = document.getElementById('textResults');
        const resultsContent = document.getElementById('textResultsContent');
        
        if (!resultsSection || !resultsContent) {
            console.error('Text results elements not found');
            this.showToast('Text results display area not available', 'error');
            return;
        }
        
        resultsSection.style.display = 'block';
        
        const confidence = result.confidence || 0;
        const disease = result.disease || 'Unknown';
        const processingTime = result.processing_time_ms || 0;
        
        console.log('Displaying text results:', { disease, confidence, processingTime });
        
        let html = `
            <div class="result-summary">
                <div class="primary-result">
                    <div class="disease-info">
                        <h4 class="disease-name">${disease}</h4>
                        <div class="confidence-display">
                            <div class="confidence-meter">
                                <div class="confidence-fill" style="width: ${confidence * 100}%"></div>
                            </div>
                            <span class="confidence-text">${(confidence * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="result-meta">
                        <span class="processing-time">Processed in ${processingTime}ms</span>
                        <span class="model-used">${result.model_used || 'AI Model'}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add disease info if available
        if (result.disease_info) {
            html += `
                <div class="disease-details">
                    <h5>Disease Information</h5>
                    <div class="disease-grid">
                        <div class="detail-item">
                            <label>Category:</label>
                            <span>${result.disease_info.category || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Severity:</label>
                            <span>${result.disease_info.severity || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Contagious:</label>
                            <span>${result.disease_info.contagious ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="detail-item">
                            <label>ICD-10:</label>
                            <span>${result.disease_info.icd10 || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="treatment-info">
                        <label>Treatment:</label>
                        <span>${result.disease_info.treatment || 'Consult dermatologist'}</span>
                    </div>
                </div>
            `;
        }
        
        // Add symptom analysis
        html += `
            <div class="symptom-analysis">
                <h5>Symptom Analysis</h5>
                <p><strong>Analyzed symptoms:</strong> ${result.input_text || 'No text available'}</p>
                ${result.matched_keywords && result.matched_keywords.length > 0 ? 
                    `<p><strong>Matched keywords:</strong> ${result.matched_keywords.join(', ')}</p>` : ''}
                ${result.symptom_context && result.symptom_context.length > 0 ? 
                    `<p><strong>Symptom context:</strong> ${result.symptom_context.join(', ')}</p>` : ''}
            </div>
        `;
        
        // Add prediction chart if available
        if (result.all_predictions) {
            html += this.generatePredictionChart(result.all_predictions);
        }
        
        // Add action buttons
        html += `
            <div class="result-actions">
                <button class="btn btn-primary" onclick="window.sxModern.exportResults('text')">
                    <i class="fas fa-download"></i> Export Results
                </button>
                <button class="btn btn-outline-secondary" onclick="window.sxModern.shareResults('text')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
        
        resultsContent.innerHTML = html;
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        console.log('Text results displayed successfully');
    }

    generatePredictionChart(predictions) {
        const sortedPredictions = Object.entries(predictions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        return `
            <div class="prediction-chart">
                <h5>Top Predictions</h5>
                <div class="chart-bars">
                    ${sortedPredictions.map(([disease, confidence]) => `
                        <div class="chart-bar">
                            <div class="bar-label">${disease}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${confidence * 100}%"></div>
                                <span class="bar-value">${(confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ===== UTILITY FUNCTIONS =====
    showLoading(message = 'Processing...') {
        const modal = document.getElementById('loadingModal');
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('loadingProgress');
        
        if (modal) {
            modal.classList.add('show');
            
            if (progressText) {
                progressText.textContent = '0%';
            }
            
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) {
                    clearInterval(interval);
                    progress = 90;
                }
                
                if (progressText) {
                    progressText.textContent = Math.round(progress) + '%';
                }
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
            }, 200);
            
            this.loadingInterval = interval;
        }
    }

    hideLoading() {
        const modal = document.getElementById('loadingModal');
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('loadingProgress');
        
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
        
        if (modal) {
            // Complete progress
            if (progressText) {
                progressText.textContent = '100%';
            }
            if (progressFill) {
                progressFill.style.width = '100%';
            }
            
            // Hide after delay
            setTimeout(() => {
                modal.classList.remove('show');
                if (progressText) {
                    progressText.textContent = '0%';
                }
                if (progressFill) {
                    progressFill.style.width = '0%';
                }
            }, 500);
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.remove();
        }, duration);
        
        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }
    }

    exportResults(type) {
        this.showToast('Export functionality coming soon', 'info');
    }

    shareResults(type) {
        this.showToast('Share functionality coming soon', 'info');
    }

    // ===== KEYBOARD SHORTCUTS =====
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + /: Show shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.hideLoading();
                this.closeSidebar();
            }
        });
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl + K', description: 'Focus search' },
            { key: 'Ctrl + /', description: 'Show shortcuts' },
            { key: 'Escape', description: 'Close modals' },
            { key: 'Tab + Enter', description: 'Start analysis' }
        ];
        
        let shortcutsHtml = '<div class="shortcuts-modal"><h4>Keyboard Shortcuts</h4><ul>';
        shortcuts.forEach(shortcut => {
            shortcutsHtml += `<li><kbd>${shortcut.key}</kbd> - ${shortcut.description}</li>`;
        });
        shortcutsHtml += '</ul></div>';
        
        this.showToast('Keyboard shortcuts: ' + shortcuts.map(s => s.key).join(', '), 'info', 8000);
    }

    // ===== DRAG AND DROP =====
    initializeDragDrop() {
        const uploadArea = document.getElementById('modernUploadArea');
        
        if (uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.add('dragover');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.remove('dragover');
                });
            });
            
            uploadArea.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleImageUpload(files[0]);
                }
            });
        }
    }

    // ===== TOOLTIPS =====
    initializeTooltips() {
        // Initialize tooltips for various elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = (rect.top - 30) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - 50) + 'px';
        tooltip.style.zIndex = '9999';
        
        document.body.appendChild(tooltip);
        
        // Store reference
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    // ===== NOTIFICATION SETUP =====
    setupNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // ===== INITIALIZATION =====
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing SkinX Modern...');
    window.sxModern = new SkinXModern();
    console.log('SkinX Modern Platform Ready!');
});
