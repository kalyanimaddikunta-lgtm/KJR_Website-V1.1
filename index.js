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
    const kjrLoginLink = document.getElementById('kjrLoginLink');
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
        
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                closeModal(quoteModal);
            });
        }
    }

    // Admin Access Modals Trigger
    if (kjrLoginLink) {
        kjrLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(adminModal);
        });
    }
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

    // 7. Leadership Team CRUD & Persistence Logic
    const DEFAULT_TEAM = [
        { id: "1", name: "Prasanna Chakravarthi", role: "Chief Executive Officer (CEO)", initials: "PC", bio: "Driving strategic growth, technology integrations, and expanding enterprise client operations globally." },
        { id: "2", name: "P. Hemalatha", role: "Founder", initials: "PH", bio: "Co-established the firm’s legacy and structural framework, guiding the core ethics and long-term values." },
        { id: "3", name: "K.J. Rajendra Prasad", role: "Founder", initials: "KP", bio: "Guiding operations scale and expansion strategy with decades of deep supply chain management expertise." },
        { id: "4", name: "T. Sai Kiran", role: "Operations Head", initials: "SK", bio: "Managing daily logistics, dark store fulfillment networks, and last-mile SLAs across all operational cities." },
        { id: "5", name: "Mahendra", role: "HR Partner", initials: "M", bio: "Spearheading talent recruitment, specialized operations training, and workforce scaling strategies." },
        { id: "6", name: "Head MIS Executive", role: "Management Information Systems", initials: "ME", bio: "Managing data analytics architectures, cloud logistics databases, and operations metric reporting tools." }
    ];

    const getTeamMembers = () => {
        const stored = localStorage.getItem('kjr_team_members');
        if (stored) {
            return JSON.parse(stored);
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
            card.innerHTML = `
                <div class="team-avatar-wrapper">
                    <div class="team-avatar-placeholder">
                        <i data-lucide="user" class="avatar-fallback-icon"></i>
                        <span class="avatar-initials">${member.initials}</span>
                    </div>
                </div>
                <h3 class="team-name">${member.name}</h3>
                <div class="team-role">${member.role}</div>
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

    // Admin Console login logic
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('adminUsername').value.trim();
            const passwordInput = document.getElementById('adminPassword').value.trim();
            
            if (usernameInput === 'admin' && passwordInput === 'kjrsupply') {
                closeModal(adminModal);
                adminLoginForm.reset();
                if (loginErrorMsg) loginErrorMsg.style.display = 'none';
                openModal(consoleModal);
                renderConsoleList();
            } else {
                if (loginErrorMsg) loginErrorMsg.style.display = 'block';
            }
        });
    }

    // Admin Console Management Logic
    const consoleTeamList = document.getElementById('consoleTeamList');
    const consoleMemberForm = document.getElementById('consoleMemberForm');
    const btnConsoleAddNew = document.getElementById('btn-console-add-new');
    const btnConsoleCancel = document.getElementById('btn-console-cancel');
    const consoleFormTitle = document.getElementById('consoleFormTitle');

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

            let members = getTeamMembers();

            if (id) {
                // Edit existing member
                members = members.map(m => {
                    if (m.id === id) {
                        return { id, name, role, initials, bio };
                    }
                    return m;
                });
            } else {
                // Add new member
                const newMember = {
                    id: Date.now().toString(),
                    name,
                    role,
                    initials,
                    bio
                };
                members.push(newMember);
            }

            localStorage.setItem('kjr_team_members', JSON.stringify(members));
            renderConsoleList();
            renderTeamGrid(members);
            resetConsoleForm();
        });
    }


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
