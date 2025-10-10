+// script.js
+// Funções utilitárias para interações acessíveis e feedback do usuário.
+document.addEventListener('DOMContentLoaded', () => {
+    console.log('Site LIMA RPA SOLUTIONS carregado com sucesso!');
+
+    /* ------------------------------ Menu Mobile ------------------------------ */
+    const mobileMenuButton = document.getElementById('mobileMenuButton');
+    const mobileMenu = document.getElementById('mobileMenu');
+
+    if (mobileMenuButton && mobileMenu) {
+        const toggleMenuVisibility = () => {
+            const menuIsHidden = mobileMenu.classList.toggle('hidden');
+            const menuIsOpen = !menuIsHidden;
+
+            mobileMenuButton.setAttribute('aria-expanded', menuIsOpen.toString());
+            mobileMenuButton.setAttribute(
+                'aria-label',
+                menuIsOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
+            );
+        };
+
+        mobileMenuButton.addEventListener('click', toggleMenuVisibility);
+
+        mobileMenu.querySelectorAll('a').forEach(link => {
+            link.addEventListener('click', () => {
+                if (!mobileMenu.classList.contains('hidden')) {
+                    mobileMenu.classList.add('hidden');
+                    mobileMenuButton.setAttribute('aria-expanded', 'false');
+                    mobileMenuButton.setAttribute('aria-label', 'Abrir menu de navegação');
+                }
+            });
+        });
+    }
+
+    /* ------------------------- Envio do formulário -------------------------- */
+    const contactForm = document.getElementById('contactForm');
+    const submitBtn = document.getElementById('submitBtn');
+    const submitText = document.getElementById('submit-btn-text');
+    const submitSpinner = document.getElementById('submit-btn-spinner');
+    const successMessage = document.getElementById('form-success-message');
+    const errorMessage = document.getElementById('form-error-message');
+
+    const modalBackdrop = document.getElementById('customModal');
+    const modalMessage = document.getElementById('modalMessage');
+    const modalCloseBtn = document.getElementById('modalCloseBtn');
+    let lastFocusedElement = null;
+
+    const setButtonLoadingState = (isLoading) => {
+        if (!submitBtn || !submitText || !submitSpinner) return;
+        submitBtn.disabled = isLoading;
+        submitBtn.classList.toggle('opacity-70', isLoading);
+        submitSpinner.classList.toggle('hidden', !isLoading);
+        submitText.textContent = isLoading ? 'Enviando...' : 'Enviar Mensagem';
+    };
+
+    const resetFeedbackMessages = () => {
+        if (successMessage) {
+            successMessage.classList.add('hidden');
+            successMessage.textContent = '';
+        }
+        if (errorMessage) {
+            errorMessage.classList.add('hidden');
+            errorMessage.textContent = '';
+        }
+    };
+
+    const closeModal = () => {
+        if (!modalBackdrop) return;
+        modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
+        const modalContent = modalBackdrop.querySelector('.custom-modal-content');
+        if (modalContent) {
+            modalContent.classList.add('opacity-0', 'scale-95');
+        }
+        modalBackdrop.setAttribute('aria-hidden', 'true');
+        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
+            lastFocusedElement.focus();
+            lastFocusedElement = null;
+        }
+    };
+
+    const openModal = (message) => {
+        if (!modalBackdrop || !modalMessage) return;
+
+        lastFocusedElement = document.activeElement;
+        modalMessage.textContent = message;
+        modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
+        const modalContent = modalBackdrop.querySelector('.custom-modal-content');
+        if (modalContent) {
+            modalContent.classList.remove('opacity-0', 'scale-95');
+        }
+        modalBackdrop.removeAttribute('aria-hidden');
+        if (modalCloseBtn) {
+            modalCloseBtn.focus();
+        } else {
+            modalBackdrop.focus();
+        }
+    };
+
+    if (modalBackdrop) {
+        modalBackdrop.addEventListener('click', (event) => {
+            if (event.target === modalBackdrop) {
+                closeModal();
+            }
+        });
+    }
+
+    if (modalCloseBtn) {
+        modalCloseBtn.addEventListener('click', closeModal);
+    }
+
+    document.addEventListener('keydown', (event) => {
+        if (event.key === 'Escape') {
+            closeModal();
+        }
+    });
+
+    if (contactForm) {
+        contactForm.addEventListener('submit', async (event) => {
+            event.preventDefault();
+            resetFeedbackMessages();
+
+            if (!contactForm.checkValidity()) {
+                contactForm.reportValidity();
+                return;
+            }
+
+            setButtonLoadingState(true);
+
+            const formData = new FormData(contactForm);
+
+            try {
+                const response = await fetch(contactForm.action, {
+                    method: 'POST',
+                    headers: {
+                        Accept: 'application/json'
+                    },
+                    body: formData
+                });
+
+                if (!response.ok) {
+                    throw new Error(`Erro ao enviar formulário: ${response.status}`);
+                }
+
+                contactForm.reset();
+
+                if (successMessage) {
+                    successMessage.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
+                    successMessage.classList.remove('hidden');
+                }
+
+                openModal('Mensagem enviada com sucesso! Em breve nossa equipe retornará o contato.');
+            } catch (error) {
+                console.error(error);
+
+                if (errorMessage) {
+                    errorMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente em instantes.';
+                    errorMessage.classList.remove('hidden');
+                }
+            } finally {
+                setButtonLoadingState(false);
+            }
+        });
+    }
+
+    /* --------------------------- Métricas animadas --------------------------- */
+
+    const metricCards = document.querySelectorAll('.metric-card');
+
+    if (metricCards.length) {
+        const animateCount = (entry) => {
+            const numberEl = entry.target.querySelector('.metric-number');
+            const target = Number(entry.target.dataset.count || 0);
+            if (!numberEl || Number.isNaN(target)) {
+                return;
+            }
+
+            const duration = 1200;
+            const startTime = performance.now();
+
+            const update = (currentTime) => {
+                const elapsed = currentTime - startTime;
+                const progress = Math.min(elapsed / duration, 1);
+                const value = Math.floor(progress * target);
+                numberEl.textContent = value.toString();
+                if (progress < 1) {
+                    requestAnimationFrame(update);
+                }
+            };
+
+            requestAnimationFrame(update);
+        };
+
+        const observer = new IntersectionObserver((entries, obs) => {
+            entries.forEach(entry => {
+                if (entry.isIntersecting) {
+                    animateCount(entry);
+                    obs.unobserve(entry.target);
+                }
+            });
+        }, { threshold: 0.4 });
+
+        metricCards.forEach(card => observer.observe(card));
+    }
+
+    /* ----------------------------- Scroll suave ----------------------------- */
+
+    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
+        anchor.addEventListener('click', (event) => {
+            const targetId = anchor.getAttribute('href');
+            if (!targetId) {
+                return;
+            }
+
+            const isHashOnly = targetId === '#';
+            const isAnchor = targetId.startsWith('#') && targetId.length > 1;
+
+            if (!isHashOnly && !isAnchor) {
+                return;
+            }
+
+            const scrollTarget = isHashOnly ? document.body : document.querySelector(targetId);
+
+            if (scrollTarget) {
+                event.preventDefault();
+                scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
+            }
+        });
+    });
+});
