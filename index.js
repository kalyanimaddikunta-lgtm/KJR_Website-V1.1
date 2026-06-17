document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuIcon = menuToggle.querySelector('.menu-icon');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            
            // Toggle icon menu / close
            if (isActive) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close mobile menu when nav links are clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuIcon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // 3. Header Scroll Effect
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 4. Scroll triggered Animations & Stat Counter Count-up
    const statCards = document.querySelectorAll('.metric-card');
    
    const countUp = (el, target) => {
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        const timer = setInterval(() => {
            current += Math.ceil(target / 50); // Increment
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = current;
            }
        }, Math.max(stepTime, 25));
    };

    const animateStats = () => {
        statCards.forEach(card => {
            const numEl = card.querySelector('.metric-number');
            const targetVal = parseInt(card.getAttribute('data-metric'), 10);
            if (numEl && !card.classList.contains('animated')) {
                card.classList.add('animated');
                countUp(numEl, targetVal);
            }
        });
    };

    // Intersection Observer for scroll triggers
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'metrics') {
                    animateStats();
                }
                
                // Add fade-in effects to general elements
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe metrics section
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
        scrollObserver.observe(metricsSection);
    }

    // Dynamic fade-up scroll animations for cards
    const animElements = document.querySelectorAll('.solution-card, .industry-card, .team-card, .tech-content, .dashboard-mockup, .pillar-box');
    
    // Set initial animation classes
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cardObserver.observe(el);
    });

    // 5. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const currentTheme = localStorage.getItem('kjr_theme');
    
    const setTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            localStorage.setItem('kjr_theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('kjr_theme', 'dark');
        }
        if (typeof applySiteSettings === 'function') {
            applySiteSettings(getSiteSettings());
        }
    };

    // Load initial theme
    if (currentTheme) {
        setTheme(currentTheme);
    } else {
        // Default to dark theme if not set
        setTheme('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-theme');
            setTheme(isLight ? 'dark' : 'light');
        });
    }

    // 6. Modal Controllers (Request Quote & Admin Console)
    const quoteModal = document.getElementById('quoteModal');
    const navCta = document.getElementById('nav-cta-btn');
    const navCtaMobile = document.getElementById('nav-cta-btn-mobile');
    const closeQuoteModal = document.getElementById('closeQuoteModal');

    const adminModal = document.getElementById('adminModal');
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const closeAdminModal = document.getElementById('closeAdminModal');
    
    const consoleModal = document.getElementById('consoleModal');
    const closeConsoleModal = document.getElementById('closeConsoleModal');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (quoteModal) {
        if (navCta) navCta.addEventListener('click', (e) => { e.preventDefault(); openModal(quoteModal); });
        if (navCtaMobile) navCtaMobile.addEventListener('click', (e) => { e.preventDefault(); openModal(quoteModal); });
        if (closeQuoteModal) closeQuoteModal.addEventListener('click', () => closeModal(quoteModal));
    }

    const openAdminPortal = (e) => {
        if (e) e.preventDefault();
        // Reset login step visibility
        const step1 = document.getElementById('loginStepCredentials');
        const step2 = document.getElementById('loginStepOtp');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        const err1 = document.getElementById('loginErrorMsg');
        const err2 = document.getElementById('otpErrorMsg');
        if (err1) err1.style.display = 'none';
        if (err2) err2.style.display = 'none';
        openModal(adminModal);
    };

    if (headerLoginBtn) headerLoginBtn.addEventListener('click', openAdminPortal);
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', openAdminPortal);

    if (closeAdminModal) {
        closeAdminModal.addEventListener('click', () => closeModal(adminModal));
    }
    if (closeConsoleModal) {
        closeConsoleModal.addEventListener('click', () => closeModal(consoleModal));
    }

    // Close modals on clicking backdrop overlay
    window.addEventListener('click', (e) => {
        if (e.target === quoteModal) closeModal(quoteModal);
        if (e.target === adminModal) closeModal(adminModal);
        if (e.target === consoleModal) closeModal(consoleModal);
    });

    // 7. Web3Forms Email Dispatch Helper
    const sendEmail = async (subject, messageText) => {
        const accessKey = window.env ? window.env.WEB3FORMS_ACCESS_KEY : "YOUR_ACCESS_KEY_HERE";
        const adminEmail = window.env ? window.env.ADMIN_EMAIL : "admin@kjrsupplychain.com";
        
        if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE" || accessKey.length < 5) {
            console.warn("Web3Forms Access Key is not configured. Falling back to simulated log/alert.");
            return false;
        }
        
        const payload = {
            access_key: accessKey,
            subject: subject,
            from_name: "KJR Automated System",
            to_email: adminEmail,
            message: messageText
        };
        
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error("Error sending email via Web3Forms API:", error);
            return false;
        }
    };

    // 8. Site Settings Management
    const DEFAULT_SETTINGS = {
        logoTitle: "KJR",
        logoSubtitle: "Supply Chain Solutions",
        logoImage: "", // if present, holds base64 data url
        about: "KJR Supply Chain Solutions is built upon a legacy of trust, logistics excellence, and client commitment. We blend decades of industry domain knowledge with a state-of-the-art tech-enabled operation model. Our foundation is anchored on three core pillars that drive every action, route, and delivery.",
        phone: "+91 91821 30369",
        email: "admin@kjrsupplychain.com",
        address: "Hyderabad, Telangana, India",
        gst: "37ABEFK5980C1Z8"
    };

    function getSiteSettings() {
        const stored = localStorage.getItem('kjr_site_settings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Auto-migrate if the stored settings contain the old placeholder GSTIN
                if (parsed.gst === "36AAAAC1234A1Z1") {
                    parsed.gst = "37ABEFK5980C1Z8";
                    localStorage.setItem('kjr_site_settings', JSON.stringify(parsed));
                }
                return parsed;
            } catch (e) {
                // Fallback to default
            }
        }
        localStorage.setItem('kjr_site_settings', JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
    }

    function applySiteSettings(settings) {
        // Apply Phone
        const phoneEl = document.getElementById('footerPhone');
        if (phoneEl) {
            phoneEl.textContent = settings.phone;
            phoneEl.setAttribute('href', `tel:${settings.phone.replace(/\s+/g, '')}`);
        }
        // Apply Email
        const emailEl = document.getElementById('footerEmail');
        if (emailEl) {
            emailEl.textContent = settings.email;
            emailEl.setAttribute('href', `mailto:${settings.email}`);
        }
        // Apply Address
        const addrEl = document.getElementById('footerAddress');
        if (addrEl) addrEl.textContent = settings.address;
        
        // Apply GST
        const gstEl = document.getElementById('footerGst');
        if (gstEl) gstEl.textContent = settings.gst;
        
        // Apply About Text
        const aboutEl = document.getElementById('aboutTextParagraph');
        if (aboutEl) aboutEl.textContent = settings.about;

        // Apply Logo Titles
        const navTitle = document.getElementById('navLogoTitle');
        const navSub = document.getElementById('navLogoSubtitle');
        const footTitle = document.getElementById('footerLogoTitle');
        const footSub = document.getElementById('footerLogoSubtitle');

        if (navTitle) navTitle.textContent = settings.logoTitle;
        if (navSub) navSub.textContent = settings.logoSubtitle;
        if (footTitle) footTitle.textContent = settings.logoTitle;
        if (footSub) footSub.textContent = settings.logoSubtitle;

        // Apply Logo Image Override
        const navImg = document.getElementById('navLogoImg');
        const footImg = document.getElementById('footerLogoImg');
        
        let navLogoUrl = settings.logoImage;
        let footLogoUrl = settings.logoImage ? settings.logoImage : "assets/logo.svg";
        
        if (!navLogoUrl) {
            navLogoUrl = document.body.classList.contains('light-theme') ? "assets/logo-light.svg" : "assets/logo.svg";
        }

        if (navImg) navImg.setAttribute('src', navLogoUrl);
        if (footImg) footImg.setAttribute('src', footLogoUrl);
    }

    // Load initial settings
    applySiteSettings(getSiteSettings());

    // 9. Leadership Team CRUD & Photos Logic
    const DEFAULT_TEAM = [
        { id: "1", name: "K.J.R. Prasad Babu", role: "Founder", initials: "KPB", bio: "Guiding operations scale and expansion strategy with decades of deep supply chain management expertise.", photo: "" },
        { id: "2", name: "P. Hemalatha", role: "Cofounder", initials: "PH", bio: "Co-established the firm’s legacy and structural framework, guiding the core ethics and long-term values.", photo: "" }
    ];

    const getTeamMembers = () => {
        const stored = localStorage.getItem('kjr_team_members');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const hasOldMember = parsed.some(m => m.name === "Prasanna Chakravarthi" || m.role === "Chief Executive Officer (CEO)");
                const hasHemaAsFounder = parsed.some(m => m.name === "P. Hemalatha" && m.role === "Founder");
                const hasOldFounderName = parsed.some(m => m.name === "K.J. Rajendra Prasad");
                
                if (hasOldMember || hasHemaAsFounder || hasOldFounderName || parsed.length !== 2) {
                    localStorage.setItem('kjr_team_members', JSON.stringify(DEFAULT_TEAM));
                    return DEFAULT_TEAM;
                }
                return parsed;
            } catch (e) {
                // Fallback to default
            }
        }
        localStorage.setItem('kjr_team_members', JSON.stringify(DEFAULT_TEAM));
        return DEFAULT_TEAM;
    };

    const renderTeamGrid = (members) => {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;
        teamGrid.innerHTML = '';
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';
            
            // Build avatar HTML based on whether photo is present. Omit wrapper completely if no photo is set.
            let avatarHtml = '';
            if (member.photo) {
                avatarHtml = `
                    <div class="team-avatar-wrapper">
                        <div class="team-avatar-placeholder">
                            <img src="${member.photo}" class="team-avatar-img" alt="${member.name}">
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                ${avatarHtml}
                <div class="team-role" style="margin-bottom: 8px;">${member.role}</div>
                <h3 class="team-name" style="font-size: 1.45rem; margin-bottom: 16px; font-weight: 800; color: var(--text-primary);">${member.name}</h3>
                <p class="team-bio">${member.bio}</p>
            `;
            teamGrid.appendChild(card);
        });
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Load and render team members
    const teamMembers = getTeamMembers();
    renderTeamGrid(teamMembers);

    // 10. Admin Authentication & OTP Logic
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const loginStepCredentials = document.getElementById('loginStepCredentials');
    const loginStepOtp = document.getElementById('loginStepOtp');
    const adminOtpForm = document.getElementById('adminOtpForm');
    const otpErrorMsg = document.getElementById('otpErrorMsg');
    const btnBackToLogin = document.getElementById('btnBackToLogin');
    const otpNotice = document.getElementById('otpNotice');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('adminUsername').value.trim();
            const passwordInput = document.getElementById('adminPassword').value.trim();
            
            if (usernameInput === 'admin' && passwordInput === 'kjrsupply') {
                if (loginErrorMsg) loginErrorMsg.style.display = 'none';
                
                // Generate 6 digit code
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                sessionStorage.setItem('admin_otp', otp);
                
                const adminEmail = window.env ? window.env.ADMIN_EMAIL : "admin@kjrsupplychain.com";
                if (otpNotice) otpNotice.textContent = `A 6-digit code has been sent to ${adminEmail}.`;
                
                // Dispatch email
                const emailSuccess = await sendEmail(
                    "KJR Portal Verification Code", 
                    `KJR Admin Portal Access request.\n\nYour 6-digit OTP code is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this, please ignore this email.`
                );
                
                // Test fallback if no token set or email fails
                if (!emailSuccess) {
                    alert(`[ADMIN NOTIFICATION OTP]: ${otp}`);
                }
                
                // Swap step
                if (loginStepCredentials) loginStepCredentials.style.display = 'none';
                if (loginStepOtp) loginStepOtp.style.display = 'block';
                if (adminOtpForm) adminOtpForm.reset();
            } else {
                if (loginErrorMsg) loginErrorMsg.style.display = 'block';
            }
        });
    }

    if (btnBackToLogin) {
        btnBackToLogin.addEventListener('click', () => {
            if (loginStepOtp) loginStepOtp.style.display = 'none';
            if (loginStepCredentials) loginStepCredentials.style.display = 'block';
            sessionStorage.removeItem('admin_otp');
        });
    }

    if (adminOtpForm) {
        adminOtpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredOtp = document.getElementById('otpCode').value.trim();
            const actualOtp = sessionStorage.getItem('admin_otp');
            
            if (enteredOtp && enteredOtp === actualOtp) {
                closeModal(adminModal);
                sessionStorage.removeItem('admin_otp');
                if (otpErrorMsg) otpErrorMsg.style.display = 'none';
                adminLoginForm.reset();
                adminOtpForm.reset();
                openModal(consoleModal);
                // Open first tab by default
                triggerTabSwitch('tab-team');
            } else {
                if (otpErrorMsg) otpErrorMsg.style.display = 'block';
            }
        });
    }

    // 11. Admin Panel Tabs Switching
    const triggerTabSwitch = (tabId) => {
        // Tab buttons
        document.querySelectorAll('.console-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Tab Content Panels
        document.querySelectorAll('.console-tab-content').forEach(panel => {
            if (panel.getAttribute('id') === tabId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Load specific tab content lists
        if (tabId === 'tab-team') {
            renderConsoleList();
        } else if (tabId === 'tab-settings') {
            loadSettingsForm();
        } else if (tabId === 'tab-quotes') {
            renderQuotesList();
        }
    };

    document.querySelectorAll('.console-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            triggerTabSwitch(tabId);
        });
    });

    // 12. Admin Console: Team Member CRUD
    const consoleTeamList = document.getElementById('consoleTeamList');
    const consoleMemberForm = document.getElementById('consoleMemberForm');
    const btnConsoleAddNew = document.getElementById('btn-console-add-new');
    const btnConsoleCancel = document.getElementById('btn-console-cancel');
    const consoleFormTitle = document.getElementById('consoleFormTitle');
    const filePhoto = document.getElementById('memberPhoto');
    const hiddenPhotoBase64 = document.getElementById('memberPhotoBase64');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const photoPreview = document.getElementById('photoPreview');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    // Handle photo file selection
    if (filePhoto) {
        filePhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    if (hiddenPhotoBase64) hiddenPhotoBase64.value = base64;
                    if (photoPreview) photoPreview.setAttribute('src', base64);
                    if (photoPreviewContainer) photoPreviewContainer.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemovePhoto) {
        btnRemovePhoto.addEventListener('click', () => {
            if (filePhoto) filePhoto.value = '';
            if (hiddenPhotoBase64) hiddenPhotoBase64.value = '';
            if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
        });
    }

    const renderConsoleList = () => {
        if (!consoleTeamList) return;
        const members = getTeamMembers();
        consoleTeamList.innerHTML = '';
        members.forEach(member => {
            const item = document.createElement('div');
            item.className = 'console-member-item';
            item.innerHTML = `
                <div class="console-member-info">
                    <span class="console-member-name">${member.name}</span>
                    <span class="console-member-role">${member.role}</span>
                </div>
                <div class="console-member-actions">
                    <button class="console-btn-edit" data-id="${member.id}">Edit</button>
                    <button class="console-btn-delete" data-id="${member.id}">Delete</button>
                </div>
            `;
            consoleTeamList.appendChild(item);
        });

        // Edit handlers
        consoleTeamList.querySelectorAll('.console-btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const members = getTeamMembers();
                const member = members.find(m => m.id === id);
                if (member) {
                    document.getElementById('editMemberId').value = member.id;
                    document.getElementById('memberName').value = member.name;
                    document.getElementById('memberRole').value = member.role;
                    document.getElementById('memberInitials').value = member.initials;
                    document.getElementById('memberBio').value = member.bio;
                    
                    if (member.photo) {
                        if (hiddenPhotoBase64) hiddenPhotoBase64.value = member.photo;
                        if (photoPreview) photoPreview.setAttribute('src', member.photo);
                        if (photoPreviewContainer) photoPreviewContainer.style.display = 'flex';
                    } else {
                        if (hiddenPhotoBase64) hiddenPhotoBase64.value = '';
                        if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
                    }

                    if (consoleFormTitle) consoleFormTitle.textContent = 'Edit Member Details';
                }
            });
        });

        // Delete handlers
        consoleTeamList.querySelectorAll('.console-btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to remove this team member?')) {
                    let members = getTeamMembers();
                    members = members.filter(m => m.id !== id);
                    localStorage.setItem('kjr_team_members', JSON.stringify(members));
                    renderConsoleList();
                    renderTeamGrid(members);
                    resetConsoleForm();
                }
            });
        });
    };

    const resetConsoleForm = () => {
        if (consoleMemberForm) {
            consoleMemberForm.reset();
            document.getElementById('editMemberId').value = '';
        }
        if (filePhoto) filePhoto.value = '';
        if (hiddenPhotoBase64) hiddenPhotoBase64.value = '';
        if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
        if (consoleFormTitle) consoleFormTitle.textContent = 'Member Details';
    };

    if (btnConsoleAddNew) {
        btnConsoleAddNew.addEventListener('click', () => {
            resetConsoleForm();
            if (consoleFormTitle) consoleFormTitle.textContent = 'Add New Member';
        });
    }

    if (btnConsoleCancel) {
        btnConsoleCancel.addEventListener('click', () => {
            resetConsoleForm();
        });
    }

    if (consoleMemberForm) {
        consoleMemberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editMemberId').value;
            const name = document.getElementById('memberName').value.trim();
            const role = document.getElementById('memberRole').value.trim();
            const initials = document.getElementById('memberInitials').value.trim().toUpperCase();
            const bio = document.getElementById('memberBio').value.trim();
            const photo = document.getElementById('memberPhotoBase64').value;

            let members = getTeamMembers();

            if (id) {
                members = members.map(m => {
                    if (m.id === id) {
                        return { id, name, role, initials, bio, photo };
                    }
                    return m;
                });
            } else {
                const newMember = {
                    id: Date.now().toString(),
                    name,
                    role,
                    initials,
                    bio,
                    photo
                };
                members.push(newMember);
            }

            localStorage.setItem('kjr_team_members', JSON.stringify(members));
            renderConsoleList();
            renderTeamGrid(members);
            resetConsoleForm();
        });
    }

    // 13. Admin Console: Site Settings Management
    const consoleSettingsForm = document.getElementById('consoleSettingsForm');
    const fileLogoImage = document.getElementById('settingLogoImage');
    const hiddenLogoImageBase64 = document.getElementById('settingLogoImageBase64');
    const logoPreviewContainer = document.getElementById('logoPreviewContainer');
    const logoPreview = document.getElementById('logoPreview');
    const btnRemoveLogoImage = document.getElementById('btnRemoveLogoImage');

    if (fileLogoImage) {
        fileLogoImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    if (hiddenLogoImageBase64) hiddenLogoImageBase64.value = base64;
                    if (logoPreview) logoPreview.setAttribute('src', base64);
                    if (logoPreviewContainer) logoPreviewContainer.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemoveLogoImage) {
        btnRemoveLogoImage.addEventListener('click', () => {
            if (fileLogoImage) fileLogoImage.value = '';
            if (hiddenLogoImageBase64) hiddenLogoImageBase64.value = '';
            if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
        });
    }

    const loadSettingsForm = () => {
        const settings = getSiteSettings();
        document.getElementById('settingLogoTitle').value = settings.logoTitle;
        document.getElementById('settingLogoSubtitle').value = settings.logoSubtitle;
        document.getElementById('settingAbout').value = settings.about;
        document.getElementById('settingPhone').value = settings.phone;
        document.getElementById('settingEmail').value = settings.email;
        document.getElementById('settingAddress').value = settings.address;
        document.getElementById('settingGst').value = settings.gst;
        
        if (settings.logoImage) {
            if (hiddenLogoImageBase64) hiddenLogoImageBase64.value = settings.logoImage;
            if (logoPreview) logoPreview.setAttribute('src', settings.logoImage);
            if (logoPreviewContainer) logoPreviewContainer.style.display = 'flex';
        } else {
            if (hiddenLogoImageBase64) hiddenLogoImageBase64.value = '';
            if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
        }
    };

    if (consoleSettingsForm) {
        consoleSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const settings = {
                logoTitle: document.getElementById('settingLogoTitle').value.trim(),
                logoSubtitle: document.getElementById('settingLogoSubtitle').value.trim(),
                logoImage: document.getElementById('settingLogoImageBase64').value,
                about: document.getElementById('settingAbout').value.trim(),
                phone: document.getElementById('settingPhone').value.trim(),
                email: document.getElementById('settingEmail').value.trim(),
                address: document.getElementById('settingAddress').value.trim(),
                gst: document.getElementById('settingGst').value.trim()
            };

            localStorage.setItem('kjr_site_settings', JSON.stringify(settings));
            applySiteSettings(settings);
            alert('Site Settings successfully saved and updated!');
        });
    }

    // 14. Quote Requests Submissions History
    const consoleQuotesContainer = document.getElementById('consoleQuotesContainer');
    const consoleQuoteCount = document.getElementById('consoleQuoteCount');
    const btnConsoleClearQuotes = document.getElementById('btn-console-clear-quotes');
    const quoteForm = document.getElementById('quoteForm');

    const getQuotes = () => {
        return JSON.parse(localStorage.getItem('kjr_quote_requests') || '[]');
    };

    const updateQuotesBadge = () => {
        const quotes = getQuotes();
        if (consoleQuoteCount) consoleQuoteCount.textContent = quotes.length;
    };

    const renderQuotesList = () => {
        if (!consoleQuotesContainer) return;
        const quotes = getQuotes();
        consoleQuotesContainer.innerHTML = '';
        updateQuotesBadge();

        if (quotes.length === 0) {
            consoleQuotesContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 40px 0;">No client quotes submitted yet.</div>`;
            return;
        }

        quotes.forEach(quote => {
            const card = document.createElement('div');
            card.className = 'quote-request-item';
            card.innerHTML = `
                <div class="quote-request-header">
                    <span class="quote-request-client">${quote.name} <span style="font-weight: 500; font-size: 0.8rem; color: var(--text-muted);">from ${quote.company}</span></span>
                    <span class="quote-request-date">${quote.date}</span>
                </div>
                <div class="quote-request-details">
                    <div class="quote-request-detail-item">
                        <span class="quote-request-label">Phone</span>
                        <a href="tel:${quote.phone}" class="quote-request-val" style="color: var(--accent);">${quote.phone}</a>
                    </div>
                    <div class="quote-request-detail-item">
                        <span class="quote-request-label">Email</span>
                        <a href="mailto:${quote.email}" class="quote-request-val" style="color: var(--accent);">${quote.email}</a>
                    </div>
                    <div class="quote-request-detail-item">
                        <span class="quote-request-label">Required Service</span>
                        <span class="quote-request-val">${quote.service}</span>
                    </div>
                    <div class="quote-request-detail-item">
                        <span class="quote-request-label">Daily Deliveries</span>
                        <span class="quote-request-val">${quote.scale}</span>
                    </div>
                </div>
                ${quote.message ? `
                <div class="quote-request-msg">
                    ${quote.message}
                </div>` : ''}
                <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
                    <button class="console-btn-delete btn-delete-quote" data-id="${quote.id}" style="padding: 3px 8px; font-size: 0.7rem;">Delete Log</button>
                </div>
            `;
            consoleQuotesContainer.appendChild(card);
        });

        // Delete quote handler
        consoleQuotesContainer.querySelectorAll('.btn-delete-quote').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                let quotesList = getQuotes();
                quotesList = quotesList.filter(q => q.id !== id);
                localStorage.setItem('kjr_quote_requests', JSON.stringify(quotesList));
                renderQuotesList();
            });
        });
    };

    if (btnConsoleClearQuotes) {
        btnConsoleClearQuotes.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire submissions log history?')) {
                localStorage.setItem('kjr_quote_requests', '[]');
                renderQuotesList();
            }
        });
    }

    // Capture homepage quote form submissions
    if (quoteForm) {
        // Remove standard form submit actions, handle in JS
        quoteForm.removeAttribute('onsubmit');
        
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newQuote = {
                id: Date.now().toString(),
                name: document.getElementById('clientName').value.trim(),
                company: document.getElementById('companyName').value.trim(),
                email: document.getElementById('clientEmail').value.trim(),
                phone: document.getElementById('clientPhone').value.trim(),
                service: document.getElementById('serviceType').value,
                scale: document.getElementById('operationalScale').value,
                message: document.getElementById('message').value.trim(),
                date: new Date().toLocaleString()
            };

            console.log("Client Quote Submission:", newQuote);

            // Save in localStorage
            const quotesList = getQuotes();
            quotesList.push(newQuote);
            localStorage.setItem('kjr_quote_requests', JSON.stringify(quotesList));
            updateQuotesBadge();

            // Format body content
            const subject = `KJR Quote Submission - ${newQuote.name} (${newQuote.company})`;
            const emailBody = `
            New custom quote request received!
            
            Name: ${newQuote.name}
            Company: ${newQuote.company}
            Email: ${newQuote.email}
            Phone: ${newQuote.phone}
            Service: ${newQuote.service}
            Daily Scale: ${newQuote.scale}
            
            Context/Requirements:
            ${newQuote.message || 'No additional message provided.'}
            
            Submitted on: ${newQuote.date}
            `;

            // Send notification email
            const emailSuccess = await sendEmail(subject, emailBody);
            
            closeModal(quoteModal);
            quoteForm.reset();

            // Direct notify fallback
            if (!emailSuccess) {
                alert(`Quote Submission Saved! (Notification: Web3Forms not fully set up. Saved log in Admin Panel.)`);
            } else {
                alert('Quote request sent successfully! We will get in touch shortly.');
            }
        });
    }

    // Set initial quotes count badge
    updateQuotesBadge();


    // 6. KJR Dashboard Visual Animations
    
    // Circular Gauge Animation
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
        
        // Animate stroke offset
        setTimeout(() => {
            const offset = circumference - (96.7 / 100) * circumference;
            progressCircle.style.transition = 'stroke-dashoffset 2s ease-out';
            progressCircle.style.strokeDashoffset = offset;
        }, 800);
    }

    // Canvas Fulfillment Chart Implementation
    const chartCanvas = document.getElementById('deliveryChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const data = [12, 19, 14, 25, 22, 28, 32];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Custom Drawing logic (High-tech style)
        const drawChart = () => {
            const width = chartCanvas.width;
            const height = chartCanvas.height;
            ctx.clearRect(0, 0, width, height);
            
            // Draw subtle chart grid horizontal lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 1; i <= 3; i++) {
                const y = (height - 20) * (i / 4) + 10;
                ctx.beginPath();
                ctx.moveTo(25, y);
                ctx.lineTo(width - 10, y);
                ctx.stroke();
            }

            // X-axis border line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(25, height - 20);
            ctx.lineTo(width - 10, height - 20);
            ctx.stroke();
            
            // Chart coordinates map
            const maxVal = 35;
            const points = data.map((val, idx) => {
                const x = 25 + (idx * ((width - 35) / (data.length - 1)));
                const y = height - 20 - ((val / maxVal) * (height - 30));
                return { x, y };
            });

            // 1. Draw smooth neon orange background gradient under curve
            const gradient = ctx.createLinearGradient(0, 0, 0, height - 20);
            gradient.addColorStop(0, 'rgba(255, 106, 0, 0.15)');
            gradient.addColorStop(1, 'rgba(255, 106, 0, 0.0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(points[0].x, height - 20);
            for (let i = 0; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.lineTo(points[points.length - 1].x, height - 20);
            ctx.closePath();
            ctx.fill();

            // 2. Draw line path with round caps
            ctx.strokeStyle = '#ff6a00';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // 3. Draw grid labels (labels & points)
            ctx.fillStyle = '#64748b';
            ctx.font = '8px Inter, sans-serif';
            ctx.textAlign = 'center';
            
            labels.forEach((label, idx) => {
                const x = 25 + (idx * ((width - 35) / (data.length - 1)));
                ctx.fillText(label, x, height - 5);
            });

            // Y Axis markers
            ctx.textAlign = 'right';
            ctx.fillText('35h', 20, 15);
            ctx.fillText('18h', 20, (height - 20) / 2 + 5);
            ctx.fillText('0', 20, height - 18);

            // 4. Draw node points
            points.forEach((pt, idx) => {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#ff6a00';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        };

        drawChart();
    }

    // 7. Operations simulation ticking
    const activeTransitEl = document.querySelector('.dash-stat-box:nth-child(1) .dash-stat-value');
    if (activeTransitEl) {
        setInterval(() => {
            let current = parseInt(activeTransitEl.textContent, 10);
            const change = Math.random() > 0.5 ? 1 : -1;
            const nextVal = Math.max(330, Math.min(360, current + change));
            activeTransitEl.textContent = nextVal;
        }, 4000);
    }
});
